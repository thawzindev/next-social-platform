import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { createScheme } from '@/requests/reactions/create';
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
    const { userId: authUserId } = auth();

    const body = await request.json();

    const { success, data, error } = createScheme.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { status: 400, error: error.issues[0].message },
            { status: 400 },
        );
    }

    let authUser = await prisma.user.findUnique({
        where: {
            refId: authUserId?.toString(),
        },
    });

    if (!authUser) {
        return new Response('authUser not found', { status: 401 });
    }

    let post = await prisma.like.findFirst({
        where: {
            postId: body.postId,
            userId: authUser.id,
        },
    });

    if (post) {
        await prisma.like.delete({
            where: {
                id: post.id,
            },
        });
    } else {
        post = await prisma.like.create({
            data: {
                postId: body.postId,
                userId: authUser.id,
                commentId: '', // Add the required commentId property here
            },
        });
    }

    let totalReactions = await prisma.like.count({
        where: {
            postId: body.postId,
        },
    });

    let payload = {
        id: post.id,
        postId: post.postId,
        userId: post.userId,
        action: 'like',
        totalReactions: totalReactions,
    };

    return NextResponse.json({
        status: 200,
        message: 'Successful.',
        data: payload,
    });
}
