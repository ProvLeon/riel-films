// Database schema for Riel Films

// Films Collection
export type Film = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  image: string;
  director: string;
  producer: string;
  duration: string;
  languages: string[];
  subtitles: string[];
  releaseDate: string;
  awards: string[];
  castCrew: { role: string; name: string }[];
  gallery: string[];
  trailer: string;
  synopsis: string;
  quotes: { text: string; source: string }[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Production = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  description: string;
  longDescription: string;
  image: string;
  director: string;
  producer: string;
  cinematographer: string;
  editor: string;
  timeline: string;
  startDate: string;
  estimatedCompletion: string;
  locations: string[];
  logline: string;
  synopsis: string;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  progress: number;
  team: {
    name: string;
    role: string;
    bio: string;
    image: string;
  }[];
  stages: {
    name: string;
    status: "completed" | "in-progress" | "upcoming";
    milestones: string[];
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  updates: {
    date: string;
    title: string;
    content: string;
    image: string;
  }[];
  supportOptions: {
    title: string;
    investment: string;
    description: string;
    perks: string[];
  }[];
};

export interface StoryContent {
  type: "paragraph" | "heading" | "image" | "quote";
  content?: string;
  url?: string;
  caption?: string;
  attribution?: string;
}

// Stories/Blog Collection
export type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: StoryContent[];
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Users Collection (Admin Users)
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password for regular login
  image?: string;
  googleId?: string; // For Google Sign-In
  role: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

// Settings Collection (Global site settings)
export type Settings = {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: { platform: string, url: string }[];
  logoLight: string;
  logoDark: string;
  metaImage: string;
  updatedAt: Date;
}
