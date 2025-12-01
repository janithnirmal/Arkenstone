import { Head } from "@inertiajs/react";

export interface TestLayoutConfig {
    title: string;
    compName: string;
    compDescription: string;
}

interface TestLayoutProps {
    children: React.ReactNode;
    config: TestLayoutConfig;
}

export default function TestLayout({ children, config }: TestLayoutProps) {
    return (
        <>
            <Head title={config.title} />
            <div className="text-slate-100 w-full bg-slate-900 min-h-screen">
                <div className="py-16 container mx-auto">
                    <h1 className="text-2xl font-bold text-center">
                        {config.title} | Test Environment
                    </h1>
                    <hr className="my-4 border-slate-600" />

                    <div className="bg-slate-800 p-4 rounded-2xl shadow-2xl">
                        <h2 className="text-xl font-bold">
                            Component Name : {config.compName}
                        </h2>
                        <p className="text-sm text-slate-300">
                            Component Description
                        </p>
                        <p className="text-sm text-slate-400">
                            {config.compDescription}
                        </p>
                    </div>
                    <hr className="my-4 border-slate-600" />
                    {children}
                </div>
            </div>
        </>
    );
}
