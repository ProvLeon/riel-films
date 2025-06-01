import { prisma, prismaAccelerate } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { ContentType, AnalyticsEventType, DailyStats, TopContent } from '@/types/analytics';

// --- Helpers (Keep isValidObjectId, getTopContent, fillMissingDays, enhanceAnalyticsData, calculateMovingAverages, calculateTrends, calculateGrowthRate, determineTrend) ---
function isValidObjectId(id: string): boolean {
  if (!id) return false;
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}
function fillMissingDays(startDate: Date, endDate: Date, existingData: DailyStats[]): DailyStats[] {
  const filledData: DailyStats[] = [];
  const dataMap = new Map(existingData.map(item => [new Date(item.date).toISOString().split('T')[0], item])); // Ensure date key is correct format
  let currentDate = new Date(startDate); currentDate.setHours(0, 0, 0, 0);
  const end = new Date(endDate); end.setHours(0, 0, 0, 0); // Normalize end date

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = dataMap.get(dateStr) || {
      date: new Date(currentDate).toISOString(), // Store as ISO string matching DB
      pageViews: 0, uniqueVisitors: 0, newVisitors: 0,
      returningVisitors: 0, filmViews: 0, storyViews: 0, productionViews: 0,
      engagements: 0, bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0
    };
    // Ensure date is a Date object when pushing
    filledData.push({ ...dayData, date: new Date(dayData.date) });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return filledData;
}
function calculateMovingAverages(dailyStats: DailyStats[], windowSize: number = 7): DailyStats[] {
  if (dailyStats.length < windowSize) return dailyStats.map(d => ({ ...d, movingAvgPageViews: d.pageViews, movingAvgVisitors: d.uniqueVisitors }));

  return dailyStats.map((day, index, array) => {
    const start = Math.max(0, index - windowSize + 1);
    const end = index + 1;
    const window = array.slice(start, end);

    const pageViewsSum = window.reduce((sum, d) => sum + (Number(d.pageViews) || 0), 0);
    const visitorsSum = window.reduce((sum, d) => sum + (Number(d.uniqueVisitors) || 0), 0);

    return {
      ...day,
      movingAvgPageViews: parseFloat((pageViewsSum / window.length).toFixed(2)),
      movingAvgVisitors: parseFloat((visitorsSum / window.length).toFixed(2))
    };
  });
}
function calculateGrowthRate(prev: number, curr: number): number {
  if (prev === 0 && curr === 0) return 0; // Avoid division by zero or 100% for 0 to 0
  if (prev === 0) return 100; // Infinite growth represented as 100%
  return parseFloat((((curr - prev) / prev) * 100).toFixed(2));
}
function determineTrend(rate: number): "up" | "down" | "stable" {
  if (rate > 5) return "up";
  if (rate < -5) return "down";
  return "stable";
}
function calculateTrends(dailyStats: DailyStats[]) {
  if (dailyStats.length < 2) return {
    pageViews: { growth: 0, trend: "stable" },
    uniqueVisitors: { growth: 0, trend: "stable" },
    engagement: { growth: 0, trend: "stable" },
    bounceRate: { growth: 0, trend: "stable" },
  };

  const totalDays = dailyStats.length;
  const midPoint = Math.floor(totalDays / 2);
  const firstHalf = dailyStats.slice(0, midPoint);
  const secondHalf = dailyStats.slice(midPoint);

  const calcAvg = (arr: DailyStats[], key: keyof DailyStats) => arr.length > 0 ? arr.reduce((sum, day) => sum + (Number(day[key]) || 0), 0) / arr.length : 0;

  const pvGrowth = calculateGrowthRate(calcAvg(firstHalf, 'pageViews'), calcAvg(secondHalf, 'pageViews'));
  const uvGrowth = calculateGrowthRate(calcAvg(firstHalf, 'uniqueVisitors'), calcAvg(secondHalf, 'uniqueVisitors'));
  const engagementGrowth = calculateGrowthRate(calcAvg(firstHalf, 'avgEngagementScore'), calcAvg(secondHalf, 'avgEngagementScore'));
  // Note: Lower bounce rate is better, so invert growth calculation logic if needed, or just report the trend direction based on raw change.
  const bounceGrowth = calculateGrowthRate(calcAvg(firstHalf, 'bounceRate'), calcAvg(secondHalf, 'bounceRate'));

  return {
    pageViews: { growth: pvGrowth, trend: determineTrend(pvGrowth) },
    uniqueVisitors: { growth: uvGrowth, trend: determineTrend(uvGrowth) },
    engagement: { growth: engagementGrowth, trend: determineTrend(engagementGrowth) },
    bounceRate: { growth: bounceGrowth, trend: determineTrend(bounceGrowth * -1) }, // Trend direction inverted for bounce rate
  };
}
function enhanceAnalyticsData(dailyStats: DailyStats[]) {
  if (!dailyStats || dailyStats.length === 0) return { dailyStats, trends: {} };
  const statsWithMovingAvg = calculateMovingAverages(dailyStats);
  const trends = calculateTrends(statsWithMovingAvg);
  return { dailyStats: statsWithMovingAvg, trends };
}
async function getTopContent(db: PrismaClient, startDate: Date, endDate: Date, type?: ContentType): Promise<TopContent[]> {
  try {
    const analytics = await db.analytics.findMany({
      where: {
        timestamp: { gte: startDate, lte: endDate },
        event: 'view',
        pageType: type || { in: ['film', 'story', 'production'] },
        itemId: { not: null },
        pageUrl: { not: '/admin' } // Exclude admin views potentially?
      },
      select: { itemId: true, pageType: true, extraData: true },
      take: 10000, // Increased limit slightly
    });

    const countMap = new Map<string, { count: number; pageType: ContentType; title?: string }>();
    analytics.forEach(record => {
      if (!record.itemId || !record.pageType) return;
      const key = `${record.itemId}-${record.pageType}`;
      // Ensure extraData and contentTitle exist before accessing
      const titleFromExtra = typeof record.extraData === 'object' && record.extraData !== null && 'contentTitle' in record.extraData ? record.extraData.contentTitle as string : undefined;
      const existing = countMap.get(key) || { count: 0, pageType: record.pageType as ContentType, title: titleFromExtra };
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

    const contentDetails = await Promise.all(
      topItems.map(async (item) => {
        let slug: string | undefined = undefined;
        let finalTitle = item.title;

        // Fetch details if title is missing or generic, or just to get the slug
        if (!finalTitle || finalTitle === 'Unknown Content' || finalTitle === 'content') {
          try {
            let content;
            if (item.pageType === 'film' && isValidObjectId(item.itemId)) content = await db.film.findUnique({ where: { id: item.itemId }, select: { title: true, slug: true } });
            else if (item.pageType === 'story' && isValidObjectId(item.itemId)) content = await db.story.findUnique({ where: { id: item.itemId }, select: { title: true, slug: true } });
            else if (item.pageType === 'production' && isValidObjectId(item.itemId)) content = await db.production.findUnique({ where: { id: item.itemId }, select: { title: true, slug: true } });

            if (content) {
              finalTitle = content.title;
              slug = content.slug;
            } else {
              finalTitle = finalTitle || 'Content Not Found'; // Keep existing title if fetch fails but wasn't generic
            }
          } catch (err) {
            console.error(`Error fetching details for ${item.pageType} ID ${item.itemId}:`, err);
            finalTitle = finalTitle || 'Content Not Found';
          }
        } else {
          // Title exists, just fetch slug
          try {
            if (item.pageType === 'film' && isValidObjectId(item.itemId)) slug = (await db.film.findUnique({ where: { id: item.itemId }, select: { slug: true } }))?.slug;
            else if (item.pageType === 'story' && isValidObjectId(item.itemId)) slug = (await db.story.findUnique({ where: { id: item.itemId }, select: { slug: true } }))?.slug;
            else if (item.pageType === 'production' && isValidObjectId(item.itemId)) slug = (await db.production.findUnique({ where: { id: item.itemId }, select: { slug: true } }))?.slug;
          } catch { /* Ignore slug fetch error */ }
        }

        return { ...item, title: finalTitle || 'Unknown', slug }; // Ensure title is never undefined/null
      })
    );
    return contentDetails;
  } catch (error) {
    console.error("Error in getTopContent:", error);
    return [];
  }
}
// --- End Helpers ---


// --- IMPORTANT: Refactor Engagement Metrics Calculation ---
// This function should ideally be run by a separate process (cron job, background worker)
// periodically (e.g., daily), NOT randomly triggered by the POST request.
async function calculateDailyEngagementMetrics(db: PrismaClient, today: Date) {
  try {
    const dayStart = new Date(today); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(today); dayEnd.setHours(23, 59, 59, 999);

    // Fetch relevant analytics events for the specific day
    const todaysEvents = await db.analytics.findMany({
      where: { timestamp: { gte: dayStart, lt: dayEnd } },
      select: { sessionId: true, event: true, timeOnPage: true, scrollDepth: true, timestamp: true }
    });

    if (todaysEvents.length === 0) {
      console.log(`No events found for ${dayStart.toISOString().split('T')[0]} to calculate metrics.`);
      // Ensure stats record exists with defaults
      await db.dailyStats.upsert({
        where: { date: dayStart },
        update: { bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0 }, // Reset calculated fields
        create: { date: dayStart, pageViews: 0, uniqueVisitors: 0, newVisitors: 0, returningVisitors: 0, filmViews: 0, storyViews: 0, productionViews: 0, engagements: 0, bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0 }
      });
      return;
    }

    // Group events by session
    const sessions: Record<string, any[]> = {};
    todaysEvents.forEach(event => {
      if (event.sessionId) {
        if (!sessions[event.sessionId]) sessions[event.sessionId] = [];
        sessions[event.sessionId].push(event);
      }
    });

    const sessionIds = Object.keys(sessions);
    if (sessionIds.length === 0) {
      console.log(`No valid sessions found for ${dayStart.toISOString().split('T')[0]}.`);
      await db.dailyStats.upsert({
        where: { date: dayStart },
        update: { bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0 },
        create: { date: dayStart, pageViews: 0, uniqueVisitors: 0, newVisitors: 0, returningVisitors: 0, filmViews: 0, storyViews: 0, productionViews: 0, engagements: 0, bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0 }
      });
      return;
    }

    let bounceSessions = 0;
    let totalTimeOnSite = 0;
    let engagedSessions = 0;

    sessionIds.forEach(sessionId => {
      const sessionEvents = sessions[sessionId].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const pageViews = sessionEvents.filter(e => e.event === 'view').length;
      // Ensure duration is only calculated if there's a start and end event in the session for that day
      const sessionDuration = sessionEvents.length > 1 ? (sessionEvents[sessionEvents.length - 1].timestamp.getTime() - sessionEvents[0].timestamp.getTime()) / 1000 : 0;

      // Refined bounce definition: 1 page view AND session duration less than 10 seconds
      if (pageViews === 1 && sessionDuration < 10) {
        bounceSessions++;
      } else {
        engagedSessions++; // Consider engaged if not bounced
      }
      totalTimeOnSite += sessionDuration;
    });

    const totalValidSessions = sessionIds.length;
    const bounceRate = totalValidSessions > 0 ? parseFloat(((bounceSessions / totalValidSessions) * 100).toFixed(2)) : 0;
    const avgTimeOnSite = totalValidSessions > 0 ? parseFloat((totalTimeOnSite / totalValidSessions).toFixed(2)) : 0;
    const avgEngagementScore = totalValidSessions > 0 ? parseFloat(((engagedSessions / totalValidSessions) * 100).toFixed(2)) : 0;

    // Update daily stats - Use upsert to handle creation if the record wasn't made by POST
    await db.dailyStats.upsert({
      where: { date: dayStart },
      update: { bounceRate, avgTimeOnSite, avgEngagementScore },
      create: { date: dayStart, pageViews: 0, uniqueVisitors: 0, newVisitors: 0, returningVisitors: 0, filmViews: 0, storyViews: 0, productionViews: 0, engagements: 0, bounceRate, avgTimeOnSite, avgEngagementScore } // Ensure all fields are provided on create
    });

    console.log(`Calculated engagement metrics for ${dayStart.toISOString().split('T')[0]}`);

  } catch (error) {
    console.error(`Error calculating engagement metrics for ${today.toISOString().split('T')[0]}:`, error);
  }
}


// POST Track Event (Refined)
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      pageUrl, pageType = 'other', itemId, event, referrer,
      visitorId, sessionId, scrollDepth, timeOnPage, screenData,
      ...extraData
    } = data;

    const db = prismaAccelerate || prisma;

    // **Validation**
    if (!visitorId || !sessionId || !pageUrl || !event) {
      const missing = [!visitorId && 'visitorId', !sessionId && 'sessionId', !pageUrl && 'pageUrl', !event && 'event'].filter(Boolean).join(', ');
      console.warn(`Analytics POST: Missing required fields: ${missing}`);
      return NextResponse.json({ error: `Missing required fields: ${missing}` }, { status: 400 });
    }

    // --- IP and User Agent ---
    const forwardedFor = req.headers.get('x-forwarded-for') || req.ip || '0.0.0.0';
    const ip = forwardedFor.split(',')[0].trim();
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const userAgent = req.headers.get('user-agent') || '';
    const uaParser = new UAParser(userAgent);
    const browser = uaParser.getBrowser();
    const device = uaParser.getDevice();
    const os = uaParser.getOS();

    let isNewUser = false; // Default value
    let isUniqueViewToday = false;

    // --- Visitor Record Management ---
    try {
      const visitorRecord = await db.visitor.upsert({
        where: { visitorId },
        update: {
          lastSeen: new Date(),
          totalVisits: event === 'session_start' ? { increment: 1 } : undefined,
          totalSessions: event === 'session_start' ? { increment: 1 } : undefined,
          browser: browser.name, device: device.type || 'desktop', os: os.name
        },
        create: {
          visitorId, firstSeen: new Date(), lastSeen: new Date(), totalVisits: 1, totalSessions: 1,
          browser: browser.name, device: device.type || 'desktop', os: os.name, country: 'Unknown',
        }
      });

      // <<< FIX: Calculate isNewUser *inside* the try block AFTER upsert succeeds >>>
      // Also add checks for property existence and use a small tolerance
      if (visitorRecord && visitorRecord.createdAt && visitorRecord.lastSeen) {
        // Check if lastSeen is very close to createdAt (within 1 second tolerance)
        isNewUser = Math.abs(visitorRecord.createdAt.getTime() - visitorRecord.lastSeen.getTime()) < 1000;
      }
      // <<< End Fix >>>

    } catch (visitorError) {
      console.error("Error managing visitor record:", visitorError);
      // isNewUser remains false (the default) if upsert fails
    }

    // --- Check for Unique View Today ---
    if (event === 'view') {
      try {
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        // Use `db` which is either accelerated or standard client
        const viewsTodayCount = await db.analytics.count({
          where: {
            visitorId, event: 'view',
            timestamp: { gte: todayStart },
            pageUrl: pageUrl // Check uniqueness per page per day
          }
        });
        isUniqueViewToday = viewsTodayCount === 0;
      } catch (dbError) {
        console.error("Error checking views today:", dbError);
      }
    }

    // --- Create Analytics Entry ---
    try {
      // Use `db` which is either accelerated or standard client
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
      // Don't necessarily fail the whole request if logging fails, but log it.
    }

    // --- Update Daily Stats ---
    try {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const isActualUniqueView = event === 'view' && isUniqueViewToday;

      const updatePayload: any = {};
      if (event === 'view') updatePayload.pageViews = { increment: 1 };
      if (isActualUniqueView) {
        updatePayload.uniqueVisitors = { increment: 1 };
        if (isNewUser) updatePayload.newVisitors = { increment: 1 };
        else updatePayload.returningVisitors = { increment: 1 };
      }
      if (pageType === 'film' && event === 'view') updatePayload.filmViews = { increment: 1 };
      if (pageType === 'story' && event === 'view') updatePayload.storyViews = { increment: 1 };
      if (pageType === 'production' && event === 'view') updatePayload.productionViews = { increment: 1 };
      if (['click', 'share', 'play', 'pause', 'complete', 'engagement'].includes(event)) {
        updatePayload.engagements = { increment: 1 };
      }


      const createPayload: any = {
        date: today,
        pageViews: event === 'view' ? 1 : 0,
        uniqueVisitors: isActualUniqueView ? 1 : 0,
        newVisitors: isActualUniqueView && isNewUser ? 1 : 0,
        returningVisitors: isActualUniqueView && !isNewUser ? 1 : 0,
        filmViews: (pageType === 'film' && event === 'view') ? 1 : 0,
        storyViews: (pageType === 'story' && event === 'view') ? 1 : 0,
        productionViews: (pageType === 'production' && event === 'view') ? 1 : 0,
        engagements: (['click', 'share', 'play', 'pause', 'complete', 'engagement'].includes(event)) ? 1 : 0,
        bounceRate: 0, avgTimeOnSite: 0, avgEngagementScore: 0
      };

      if (Object.keys(updatePayload).length > 0) {
        // Use `db` which is either accelerated or standard client
        await db.dailyStats.upsert({
          where: { date: today },
          update: updatePayload,
          create: createPayload,
        });
      }

      // Trigger metrics calculation OUTSIDE this request flow (e.g., cron)
      // ...

    } catch (statsError: any) {
      console.error("Error updating daily stats:", statsError.message, statsError.code ? `Code: ${statsError.code}` : '');
      // Don't fail the whole request if stats update fails, but log it.
    }

    // 202 Accepted: Request received, processing will continue
    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error: any) {
    console.error("Global error in analytics POST:", error);
    return NextResponse.json({ error: "Failed to track analytics", details: error.message }, { status: 500 });
  }
}



