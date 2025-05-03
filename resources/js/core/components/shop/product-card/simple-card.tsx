import { Product } from '@/core/types';
import { useState } from 'react';

export default function SimpleCard({ data }: { data: Product }) {
    const [primaryImage, setPrimaryImage] = useState(data.images?.[0]?.path);

    return (
        <div className="flex cursor-pointer flex-col gap-2 overflow-hidden rounded-lg">
            <div
                className="bg-muted h-96 w-84 rounded-lg bg-cover bg-center p-3 shadow-xl transition-all duration-300 hover:scale-105"
                style={{ backgroundImage: `url(${primaryImage})` }}
            ></div>
            <div className="flex flex-col gap-2 rounded-lg p-2 text-center">
                <div className="flex max-w-full items-center justify-center gap-1">
                    {data.images?.map(
                        (image, index) =>
                            index !== 0 &&
                            index < 5 && (
                                <img
                                    key={index}
                                    src={image.path}
                                    alt={data.name}
                                    className="h-10 w-10 rounded-full"
                                    onMouseOver={() => setPrimaryImage(image.path)}
                                    onMouseLeave={() => setPrimaryImage(data.images?.[0]?.path)}
                                />
                            ),
                    )}
                </div>
                <h3 className="text-lg font-bold">{data.name}</h3>
                <p className="text-muted-foreground text-sm">{data.category?.name ?? 'No category'}</p>
            </div>
        </div>
    );
}
