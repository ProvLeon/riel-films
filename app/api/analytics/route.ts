import { prisma, prismaAccelerate } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { ContentType, AnalyticsEventType, DailyStats, TopContent } from '@/types/analytics'; // Import types

// Helper function to check if a string is a valid MongoDB ObjectID
function isValidObjectId(id: string): boolean {
  if (!id) return false; // Handle null or undefined cases
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

// --- Helper Functions (Keep getTopContent, fillMissingDays, enhanceAnalyticsData, calculateMovingAverages, calculateTrends, calculateGrowthRate, determineTrend, calculateDailyEngagementMetrics as previously defined) ---
// ... (Include the full implementations of these helper functions from the previous response) ...

// Track event
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      pageUrl, pageType = 'other', itemId, event, referrer,
      visitorId, sessionId, scrollDepth, timeOnPage, screenData,
      ...extraData
    } = data;

    const db = prismaAccelerate || prisma; // Use accelerated client if available

    // **Crucial Validation: Ensure visitorId and sessionId exist**
    if (!visitorId || !sessionId) {
      console.warn(`Analytics POST: Missing visitorId (${visitorId}) or sessionId (${sessionId}) for event: ${event} on ${pageUrl}`);
      // Return 400 Bad Request as these are essential for tracking
      return NextResponse.json({ error: "Missing session identifiers" }, { status: 400 });
    }
    if (!pageUrl || !event) {
      console.warn("Analytics POST: Missing pageUrl or event");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    // Get IP and User Agent
    const forwardedFor = req.headers.get('x-forwarded-for') || req.ip || '0.0.0.0'; // Added req.ip as fallback
    const ip = forwardedFor.split(',')[0].trim();
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const userAgent = req.headers.get('user-agent') || '';
    const uaParser = new UAParser(userAgent);
    const browser = uaParser.getBrowser();
    const device = uaParser.getDevice();
    const os = uaParser.getOS();

    let isNewUser = false;
    let viewsToday = null;
    let visitorRecord = null;

    // Manage visitor record (wrapped in try...catch)
    try {
      visitorRecord = await db.visitor.findUnique({ where: { visitorId } });
      if (!visitorRecord) {
        isNewUser = true;
        visitorRecord = await db.visitor.create({
          data: {
            visitorId, firstSeen: new Date(), lastSeen: new Date(),
            browser: browser.name, device: device.type || 'desktop', os: os.name, country: 'Unknown', // Geolocation needs separate service
          }
        });
      } else {
        await db.visitor.update({
          where: { visitorId },
          data: {
            lastSeen: new Date(),
            totalVisits: event === 'session_start' ? { increment: 1 } : undefined,
            totalSessions: event === 'session_start' ? { increment: 1 } : undefined,
          }
        });
      }
    } catch (visitorError) {
      console.error("Error managing visitor record:", visitorError);
    }

    // Check for unique view today
    if (event === 'view') {
      try {
        viewsToday = await db.analytics.findFirst({
          where: {
            visitorId, event: 'view',
            timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            pageUrl: pageUrl // Check uniqueness per page per day
          }
        });
      } catch (dbError) {
        console.error("Error checking views today:", dbError);
      }
    }

    // Create analytics entry
    try {
      await db.analytics.create({
        data: {
          pageUrl, pageType, itemId, event, referrer, userAgent, ipHash, sessionId, visitorId, isNewUser,
          scrollDepth: scrollDepth !== undefined ? Math.round(scrollDepth) : null,
          timeOnPage: timeOnPage !== undefined ? Math.round(timeOnPage) : null,
          screenData: screenData || {}, extraData: extraData || {}
        },
      });
    } catch (analyticsError) {
      console.error("Error creating analytics entry:", analyticsError);
    }

    // Update daily stats
    try {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const isUniqueView = event === 'view' && !viewsToday;

      // Build the update payload (using increment)
      const updatePayload: any = {};
      if (event === 'view') updatePayload.pageViews = { increment: 1 };
      if (isUniqueView) {
        updatePayload.uniqueVisitors = { increment: 1 };
        if (isNewUser) updatePayload.newVisitors = { increment: 1 };
        else updatePayload.returningVisitors = { increment: 1 };
      }
      if (pageType === 'film' && event === 'view') updatePayload.filmViews = { increment: 1 };
      if (pageType === 'story' && event === 'view') updatePayload.storyViews = { increment: 1 };
      if (pageType === 'production' && event === 'view') updatePayload.productionViews = { increment: 1 };
      if (event !== 'view' && event !== 'heartbeat') updatePayload.engagements = { increment: 1 };

      // *Fix:* Build the create payload with initial integer values
      const createPayload: any = {
        date: today,
        pageViews: event === 'view' ? 1 : 0,
        uniqueVisitors: isUniqueView ? 1 : 0,
        newVisitors: isUniqueView && isNewUser ? 1 : 0,
        returningVisitors: isUniqueView && !isNewUser ? 1 : 0,
        filmViews: (pageType === 'film' && event === 'view') ? 1 : 0,
        storyViews: (pageType === 'story' && event === 'view') ? 1 : 0,
        productionViews: (pageType === 'production' && event === 'view') ? 1 : 0,
        engagements: (event !== 'view' && event !== 'heartbeat') ? 1 : 0,
        // Initialize other metrics which are calculated later
        bounceRate: 0,
        avgTimeOnSite: 0,
        avgEngagementScore: 0,
      };


      if (Object.keys(updatePayload).length > 0) {
        await db.dailyStats.upsert({
          where: { date: today },
          update: updatePayload, // Correct: Use increment for updates
          create: createPayload, // Correct: Use initial values for create
        });
      }

      // Trigger periodic metric calculation (less frequently)
      if (Math.random() < 0.05) {
        await calculateDailyEngagementMetrics(db, today);
      }

    } catch (statsError: any) {
      console.error("Error updating daily stats:", statsError);
      // Log the specific Prisma error code if available
      if (statsError.code) {
        console.error("Prisma Error Code:", statsError.code);
      }
      // If it's the specific error about the payload type
      if (statsError.message?.includes("Expected Int, provided Object")) {
        console.error("Payload Mismatch Error: Check create vs update data structure in upsert.");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Global error in analytics POST:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to track analytics", message: error.message }, { status: 500 });
  }
}


// --- Calculate Engagement Metrics (Refined - Keep implementation) ---
async function calculateDailyEngagementMetrics(db: PrismaClient, today: Date) {
  // ... (implementation from previous response) ...
  try {
    // Check if calculated recently (e.g., last 15 mins)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const lastCalc = await db.analytics.findFirst({
      where: { event: 'metrics_calculation', timestamp: { gte: fifteenMinutesAgo } }
    });
    if (lastCalc) return; // Skip if calculated recently

    // Log calculation start
    await db.analytics.create({ data: { pageUrl: '', pageType: 'system', event: 'metrics_calculation' } });

    // Fetch relevant analytics events for today
    const todaysEvents = await db.analytics.findMany({
      where: { timestamp: { gte: today } },
      select: { sessionId: true, event: true, timeOnPage: true, scrollDepth: true, timestamp: true }
    });

    if (todaysEvents.length === 0) return;

    // Group events by session
    const sessions: Record<string, any[]> = {};
    todaysEvents.forEach(event => {
      if (event.sessionId) {
        if (!sessions[event.sessionId]) sessions[event.sessionId] = [];
        sessions[event.sessionId].push(event);
      }
    });

    const sessionIds = Object.keys(sessions);
    const totalSessions = sessionIds.length;
    let bounceSessions = 0;
    let totalTimeOnSite = 0;
    let engagedSessions = 0; // Sessions with more than 1 page view or significant time/scroll
    let totalScrollDepth = 0;
    let scrollDepthCount = 0;

    sessionIds.forEach(sessionId => {
      const sessionEvents = sessions[sessionId].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const pageViews = sessionEvents.filter(e => e.event === 'view').length;
      const sessionDuration = (sessionEvents[sessionEvents.length - 1].timestamp.getTime() - sessionEvents[0].timestamp.getTime()) / 1000; // in seconds
      const maxScroll = Math.max(0, ...sessionEvents.map(e => e.scrollDepth || 0));

      if (pageViews === 1 && sessionDuration < 10) { // Basic bounce definition (adjust as needed)
        bounceSessions++;
      } else {
        engagedSessions++;
      }

      totalTimeOnSite += sessionDuration;
      if (maxScroll > 0) {
        totalScrollDepth += maxScroll;
        scrollDepthCount++;
      }
    });

    const bounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0;
    const avgTimeOnSite = totalSessions > 0 ? totalTimeOnSite / totalSessions : 0;
    // Engagement score could be more complex, this is a basic version
    const avgEngagementScore = totalSessions > 0 ? (engagedSessions / totalSessions) * 100 : 0;
    const avgScroll = scrollDepthCount > 0 ? totalScrollDepth / scrollDepthCount : 0;

    // Update daily stats only if the record exists (created by the main POST handler)
    const existingStat = await db.dailyStats.findUnique({ where: { date: today } });
    if (existingStat) {
      await db.dailyStats.update({
        where: { date: today },
        data: {
          bounceRate: parseFloat(bounceRate.toFixed(2)),
          avgTimeOnSite: parseFloat(avgTimeOnSite.toFixed(2)),
          avgEngagementScore: parseFloat(avgEngagementScore.toFixed(2))
        }
      });
    } else {
      console.warn(`Daily stat record for ${today.toISOString().split('T')[0]} not found during metrics calculation.`);
    }


  } catch (error) {
    console.error("Error calculating engagement metrics:", error);
  }
}

