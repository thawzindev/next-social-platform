import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { createScheme } from '@/requests/bookmarks/create';

cloudinary.config({
    cloud_name: 'ditqvgwyd',
    api_key: '898767255852921',
    api_secret: 'Afqh8m1O_n3kq1W0b4jUzttfm1U',
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { userId } = auth();

        let action = 'store';

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

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

        let bookmark = await prisma.bookmark.findFirst({
            where: {
                postId: body.postId,
                userId: authUser.id,
            },
        });

        if (bookmark) {
            await prisma.bookmark.delete({
                where: {
                    id: bookmark.id,
                },
            });
            action = 'unstore';
        } else {
            bookmark = await prisma.bookmark.create({
                data: {
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

        let payload = {
            id: bookmark.id,
            postId: bookmark.postId,
            userId: bookmark.userId,
            action: action,
        };

        return NextResponse.json({
            status: 200,
            message: 'Successful.',
            data: payload,
        });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error?.stack });
    }
}
