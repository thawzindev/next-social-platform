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
    if (page) url = `posts?page=${page}`;
    const response = await httpClient.get(url);
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

export const makeReaction = async (payload: any) => {
    const response = await httpClient.post(`reactions`, payload);
    return response?.data as any;
};

export const makeBookmark = async (payload: any) => {
    const response = await httpClient.post(`bookmarks`, payload);
    return response?.data as any;
};

export const postComments = async (postId: string) => {
    const response = await httpClient.get(`posts/comments?postId=${postId}`);
    return response?.data as any;
};

export const makeComment = async (payload: any) => {
    const response = await httpClient.post(`posts/comments`, payload);
    return response?.data as any;
};

export const searchResult = async (keywords: string) => {
    const response = await httpClient.get(`search?keywords=${keywords}`);
    return response?.data as any;
};

export const getNotifications = async () => {
    const response = await httpClient.get(`notifications`);
    return response?.data as any;
};

export const getUnReadNotificationCount = async () => {
    const response = await httpClient.get(`notifications/unread-count`);
    return response?.data as any;
};

export const readNotification = async (payload: any) => {
    const response = await httpClient.post(`notifications/read`, payload);
    return response?.data as any;
};

export const getPostDetail = async (id: string) => {
    const response = await httpClient.get(`posts/detail?id=${id}`);
    return response?.data as any;
};

export const deletePost = async (id: string, payload: any) => {
    const response = await httpClient.post(`posts/delete?id=${id}`, payload);
    return response?.data as any;
};

export const reportPost = async (id: string, payload: any) => {
    const response = await httpClient.post(`reports/posts/?id=${id}`, payload);
    return response?.data as any;
};

export const createPost = async (payload: any) => {
    const response = await httpClient.post(`posts`, payload);
    return response?.data as any;
};

export const savedPost = async () => {
    const response = await httpClient.get(`bookmarks`);
    return response?.data as any;
};

export const reportComment = async (id: string, payload: any) => {
    const response = await httpClient.post(
        `reports/comments/?id=${id}`,
        payload,
    );
    return response?.data as any;
};
