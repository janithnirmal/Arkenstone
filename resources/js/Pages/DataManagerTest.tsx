import { useEffect, useState } from "react";
import TestLayout, { TestLayoutConfig } from "../Layouts/test-layout";
import { MockData, MockDataService } from "@/service/test-service";
import { Arkenstone, DataManager } from "arkenstone-ui";
import { ColumnDef } from "@tanstack/react-table";

export default function DataManagerTest() {
    const localMockData = MockDataService.useStore((state) => state.mockData);
    const [localMockDataState, setLocalMockDataState] = useState(localMockData);

    const config: TestLayoutConfig = {
        title: "Data Manager Test",
        compName: "Data Manager",
        compDescription: "A manager that manages data.",
    };

    // 3. Configuration
const mockDataConlumnConfig: ColumnDef<MockData>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Full Name' },
    { accessorKey: 'description', header: 'Description' },
];


    return (
        <TestLayout config={config}>
            <Arkenstone
                config={{
                    api: {
                        url: "/api",
                        isSameOrigin: true,
                    },
                    aclConfig: {
                        mode: "local",
                    },
                }}
            >
                <DataManager<MockData> 
            config={{
                title: "Mock Directory",
                description: "Manage system mock data",
                service: MockDataService,
                layout: 'split-view', // Try 'modal' to see the difference instantly
                devMode: true,
                
                display: {
                    type: 'table',
                    columns: mockDataConlumnConfig,
                    searchKeys: ['name', 'email']
                },
                
                form: {
                    fields: [
                        { 
                            name: 'name', 
                            label: 'Full Name', 
                            type: 'text', 
                            validation: { required: true, min: 2 } 
                        },
                        { 
                            name: 'email', 
                            label: 'Email Address', 
                            type: 'email', 
                            validation: { required: true, pattern: /\S+@\S+\.\S+/ } 
                        },
                        { 
                            name: 'role', 
                            label: 'Job Role', 
                            type: 'select', 
                            options: [
                                { label: 'Developer', value: 'dev' },
                                { label: 'Manager', value: 'manager' },
                                { label: 'Designer', value: 'designer' },
                            ] 
                        },
                        { 
                            name: 'departmentId', 
                            label: 'Department', 
                            type: 'select',
                            // Dynamically fetch options from another API
                            fetchOptions: async () => {
                                // Simulate API call
                                await new Promise(r => setTimeout(r, 500)); 
                                return [
                                    { label: 'Engineering', value: 1 },
                                    { label: 'HR', value: 2 }
                                ];
                            } 
                        },
                        {
                            name: 'bio',
                            label: 'Biography',
                            type: 'textarea',
                            validation: { max: 500 }
                        },
                        {
                            name: 'isActive',
                            label: 'Active Account',
                            type: 'checkbox',
                            defaultValue: true
                        },
                        {
                            name: 'avatar',
                            label: 'Profile Picture',
                            type: 'image',
                            uploadEndpoint: '/api/upload' // Optional auto-upload
                        }
                    ]
                }
            }}
        />
            </Arkenstone>
        </TestLayout>
    );
}
