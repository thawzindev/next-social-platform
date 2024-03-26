import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { isObjectId } from '@/app/lib/utils';
import getCurrentUser from '@/app/lib/auth';
import { auth } from '@clerk/nextjs';
import prisma from '../../../../../lib/prisma';
import { createScheme } from '@/requests/comments/create';

export async function GET(request: NextRequest) {
    let postId = request.nextUrl.searchParams.get('postId') as string;
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
        return NextResponse.json(
            { error: 'authUser not found' },
            { status: 401 },
        );
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: postId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: true,
        },
    });

    return NextResponse.json({
        data: comments || [],
        status: 200,
        message: 'success',
    });
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

        let comment = await prisma.comment.create({
            data: {
                postId: data.postId,
                content: data.content,
                userId: user.id,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Successfully commented.',
            data: comment,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error?.message,
        });
    }
}
