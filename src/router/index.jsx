import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/homePage/HomePage";
import App from "../App";


const PrivateRoute = ({ children }) => {
  const token = 'getToken()';
  return token ? <App Children={children} /> : <Navigate to="/login" />;
};

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PrivateRoute children={HomePage}></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
);

export default Router;
