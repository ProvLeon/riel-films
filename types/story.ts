export interface Story {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  readTime: string;
  category?: string;
}

export interface FeaturedStory extends Story {
  // Any additional fields specific to featured stories
}

export interface BlogPost extends Story {
  category: string;
}
