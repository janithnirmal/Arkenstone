import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { apiDelete } from '@core/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import useDataManagerStore from '@core/components/data-manager/hooks/data-manager-store';
import DynamicFormGenerator from '../form-generator/dynamic-form-generator';
import { DynamicFormGeneratorOptions } from '../form-generator/types';
import DefaultTable from '../tables/default-table';
import { DataManagerConfig } from './types';

export default function DataManager({ config }: { config: DataManagerConfig }) {
    const { apiBaseUrl, dataName, tableConfig, formConfig, addConfig, editConfig, viewConfig, layoutConfig } = config; // configurations

    // Zustand store hooks
    const { data, loading, isModalOpen, modalMode, selectedItem, fetchData, openModal, closeModal } = useDataManagerStore(); // states

    // Initial data fetch
    useEffect(() => {
        fetchData(apiBaseUrl);
    }, [apiBaseUrl, fetchData]);

    // Handlers
    const handleSuccess = () => {
        closeModal();
        toast.success(`${dataName} ${modalMode === 'add' ? 'created' : 'updated'} successfully.`);
        fetchData(apiBaseUrl); // Re-fetch data on success
    };

    const handleDelete = async (id: string | number) => {
        toast.promise(
            apiDelete(`${apiBaseUrl}`, {
                data: {
                    id,
                },
                displayError: false, // handled by promise catch
                displaySuccess: false, // handled by promise then
            }),
            {
                loading: `Deleting ${dataName}...`,
                success: () => {
                    fetchData(apiBaseUrl);
                    return `${dataName} deleted successfully.`;
                },
                error: `Failed to delete ${dataName}.`,
            },
        );
    };

    // Memoize and extend table columns to include the action cell
    const columns = useMemo(() => {
        const actionColumn: ColumnDef<any> = {
            id: 'actions',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {viewConfig && <DropdownMenuItem onClick={() => openModal('view', item)}>View</DropdownMenuItem>}
                                {editConfig && <DropdownMenuItem onClick={() => openModal('edit', item)}>Edit</DropdownMenuItem>}
                                <DropdownMenuItem
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        };
        return [...tableConfig.columns, actionColumn];
    }, [tableConfig.columns, viewConfig, editConfig, openModal, handleDelete]);

    // Memoize form generator options based on the current modal mode
    const formGeneratorOptions = useMemo((): DynamicFormGeneratorOptions | null => {
        if (!modalMode) return null;

        const baseOptions = {
            ...formConfig,
            onSuccess: handleSuccess,
            onError: (err: any) => console.error('Form submission error:', err),
        };

        switch (modalMode) {
            case 'add':
                return {
                    ...baseOptions,
                    ...addConfig?.formOverrides,
                    endpoint: apiBaseUrl,
                    method: 'POST',
                    title: addConfig?.modalTitle || `Add New ${dataName}`,
                    description: addConfig?.modalDescription,
                };
            case 'edit':
                if (!selectedItem) return null;
                // Pre-fill form with selected item data
                const editSteps = baseOptions.steps.map((step) => ({
                    ...step,
                    fields: step.fields.map((field) =>
                        'isGroup' in field ? field : { ...field, defaultValue: selectedItem[field.name] ?? field.defaultValue },
                    ),
                }));
                return {
                    ...baseOptions,
                    ...editConfig?.formOverrides,
                    endpoint: `${apiBaseUrl}/${selectedItem.id}`,
                    method: 'PUT',
                    title: editConfig?.modalTitle || `Edit ${dataName}`,
                    description: editConfig?.modalDescription,
                    steps: editSteps,
                };
            case 'view':
                if (!selectedItem) return null;
                // Make all fields read-only for view mode
                const viewSteps = baseOptions.steps.map((step) => ({
                    ...step,
                    fields: step.fields.map((field) =>
                        'isGroup' in field
                            ? field
                            : { ...field, validation: { ...field.validation, disabled: true }, defaultValue: selectedItem[field.name] },
                    ),
                }));
                return {
                    ...baseOptions,
                    ...viewConfig?.formOverrides,
                    endpoint: '', // No submission on view
                    title: viewConfig?.modalTitle || `${dataName} Details`,
                    description: viewConfig?.modalDescription,
                    steps: viewSteps,
                    submitButtonText: '', // Hide submit button
                };
            default:
                return null;
        }
    }, [modalMode, selectedItem, formConfig, addConfig, editConfig, viewConfig, apiBaseUrl, dataName, handleSuccess]);

    return (
        <div className={`bg-background text-foreground p-4 ${layoutConfig?.containerClassName || ''}`}>
            <DefaultTable
                columns={columns}
                data={data}
                searchComponent={tableConfig.searchComponent}
                actionButtons={
                    <Button onClick={() => openModal('add')} className={addConfig?.triggerButtonClassName}>
                        {addConfig?.triggerButtonText || `Add New ${dataName}`}
                    </Button>
                }
            >
                {loading && <p>Loading data...</p>}
            </DefaultTable>

            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent
                    className={`bg-card text-card-foreground max-h-screen overflow-y-auto sm:max-w-[425px] md:max-w-screen-md ${layoutConfig?.modalClassName}`}
                >
                    <DialogHeader>
                        <DialogTitle>{formGeneratorOptions?.title}</DialogTitle>
                        {formGeneratorOptions?.description && <DialogDescription>{formGeneratorOptions.description}</DialogDescription>}
                    </DialogHeader>
                    {formGeneratorOptions ? <DynamicFormGenerator options={formGeneratorOptions} /> : <p>Loading form...</p>}
                </DialogContent>
            </Dialog>
        </div>
    );
}
