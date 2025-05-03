import { AppSidebar } from '@/components/app-sidebar';
import PageFooter from '@/core/components/page/footer';
import PageHeader, { HeaderItemProps } from '@/core/components/page/header';

import type { PropsWithChildren } from 'react';

export default function PageHeaderLayout({ children }: PropsWithChildren) {
    return (
        <>
            <PageHeader/>
            {children}
            <PageFooter />
        </>
    );
}
