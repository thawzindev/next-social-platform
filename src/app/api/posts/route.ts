import { createScheme } from '@/requests/posts/create';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

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

        const reqUserId = request.nextUrl.searchParams.get('userId');

        const posts = await prisma.post.findMany({
            where: {
                userId: reqUserId ?? undefined,
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
            },
        });

        const postsWithLikeCount = posts.map((post) => ({
            ...post,
            likeCount: post.Like.length,
            userId: authUser.id,
        }));

        return NextResponse.json({
            data: postsWithLikeCount,
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

        console.log('user id ', userId);

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