// --- GET Analytics Route Handler (Refined) ---
export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    const days = Math.max(1, Math.min(365, Number(searchParams.get("days")) || 30));
    const type = searchParams.get("type") as ContentType | undefined;

    const endDate = new Date();
    const startDate = new Date(); startDate.setDate(endDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const db = prismaAccelerate || prisma;

    // Fetch daily stats
    const rawDailyStats = await db.dailyStats.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      orderBy: { date: "asc" },
    });

    // Process stats (Ensure date is ISO string for fillMissingDays map key)
    const processedStats: DailyStats[] = rawDailyStats.map(stat => ({
      date: new Date(stat.date).toISOString(),
      // ... (rest of the fields, ensuring Number conversion) ...
      pageViews: Number(stat.pageViews ?? 0),
      uniqueVisitors: Number(stat.uniqueVisitors ?? 0),
      newVisitors: Number(stat.newVisitors ?? 0),
      returningVisitors: Number(stat.returningVisitors ?? 0),
      filmViews: Number(stat.filmViews ?? 0),
      storyViews: Number(stat.storyViews ?? 0),
      productionViews: Number(stat.productionViews ?? 0),
      engagements: Number(stat.engagements ?? 0),
      bounceRate: Number(stat.bounceRate ?? 0),
      avgTimeOnSite: Number(stat.avgTimeOnSite ?? 0),
      avgEngagementScore: Number(stat.avgEngagementScore ?? 0),
    }));

    const filledDailyStats = fillMissingDays(startDate, endDate, processedStats);

    // Fetch top content
    const topContent = await getTopContent(db, startDate, endDate, type);

    // Enhance stats with trends and moving averages
    // Pass the result of fillMissingDays which has Date objects again
    const { dailyStats: finalDailyStats, trends } = enhanceAnalyticsData(filledDailyStats);

    return NextResponse.json({ dailyStats: finalDailyStats, topContent, trends });

  } catch (error: any) {
    console.error("Error fetching analytics:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to fetch analytics", message: error.message }, { status: 500 });
  }
}
