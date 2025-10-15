import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Diagnostic, DiagnosticWithClient, DiagnosticType, DiagnosticAnswers } from '../types';

export function useDiagnostics(clientId?: string) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('diagnostics')
        .select(`
          *,
          client:clients(*)
        `)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDiagnostics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch diagnostics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [clientId]);

  const createDiagnostic = async (params: {
    client_id: string;
    diagnostic_type: DiagnosticType;
    answers: DiagnosticAnswers;
    signature_data?: string;
    practitioner_id?: string;
    practitioner_name?: string;
  }): Promise<Diagnostic> => {
    // Ajouter les informations du praticien dans les answers pour l'instant
    const answersWithPractitioner = {
      ...params.answers,
      practitioner_id: params.practitioner_id,
      practitioner_name: params.practitioner_name,
    };

    const { data, error } = await supabase
      .from('diagnostics')
      .insert({
        client_id: params.client_id,
        diagnostic_type: params.diagnostic_type,
        answers: answersWithPractitioner,
        signature_data: params.signature_data,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    if (!data) throw new Error('No data returned from diagnostic creation');

    await fetchDiagnostics();
    return data;
  };

  const updateDiagnostic = async (
    id: string,
    updates: Partial<Pick<Diagnostic, 'answers' | 'signature_data' | 'completed_at'>>
  ): Promise<Diagnostic> => {
    const { data, error } = await supabase
      .from('diagnostics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from diagnostic update');

    await fetchDiagnostics();
    return data;
  };

  const getDiagnosticById = async (id: string): Promise<DiagnosticWithClient | null> => {
    const { data, error } = await supabase
      .from('diagnostics')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const deleteDiagnostic = async (id: string): Promise<void> => {
    console.log('Suppression du diagnostic ID:', id);
    
    const { error } = await supabase
      .from('diagnostics')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase lors de la suppression:', error);
      throw error;
    }
    
    console.log('Diagnostic supprimé de Supabase, rechargement des données...');
    await fetchDiagnostics();
    console.log('Données rechargées');
  };

  return {
    diagnostics,
    loading,
    error,
    createDiagnostic,
    updateDiagnostic,
    getDiagnosticById,
    deleteDiagnostic,
    refetch: fetchDiagnostics,
  };
}
