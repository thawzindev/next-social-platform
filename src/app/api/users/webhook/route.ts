import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { cookies } from 'next/headers';

enum LoginType {
    EMAIL,
    FACEBOOK,
    GITHUB,
    GOOGLE,
}

export async function GET(request: NextRequest) {
    const greeting = 'Hello World!!';
    const json = {
        greeting,
    };

    return NextResponse.json(json);
}

export async function POST(request: NextRequest) {
    try {
        let json = await request.json();

        // return NextResponse.json(json.data.external_accounts);

        let loginType = '';

        if (json.data.external_accounts[0].object === 'google_account') {
            loginType = 'GOOGLE';
        } else if (json.data.external_accounts[0].provider === 'oauth_apple') {
            loginType = 'APPLE';
        }

        let user = await prisma.user.create({
            data: {
                name: json.data.fist_name + json.data.last_name,
                email: json.data.email_addresses[0].email_address,
                profileImage: json.data.image_url,
                loginType: loginType,
                refId: json.data.id,
                // provider: loginType,
            },
        });

        cookies().set('userId', user.id);

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error?.stack });
    }
}
