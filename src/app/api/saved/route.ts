import { createScheme } from '@/requests/posts/create';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        let authUser = await prisma.user.findUnique({
            where: {
                refId: userId?.toString(),
            },
        });

        if (!authUser) {
            return new Response('authUser not found', { status: 401 });
        }

        const page = Number(request.nextUrl.searchParams.get('page')) || 1;
        const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const reqUserId = request.nextUrl.searchParams.get('userId');

        let privacyFilter = {};
        if (reqUserId === authUser.id) {
            // If reqUserId is authUser.id, remove privacy filter
            privacyFilter = {};
        } else {
            // If reqUserId is not authUser.id, add privacy as "PUBLIC"
            privacyFilter = { privacy: 'PUBLIC' };
        }

        const totalPosts = await prisma.post.count({
            where: {
                ...privacyFilter,
                userId: reqUserId ?? undefined,
                OR: [
                    {
                        deletedAdminId: {
                            isSet: false,
                        },
                    },
                    {
                        deletedAdminId: null,
                    },
                ],
            },
        });

        const posts = await prisma.post.findMany({
            where: {
                userId: reqUserId ?? undefined,
                OR: [
                    {
                        deletedAdminId: {
                            isSet: false,
                        },
                    },
                    {
                        deletedAdminId: null,
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: skip,
            include: {
                file: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        refId: true,
                        profileImage: true,
                    },
                },
                Like: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
                Bookmark: {
                    select: {
                        id: true,
                        userId: true,
                        postId: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        postId: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        const postsWithLikeCount = posts.map((post) => ({
            ...post,
            likeCount: post.Like.length,
            commentCount: post.comments.length,
            userId: authUser.id,
        }));

        return NextResponse.json({
            data: postsWithLikeCount,
            meta: {
                total: totalPosts,
                page: page,
                limit: limit,
            },
            status: 200,
            message: 'success',
        });
    } catch (error) {
        return NextResponse.json({
            err: error.stack,
            status: 500,
            message: 'failed',
        });
    }
}
