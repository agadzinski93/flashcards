import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import NavSignedIn from "./NavSignedIn";
import NavSignedOut from "./NavSignedOut";
import "./Header.scss";

interface authObject {
  auth: {
    token: string | null;
  };
}

const Header = () => {
  const { token } = useSelector((state: authObject) => state.auth);
  return (
    <header>
      <div>
        <NavLink to="/">Logo</NavLink>
      </div>
      {token ? <NavSignedIn /> : <NavSignedOut />}
    </header>
  );
};

export default Header;
