import {NavLink,Outlet} from 'react-router-dom'
import { useSelector } from 'react-redux'

function App() {
  const {token} = useSelector(state => state.auth);

  return (
    <>
      <header>
        <nav>
            <ul>
                <ol><NavLink to="/">Home</NavLink></ol>
                {!token && <ol><NavLink to="/auth/login">Login</NavLink></ol>}
                {!token && <ol><NavLink to="/auth/register">Register</NavLink></ol>}
                {token && <ol><NavLink to="/auth/logout">Logout</NavLink></ol>}
                {token && <ol><NavLink to="/dashboard">Dashboard</NavLink></ol>}
            </ul>
        </nav>
      </header>
      <main>
      <Outlet />
      </main>
    </>
  )
}

export default App