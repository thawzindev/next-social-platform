import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { userId: authUserId } = auth();

        let authUser = await prisma.user.findUnique({
            where: {
                refId: authUserId?.toString(),
            },
        });

        if (!authUser) {
            return new Response('authUser not found', { status: 401 });
        }

        const lists = await prisma.friend.findMany({
            where: {
                toUserId: authUser.id,
                status: 'FRIEND_PENDING',
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                from: true,
            },
        });

        return NextResponse.json({
            data: lists,
            status: 200,
            message: 'success',
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.stack,
        });
    }
}
