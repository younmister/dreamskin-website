import { motion } from 'framer-motion';

interface TextQuestionProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export function TextQuestion({ value, onChange, placeholder, multiline = false }: TextQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-5 py-4 rounded-xl border-2 text-base resize-none transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--sage-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(104, 211, 145, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-primary)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-xl border-2 text-base transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--sage-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(104, 211, 145, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-primary)';
            e.target.style.boxShadow = 'none';
          }}
        />
      )}
    </motion.div>
  );
}
