import { PropsWithChildren } from 'react';
import PageLayout from './page-layout';
import ShopLayoutTemplate from './shop/shop-sidebar-filter-layout';



export default function ShopLayout({ children }: PropsWithChildren) {

    return (
        <PageLayout>
            <ShopLayoutTemplate>
                {children}
            </ShopLayoutTemplate>
        </PageLayout>
    );
}
