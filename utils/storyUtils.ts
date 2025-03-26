import { Story } from '@/types/mongodbSchema';
// import { BlogPost } from '@/types/story';

// type StoryType = Story | BlogPost;

export const filterPosts = (
  posts: Story[],
  category: string,
  searchQuery: string
): Story[] => {
  return posts.filter(post => {
    const matchesCategory =
      category === 'All Categories' ||
      post.category === category;

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
};


export const paginatePosts = (
  posts: Story[],
  currentPage: number,
  postsPerPage: number
) => {
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return {
    currentPosts,
    totalPages
  };
};
