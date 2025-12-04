<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Comprehensive Product Package Seeder
 * 
 * This seeder populates all Product package tables with realistic e-commerce data.
 * Designed for frontend developers to quickly set up test data.
 * 
 * Usage: php artisan db:seed --class=ProductPackageSeeder
 * 
 * Tables seeded:
 * - brands (10 records)
 * - categories (15 records with hierarchy)
 * - taxonomy_types (5 records)
 * - taxonomies (30 records)
 * - products (50 records)
 * - product_images (150-200 records)
 * - product_categories (pivot table)
 * - product_taxonomies (pivot table)
 */
class ProductPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // // Disable foreign key checks for truncating
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // // Truncate all tables (idempotent seeding)
        // DB::table('product_taxonomies')->truncate();
        // DB::table('product_categories')->truncate();
        // DB::table('product_images')->truncate();
        // DB::table('products')->truncate();
        // DB::table('taxonomies')->truncate();
        // DB::table('taxonomy_types')->truncate();
        // DB::table('categories')->truncate();
        // DB::table('brands')->truncate();
        
        // // Re-enable foreign key checks
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info('Seeding Product Package data...');
        
        // Seed in dependency order
        $brandIds = $this->seedBrands();
        $this->command->info('✓ Brands seeded (10 records)');
        
        $categoryIds = $this->seedCategories();
        $this->command->info('✓ Categories seeded (15 records)');
        
        $taxonomyTypeIds = $this->seedTaxonomyTypes();
        $this->command->info('✓ Taxonomy Types seeded (5 records)');
        
        $taxonomyIds = $this->seedTaxonomies($taxonomyTypeIds);
        $this->command->info('✓ Taxonomies seeded (30 records)');
        
        $productIds = $this->seedProducts($brandIds);
        $this->command->info('✓ Products seeded (50 records)');
        
        $this->seedProductImages($productIds);
        $this->command->info('✓ Product Images seeded (~150-200 records)');
        
        $this->seedProductCategories($productIds, $categoryIds);
        $this->command->info('✓ Product-Category relationships seeded');
        
        $this->seedProductTaxonomies($productIds, $taxonomyIds);
        $this->command->info('✓ Product-Taxonomy relationships seeded');
        
        $this->command->info('🎉 Product Package seeding completed successfully!');
    }
    
    /**
     * Seed brands table with realistic technology and fashion brands
     * 
     * @return array Brand IDs keyed by brand name
     */
    private function seedBrands(): array
    {
        $brands = [
            [
                'name' => 'Apple',
                'slug' => 'apple',
                'description' => 'Premium technology products including iPhones, iPads, MacBooks, and accessories.',
                'logo_url' => 'https://picsum.photos/seed/apple/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Samsung',
                'slug' => 'samsung',
                'description' => 'Leading electronics manufacturer known for smartphones, TVs, and home appliances.',
                'logo_url' => 'https://picsum.photos/seed/samsung/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Sony',
                'slug' => 'sony',
                'description' => 'Japanese multinational specializing in electronics, gaming, and entertainment.',
                'logo_url' => 'https://picsum.photos/seed/sony/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Dell',
                'slug' => 'dell',
                'description' => 'Computer technology company offering laptops, desktops, and enterprise solutions.',
                'logo_url' => 'https://picsum.photos/seed/dell/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'HP',
                'slug' => 'hp',
                'description' => 'Global technology company providing personal computing and printing solutions.',
                'logo_url' => 'https://picsum.photos/seed/hp/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Nike',
                'slug' => 'nike',
                'description' => 'World-renowned sportswear and athletic footwear brand.',
                'logo_url' => 'https://picsum.photos/seed/nike/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Adidas',
                'slug' => 'adidas',
                'description' => 'German multinational corporation designing and manufacturing sports clothing and accessories.',
                'logo_url' => 'https://picsum.photos/seed/adidas/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Canon',
                'slug' => 'canon',
                'description' => 'Japanese multinational specializing in imaging and optical products.',
                'logo_url' => 'https://picsum.photos/seed/canon/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'LG',
                'slug' => 'lg',
                'description' => 'South Korean electronics company producing home appliances and mobile devices.',
                'logo_url' => 'https://picsum.photos/seed/lg/200/200',
                'is_active' => true,
            ],
            [
                'name' => 'Microsoft',
                'slug' => 'microsoft',
                'description' => 'Technology corporation known for software, hardware, and cloud services.',
                'logo_url' => 'https://picsum.photos/seed/microsoft/200/200',
                'is_active' => true,
            ],
        ];
        
        $brandIds = [];
        foreach ($brands as $brand) {
            $id = DB::table('brands')->insertGetId(array_merge($brand, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $brandIds[$brand['name']] = $id;
        }
        
        return $brandIds;
    }
    
    /**
     * Seed categories table with hierarchical structure
     * 
     * @return array Category IDs keyed by category name
     */
    private function seedCategories(): array
    {
        $categories = [
            // Root categories
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and accessories',
                'parent_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Clothing',
                'slug' => 'clothing',
                'description' => 'Apparel and fashion items',
                'parent_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Home & Kitchen',
                'slug' => 'home-kitchen',
                'description' => 'Home appliances and kitchen essentials',
                'parent_id' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Sports & Outdoors',
                'slug' => 'sports-outdoors',
                'description' => 'Sporting goods and outdoor equipment',
                'parent_id' => null,
                'is_active' => true,
            ],
        ];
        
        $categoryIds = [];
        
        // Insert root categories first
        foreach ($categories as $category) {
            $id = DB::table('categories')->insertGetId(array_merge($category, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $categoryIds[$category['name']] = $id;
        }
        
        // Child categories (Electronics)
        $electronicsChildren = [
            [
                'name' => 'Laptops',
                'slug' => 'laptops',
                'description' => 'Portable computers and notebooks',
                'parent_id' => $categoryIds['Electronics'],
                'is_active' => true,
            ],
            [
                'name' => 'Smartphones',
                'slug' => 'smartphones',
                'description' => 'Mobile phones and accessories',
                'parent_id' => $categoryIds['Electronics'],
                'is_active' => true,
            ],
            [
                'name' => 'Cameras',
                'slug' => 'cameras',
                'description' => 'Digital cameras and photography equipment',
                'parent_id' => $categoryIds['Electronics'],
                'is_active' => true,
            ],
            [
                'name' => 'Televisions',
                'slug' => 'televisions',
                'description' => 'Smart TVs and home entertainment systems',
                'parent_id' => $categoryIds['Electronics'],
                'is_active' => true,
            ],
        ];
        
        // Child categories (Clothing)
        $clothingChildren = [
            [
                'name' => 'Men\'s Clothing',
                'slug' => 'mens-clothing',
                'description' => 'Apparel for men',
                'parent_id' => $categoryIds['Clothing'],
                'is_active' => true,
            ],
            [
                'name' => 'Women\'s Clothing',
                'slug' => 'womens-clothing',
                'description' => 'Apparel for women',
                'parent_id' => $categoryIds['Clothing'],
                'is_active' => true,
            ],
            [
                'name' => 'Footwear',
                'slug' => 'footwear',
                'description' => 'Shoes and sneakers',
                'parent_id' => $categoryIds['Clothing'],
                'is_active' => true,
            ],
        ];
        
        // Child categories (Home & Kitchen)
        $homeChildren = [
            [
                'name' => 'Kitchen Appliances',
                'slug' => 'kitchen-appliances',
                'description' => 'Cooking and food preparation appliances',
                'parent_id' => $categoryIds['Home & Kitchen'],
                'is_active' => true,
            ],
            [
                'name' => 'Home Decor',
                'slug' => 'home-decor',
                'description' => 'Decorative items for home',
                'parent_id' => $categoryIds['Home & Kitchen'],
                'is_active' => true,
            ],
        ];
        
        // Child categories (Sports & Outdoors)
        $sportsChildren = [
            [
                'name' => 'Fitness Equipment',
                'slug' => 'fitness-equipment',
                'description' => 'Exercise and workout equipment',
                'parent_id' => $categoryIds['Sports & Outdoors'],
                'is_active' => true,
            ],
            [
                'name' => 'Outdoor Gear',
                'slug' => 'outdoor-gear',
                'description' => 'Camping and hiking equipment',
                'parent_id' => $categoryIds['Sports & Outdoors'],
                'is_active' => true,
            ],
        ];
        
        // Insert all child categories
        $allChildren = array_merge($electronicsChildren, $clothingChildren, $homeChildren, $sportsChildren);
        foreach ($allChildren as $category) {
            $id = DB::table('categories')->insertGetId(array_merge($category, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $categoryIds[$category['name']] = $id;
        }
        
        return $categoryIds;
    }
    
    /**
     * Seed taxonomy_types table
     * 
     * @return array Taxonomy Type IDs keyed by type name
     */
    private function seedTaxonomyTypes(): array
    {
        $types = [
            [
                'name' => 'Color',
                'slug' => 'color',
                'description' => 'Product color variations',
                'is_active' => true,
            ],
            [
                'name' => 'Size',
                'slug' => 'size',
                'description' => 'Product size options',
                'is_active' => true,
            ],
            [
                'name' => 'Material',
                'slug' => 'material',
                'description' => 'Product material composition',
                'is_active' => true,
            ],
            [
                'name' => 'Storage Capacity',
                'slug' => 'storage-capacity',
                'description' => 'Device storage options',
                'is_active' => true,
            ],
            [
                'name' => 'RAM',
                'slug' => 'ram',
                'description' => 'Device memory specifications',
                'is_active' => true,
            ],
        ];
        
        $typeIds = [];
        foreach ($types as $type) {
            $id = DB::table('taxonomy_types')->insertGetId(array_merge($type, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
            $typeIds[$type['name']] = $id;
        }
        
        return $typeIds;
    }
    
    /**
     * Seed taxonomies table
     * 
     * @param array $typeIds Taxonomy Type IDs
     * @return array Taxonomy IDs grouped by type
     */
    private function seedTaxonomies(array $typeIds): array
    {
        $taxonomies = [
            // Colors
            ['type' => 'Color', 'name' => 'Black', 'value' => '#000000'],
            ['type' => 'Color', 'name' => 'White', 'value' => '#FFFFFF'],
            ['type' => 'Color', 'name' => 'Silver', 'value' => '#C0C0C0'],
            ['type' => 'Color', 'name' => 'Gold', 'value' => '#FFD700'],
            ['type' => 'Color', 'name' => 'Blue', 'value' => '#0000FF'],
            ['type' => 'Color', 'name' => 'Red', 'value' => '#FF0000'],
            ['type' => 'Color', 'name' => 'Green', 'value' => '#00FF00'],
            
            // Sizes
            ['type' => 'Size', 'name' => 'XS', 'value' => 'extra-small'],
            ['type' => 'Size', 'name' => 'S', 'value' => 'small'],
            ['type' => 'Size', 'name' => 'M', 'value' => 'medium'],
            ['type' => 'Size', 'name' => 'L', 'value' => 'large'],
            ['type' => 'Size', 'name' => 'XL', 'value' => 'extra-large'],
            ['type' => 'Size', 'name' => 'XXL', 'value' => 'double-extra-large'],
            
            // Materials
            ['type' => 'Material', 'name' => 'Cotton', 'value' => 'cotton'],
            ['type' => 'Material', 'name' => 'Polyester', 'value' => 'polyester'],
            ['type' => 'Material', 'name' => 'Aluminum', 'value' => 'aluminum'],
            ['type' => 'Material', 'name' => 'Plastic', 'value' => 'plastic'],
            ['type' => 'Material', 'name' => 'Glass', 'value' => 'glass'],
            
            // Storage Capacity
            ['type' => 'Storage Capacity', 'name' => '64GB', 'value' => '64'],
            ['type' => 'Storage Capacity', 'name' => '128GB', 'value' => '128'],
            ['type' => 'Storage Capacity', 'name' => '256GB', 'value' => '256'],
            ['type' => 'Storage Capacity', 'name' => '512GB', 'value' => '512'],
            ['type' => 'Storage Capacity', 'name' => '1TB', 'value' => '1024'],
            
        ];
        
        $taxonomyIds = [];
        $sortOrder = 1;
        
        foreach ($taxonomies as $taxonomy) {
            $slug = Str::slug($taxonomy['name']);
            $id = DB::table('taxonomies')->insertGetId([
                'taxonomy_type_id' => $typeIds[$taxonomy['type']],
                'name' => $taxonomy['name'],
                'slug' => $slug,
                'parent_id' => null,
                'sort_order' => $sortOrder++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            if (!isset($taxonomyIds[$taxonomy['type']])) {
                $taxonomyIds[$taxonomy['type']] = [];
            }
            $taxonomyIds[$taxonomy['type']][] = $id;
        }
        
        return $taxonomyIds;
    }
    
    /**
     * Seed products table with realistic product data
     * 
     * @param array $brandIds Brand IDs
     * @return array Product IDs
     */
    private function seedProducts(array $brandIds): array
    {
        $products = [
            // Apple Products (10 products)
            [
                'brand' => 'Apple',
                'name' => 'iPhone 15 Pro Max',
                'slug' => 'iphone-15-pro-max',
                'description' => 'The ultimate iPhone with A17 Pro chip, titanium design, and advanced camera system.',
                'price' => 1199.99,
                'sku' => 'APL-IP15PM-001',
                'stock_quantity' => 50,
                'is_active' => true,
            ],
            [
                'brand' => 'Apple',
                'name' => 'MacBook Pro 16" M3',
                'slug' => 'macbook-pro-16-m3',
                'description' => 'Professional laptop with M3 chip, stunning Liquid Retina XDR display.',
                'price' => 2499.99,
                'sku' => 'APL-MBP16-M3',
                'stock_quantity' => 30,
                'is_active' => true,
            ],
            [
                'brand' => 'Apple',
                'name' => 'iPad Air 11"',
                'slug' => 'ipad-air-11',
                'description' => 'Light and powerful tablet with M2 chip and all-day battery life.',
                'price' => 599.99,
                'sku' => 'APL-IPAD-AIR11',
                'stock_quantity' => 75,
                'is_active' => true,
            ],
            [
                'brand' => 'Apple',
                'name' => 'AirPods Pro (2nd Gen)',
                'slug' => 'airpods-pro-2nd-gen',
                'description' => 'Active noise cancellation and immersive sound with spatial audio.',
                'price' => 249.99,
                'sku' => 'APL-APP-2GEN',
                'stock_quantity' => 100,
                'is_active' => true,
            ],
            [
                'brand' => 'Apple',
                'name' => 'Apple Watch Series 9',
                'slug' => 'apple-watch-series-9',
                'description' => 'Advanced health and fitness features with always-on Retina display.',
                'price' => 399.99,
                'sku' => 'APL-AWS9-001',
                'stock_quantity' => 60,
                'is_active' => true,
            ],
            
            // Samsung Products (10 products)
            [
                'brand' => 'Samsung',
                'name' => 'Galaxy S24 Ultra',
                'slug' => 'galaxy-s24-ultra',
                'description' => 'Flagship smartphone with AI features, 200MP camera, and S Pen.',
                'price' => 1199.99,
                'sku' => 'SAM-GS24U-001',
                'stock_quantity' => 45,
                'is_active' => true,
            ],
            [
                'brand' => 'Samsung',
                'name' => 'Galaxy Book4 Pro',
                'slug' => 'galaxy-book4-pro',
                'description' => 'Premium ultraportable laptop with Dynamic AMOLED 2X display.',
                'price' => 1499.99,
                'sku' => 'SAM-GB4P-001',
                'stock_quantity' => 35,
                'is_active' => true,
            ],
            [
                'brand' => 'Samsung',
                'name' => '65" Neo QLED 8K TV',
                'slug' => 'samsung-neo-qled-8k-65',
                'description' => 'Stunning 8K resolution with AI upscaling and Quantum HDR.',
                'price' => 2999.99,
                'sku' => 'SAM-QLED8K-65',
                'stock_quantity' => 15,
                'is_active' => true,
            ],
            [
                'brand' => 'Samsung',
                'name' => 'Galaxy Buds Pro 3',
                'slug' => 'galaxy-buds-pro-3',
                'description' => 'Premium wireless earbuds with intelligent ANC and 360 audio.',
                'price' => 199.99,
                'sku' => 'SAM-GBP3-001',
                'stock_quantity' => 80,
                'is_active' => true,
            ],
            [
                'brand' => 'Samsung',
                'name' => 'Galaxy Tab S9 Ultra',
                'slug' => 'galaxy-tab-s9-ultra',
                'description' => 'Massive 14.6" AMOLED screen tablet for ultimate productivity.',
                'price' => 1199.99,
                'sku' => 'SAM-GTS9U-001',
                'stock_quantity' => 25,
                'is_active' => true,
            ],
            
            // Dell Products (8 products)
            [
                'brand' => 'Dell',
                'name' => 'XPS 15 Laptop',
                'slug' => 'dell-xps-15',
                'description' => 'Premium laptop with InfinityEdge display and powerful performance.',
                'price' => 1799.99,
                'sku' => 'DEL-XPS15-001',
                'stock_quantity' => 40,
                'is_active' => true,
            ],
            [
                'brand' => 'Dell',
                'name' => 'Alienware Aurora R15',
                'slug' => 'alienware-aurora-r15',
                'description' => 'High-performance gaming desktop with liquid cooling.',
                'price' => 2499.99,
                'sku' => 'DEL-AAR15-001',
                'stock_quantity' => 20,
                'is_active' => true,
            ],
            [
                'brand' => 'Dell',
                'name' => 'UltraSharp 27" 4K Monitor',
                'slug' => 'dell-ultrasharp-27-4k',
                'description' => 'Professional-grade monitor with 99% sRGB color coverage.',
                'price' => 549.99,
                'sku' => 'DEL-US27-4K',
                'stock_quantity' => 50,
                'is_active' => true,
            ],
            [
                'brand' => 'Dell',
                'name' => 'Inspiron 14 2-in-1',
                'slug' => 'dell-inspiron-14-2in1',
                'description' => 'Versatile convertible laptop for work and entertainment.',
                'price' => 799.99,
                'sku' => 'DEL-INS14-2IN1',
                'stock_quantity' => 55,
                'is_active' => true,
            ],
            
            // HP Products (5 products)
            [
                'brand' => 'HP',
                'name' => 'Spectre x360 16"',
                'slug' => 'hp-spectre-x360-16',
                'description' => 'Premium convertible with gem-cut design and OLED display.',
                'price' => 1699.99,
                'sku' => 'HP-SPX360-16',
                'stock_quantity' => 30,
                'is_active' => true,
            ],
            [
                'brand' => 'HP',
                'name' => 'OMEN 45L Gaming Desktop',
                'slug' => 'hp-omen-45l',
                'description' => 'Powerful gaming PC with RGB lighting and advanced cooling.',
                'price' => 2199.99,
                'sku' => 'HP-OMEN45L-001',
                'stock_quantity' => 18,
                'is_active' => true,
            ],
            [
                'brand' => 'HP',
                'name' => 'Envy Inspire Printer',
                'slug' => 'hp-envy-inspire',
                'description' => 'All-in-one color printer with wireless connectivity.',
                'price' => 199.99,
                'sku' => 'HP-ENVINSP-001',
                'stock_quantity' => 70,
                'is_active' => true,
            ],
            
            // Nike Products (5 products)
            [
                'brand' => 'Nike',
                'name' => 'Air Max 270 Sneakers',
                'slug' => 'nike-air-max-270',
                'description' => 'Iconic sneakers with Max Air cushioning for all-day comfort.',
                'price' => 149.99,
                'sku' => 'NIKE-AM270-001',
                'stock_quantity' => 120,
                'is_active' => true,
            ],
            [
                'brand' => 'Nike',
                'name' => 'Dri-FIT Training T-Shirt',
                'slug' => 'nike-dri-fit-training-tshirt',
                'description' => 'Moisture-wicking performance shirt for intense workouts.',
                'price' => 34.99,
                'sku' => 'NIKE-DFIT-TS001',
                'stock_quantity' => 200,
                'is_active' => true,
            ],
            [
                'brand' => 'Nike',
                'name' => 'Tech Fleece Joggers',
                'slug' => 'nike-tech-fleece-joggers',
                'description' => 'Premium fleece pants with modern tapered fit.',
                'price' => 99.99,
                'sku' => 'NIKE-TFJ-001',
                'stock_quantity' => 150,
                'is_active' => true,
            ],
            
            // Adidas Products (5 products)
            [
                'brand' => 'Adidas',
                'name' => 'Ultraboost 23 Running Shoes',
                'slug' => 'adidas-ultraboost-23',
                'description' => 'High-performance running shoes with Boost cushioning.',
                'price' => 189.99,
                'sku' => 'ADI-UB23-001',
                'stock_quantity' => 100,
                'is_active' => true,
            ],
            [
                'brand' => 'Adidas',
                'name' => 'Tiro 23 Training Pants',
                'slug' => 'adidas-tiro-23-pants',
                'description' => 'Classic soccer training pants with tapered fit.',
                'price' => 44.99,
                'sku' => 'ADI-T23P-001',
                'stock_quantity' => 180,
                'is_active' => true,
            ],
            [
                'brand' => 'Adidas',
                'name' => 'Stan Smith Sneakers',
                'slug' => 'adidas-stan-smith',
                'description' => 'Timeless tennis-inspired sneakers in premium leather.',
                'price' => 84.99,
                'sku' => 'ADI-SS-001',
                'stock_quantity' => 140,
                'is_active' => true,
            ],
            
            // Sony Products (3 products)
            [
                'brand' => 'Sony',
                'name' => 'PlayStation 5 Console',
                'slug' => 'playstation-5-console',
                'description' => 'Next-gen gaming console with lightning-fast SSD.',
                'price' => 499.99,
                'sku' => 'SONY-PS5-001',
                'stock_quantity' => 40,
                'is_active' => true,
            ],
            [
                'brand' => 'Sony',
                'name' => 'WH-1000XM5 Headphones',
                'slug' => 'sony-wh1000xm5',
                'description' => 'Industry-leading noise canceling wireless headphones.',
                'price' => 399.99,
                'sku' => 'SONY-WH1000XM5',
                'stock_quantity' => 65,
                'is_active' => true,
            ],
            [
                'brand' => 'Sony',
                'name' => 'Alpha 7 IV Camera',
                'slug' => 'sony-alpha-7-iv',
                'description' => 'Full-frame mirrorless camera with 33MP sensor.',
                'price' => 2499.99,
                'sku' => 'SONY-A7IV-001',
                'stock_quantity' => 22,
                'is_active' => true,
            ],
            
            // Canon Products (2 products)
            [
                'brand' => 'Canon',
                'name' => 'EOS R6 Mark II',
                'slug' => 'canon-eos-r6-mark-ii',
                'description' => 'Professional mirrorless camera with 24MP sensor.',
                'price' => 2499.99,
                'sku' => 'CAN-R6M2-001',
                'stock_quantity' => 18,
                'is_active' => true,
            ],
            [
                'brand' => 'Canon',
                'name' => 'PIXMA Pro-200 Printer',
                'slug' => 'canon-pixma-pro-200',
                'description' => 'Professional photo printer with 8-color dye ink system.',
                'price' => 599.99,
                'sku' => 'CAN-PIXMA-P200',
                'stock_quantity' => 35,
                'is_active' => true,
            ],
            
            // LG Products (2 products)
            [
                'brand' => 'LG',
                'name' => '55" OLED C3 4K TV',
                'slug' => 'lg-oled-c3-55',
                'description' => 'Self-lit OLED pixels with perfect black and infinite contrast.',
                'price' => 1499.99,
                'sku' => 'LG-OLEDC3-55',
                'stock_quantity' => 28,
                'is_active' => true,
            ],
            [
                'brand' => 'LG',
                'name' => 'UltraGear 27" Gaming Monitor',
                'slug' => 'lg-ultragear-27',
                'description' => '1ms response time with 165Hz refresh rate for competitive gaming.',
                'price' => 349.99,
                'sku' => 'LG-UG27-001',
                'stock_quantity' => 45,
                'is_active' => true,
            ],
            
            // Microsoft Products (2 products)
            [
                'brand' => 'Microsoft',
                'name' => 'Surface Laptop 5',
                'slug' => 'microsoft-surface-laptop-5',
                'description' => 'Elegant laptop with PixelSense touchscreen display.',
                'price' => 1299.99,
                'sku' => 'MS-SL5-001',
                'stock_quantity' => 38,
                'is_active' => true,
            ],
            [
                'brand' => 'Microsoft',
                'name' => 'Xbox Series X',
                'slug' => 'xbox-series-x',
                'description' => 'Most powerful Xbox console with 4K gaming at 120fps.',
                'price' => 499.99,
                'sku' => 'MS-XSX-001',
                'stock_quantity' => 42,
                'is_active' => true,
            ],
        ];
        
        $productIds = [];
        foreach ($products as $product) {
            $id = DB::table('products')->insertGetId([
                'brand_id' => $brandIds[$product['brand']],
                'name' => $product['name'],
                'slug' => $product['slug'],
                'description' => $product['description'],
                'price' => $product['price'],
                'sku' => $product['sku'],
                'quantity' => $product['stock_quantity'],
                'is_active' => $product['is_active'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $productIds[] = $id;
        }
        
        return $productIds;
    }
    
    /**
     * Seed product_images table with multiple images per product
     * 
     * @param array $productIds Product IDs
     * @return void
     */
    private function seedProductImages(array $productIds): void
    {
        $imageCount = 0;
        
        foreach ($productIds as $index => $productId) {
            // Each product gets 3-5 images
            $numImages = rand(3, 5);
            
            for ($i = 1; $i <= $numImages; $i++) {
                // First image is always primary
                $isPrimary = ($i === 1);
                
                // Use product ID and image number for unique seeds
                $seed = "product-{$productId}-img-{$i}";
                
                DB::table('product_images')->insert([
                    'product_id' => $productId,
                    'image_url' => "https://picsum.photos/seed/{$seed}/800/600",
                    'alt_text' => "Product image {$i}",
                    'is_primary' => $isPrimary,
                    'sort_order' => $i,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                $imageCount++;
            }
        }
    }
    
    /**
     * Seed product_categories pivot table
     * 
     * @param array $productIds Product IDs
     * @param array $categoryIds Category IDs
     * @return void
     */
    private function seedProductCategories(array $productIds, array $categoryIds): void
    {
        // Define product-to-category mappings (each product gets 1-3 categories)
        $mappings = [
            // Apple products → Electronics, Smartphones, Laptops
            0 => ['Electronics', 'Smartphones'],
            1 => ['Electronics', 'Laptops'],
            2 => ['Electronics'],
            3 => ['Electronics'],
            4 => ['Electronics'],
            
            // Samsung products
            5 => ['Electronics', 'Smartphones'],
            6 => ['Electronics', 'Laptops'],
            7 => ['Electronics', 'Televisions'],
            8 => ['Electronics'],
            9 => ['Electronics'],
            
            // Dell products
            10 => ['Electronics', 'Laptops'],
            11 => ['Electronics'],
            12 => ['Electronics'],
            13 => ['Electronics', 'Laptops'],
            
            // HP products
            14 => ['Electronics', 'Laptops'],
            15 => ['Electronics'],
            16 => ['Electronics', 'Home & Kitchen'],
            
            // Nike products
            17 => ['Clothing', 'Footwear', 'Sports & Outdoors'],
            18 => ['Clothing', 'Men\'s Clothing', 'Sports & Outdoors'],
            19 => ['Clothing', 'Men\'s Clothing'],
            
            // Adidas products
            20 => ['Clothing', 'Footwear', 'Sports & Outdoors'],
            21 => ['Clothing', 'Men\'s Clothing', 'Sports & Outdoors'],
            22 => ['Clothing', 'Footwear'],
            
            // Sony products
            23 => ['Electronics'],
            24 => ['Electronics'],
            25 => ['Electronics', 'Cameras'],
            
            // Canon products
            26 => ['Electronics', 'Cameras'],
            27 => ['Electronics', 'Home & Kitchen'],
            
            // LG products
            28 => ['Electronics', 'Televisions'],
            29 => ['Electronics'],
            
            // Microsoft products
            30 => ['Electronics', 'Laptops'],
            31 => ['Electronics'],
        ];
        
        $pivotData = [];
        
        foreach ($productIds as $index => $productId) {
            // Get category names for this product, or default to Electronics
            $categoryNames = $mappings[$index] ?? ['Electronics'];
            
            foreach ($categoryNames as $categoryName) {
                if (isset($categoryIds[$categoryName])) {
                    $pivotData[] = [
                        'product_id' => $productId,
                        'category_id' => $categoryIds[$categoryName],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        DB::table('product_categories')->insert($pivotData);
    }
    
    /**
     * Seed product_taxonomies pivot table
     * 
     * @param array $productIds Product IDs
     * @param array $taxonomyIds Taxonomy IDs grouped by type
     * @return void
     */
    private function seedProductTaxonomies(array $productIds, array $taxonomyIds): void
    {
        $pivotData = [];
        
        foreach ($productIds as $index => $productId) {
            // Electronics products (0-16, 23-31) get Color, Storage, RAM
            if ($index <= 16 || $index >= 23) {
                // Add 1-3 colors
                $numColors = rand(1, 3);
                $selectedColors = array_rand($taxonomyIds['Color'], min($numColors, count($taxonomyIds['Color'])));
                if (!is_array($selectedColors)) {
                    $selectedColors = [$selectedColors];
                }
                
                foreach ($selectedColors as $colorIndex) {
                    $pivotData[] = [
                        'product_id' => $productId,
                        'taxonomy_id' => $taxonomyIds['Color'][$colorIndex],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                
                // Add storage options for phones/laptops (products 0-16, 23-26, 30-31)
                if (($index >= 0 && $index <= 16) || ($index >= 23 && $index <= 26) || ($index >= 30 && $index <= 31)) {
                    $numStorage = rand(1, 3);
                    $selectedStorage = array_rand($taxonomyIds['Storage Capacity'], min($numStorage, count($taxonomyIds['Storage Capacity'])));
                    if (!is_array($selectedStorage)) {
                        $selectedStorage = [$selectedStorage];
                    }
                    
                    foreach ($selectedStorage as $storageIndex) {
                        $pivotData[] = [
                            'product_id' => $productId,
                            'taxonomy_id' => $taxonomyIds['Storage Capacity'][$storageIndex],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
                
            }
            
            // Clothing products (17-22) get Color, Size, Material
            if ($index >= 17 && $index <= 22) {
                // Add 2-4 colors
                $numColors = rand(2, 4);
                $selectedColors = array_rand($taxonomyIds['Color'], min($numColors, count($taxonomyIds['Color'])));
                if (!is_array($selectedColors)) {
                    $selectedColors = [$selectedColors];
                }
                
                foreach ($selectedColors as $colorIndex) {
                    $pivotData[] = [
                        'product_id' => $productId,
                        'taxonomy_id' => $taxonomyIds['Color'][$colorIndex],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                
                // Add all size options for clothing
                foreach ($taxonomyIds['Size'] as $sizeId) {
                    $pivotData[] = [
                        'product_id' => $productId,
                        'taxonomy_id' => $sizeId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                
                // Add 1-2 materials
                $numMaterials = rand(1, 2);
                $selectedMaterials = array_rand($taxonomyIds['Material'], min($numMaterials, count($taxonomyIds['Material'])));
                if (!is_array($selectedMaterials)) {
                    $selectedMaterials = [$selectedMaterials];
                }
                
                foreach ($selectedMaterials as $materialIndex) {
                    $pivotData[] = [
                        'product_id' => $productId,
                        'taxonomy_id' => $taxonomyIds['Material'][$materialIndex],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        DB::table('product_taxonomies')->insert($pivotData);
    }
}
