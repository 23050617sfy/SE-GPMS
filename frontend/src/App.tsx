import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';

type UserRole = 'student' | 'teacher' | 'admin' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {user.role === 'student' && (
        <StudentDashboard user={user} onLogout={handleLogout} />
      )}
      {user.role === 'teacher' && (
        <TeacherDashboard user={user} onLogout={handleLogout} />
      )}
      {user.role === 'admin' && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
