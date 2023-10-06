import Header from './components/Header'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home.tsx'
import Login from './components/auth/Login.tsx'
import Register from './components/auth/Register.tsx'

function App() {

  return (
    <>
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App