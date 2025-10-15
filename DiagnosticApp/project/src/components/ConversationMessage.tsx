import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ConversationMessageProps {
  question: string;
  delay?: number;
  children?: React.ReactNode;
}

export function ConversationMessage({ question, delay = 0, children }: ConversationMessageProps) {
  const [showTyping, setShowTyping] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setShowTyping(false);
      setShowContent(true);
    }, delay + 1500);

    return () => clearTimeout(typingTimer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="flex flex-col items-start gap-4 mb-12"
    >
      <div className="flex items-start gap-4 w-full max-w-2xl">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center shadow-soft">
          <span className="text-xl">✨</span>
        </div>

        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: (delay + 300) / 1000 }}
            className="bg-white rounded-2xl rounded-tl-none p-6 shadow-soft"
          >
            {showTyping && (
              <div className="flex gap-1.5">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-sage-300 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-sage-300 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-sage-300 rounded-full"
                />
              </div>
            )}

            {showContent && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-lg text-dark leading-relaxed"
              >
                {question}
              </motion.p>
            )}
          </motion.div>

          {showContent && children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
