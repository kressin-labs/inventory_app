import React, { useCallback, useState } from "react";
import ShopPage from "./pages/ShopPage/ShopPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import TopBar from "./components/TopBar/TopBar";
import LoginModal from "./components/LoginModal/LoginModal"; // 🚨 REQUIRED
import { useAuth } from "./context/AuthContext";
import './App.css'

export default function App() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <>
      <TopBar
        onProductsBought={triggerRefresh}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <ShopPage key={refreshKey} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}