import PageFooter from '../../components/page/footer';
import PageHeader from '../../components/page/header';

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
