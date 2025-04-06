import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {createContext, useEffect, useState} from 'react';
import {BASE_API_URL} from '../utils';
import {Alert} from 'react-native';

export const AppContext = createContext();

export default function AppProvider({children}) {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const loadTheme = async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (theme) {
        setTheme(theme);
      } else {
        setTheme('light');
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(BASE_API_URL + '/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          setToken(token);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
        setIsAuthenticating(false);
      }
    };

    fetchUser();
  }, [isAuthenticating]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        loading,
        setIsAuthenticating,
        theme,
        toggleTheme,
        logout,
      }}>
      {children}
    </AppContext.Provider>
  );
}
