import { Navigate, Route, Routes } from 'react-router-dom';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RecoverPasswordScreen from '@/features/auth/screens/RecoverPasswordScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/recover-password" element={<RecoverPasswordScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
