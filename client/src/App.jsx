import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { initializeAuth } from "./redux/thunks/authThunk";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { user, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on app load
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader
            className="animate-spin text-indigo-600 mx-auto mb-4"
            size={48}
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
