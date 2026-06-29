import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateFood from '../pages/CreateFood'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/Home'
import Reels from '../pages/Reels'
import PartnerProfile from '../pages/PartnerProfile'
import PartnerDashboard from '../pages/PartnerDashboard'
import Search from '../pages/Search'
import Saved from '../pages/Saved'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import ProtectedRoute from '../components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/reels' element={<Reels />} />
        <Route path='/search' element={<Search />} />
        <Route path='/partner/:id' element={<PartnerProfile />} />

        <Route
          path='/partner/dashboard'
          element={
            <ProtectedRoute role='food-partner'>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/food/create'
          element={
            <ProtectedRoute role='food-partner'>
              <CreateFood />
            </ProtectedRoute>
          }
        />

        <Route
          path='/saved'
          element={
            <ProtectedRoute role='user'>
              <Saved />
            </ProtectedRoute>
          }
        />

        <Route path='/cart' element={<Cart />} />
        <Route
          path='/checkout'
          element={
            <ProtectedRoute role='user'>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute role='user'>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
