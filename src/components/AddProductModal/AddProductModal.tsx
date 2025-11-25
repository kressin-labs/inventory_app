import { useState } from "react";

type AddProductModalProps = {
  onClose: () => void;
  onSaved: () => void;
};

export default function AddProductModal({ onClose, onSaved }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const BASE_URL=import.meta.env.VITE_API_BASE_URL;

  async function save() {
    await fetch(`${BASE_URL}/api/inventory`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity }),
    });

    onSaved();    // refresh product list in ShopPage
    onClose();    // close modal
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Product</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button onClick={save}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
