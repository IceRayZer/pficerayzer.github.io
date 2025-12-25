import { useState, useEffect } from 'react';

const WISHLIST_KEY = 'portfolio_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse wishlist:', e);
        setWishlist([]);
      }
    }
  }, []);

  const toggleWishlist = (projectId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (projectId: string) => wishlist.includes(projectId);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlist.length
  };
}
