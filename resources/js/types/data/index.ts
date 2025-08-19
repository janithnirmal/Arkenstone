import {
    Pivot as PivotCore,
    ProductImage as ProductImageCore,
    Category as CategoryCore,
    Taxonomy as TaxonomyCore,
    Term as TermCore,
    Product as ProductCore,
} from '@/features/products/types';

//  Product Feature Shared
export interface Pivot extends PivotCore {}
export interface ProductImage extends ProductImageCore {}
export interface Category extends CategoryCore {}
export interface Taxonomy extends TaxonomyCore {}
export interface Term extends TermCore {}
export interface Product extends ProductCore {}
