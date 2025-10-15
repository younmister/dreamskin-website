import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, Users, User, Heart, Sparkles, Scissors, ChevronDown, LogOut, Plus, Sun, Moon } from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { useClients } from '../hooks/useClients';
import { useDiagnostics } from '../hooks/useDiagnostics';
import { usePractitioner } from '../hooks/usePractitioner';
import { useTheme } from '../hooks/useTheme';

export function Dashboard() {
  const navigate = useNavigate();
  const { setDiagnosticType, reset, setPractitioner } = useDiagnosticStore();
  const { clients } = useClients();
  const { diagnostics } = useDiagnostics();
  const { selectedPractitioner, isLoading, practitioners, selectPractitioner, clearPractitioner } = usePractitioner();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDiagnosticOptions, setShowDiagnosticOptions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileMenu]);

  useEffect(() => {
    if (!isLoading && !selectedPractitioner) {
      navigate('/');
    } else if (selectedPractitioner) {
      setPractitioner(selectedPractitioner);
    }
  }, [selectedPractitioner, isLoading, navigate, setPractitioner]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 via-sage-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleDiagnosticSelect = (type: 'massage' | 'skincare' | 'headspa') => {
    reset();
    setDiagnosticType(type);
    setPractitioner(selectedPractitioner);
    navigate('/client-info');
  };

  const handleProfileChange = (practitionerId: string) => {
    selectPractitioner(practitionerId);
    setShowProfileMenu(false);
    const practitioner = practitioners.find(p => p.id === practitionerId);
    if (practitioner) {
      setPractitioner(practitioner);
    }
  };

  const handleLogout = () => {
    clearPractitioner();
    setShowProfileMenu(false);
    navigate('/');
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const thisMonthDiagnostics = diagnostics.filter(d => {
    const diagDate = new Date(d.created_at);
    const now = new Date();
    return diagDate.getMonth() === now.getMonth() && diagDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div 
              className="w-72 h-72 rounded-2xl overflow-hidden shadow-lg"
              whileTap={{ scale: 0.95, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                src="/Logo3.png"
                alt="Dream Skin Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-dark-light text-sm uppercase tracking-wider text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {today}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-6 mb-12"
        >
          <motion.button
            onClick={() => navigate('/clients')}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="card text-center cursor-pointer active:shadow-medium transition-all duration-300 border-2 border-sage-300 relative overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              <Users className="w-8 h-8 sage-primary mx-auto mb-2" />
            </motion.div>
            <motion.div 
              className="text-3xl font-semibold text-primary mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              {clients.length}
            </motion.div>
            <div className="text-sm text-dark-light">Clients</div>
            <motion.div
              className="absolute inset-0 bg-sage-100 opacity-0"
              whileTap={{ opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
          <motion.button
            onClick={() => navigate('/clients')}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 100 }}
            className="card text-center cursor-pointer active:shadow-medium transition-all duration-300 border-2 border-sage-300 relative overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 200 }}
            >
              <Calendar className="w-8 h-8 sage-primary mx-auto mb-2" />
            </motion.div>
            <motion.div 
              className="text-3xl font-semibold text-primary mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 200 }}
            >
              {thisMonthDiagnostics}
            </motion.div>
            <div className="text-sm text-dark-light">Ce mois</div>
            <motion.div
              className="absolute inset-0 bg-sage-100 opacity-0"
              whileTap={{ opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display text-primary mb-6 text-center uppercase tracking-wide">
            Nouveau Diagnostic
          </h2>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!showDiagnosticOptions ? (
                <motion.button
                  key="main-button"
                  onClick={() => setShowDiagnosticOptions(true)}
                  initial={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden bg-white/20 backdrop-blur-xl border-2 border-sage-300 shadow-2xl shadow-sage-200/20 active:shadow-sage-300/30 transition-all duration-300 group"
                  style={{ minHeight: 'calc(3 * 128px + 2 * 16px)' }}
                >
                  <div className="absolute inset-0">
                    <img
                      src="/accueil.jpg"
                      alt="Nouveau Diagnostic"
                      className="w-full h-full object-cover blur-sm transition-all duration-300"
                      style={{ 
                        filter: isDark ? 'brightness(0.7) contrast(1.2) blur(4px)' : 'blur(4px)' 
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-sage-500/80 to-sage-700/80 flex items-center justify-center" style={{ display: 'none' }}>
                      <div className="text-center text-white">
                        <Plus className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold uppercase mb-2">Nouveau Diagnostic</h3>
                        <p className="text-lg">Choisir le type de diagnostic</p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-sage-500/20 to-sage-700/20 opacity-0"
                    whileTap={{ opacity: 0.8 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Logo + au centre */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <motion.div 
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40"
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      >
                        <Plus className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Texte centré */}
                  <div className="absolute bottom-12 left-0 right-0 z-10">
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold text-white transition-colors uppercase mb-2">
                        Nouveau Diagnostic
                      </h3>
                      <p className="text-white/90 text-lg">Choisir le type de soin</p>
                    </div>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="options"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <motion.button
                    onClick={() => handleDiagnosticSelect('headspa')}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05, type: "spring", stiffness: 100 }}
                    className="w-full h-32 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 backdrop-blur-xl border-2 border-sage-300 shadow-2xl shadow-cyan-200/20 active:shadow-cyan-300/30 transition-all duration-300 text-left group relative overflow-hidden flex"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0"
                      whileTap={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="w-[25%] h-full relative overflow-hidden"
                      whileTap={{ scale: 1.05 }}
                    >
                      <img
                        src="/headspa.jpg"
                        alt="Head Spa"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{ 
                          filter: isDark ? 'brightness(0.8) contrast(1.1)' : 'none' 
                        }}
                      />
                    </motion.div>
                    <div className="flex-1 px-6 flex items-center relative z-10">
                        <div>
                          <h3 className="hero-title-diagnostic">
                            Head Spa
                          </h3>
                          <p className="text-dark-light">Diagnostic capillaire et relaxation</p>
                        </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleDiagnosticSelect('skincare')}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                    className="w-full h-32 bg-gradient-to-br from-green-50/30 to-emerald-50/30 backdrop-blur-xl border-2 border-sage-300 shadow-2xl shadow-green-200/20 active:shadow-green-300/30 transition-all duration-300 text-left group relative overflow-hidden flex"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0"
                      whileTap={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="w-[25%] h-full relative overflow-hidden"
                      whileTap={{ scale: 1.05 }}
                    >
                      <img
                        src="/skincare.jpg"
                        alt="Skincare"
                        className="w-full h-full object-cover object-center scale-110 transition-all duration-300"
                        style={{ 
                          filter: isDark ? 'brightness(0.8) contrast(1.1)' : 'none' 
                        }}
                      />
                    </motion.div>
                    <div className="flex-1 px-6 flex items-center relative z-10">
                        <div>
                          <h3 className="hero-title-diagnostic">
                            Skincare Coréen
                          </h3>
                          <p className="text-dark-light">Diagnostic de peau et soins visage</p>
                        </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleDiagnosticSelect('massage')}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
                    className="w-full h-32 bg-gradient-to-br from-orange-50/30 to-amber-50/30 backdrop-blur-xl border-2 border-sage-300 shadow-2xl shadow-orange-200/20 active:shadow-orange-300/30 transition-all duration-300 text-left group relative overflow-hidden flex"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 opacity-0"
                      whileTap={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="w-[25%] h-full relative overflow-hidden"
                      whileTap={{ scale: 1.05 }}
                    >
                      <img
                        src="/massage.jpg"
                        alt="Massage"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{ 
                          filter: isDark ? 'brightness(0.8) contrast(1.1)' : 'none' 
                        }}
                      />
                    </motion.div>
                    <div className="flex-1 px-6 flex items-center relative z-10">
                        <div>
                          <h3 className="hero-title-diagnostic">
                            Massage
                          </h3>
                          <p className="text-dark-light">Diagnostic bien-être corporel</p>
                        </div>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {selectedPractitioner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-3 mb-4 relative"
            data-profile-menu
          >
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-md active:shadow-lg transition-all duration-200 touch-manipulation relative overflow-hidden card"
                whileTap={{ scale: 0.97 }}
              >
              <motion.div
                className="absolute inset-0 bg-sage-50 opacity-0"
                whileTap={{ opacity: 0.5 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div 
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-white relative z-10"
                whileTap={{ scale: 0.9, rotate: -10 }}
              >
                <img
                  src={selectedPractitioner.avatar}
                  alt={`Avatar de ${selectedPractitioner.name}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
                <span className="text-lg text-primary font-medium relative z-10">
                  {selectedPractitioner.name}
                </span>
              <motion.div 
                className="w-2 h-2 bg-sage-500 rounded-full shadow-lg shadow-sage-500/50 relative z-10"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                animate={{ rotate: showProfileMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <ChevronDown className="w-5 h-5 sage-primary" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute bottom-full mb-2 rounded-2xl shadow-xl py-2 min-w-[200px] z-50 card"
                >
                  {practitioners
                    .filter(practitioner => practitioner.id !== selectedPractitioner.id)
                    .map((practitioner, index) => (
                      <motion.button
                        key={practitioner.id}
                        onClick={() => handleProfileChange(practitioner.id)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover-sage transition-colors relative overflow-hidden"
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0"
                          style={{ backgroundColor: 'var(--hover-bg)' }}
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
                          <p className="text-sm text-secondary">{practitioner.role}</p>
                        </div>
                      </motion.button>
                    ))}
                  
                    <div className="border-t my-2" style={{ borderColor: 'var(--border-secondary)' }}></div>
                  
                  {/* Toggle Dark Mode */}
                    <motion.button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover-sage transition-colors text-secondary"
                      whileTap={{ scale: 0.98 }}
                    >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span className="font-medium text-sm">
                      {isDark ? 'Mode clair' : 'Mode sombre'}
                    </span>
                  </motion.button>
                  
                    <div className="border-t my-2" style={{ borderColor: 'var(--border-secondary)' }}></div>
                  
                    <motion.button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover-sage transition-colors text-tertiary"
                      whileTap={{ scale: 0.98 }}
                    >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Accueil</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}