export type PolicyData = {
    title: string;
    intro: {
        heading: string;
        text: string;
    };
    sections: {
        id: string;
        heading: string;
        text?: string;
        items?: {
            strong?: string;
            text?: string;
            link?: {
                href?: string;
                text?: string;
            };
        }[];
    }[];
};

export default function Policy({ policyData }: { policyData: PolicyData }) {
    return (
        <section className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-center text-4xl font-bold">{policyData.title}</h1>
            <h3 className="mb-4 text-left text-2xl font-semibold">{policyData.intro.heading}</h3>
            <p className="mb-8 text-left text-lg text-muted-foreground">{policyData.intro.text}</p>
            <div className="mb-8">
                <ol className="list-inside list-decimal text-left text-secondary-foreground">
                    {policyData.sections.map((section: any, index: any) => (
                        <li key={section.id}>
                            <a href={`#pp-t${index + 1}`} className="hover:underline">
                                {section.heading}
                            </a>
                        </li>
                    ))}
                </ol>
            </div>
            {policyData.sections.map((section: any, index: any) => (
                <div key={section.id} className="mb-8">
                    <h3 id={`pp-t${index + 1}`} className="mb-4 text-left text-2xl font-semibold">
                        {`${index + 1}. ${section.heading}`}
                    </h3>
                    <p className="mb-4 text-left text-lg text-muted-foreground">{section.text}</p>
                    {section.items && (
                        <ul className="list-inside list-disc text-left text-lg text-muted-foreground">
                            {section.items.map((item: any, itemIndex: any) => (
                                <li key={itemIndex} className="mb-2">
                                    {item.strong && <strong>{item.strong}</strong>}
                                    {item.text}
                                    {item.link && (
                                        <a href={item.link.href} className="text-primary hover:underline">
                                            {item.link.text}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </section>
    );
}
