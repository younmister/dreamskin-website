import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Scissors, 
  AlertTriangle, 
  CheckCircle,
  Droplets,
  Wind,
  Thermometer,
  Target,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import type { ClientProfileSummary, SkincareProfile, MassageProfile, HeadSpaProfile } from '../utils/clientProfileGenerator';
import { formatProfileValue, hasRelevantInfo } from '../utils/clientProfileGenerator';

interface ClientProfileSummaryProps {
  profile: ClientProfileSummary;
}

export function ClientProfileSummary({ profile }: ClientProfileSummaryProps) {
  const [expandedProfiles, setExpandedProfiles] = useState<{
    skincare: boolean;
    massage: boolean;
    headspa: boolean;
  }>({
    skincare: false,
    massage: false,
    headspa: false,
  });

  const toggleProfile = (profileType: 'skincare' | 'massage' | 'headspa') => {
    setExpandedProfiles(prev => ({
      ...prev,
      [profileType]: !prev[profileType]
    }));
  };

  return (
    <div className="space-y-3">
      {profile.skincare && (
        <SkincareProfileCard 
          profile={profile.skincare} 
          isExpanded={expandedProfiles.skincare}
          onToggle={() => toggleProfile('skincare')}
        />
      )}
      {profile.massage && (
        <MassageProfileCard 
          profile={profile.massage} 
          isExpanded={expandedProfiles.massage}
          onToggle={() => toggleProfile('massage')}
        />
      )}
      {profile.headspa && (
        <HeadSpaProfileCard 
          profile={profile.headspa} 
          isExpanded={expandedProfiles.headspa}
          onToggle={() => toggleProfile('headspa')}
        />
      )}
    </div>
  );
}

