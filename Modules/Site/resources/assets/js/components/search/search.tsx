import { Search as SearchIcon } from "lucide-react"

export default function Search() {
    return (
        <div className="flex items-center w-full rounded-sm max-w-sm bg-gray-200 px-4 py-4">
            <SearchIcon className="w-4 h-4 text-black" />
            <input
                type="text"
                placeholder="Search"
                className="ml-2 w-full bg-transparent text-right text-sm text-black placeholder-black focus:outline-none"
                style={{ fontFamily: 'BeatriceDeckTRIAL', letterSpacing: '0.12em' }}
            />
        </div>
    );
}