import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import { useCart } from "../../context/CartContext";
import { CartModal } from "../../components/CartModal/CartModal";

type Product = {
    id: number;
    name: string;
    quantity: number;
};

export default function ShopPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<Record<number, number>>({});
    const { addToCart } = useCart();
    const { cart, removeFromCart, clearCart } = useCart();
    const [adminAmount, setAdminAmount] = useState<Record<number, number>>({});
    const [cartOpen, setCartOpen] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        (async () => {
            const res = await fetch(`${BASE_URL}/api/inventory`);
            const data = await res.json();

            // Sort alphabetically
            data.sort((a: Product, b: Product) =>
                a.name.localeCompare(b.name)
            );

            setProducts(data);
        })();
    }, []);


    async function buy(id: number) {
        if (!user) return;

        await fetch(`${BASE_URL}/api/inventory/${id}/decrease`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 1 }),
        });

        // refresh
        const res = await fetch(`${BASE_URL}/api/inventory`);
        setProducts(await res.json());
    }

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


    function addProduct() {
        console.log("Admin adding product...");
    }

    const pageWrapperStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "row",
        width: "100vw",          // full viewport width
        maxWidth: "100%",         // prevent shrinking
        alignItems: "flex-start",
    };

    const productListStyle: React.CSSProperties = {
        flexGrow: 1,
        padding: "20px",
        paddingRight: "40px",
    };

    const cartSidebarStyle: React.CSSProperties = {
        width: "300px",
        background: "#ffffff",
        borderLeft: "1px solid #d0d7de",
        padding: "20px",
        position: "sticky",
        top: "20px",
        height: "fit-content",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)"
    };



    return (
        <div style={pageWrapperStyle}>
            {/* LEFT: Products (full width minus sidebar) */}
            <div style={productListStyle}>
                <h2>Shop</h2>
                {/* ADMIN ONLY BUTTON */}
                {user?.role === "ADMIN" && (
                    <button
                        style={{
                            background: "#0d6efd",
                            color: "white",
                            padding: "10px 16px",
                            borderRadius: 6,
                            marginBottom: 20
                        }}
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add Product
                    </button>

                )}
                {renderProducts()}
            </div>

            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onSaved={refreshProducts}
                />
            )}

            <CartModal open={cartOpen} onClose={() => setCartOpen(false)}>
                {renderCart()}
            </CartModal>

            <button
                onClick={() => setCartOpen(true)}
                style={{
                    position: "fixed",
                    top: "60px",
                    right: "20px",
                    zIndex: 10000,
                    padding: "10px 16px",
                    background: "#0d6efd",
                    color: "white",
                    borderRadius: 6
                }}
            >
                🛒 Cart ({cart.length})
            </button>


        </div>
    );



    function renderProducts() {
        return (
            <ul>
                {products.map(p => (
                    <li key={p.id} style={{ marginBottom: 20 }}>
                        <strong>{p.name}</strong> — Stock: {p.quantity}

                        {/* USER: add-to-cart controls */}
                        {user?.role === "USER" && (
                            <>
                                <select
                                    style={{ marginLeft: 10 }}
                                    value={selectedAmount[p.id] || 1}
                                    onChange={(e) =>
                                        setSelectedAmount({
                                            ...selectedAmount,
                                            [p.id]: Number(e.target.value),
                                        })
                                    }
                                >
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    style={{ marginLeft: 10 }}
                                    onClick={() =>
                                        addToCart({
                                            id: p.id,
                                            name: p.name,
                                            quantity: selectedAmount[p.id] || 1,
                                        })
                                    }
                                >
                                    Add to Cart
                                </button>
                            </>
                        )}

                        {/* ADMIN controls */}
                        {user?.role === "ADMIN" && (
                            <div style={{ display: "inline-flex", gap: "5px", marginLeft: "20px" }}>
                                <input
                                    type="number"
                                    min={1}
                                    style={{ width: "60px" }}
                                    value={adminAmount[p.id] || ""}
                                    placeholder="Amt"
                                    onChange={(e) =>
                                        setAdminAmount({
                                            ...adminAmount,
                                            [p.id]: Number(e.target.value),
                                        })
                                    }
                                />

                                <button
                                    style={{
                                        background: "#0d6efd",
                                        color: "white",
                                        padding: "6px 10px",
                                        borderRadius: 4
                                    }}
                                    onClick={() => modify(p.id, "increase", adminAmount[p.id] || 1)}
                                >
                                    + Increase
                                </button>

                                <button
                                    style={{
                                        background: "#0d6efd",
                                        color: "white",
                                        padding: "6px 10px",
                                        borderRadius: 4
                                    }}
                                    onClick={() => modify(p.id, "decrease", adminAmount[p.id] || 1)}
                                >
                                    – Decrease
                                </button>

                                <button
                                    style={{
                                        background: "#dc3545",
                                        color: "white",
                                        padding: "6px 10px",
                                        borderRadius: 4
                                    }}
                                    onClick={() => deleteProduct(p.id)}
                                >
                                    Delete
                                </button>

                            </div>
                        )}

                    </li>
                ))}
            </ul>
        );
    }


    function renderCart() {
        return (
            <>
                <h3>Your Cart</h3>

                {cart.map(item => (
                    <div key={item.id} style={{ marginBottom: 10 }}>
                        <strong>{item.name}</strong>
                        <div>Quantity: {item.quantity}</div>
                        <button
                            style={{ marginTop: 5 }}
                            onClick={() => removeFromCart(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    style={{
                        marginTop: 15,
                        padding: "10px",
                        width: "100%",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                    }}
                    onClick={buyCart}
                >
                    Buy All
                </button>
            </>
        );
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

    function refreshProducts() {
        fetch(`${BASE_URL}/api/inventory`)
            .then(res => res.json())
            .then(data => {
                data.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
                setProducts(data);
            });
    }


}