function SkincareProfileCard({ 
  profile, 
  isExpanded, 
  onToggle 
}: { 
  profile: SkincareProfile; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-sage-50 rounded-xl transition-colors touch-manipulation"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-pink-700" />
          </div>
          <div className="text-left">
            <h3 className="hero-title-diagnostic">Profil Skincare</h3>
            <p className="text-base text-dark-light">Informations de soin de la peau</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-dark-light" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Type de peau */}
                <ProfileItem
                  icon={<Droplets className="w-5 h-5" />}
                  label="Type de peau"
                  value={profile.skinType}
                />

                {/* Problèmes cutanés */}
                {hasRelevantInfo(profile.currentIssues) && (
                  <ProfileItem
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Problèmes cutanés"
                    value={formatProfileValue(profile.currentIssues)}
                  />
                )}

                {/* Conditions dermatologiques */}
                {hasRelevantInfo(profile.dermatologicalConditions) && (
                  <ProfileItem
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Conditions dermatologiques"
                    value={formatProfileValue(profile.dermatologicalConditions)}
                  />
                )}

                {/* Allergies */}
                {hasRelevantInfo(profile.allergies) && (
                  <ProfileItem
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Allergies"
                    value={formatProfileValue(profile.allergies)}
                  />
                )}

                {/* Actifs actuels */}
                {hasRelevantInfo(profile.currentActives) && (
                  <ProfileItem
                    icon={<CheckCircle className="w-5 h-5" />}
                    label="Actifs actuels"
                    value={formatProfileValue(profile.currentActives)}
                  />
                )}

                {/* Traitements récents */}
                {hasRelevantInfo(profile.recentTreatments) && (
                  <ProfileItem
                    icon={<Calendar className="w-5 h-5" />}
                    label="Traitements esthétiques antérieurs"
                    value={formatProfileValue(profile.recentTreatments)}
                  />
                )}

                {/* Objectifs principaux */}
                {hasRelevantInfo(profile.primaryGoals) && (
                  <ProfileItem
                    icon={<Target className="w-5 h-5" />}
                    label="Objectifs principaux"
                    value={formatProfileValue(profile.primaryGoals)}
                  />
                )}

                {/* Préférences de traitement */}
                <ProfileItem
                  icon={<Wind className="w-5 h-5" />}
                  label="Pression d'extraction"
                  value={profile.extractionPressure}
                />

                <ProfileItem
                  icon={<Thermometer className="w-5 h-5" />}
                  label="Température de l'eau"
                  value={profile.waterTemperature}
                />

                {/* Dernier soin */}
                <ProfileItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Dernier soin du visage"
                  value={profile.lastFacial}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MassageProfileCard({ 
  profile, 
  isExpanded, 
  onToggle 
}: { 
  profile: MassageProfile; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-sage-50 rounded-xl transition-colors touch-manipulation"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-blue-700" />
          </div>
          <div className="text-left">
            <h3 className="hero-title-diagnostic">Profil Massage</h3>
            <p className="text-base text-dark-light">Préférences et contre-indications</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-dark-light" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contre-indications */}
                {(profile.backProblems || profile.cardiovascular || profile.recentSurgery || 
                  profile.pregnancy || profile.medication || profile.allergies) && (
                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-lg text-sage-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Contre-indications
                    </h4>
                    <div className="space-y-3">
                      {profile.backProblems && (
                        <div className="text-base text-dark-light">
                          <span className="font-medium">Problèmes de dos:</span> {profile.backProblemsDetails || 'Présents'}
                        </div>
                      )}
                      {profile.cardiovascular && (
                        <div className="text-base text-dark-light">
                          <span className="font-medium">Problèmes cardiovasculaires:</span> {profile.cardiovascularDetails || 'Présents'}
                        </div>
                      )}
                      {profile.recentSurgery && (
                        <div className="text-base text-dark-light">
                          <span className="font-medium">Chirurgie récente:</span> {profile.surgeryDetails || 'Présente'}
                        </div>
                      )}
                      {profile.pregnancy && (
                        <div className="text-base text-dark-light">
                          <span className="font-medium">Grossesse:</span> {profile.pregnancyDetails || 'En cours'}
                        </div>
                      )}
                      {profile.medication && (
                        <div className="text-base text-dark-light">
                          <span className="font-medium">Médicaments:</span> {profile.medicationDetails || 'Présents'}
                        </div>
                      )}
                      {profile.allergies && (
                        <div className="text-base text-dark-light">
                          <span className="font-medium">Allergies:</span> {profile.allergiesDetails || 'Présentes'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Zones à traiter */}
                {hasRelevantInfo(profile.zonesToFocus) && (
                  <ProfileItem
                    icon={<Target className="w-5 h-5" />}
                    label="Zones à traiter"
                    value={formatProfileValue(profile.zonesToFocus)}
                  />
                )}

                {/* Zones à éviter */}
                {hasRelevantInfo(profile.zonesToAvoid) && (
                  <ProfileItem
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Zones à éviter"
                    value={formatProfileValue(profile.zonesToAvoid)}
                  />
                )}

                {/* Préférences */}
                <ProfileItem
                  icon={<Wind className="w-5 h-5" />}
                  label="Pression préférée"
                  value={profile.preferredPressure}
                />

                <ProfileItem
                  icon={<Target className="w-5 h-5" />}
                  label="Objectif"
                  value={profile.objective}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HeadSpaProfileCard({ 
  profile, 
  isExpanded, 
  onToggle 
}: { 
  profile: HeadSpaProfile; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-sage-50 rounded-xl transition-colors touch-manipulation"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center flex-shrink-0">
            <Scissors className="w-6 h-6 text-purple-700" />
          </div>
          <div className="text-left">
            <h3 className="hero-title-diagnostic">Profil Head Spa</h3>
            <p className="text-base text-dark-light">Préférences capillaire et bien-être</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-dark-light" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conditions de santé */}
                {hasRelevantInfo(profile.healthConditions) && (
                  <ProfileItem
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Conditions de santé"
                    value={formatProfileValue(profile.healthConditions)}
                  />
                )}

                {/* Type de cheveux */}
                <ProfileItem
                  icon={<Droplets className="w-5 h-5" />}
                  label="Type de cheveux"
                  value={profile.hairType}
                />

                {/* Type de peau du visage */}
                <ProfileItem
                  icon={<Sparkles className="w-5 h-5" />}
                  label="Type de peau du visage"
                  value={profile.faceSkinType}
                />

                {/* Dernier shampoing */}
                <ProfileItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Dernier shampoing"
                  value={profile.lastShampoo}
                />

                {/* Préférences de massage */}
                <ProfileItem
                  icon={<Heart className="w-5 h-5" />}
                  label="Préférence de massage"
                  value={profile.massagePreference}
                />

                {/* Pression préférée */}
                <ProfileItem
                  icon={<Wind className="w-5 h-5" />}
                  label="Pression préférée"
                  value={profile.pressurePreference}
                />

                {/* Température de l'eau */}
                <ProfileItem
                  icon={<Thermometer className="w-5 h-5" />}
                  label="Température de l'eau"
                  value={profile.waterTemperature}
                />

                {/* Expérience précédente */}
                <ProfileItem
                  icon={<CheckCircle className="w-5 h-5" />}
                  label="Expérience Head Spa"
                  value={profile.hadHeadspaBefore ? 'Oui' : 'Non'}
                />

                {/* Effets positifs */}
                {profile.positiveEffects && (
                  <ProfileItem
                    icon={<CheckCircle className="w-5 h-5" />}
                    label="Effets positifs précédents"
                    value={profile.positiveEffects}
                  />
                )}

                {/* Effets négatifs */}
                {profile.negativeEffects && (
                  <ProfileItem
                    icon={<AlertTriangle className="w-5 h-5" />}
                    label="Effets négatifs précédents"
                    value={profile.negativeEffects}
                  />
                )}

                {/* Sons apaisants */}
                {hasRelevantInfo(profile.calmingSounds) && (
                  <ProfileItem
                    icon={<Wind className="w-5 h-5" />}
                    label="Sons apaisants préférés"
                    value={formatProfileValue(profile.calmingSounds)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProfileItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-base font-medium text-sage-700">
        {icon}
        {label}
      </div>
      <div className="text-dark-light text-base pl-8 leading-relaxed">
        {value}
      </div>
    </div>
  );
}