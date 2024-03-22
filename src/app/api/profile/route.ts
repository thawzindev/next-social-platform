import { createScheme } from '@/requests/posts/create';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { isObjectId } from '@/app/lib/utils';
import getCurrentUser from '@/app/lib/auth';
import { auth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
    let userId = request.nextUrl.searchParams.get('id') as string;
    const { userId: authUserId } = auth();

    if (!authUserId) {
        return NextResponse.json(
            {
                data: null,
                status: 400,
                message: 'bad request',
            },
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

    if (!userId) {
        userId = authUser.id;
    }

    const profile = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            gotRequests: true,
        },
    });

    profile['friendStatus'] = 'none';

    const res = profile?.gotRequests?.find((fri) => {
        return fri.fromUserId === authUser.id || fri.toUserId === authUser.id;
    });

    if (res) {
        profile['friendStatus'] = res.status;
    }

    return NextResponse.json({
        data: profile,
        status: 200,
        message: 'success',
    });
}
