import { BlogPost } from '@/types/story';

export const filterPosts = (
  posts: BlogPost[],
  category: string = 'All Categories',
  searchQuery: string = ''
): BlogPost[] => {
  return posts.filter(post =>
    (category === "All Categories" || post.category === category) &&
    (searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );
};

export const paginatePosts = (
  posts: BlogPost[],
  currentPage: number = 1,
  postsPerPage: number = 6
): {
  currentPosts: BlogPost[],
  totalPages: number
} => {
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return { currentPosts, totalPages };
};
