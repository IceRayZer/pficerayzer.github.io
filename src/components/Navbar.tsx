import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Heart, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../types';

interface NavbarProps {
  wishlistCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onShuffle: () => void;
  onWishlistClick: () => void;
  onAdminClick: () => void;
  isAdmin?: boolean;
}

export function Navbar({
  wishlistCount,
  language,
  onLanguageChange,
  onShuffle,
  onWishlistClick,
  onAdminClick,
  isAdmin = false
}: NavbarProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setShowLanguageMenu(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-[100] bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
            >
              Portfolio
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShuffle}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'fr' ? 'Aléatoire' : 'Shuffle'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWishlistClick}
              className="relative p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Heart className="w-6 h-6 text-white" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md font-medium transition-colors"
              >
                {language.toUpperCase()}
                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden shadow-lg z-50"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleLanguageSelect('en')}
                      className={`w-full px-4 py-2 text-left font-medium transition-colors ${
                        language === 'en'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-zinc-700'
                      }`}
                    >
                      English (EN)
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleLanguageSelect('fr')}
                      className={`w-full px-4 py-2 text-left font-medium transition-colors ${
                        language === 'fr'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-zinc-700'
                      }`}
                    >
                      Français (FR)
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdminClick}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <User className={`w-6 h-6 ${isAdmin ? 'text-red-500' : 'text-white'}`} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
