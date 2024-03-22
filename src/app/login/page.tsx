'use client';

// importing necessary functions
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import {
    AiFillGithub,
    AiFillGoogleCircle,
    AiFillInstagram,
} from 'react-icons/ai';
import { BiLogoGoogle } from 'react-icons/bi';

export default function Login() {
    // extracting data from usesession as session
    const { data: session } = useSession();

    // checking if sessions exists
    if (session) {
        // rendering components for logged in users
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <div className="relative mb-4 h-44 w-44">
                    <Image
                        src={session.user?.image as string}
                        fill
                        alt=""
                        className="rounded-full object-cover"
                    />
                </div>
                <p className="mb-2 text-2xl">
                    Welcome{' '}
                    <span className="font-bold">{session.user?.name}</span>.
                    Signed In As
                </p>
                <p className="mb-4 font-bold">{session.user?.email}</p>
                <button
                    className="rounded-md bg-red-600 px-6 py-2"
                    onClick={() => signOut()}
                >
                    Sign out
                </button>
            </div>
        );
    }

    // rendering components for not logged in users
    return (
        <div className="flex min-h-screen flex-1">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10">
                        <div className="mt-10">
                            <div className="mt-6 grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => signIn('google')}
                                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                                >
                                    <BiLogoGoogle className="h-5 w-5" />
                                    <span className="text-sm font-semibold leading-6">
                                        SignIn With Google
                                    </span>
                                </button>

                                <button
                                    onClick={() => signIn('github')}
                                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                                >
                                    <AiFillGithub className="h-5 w-5" />
                                    <span className="text-sm font-semibold leading-6">
                                        SignIn With GitHub
                                    </span>
                                </button>

                                <button
                                    onClick={() => signIn('instagram')}
                                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                                >
                                    <AiFillInstagram className="h-5 w-5" />
                                    <span className="text-sm font-semibold leading-6">
                                        SignIn With Instagram
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                    alt=""
                    layout="fill"
                />
            </div>
        </div>
    );
}
