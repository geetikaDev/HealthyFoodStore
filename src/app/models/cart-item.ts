import { Product } from "./product";

export interface CartItem {
    productId: number;
    product: Product;
    quantity: number;
    unit: string;
    totalAmount: number;
    price: number;
}
