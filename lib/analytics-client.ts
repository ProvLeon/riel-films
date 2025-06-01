import { AnalyticsEventType, ContentType } from '@/types/analytics';
import { v4 as uuidv4 } from 'uuid';

// Constants
const STORAGE_KEYS = {
  VISITOR_ID: 'riel_visitor_id',
  SESSION_ID: 'riel_session_id',
  SESSION_START: 'riel_session_start',
  LAST_ACTIVITY: 'riel_last_activity'
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const HEARTBEAT_INTERVAL = 60 * 1000; // 1 minute
let heartbeatTimer: NodeJS.Timeout | null = null;
let scrollDepthTracked = 0;
let sessionStartTime = 0;
let initialized = false;
let excludeTracking = false;
let visitorId: string | null = null; // Store IDs in memory for quick access
let sessionId: string | null = null;

// Initialize analytics - ENSURE THIS RUNS EARLY and ONCE per actual page load/refresh
export function initializeAnalytics(): void {
  // Prevent running on server or multiple times
  if (typeof window === 'undefined' || initialized) return;

  // Prevent tracking on admin routes
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  excludeTracking = isAdminRoute;
  if (excludeTracking) {
    console.debug('Analytics: Tracking disabled for admin/excluded routes');
    return;
  }

  console.debug('Analytics: Initializing...'); // Debug log
  initialized = true;

  // Get or create visitor ID
  visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
    console.debug('Analytics: New visitor ID created:', visitorId);
  }

  // Session management
  const lastActivityStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  const sessionStartStr = localStorage.getItem(STORAGE_KEYS.SESSION_START);
  const storedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const currentTime = Date.now();

  const needsNewSession = !lastActivityStr ||
    !sessionStartStr ||
    !storedSessionId || // Check if session ID exists too
    (currentTime - parseInt(lastActivityStr, 10)) > SESSION_TIMEOUT;

  if (needsNewSession) {
    sessionId = uuidv4();
    sessionStartTime = currentTime;
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    localStorage.setItem(STORAGE_KEYS.SESSION_START, sessionStartTime.toString());
    console.debug('Analytics: New session started:', sessionId);
    trackEvent('other', 'session_start'); // Track session start immediately
  } else {
    sessionId = storedSessionId;
    sessionStartTime = parseInt(sessionStartStr, 10);
    console.debug('Analytics: Existing session continued:', sessionId);
  }
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, currentTime.toString());


  // Attach scroll tracking
  setupScrollTracking();
  // Start heartbeat
  startHeartbeat();
  // Track exit intent
  setupExitTracking();
}

// Set up scroll depth tracking (Keep implementation)
function setupScrollTracking(): void {
  if (typeof window === 'undefined' || excludeTracking) return;
  scrollDepthTracked = 0; // Reset on new init/page load

  const trackScroll = () => { /* ... implementation ... */ };
  let scrollTimeout: NodeJS.Timeout | null = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScroll, 200);
  }, { passive: true });
}


// Start heartbeat for session maintenance (Keep implementation)
function startHeartbeat(): void {
  if (typeof window === 'undefined' || excludeTracking) return;
  if (heartbeatTimer) clearInterval(heartbeatTimer);

  heartbeatTimer = setInterval(() => {
    if (excludeTracking) { // Double check in interval
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      return;
    }
    const currentTime = Date.now();
    const lastActivity = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || '0', 10);

    if (currentTime - lastActivity > SESSION_TIMEOUT) {
      console.debug("Analytics: Session timed out, reinitializing.");
      if (heartbeatTimer) clearInterval(heartbeatTimer); // Stop old timer
      initialized = false; // Allow re-initialization
      initializeAnalytics();
    } else {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, currentTime.toString());
      // --- FIX: Add visitorId and sessionId to the heartbeat payload ---
      sendAnalyticsEvent({
        pageUrl: window.location.href,
        pageType: getPageTypeFromUrl(window.location.pathname),
        event: 'heartbeat',
        visitorId: visitorId,   // <<< ADDED
        sessionId: sessionId,   // <<< ADDED
        timeOnPage: Math.round((currentTime - sessionStartTime) / 1000)
      });
      // --- End Fix ---
    }
  }, HEARTBEAT_INTERVAL);
}


