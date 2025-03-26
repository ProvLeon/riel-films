import { prisma, prismaAccelerate } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

// Track event
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      pageUrl,
      pageType,
      itemId,
      event,
      referrer,
      visitorId,
      sessionId,
      scrollDepth,
      timeOnPage,
      screenData,
      ...extraData
    } = data;

    // Get IP address and hash it for privacy
    const forwardedFor = req.headers.get('x-forwarded-for') || '0.0.0.0';
    const ip = forwardedFor.split(',')[0].trim();
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Get user agent
    const userAgent = req.headers.get('user-agent') || '';

    // Parse user agent for device info
    const uaParser = new UAParser(userAgent);
    const browser = uaParser.getBrowser();
    const device = uaParser.getDevice();
    const os = uaParser.getOS();

    // Use standard Prisma client as a fallback
    const db = prismaAccelerate || prisma;

    // Check if this is a new visitor
    let isNewUser = false;
    let viewsToday = null; // Initialize here to avoid undefined error

    if (visitorId) {
      const existingVisitor = await db.visitor.findUnique({
        where: { visitorId }
      });

      if (!existingVisitor) {
        isNewUser = true;

        // Create new visitor record
        await db.visitor.create({
          data: {
            visitorId,
            firstSeen: new Date(),
            lastSeen: new Date(),
            browser: browser.name,
            device: device.type || 'desktop',
            os: os.name,
            // We'll extract country from IP in a production app
            country: 'Unknown',
          }
        });
      } else {
        // Update existing visitor
        await db.visitor.update({
          where: { visitorId },
          data: {
            lastSeen: new Date(),
            totalVisits: { increment: 1 },
            // Only increment sessions for view events to avoid over-counting
            totalSessions: event === 'view' ? { increment: 1 } : undefined,
            preferredContent: pageType === 'film' || pageType === 'story' || pageType === 'production'
              ? pageType
              : undefined
          }
        });
      }

      // Check if this visitor has been counted today
      if (event === 'view') {
        viewsToday = await db.analytics.findFirst({
          where: {
            visitorId,
            event: 'view',
            timestamp: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            }
          }
        });
      }
    }

    // Create analytics entry with all available data
    await db.analytics.create({
      data: {
        pageUrl,
        pageType,
        itemId,
        event,
        referrer,
        userAgent,
        ipHash,
        sessionId,
        visitorId,
        isNewUser,
        scrollDepth,
        timeOnPage,
        screenData: screenData || {},
        extraData: extraData || {}
      },
    });

    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prepare update data based on page type and event
    let updateData: any = {};

    if (event === 'view') {
      updateData.pageViews = { increment: 1 };

      // Only count unique visitors once per day per visitor ID
      if (visitorId && !viewsToday) {
        updateData.uniqueVisitors = { increment: 1 };

        if (isNewUser) {
          updateData.newVisitors = { increment: 1 };
        } else {
          updateData.returningVisitors = { increment: 1 };
        }
      }

      // Update specific view types based on content
      if (pageType === 'film') {
        updateData.filmViews = { increment: 1 };
      } else if (pageType === 'story') {
        updateData.storyViews = { increment: 1 };
      } else if (pageType === 'production') {
        updateData.productionViews = { increment: 1 };
      }
    } else {
      // Track engagements (non-view events)
      updateData.engagements = { increment: 1 };
    }

    // Calculate bounce rate and engagement score periodically
    if (event === 'view' || event === 'heartbeat') {
      // We'll periodically update these metrics
      await calculateDailyEngagementMetrics(db, today);
    }

    // Upsert daily stats record
    await db.dailyStats.upsert({
      where: { date: today },
      update: updateData,
      create: {
        date: today,
        pageViews: event === 'view' ? 1 : 0,
        uniqueVisitors: (event === 'view' && visitorId && !viewsToday) ? 1 : 0,
        newVisitors: (isNewUser && event === 'view') ? 1 : 0,
        returningVisitors: (!isNewUser && event === 'view' && visitorId && !viewsToday) ? 1 : 0,
        filmViews: (pageType === 'film' && event === 'view') ? 1 : 0,
        storyViews: (pageType === 'story' && event === 'view') ? 1 : 0,
        productionViews: (pageType === 'production' && event === 'view') ? 1 : 0,
        engagements: event !== 'view' ? 1 : 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error tracking analytics:", error.message);
    return NextResponse.json(
      { error: "Failed to track analytics", message: error.message },
      { status: 500 }
    );
  }
}

// Calculate advanced engagement metrics
async function calculateDailyEngagementMetrics(db: PrismaClient, today: Date) {
  try {
    // Only run this calculation periodically to avoid overloading the database
    // Check if we've calculated in the last hour
    const lastCalc = await db.analytics.findFirst({
      where: {
        event: 'metrics_calculation',
        timestamp: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    });

    if (lastCalc) return; // Skip if calculated recently

    // Mark that we're calculating
    await db.analytics.create({
      data: {
        pageUrl: '',
        pageType: 'system',
        event: 'metrics_calculation',
      }
    });

    // Get unique sessions for today
    const sessionIds = await db.analytics.findMany({
      where: {
        timestamp: {
          gte: today,
        },
        sessionId: {
          not: null,
        }
      },
      distinct: ['sessionId'],
      select: {
        sessionId: true
      }
    });

    // For each session, count the number of page views
    const sessionPageViewCounts = await Promise.all(
      sessionIds.map(async ({ sessionId }) => {
        const count = await db.analytics.count({
          where: {
            sessionId,
            event: 'view',
            timestamp: {
              gte: today,
            }
          }
        });
        return { sessionId, count };
      })
    );

    // Calculate bounce rate (sessions with only one pageview)
    const totalSessions = sessionPageViewCounts.length;
    const bounceSessions = sessionPageViewCounts.filter(s => s.count === 1).length;
    const bounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0;

    // Calculate average time on site
    const sessionData = await Promise.all(
      sessionIds.map(async ({ sessionId }) => {
        const events = await db.analytics.findMany({
          where: {
            sessionId,
            timestamp: {
              gte: today,
            }
          },
          orderBy: {
            timestamp: 'asc',
          }
        });

        if (events.length <= 1) return 0; // Can't calculate time with just one event

        // Calculate time difference between first and last event
        const firstEvent = events[0].timestamp;
        const lastEvent = events[events.length - 1].timestamp;
        return (lastEvent.getTime() - firstEvent.getTime()) / 1000; // in seconds
      })
    );

    const validTimeSessions = sessionData.filter(time => time > 0);
    const avgTimeOnSite = validTimeSessions.length > 0
      ? validTimeSessions.reduce((a, b) => a + b, 0) / validTimeSessions.length
      : 0;

    // Calculate overall engagement score (0-100)
    // Formula: weighted combination of scroll depth, time spent, and actions taken
    const engagementEvents = await db.analytics.findMany({
      where: {
        timestamp: {
          gte: today,
        },
        OR: [
          { event: 'engagement' },
          { event: 'click' },
          { event: 'share' }
        ]
      },
      select: {
        scrollDepth: true,
        timeOnPage: true,
        event: true
      }
    });

    let totalScore = 0;
    const weights = { scrollDepth: 0.4, timeOnPage: 0.4, actions: 0.2 };

    // Scroll depth factor (0-100)
    const scrollDepthValues = engagementEvents
      .filter(e => e.scrollDepth !== null && e.scrollDepth !== undefined)
      .map(e => e.scrollDepth || 0);

    const avgScrollDepth = scrollDepthValues.length > 0
      ? scrollDepthValues.reduce((a, b) => a + b, 0) / scrollDepthValues.length
      : 0;

    // Time factor (normalize to 0-100 scale, where >5 minutes = 100)
    const maxTimeScore = 5 * 60; // 5 minutes in seconds
    const avgTimeScore = Math.min(100, (avgTimeOnSite / maxTimeScore) * 100);

    // Actions factor (clicks, shares)
    const actionEvents = engagementEvents.filter(e => e.event === 'click' || e.event === 'share').length;
    const actionScore = Math.min(100, (actionEvents / Math.max(totalSessions, 1)) * 100);

    // Combined score
    totalScore = (
      (avgScrollDepth * weights.scrollDepth) +
      (avgTimeScore * weights.timeOnPage) +
      (actionScore * weights.actions)
    );

    // Update daily stats with calculated metrics
    await db.dailyStats.update({
      where: { date: today },
      data: {
        bounceRate,
        avgTimeOnSite,
        avgEngagementScore: totalScore
      }
    });

  } catch (error) {
    console.error("Error calculating engagement metrics:", error);
    // Don't fail the main request if metrics calculation fails
  }
}

// Helper function to get top content
async function getTopContent(db: PrismaClient, startDate: Date, endDate: Date, type?: string) {
  try {
    // Fallback to direct query approach since MongoDB doesn't support groupBy through Prisma
    const analytics = await db.analytics.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        event: 'view',
        ...(type ? { pageType: type } : {}),
        itemId: { not: null },
      },
      take: 1000, // Reasonable limit to avoid memory issues
    });

    // Manually count occurrences
    const countMap = new Map<string, { count: number; pageType: string }>();

    // Group by itemId and pageType, counting occurrences
    for (const record of analytics) {
      if (!record.itemId) continue;

      const key = `${record.itemId}-${record.pageType}`;
      const existing = countMap.get(key) || { count: 0, pageType: record.pageType };

      countMap.set(key, {
        count: existing.count + 1,
        pageType: record.pageType
      });
    }

    // Convert to array, sort by count descending, and take top 10
    const topItems = Array.from(countMap.entries())
      .map(([key, value]) => ({
        itemId: key.split('-')[0], // Extract itemId from composite key
        pageType: value.pageType,
        count: value.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get content details for each top item
    const contentDetails = await Promise.all(
      topItems.map(async (item) => {
        try {
          let content;
          if (item.pageType === 'film') {
            content = await db.film.findUnique({
              where: { id: item.itemId },
              select: { title: true, slug: true },
            });
          } else if (item.pageType === 'story') {
            content = await db.story.findUnique({
              where: { id: item.itemId },
              select: { title: true, slug: true },
            });
          } else if (item.pageType === 'production') {
            content = await db.production.findUnique({
              where: { id: item.itemId },
              select: { title: true, slug: true },
            });
          }

          return {
            itemId: item.itemId,
            pageType: item.pageType,
            count: item.count,
            title: content?.title || 'Unknown',
            slug: content?.slug,
          };
        } catch (err) {
          console.error(`Error fetching details for item ${item.itemId}:`, err);
          return {
            itemId: item.itemId,
            pageType: item.pageType,
            count: item.count,
            title: 'Unknown',
            slug: undefined,
          };
        }
      })
    );

    return contentDetails;
  } catch (error) {
    console.error("Error in getTopContent:", error);

    // If everything fails, return an empty array
    return [];
  }
}

// Helper function to fill in missing days in analytics data
function fillMissingDays(startDate: Date, endDate: Date, existingData: any[]) {
  const filledData = [];
  const existingDataMap = new Map();

  // Create a map of existing data keyed by date string
  existingData.forEach(item => {
    const dateStr = item.date.toISOString().split('T')[0];
    existingDataMap.set(dateStr, item);
  });

  // Loop through each day in the range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];

    if (existingDataMap.has(dateStr)) {
      // If we have data for this day, use it
      filledData.push(existingDataMap.get(dateStr));
    } else {
      // Otherwise create a zeroed entry
      filledData.push({
        date: new Date(currentDate),
        pageViews: 0,
        uniqueVisitors: 0,
        newVisitors: 0,
        returningVisitors: 0,
        filmViews: 0,
        storyViews: 0,
        productionViews: 0,
        engagements: 0,
        bounceRate: 0,
        avgTimeOnSite: 0,
        avgEngagementScore: 0
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}

// Professional analytics enhancement function
function enhanceAnalyticsData(dailyStats: any[]) {
  if (!dailyStats.length) {
    return { dailyStats, trends: {} };
  }

  // Calculate overall trends
  const totalDays = dailyStats.length;

  // Skip initial days with zero data (if any)
  let startIndex = 0;
  while (startIndex < totalDays &&
    dailyStats[startIndex].pageViews === 0 &&
    dailyStats[startIndex].uniqueVisitors === 0) {
    startIndex++;
  }

  // If all days are zero, return original data
  if (startIndex === totalDays) {
    return {
      dailyStats,
      trends: {
        pageViews: 0,
        uniqueVisitors: 0,
        engagement: 0,
        bounceRate: 0,
        contentPerformance: {}
      }
    };
  }

  // Split into periods for comparison (first half vs second half)
  const midPoint = Math.floor((totalDays + startIndex) / 2);

  // For each metric, calculate totals, averages, and growth rates
  const firstPeriodMetrics = calculatePeriodMetrics(dailyStats.slice(startIndex, midPoint));
  const secondPeriodMetrics = calculatePeriodMetrics(dailyStats.slice(midPoint));

  // Calculate growth rates
  const growthRates = {
    pageViews: calculateGrowthRate(firstPeriodMetrics.pageViews.total, secondPeriodMetrics.pageViews.total),
    uniqueVisitors: calculateGrowthRate(firstPeriodMetrics.uniqueVisitors.total, secondPeriodMetrics.uniqueVisitors.total),
    filmViews: calculateGrowthRate(firstPeriodMetrics.filmViews.total, secondPeriodMetrics.filmViews.total),
    storyViews: calculateGrowthRate(firstPeriodMetrics.storyViews.total, secondPeriodMetrics.storyViews.total),
    productionViews: calculateGrowthRate(firstPeriodMetrics.productionViews.total, secondPeriodMetrics.productionViews.total),
    engagements: calculateGrowthRate(firstPeriodMetrics.engagements.total, secondPeriodMetrics.engagements.total),
    newVisitors: calculateGrowthRate(firstPeriodMetrics.newVisitors.total, secondPeriodMetrics.newVisitors.total),
    returningVisitors: calculateGrowthRate(firstPeriodMetrics.returningVisitors.total, secondPeriodMetrics.returningVisitors.total),
  };

  // Calculate content performance metrics
  const contentPerformance = {
    film: calculateContentPerformance(dailyStats, 'filmViews'),
    story: calculateContentPerformance(dailyStats, 'storyViews'),
    production: calculateContentPerformance(dailyStats, 'productionViews')
  };

  // Calculate engagement rate
  const overallEngagementRate = calculateEngagementRate(dailyStats);

  // Get average bounce rate
  const avgBounceRate = dailyStats.reduce((sum, day) => sum + (day.bounceRate || 0), 0) /
    dailyStats.filter(day => day.bounceRate !== undefined && day.bounceRate !== null).length || 0;

  // Calculate moving averages for smoother trend lines
  const enhancedDailyStats = calculateMovingAverages(dailyStats);

  // Add the trends analysis to the response
  const trends = {
    summary: {
      totalPageViews: dailyStats.reduce((sum, day) => sum + day.pageViews, 0),
      totalUniqueVisitors: dailyStats.reduce((sum, day) => sum + day.uniqueVisitors, 0),
      averageDailyViews: dailyStats.reduce((sum, day) => sum + day.pageViews, 0) / totalDays,
      topPerformer: getTopPerformer(contentPerformance)
    },
    pageViews: {
      total: firstPeriodMetrics.pageViews.total + secondPeriodMetrics.pageViews.total,
      average: (firstPeriodMetrics.pageViews.average + secondPeriodMetrics.pageViews.average) / 2,
      growth: growthRates.pageViews,
      trend: determineTrend(growthRates.pageViews)
    },
    visitors: {
      total: {
        unique: firstPeriodMetrics.uniqueVisitors.total + secondPeriodMetrics.uniqueVisitors.total,
        new: firstPeriodMetrics.newVisitors.total + secondPeriodMetrics.newVisitors.total,
        returning: firstPeriodMetrics.returningVisitors.total + secondPeriodMetrics.returningVisitors.total
      },
      growth: {
        unique: growthRates.uniqueVisitors,
        new: growthRates.newVisitors,
        returning: growthRates.returningVisitors
      },
      trend: determineTrend(growthRates.uniqueVisitors)
    },
    contentViews: {
      films: {
        total: firstPeriodMetrics.filmViews.total + secondPeriodMetrics.filmViews.total,
        growth: growthRates.filmViews,
        trend: determineTrend(growthRates.filmViews),
        performance: contentPerformance.film
      },
      stories: {
        total: firstPeriodMetrics.storyViews.total + secondPeriodMetrics.storyViews.total,
        growth: growthRates.storyViews,
        trend: determineTrend(growthRates.storyViews),
        performance: contentPerformance.story
      },
      productions: {
        total: firstPeriodMetrics.productionViews.total + secondPeriodMetrics.productionViews.total,
        growth: growthRates.productionViews,
        trend: determineTrend(growthRates.productionViews),
        performance: contentPerformance.production
      }
    },
    engagement: {
      rate: overallEngagementRate,
      total: firstPeriodMetrics.engagements.total + secondPeriodMetrics.engagements.total,
      growth: growthRates.engagements,
      trend: determineTrend(growthRates.engagements),
      avgTimeOnSite: dailyStats.reduce((sum, day) => sum + (day.avgTimeOnSite || 0), 0) /
        dailyStats.filter(day => day.avgTimeOnSite !== undefined && day.avgTimeOnSite !== null).length || 0
    },
    bounceRate: {
      average: avgBounceRate,
      trend: determineTrend(-calculateGrowthRate(
        firstPeriodMetrics.bounceRate.average || 0,
        secondPeriodMetrics.bounceRate.average || 0
      )) // Inverted since lower bounce rate is better
    },
    periodComparison: {
      firstPeriod: {
        start: dailyStats[startIndex].date,
        end: dailyStats[midPoint - 1]?.date || dailyStats[startIndex].date,
        metrics: firstPeriodMetrics
      },
      secondPeriod: {
        start: dailyStats[midPoint].date,
        end: dailyStats[totalDays - 1].date,
        metrics: secondPeriodMetrics
      }
    }
  };

  return {
    dailyStats: enhancedDailyStats,
    trends
  };
}

// Helper function to calculate period metrics
function calculatePeriodMetrics(periodStats: any[]) {
  if (!periodStats.length) {
    return {
      pageViews: { total: 0, average: 0 },
      uniqueVisitors: { total: 0, average: 0 },
      newVisitors: { total: 0, average: 0 },
      returningVisitors: { total: 0, average: 0 },
      filmViews: { total: 0, average: 0 },
      storyViews: { total: 0, average: 0 },
      productionViews: { total: 0, average: 0 },
      engagements: { total: 0, average: 0 },
      bounceRate: { average: 0 },
      avgTimeOnSite: { average: 0 },
      avgEngagementScore: { average: 0 }
    };
  }

  const totals = periodStats.reduce((acc, day) => {
    acc.pageViews += day.pageViews || 0;
    acc.uniqueVisitors += day.uniqueVisitors || 0;
    acc.newVisitors += day.newVisitors || 0;
    acc.returningVisitors += day.returningVisitors || 0;
    acc.filmViews += day.filmViews || 0;
    acc.storyViews += day.storyViews || 0;
    acc.productionViews += day.productionViews || 0;
    acc.engagements += day.engagements || 0;

    // Accumulate averaged metrics
    if (day.bounceRate !== undefined && day.bounceRate !== null) {
      acc.bounceRateSum += day.bounceRate;
      acc.bounceRateCount++;
    }

    if (day.avgTimeOnSite !== undefined && day.avgTimeOnSite !== null) {
      acc.timeOnSiteSum += day.avgTimeOnSite;
      acc.timeOnSiteCount++;
    }

    if (day.avgEngagementScore !== undefined && day.avgEngagementScore !== null) {
      acc.engagementScoreSum += day.avgEngagementScore;
      acc.engagementScoreCount++;
    }

    return acc;
  }, {
    pageViews: 0,
    uniqueVisitors: 0,
    newVisitors: 0,
    returningVisitors: 0,
    filmViews: 0,
    storyViews: 0,
    productionViews: 0,
    engagements: 0,
    bounceRateSum: 0,
    bounceRateCount: 0,
    timeOnSiteSum: 0,
    timeOnSiteCount: 0,
    engagementScoreSum: 0,
    engagementScoreCount: 0
  });

  const days = periodStats.length;

  return {
    pageViews: { total: totals.pageViews, average: totals.pageViews / days },
    uniqueVisitors: { total: totals.uniqueVisitors, average: totals.uniqueVisitors / days },
    newVisitors: { total: totals.newVisitors, average: totals.newVisitors / days },
    returningVisitors: { total: totals.returningVisitors, average: totals.returningVisitors / days },
    filmViews: { total: totals.filmViews, average: totals.filmViews / days },
    storyViews: { total: totals.storyViews, average: totals.storyViews / days },
    productionViews: { total: totals.productionViews, average: totals.productionViews / days },
    engagements: { total: totals.engagements, average: totals.engagements / days },
    bounceRate: {
      average: totals.bounceRateCount > 0 ? totals.bounceRateSum / totals.bounceRateCount : 0
    },
    avgTimeOnSite: {
      average: totals.timeOnSiteCount > 0 ? totals.timeOnSiteSum / totals.timeOnSiteCount : 0
    },
    avgEngagementScore: {
      average: totals.engagementScoreCount > 0 ? totals.engagementScoreSum / totals.engagementScoreCount : 0
    }
  };
}

// Helper function to calculate growth rate
function calculateGrowthRate(previousValue: number, currentValue: number): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0; // 100% growth from 0 to something
  }

  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(2));
}

// Helper function to calculate content performance score
function calculateContentPerformance(dailyStats: any[], metric: string): number {
  // Calculate what percentage of total views this content type represents
  const totalViews = dailyStats.reduce((sum, day) => sum + (day.pageViews || 0), 0);
  const contentViews = dailyStats.reduce((sum, day) => sum + (day[metric] || 0), 0);

  if (totalViews === 0) return 0;

  // Content performance score (0-1 scale)
  return Number((contentViews / totalViews).toFixed(4));
}

// Helper function to calculate engagement rate
function calculateEngagementRate(dailyStats: any[]): number {
  const totalPageViews = dailyStats.reduce((sum, day) => sum + (day.pageViews || 0), 0);
  const totalEngagements = dailyStats.reduce((sum, day) => sum + (day.engagements || 0), 0);

  if (totalPageViews === 0) return 0;

  // Engagement rate (0-1 scale)
  return Number((totalEngagements / totalPageViews).toFixed(4));
}

// Helper function to determine trend direction
function determineTrend(growthRate: number): "up" | "down" | "stable" {
  if (growthRate > 5) return "up";
  if (growthRate < -5) return "down";
  return "stable";
}

// Calculate moving averages for smoother trend lines
function calculateMovingAverages(dailyStats: any[], windowSize: number = 3) {
  if (dailyStats.length < windowSize) {
    return dailyStats;
  }

  return dailyStats.map((day, index, array) => {
    // For the first few days, don't try to calculate moving average
    if (index < windowSize - 1) {
      return {
        ...day,
        movingAvgPageViews: day.pageViews,
        movingAvgVisitors: day.uniqueVisitors
      };
    }

    // Calculate moving averages
    let pageViewsSum = 0;
    let visitorsSum = 0;

    for (let i = 0; i < windowSize; i++) {
      pageViewsSum += array[index - i].pageViews || 0;
      visitorsSum += array[index - i].uniqueVisitors || 0;
    }

    return {
      ...day,
      movingAvgPageViews: Number((pageViewsSum / windowSize).toFixed(2)),
      movingAvgVisitors: Number((visitorsSum / windowSize).toFixed(2))
    };
  });
}

// Determine which content type is performing best
function getTopPerformer(contentPerformance: { film: number, story: number, production: number }) {
  const maxValue = Math.max(contentPerformance.film, contentPerformance.story, contentPerformance.production);

  if (maxValue === contentPerformance.film) return 'films';
  if (maxValue === contentPerformance.story) return 'stories';
  if (maxValue === contentPerformance.production) return 'productions';

  return 'none'; // If all are zero
}

// GET analytics data for the dashboard
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days")) || 30;
    const type = searchParams.get("type") || undefined;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Use standard Prisma client as a fallback
    const db = prismaAccelerate || prisma;

    // Get daily stats for date range
    const dailyStats = await db.dailyStats.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Fill in missing days with zero values
    const filledDailyStats = fillMissingDays(startDate, endDate, dailyStats);

    // Create backup data for robust response
    const backupResponse = {
      dailyStats: filledDailyStats,
      topContent: [],
      trends: enhanceAnalyticsData(filledDailyStats).trends
    };

    try {
      // Try to get most viewed content
      const topContent = await getTopContent(db, startDate, endDate, type);

      // Enhance the analytics data with trend analysis
      const enhancedStats = enhanceAnalyticsData(filledDailyStats);

      return NextResponse.json({
        dailyStats: enhancedStats.dailyStats,
        topContent,
        trends: enhancedStats.trends
      });
    } catch (analyticsError) {
      console.error("Error computing analytics:", analyticsError);
      // Return the backup response if content analysis fails
      return NextResponse.json(backupResponse);
    }
  } catch (error: any) {
    console.error("Error fetching analytics:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch analytics", message: error.message },
      { status: 500 }
    );
  }
}
