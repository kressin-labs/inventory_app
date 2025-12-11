export interface ProductResponse {
    id: number;
    name: string;
    quantity: number;
    imageBase64: string | null; 
}

export type Product = {
    id: number;
    name: string;
    quantity: number;
    imageBase64: string;
};
