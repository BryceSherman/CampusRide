import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAsgardeo } from '@asgardeo/react';
import { authService, userService } from '../utils/api';

const AuthContextInternal = createContext();

export const AuthProvider = ({ children }) => {
  const {
    isSignedIn,
    isLoading: asgardeoLoading,
    user: asgardeoUser,
    signOut: asgardeoSignOut
  } = useAsgardeo();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (asgardeoLoading) return;

    const initializeUser = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isSignedIn) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userInfo = asgardeoUser;

        if (!userInfo) {
          setUser(null);
          setLoading(false);
          return;
        }

        const email =
          userInfo?.emails?.[0]?.value ??
          userInfo?.emails?.[0] ??
          userInfo?.email ??
          userInfo?.username ??
          userInfo?.userName ??
          '';

        const givenName =
          userInfo?.name?.givenName ??
          userInfo?.given_name ??
          userInfo?.givenName ??
          '';

        const familyName =
          userInfo?.name?.familyName ??
          userInfo?.family_name ??
          userInfo?.familyName ??
          '';

        const displayName =
          `${givenName} ${familyName}`.trim() ||
          userInfo?.displayName ||
          userInfo?.username ||
          userInfo?.userName ||
          email ||
          'User';

        const resolvedId =
          userInfo?.id ??
          userInfo?.sub ??
          userInfo?.userName ??
          userInfo?.username ??
          email;

        const asgardeoUserKey = `asgardeo_user_${email}`;
        const savedUserData = localStorage.getItem(asgardeoUserKey);

        let savedRole = 'rider';
        let isReturningUser = false;

        if (savedUserData) {
          isReturningUser = true;
          const parsed = JSON.parse(savedUserData);
          savedRole = parsed.role || 'rider';
        }

        const userData = {
          email,
          name: displayName,
          id: resolvedId,
          authId: resolvedId,
          role: savedRole,
          isFirstLogin: !isReturningUser,
        };

        setUser(userData);
        localStorage.setItem(asgardeoUserKey, JSON.stringify(userData));

        await userService.updateProfile(email, {
          name: displayName,
          role: savedRole,
        });
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [isSignedIn, asgardeoLoading, asgardeoUser]);

  const setUserRole = async (role) => {
    const updatedUser = {
      ...user,
      role,
      isFirstLogin: false,
    };

    setUser(updatedUser);

    if (updatedUser?.email) {
      const asgardeoUserKey = `asgardeo_user_${updatedUser.email}`;
      localStorage.setItem(asgardeoUserKey, JSON.stringify(updatedUser));

      await userService.updateProfile(updatedUser.email, {
        name: updatedUser.name,
        role,
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusride_token');

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('asgardeo_user_')) {
        localStorage.removeItem(key);
      }
    });

    if (isSignedIn) {
      asgardeoSignOut().catch(console.error);
    }
  };

  const storeToken = (token) => {
    localStorage.setItem('campusride_token', token);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    setUserRole,
    logout,
    storeToken,
  };

  return (
    <AuthContextInternal.Provider value={value}>
      {children}
    </AuthContextInternal.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContextInternal);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};