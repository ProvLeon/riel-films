import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from "react";
import { Film, Production, Story, Settings } from '@/types/mongodbSchema';
import { trackEvent as trackAnalyticsEvent, trackPageView as trackAnalyticsPageView } from '@/lib/analytics-client';
import { AnalyticsEventType, ContentType } from '@/types/analytics';
import { AnalyticsDataType, DataContextType } from '@/types/analytics';


const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Films state
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoadingFilms, setIsLoadingFilms] = useState<boolean>(false);
  const [errorFilms, setErrorFilms] = useState<string | null>(null);

  // Productions state
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoadingProductions, setIsLoadingProductions] = useState<boolean>(false);
  const [errorProductions, setErrorProductions] = useState<string | null>(null);

  // Stories state
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState<boolean>(false);
  const [errorStories, setErrorStories] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(false);
  const [errorSettings, setErrorSettings] = useState<string | null>(null);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);
  const [errorAnalytics, setErrorAnalytics] = useState<string | null>(null);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (days: number = 30, type?: string) => {
    setIsLoadingAnalytics(true);
    setErrorAnalytics(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('days', days.toString());
      if (type) queryParams.append('type', type);

      const response = await fetch(`/api/analytics?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error: any) {
      setErrorAnalytics(error.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // Custom trackPageView that uses the library function
  const trackPageView = useCallback((pageType: ContentType, itemId?: string) => {
    trackAnalyticsPageView(pageType, itemId);
  }, []);

  // Custom trackEvent that uses the library function
  const trackEvent = useCallback((
    pageType: ContentType,
    event: AnalyticsEventType,
    itemId?: string,
    extraData?: Record<string, any>
  ) => {
    trackAnalyticsEvent(pageType, event, itemId, extraData || {});
  }, []);

  // Fetch films
  const fetchFilms = useCallback(async (params: Record<string, any> = {}) => {
    setIsLoadingFilms(true);
    setErrorFilms(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/films?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch films');
      }

      const data = await response.json();
      setFilms(data);
    } catch (error: any) {
      setErrorFilms(error.message);
    } finally {
      setIsLoadingFilms(false);
    }
  }, []);

  // Fetch productions
  const fetchProductions = useCallback(async (params: Record<string, any> = {}) => {
    setIsLoadingProductions(true);
    setErrorProductions(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/productions?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch productions');
      }

      const data = await response.json();
      setProductions(data);
    } catch (error: any) {
      setErrorProductions(error.message);
    } finally {
      setIsLoadingProductions(false);
    }
  }, []);

  // Fetch stories
  const fetchStories = useCallback(async (params: Record<string, any> = {}) => {
    setIsLoadingStories(true);
    setErrorStories(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/stories?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      setStories(data);
    } catch (error: any) {
      setErrorStories(error.message);
    } finally {
      setIsLoadingStories(false);
    }
  }, []);

  // Fetch settings
  const refetchSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    setErrorSettings(null);

    try {
      const response = await fetch('/api/settings');

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data);
    } catch (error: any) {
      setErrorSettings(error.message);
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  // Create context value object
  const value: DataContextType = {
    films,
    isLoadingFilms,
    errorFilms,
    fetchFilms,

    productions,
    isLoadingProductions,
    errorProductions,
    fetchProductions,

    stories,
    isLoadingStories,
    errorStories,
    fetchStories,

    settings,
    isLoadingSettings,
    errorSettings,
    refetchSettings,

    analyticsData,
    isLoadingAnalytics,
    errorAnalytics,
    fetchAnalytics,
    trackPageView,
    trackEvent
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Hook for using the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
