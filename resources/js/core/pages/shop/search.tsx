import { Input } from "@headlessui/react";

export default function Search() {
    return <div className="p-3 h-16 flex flex-col items-center justify-center gap-2">
        <Input
            className="w-full md:w-1/2 lg:w-1/4 border-1 px-3 py-1.5 rounded-full"
            placeholder="Search"
        />
        <hr className="w-full h-1 bg-muted" />
    </div>;
}

