export interface Post {
    id: string;
    content: string;
    userId: string;
    privacy: string;
    fileId: string;
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    Like: [];
    file?: File;
    user: User;
}

interface File {
    id: string;
    path: string;
    format: string;
    resourceType: string;
    metadata: Metadata;
    fullUrl: string;
    width: string;
    height: string;
    createdAt: string;
    updatedAt: string;
}

interface Metadata {
    width: number;
    height: number;
    bytes: number;
    asset_id: string;
    public_id: string;
}

interface User {
    id: number;
    name: number;
    refId: number;
    profileImage: string;
}
