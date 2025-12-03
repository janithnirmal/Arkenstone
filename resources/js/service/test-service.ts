import { ServiceFactory } from "arkenstone-ui";

export interface MockData {
    id: number,
    name: string;
    description: string;
}

export interface CreateMockDataDto {
    name: string;
    description: string;
}

// Define the State Interface for the store
export interface MockDataState {
    mockData: MockData[];
}

// Instantiate and Export
export const MockDataService = new ServiceFactory<MockData, CreateMockDataDto, Partial<MockData>, MockDataState>({
    endpoint: '/service-test',
    entityName: 'MockData',
    syncWithStore: true,
    store: {
        persistName: 'app-mock-data-cache', // Optional: saves to localStorage
        initialState: {
            mockData: [],
        },
        // Custom Store Actions
        methods: (set) => ({
            setMockData: (mockData: MockData[]) => set((state: MockDataState) => { state.mockData = mockData }),
        })
    }
});