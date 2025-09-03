<?php

namespace Modules\Product\Database\Seeders;

use Modules\Product\Models\Attribute;
use Modules\Product\Models\Brand;
use Modules\Product\Models\Category;
use Modules\Product\Models\Product;
use Modules\Product\Models\AttributeValue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // IMPORTANT: Use the correct model namespaces for truncate as well!
        Product::truncate();
        // ProductVariant, ProductImage, product_categories, product_variant_attribute_values
        // will be cascaded by Product::truncate if foreign keys are set to ON DELETE CASCADE
        // If not, you might need to truncate them explicitly:
        // \Modules\Product\Models\ProductVariant::truncate();
        // \Modules\Product\Models\ProductImage::truncate();
        // \DB::table('product_categories')->truncate();
        // \DB::table('product_variant_attribute_values')->truncate();


        $brands = Brand::all();
        $categories = Category::all();
        $mensClothingCategory = Category::where('slug', 'mens-clothing')->first();
        $womensClothingCategory = Category::where('slug', 'womens-clothing')->first();
        $smartphonesCategory = Category::where('slug', 'smartphones')->first();
        $laptopsCategory = Category::where('slug', 'laptops')->first();

        // Ensure these exist and are loaded from the correct namespace
        $colorAttribute = Attribute::where('name', 'Color')->first();
        $sizeAttribute = Attribute::where('name', 'Size')->first();

        if (!$colorAttribute || !$sizeAttribute) {
             $this->command->error('Color or Size attribute not found. Please run AttributeSeeder first.');
             return;
        }

        $colors = $colorAttribute->values;
        $sizes = $sizeAttribute->values;


        if (!$brands->count() || !$categories->count() || !$colors->count() || !$sizes->count()) {
            $this->command->error('Please run CategorySeeder, BrandSeeder, and AttributeSeeder first!');
            return;
        }

        // --- Product 1: T-Shirt (with variants) ---
        $product1 = Product::create([
            'brand_id' => $brands->random()->id,
            'name' => 'Classic Cotton T-Shirt',
            'description' => 'A comfortable and stylish classic cotton t-shirt, perfect for everyday wear.',
            'sku' => 'TSHIRT-BASE-001', // Base SKU for the product itself
            'price' => 19.99,
            'tax_rate' => 0.08,
            'stock' => 0, // Stock will be managed by variants
            'is_active' => true,
        ]);
        $product1->categories()->attach([$mensClothingCategory->id, $womensClothingCategory->id]);

        // Define a unique suffix map for colors to avoid collisions
        $colorSuffixMap = [
            'Red' => 'RD',
            'Blue' => 'BL',
            'Green' => 'GR',
            'Black' => 'BK',
            'White' => 'WH',
        ];

        // Define a unique suffix map for sizes
        $sizeSuffixMap = [
            'Small' => 'S',
            'Medium' => 'M',
            'Large' => 'L',
            'XL' => 'XL',
        ];

        // Add variants for T-Shirt
        foreach ($colors as $color) {
            foreach ($sizes as $size) {
                // Only create variants for a subset of colors and sizes for this example
                if (in_array($color->value, ['Red', 'Blue', 'Black']) && in_array($size->value, ['Medium', 'Large'])) {

                    $colorCode = $colorSuffixMap[$color->value] ?? Str::slug($color->value); // Fallback to slug
                    $sizeCode = $sizeSuffixMap[$size->value] ?? Str::slug($size->value); // Fallback to slug

                    $variantSku = "TSHIRT-VAR-{$colorCode}-{$sizeCode}"; // Generate a unique SKU

                    $variant = $product1->variants()->create([
                        'name' => "{$color->value}, {$size->value}",
                        'sku' => $variantSku, // <-- Corrected SKU generation
                        'price' => 19.99,
                        'discount_price' => (rand(0,1) ? 17.99 : null), // 50% chance of a discount
                        'stock' => rand(5, 50),
                        'is_active' => true,
                    ]);
                    $variant->attributeValues()->attach([$color->id, $size->id]);
                }
            }
        }

        // Add images for T-Shirt
        $product1->images()->createMany([
            ['url' => 'https://via.placeholder.com/600x600/FF0000/FFFFFF?text=Red+T-Shirt', 'alt_text' => 'Red Classic T-Shirt', 'is_primary' => true, 'order' => 1],
            ['url' => 'https://via.placeholder.com/600x600/0000FF/FFFFFF?text=Blue+T-Shirt', 'alt_text' => 'Blue Classic T-Shirt', 'is_primary' => false, 'order' => 2],
            ['url' => 'https://via.placeholder.com/600x600/000000/FFFFFF?text=Black+T-Shirt', 'alt_text' => 'Black Classic T-Shirt', 'is_primary' => false, 'order' => 3],
        ]);


        // --- Product 2: Smartphone ---
        $product2 = Product::create([
            'brand_id' => $brands->random()->id,
            'name' => 'Ultra-Fast Smartphone X',
            'description' => 'Experience lightning-fast performance and stunning photography with the Smartphone X.',
            'sku' => 'PHONE-X-002',
            'price' => 799.99,
            'discount_price' => 749.99,
            'tax_rate' => 0.10,
            'stock' => 25,
            'is_active' => true,
        ]);
        $product2->categories()->attach([$smartphonesCategory->id]);
        $product2->images()->createMany([
            ['url' => 'https://via.placeholder.com/600x600/444444/FFFFFF?text=Smartphone+Front', 'alt_text' => 'Smartphone Front View', 'is_primary' => true, 'order' => 1],
            ['url' => 'https://via.placeholder.com/600x600/666666/FFFFFF?text=Smartphone+Back', 'alt_text' => 'Smartphone Back View', 'is_primary' => false, 'order' => 2],
        ]);

        // --- Product 3: Business Laptop ---
        $product3 = Product::create([
            'brand_id' => $brands->random()->id,
            'name' => 'ProBook 15 Laptop',
            'description' => 'Powerful laptop designed for professionals, with a sleek design and long battery life.',
            'sku' => 'LAPTOP-PRO-003',
            'price' => 1299.00,
            'tax_rate' => 0.12,
            'stock' => 15,
            'is_active' => true,
        ]);
        $product3->categories()->attach([$laptopsCategory->id]);
        $product3->images()->createMany([
            ['url' => 'https://via.placeholder.com/600x600/888888/FFFFFF?text=Laptop+Open', 'alt_text' => 'Laptop Open View', 'is_primary' => true, 'order' => 1],
            ['url' => 'https://via.placeholder.com/600x600/AAAAAA/FFFFFF?text=Laptop+Side', 'alt_text' => 'Laptop Side View', 'is_primary' => false, 'order' => 2],
        ]);

        // --- Product 4: Leather Wallet (simple, no variants) ---
        $product4 = Product::create([
            'brand_id' => $brands->random()->id,
            'name' => 'Premium Leather Wallet',
            'description' => 'Handcrafted wallet from genuine leather, durable and elegant.',
            'sku' => 'WALLET-PREM-004',
            'price' => 59.50,
            'tax_rate' => 0.05,
            'stock' => 30,
            'is_active' => true,
        ]);
        $product4->categories()->attach($categories->where('name', 'Fashion')->first()->id);
        $product4->images()->createMany([
            ['url' => 'https://via.placeholder.com/600x600/964B00/FFFFFF?text=Leather+Wallet+Front', 'alt_text' => 'Leather Wallet Front', 'is_primary' => true, 'order' => 1],
            ['url' => 'https://via.placeholder.com/600x600/A0522D/FFFFFF?text=Leather+Wallet+Open', 'alt_text' => 'Leather Wallet Open', 'is_primary' => false, 'order' => 2],
        ]);

        // --- Product 5: Ergonomic Chair ---
        $product5 = Product::create([
            'brand_id' => $brands->random()->id,
            'name' => 'Ergonomic Office Chair',
            'description' => 'Comfortable and supportive office chair for long working hours.',
            'sku' => 'CHAIR-ERG-005',
            'price' => 249.00,
            'tax_rate' => 0.07,
            'stock' => 10,
            'is_active' => true,
        ]);
        $product5->categories()->attach($categories->where('name', 'Home & Kitchen')->first()->id);
        $product5->images()->createMany([
            ['url' => 'https://via.placeholder.com/600x600/555555/FFFFFF?text=Office+Chair+Front', 'alt_text' => 'Office Chair Front', 'is_primary' => true, 'order' => 1],
            ['url' => 'https://via.placeholder.com/600x600/777777/FFFFFF?text=Office+Chair+Side', 'alt_text' => 'Office Chair Side', 'is_primary' => false, 'order' => 2],
        ]);

        $this->command->info('Products, Variants, and Images seeded!');
    }
}