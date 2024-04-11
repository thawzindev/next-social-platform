import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createScheme } from '@/requests/friends/create';
import prisma from '../../../../../lib/prisma';

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

        const notifications = await prisma.notification.count({
            where: {
                userId: authUser.id,
                isRead: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const payload = {
            unreadCount: notifications,
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
