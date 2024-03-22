import HttpClient from '@/app/lib/http-client';
import { FriendRequest } from '@/types/FriendRequest';
import { Post } from '@/types/Post';
import { Profile } from '@/types/Profile';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000/api/';
const httpClient = new HttpClient(baseUrl);

// slider
export const getPosts = async (page?: number, userId?: string) => {
    let url = 'posts';
    if (userId) url = `posts?userId=${userId}`;
    // if (page) url = `posts?page=${page}`;
    const response = await httpClient.get(url);
    console.log('posts response', response);
    return response ? (response.data as Post[]) : [];
};

export const getProfile = async (id?: string) => {
    let url = 'profile';
    if (id) {
        url = `profile?id=${id}`;
    }
    const response = await httpClient.get(url);
    return response?.data as Profile;
};

export const friendRequest = async (payload: any) => {
    const response = await httpClient.post(`friends/request`, payload);
    return response?.data as any;
};

export const friendRequestList = async () => {
    const response = await httpClient.get(`friends/request/list`);
    return response?.data as FriendRequest[];
};
