import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateFood from '../pages/CreateFood'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/Home'
import Reels from '../pages/Reels'
import PartnerProfile from '../pages/PartnerProfile'
import PartnerDashboard from '../pages/PartnerDashboard'
import Search from '../pages/Search'
import Category from '../pages/Category'
import Saved from '../pages/Saved'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import Settings from '../pages/Settings'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import ProtectedRoute from '../components/ProtectedRoute'
import BottomNav from '../components/BottomNav'

// Any authenticated user (either role)
const Auth = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>
// Role-restricted
const UserOnly = ({ children }) => <ProtectedRoute role='user'>{children}</ProtectedRoute>
const PartnerOnly = ({ children }) => <ProtectedRoute role='food-partner'>{children}</ProtectedRoute>

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* public auth pages */}
        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin />} />

        {/* login-first: everything below requires auth */}
        <Route path='/' element={<Auth><Home /></Auth>} />
        <Route path='/reels' element={<Auth><Reels /></Auth>} />
        <Route path='/search' element={<Auth><Search /></Auth>} />
        <Route path='/category/:category' element={<Auth><Category /></Auth>} />
        <Route path='/partner/:id' element={<Auth><PartnerProfile /></Auth>} />
        <Route path='/cart' element={<Auth><Cart /></Auth>} />

        {/* user-only */}
        <Route path='/saved' element={<UserOnly><Saved /></UserOnly>} />
        <Route path='/checkout' element={<UserOnly><Checkout /></UserOnly>} />
        <Route path='/orders' element={<UserOnly><Orders /></UserOnly>} />
        <Route path='/settings' element={<UserOnly><Settings /></UserOnly>} />

        {/* partner-only */}
        <Route path='/partner/dashboard' element={<PartnerOnly><PartnerDashboard /></PartnerOnly>} />
        <Route path='/food/create' element={<PartnerOnly><CreateFood /></PartnerOnly>} />
      </Routes>
      <BottomNav />
    </Router>
  )
}

export default AppRoutes
