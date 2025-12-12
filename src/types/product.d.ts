export interface ProductResponse {
    id: number;
    name: string;
    quantity: number;
    imageBase64: string | null; 
    info: string;
}

export type Product = {
    id: number;
    name: string;
    quantity: number;
    imageBase64: string;
    info: string;
};
