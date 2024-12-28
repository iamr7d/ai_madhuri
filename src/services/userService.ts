import axios from 'axios';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  status: 'online' | 'offline';
  avatar: string;
  department: string;
  phoneNumber: string;
}

const API_URL = 'http://localhost:3000/api';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  },

  updateUser: async (user: User): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${user.id}`, user);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  },
};

export default userService;
