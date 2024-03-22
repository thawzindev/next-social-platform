import { schema } from '@/requests/users/create';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const { success, data, error } = schema.safeParse({
        name: 'John Doe',
        email: 'ff',
    });

    if (!success) {
        return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    const slug = params.id;
    const paramGreeting = request.nextUrl.searchParams.get('greeting');
    const greeting = `${paramGreeting || 'Hello'} ${slug}!!!`;
    const json = {
        greeting,
    };
    return NextResponse.json(json);
}
