import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "../utils/auth";
import HomePage from "../pages/homePage/HomePage";
import LoginPage from "../pages//loginPage/LoginPage";
import App from "../App";


const PrivateRoute = ({ children }) => {
  const token = getToken();
  return token ? <App Children={children} /> : <Navigate to="/login" />;
};

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<App Children={LoginPage} />} />
      <Route path="/" element={<PrivateRoute children={HomePage}></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
);

export default Router;
