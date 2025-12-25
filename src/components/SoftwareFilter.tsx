import { motion } from 'framer-motion';

interface SoftwareFilterProps {
  software: string[];
  selectedSoftware: string | null;
  onSelectSoftware: (software: string | null) => void;
  language: 'en' | 'fr';
}

export function SoftwareFilter({
  software,
  selectedSoftware,
  onSelectSoftware,
  language
}: SoftwareFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
        {language === 'fr' ? 'Filtrer par logiciel' : 'Filter by Software'}
      </h3>
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectSoftware(null)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selectedSoftware === null
              ? 'bg-red-600 text-white'
              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
          }`}
        >
          {language === 'fr' ? 'Tous' : 'All'}
        </motion.button>
        {software.map((sw) => (
          <motion.button
            key={sw}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectSoftware(sw)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedSoftware === sw
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            {sw}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
