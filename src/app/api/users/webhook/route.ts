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

        const first_name = json.data.first_name;
        const last_name = json.data.last_name;

        const name = `${first_name} ${last_name ? last_name : ''}`.trim();

        let loginType = '';

        if (json.data.external_accounts[0].object === 'google_account') {
            loginType = 'GOOGLE';
        } else if (json.data.external_accounts[0].provider === 'oauth_apple') {
            loginType = 'APPLE';
        }

        let user = await prisma.user.create({
            data: {
                name: name,
                email: json.data.email_addresses[0].email_address,
                profileImage: json.data.image_url,
                loginType: loginType,
                refId: json.data.id,
                // provider: loginType,
            },
        });

        cookies().set('userId', user.id);

        const url =
            'https://api-2253F2DD-7980-4BB3-9D5B-2855D2013F8E.sendbird.com/v3/users';
        const headers = {
            'Api-Token': '1207ad8cf4931ee9a600ee32bda3a48e51a78197',
        };

        const body = {
            user_id: json.data.id,
            nickname: name,
            profile_url: user.profileImage,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error?.stack });
    }
}
