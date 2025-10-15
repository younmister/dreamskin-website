import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ConversationMessage } from './ConversationMessage';
import { ToggleQuestion } from './questions/ToggleQuestion';
import { ChipsQuestion } from './questions/ChipsQuestion';
import { CardsQuestion } from './questions/CardsQuestion';
import { TextQuestion } from './questions/TextQuestion';
import type { QuestionConfig, DiagnosticAnswers } from '../types';

interface ConversationalDiagnosticProps {
  questions: QuestionConfig[];
  answers: Partial<DiagnosticAnswers>;
  onAnswersChange: (answers: Partial<DiagnosticAnswers>) => void;
  onComplete: () => void;
}

export function ConversationalDiagnostic({
  questions,
  answers,
  onAnswersChange,
  onComplete,
}: ConversationalDiagnosticProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<QuestionConfig[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const evaluateConditional = (conditional: QuestionConfig['conditional']) => {
    if (!conditional) return true;

    const dependentValue = answers[conditional.dependsOn as keyof DiagnosticAnswers];

    if (Array.isArray(conditional.value)) {
      return Array.isArray(dependentValue) &&
        conditional.value.some(v => dependentValue.includes(v));
    }

    return dependentValue === conditional.value;
  };

  useEffect(() => {
    const visible = questions.filter((q) => evaluateConditional(q.conditional));
    setVisibleQuestions(visible);
  }, [questions, answers]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const currentQuestion = visibleQuestions[currentIndex];
  const isLastQuestion = currentIndex === visibleQuestions.length - 1;
  const canProceed = currentQuestion && answers[currentQuestion.id as keyof DiagnosticAnswers] !== undefined;

  const handleAnswer = (questionId: string, value: any) => {
    onAnswersChange({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const renderQuestion = (question: QuestionConfig) => {
    const value = answers[question.id as keyof DiagnosticAnswers];

    switch (question.type) {
      case 'toggle':
        return (
          <ToggleQuestion
            value={value as boolean}
            onChange={(val) => handleAnswer(question.id, val)}
          />
        );
      case 'chips':
        return (
          <ChipsQuestion
            options={question.options || []}
            value={value as string[] | string}
            onChange={(val) => handleAnswer(question.id, val)}
            multiple={question.multiple}
          />
        );
      case 'cards':
        return (
          <CardsQuestion
            options={question.options || []}
            value={value as string[] | string}
            onChange={(val) => handleAnswer(question.id, val)}
            multiple={question.multiple}
            maxSelections={question.maxSelections}
          />
        );
      case 'text':
      case 'textarea':
        return (
          <TextQuestion
            value={value as string}
            onChange={(val) => handleAnswer(question.id, val)}
            placeholder={question.placeholder}
            multiline={question.type === 'textarea'}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentIndex + 1) / visibleQuestions.length) * 100;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-cream-50 to-sage-50">
      <div className="sticky top-0 z-10 bg-white shadow-soft">
        <div className="max-w-3xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark-light">
              Question {currentIndex + 1} / {visibleQuestions.length}
            </span>
            <span className="text-sm font-medium text-sage-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sage-600 to-sage-900 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-8 py-12"
      >
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {visibleQuestions.slice(0, currentIndex + 1).map((question, index) => (
              <ConversationMessage
                key={question.id}
                question={question.question}
                delay={index === currentIndex ? 500 : 0}
              >
                {index === currentIndex && renderQuestion(question)}
              </ConversationMessage>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-sage-100 shadow-strong">
        <div className="max-w-3xl mx-auto px-8 py-6">
          <div className="flex gap-4">
            {currentIndex > 0 && (
              <motion.button
                type="button"
                onClick={handlePrevious}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 mr-2 inline" />
                Précédent
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              whileHover={{ scale: canProceed ? 1.02 : 1 }}
              whileTap={{ scale: canProceed ? 0.98 : 1 }}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isLastQuestion ? 'Terminer' : 'Suivant'}
              {!isLastQuestion && <ArrowRight className="w-5 h-5 ml-2 inline" />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
