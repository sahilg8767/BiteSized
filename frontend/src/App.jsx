import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import CartToast from './components/CartToast'

function App() {
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
