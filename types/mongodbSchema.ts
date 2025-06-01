// Database schema for Riel Films

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
  releaseDate: string; // Keep as string if form handles it that way, convert on API if needed
  awards: string[];
  castCrew: { role: string; name: string }[]; // Keep as Json[] if needed, or define stricter type
  gallery: string[];
  trailer: string;
  synopsis: string;
  quotes: { text: string; source: string }[]; // Keep as Json[] if needed, or define stricter type
  rating: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Production Type
export type Production = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string; // e.g., "Development", "Pre-Production", "In Production", "Post-Production", "Completed"
  description: string;
  longDescription: string;
  image: string;
  progress: number;
  director: string;
  producer: string;
  cinematographer: string;
  editor: string;
  timeline: string; // Text description of timeline
  startDate: string; // Keep as string from form
  estimatedCompletion: string; // Keep as string from form
  locations: string[];
  logline: string;
  synopsis: string;
  featured?: boolean;
  team: { name: string; role: string; bio: string; image: string }[]; // Keep as Json[] if needed
  stages: { name: string; status: "completed" | "in-progress" | "upcoming"; milestones: string[] }[]; // Keep as Json[] if needed
  faq: { question: string; answer: string }[]; // Keep as Json[] if needed
  updates: { date: string; title: string; content: string; image: string }[]; // Keep as Json[] if needed
  supportOptions: { title: string; investment: string; description: string; perks: string[] }[]; // Keep as Json[] if needed
  createdAt: Date;
  updatedAt: Date;
};

// Story Content Block Type
export interface StoryContent {
  type: "paragraph" | "heading" | "image" | "quote";
  content?: string; // For paragraph, heading, quote
  url?: string; // For image
  caption?: string; // For image
  attribution?: string; // For quote
}

// Story Type
export type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: StoryContent[]; // Array of content blocks
  author: string;
  date: Date; // Store as Date object
  image: string;
  category: string;
  readTime: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// User Type
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  image?: string;
  googleId?: string;
  role: "admin" | "editor"; // Define specific roles
  createdAt: Date;
  updatedAt: Date;
};

// User type without password for client-side use
export type UserWithoutPassword = Omit<User, 'password'>;

// Settings Type
export type Settings = {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: { platform: string; url: string }[]; // Use Json[] if complex, or define type
  logoLight: string;
  logoDark: string;
  metaImage: string;
  updatedAt: Date;
};

// Subscriber Type <--- ADD THIS EXPORTED TYPE
export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date | null; // Optional date when unsubscribed
  lastEmailSent?: Date | null; // Optional date of last email sent
  interests: string[];
  source?: string; // e.g., 'website', 'import', 'event'
  createdAt: Date;
  updatedAt: Date;
};

// Campaign Type <--- ADD THIS EXPORTED TYPE
export type Campaign = {
  id: string;
  subject: string;
  content?: string; // Store HTML content or a template reference
  filter?: { interests?: string[] }; // Audience filter used
  status: string; // e.g., draft, sending, sent, failed, partial_failure
  sentAt?: Date | null;
  scheduledAt?: Date | null; // If scheduling is implemented later
  recipientCount: number; // Total targeted count
  deliveredCount?: number | null; // Requires webhook integration
  openedCount?: number | null; // Requires webhook integration
  clickedCount?: number | null; // Requires webhook integration
  bouncedCount?: number | null; // Requires webhook integration
  complaintCount?: number | null; // Requires webhook integration
  unsubscribedCount?: number | null; // Requires webhook integration
  createdAt: Date;
  createdBy: string; // User ID of admin/editor
  updatedAt: Date;
};

// Notification Type <--- ADD THIS EXPORTED TYPE
export type Notification = {
  id: string;
  userId: string; // To whom the notification belongs
  message: string; // The notification text
  type: string; // e.g., 'activity', 'system_update', 'new_content'
  read: boolean; // Read status
  timestamp: Date;
  relatedItemId?: string | null; // Optional link to Film, Story, Production, User ID
  relatedItemType?: string | null; // 'film', 'story', 'production', 'user' etc.
  link?: string | null; // Optional direct link if needed
};
