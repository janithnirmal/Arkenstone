import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Arkenstone, ArkenstoneLogo } from './dashboard';
import Config from '../config';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        fetch('/api/auth-test', {
            headers: {
                Accept: 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    }, []);

    function toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullScreen(false);
        } else {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        }
    }

    return (
        <>
            <Head title="Namarie">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div
                className="relative bg-cover"
                style={{
                    backgroundImage: 'url(/storage/branding/auth-bg.jpg)',
                }}
            >
                <div className="bg-background/60 absolute inset-0" style={{ backdropFilter: 'blur(3px)' }}></div>
                <div className="flex min-h-screen flex-col items-center p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                    <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                        <nav className="flex items-center justify-end gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>
                    <div className="relative flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                        <main className="flex w-full max-w-[335px] flex-col items-center justify-center gap-2 lg:max-w-4xl">
                            <ArkenstoneLogo className="animate-pulse text-6xl" />
                            <Arkenstone className="text-9xl" />
                            <p className="text-center text-lg text-neutral-800 dark:text-neutral-400">
                                A platform for creating and managing your own E Commerce website.
                            </p>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Walk In
                            </Link>
                            <p className="text-center text-sm text-neutral-800 dark:text-neutral-200">Version (Beta) {Config.appVersion}</p>
                            <p className="text-center text-sm text-neutral-800 dark:text-neutral-200">
                                Developed by{' '}
                                <Link href={Config.appAuthorUrl} className="text-primary">
                                    {Config.appAuthor}
                                </Link>
                            </p>
                            <hr className="w-full my-5" />
                            <button
                                type="button"
                                onClick={toggleFullScreen}
                                className="text-center text-sm text-neutral-800 dark:text-neutral-200"
                            >
                                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
                        </main>
                    </div>
                    <div className="hidden h-14.5 lg:block"></div>
                </div>
            </div>
        </>
    );
}
