interface User {
    id: string;
    refId: string;
    email: string;
    name: string;
    dateOfBirth: string | null;
    status: string;
    isProfileLocked: boolean;
    profileImage: string;
    loginType: string;
    createdAt: string;
    updatedAt: string;
}

export interface FriendRequest {
    imageUrl: string;
    id: string;
    fromUserId: string;
    toUserId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    from: User;
}
