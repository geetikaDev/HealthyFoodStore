export interface Product {
    productId: number,
    productName: string,
    description: string,
    price: number,
    stock: number,
    imageUrl: string;

    category:{
        categoryId: number;
        categoryName: string;
        description: string;
    }
}
