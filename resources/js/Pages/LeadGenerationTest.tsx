import { DiscountBadge, PriceCard } from "arkenstone-ui";
import TestLayout, { TestLayoutConfig } from "../Layouts/test-layout";

export default function LeadGenerationTest() {
    const config: TestLayoutConfig = {
        title: "Lead Generation Test",
        compName: "Discount Badge",
        compDescription: "A badge that displays a discount amount.",
    };

    return (
        <TestLayout config={config}>
           Lead
        </TestLayout>
    );
}
