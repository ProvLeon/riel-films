import { allBlogPosts, featuredStory } from '../data/storiesData';

// Format the stories data to match our Prisma schema
export const stories = [
  {
    ...featuredStory,
    content: [{ type: 'paragraph', content: featuredStory.excerpt }], // Placeholder content
    date: new Date(featuredStory.date),
    featured: true,
    category: featuredStory.category // Make sure category is included
  },
  ...allBlogPosts.map(post => ({
    ...post,
    content: [{ type: 'paragraph', content: post.excerpt }], // Placeholder content
    date: new Date(post.date),
    featured: false,
    category: post.category // This should already exist in allBlogPosts
  }))
];

// Sample films data
export const films = [
  {
    title: "The River's Song",
    slug: "the-rivers-song",
    category: "Drama",
    year: "2023",
    description: "A powerful drama about life along Ghana's Volta River.",
    longDescription: "This film explores the interplay between tradition and modernity as communities along the Volta River face environmental challenges and cultural change.",
    image: "/images/films/rivers-song.jpg",
    director: "Emmanuel Koffi",
    producer: "Nana Adwoa",
    duration: "102 minutes",
    languages: ["Ewe", "English"],
    subtitles: ["English", "French"],
    releaseDate: "June 15, 2023",
    awards: ["Best Director - Ghana Film Festival", "Special Mention - FESPACO"],
    castCrew: [
      { role: "Lead Actor", name: "Kofi Mensah" },
      { role: "Lead Actress", name: "Ama Boateng" }
    ],
    gallery: ["/images/films/rivers-song-1.jpg", "/images/films/rivers-song-2.jpg"],
    trailer: "https://www.youtube.com/watch?v=example",
    synopsis: "When a young fisherman discovers that industrial pollution is threatening his community's way of life, he must choose between tradition and progress.",
    quotes: [
      { quote: "A visually stunning exploration of environmental issues", source: "African Film Review" }
    ],
    rating: 4.8
  },
  {
    title: "Market Queens",
    slug: "market-queens",
    category: "Documentary",
    year: "2022",
    description: "A documentary about the influential women who control Ghana's markets.",
    longDescription: "This documentary delves into the lives and influence of the powerful women who control Ghana's bustling markets, exploring their economic impact and cultural significance.",
    image: "/images/films/market-queens.jpg",
    director: "Efua Owusu",
    producer: "Joseph Quarcoo",
    duration: "85 minutes",
    languages: ["Twi", "English"],
    subtitles: ["English", "French", "Spanish"],
    releaseDate: "October 20, 2022",
    awards: ["Best Documentary - African Documentary Festival"],
    castCrew: [
      { role: "Cinematographer", name: "Kwame Asante" },
      { role: "Editor", name: "Abena Mensah" }
    ],
    gallery: ["/images/films/market-queens-1.jpg", "/images/films/market-queens-2.jpg"],
    trailer: "https://www.youtube.com/watch?v=example2",
    synopsis: "Following three generations of market women in Accra, this documentary reveals how these ambitious entrepreneurs maintain complex trade networks and wield significant economic power.",
    quotes: [
      { quote: "An eye-opening look at female entrepreneurship in West Africa", source: "Global Documentary Review" }
    ],
    rating: 4.6
  }
];

