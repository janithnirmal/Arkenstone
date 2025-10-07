import { Toaster } from '@/components/ui/sonner';
import PageLayoutTemplate from './page/page-header-layout';

import type { PropsWithChildren } from 'react';

export default ({ children }: PropsWithChildren) => (
    <PageLayoutTemplate>
        {children}
        <Toaster />
    </PageLayoutTemplate>
);
