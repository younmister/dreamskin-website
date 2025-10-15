import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  Eye, 
  MessageSquare, 
  Plus,
  FileText,
  Clock,
  User,
  Mail,
  Phone,
  Edit3,
  Trash2,
  AlertTriangle,
  Users,
  BarChart3,
  Heart,
  Sparkles,
  Scissors
} from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { useDiagnostics } from '../hooks/useDiagnostics';
import { usePractitionerNotes } from '../hooks/usePractitionerNotes';
import { useTheme } from '../hooks/useTheme';
import { exportDiagnosticToPDF } from '../utils/pdfExport';
import { generateClientProfile } from '../utils/clientProfileGenerator';
import { ClientProfileSummary } from '../components/ClientProfileSummary';
import type { Client, Diagnostic, DiagnosticType } from '../types';

export function ClientProfile() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { clients } = useClients();
  const { diagnostics, deleteDiagnostic } = useDiagnostics();
  const { note: practitionerNote, setNote: setPractitionerNote, saveNote, isLoading: isSavingNote } = usePractitionerNotes(clientId || '');
  const { isDark } = useTheme();
  
  const [client, setClient] = useState<Client | null>(null);
  const [clientDiagnostics, setClientDiagnostics] = useState<Diagnostic[]>([]);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<Diagnostic | null>(null);
  const [showDiagnosticDetails, setShowDiagnosticDetails] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [clientProfile, setClientProfile] = useState(generateClientProfile([]));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [diagnosticToDelete, setDiagnosticToDelete] = useState<Diagnostic | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  useEffect(() => {
    if (clientId && clients.length > 0) {
      const foundClient = clients.find(c => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
      } else {
        navigate('/clients');
      }
    }
  }, [clientId, clients, navigate]);

  useEffect(() => {
    if (clientId) {
      const clientDiags = diagnostics
        .filter(d => d.client_id === clientId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setClientDiagnostics(clientDiags);
      setClientProfile(generateClientProfile(clientDiags));
    }
  }, [clientId, diagnostics]);

  const getDiagnosticTypeLabel = (type: DiagnosticType) => {
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

  const getDiagnosticTypeIcon = (type: DiagnosticType) => {
    switch (type) {
      case 'massage':
        return <Heart className="w-6 h-6 text-amber-500" />;
      case 'skincare':
        return <Sparkles className="w-6 h-6 text-sage-500" />;
      case 'headspa':
        return <Scissors className="w-6 h-6 text-cyan-500" />;
      default:
        return <FileText className="w-6 h-6 text-sage-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportPDF = (diagnostic: Diagnostic) => {
    if (client) {
      exportDiagnosticToPDF(diagnostic, client);
    }
  };

  const handleViewDiagnostic = (diagnostic: Diagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setShowDiagnosticDetails(true);
  };

  const handleLongPress = (diagnostic: Diagnostic) => {
    setDiagnosticToDelete(diagnostic);
    setShowDeleteModal(true);
  };

  const handleDeleteDiagnostic = async () => {
    if (!diagnosticToDelete) return;
    
    console.log('Suppression du diagnostic:', diagnosticToDelete.id);
    setIsDeleting(true);
    try {
      // Supprimer de la base de données via le hook
      await deleteDiagnostic(diagnosticToDelete.id);
      console.log('Diagnostic supprimé avec succès');
      
      // Fermer la modal
      setShowDeleteModal(false);
      setDiagnosticToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du diagnostic: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePressStart = (diagnosticId: string) => {
    setPressedItem(diagnosticId);
  };

  const handlePressEnd = () => {
    setPressedItem(null);
  };

  const getPractitionerStats = () => {
    console.log('Client diagnostics:', clientDiagnostics);
    console.log('Diagnostics with practitioner info:', clientDiagnostics.map(d => ({ 
      id: d.id, 
      practitioner_id: d.answers?.practitioner_id, 
      practitioner_name: d.answers?.practitioner_name 
    })));
    
    const sofiaCount = clientDiagnostics.filter(d => d.answers?.practitioner_id === 'sofia').length;
    const islamCount = clientDiagnostics.filter(d => d.answers?.practitioner_id === 'islam').length;
    
    console.log('Sofia count:', sofiaCount, 'Islam count:', islamCount);
    
    return {
      sofia: sofiaCount,
      islam: islamCount,
      total: sofiaCount + islamCount
    };
  };

  const handleSaveNote = async () => {
    try {
      await saveNote(practitionerNote);
      setIsEditingNote(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-sage-200 border-t-sage-900 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/clients')}
            className="mb-6 text-dark-light hover:text-sage-900 transition-colors flex items-center gap-3 text-lg touch-manipulation"
          >
            <ArrowLeft className="w-6 h-6" />
            Retour aux clients
          </button>

          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center text-sage-900 font-semibold text-3xl flex-shrink-0">
              {client.first_name[0]}{client.last_name[0]}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-5xl text-primary mb-3">
                {client.first_name} {client.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-dark-light text-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  {client.email}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  {client.phone}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  {new Date(client.date_of_birth).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profil Client */}
        {(clientProfile.skincare || clientProfile.massage || clientProfile.headspa) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="font-semibold text-2xl text-primary mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-sage-600" />
              Profil client
            </h2>
            <ClientProfileSummary profile={clientProfile} />
          </motion.div>
        )}

        {/* Statistiques des Praticiennes */}
        {clientDiagnostics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-semibold text-2xl text-primary mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-sage-600" />
              Suivi par praticienne
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const stats = getPractitionerStats();
                const practitioners = [
                  {
                    id: 'sofia',
                    name: 'Sofia',
                    count: stats.sofia,
                    color: 'from-pink-400 to-rose-500',
                    avatar: '/Praticienne1.jpg'
                  },
                  {
                    id: 'islam',
                    name: 'Islam',
                    count: stats.islam,
                    color: 'from-blue-400 to-indigo-500',
                    avatar: '/Praticienne2.png'
                  }
                ];
                
                
                return practitioners.map((practitioner) => (
                  <div key={practitioner.id} className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <img
                          src={practitioner.avatar}
                          alt={`Avatar de ${practitioner.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-primary mb-1">
                          {practitioner.name}
                        </h3>
                        <p className="text-sage-600 text-lg">
                          {practitioner.count} diagnostic{practitioner.count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sidebar - Diagnostics History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-1"
          >
            <div className="card mb-6">
              <h2 className="font-semibold text-xl text-primary mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-sage-600" />
                Historique des diagnostics
              </h2>
              
              {clientDiagnostics.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-sage-200 mx-auto mb-4" />
                  <p className="text-dark-light text-lg">Aucun diagnostic</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientDiagnostics.map((diagnostic, index) => (
                    <motion.div
                      key={diagnostic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className={`p-5 rounded-xl transition-all duration-200 cursor-pointer group touch-manipulation relative overflow-hidden ${
                        pressedItem === diagnostic.id 
                          ? 'bg-red-100 border-2 border-red-300 scale-95 shadow-lg' 
                          : 'bg-sage-50 hover:bg-sage-100 hover:shadow-md'
                      }`}
                      onClick={() => handleViewDiagnostic(diagnostic)}
                      onTouchStart={() => handlePressStart(diagnostic.id)}
                      onTouchEnd={handlePressEnd}
                      onMouseDown={() => handlePressStart(diagnostic.id)}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={handlePressEnd}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleLongPress(diagnostic);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Indicateur de suppression */}
                      {pressedItem === diagnostic.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center z-10"
                        >
                          <div className="text-center">
                            <Trash2 className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="text-red-600 font-medium text-sm">Maintenez pour supprimer</p>
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                            {getDiagnosticTypeIcon(diagnostic.diagnostic_type)}
                          </div>
                          <span className="font-medium text-primary text-lg">
                            {getDiagnosticTypeLabel(diagnostic.diagnostic_type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-dark-light group-hover:text-sage-600 transition-colors" />
                          <Trash2 className="w-4 h-4 text-sage-300 group-hover:text-red-400 transition-colors" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-dark-light">
                        <Clock className="w-4 h-4" />
                        {formatDate(diagnostic.created_at)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate(`/client-info?clientId=${client.id}`)}
                className="w-full mt-6 btn-secondary flex items-center justify-center gap-3 text-lg py-4 touch-manipulation"
              >
                <Plus className="w-6 h-6" />
                Nouveau diagnostic
              </button>
            </div>

            {/* Practitioner Notes */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl text-primary flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-sage-600" />
                  Notes praticien
                </h2>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 touch-manipulation"
                  >
                    <Edit3 className="w-6 h-6" />
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div>
                  <textarea
                    value={practitionerNote}
                    onChange={(e) => setPractitionerNote(e.target.value)}
                    placeholder="Ajoutez vos notes personnalisées pour ce client..."
                    className="w-full p-4 rounded-xl border-2 border-sage-200 bg-white text-dark resize-none h-40 focus:border-sage-400 transition-all text-lg"
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleSaveNote}
                      disabled={isSavingNote}
                      className="btn-primary text-lg px-6 py-3 disabled:opacity-50 touch-manipulation"
                    >
                      {isSavingNote ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="btn-secondary text-lg px-6 py-3 touch-manipulation"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-dark-light text-lg leading-relaxed">
                  {practitionerNote || "Aucune note pour ce client"}
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content - Selected Diagnostic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2"
          >
            {selectedDiagnostic && showDiagnosticDetails ? (
              <div className="card">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                        {getDiagnosticTypeIcon(selectedDiagnostic.diagnostic_type)}
                      </div>
                      <h2 className="font-semibold text-2xl text-primary">
                        {getDiagnosticTypeLabel(selectedDiagnostic.diagnostic_type)}
                      </h2>
                    </div>
                    <p className="text-dark-light text-lg">
                      Réalisé le {formatDate(selectedDiagnostic.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleExportPDF(selectedDiagnostic)}
                    className="btn-primary flex items-center gap-3 text-lg py-3 px-6 touch-manipulation"
                  >
                    <Download className="w-6 h-6" />
                    Exporter PDF
                  </button>
                </div>

                <div className="space-y-8">
                  {Object.entries(selectedDiagnostic.answers).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    
                    return (
                      <div key={key} className="border-l-4 border-sage-200 pl-6">
                        <h3 className="font-medium text-primary mb-3 capitalize text-lg">
                          {key.replace(/_/g, ' ')}
                        </h3>
                        <div className="text-dark-light text-lg leading-relaxed">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 pt-8 border-t border-sage-200">
                  <button
                    onClick={() => setShowDiagnosticDetails(false)}
                    className="btn-secondary text-lg py-3 px-6 touch-manipulation"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center py-16">
                <FileText className="w-20 h-20 text-sage-200 mx-auto mb-6" />
                <h3 className="font-semibold text-2xl text-primary mb-4">
                  Sélectionnez un diagnostic
                </h3>
                <p className="text-dark-light text-lg">
                  Cliquez sur un diagnostic dans l'historique pour voir les détails
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-2xl font-semibold text-primary mb-4">
                Supprimer le diagnostic
              </h3>
              
              <p className="text-dark-light text-lg mb-8">
                Êtes-vous sûr de vouloir supprimer ce diagnostic ? Cette action est irréversible.
              </p>
              
              {diagnosticToDelete && (
                <div className="bg-sage-50 rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                      {getDiagnosticTypeIcon(diagnosticToDelete.diagnostic_type)}
                    </div>
                    <div>
                      <p className="font-medium text-primary">
                        {getDiagnosticTypeLabel(diagnosticToDelete.diagnostic_type)}
                      </p>
                      <p className="text-sm text-dark-light">
                        {formatDate(diagnosticToDelete.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary text-lg py-4 touch-manipulation"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteDiagnostic}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl text-lg py-4 transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Suppression...
                    </div>
                  ) : (
                    'Supprimer'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
