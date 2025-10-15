import { motion } from 'framer-motion';

interface ChipsQuestionProps {
  options: { value: string; label: string; icon?: string }[];
  value?: string[] | string;
  onChange: (value: string[] | string) => void;
  multiple?: boolean;
}

export function ChipsQuestion({ options, value, onChange, multiple = false }: ChipsQuestionProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-300 ${
              isSelected
                ? 'bg-sage-900 text-white shadow-medium'
                : 'bg-white border-2 border-sage-200 text-dark hover:border-sage-300 hover:shadow-soft'
            }`}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
