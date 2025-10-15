import { motion } from 'framer-motion';

interface ToggleQuestionProps {
  value?: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleQuestion({ value, onChange }: ToggleQuestionProps) {
  return (
    <div className="flex gap-4">
      <motion.button
        type="button"
        onClick={() => onChange(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex-1 px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 ${
          value === true
            ? 'bg-sage-900 text-white shadow-medium'
            : 'bg-white border-2 border-sage-200 text-dark hover:border-sage-300'
        }`}
      >
        Oui
      </motion.button>
      <motion.button
        type="button"
        onClick={() => onChange(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex-1 px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 ${
          value === false
            ? 'bg-sage-900 text-white shadow-medium'
            : 'bg-white border-2 border-sage-200 text-dark hover:border-sage-300'
        }`}
      >
        Non
      </motion.button>
    </div>
  );
}
