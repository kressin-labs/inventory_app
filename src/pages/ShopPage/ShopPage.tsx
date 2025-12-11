import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import { useCart } from "../../context/CartContext";
import ProductCard from '../../components/ProductCard/ProductCard';
import type { Product } from '../../types/product.d.ts';

import './ShopPage.css'



export default function ShopPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<Record<number, number>>({});
    const [adminAmount, setAdminAmount] = useState<Record<number, number>>({});

    const [feedback, setFeedback] = useState<{ message: string, type: 'success' | 'warning' } | null>(null);
    const [cardFlash, setCardFlash] = useState<Record<number, 'success' | 'warning' | null>>({});


    const { addToCart, cart, clearCart } = useCart();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // --- Feedback Logic ---
    const showFeedback = (message: string, type: 'success' | 'warning' = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 3000);
    };

    // Function to clear the individual card flash after 500ms
    const clearCardFlash = (id: number) => {
        setTimeout(() => {
            setCardFlash(prev => ({ ...prev, [id]: null }));
        }, 500);
    };

    // --- Data Fetching ---
    useEffect(() => {
        refreshProducts();
    }, []);

    function refreshProducts() {
        fetch(`${BASE_URL}/api/inventory`)
            .then(res => res.json())
            .then(data => {
                data.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
                setProducts(data);
            });
    }

    // --- API and State Functions ---
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
        refreshProducts();
    }

    async function modify(id: number, type: "increase" | "decrease", amount: number) {
        await fetch(`${BASE_URL}/api/inventory/${id}/${type}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        refreshProducts();
    }

    async function deleteProduct(id: number) {
        await fetch(`${BASE_URL}/api/inventory/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        refreshProducts();
    }



    return (
        <div className="flex w-full min-h-screen">

            {feedback && (
                <div
                    style={{
                        position: 'fixed',
                        top: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10000,
                    }}
                    className={`p-4 rounded-lg shadow-xl text-white font-semibold ${feedback.type === 'success' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}
                >
                    {feedback.message}
                </div>
            )}

            {/* LEFT: Product Grid Area */}
            <div className="flex-grow p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Shop Inventory</h2>

                    {/* ADMIN ONLY BUTTON */}
                    {user?.role === "ADMIN" && (
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            onClick={() => setShowAddModal(true)}
                        >
                            ➕ Add Product
                        </button>
                    )}
                </div>

                {/* CARD GRID LAYOUT */}
                <div className="product-card-grid">
                    {products.map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            userRole={user?.role}

                            flashType={cardFlash[p.id] || null}

                            selectedAmount={selectedAmount[p.id] || 1}
                            setSelectedAmount={(amount) =>
                                setSelectedAmount(prev => ({ ...prev, [p.id]: amount }))
                            }

                            onAddToCart={() => {
                                const MAX_LIMIT = 5;
                                const itemInCart = cart.find(item => item.id === p.id);
                                const currentQty = itemInCart ? itemInCart.quantity : 0;
                                const amountToAdd = selectedAmount[p.id] || 1;

                                if (currentQty + amountToAdd > MAX_LIMIT) {
                                    showFeedback(`Maximum limit reached for ${p.name}. Limit is ${MAX_LIMIT} items total.`, 'warning');

                                    setCardFlash(prev => ({ ...prev, [p.id]: 'warning' }));
                                    clearCardFlash(p.id);
                                    return;
                                }

                                addToCart({
                                    id: p.id,
                                    name: p.name,
                                    quantity: amountToAdd,
                                });
                                showFeedback(`${amountToAdd}x ${p.name} added to cart.`);

                                setCardFlash(prev => ({ ...prev, [p.id]: 'success' }));
                                clearCardFlash(p.id); // Clear flash after timeout
                            }}

                            adminAmount={adminAmount[p.id] || 1}
                            setAdminAmount={(amount) =>
                                setAdminAmount(prev => ({ ...prev, [p.id]: amount }))
                            }
                            onModify={(id, type, amount) => {
                                modify(id, type, amount);
                                setCardFlash(prev => ({ ...prev, [id]: 'success' }));
                                clearCardFlash(id);
                            }}
                            onDelete={(id) => {
                                deleteProduct(id);
                                setCardFlash(prev => ({ ...prev, [id]: 'warning' }));
                                clearCardFlash(id);
                            }}
                        />
                    ))}
                </div>
            </div>

            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onSaved={refreshProducts}
                />
            )}
        </div>
    );
}