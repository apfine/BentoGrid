import './App.css'
import { Routes , Route } from 'react-router-dom'
import Bento from './pages/Bento'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Bento />} />
    </Routes>
  )
}

export default App
