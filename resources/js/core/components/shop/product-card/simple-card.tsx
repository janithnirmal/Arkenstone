import { Product } from '@/core/types';

export default function SimpleCard({ data }: { data: Product }) {
    return (
        <div className="bg-muted h-96 w-84 rounded-lg p-3 shadow-lg">
            <h3 className="text-lg font-bold">{data.name}</h3>
            <p className="text-sm text-gray-500">{data.price}</p>
        </div>
    );
}
