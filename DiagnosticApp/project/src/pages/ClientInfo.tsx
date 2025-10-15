import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Check, X, ArrowLeft } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { useClients } from '../hooks/useClients';
import { useTheme } from '../hooks/useTheme';
import type { Client, ClientInput } from '../types';

export function ClientInfo() {
  const navigate = useNavigate();
  const { currentType, setClient } = useDiagnosticStore();
  const { searchClients, createClient } = useClients();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState<ClientInput>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentType) {
      navigate('/');
    }
  }, [currentType, navigate]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchClients(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectClient = (client: Client) => {
    setClient(client);
    navigate('/diagnostic');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientInput, string>> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'Prénom requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Nom requis';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date de naissance requise';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const client = await createClient(formData);
      setClient(client);
      navigate('/diagnostic');
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
    if (match) {
      return [match[1], match[2], match[3], match[4], match[5]].filter(Boolean).join(' ');
    }
    return value;
  };

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-8">
        <motion.button
          onClick={() => navigate('/dashboard')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 text-dark-light hover:text-sage-900 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl text-primary mb-2">
            Informations client
          </h1>
          <p className="text-dark-light">
            Recherchez un client existant ou créez-en un nouveau
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un client existant..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-sage-200 bg-white text-dark text-lg focus:border-sage-400 transition-all"
            />
          </div>

          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              {searchResults.map((client) => (
                <motion.button
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-4 rounded-xl bg-sage-50 hover:bg-sage-100 transition-colors text-left"
                >
                  <div className="font-medium text-primary">
                    {client.first_name} {client.last_name}
                  </div>
                  <div className="text-sm text-dark-light">
                    {client.email} • {client.phone}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-cream-50 px-6 text-dark-light text-sm">
              ou créer un nouveau client
            </span>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className={`input-field ${errors.last_name ? 'border-red-400' : ''}`}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.last_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className={`input-field ${errors.first_name ? 'border-red-400' : ''}`}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.first_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className={`input-field ${errors.date_of_birth ? 'border-red-400' : ''}`}
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="06 12 34 56 78"
                className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-dark mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@example.com"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? 'Création...' : 'Continuer'}
              {!isSubmitting && <Check className="w-5 h-5 ml-2 inline" />}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
