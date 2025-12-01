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
            <DiscountBadge
                discount={10}
                discountType={"fixed"}
                className="bg-red-500"
                currency="LKR"
            />

            <hr className="my-4 border-slate-600" />

            <PriceCard price={300} salePrice={200} currency="LKR"  />
        </TestLayout>
    );
}
