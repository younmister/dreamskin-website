import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, Heart, Scissors } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Practitioner {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
}

const practitioners: Practitioner[] = [
  {
    id: 'sofia',
    name: 'Sofia',
    role: 'Praticienne',
    avatar: '/Praticienne1.jpg',
    color: 'from-pink-400 to-rose-500',
    description: 'Spécialisée en soins du visage et massages relaxants'
  },
  {
    id: 'islam',
    name: 'Islam',
    role: 'Praticienne',
    avatar: '/Praticienne2.png',
    color: 'from-blue-400 to-indigo-500',
    description: 'Expert en traitements capillaires et thérapies corporelles'
  }
];

export function ProfileSelection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedPractitioner, setSelectedPractitioner] = useState<string | null>(null);

  const handlePractitionerSelect = (practitionerId: string) => {
    setSelectedPractitioner(practitionerId);
    
    // Animation de sélection puis navigation
    setTimeout(() => {
      // Stocker le praticien sélectionné dans le localStorage
      localStorage.setItem('selectedPractitioner', practitionerId);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-8">
            <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/Logo3.png"
                alt="Dream Skin Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-semibold mb-4 text-primary"
          >
            Bienvenue
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl max-w-2xl mx-auto leading-relaxed text-secondary"
          >
            Choisissez votre profil pour accéder à l'application de diagnostic
          </motion.p>
        </motion.div>

        {/* Practitioners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {practitioners.map((practitioner, index) => (
            <motion.div
              key={practitioner.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.2, duration: 0.6 }}
              className={`relative group cursor-pointer ${
                selectedPractitioner === practitioner.id ? 'scale-95' : ''
              }`}
              onClick={() => handlePractitionerSelect(practitioner.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Card */}
              <div 
                className="rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-sage-200 group-hover:opacity-90"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-secondary)'
                }}
              >
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={practitioner.avatar}
                      alt={`Avatar de ${practitioner.name}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Name and Role */}
                <div className="text-center mb-4">
                  <h3 className="text-3xl font-bold mb-2 text-primary">
                    {practitioner.name}
                  </h3>
                  <p className="text-lg font-medium text-secondary">
                    {practitioner.role}
                  </p>
                </div>

                {/* Description */}
                <p className="text-center text-lg leading-relaxed mb-6 text-secondary">
                  {practitioner.description}
                </p>

                {/* Specialization Icons */}
                <div className="flex justify-center gap-4">
                  {practitioner.id === 'sofia' ? (
                    <>
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-pink-500" />
                      </div>
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-rose-500" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Scissors className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-indigo-500" />
                      </div>
                    </>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedPractitioner === practitioner.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-sage-500 bg-opacity-20 rounded-3xl flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-sage-500 text-lg">
            Sélectionnez votre profil pour commencer
          </p>
        </motion.div>
      </div>
    </div>
  );
}
