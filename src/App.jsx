import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PasswordReset from "./pages/PasswordReset";
import ChangePassword from "./pages/ChangePassword";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/u/:username' element={<UserPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/setting' element={<Settings />} />
          <Route path='/reset' element={<PasswordReset />} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
