// Define the props for the component for type safety
interface JsonViewerProps {
    /**
     * The JavaScript object or array to display.
     */
    data: object | any[];
    /**
     * The number of spaces to use for indentation.
     * @default 2
     */
    indentation?: number;
}

/**
 * A self-contained React component to display a formatted and syntax-highlighted JSON object using Tailwind CSS.
 */
const JsonViewer: React.FC<JsonViewerProps> = ({ data, indentation = 2 }) => {
    // Convert the JavaScript object to a beautifully formatted JSON string.
    // The `null, indentation` arguments are what handle the pretty-printing.
    const formattedJson = JSON.stringify(data, null, indentation);

    /**
     * A simple syntax highlighter function. It uses regular expressions to find
     * different JSON token types and wraps them in spans with specific Tailwind classes.
     */
    const syntaxHighlight = (jsonString: string) => {
        // Escape HTML characters to prevent XSS and rendering issues
        jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Use regex to find and wrap different parts of the JSON string in styled spans
        return jsonString.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match) => {
                let cls = 'text-green-500'; // Default to string color

                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'text-sky-400'; // This is a key
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'text-amber-500'; // This is a boolean
                } else if (/null/.test(match)) {
                    cls = 'text-rose-500'; // This is null
                } else {
                    cls = 'text-purple-500'; // This must be a number
                }

                return `<span class="${cls}">${match}</span>`;
            },
        );
    };

    const highlightedJson = syntaxHighlight(formattedJson);

    return (
        <div className="rounded-lg bg-gray-800 p-4 font-mono text-sm text-white shadow-lg">
            <pre
                // Use `dangerouslySetInnerHTML` because our highlighter function returns an HTML string.
                // This is safe here because we have manually escaped the HTML characters in the input.
                dangerouslySetInnerHTML={{ __html: highlightedJson }}
            />
        </div>
    );
};

export default JsonViewer;
