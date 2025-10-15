import { useState, useEffect } from 'react';

interface PractitionerNote {
  clientId: string;
  note: string;
  updatedAt: string;
}

const STORAGE_KEY = 'practitioner_notes';

export const usePractitionerNotes = (clientId: string) => {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger la note existante
    const loadNote = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const notes: PractitionerNote[] = JSON.parse(stored);
          const clientNote = notes.find(n => n.clientId === clientId);
          if (clientNote) {
            setNote(clientNote.note);
          }
        }
      } catch (error) {
        console.error('Error loading practitioner note:', error);
      }
    };

    loadNote();
  }, [clientId]);

  const saveNote = async (newNote: string) => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let notes: PractitionerNote[] = stored ? JSON.parse(stored) : [];
      
      // Mettre à jour ou créer la note
      const existingIndex = notes.findIndex(n => n.clientId === clientId);
      const noteData: PractitionerNote = {
        clientId,
        note: newNote,
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        notes[existingIndex] = noteData;
      } else {
        notes.push(noteData);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      setNote(newNote);
    } catch (error) {
      console.error('Error saving practitioner note:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    note,
    setNote,
    saveNote,
    isLoading
  };
};

