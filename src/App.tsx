import './variables.css';
import './App.css';
import NotFound from './components/NotFound';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/client/Register';
import Login from './pages/Login';
import './App.css';
import AdminNavbar from './components/admin/Navbar';
import Employees from './pages/admin/Employees';
import ScheduleSelector from './pages/admin/ScheduleSelector';
import Schedules from './pages/client/Schedules';
import ClientNavbar from './components/client/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/schedules" element={<ScheduleSelector />} />

        <Route path="/client/schedules" element={<Schedules />} />
        <Route path="/client/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AdminNavbar />
      <ClientNavbar />
    </BrowserRouter>
  );
}

export default App;
