import { FilterContext } from '@/core/layouts/shop/shop-sidebar-filter-layout';
import { Input } from '@headlessui/react';
import { List, SearchIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

export default function Search({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
    const [search, setSearch] = useState('');
    const [canSearch, setCanSearch] = useState(false);

    const { filterOption, updateFilter } = useContext(FilterContext);

    function searchHandler() {
        if (search.length > 3 || search.length === 0) {
            setCanSearch(true);
        } else {
            setCanSearch(false);
        }
    }

    useEffect(() => {
        searchHandler();
    }, [search]);

    useEffect(() => {
        if (canSearch) {
            updateFilter('search', search);
            setCanSearch(false);
        }
    }, [canSearch]);

    return (
        <div className="flex h-16 flex-col items-center justify-center gap-2 p-3">
            <div className="flex w-full flex-row-reverse items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2 md:w-1/2 lg:w-1/4">
                    <Input
                        className="w-full rounded-full border-1 px-3 py-1.5"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={() => searchHandler()}
                    />
                    <SearchIcon className="cursor-pointer" />
                </div>
                {!isOpen && <List className="text-muted-foreground cursor-pointer" onClick={() => setIsOpen(true)} />}
            </div>
            <hr className="bg-muted h-1 w-full" />
        </div>
    );
}
