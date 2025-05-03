import { AppSidebar } from '@/components/app-sidebar';
import PageFooter from '@/core/components/page/footer';
import PageHeader, { HeaderItemProps } from '@/core/components/page/header';

import type { PropsWithChildren } from 'react';

export default function PageHeaderLayout({ children, headerItems }: PropsWithChildren<{ headerItems?: HeaderItemProps[] }>) {
    return (
        <>
            <PageHeader items={headerItems} />
            {children}
            <PageFooter />
        </>
    );
}
