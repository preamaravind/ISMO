import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getMe } from '../api/authApi';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined') {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await getMe();
          setUser(response.data.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loginUser = async (credentials) => {
    const res = await login(credentials);
    const { token, user } = res.data.data;
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return res;
  };

  const registerUser = async (data) => {
    const res = await register(data);
    const { token, user } = res.data.data;
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return res;
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch(err) {
      console.error('Logout error', err);
    }
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, register: registerUser, logout: logoutUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
