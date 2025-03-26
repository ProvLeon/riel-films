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

// Initialize analytics
export function initializeAnalytics(): void {
  if (initialized) return;
  initialized = true;

  // Don't track if in admin section
  if (typeof window !== 'undefined') {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    excludeTracking = isAdminRoute;

    if (excludeTracking) {
      console.debug('Analytics: Tracking disabled for admin routes');
      return;
    }

    // Get or create visitor ID (persists across sessions)
    let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
    }

    // Check if we need a new session
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    const sessionStart = localStorage.getItem(STORAGE_KEYS.SESSION_START);
    const currentTime = Date.now();

    const needsNewSession = !lastActivity ||
      !sessionStart ||
      (currentTime - parseInt(lastActivity, 10)) > SESSION_TIMEOUT;

    if (needsNewSession) {
      const sessionId = uuidv4();
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
      localStorage.setItem(STORAGE_KEYS.SESSION_START, currentTime.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, currentTime.toString());
      sessionStartTime = currentTime;

      // Track session start
      trackEvent('other', 'session_start');
    } else {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, currentTime.toString());
      sessionStartTime = parseInt(sessionStart, 10);
    }

    // Attach scroll tracking
    setupScrollTracking();

    // Start heartbeat for session maintenance
    startHeartbeat();

    // Track session data when user leaves
    setupExitTracking();
  }
}

// Set up scroll depth tracking
function setupScrollTracking(): void {
  if (typeof window === 'undefined' || excludeTracking) return;

  const trackScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollPercentage = Math.floor((scrollTop / scrollHeight) * 100);

    // Track when user scrolls past certain thresholds (25%, 50%, 75%, 100%)
    const thresholds = [25, 50, 75, 100];
    thresholds.forEach(threshold => {
      if (scrollPercentage >= threshold && scrollDepthTracked < threshold) {
        scrollDepthTracked = threshold;
        trackEvent('other', 'engagement', undefined, { scrollDepth: threshold });
      }
    });
  };

  // Throttle scroll events for performance
  let scrollTimeout: NodeJS.Timeout | null = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScroll, 200);
  });
}

// Start heartbeat for session maintenance
function startHeartbeat(): void {
  if (typeof window === 'undefined' || excludeTracking) return;

  if (heartbeatTimer) clearInterval(heartbeatTimer);

  heartbeatTimer = setInterval(() => {
    const currentTime = Date.now();
    const lastActivity = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || '0', 10);

    // If user has been inactive for too long, restart session
    if (currentTime - lastActivity > SESSION_TIMEOUT) {
      initializeAnalytics(); // Reinitialize session
    } else {
      // Update last activity time
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, currentTime.toString());

      // Send heartbeat event
      sendAnalyticsEvent({
        pageUrl: window.location.href,
        pageType: getPageTypeFromUrl(window.location.pathname),
        event: 'heartbeat',
        timeOnPage: Math.round((currentTime - sessionStartTime) / 1000)
      });
    }
  }, HEARTBEAT_INTERVAL);
}

// Setup tracking for when user exits the page
function setupExitTracking(): void {
  if (typeof window === 'undefined' || excludeTracking) return;

  // Track final engagement when user leaves the page
  window.addEventListener('beforeunload', () => {
    const currentTime = Date.now();
    const timeOnSite = Math.round((currentTime - sessionStartTime) / 1000);

    // Use sendBeacon for more reliable delivery during page unload
    if (navigator.sendBeacon) {
      const data = {
        pageUrl: window.location.href,
        pageType: getPageTypeFromUrl(window.location.pathname),
        event: 'engagement' as AnalyticsEventType,
        visitorId: localStorage.getItem(STORAGE_KEYS.VISITOR_ID),
        sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID),
        timeOnPage: timeOnSite,
        scrollDepth: scrollDepthTracked,
        referrer: document.referrer
      };

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    } else {
      // Fallback if sendBeacon is not available
      trackEvent('other', 'engagement', undefined, {
        timeOnPage: timeOnSite,
        scrollDepth: scrollDepthTracked
      });
    }
  });
}

// Get page type from URL
function getPageTypeFromUrl(url: string): ContentType {
  if (url.startsWith('/admin')) return 'admin';
  if (url.startsWith('/films')) return 'film';
  if (url.startsWith('/productions')) return 'production';
  if (url.startsWith('/stories')) return 'story';
  if (url === '/' || url.startsWith('/?')) return 'home';
  if (url.startsWith('/about')) return 'about';
  return 'other';
}

// Track page view
export function trackPageView(pageType: ContentType, itemId?: string): void {
  if (excludeTracking) return;

  // Get screen dimensions and device info for analytics
  const screenData = typeof window !== 'undefined' ? {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio
  } : undefined;

  trackEvent(pageType, 'view', itemId, { screenData });
}

// Track events
export function trackEvent(
  pageType: ContentType,
  event: AnalyticsEventType,
  itemId?: string,
  extraData: Record<string, any> = {}
): void {
  if (excludeTracking) return;

  if (typeof window === 'undefined') return;

  const visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

  if (!visitorId || !sessionId) {
    initializeAnalytics();
    return;
  }

  const payload = {
    pageUrl: window.location.href,
    pageType,
    itemId,
    event,
    referrer: document.referrer,
    visitorId,
    sessionId,
    ...extraData
  };

  sendAnalyticsEvent(payload);
}

// Send analytics event to server
async function sendAnalyticsEvent(payload: any): Promise<void> {
  if (excludeTracking) return;

  try {
    // Use fetch with keepalive for better reliability
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}

// Enhanced tracking for content interaction
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

// Get current session info (useful for components that need this)
export function getSessionInfo(): { visitorId: string | null, sessionId: string | null } {
  if (typeof window === 'undefined') {
    return { visitorId: null, sessionId: null };
  }

  return {
    visitorId: localStorage.getItem(STORAGE_KEYS.VISITOR_ID),
    sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  };
}
