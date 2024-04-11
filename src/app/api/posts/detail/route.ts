import { createScheme } from '@/requests/posts/create';
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
import prisma from '../../../../../lib/prisma';

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

        const postId = request.nextUrl.searchParams.get('id');

        const post = await prisma.post.findFirst({
            where: {
                id: postId as string,
            },
            orderBy: {
                createdAt: 'desc',
            },
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
                        userId: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                refId: true,
                            },
                        },
                    },
                },
            },
        });

        if (post) {
            post['likeCount'] = post.Like.length;
            post['commentCount'] = post.comments.length;
        }

        return NextResponse.json({
            data: post,
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