// Setup tracking for when user exits the page (Keep implementation)
function setupExitTracking(): void {
  if (typeof window === 'undefined' || excludeTracking) return;

  window.addEventListener('beforeunload', () => {
    if (excludeTracking) return; // Check exclusion before sending
    /* ... sendBeacon logic ... */
    const currentTime = Date.now();
    const timeOnSite = Math.round((currentTime - (sessionStartTime || Date.now())) / 1000); // Use current time if sessionStart is 0

    const payload = {
      pageUrl: window.location.href,
      pageType: getPageTypeFromUrl(window.location.pathname),
      event: 'engagement' as AnalyticsEventType, // Consider a specific 'session_end' or 'page_exit' event
      visitorId: visitorId, // Use in-memory variable
      sessionId: sessionId, // Use in-memory variable
      timeOnPage: timeOnSite,
      scrollDepth: scrollDepthTracked,
      referrer: document.referrer
    };

    // Only send if IDs are available
    if (payload.visitorId && payload.sessionId) {
      try {
        // Use sendBeacon if available
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics', blob);
        } else {
          // Fallback using fetch (less reliable on unload)
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true // Important for unload events
          }).catch(err => console.error("Fetch fallback on unload failed:", err));
        }
      } catch (e) {
        console.error("Error sending analytics on unload:", e);
      }
    } else {
      console.warn("Cannot send exit event: Missing visitorId or sessionId.");
    }
  });
}


// Get page type from URL (Keep implementation)
function getPageTypeFromUrl(url: string): ContentType { /* ... */
  if (url.startsWith('/admin')) return 'admin';
  if (url.startsWith('/films/')) return 'film';
  if (url.startsWith('/productions/')) return 'production';
  if (url.startsWith('/stories/')) return 'story';
  if (url === '/' || url.startsWith('/?')) return 'home';
  if (url.startsWith('/about')) return 'about';
  return 'other';
}

// Track page view
export function trackPageView(pageType: ContentType, itemId?: string): void {
  if (excludeTracking || typeof window === 'undefined') return;
  console.debug(`Track PageView: ${pageType}`, itemId || ''); // Debug log

  // Ensure initialization has happened and IDs are available
  if (!initialized || !visitorId || !sessionId) {
    console.warn('Analytics not initialized or missing IDs for page view, attempting init...');
    initializeAnalytics(); // Try to initialize again
    // Re-check after init attempt
    if (!visitorId || !sessionId) {
      console.error('Failed to initialize analytics for page view tracking.');
      return;
    }
  }

  const screenData = { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio };
  trackEvent(pageType, 'view', itemId, { screenData });
  scrollDepthTracked = 0; // Reset scroll depth for the new page view
}

// Track events
export function trackEvent(
  pageType: ContentType,
  event: AnalyticsEventType,
  itemId?: string,
  extraData: Record<string, any> = {}
): void {
  if (excludeTracking || typeof window === 'undefined') return;
  console.debug(`Track Event: ${event} on ${pageType}`, itemId || '', extraData); // Debug log

  // Ensure initialization and IDs
  if (!initialized || !visitorId || !sessionId) {
    console.warn('Analytics not initialized or missing IDs for event tracking, attempting init...');
    initializeAnalytics();
    if (!visitorId || !sessionId) {
      console.error('Failed to initialize analytics for event tracking.');
      return;
    }
  }

  // Update last activity time for session management
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());


  const payload = {
    pageUrl: window.location.href,
    pageType,
    itemId,
    event,
    referrer: document.referrer,
    visitorId, // Use in-memory variable
    sessionId, // Use in-memory variable
    timeOnPage: sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 1000) : undefined, // Calculate time since session start
    scrollDepth: event === 'view' ? 0 : scrollDepthTracked, // Record current depth for non-view events
    ...extraData
  };

  sendAnalyticsEvent(payload);
}

// Send analytics event to server
async function sendAnalyticsEvent(payload: any): Promise<void> {
  if (excludeTracking || typeof window === 'undefined') return;

  // *Crucial Check:* Ensure IDs are present before sending
  if (!payload.visitorId || !payload.sessionId) {
    console.error('Attempted to send analytics event without visitorId or sessionId:', payload);
    // Optionally add more debug info here:
    // console.log('Current state:', { initialized, visitorId, sessionId });
    return; // Do not send incomplete data
  }

  console.debug('Sending Analytics Event:', payload); // Debug log

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true // Keep true for potential use in other places like beforeunload
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}

// Enhanced tracking for content interaction (Keep implementation)
export function trackContentInteraction(
  contentType: ContentType,
  action: 'view' | 'click' | 'share' | 'play' | 'complete',
  content: { id: string; title: string; category?: string },
  details: Record<string, any> = {}
): void {
  if (excludeTracking) return;
  trackEvent(contentType, action as AnalyticsEventType, content.id, {
    contentTitle: content.title,
    contentCategory: content.category,
    ...details
  });
}

// Get current session info (Keep implementation)
export function getSessionInfo(): { visitorId: string | null, sessionId: string | null } {
  if (typeof window === 'undefined') return { visitorId: null, sessionId: null };
  return {
    visitorId: localStorage.getItem(STORAGE_KEYS.VISITOR_ID),
    sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  };
}
