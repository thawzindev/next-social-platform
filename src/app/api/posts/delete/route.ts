import { createScheme } from '@/requests/posts/create';
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const body = await request.json();

        if (!body.postId) {
            return NextResponse.json(
                { status: 400, error: 'postid required' },
                { status: 400 },
            );
        }

        let user = await prisma.user.findUnique({
            where: {
                refId: userId,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 401 },
            );
        }

        // Fetch the user's friends
        const post = await prisma.post.findFirst({
            where: {
                id: body.postId,
            },
        });

        let deletePost = {};

        if (post) {
            // Create a notification for friend

            await prisma.notification.deleteMany({
                where: {
                    postId: body.postId,
                },
            });

            // Delete comments related to the post
            await prisma.comment.deleteMany({
                where: {
                    postId: body.postId,
                },
            });

            // Delete comments related to the post
            await prisma.like.deleteMany({
                where: {
                    postId: body.postId,
                },
            });

            deletePost = await prisma.post.delete({
                where: {
                    id: body.postId,
                },
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Successfully commented.',
            data: deletePost,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.message,
        });
    }
}
