import { motion } from 'framer-motion';

interface CardsQuestionProps {
  options: { value: string; label: string; icon?: string }[];
  value?: string[] | string;
  onChange: (value: string[] | string) => void;
  multiple?: boolean;
  maxSelections?: number;
  onAutoNext?: () => void;
}

export function CardsQuestion({
  options,
  value,
  onChange,
  multiple = false,
  maxSelections,
  onAutoNext,
}: CardsQuestionProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      if (selectedValues.includes(optionValue)) {
        const newValue = selectedValues.filter((v) => v !== optionValue);
        onChange(newValue);
      } else {
        if (maxSelections && selectedValues.length >= maxSelections) {
          const newValue = [...selectedValues.slice(1), optionValue];
          onChange(newValue);
        } else {
          onChange([...selectedValues, optionValue]);
        }
      }
    } else {
      onChange(optionValue);
      // Déclenchement automatique pour les questions à choix unique
      setTimeout(() => onAutoNext?.(), 500);
    }
  };

  const gridClass = options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4';

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-2xl transition-all duration-300 ${
              isSelected
                ? 'bg-sage-900 text-white shadow-strong border-2 border-sage-900'
                : 'bg-white text-dark shadow-soft border-2 border-sage-100 hover:border-sage-300 hover:shadow-medium'
            }`}
          >
            {option.icon && (
              <div className="text-4xl mb-3">{option.icon}</div>
            )}
            <div className="font-medium text-lg">{option.label}</div>
          </motion.button>
        );
      })}
    </div>
  );
}
