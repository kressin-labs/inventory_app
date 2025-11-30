import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { CartModal } from "../../components/CartModal/CartModal";
import "./TopBar.css";

type CartItem = {
    id: number;
    name: string;
    quantity: number;
};

interface TopBarProps {
    onProductsBought: () => void;
    onOpenLogin: () => void;
}


interface CartItemCardProps {
    item: CartItem;
    onRemove: (id: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => (
    <div className="cart-item-card">
        <div className="item-details">
            <strong className="item-name">{item.name}</strong>
            <p className="item-qty">Qty: {item.quantity}</p>
        </div>
        <button
            className="remove-btn"
            onClick={() => onRemove(item.id)}
        >
            Remove
        </button>
    </div>
);


export default function TopBar({ onProductsBought, onOpenLogin }: TopBarProps) {
    const { user, logout } = useAuth();
    const { cart, removeFromCart, clearCart } = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    async function buyCart() {
        for (const item of cart) {
            await fetch(`${BASE_URL}/api/inventory/${item.id}/decrease`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: item.quantity }),
            });
        }
        clearCart();
        onProductsBought();
    }

    function renderCart() {
        return (
            <div className="cart-modal-content">
                <h3 className="text-2xl font-bold mb-4">Your Cart ({totalItemCount} items)</h3>
                
                <div className="cart-list-container"> 
                    {cart.map(item => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onRemove={removeFromCart}
                        />
                    ))}
                </div>

                <button
                    className="mt-6 w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    onClick={buyCart}
                    disabled={cart.length === 0}
                >
                    Buy All
                </button>
            </div>
        );
    }

    return (
        <div className="topbar-container">
            
            {/* Main Navigation Bar (Three-column layout) */}
            <div className="topbar">
                
                {/* LEFT CONTAINER: Website Link */}
                <div className="topbar-left">
                    <a href="https://fabiankressin.com" className="topbar-link">
                        fabiankressin.com
                    </a>
                </div>

                {/* CENTER CONTAINER: App Title */}
                <div className="topbar-center">
                    <div className="title">Inventory App</div>
                </div>

                {/* RIGHT CONTAINER: Cart Button and User Controls */}
                <div className="topbar-right right">
                    
                    <button
                        onClick={() => setCartOpen(true)}
                        className="cart-btn"
                    >
                        🛒 Cart ({totalItemCount})
                    </button>

                    {/* AUTH CONTROLS */}
                    {user ? (
                        <>
                            <span className="username">{user.username} ({user.role})</span>
                            <button className="logout-btn" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        /* LOGIN BUTTON */
                        <button className="login-btn" onClick={onOpenLogin}>
                            Login
                        </button>
                    )}
                    
                </div>

                {/* CART MODAL */}
                <CartModal open={cartOpen} onClose={() => setCartOpen(false)}>
                    {renderCart()}
                </CartModal>
            </div>
            
            {/* DEVELOPMENT BANNER */}
            <div className="development-banner">
                ⚠️ This application is <strong>In Development</strong>. Data may reset.
            </div>
            
        </div>
    );
}