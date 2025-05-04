import Button from '@/components/custom/button';
import { FilterContext, FilterOptions, FilterOptionsValueMap } from '@/core/layouts/shop/shop-sidebar-filter-layout';
import { apiGet } from '@/core/lib/api';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

export function Filter({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
    return (
        <div
            className={cn(
                'bg-muted absolute top-0 left-0 z-50 m-2 hidden h-[97.5vh] w-[95%] rounded-xl p-3 shadow-2xl lg:relative lg:max-h-full lg:w-96',
                isOpen && 'flex flex-col',
            )}
        >
            <div className="flex items-center justify-between">
                <h2 className="mb-2 text-lg font-semibold">Filter</h2>
                <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="flex max-h-screen flex-col gap-2 overflow-y-auto pe-2">
                <Filter.Section uri="/category" title="Categories" filterOptionKey="categories" />
                {/* Add more Filter.Section components here for other filter types */}
            </div>
        </div>
    );
}

Filter.Section = function FilterSection<K extends keyof FilterOptions>({
    uri,
    title,
    filterOptionKey,
}: {
    uri: string;
    title: string;
    filterOptionKey: K;
}) {
    const { updateFilter } = useContext(FilterContext);
    const [dataSet, setDataSet] = useState<FilterOptionsValueMap[K]>();
    const [selectedData, setSelectedData] = useState<FilterOptionsValueMap[K]>();

    useEffect(() => {
        apiGet(uri).then((res) => {
            setDataSet(res);
        });
    }, [uri]);

    useEffect(() => {
        updateFilter(filterOptionKey, selectedData as FilterOptionsValueMap[K]);
    }, [selectedData]);

    return (
        <div className="border-muted-foreground/30 flex flex-col gap-2 rounded-lg border p-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex h-42 flex-wrap gap-2 overflow-y-auto">
                {Array.isArray(dataSet) &&
                    dataSet.map((data: any) => (
                        <Button
                            variant={selectedData?.includes(data) ? 'selected-primary' : 'outline'}
                            size="sm"
                            className="w-max"
                            key={data.id}
                            onClick={() => {
                                if (selectedData?.includes(data)) {
                                    setSelectedData(selectedData?.filter((item: any) => item.id !== data.id));
                                } else {
                                    setSelectedData([...(selectedData || []), data]);
                                }
                            }}
                        >
                            {data.name}
                        </Button>
                    ))}
            </div>
        </div>
    );
};

export default Filter;
