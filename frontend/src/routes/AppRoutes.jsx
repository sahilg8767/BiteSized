import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateFood from '../pages/CreateFood'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/Home'
import PartnerProfile from '../pages/PartnerProfile'
import Saved from '../pages/Saved'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import ProtectedRoute from '../components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/partner/:id' element={<PartnerProfile />} />

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

        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
