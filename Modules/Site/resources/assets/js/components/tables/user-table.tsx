import { useContext, useEffect } from 'react';

import DefaultTable, { SearchComponent } from '@core/components/tables/default-table';
import { Checkbox } from '@/components/ui/checkbox';
import { apiGet } from '@core/lib/api';
import { Role, User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

export default function CompanyUserTable() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        apiGet('/user').then((res) => {
            setUsers(res);
        });
    }, []);

    const columns: ColumnDef<User>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <div className="w-[150px] truncate">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <div className="w-[200px] truncate">{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'roles',
            header: 'Role',
            cell: ({ row }) => (
                <div className="max-w-[150px] truncate">
                    {row.original.roles
                        ?.map((role: Role) => {
                            return role.name
                                .split('_')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
                        })
                        .join(', ')}
                </div>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => <div>Actions</div>,
        },
    ];

    const searchComponent: SearchComponent[] = [
        {
            column: 'name',
            placeholder: 'Search by name',
        },
        {
            column: 'email',
            placeholder: 'Search by email',
        },
    ];

    return <DefaultTable columns={columns} data={users} searchComponent={searchComponent} />;
}
