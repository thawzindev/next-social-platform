import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../../../lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { createScheme } from '@/requests/bookmarks/create';
import { exit } from 'process';

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

        if (!body.commentId || !body.reason || !body.postId) {
            return NextResponse.json(
                { status: 400, error: 'Require comment id and reason.' },
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

        const exitingReport = await prisma.report.findFirst({
            where: {
                commentId: body.commentId,
                postId: body.postId,
                reportUserId: authUser.id,
            },
        });

        if (exitingReport) {
            return NextResponse.json({
                status: 200,
                message: 'Successfully reported the comment.',
                data: exitingReport,
            });
        }

        const report = await prisma.report.create({
            data: {
                commentId: body.commentId,
                postId: body.postId,
                remarks: body.reason,
                reportUserId: authUser.id,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Successfully reported the comment.',
            data: report,
        });
    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error?.stack });
    }
}
