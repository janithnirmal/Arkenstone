import { Head } from "@inertiajs/react";
import AppLayout from "../layouts/app-layout";;
export default function Test() {
    return (
        <AppLayout>
            <Head title="Test" />
            <div className="p-5">
                <h1>Test</h1>
            </div>
        </AppLayout>
    )
}