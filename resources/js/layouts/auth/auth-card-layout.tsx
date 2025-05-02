import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div
            className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 bg-cover bg-center p-6 backdrop-blur-sm md:p-10"
            style={{ backgroundImage: 'url(storage/branding/auth-bg.jpg)' }}
        >
            <div className="bg-background/30 absolute inset-0" style={{ backdropFilter: 'blur(3px)' }}></div>
            <div className="flex w-full max-w-md flex-col gap-6 z-20">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-20 w-20 items-center justify-center">
                        <AppLogoIcon className="fill-current text-black dark:text-white w-full h-full" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="bg-secondary rounded-xl backdrop-blur-sm">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
