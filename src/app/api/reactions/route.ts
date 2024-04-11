import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { createScheme } from '@/requests/reactions/create';
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
    const { userId: authUserId } = auth();

    const body = await request.json();

    let action = 'like';

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

    let reaction = await prisma.like.findFirst({
        where: {
            postId: body.postId,
            userId: authUser.id,
        },
    });

    if (reaction) {
        await prisma.like.delete({
            where: {
                id: reaction.id,
            },
        });

        action = 'dislike';
    } else {
        reaction = await prisma.like.create({
            data: {
                // userId: authUser.id,
                // postId: body.postId,
                user: {
                    connect: {
                        id: authUser.id,
                    },
                },
                post: {
                    connect: {
                        id: body.postId,
                    },
                },
            },
        });
    }

    if (action === 'like') {
        // Fetch the user's friends
        const owner = await prisma.user.findFirst({
            where: {
                id: reaction.userId,
            },
        });

        if (owner) {
            await prisma.notification.create({
                data: {
                    userId: owner.id,
                    content: `${authUser.name} has reacted your post.`,
                    postId: data.postId,
                },
            });
        }
    } else if (action === 'dislike') {
        await prisma.notification.deleteMany({
            where: {
                postId: reaction.postId,
                userId: reaction.userId,
            },
        });
    }

    let totalReactions = await prisma.like.count({
        where: {
            postId: body.postId,
        },
    });

    let payload = {
        id: reaction.id,
        postId: data.postId,
        userId: authUser.id,
        action: action,
        likeCount: totalReactions,
    };

    return NextResponse.json({
        status: 200,
        message: 'Successful.',
        data: payload,
    });
}
