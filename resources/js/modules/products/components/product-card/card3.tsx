import { useState } from 'react';
import { ProductCardProps } from './types';
import { Sparkles } from 'lucide-react';

export default function Card3({ product }: { product: ProductCardProps }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);

    return (
        <div className="perspective-1000 relative h-96 w-full">
            <div
                className={`preserve-3d relative h-full w-full cursor-pointer transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''} `}
                onClick={() => setIsFlipped(!isFlipped)}
                onMouseEnter={() => setIsGlowing(true)}
                onMouseLeave={() => setIsGlowing(false)}
            >
                {/* Front Face */}
                <div className="absolute inset-0 h-full w-full backface-hidden">
                    <div
                        className={`h-full overflow-hidden rounded-xl border-2 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 transition-all duration-500 ${
                            isGlowing ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' : 'border-purple-500/30 shadow-lg shadow-purple-500/20'
                        } `}
                    >
                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
                            <div className="grid h-full grid-cols-8 grid-rows-6">
                                {[...Array(48)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`border-r border-b border-cyan-400/10 ${Math.random() > 0.8 ? 'animate-pulse bg-cyan-400/5' : ''} `}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 flex h-full flex-col p-6">
                            {/* Header with Glitch Effect */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                                    <span className="font-mono text-xs text-green-400">SYSTEM_ACTIVE</span>
                                </div>

                                <Sparkles
                                    className={`h-6 w-6 transition-all duration-300 ${isGlowing ? 'animate-spin text-cyan-400' : 'text-purple-400'} `}
                                />
                            </div>

                            {/* Product Image with Holographic Effect */}
                            <div className="relative mb-4 flex flex-grow items-center justify-center">
                                <div className="relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className={`h-48 w-48 rounded-lg border object-cover transition-all duration-500 ${
                                            isGlowing ? 'scale-105 border-cyan-400 shadow-lg shadow-cyan-400/30' : 'border-purple-400/50'
                                        } `}
                                    />

                                    {/* Holographic Overlay */}
                                    <div
                                        className={`absolute inset-0 rounded-lg bg-gradient-to-tr from-cyan-400/20 via-transparent to-purple-400/20 transition-opacity duration-500 ${isGlowing ? 'opacity-100' : 'opacity-0'} `}
                                    />

                                    {/* Scanning Line */}
                                    <div
                                        className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-2000 ease-in-out ${isGlowing ? 'top-0 animate-bounce' : 'top-full'} `}
                                    />
                                </div>
                            </div>

                            {/* Product Title */}
                            <h3
                                className={`mb-2 text-center font-mono text-lg font-bold transition-colors duration-300 ${isGlowing ? 'text-cyan-300' : 'text-white'} `}
                            >
                                {product.name.toUpperCase()}
                            </h3>

                            {/* Click to flip indicator */}
                            <div className="text-center">
                                <span className="animate-pulse font-mono text-xs text-purple-400">[CLICK_TO_ACCESS_DATA]</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 h-full w-full rotate-y-180 backface-hidden">
                    <div
                        className={`h-full overflow-hidden rounded-xl border-2 bg-gradient-to-br from-gray-900 via-cyan-900/50 to-gray-900 transition-all duration-500 ${
                            isGlowing ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' : 'border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                        } `}
                    >
                        {/* Matrix-style background */}
                        <div className="absolute inset-0 overflow-hidden opacity-10">
                            <div className="animate-pulse font-mono text-xs leading-3 text-green-400/30">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i}>01001001 01000001 01001101 01000001 01001001</div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                            {/* Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <span className="font-mono text-sm text-cyan-400">PRODUCT_DATA</span>
                                <div
                                    className={`rounded px-3 py-1 font-mono text-xs transition-colors duration-300 ${
                                        product.inStock
                                            ? 'border border-green-400/50 bg-green-400/20 text-green-400'
                                            : 'border border-red-400/50 bg-red-400/20 text-red-400'
                                    } `}
                                >
                                    {product.inStock ? 'AVAILABLE' : 'UNAVAILABLE'}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex-grow">
                                <p className="mb-6 font-mono text-sm leading-relaxed text-cyan-100">{product.description}</p>
                            </div>

                            {/* Price and Actions */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-2xl font-bold text-cyan-300">${product.price}</span>
                                    <div className="flex gap-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"
                                                style={{ animationDelay: `${i * 200}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className={`w-full rounded-lg py-3 font-mono font-bold transition-all duration-300 ${
                                        product.inStock
                                            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 hover:shadow-lg hover:shadow-cyan-400/25'
                                            : 'cursor-not-allowed bg-gray-600 text-gray-400'
                                    } `}
                                >
                                    {product.inStock ? '[ADD_TO_CART]' : '[OUT_OF_STOCK]'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
