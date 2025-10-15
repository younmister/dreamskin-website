import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { getDiagnosticQuestions } from '../data/diagnosticQuestions';
import { ConversationalDiagnostic } from '../components/ConversationalDiagnostic';

export function DiagnosticPage() {
  const navigate = useNavigate();
  const { currentType, currentClient, currentAnswers, updateAnswers } = useDiagnosticStore();

  useEffect(() => {
    if (!currentType || !currentClient) {
      navigate('/');
    }
  }, [currentType, currentClient, navigate]);

  if (!currentType || !currentClient) {
    return null;
  }

  const questions = getDiagnosticQuestions(currentType);

  const handleComplete = () => {
    navigate('/summary');
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <ConversationalDiagnostic
      questions={questions}
      answers={currentAnswers}
      onAnswersChange={updateAnswers}
      onComplete={handleComplete}
      onClose={handleClose}
    />
  );
}
