// resources/js/modules/products/components/catalog/Pagination.tsx

import React from 'react';
import { PaginationLink } from '../../types/http.types';

interface Props {
    links: PaginationLink[];
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ links, onPageChange }) => {
    // Helper to extract page number from URL
    const getPageNumber = (url: string | null): number | null => {
        if (!url) return null;
        try {
            const pageUrl = new URL(url);
            const page = pageUrl.searchParams.get('page');
            return page ? parseInt(page, 10) : null;
        } catch (error) {
            return null;
        }
    };
    
    return (
        <nav className="flex items-center justify-center space-x-1 mt-8">
            {links.map((link, index) => {
                const page = getPageNumber(link.url);
                
                // Don't render if it's not a valid page link
                if (!page) return null;

                return (
                    <button
                        key={index}
                        onClick={() => page && onPageChange(page)}
                        disabled={link.active || !link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-4 py-2 text-sm rounded-md transition-colors
                            ${link.active ? 'bg-blue-600 text-white cursor-default' : 'bg-white text-gray-700 hover:bg-gray-100'}
                            ${!link.url ? 'text-gray-400 cursor-not-allowed' : ''}
                        `}
                    />
                );
            })}
        </nav>
    );
};

export default Pagination;