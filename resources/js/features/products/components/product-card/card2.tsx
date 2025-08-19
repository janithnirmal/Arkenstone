import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { ProductCardProps } from './types';

export default function Card2({ product }: { product: ProductCardProps }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="group relative p-1">
            <div
                className={`relative cursor-pointer overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/20 to-white/5 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out ${isHovered ? 'shadow-3xl -translate-y-8 scale-105 transform' : 'translate-y-0 transform'} `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated Background Gradient */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-blue-400/30 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-50'} `}
                />

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={`absolute h-2 w-2 rounded-full bg-white/40 blur-sm transition-all duration-1000 ease-out ${isHovered ? 'translate-x-20 -translate-y-16 transform' : 'translate-x-4 translate-y-4 transform'} `}
                    />
                    <div
                        className={`absolute top-1/3 right-8 h-1 w-1 rounded-full bg-purple-300/60 blur-sm transition-all delay-100 duration-1200 ease-out ${isHovered ? '-translate-x-12 -translate-y-20 transform' : 'translate-x-2 translate-y-2 transform'} `}
                    />
                    <div
                        className={`absolute bottom-1/4 left-12 h-3 w-3 rounded-full bg-pink-300/40 blur-sm transition-all delay-200 duration-1400 ease-out ${isHovered ? 'translate-x-16 -translate-y-12 transform' : '-translate-x-1 translate-y-1 transform'} `}
                    />
                </div>

                <div className="relative z-10 p-8">
                    {/* Header with Stock Status */}
                    <div className="mb-6 flex items-start justify-between">
                        <div
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-500 ${
                                product.inStock
                                    ? 'border border-green-400/30 bg-green-400/20 text-green-300'
                                    : 'border border-red-400/30 bg-red-400/20 text-red-300'
                            } `}
                        >
                            {product.inStock ? '✨ In Stock' : '⏳ Out of Stock'}
                        </div>

                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`transform rounded-full p-2 transition-all duration-300 ${isLiked ? 'scale-110 bg-red-400/30 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/20'} `}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Product Image */}
                    <div className="group relative mb-6">
                        <div className="overflow-hidden rounded-2xl">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className={`h-64 w-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 brightness-110' : 'scale-100'} `}
                            />
                        </div>

                        {/* Overlay with Quick Actions */}
                        <div
                            className={`absolute inset-0 flex items-center justify-center gap-4 rounded-2xl bg-black/40 backdrop-blur-sm transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} `}
                        >
                            <button className="rounded-full bg-white/20 p-3 text-white transition-colors duration-300 hover:bg-white/30">
                                <Eye className="h-5 w-5" />
                            </button>
                            <button className="rounded-full bg-white/20 p-3 text-white transition-colors duration-300 hover:bg-white/30">
                                <ShoppingCart className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                        <h3 className="mb-3 text-xl leading-tight font-bold text-white">{product.name}</h3>

                        <p className="mb-6 text-sm leading-relaxed text-white/70">{product.description}</p>

                        <div className="flex items-center justify-between">
                            <div className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-3xl font-bold text-transparent">
                                ${product.price}
                            </div>

                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
