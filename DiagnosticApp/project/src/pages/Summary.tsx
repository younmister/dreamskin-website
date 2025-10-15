import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { 
  Save, 
  FileText, 
  Mail, 
  Trash2, 
  Check, 
  User, 
  Phone, 
  Calendar,
  ArrowLeft,
  Edit3,
  Sparkles,
  Heart,
  Scissors
} from 'lucide-react';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { useDiagnostics } from '../hooks/useDiagnostics';
import { useTheme } from '../hooks/useTheme';

export function Summary() {
  const navigate = useNavigate();
  const { currentType, currentClient, currentAnswers, signatureData, currentPractitioner, setSignature, reset } =
    useDiagnosticStore();
  const { createDiagnostic } = useDiagnostics();
  const { isDark } = useTheme();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentType || !currentClient) {
      navigate('/');
    }
  }, [currentType, currentClient, navigate]);

  // Scroll automatique vers le bas de la page au chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pageRef.current) {
        pageRef.current.scrollTo({
          top: pageRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll automatique vers le message de succès quand il s'affiche
  useEffect(() => {
    if (saved && pageRef.current) {
      const timer = setTimeout(() => {
        pageRef.current?.scrollTo({
          top: pageRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [saved]);

  if (!currentType || !currentClient) {
    return null;
  }

  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const data = signatureRef.current.toDataURL();
      setSignature(data);
      
      // Scroll vers le bouton d'enregistrement après signature
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollTo({
            top: pageRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setSignature(null);
  };

  const handlePressStart = (buttonId: string) => {
    setPressedButton(buttonId);
  };

  const handlePressEnd = () => {
    setPressedButton(null);
  };

  const handleSave = async () => {
    if (!signatureData) {
      alert('Veuillez ajouter une signature avant de sauvegarder');
      return;
    }

    console.log('Current practitioner from store:', currentPractitioner);
    console.log('Saving diagnostic with practitioner:', {
      practitioner_id: currentPractitioner?.id,
      practitioner_name: currentPractitioner?.name
    });

    setIsSaving(true);
    try {
      await createDiagnostic({
        client_id: currentClient.id,
        diagnostic_type: currentType,
        answers: currentAnswers,
        signature_data: signatureData,
        practitioner_id: currentPractitioner?.id,
        practitioner_name: currentPractitioner?.name,
      });
      setSaved(true);
      setTimeout(() => {
        reset();
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving diagnostic:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const getDiagnosticInfo = () => {
    switch (currentType) {
      case 'massage':
        return {
          title: 'Massage',
          icon: <Heart className="w-8 h-8 text-blue-600" />,
          color: 'from-blue-100 to-blue-200',
          textColor: 'text-blue-900'
        };
      case 'skincare':
        return {
          title: 'Skincare Coréen',
          icon: <Sparkles className="w-8 h-8 text-pink-600" />,
          color: 'from-pink-100 to-pink-200',
          textColor: 'text-pink-900'
        };
      case 'headspa':
        return {
          title: 'Head Spa',
          icon: <Scissors className="w-8 h-8 text-purple-600" />,
          color: 'from-purple-100 to-purple-200',
          textColor: 'text-purple-900'
        };
      default:
        return {
          title: 'Diagnostic',
          icon: <FileText className="w-8 h-8 text-sage-600" />,
          color: 'from-sage-100 to-sage-200',
          textColor: 'text-sage-900'
        };
    }
  };

  const translateAnswerValue = (value: any): string => {
    // Dictionnaire de traduction des valeurs de réponses
    const valueTranslations: { [key: string]: string } = {
      // Zones du corps
      'back': 'Dos',
      'neck': 'Nuque',
      'shoulders': 'Épaules',
      'legs': 'Jambes',
      'feet': 'Pieds',
      'hands': 'Mains',
      'other': 'Autre',
      
      // Pression
      'soft': 'Douce',
      'moderate': 'Modérée',
      'firm': 'Ferme',
      
      // Objectifs
      'relaxation': 'Détente',
      'recovery': 'Récupération',
      'anti-stress': 'Anti-stress',
      
      // Types de peau
      'dry': 'Sèche',
      'oily': 'Grasse',
      'normal': 'Normale',
      'combination': 'Mixte',
      
      // Problèmes cutanés
      'acne': 'Acné',
      'blackheads': 'Points noirs',
      'spots': 'Taches',
      'wrinkles': 'Rides',
      'dehydration': 'Déshydratation',
      'redness': 'Rougeurs',
      'sensitivity': 'Sensibilité',
      
      // Pathologies dermatologiques
      'eczema': 'Eczéma',
      'psoriasis': 'Psoriasis',
      'rosacea': 'Rosacée',
      'none': 'Aucune',
      
      // Allergies
      'fragrances': 'Parfums',
      'alcohol': 'Alcool',
      'retinol': 'Rétinol',
      'acids': 'Acides',
      'vitamin-c': 'Vitamine C',
      'niacinamide': 'Niacinamide',
      'essential-oils': 'Huiles essentielles',
      
      // Actifs cosmétiques
      'peptides': 'Peptides',
      'bakuchiol': 'Bakuchiol',
      
      // Dernière utilisation des actifs
      'yesterday': 'Hier',
      '2-3-days': 'Il y a 2-3 jours',
      'week-plus': 'Il y a plus d\'une semaine',
      'never': 'Jamais',
      
      // Traitements esthétiques
      'peeling': 'Peeling',
      'laser': 'Laser',
      'injections': 'Injections',
      'microneedling': 'Microneedling',
      'led': 'LED',
      
      // Objectifs prioritaires
      'hydration': 'Hydratation',
      'purification': 'Purification',
      'anti-aging': 'Anti-âge',
      'radiance': 'Éclat',
      'repair': 'Réparation',
      
      // Température d'eau
      'cool': 'Fraîche',
      'warm': 'Tiède',
      'hot': 'Chaude',
      
      // Conditions de santé
      'pregnant': 'Enceinte',
      'breastfeeding': 'Allaitement',
      'scalp-conditions': 'Affections cutanées du cuir chevelu',
      'allergies': 'Allergies',
      
      // Types de cheveux
      'hair_dry': 'Sec',
      'hair_oily': 'Gras',
      'hair_combination': 'Mixte',
      'hair_normal': 'Normal',
      
      // Préférences de massage
      'tonic': 'Tonique',
      'relaxing': 'Relaxant',
      
      // Sons apaisants
      'rain': 'Pluie',
      'waves': 'Vagues',
      'thunder': 'Orage',
      'stream': 'Ruisseau',
      'birds': 'Oiseaux',
      'lullaby': 'Berceuse',
      'summer-night': 'Nuit d\'été',
      'wind': 'Vent'
    };

    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    
    if (Array.isArray(value)) {
      return value.map(v => valueTranslations[v] || v).join(', ');
    }
    
    if (typeof value === 'string') {
      return valueTranslations[value] || value;
    }
    
    return String(value);
  };

  const renderAnswerValue = (value: any): string => {
    return translateAnswerValue(value);
  };

  const formatQuestion = (key: string): string => {
    // Dictionnaire de traduction des questions
    const questionTranslations: { [key: string]: string } = {
      // Questions générales
      'age': 'Âge',
      'gender': 'Sexe',
      'skin_type': 'Type de peau',
      'skin_concerns': 'Problèmes cutanés',
      'allergies': 'Allergies',
      'medications': 'Médicaments',
      'pregnancy': 'Grossesse',
      'breastfeeding': 'Allaitement',
      
    // Questions massage
    'has_back_problems': 'Avez-vous des problèmes de dos, articulations ou musculaires ?',
    'back_problems_details': 'Précisez la zone et le type de douleur',
    'has_cardiovascular': 'Souffrez-vous de maladies cardiovasculaires ?',
    'cardiovascular_details': 'Précisez votre condition',
    'has_recent_surgery': 'Avez-vous eu une opération récente ?',
    'surgery_details': 'Quelle opération et quand ?',
    'is_pregnant': 'Êtes-vous enceinte ?',
    'pregnancy_details': 'À quel mois de grossesse êtes-vous ?',
    'has_medication': 'Prenez-vous un traitement médical ?',
    'medication_details': 'Quel traitement ?',
    'has_allergies': 'Avez-vous des allergies cutanées ou respiratoires ?',
    'allergies_details': 'À quoi êtes-vous allergique ?',
    'zones_to_focus': 'Zones à privilégier',
    'zones_to_avoid': 'Zones à éviter',
    'preferred_pressure': 'Pression préférée',
    'objective': 'Objectif recherché',
    'massage_experience': 'Expérience en massage',
    'contraindications': 'Contre-indications',
    'pain_level': 'Niveau de douleur',
    'stress_level': 'Niveau de stress',
    'sleep_quality': 'Qualité du sommeil',
    'physical_activity': 'Activité physique',
    'work_position': 'Position de travail',
    'previous_injuries': 'Blessures antérieures',
    'chronic_conditions': 'Affections chroniques',
    'massage_goals': 'Objectifs du massage',
    'preferred_techniques': 'Techniques préférées',
    'sensitivity_level': 'Niveau de sensibilité',
    'oil_preferences': 'Préférences d\'huiles',
    'temperature_preference': 'Préférence de température',
    'music_preference': 'Préférence musicale',
    'lighting_preference': 'Préférence d\'éclairage',
    'session_duration': 'Durée de séance souhaitée',
      
    // Questions skincare
    'skincare_skin_type': 'Quel est ton type de peau ?',
    'current_issues': 'Quels problèmes cutanés rencontres-tu actuellement ?',
    'dermatological_conditions': 'As-tu des pathologies dermatologiques ?',
    'known_allergies': 'As-tu des allergies connues ?',
    'current_actives': 'Quels actifs cosmétiques utilises-tu actuellement ?',
    'last_active_use': 'Quand as-tu utilisé des actifs pour la dernière fois ?',
    'recent_treatments': 'As-tu eu des traitements esthétiques récents ?',
    'primary_goals': 'Quels sont tes objectifs prioritaires ?',
    'extraction_pressure': 'Pour les extractions, quelle pression préfères-tu ?',
    'skincare_water_temperature': 'Quelle température d\'eau préfères-tu ?',
    'last_facial': 'À quand remonte ton dernier soin du visage ?',
    'current_skincare_routine': 'Routine de soins actuelle',
    'skin_sensitivity': 'Sensibilité cutanée',
    'sun_exposure': 'Exposition au soleil',
    'previous_treatments': 'Traitements esthétiques antérieurs',
    'product_allergies': 'Allergies aux produits',
    'skin_goals': 'Objectifs cutanés',
    'budget_range': 'Gamme de budget',
    'time_available': 'Temps disponible',
    'preferred_ingredients': 'Ingrédients préférés',
    'avoided_ingredients': 'Ingrédients à éviter',
    'makeup_usage': 'Utilisation du maquillage',
    'lifestyle_factors': 'Facteurs de mode de vie',
    'hormonal_changes': 'Changements hormonaux',
    'stress_impact': 'Impact du stress',
    'diet_habits': 'Habitudes alimentaires',
    'water_intake': 'Consommation d\'eau',
    'sleep_patterns': 'Rythmes de sommeil',
    'environmental_factors': 'Facteurs environnementaux',
    'travel_frequency': 'Fréquence de voyage',
    'skincare_brand_preferences': 'Préférences de marques',
      
    // Questions head spa
    'health_conditions': 'As-tu des éléments de santé à mentionner ?',
    'health_conditions_details': 'Pouvez-vous préciser ?',
    'hair_type': 'Dirais-tu que tu as le cheveu :',
    'last_shampoo': 'À quand remonte ton dernier shampoing ?',
    'massage_preference': 'Préfères-tu les massages :',
    'pressure_preference': 'Préfères-tu une pression :',
    'headspa_water_temperature': 'Préfères-tu te laver les cheveux à l\'eau :',
    'had_headspa_before': 'As-tu déjà bénéficié d\'un traitement HeadSpa ?',
    'positive_effects': 'Quels effets positifs as-tu observés ?',
    'negative_effects': 'As-tu ressenti des effets indésirables ou inconforts ?',
    'face_skin_type': 'Tu as la peau (du visage) :',
    'calming_sounds': 'Coche les sons qui t\'apaisent :',
    'hair_concerns': 'Problèmes capillaires',
    'scalp_condition': 'État du cuir chevelu',
    'hair_treatments': 'Traitements capillaires antérieurs',
    'hair_goals': 'Objectifs capillaires',
    'styling_frequency': 'Fréquence de coiffage',
    'heat_tool_usage': 'Utilisation d\'outils chauffants',
    'chemical_treatments': 'Traitements chimiques',
    'hair_loss_concerns': 'Préoccupations de perte de cheveux',
    'scalp_sensitivity': 'Sensibilité du cuir chevelu',
    'preferred_hair_products': 'Produits capillaires préférés',
    'budget_for_treatments': 'Budget pour les traitements',
    'time_for_hair_care': 'Temps pour les soins capillaires',
    'lifestyle_impact_hair': 'Impact du mode de vie sur les cheveux',
    'stress_impact_hair': 'Impact du stress sur les cheveux',
    'diet_impact_hair': 'Impact de l\'alimentation sur les cheveux',
    'sleep_impact_hair': 'Impact du sommeil sur les cheveux',
    'environmental_impact_hair': 'Impact environnemental sur les cheveux',
    'hair_color_treatments': 'Traitements de coloration',
    'hair_length_preference': 'Préférence de longueur de cheveux'
    };

    // Si on a une traduction, l'utiliser
    if (questionTranslations[key]) {
      return questionTranslations[key];
    }

    // Sinon, formater la clé en français
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\b(De|Du|Des|La|Le|Les|Un|Une|A|An|Au|Aux|En|Dans|Sur|Pour|Avec|Sans|Par|Chez|Vers|Devant|Derriere|Sous|Sur|Entre|Parmi|Pendant|Depuis|Jusqu|Avant|Apres|Pendant|Lors|Quand|Si|Que|Qui|Dont|O|Comment|Pourquoi|Combien|Quel|Quelle|Quels|Quelles)\b/g, l => l.toLowerCase())
      .replace(/^./, l => l.toUpperCase());
  };

  const diagnosticInfo = getDiagnosticInfo();

  return (
    <div 
      ref={pageRef}
      className="min-h-screen py-6 overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-dark-light hover:text-sage-900 transition-colors flex items-center gap-3 text-lg touch-manipulation"
          >
            <ArrowLeft className="w-6 h-6" />
            Retour
          </button>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${diagnosticInfo.color} mb-4`}>
              {diagnosticInfo.icon}
            </div>
            <h1 className="font-display text-5xl text-primary mb-3">
              Récapitulatif
            </h1>
            <p className="text-xl text-dark-light">
              {currentClient.first_name} {currentClient.last_name} • {diagnosticInfo.title}
            </p>
          </div>
        </motion.div>

        {/* Client Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center text-sage-900 font-semibold text-2xl">
              {currentClient.first_name[0]}{currentClient.last_name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-primary">
                {currentClient.first_name} {currentClient.last_name}
              </h2>
              <p className="text-lg text-dark-light">Informations client</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-sage-600" />
              <div>
                <p className="text-sm text-dark-light">Email</p>
                <p className="font-medium text-lg">{currentClient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-sage-600" />
              <div>
                <p className="text-sm text-dark-light">Téléphone</p>
                <p className="font-medium text-lg">{currentClient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-sage-600" />
              <div>
                <p className="text-sm text-dark-light">Date de naissance</p>
                <p className="font-medium text-lg">
                  {new Date(currentClient.date_of_birth).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-sage-600" />
              <div>
                <p className="text-sm text-dark-light">Client depuis</p>
                <p className="font-medium text-lg">
                  {new Date(currentClient.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Information du praticien */}
          {currentPractitioner && (
            <div className="mt-6 pt-6 border-t border-sage-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={currentPractitioner.avatar}
                    alt={`Avatar de ${currentPractitioner.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-dark-light">Diagnostic réalisé par</p>
                  <p className="font-medium text-lg text-primary">
                    {currentPractitioner.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Diagnostic Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Réponses du diagnostic
          </h2>
          
          <div className="space-y-6">
            {Object.entries(currentAnswers).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="border-l-4 border-sage-200 pl-6 py-2"
              >
                <h3 className="font-medium text-primary mb-2 text-lg">
                  {formatQuestion(key)}
                </h3>
                <p className="text-dark-light text-lg leading-relaxed">
                  {renderAnswerValue(value)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Signature Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-3">
            <Edit3 className="w-6 h-6" />
            Signature du client
          </h2>

          {!signatureData ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-sage-300 rounded-2xl overflow-hidden bg-white shadow-sm">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-64 touch-manipulation',
                    style: { touchAction: 'none' }
                  }}
                  onEnd={handleSaveSignature}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-dark-light">
                  Signez dans la zone ci-dessus pour valider le diagnostic
                </p>
                <button
                  onClick={handleClearSignature}
                  className="text-sage-600 hover:text-sage-800 transition-colors flex items-center gap-2 text-lg touch-manipulation"
                >
                  <Trash2 className="w-5 h-5" />
                  Effacer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={signatureData}
                  alt="Signature"
                  className="w-full h-64 object-contain border-2 border-sage-200 rounded-2xl bg-white shadow-sm"
                />
                <motion.button
                  onClick={() => setSignature(null)}
                  className={`absolute top-4 right-4 btn-secondary text-lg py-2 px-4 touch-manipulation transition-all duration-200 ${
                    pressedButton === 'modify' ? 'scale-95' : ''
                  }`}
                  onTouchStart={() => handlePressStart('modify')}
                  onTouchEnd={handlePressEnd}
                  onMouseDown={() => handlePressStart('modify')}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressEnd}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Modifier
                </motion.button>
              </div>
              <div className="text-center">
                <p className="text-lg text-sage-700 font-medium">
                  ✓ Signature validée
                </p>
                <p className="text-sm text-dark-light mt-1">
                  Je certifie l'exactitude des informations fournies
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        {saved ? (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="card bg-gradient-to-r from-sage-600 to-sage-700 text-white text-center py-16 mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Check className="w-12 h-12" />
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-semibold mb-4"
            >
              Diagnostic enregistré !
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xl opacity-90"
            >
              Le diagnostic a été sauvegardé avec succès
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 text-lg opacity-75"
            >
              Redirection en cours...
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <motion.button
              onClick={handleSave}
              disabled={isSaving || !signatureData}
              className={`w-full btn-primary text-2xl py-6 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                pressedButton === 'save' ? 'scale-95' : ''
              }`}
              onTouchStart={() => handlePressStart('save')}
              onTouchEnd={handlePressEnd}
              onMouseDown={() => handlePressStart('save')}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-7 h-7 mr-3 inline" />
              {isSaving ? 'Enregistrement en cours...' : 'Enregistrer le diagnostic'}
            </motion.button>
            
            {!signatureData && (
              <p className="text-center text-lg text-dark-light">
                Veuillez signer pour finaliser l'enregistrement
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}