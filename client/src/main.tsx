import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import store from "./redux/store.ts";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Home from "./screens/HomeScreen.tsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";
import RegisterScreen from "./screens/RegisterScreen.tsx";
import PrivateRoute from "./components/auth/PrivateRoute.tsx";
import DashboardScreen from "./screens/DashboardScreen.tsx";
import LogoutScreen from "./components/auth/Logout.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/auth/logout" element={<LogoutScreen />} />
      <Route path="" element={<PublicOnlyRoute />}>
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/register" element={<RegisterScreen />} />
      </Route>
      <Route path="" element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
