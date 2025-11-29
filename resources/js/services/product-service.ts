import { apiGet, apiPost, apiPut, apiDelete, ApiOptions } from 'arkenstone-ui';
import { Product, ProductImage, Taxonomy  } from 'arkenstone-ui';

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  brand_id?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class ProductService {
  private baseUrl = 'products';

  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: ProductFilters, options?: ApiOptions): Promise<PaginatedResponse<Product>> {
    return apiGet(this.baseUrl, {
      params: filters,
      ...options,
    });
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: number, options?: ApiOptions): Promise<Product> {
    return apiGet(`${this.baseUrl}/${id}`, options);
  }

  /**
   * Create a new product
   */
  async createProduct(data: Partial<Product>, options?: ApiOptions): Promise<Product> {
    return apiPost(this.baseUrl, {
      data,
      displaySuccess: true,
      ...options,
    });
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: number, data: Partial<Product>, options?: ApiOptions): Promise<Product> {
    return apiPut(`${this.baseUrl}/${id}`, {
      data,
      displaySuccess: true,
      ...options,
    });
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number, options?: ApiOptions): Promise<void> {
    return apiDelete(`${this.baseUrl}/${id}`, {
      displaySuccess: true,
      ...options,
    });
  }

  /**
   * Get product images
   */
  async getProductImages(productId: number, options?: ApiOptions): Promise<ProductImage[]> {
    return apiGet(`${this.baseUrl}/${productId}/images`, options);
  }

  /**
   * Get product primary image
   */
  async getProductPrimaryImage(productId: number, options?: ApiOptions): Promise<ProductImage> {
    return apiGet(`${this.baseUrl}/${productId}/primary-image`, options);
  }

  /**
   * Set primary image for a product
   */
  async setPrimaryImage(productId: number, imageId: number, options?: ApiOptions): Promise<void> {
    return apiPost(`${this.baseUrl}/${productId}/images/${imageId}/set-primary`, options);
  }

  /**
   * Get product taxonomies
   */
  async getProductTaxonomies(productId: number, options?: ApiOptions): Promise<Taxonomy[]> {
    return apiGet(`${this.baseUrl}/${productId}/taxonomies`, options);
  }

  /**
   * Attach taxonomies to a product
   */
  async attachTaxonomies(productId: number, taxonomyIds: number[], options?: ApiOptions): Promise<void> {
    return apiPost(`${this.baseUrl}/taxonomies/attach`, {
      data: {
        product_id: productId,
        taxonomy_ids: taxonomyIds,
      },
      ...options,
    });
  }

  /**
   * Detach taxonomies from a product
   */
  async detachTaxonomies(productId: number, taxonomyIds: number[], options?: ApiOptions): Promise<void> {
    return apiPost(`${this.baseUrl}/taxonomies/detach`, {
      data: {
        product_id: productId,
        taxonomy_ids: taxonomyIds,
      },
      ...options,
    });
  }

  /**
   * Sync taxonomies for a product
   */
  async syncTaxonomies(productId: number, taxonomyIds: number[], options?: ApiOptions): Promise<void> {
    return apiPost(`${this.baseUrl}/taxonomies/sync`, {
      data: {
        product_id: productId,
        taxonomy_ids: taxonomyIds,
      },
      ...options,
    });
  }
}

export const productService = new ProductService();
export default productService;