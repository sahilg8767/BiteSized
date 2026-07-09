import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import CartToast from './components/CartToast'

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <CartToast />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
