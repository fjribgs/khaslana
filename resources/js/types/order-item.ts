import type { ProductVariant } from '@/types/attribute';
import type { Product } from '@/types/product';
import { Order } from '@/types/order';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;

    product_name: string;
    variant_detail: string;
    price: number;
    quantity: number;
    subtotal: number;

    created_at: string;
    updated_at: string;

    order?: Order;
    product?: Product;
    variant?: ProductVariant;
}