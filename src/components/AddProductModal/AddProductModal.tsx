import { useState } from "react";
import './AddProductModal.css'

import PixelEditorModal from '../PixelEditorModal/PixelEditorModal';


type AddProductModalProps = {
  onClose: () => void;
  onSaved: () => void;
};

export default function AddProductModal({ onClose, onSaved }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [productImageBase64, setProductImageBase64] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSaveImage = (base64Image: string) => {
    setProductImageBase64(base64Image);
    setIsEditorOpen(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const productData = {
      name,
      quantity,
      imageBase64: productImageBase64
    };

    await fetch(`${BASE_URL}/api/inventory`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    onSaved();
    onClose();
  }

  return (
    <>
      <div className="modal">
        <form onSubmit={handleSubmit} className="modal-content">
          <h3>Add Product</h3>

          <label htmlFor="product-name">Name</label>
          <input
            id="product-name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="product-quantity">Quantity</label>
          <input
            id="product-quantity"
            placeholder="Quantity"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />

          <div className="image-section">
            <p>Product Image:</p>
            {productImageBase64 ? (
              <img
                src={productImageBase64}
                alt="Product Art"
                className="product-image-preview"
              />
            ) : (
              <div className="product-image-placeholder">
                No Image Set
              </div>
            )}

            <button type="button" onClick={() => setIsEditorOpen(true)} className="editor-launch-btn">
              {productImageBase64 ? 'Edit Pixel Art' : 'Create Pixel Art'}
            </button>
          </div>


          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>

      <PixelEditorModal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveImage}
      />
    </>
  );
}