import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateFood from '../pages/CreateFood'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import Home from '../pages/Home'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/food/create' element={<CreateFood />} />
        <Route path='/user/register' element={<UserRegister />} />
        <Route path='/user/login' element={<UserLogin />} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
