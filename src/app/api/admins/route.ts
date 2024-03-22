import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { createScheme } from '@/requests/users/create';
const bcrypt = require('bcrypt');

export async function GET(request: NextRequest) {
    const greeting = 'Hello World ADMIN!!';
    const json = {
        greeting,
    };

    return NextResponse.json(json);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const { success, data, error } = createScheme.safeParse(body);

        if (!success) {
            return NextResponse.json(
                { status: 400, error: error.issues[0].message },
                { status: 400 },
            );
        }

        let checkExistedAdmin = await prisma.admin.findUnique({
            where: { email: data.email },
        });

        if (checkExistedAdmin) {
            return NextResponse.json(
                { error: 'Email already used.', status: 400 },
                { status: 400 },
            );
        }

        let hashedPassword = bcrypt.hashSync(data.password, 10);

        let admin = await prisma.admin.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        const { password, ...otherFields } = admin;

        return NextResponse.json({ status: 200, data: otherFields });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.stack }, { status: 500 });
    }
}
