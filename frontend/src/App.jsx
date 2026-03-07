import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import LeavePage from './pages/LeavePage';
import Login from './pages/Login';
import ProtectedRoute from '../routes/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/leave" element={<LeavePage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
