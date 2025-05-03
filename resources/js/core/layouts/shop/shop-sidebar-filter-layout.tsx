import Filter from '@/core/pages/shop/filter';
import Listing from '@/core/pages/shop/listing';
import Search from '@/core/pages/shop/search';
import { PropsWithChildren } from 'react';
export default function ShopSidebarFilterLayout({ children }: PropsWithChildren) {
    return (
        <>
            <main className="bg-background flex">
                <Filter />
                <div className="flex h-screen w-full flex-col pe-2">
                    <Search />
                    <Listing />
                </div>
            </main>
            {children}
        </>
    );
}
