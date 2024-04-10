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

        const totalPosts = await prisma.post.count({
            where: {
                userId: reqUserId ?? undefined,
            },
        });

        const posts = await prisma.post.findMany({
            where: {
                userId: reqUserId ?? undefined,
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
            },
        });

        const postsWithLikeCount = posts.map((post) => ({
            ...post,
            likeCount: post.Like.length,
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

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const body = await request.json();

        const { success, data, error } = createScheme.safeParse(body);

        if (!success) {
            return NextResponse.json(
                { status: 400, error: error.issues[0].message },
                { status: 400 },
            );
        }

        let user = await prisma.user.findUnique({
            where: {
                refId: userId,
            },
        });

        if (!user) {
            return new Response('User not found', { status: 401 });
        }

        let post = await prisma.post.create({
            data: {
                content: data.content,
                privacy: data.privacy,
                fileId: data.file?.toString() ?? null,
                userId: user.id,
            },
        });

        // Fetch the user's friends
        const friends = await prisma.friend.findMany({
            where: {
                OR: [{ fromUserId: user.id }, { toUserId: user.id }],
            },
        });

        console.log('friendssss', friends);

        // Create a notification for each friend
        for (const friend of friends) {
            await prisma.notification.create({
                data: {
                    userId:
                        friend.fromUserId === user.id
                            ? friend.toUserId
                            : friend.fromUserId,
                    content: `${user.name} has created a new post.`,
                    postId: post.id,
                },
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Successfully posted.',
            data: post,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.message,
        });
    }
}
