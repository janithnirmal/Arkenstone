import { useEffect } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Role, User } from '@/types';
import { Roles } from '@core/enum/Roles';
import { apiGet, apiPut } from '@core/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import SingleAdminDialog from '../../../../../../Core/resources/assets/js/components/dialogs/single-admin-dialog';
import DefaultTable, { SearchComponent } from '@core/components/tables/default-table';

export default function AdminTable({ children, isRefreshing }: { children?: React.ReactNode; isRefreshing: boolean }) {
    const [admins, setAdmins] = useState<User[]>([]);

    function fetchAdmins() {
        apiGet('/admin').then((res) => {
            setAdmins(res);
        });
    }

    useEffect(() => {
        fetchAdmins();
    }, [isRefreshing]);

    function getPrimaryAdminRole(roles: Role[]) {
        let adminRole = roles
            ?.map((role: Role) => {
                return role.name
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            })
            .filter((role) => role !== Roles.SUPER_ADMIN && role !== Roles.ADMIN);

        return adminRole[0];
    }

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
                    <Select
                        defaultValue={getPrimaryAdminRole(row.original.roles as Role[])}
                        onValueChange={(value) => {
                            apiPut(`/admin`, {
                                data: {
                                    id: row.original.id,
                                    role: value,
                                },
                                displayError: true,
                                displaySuccess: true,
                                onSuccess: fetchAdmins,
                            });
                        }}
                    >
                        <SelectTrigger className="w-full">{getPrimaryAdminRole(row.original.roles as Role[])}</SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value={Roles.ADMIN}>Admin</SelectItem>
                            <SelectItem value={Roles.SUPER_ADMIN}>Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => <SingleAdminDialog admin={row.original} successCallback={fetchAdmins} />,
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

    return <DefaultTable children={children} columns={columns} data={admins} searchComponent={searchComponent} />;
}
