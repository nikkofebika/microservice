export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    initialStock?: number;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isActive?: boolean;
}
