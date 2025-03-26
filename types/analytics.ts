import { Film, Production, Settings, Story } from '@/types/mongodbSchema';


export type AnalyticsEventType = 'view' | 'click' | 'engagement' | 'share' | 'play' | 'pause' | 'complete' | 'session_start' | 'heartbeat';
export type ContentType = 'film' | 'production' | 'story' | 'home' | 'about' | 'admin' | 'other';

export interface AnalyticsEvent {
  pageUrl: string;
  pageType: string;
  itemId?: string;
  event: AnalyticsEventType;
  referrer?: string;
  timestamp?: Date;
}

export interface DailyStats {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  filmViews: number;
  storyViews: number;
  productionViews: number;
  engagements: number;
  bounceRate?: number;
  avgTimeOnSite?: number;
  avgEngagementScore?: number;
}

export interface TopContent {
  itemId: string;
  pageType: string;
  count: number;
  title: string;
  slug?: string;
}

export interface AnalyticsDataType {
  dailyStats: DailyStats[];
  topContent: TopContent[];
  trends?: any;
}

export interface DataContextType {
  films: Film[];
  isLoadingFilms: boolean;
  errorFilms: string | null;

  productions: Production[];
  isLoadingProductions: boolean;
  errorProductions: string | null;

  stories: Story[];
  isLoadingStories: boolean;
  errorStories: string | null;

  settings: Settings | null;
  isLoadingSettings: boolean;
  errorSettings: string | null;

  fetchFilms: (params?: Record<string, any>) => Promise<void>;
  fetchProductions: (params?: Record<string, any>) => Promise<void>;
  fetchStories: (params?: Record<string, any>) => Promise<void>;
  refetchSettings: () => Promise<void>;

  analyticsData: AnalyticsDataType | null;
  isLoadingAnalytics: boolean;
  errorAnalytics: string | null;
  fetchAnalytics: (days?: number, type?: string) => Promise<void>;
  trackPageView: (pageType: ContentType, itemId?: string) => void;
  trackEvent: (pageType: ContentType, event: AnalyticsEventType, itemId?: string, extraData?: Record<string, any>) => void;
}
