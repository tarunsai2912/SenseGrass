import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FieldForm from './components/FieldForm';
import Payment from './components/Payment';
import Visualization from './components/Visualization';
import NotFound from './pages/NotFound'
import Register from './pages/Register';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} >
          <Route index element={<FieldForm />} />
          <Route path="payment" element={<Payment/>}/>
          <Route path="visuals" element={<Visualization/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App

