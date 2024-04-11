import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createScheme } from '@/requests/friends/create';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { status: 400, error: "Invalid request, 'id' is required" },
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

        const notification = await prisma.notification.update({
            where: {
                id: body.id,
            },
            data: {
                isRead: true,
            },
        });

        console.log(notification);

        return NextResponse.json({
            status: 200,
            message: 'Successfully read.',
            data: notification,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.stack,
        });
    }
}
