import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, User, ChevronDown, LogOut } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { useDiagnostics } from '../hooks/useDiagnostics';
import { usePractitioner } from '../hooks/usePractitioner';
import { useTheme } from '../hooks/useTheme';

export function ClientList() {
  const navigate = useNavigate();
  const { clients, loading } = useClients();
  const { diagnostics } = useDiagnostics();
  const { selectedPractitioner, isLoading, practitioners, selectPractitioner, clearPractitioner } = usePractitioner();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [pressedClient, setPressedClient] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!isLoading && !selectedPractitioner) {
      navigate('/');
    }
  }, [selectedPractitioner, isLoading, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    clearPractitioner();
    navigate('/');
  };

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.first_name.toLowerCase().includes(query) ||
      client.last_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query)
    );
  });

  const getClientDiagnosticsCount = (clientId: string) => {
    return diagnostics.filter((d) => d.client_id === clientId).length;
  };

  const getLastDiagnostic = (clientId: string) => {
    const clientDiags = diagnostics
      .filter((d) => d.client_id === clientId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return clientDiags[0];
  };

  const handlePressStart = (clientId: string) => {
    setPressedClient(clientId);
  };

  const handlePressEnd = () => {
    setPressedClient(null);
  };

  const getDiagnosticTypeLabel = (type: string) => {
    switch (type) {
      case 'massage':
        return 'Massage';
      case 'skincare':
        return 'Skincare';
      case 'headspa':
        return 'Head Spa';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.button
          onClick={() => navigate('/dashboard')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 text-dark-light hover:text-sage-900 transition-colors flex items-center gap-3 text-lg touch-manipulation"
        >
          <ArrowLeft className="w-6 h-6" />
          Retour
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-5xl text-primary mb-3">Mes clients</h1>
              <p className="text-dark-light text-xl">{clients.length} client{clients.length > 1 ? 's' : ''}</p>
            </div>
            
            {selectedPractitioner && (
              <div className="relative profile-menu-container">
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="card p-4 w-full text-left hover:shadow-lg transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                        <img
                          src={selectedPractitioner.avatar}
                          alt={`Avatar de ${selectedPractitioner.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-sage-700 font-medium text-lg">{selectedPractitioner.name}</p>
                        <p className="text-sage-500 text-sm">{selectedPractitioner.role}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: showProfileMenu ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-sage-600" />
                    </motion.div>
                  </div>
                </motion.button>

                {/* Menu déroulant */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-full left-0 right-0 mt-2 z-50"
                    >
                      <div className="card p-2 shadow-xl">
                        {/* Autres praticiennes */}
                        {practitioners
                          .filter(p => p.id !== selectedPractitioner.id)
                          .map((practitioner, index) => (
                            <motion.button
                              key={practitioner.id}
                              onClick={() => {
                                selectPractitioner(practitioner.id);
                                setShowProfileMenu(false);
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-sage-50 transition-colors relative overflow-hidden"
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-sage-100 opacity-0"
                                whileTap={{ opacity: 0.5 }}
                                transition={{ duration: 0.2 }}
                              />
                              <motion.div 
                                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white relative z-10"
                                whileTap={{ scale: 0.9 }}
                              >
                                <img
                                  src={practitioner.avatar}
                                  alt={`Avatar de ${practitioner.name}`}
                                  className="w-full h-full object-cover"
                                />
                              </motion.div>
                              <div className="relative z-10">
                                <p className="font-medium text-primary">{practitioner.name}</p>
                                <p className="text-sm text-sage-600">{practitioner.role}</p>
                              </div>
                            </motion.button>
                          ))}
                        
                        <div className="border-t border-sage-200 my-2"></div>
                        
                        <motion.button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-gray-50 transition-colors text-gray-500"
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium text-sm">Accueil</span>
                        </motion.button>
                      </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full pl-16 pr-6 py-5 rounded-xl border-2 text-xl transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-sage-200 border-t-sage-900 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {filteredClients.map((client, index) => {
              const lastDiag = getLastDiagnostic(client.id);
              const diagCount = getClientDiagnosticsCount(client.id);

              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card-interactive touch-manipulation transition-all duration-200 ${
                    pressedClient === client.id 
                      ? 'scale-95 shadow-lg bg-sage-100' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => navigate(`/client/${client.id}`)}
                  onTouchStart={() => handlePressStart(client.id)}
                  onTouchEnd={handlePressEnd}
                  onMouseDown={() => handlePressStart(client.id)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-6 p-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center text-sage-900 font-semibold text-2xl flex-shrink-0">
                      {client.first_name[0]}
                      {client.last_name[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-2xl text-primary mb-2">
                        {client.first_name} {client.last_name}
                      </h3>
                      <p className="text-lg text-dark-light mb-2">
                        {client.email} • {client.phone}
                      </p>
                      {lastDiag && (
                        <p className="text-base text-dark-light">
                          Dernier diagnostic : {getDiagnosticTypeLabel(lastDiag.diagnostic_type)} •{' '}
                          {new Date(lastDiag.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-4xl font-semibold text-primary">{diagCount}</div>
                      <div className="text-base text-dark-light">diagnostic{diagCount > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredClients.length === 0 && (
              <div className="text-center py-16">
                <User className="w-20 h-20 text-sage-200 mx-auto mb-6" />
                <p className="text-dark-light text-xl">Aucun client trouvé</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
