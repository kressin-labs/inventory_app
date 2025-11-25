import ShopPage from "./pages/ShopPage/ShopPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import TopBar from "./components/TopBar/TopBar";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <TopBar />

      <ShopPage />

      {!user && (
        <LoginPage />
      )}
    </>
  );
}
