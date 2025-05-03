import { Toaster } from '@/components/ui/sonner';
import PageLayoutTemplate from '@/core/layouts/page/page-header-layout';
import type { PropsWithChildren } from 'react';
import { HeaderItemProps } from '../components/page/header';


export default ({ children }: PropsWithChildren) => (
    <PageLayoutTemplate>
        {children}
        <Toaster />
    </PageLayoutTemplate>
);
