import { NavLink } from "react-router-dom";
import "./NavSignedIn.scss";

const NavSignedIn = () => {
  return (
    <nav className="navSignedIn">
      <p>Avatar</p>
      <ul>
        <ol>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </ol>
        <ol>
          <NavLink to="/auth/logout">Logout</NavLink>
        </ol>
      </ul>
    </nav>
  );
};

export default NavSignedIn;
