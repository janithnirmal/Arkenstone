import { Eye, Heart, ShoppingCart, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { ProductCardProps } from './types';

export default function Card1({ product }: { product: ProductCardProps }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="perspective-1000 h-96 w-80">
            <div
                className={`transform-style-preserve-3d relative h-full w-full transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden">
                    <div
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 p-1 transition-all duration-300 ${isHovered ? 'scale-105 shadow-2xl shadow-purple-500/30' : ''}`}
                    >
                        <div className="relative h-full overflow-hidden rounded-xl bg-gray-900">
                            {/* Animated Background Particles */}
                            <div className="absolute inset-0 opacity-30">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`absolute h-1 w-1 animate-pulse rounded-full bg-white ${isHovered ? 'animate-bounce' : ''}`}
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animationDelay: `${i * 0.2}s`,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10 flex h-full flex-col p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${product.inStock ? 'animate-pulse bg-green-400 text-green-900' : 'bg-red-400 text-red-900'}`}
                                    >
                                        {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                    </div>
                                    <Heart
                                        className={`h-6 w-6 cursor-pointer transition-all duration-300 ${isHovered ? 'scale-110 animate-bounce text-pink-400' : 'text-gray-400'}`}
                                    />
                                </div>

                                <div className="group relative mb-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className={`h-40 w-full rounded-lg object-cover transition-all duration-500 ${isHovered ? 'scale-110 brightness-110' : ''}`}
                                    />
                                    <div
                                        className={`absolute inset-0 rounded-lg bg-gradient-to-t from-purple-600/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                    <Sparkles
                                        className={`absolute top-2 right-2 h-6 w-6 text-yellow-400 transition-all duration-500 ${isHovered ? 'scale-125 rotate-180' : ''}`}
                                    />
                                </div>

                                <h3 className="mb-2 truncate text-lg font-bold text-white">{product.name}</h3>
                                <p className="line-clamp-2 flex-grow text-sm text-gray-300">{product.description}</p>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                                        ${product.price}
                                    </span>
                                    <button
                                        onClick={() => setIsFlipped(true)}
                                        className={`transform rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 ${isHovered ? 'shadow-lg shadow-purple-500/50' : ''}`}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 rotate-y-180 backface-hidden">
                    <div className="h-full overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-400 p-1">
                        <div className="flex h-full flex-col items-center justify-center rounded-xl bg-gray-900 p-6 text-center">
                            <Zap className="mb-4 h-16 w-16 animate-spin text-yellow-400" />
                            <h3 className="mb-4 text-xl font-bold text-white">{product.name}</h3>
                            <p className="mb-6 text-gray-300">{product.description}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsFlipped(false)}
                                    className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 px-6 py-2 font-semibold text-white transition-transform hover:scale-105">
                                    <ShoppingCart className="h-4 w-4" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
