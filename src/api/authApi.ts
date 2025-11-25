// const API_BASE = "https://inventory-api.fabiankressin.com";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
}


export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}


export async function getInventory() {
  const res = await fetch(`${API_BASE}/api/inventory`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load inventory");
  return res.json();
}

// protected example:
export async function decreaseProduct(id: number, amount: number) {
  const res = await fetch(`${API_BASE}/api/inventory/${id}/decrease`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Decrease failed");
  return res.json();
}
