'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isLoading } from '@/lib/axios';
import Loader from '@/components/global/loader';

const LoaderContext = createContext<{ loading: boolean }>({
  loading: false,
});

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkLoading = () => {
      setLoading(isLoading());
    };

    const interval = setInterval(checkLoading, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading }}>
      {loading && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  return useContext(LoaderContext);
};
