import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export type FavoriteListing = {
  id: string;
  type?: 'property' | 'vehicle';
  title: string;
  location?: string;
  price?: string;
  category?: string;
  posterName?: string;
  posterRole?: string;
  posterPhone?: string;
  posterEmail?: string;
  posterVerified?: boolean;
  posterRating?: string;
};

type FavoritesContextValue = {
  favorites: FavoriteListing[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (listing: FavoriteListing) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const value = useMemo<FavoritesContextValue>(() => {
    const isFavorite = (id: string) => favorites.some((item) => item.id === id);

    const toggleFavorite = (listing: FavoriteListing) => {
      setFavorites((current) => {
        const exists = current.some((item) => item.id === listing.id);
        return exists ? current.filter((item) => item.id !== listing.id) : [listing, ...current];
      });
    };

    return {
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite: (id: string) => {
        setFavorites((current) => current.filter((item) => item.id !== id));
      },
      clearFavorites: () => setFavorites([]),
    };
  }, [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}