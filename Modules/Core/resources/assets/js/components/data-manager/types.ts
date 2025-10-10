import { ColumnDef } from '@tanstack/react-table';
import { DynamicFormGeneratorOptions } from '../form-generator/types';
import { SearchComponent } from '../tables/default-table';

export interface DataManagerConfig {
    /** The base API endpoint for CRUD operations. E.g., '/users' */
    apiBaseUrl: string;
    /** A unique name for the data being managed, used in titles and messages. E.g., 'User' */
    dataName: string;
    /** Configuration for the data table. */
    tableConfig: {
        columns: ColumnDef<any>[];
        searchComponent?: SearchComponent[];
    };
    /** Base configuration for the form used for adding and editing. */
    formConfig: Omit<DynamicFormGeneratorOptions, 'endpoint' | 'method'>;
    /** Customization for the 'Add New' functionality. */
    addConfig?: {
        modalTitle?: string;
        modalDescription?: string;
        triggerButtonText?: string;
        triggerButtonClassName?: string;
        formOverrides?: Partial<DynamicFormGeneratorOptions>;
    };
    /** Customization for the 'Edit' functionality. */
    editConfig?: {
        modalTitle?: string;
        modalDescription?: string;
        formOverrides?: Partial<DynamicFormGeneratorOptions>;
    };
    /** Customization for the 'View' functionality (optional). */
    viewConfig?: {
        modalTitle?: string;
        modalDescription?: string;
        formOverrides?: Partial<DynamicFormGeneratorOptions>;
    };
    /** Customization for the overall layout and appearance. */
    layoutConfig?: {
        containerClassName?: string;
        modalClassName?: string;
    };
}

export type ModalTypes = 'add' | 'edit' | 'view' | null;