// --- Get Top Content (Refined - Keep implementation) ---
async function getTopContent(db: PrismaClient, startDate: Date, endDate: Date, type?: ContentType): Promise<TopContent[]> {
  // ... (implementation from previous response) ...
  try {
    const analytics = await db.analytics.findMany({
      where: {
        timestamp: { gte: startDate, lte: endDate },
        event: 'view',
        pageType: type || { in: ['film', 'story', 'production'] }, // Filter by type if provided
        itemId: { not: null },
      },
      select: { itemId: true, pageType: true, extraData: true }, // Select extraData for title fallback
      take: 5000, // Limit query size
    });

    const countMap = new Map<string, { count: number; pageType: ContentType; title?: string }>();
    analytics.forEach(record => {
      if (!record.itemId) return;
      const key = `${record.itemId}-${record.pageType}`;
      const existing = countMap.get(key) || { count: 0, pageType: record.pageType as ContentType, title: record.extraData?.contentTitle };
      countMap.set(key, { ...existing, count: existing.count + 1 });
    });

    const topItems = Array.from(countMap.entries())
      .map(([key, value]) => ({
        itemId: key.split('-')[0],
        pageType: value.pageType,
        count: value.count,
        title: value.title // Use title from analytics if available
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Fetch details only if title wasn't already in analytics data
    const contentDetails = await Promise.all(
      topItems.map(async (item) => {
        if (item.title) { // Title already available
          // Attempt to get slug anyway for linking
          try {
            let slug;
            if (item.pageType === 'film' && isValidObjectId(item.itemId)) slug = (await db.film.findUnique({ where: { id: item.itemId }, select: { slug: true } }))?.slug;
            else if (item.pageType === 'story' && isValidObjectId(item.itemId)) slug = (await db.story.findUnique({ where: { id: item.itemId }, select: { slug: true } }))?.slug;
            else if (item.pageType === 'production' && isValidObjectId(item.itemId)) slug = (await db.production.findUnique({ where: { id: item.itemId }, select: { slug: true } }))?.slug;
            return { ...item, slug };
          } catch { return item; } // Ignore slug fetch error
        }

        // Fetch title and slug if not present
        try {
          let content;
          if (item.pageType === 'film' && isValidObjectId(item.itemId)) content = await db.film.findUnique({ where: { id: item.itemId }, select: { title: true, slug: true } });
          else if (item.pageType === 'story' && isValidObjectId(item.itemId)) content = await db.story.findUnique({ where: { id: item.itemId }, select: { title: true, slug: true } });
          else if (item.pageType === 'production' && isValidObjectId(item.itemId)) content = await db.production.findUnique({ where: { id: item.itemId }, select: { title: true, slug: true } });
          return { ...item, title: content?.title || 'Unknown Content', slug: content?.slug };
        } catch (err) {
          console.error(`Error fetching details for ${item.pageType} ID ${item.itemId}:`, err);
          return { ...item, title: 'Content Not Found', slug: undefined };
        }
      })
    );
    return contentDetails;
  } catch (error) {
    console.error("Error in getTopContent:", error);
    return [];
  }
}

// --- Fill Missing Days (Refined - Keep implementation) ---
function fillMissingDays(startDate: Date, endDate: Date, existingData: DailyStats[]): DailyStats[] {
  // ... (implementation from previous response) ...
  const filledData: DailyStats[] = [];
  const dataMap = new Map(existingData.map(item => [item.date.toISOString().split('T')[0], item]));
  let currentDate = new Date(startDate); currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = dataMap.get(dateStr) || {
      date: new Date(currentDate), pageViews: 0, uniqueVisitors: 0, newVisitors: 0,
      returningVisitors: 0, filmViews: 0, storyViews: 0, productionViews: 0,
      engagements: 0, bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0
    };
    // Ensure date is a Date object
    filledData.push({ ...dayData, date: new Date(dayData.date) });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return filledData;
}

// --- Enhance Analytics Data (Refined - Keep implementation) ---
function enhanceAnalyticsData(dailyStats: DailyStats[]) {
  // ... (implementation from previous response) ...
  if (!dailyStats || dailyStats.length === 0) return { dailyStats, trends: {} };

  // Calculate Moving Averages first
  const statsWithMovingAvg = calculateMovingAverages(dailyStats);

  // Calculate Trends
  const trends = calculateTrends(statsWithMovingAvg); // Assuming calculateTrends exists and returns structured trend data

  return { dailyStats: statsWithMovingAvg, trends };
}

// --- Calculate Moving Averages (Refined - Keep implementation) ---
function calculateMovingAverages(dailyStats: DailyStats[], windowSize: number = 7): DailyStats[] {
  // ... (implementation from previous response) ...
  if (dailyStats.length < windowSize) return dailyStats.map(d => ({ ...d, movingAvgPageViews: d.pageViews, movingAvgVisitors: d.uniqueVisitors }));

  return dailyStats.map((day, index, array) => {
    const start = Math.max(0, index - windowSize + 1);
    const end = index + 1;
    const window = array.slice(start, end);

    const pageViewsSum = window.reduce((sum, d) => sum + (d.pageViews || 0), 0);
    const visitorsSum = window.reduce((sum, d) => sum + (d.uniqueVisitors || 0), 0);

    return {
      ...day,
      movingAvgPageViews: parseFloat((pageViewsSum / window.length).toFixed(2)),
      movingAvgVisitors: parseFloat((visitorsSum / window.length).toFixed(2))
    };
  });
}

// --- Calculate Trends (Keep implementation) ---
function calculateTrends(dailyStats: DailyStats[]) {
  // ... (implementation from previous response) ...
  if (dailyStats.length < 2) return { /* default empty trends */ };

  const totalDays = dailyStats.length;
  const midPoint = Math.floor(totalDays / 2);
  const firstHalf = dailyStats.slice(0, midPoint);
  const secondHalf = dailyStats.slice(midPoint);

  const calcAvg = (arr: DailyStats[], key: keyof DailyStats) => arr.length > 0 ? arr.reduce((sum, day) => sum + (Number(day[key]) || 0), 0) / arr.length : 0;
  const calcSum = (arr: DailyStats[], key: keyof DailyStats) => arr.reduce((sum, day) => sum + (Number(day[key]) || 0), 0);

  const pvGrowth = calculateGrowthRate(calcAvg(firstHalf, 'pageViews'), calcAvg(secondHalf, 'pageViews'));
  const uvGrowth = calculateGrowthRate(calcAvg(firstHalf, 'uniqueVisitors'), calcAvg(secondHalf, 'uniqueVisitors'));
  const engagementGrowth = calculateGrowthRate(calcAvg(firstHalf, 'avgEngagementScore'), calcAvg(secondHalf, 'avgEngagementScore'));

  return {
    pageViews: { growth: pvGrowth, trend: determineTrend(pvGrowth) },
    uniqueVisitors: { growth: uvGrowth, trend: determineTrend(uvGrowth) },
    engagement: { growth: engagementGrowth, trend: determineTrend(engagementGrowth) },
    // ... add more trend calculations
  };
}

// --- Growth Rate & Trend Helpers (Keep implementations) ---
function calculateGrowthRate(prev: number, curr: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return parseFloat((((curr - prev) / prev) * 100).toFixed(2));
}
function determineTrend(rate: number): "up" | "down" | "stable" {
  if (rate > 5) return "up";
  if (rate < -5) return "down";
  return "stable";
}

// --- GET Analytics Route Handler (Refined - Keep implementation) ---
export async function GET(req: NextRequest) {
  // ... (implementation from previous response) ...
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days")) || 30;
    const type = searchParams.get("type") as ContentType | undefined;

    const endDate = new Date();
    const startDate = new Date(); startDate.setDate(endDate.getDate() - days + 1); // +1 to include start day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const db = prismaAccelerate || prisma;

    // Fetch daily stats
    const rawDailyStats = await db.dailyStats.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      orderBy: { date: "asc" },
    });

    // Ensure dates are Date objects before filling
    const processedStats = rawDailyStats.map(stat => ({ ...stat, date: new Date(stat.date) }));
    const filledDailyStats = fillMissingDays(startDate, endDate, processedStats);

    // Fetch top content
    const topContent = await getTopContent(db, startDate, endDate, type);

    // Enhance stats with trends and moving averages
    const { dailyStats: finalDailyStats, trends } = enhanceAnalyticsData(filledDailyStats);

    return NextResponse.json({ dailyStats: finalDailyStats, topContent, trends });

  } catch (error: any) {
    console.error("Error fetching analytics:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to fetch analytics", message: error.message }, { status: 500 });
  }
}
