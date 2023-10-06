import {NavLink} from 'react-router-dom'

const Header = () => {
  return (
    <header>
        <nav>
            <ul>
                <ol><NavLink to="/">Home</NavLink></ol>
                <ol><NavLink to="/auth/login">Login</NavLink></ol>
                <ol><NavLink to="/auth/register">Register</NavLink></ol>
            </ul>
        </nav>
    </header>
  )
}

export default Header