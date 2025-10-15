import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Client, ClientInput } from '../types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const searchClients = async (query: string): Promise<Client[]> => {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('last_name', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data || [];
  };

  const createClient = async (clientData: ClientInput): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from client creation');

    await fetchClients();
    return data;
  };

  const updateClient = async (id: string, updates: Partial<ClientInput>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from client update');

    await fetchClients();
    return data;
  };

  const getClientById = async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  return {
    clients,
    loading,
    error,
    searchClients,
    createClient,
    updateClient,
    getClientById,
    refetch: fetchClients,
  };
}