// Sample productions data
export const productions = [
  {
    title: "Ghana: Untold Stories",
    slug: "ghana-untold",
    category: "Anthology Series",
    status: "In Production",
    description: "An anthology series exploring hidden narratives from Ghanaian history",
    longDescription: "Each episode of this anthology series focuses on a forgotten or overlooked story from Ghana's rich historical tapestry, bringing to light the untold tales that shaped the nation we know today.",
    image: "/images/productions/ghana-untold.jpg",
    progress: 60,
    director: "Kofi Mensah",
    producer: "Ama Boateng",
    cinematographer: "Kwame Asante",
    editor: "Abena Mensah",
    timeline: "Production began January 2023, expected completion December 2023",
    startDate: "January 15, 2023",
    estimatedCompletion: "December 20, 2023",
    locations: ["Accra", "Cape Coast", "Kumasi", "Northern Region"],
    logline: "Forgotten heroes, buried secrets, and pivotal moments in Ghana's history come to light in this groundbreaking anthology series.",
    synopsis: "Ghana: Untold Stories delves into the lesser-known aspects of Ghana's past, from pre-colonial kingdoms to the struggle for independence and beyond. Through dramatic recreations and expert interviews, the series aims to educate and inspire audiences with stories of resilience, innovation, and cultural significance.",
    team: [
      { role: "Historical Consultant", name: "Professor Akosua Perbi" },
      { role: "Production Designer", name: "Daniel Quaye" }
    ],
    updates: [
      { date: "May 20, 2023", title: "Episode 3 Filming Complete", content: "We've finished filming the third episode focusing on the Yaa Asantewaa War." }
    ],
    stages: [
      { name: "Research & Development", status: "Completed", percentage: 100 },
      { name: "Pre-Production", status: "Completed", percentage: 100 },
      { name: "Production", status: "In Progress", percentage: 60 },
      { name: "Post-Production", status: "Not Started", percentage: 0 }
    ],
    supportOptions: [
      { title: "Location Access", description: "Help us gain access to historical sites for filming" },
      { title: "Historical Artifacts", description: "Loan period-appropriate items for authentic set design" }
    ],
    faq: [
      { question: "When will the series be released?", answer: "We anticipate a premiere in early 2024, with distribution details to be announced." }
    ]
  },
  {
    title: "Across the Continent",
    slug: "across-continent",
    category: "Documentary Series",
    status: "Pre-Production",
    description: "A pan-African documentary series celebrating cultural connections",
    longDescription: "This ambitious documentary project will take viewers on a journey across Africa, exploring the cultural threads that connect different regions and revealing surprising commonalities in traditions, arts, and values.",
    image: "/images/productions/across-continent.jpg",
    progress: 30,
    director: "Emmanuel Koffi",
    producer: "Nana Adwoa",
    cinematographer: "Joseph Quarcoo",
    editor: "Efua Owusu",
    timeline: "Pre-production began March 2023, filming starts September 2023",
    startDate: "March 10, 2023",
    estimatedCompletion: "June 30, 2024",
    locations: ["Ghana", "Kenya", "Senegal", "South Africa", "Ethiopia", "Morocco"],
    logline: "One continent, countless stories, interconnected by threads of shared humanity.",
    synopsis: "Across the Continent takes viewers on an epic journey through Africa's diverse cultures, highlighting the historic trade routes, migration patterns, and cultural exchanges that have shaped the continent. Each episode focuses on a different theme—music, food, spirituality, craft—demonstrating how these cultural expressions vary yet remain connected across regions.",
    team: [
      { role: "Research Coordinator", name: "Fatima Nkrumah" },
      { role: "Location Manager", name: "Jean-Pierre Ouedraogo" }
    ],
    updates: [
      { date: "April 15, 2023", title: "Research Phase Complete", content: "Our team has finalized episode themes and key filming locations." }
    ],
    stages: [
      { name: "Concept Development", status: "Completed", percentage: 100 },
      { name: "Research", status: "Completed", percentage: 100 },
      { name: "Pre-Production", status: "In Progress", percentage: 60 },
      { name: "Production", status: "Not Started", percentage: 0 },
      { name: "Post-Production", status: "Not Started", percentage: 0 }
    ],
    supportOptions: [
      { title: "Local Fixers", description: "Connect us with local guides and translators in filming locations" },
      { title: "Cultural Consultants", description: "Provide expertise on regional traditions and practices" }
    ],
    faq: [
      { question: "How can I follow the progress of this production?", answer: "Sign up for our newsletter for regular updates from the field." }
    ]
  }
];
