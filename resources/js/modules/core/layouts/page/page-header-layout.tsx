import PageFooter from '@@/core/components/page/footer';
import PageHeader from '@@/core/components/page/header';

import type { PropsWithChildren } from 'react';

export default function PageHeaderLayout({ children }: PropsWithChildren) {
    return (
        <>
            <PageHeader />
            {children}
            <PageFooter />
        </>
    );
}
