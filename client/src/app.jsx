
import Signup from "./components/authentication/signup"
import Login from './components/authentication/login';
import ResetPassword from './components/authentication/resetPasswordOnProfile';
import Reset from './components/authentication/resetPassword';
import Server from './components/partials/serverError';
import Forgot from './components/authentication/forgot';
import Home from "./components/consumer/home";
import Cart from "./components/consumer/myCart";
import AddProducts from "./components/admin/addProducts";
import ShowProducts from "./components/admin/showProducts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/myCart" element={<Cart />} />
        <Route path="/addProducts" element={<AddProducts />} />
        <Route path="/showProducts" element={<ShowProducts />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Server />} />
      </Routes>
    </Router>
  )
}