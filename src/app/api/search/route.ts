import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { createScheme } from '@/requests/reactions/create';
import { auth } from '@clerk/nextjs';
import { error } from 'console';

export async function GET(request: NextRequest) {
    const { userId: authUserId } = auth();

    const keywords = request.nextUrl.searchParams.get('keywords');

    if (!keywords) {
        return NextResponse.json(
            { error: 'Provide keywords' },
            { status: 401 },
        );
    }

    let authUser = await prisma.user.findUnique({
        where: {
            refId: authUserId?.toString(),
        },
    });

    if (!authUser) {
        return NextResponse.json(
            { error: 'authUser not found' },
            { status: 401 },
        );
    }

    let posts = await prisma.post.findMany({
        where: {
            content: {
                contains: keywords,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 20,
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

    let people = await prisma.user.findMany({
        where: {
            name: {
                contains: keywords,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    });

    const payload = {
        people: people,
        posts: posts,
    };

    return NextResponse.json({
        status: 200,
        message: 'Successful.',
        data: payload,
    });
}
