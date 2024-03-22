import { getServerSession } from 'next-auth/next';

export async function getSession() {
    return await getServerSession();
}

export default async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session?.user) {
            return null;
        }

        return session;
    } catch (error: any) {
        return null;
    }
}
