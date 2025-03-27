import { User } from '@/types/mongodbSchema';

export interface UserWithoutPassword extends Omit<User, 'password'> {
  password?: never;
}

// Fetch all users (admin only)
export const fetchUsers = async (): Promise<UserWithoutPassword[]> => {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch users: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch a single user by ID
export const fetchUserById = async (userId: string): Promise<UserWithoutPassword> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch user: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Create a new user (admin only)
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<UserWithoutPassword> => {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create user: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update a user (admin only)
export const updateUser = async (
  userId: string,
  userData: Partial<Omit<User, 'id' | 'password'>>
): Promise<UserWithoutPassword> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update user: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete a user (admin only)
export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete user: ${response.status}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

// For dashboard components that need placeholder data if fetch fails
export const getFallbackUsers = (): UserWithoutPassword[] => [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@rielfilms.com',
    image: '/images/avatar/1.jpg',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Ama Serwaa',
    email: 'ama@rielfilms.com',
    image: '/images/hero/hero3.jpg',
    role: 'editor',
    createdAt: new Date(),
    updatedAt: new Date()
  },
];
