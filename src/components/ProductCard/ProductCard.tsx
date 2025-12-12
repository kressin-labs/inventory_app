import React from 'react';
import './ProductCard.css';
import type { Product } from '../../types/product.d.ts';



type ModifyType = "increase" | "decrease";

interface ProductCardProps {
    product: Product;
    userRole: string | undefined;

    flashType: 'success' | 'warning' | null;

    // User props
    selectedAmount: number;
    setSelectedAmount: (amount: number) => void;
    onAddToCart: () => void;

    // Admin props
    adminAmount: number;
    setAdminAmount: (amount: number) => void;
    onModify: (id: number, type: ModifyType, amount: number) => void;
    onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product, userRole, flashType,
    selectedAmount, setSelectedAmount, onAddToCart,
    adminAmount, setAdminAmount, onModify, onDelete
}) => {

    const isOutOfStock = product.quantity <= 0;


    const handleAddToCart = () => {
        onAddToCart();
    };

    const handleAdminModify = (type: ModifyType) => {
        onModify(product.id, type, adminAmount || 1);
    };

    const handleDelete = () => {
        onDelete(product.id);
    };

    let flashClass = '';
    if (flashType === 'success') {
        flashClass = 'flash-success';
    } else if (flashType === 'warning') {
        flashClass = 'flash-warning';
    }


    return (
        <div className={`product-card ${flashClass}`}>

            <div className={`image-placeholder ${isOutOfStock ? 'out-of-stock-bg' : 'available-bg'}`}>
                {product.imageBase64 ? (
                    <img src={product.imageBase64} alt={product.name} className="product-image" />
                ) : (
                    <span className="text-gray-500 text-sm">No Custom Image</span>
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{product.name}</h3>

                {product.info && <p className="product-info">{product.info}</p>}

                <p className={`card-stock-status ${isOutOfStock ? 'stock-low' : 'stock-high'}`}>
                    Stock: {isOutOfStock ? 'Out of Stock' : product.quantity}
                </p>

                {userRole === "USER" && (
                    <div className="user-controls-container">
                        <select
                            value={selectedAmount}
                            onChange={(e) => setSelectedAmount(Number(e.target.value))}
                            className="select-quantity"
                            disabled={isOutOfStock}
                        >
                            {Array.from({ length: Math.min(product.quantity, 5) || 1 }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            Add to Cart
                        </button>
                    </div>
                )}

                {/* ADMIN Controls (Modify Inventory) */}
                {userRole === "ADMIN" && (
                    <div className="admin-controls-container">
                        <input
                            type="number"
                            min={1}
                            value={adminAmount === 1 ? '' : adminAmount}
                            placeholder="Amount (default 1)"
                            onChange={(e) => setAdminAmount(Number(e.target.value) || 1)}
                            className="input-amount"
                        />
                        <div className="admin-button-group">
                            <button className="admin-button-increase"
                                onClick={() => handleAdminModify("increase")}
                            >
                                + Increase
                            </button>
                            <button className="admin-button-decrease"
                                onClick={() => handleAdminModify("decrease")}
                            >
                                – Decrease
                            </button>
                        </div>
                        <button className="admin-button-delete"
                            onClick={handleDelete}
                        >
                            Delete Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;