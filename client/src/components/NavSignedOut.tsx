import { NavLink } from "react-router-dom";
import "./NavSignedOut.scss";

const NavSignedOut = () => {
  return (
    <nav className="navSignedOut">
      <NavLink to="/auth/login">Login</NavLink>
      <NavLink to="/auth/register">Register</NavLink>
    </nav>
  );
};

export default NavSignedOut;
