import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createScheme } from '@/requests/friends/create';
import prisma from '../../../../lib/prisma';

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

        let authUser = await prisma.user.findUnique({
            where: {
                refId: userId,
            },
        });

        if (!authUser) {
            return new Response('User not found', { status: 401 });
        }

        if (data.type === 'FRIEND' && data.id) {
            await prisma.friend.update({
                where: {
                    id: data.id.toHexString(),
                },
                data: {
                    status: 'FRIEND',
                },
            });

            return NextResponse.json({
                status: 200,
                message: 'Successfully accepted the friend request.',
                data: null,
            });
        }

        if (
            data.type === 'UNFRIEND' ||
            data.type === 'CANCEL_REQUEST' ||
            data.type === 'REJECT'
        ) {
            await prisma.friend.deleteMany({
                where: {
                    OR: [
                        {
                            fromUserId: authUser.id,
                            toUserId: data.requestTo?.toHexString(),
                        },
                        {
                            fromUserId: data.requestTo?.toHexString(),
                            toUserId: authUser.id,
                        },
                    ],
                },
            });

            return NextResponse.json({
                status: 200,
                message:
                    data.type === 'UNFRIEND'
                        ? 'Successfully unfriended'
                        : 'Successfully cancelled request',
                data: null,
            });
        }

        let checkFriend = await prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        fromUserId: authUser.id,
                        toUserId: data.requestTo?.toHexString(),
                    },
                    {
                        fromUserId: data.requestTo?.toHexString(),
                        toUserId: authUser.id,
                    },
                ],
            },
        });

        if (checkFriend) {
            return NextResponse.json(
                {
                    err: "already exists in your friend's list",
                    status: 400,
                    message: "already exists in your friend's list",
                },
                { status: 422 },
            );
        }

        let friend = await prisma.friend.create({
            data: {
                from: {
                    connect: {
                        id: authUser.id,
                    },
                },
                to: {
                    connect: {
                        id: data.requestTo?.toHexString(),
                    },
                },
                status: data.type,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Successfully posted.',
            data: friend,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.stack,
        });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        let authUser = await prisma.user.findUnique({
            where: {
                refId: userId,
            },
        });

        if (!authUser) {
            return new Response('User not found', { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: authUser.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
            },
        });

        const payload = {
            notifications: notifications,
            unreadCount: notifications.filter(
                (notification) => !notification.isRead,
            ).length,
        };

        return NextResponse.json({
            status: 200,
            message: 'Successfully posted.',
            data: payload,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.stack,
        });
    }
}
