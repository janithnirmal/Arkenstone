import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/pages/errors/something-went-wrong';

export type SearchComponent = {
    column: string;
    placeholder?: string;
    className?: string;
};

export default function DefaultTable({
    children,
    actionButtons,
    data,
    columns,
    searchComponent,
    searchConfig = { placement: 'inline' },
}: {
    children?: React.ReactNode;
    actionButtons?: React.ReactNode;
    data: any[];
    columns: ColumnDef<any>[];
    searchComponent?: SearchComponent[];
    searchConfig?: {
        placement?: 'inline' | 'top';
    };
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination: {
                pageIndex: 0, // current page
                pageSize: 7, // ✅ this controls the limit
            },
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <ErrorBoundary>
            {children && (
                <>
                    <div className="w-full rounded-4xl p-1">{children}</div>
                    <hr />
                </>
            )}

            <div className="flex w-full flex-col gap-2">
                {searchConfig.placement === 'top' && (
                    <>
                        <h4 className="text-muted text-md ps-2 pb-1">Search</h4>
                        <div className="grid max-w-[1920px] grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                            {searchComponent?.map((component, index) => {
                                return (
                                    <Input
                                        key={component.column}
                                        placeholder={component.placeholder ?? 'Search....'}
                                        value={(table.getColumn(component.column)?.getFilterValue() as string) ?? ''}
                                        onChange={(event) => {
                                            table.getColumn(component.column)?.setFilterValue(event.target.value);
                                        }}
                                        className={cn('w-full', component.className)}
                                    />
                                );
                            })}
                        </div>
                        <hr className="my-4" />
                    </>
                )}
                <div className="mb-2 flex flex-col items-start gap-2 lg:flex-row">
                    {searchConfig.placement === 'inline' && (
                        <div className="flex w-full flex-col gap-2">
                            <div className="flex w-full flex-wrap gap-2">
                                {searchComponent?.map((component, index) => {
                                    return (
                                        <Input
                                            key={component.column}
                                            placeholder={component.placeholder ?? 'Search....'}
                                            value={(table.getColumn(component.column)?.getFilterValue() as string) ?? ''}
                                            onChange={(event) => {
                                                table.getColumn(component.column)?.setFilterValue(event.target.value);
                                            }}
                                            className={cn('w-full md:max-w-[300px]', component.className)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="flex w-full flex-col items-center justify-end gap-2 md:w-max md:flex-row lg:self-end">
                        {actionButtons}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="w-full rounded-full lg:w-max">
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-muted-foreground flex-1 text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
