export interface CourseOverview {
  title: string;
  paragraphs: string[];
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface QuoteInfo {
  quote: string;
  author: string;
}

export interface FacilityFeature {
  title: string;
  description: string;
}

export interface CourseCard {
  title: string;
  type: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badge?: string;
  href: string;
}

export interface ShortCourse {
  title: string;
  description: string;
  href: string;
}

export interface AnnouncementInfo {
  message: string;
  ctaText: string;
  ctaLink: string;
}

export interface PageData {
  heroBackground: string;
  announcement: AnnouncementInfo;
  overview: CourseOverview;
  creativeProduction: CourseOverview;
  courseStructure: {
    title: string;
    items: AccordionItem[];
  };
  quotes: QuoteInfo[];
  facilities: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
    features: FacilityFeature[];
  };
  community: CourseOverview;
  progression: {
    title: string;
    items: AccordionItem[];
  };
  admissions: {
    title: string;
    ctaText: string;
    ctaLink: string;
    timelineSteps: string[];
    items: AccordionItem[];
  };
  relatedCourses: {
    title: string;
    courses: CourseCard[];
    shortCourses: {
      title: string;
      courses: ShortCourse[];
    };
  };
  cta: {
    title: string;
    subtitle: string;
    primaryCta: {
      text: string;
      link: string;
    };
    secondaryCta: {
      text: string;
      link: string;
    };
  };
}


export interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  text: string;
  access: string[];
  basePath?: string; // <<< Mark as optional
  subItems?: { href: string; text: string; access?: string[] }[]; // <<< Mark as optional
}
