import { useEffect, useState } from "react";
import TestLayout, { TestLayoutConfig } from "../Layouts/test-layout";
import { MockData, MockDataService } from "@/service/test-service";
import { Arkenstone } from "arkenstone-ui";

export default function ServiceFactoryTest() {
    const localMockData = MockDataService.useStore((state) => state.mockData);
    const [localMockDataState, setLocalMockDataState] = useState(localMockData);

    const config: TestLayoutConfig = {
        title: "Service Factory Test",
        compName: "Service Factory",
        compDescription: "A factory that creates services.",
    };

    useEffect(() => {
       getData();
    }, []);

    async function getData() {
        const response = await MockDataService.getAll(null, {
            displaySuccess: true
        });

        setLocalMockDataState(response);
    }

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
                {localMockDataState.map((item: MockData, index: number) => (
                    <div key={index} className="rounded-2xl px-5 py-2 mb-2 text-xs w-max bg-slate-700">
                        <h1 className="font-semibold">{item.name}</h1>
                        <p className="text-xs">{item.description}</p>
                    </div>
                ))}
            </Arkenstone>
        </TestLayout>
    );
}
