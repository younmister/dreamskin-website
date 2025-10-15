import type { Diagnostic, DiagnosticType, SkincareAnswers, MassageAnswers, HeadSpaAnswers } from '../types';

// Dictionnaire de traduction pour les valeurs des réponses
const valueTranslations: Record<string, string> = {
  // Types de peau
  'dry': 'Sèche',
  'oily': 'Grasse',
  'combination': 'Mixte',
  'normal': 'Normale',
  'sensitive': 'Sensible',
  
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
  
  // Pression d'extraction
  'light': 'Légère',
  'medium': 'Moyenne',
  'firm': 'Ferme',
  
  // Zones de massage
  'shoulders': 'Épaules',
  'back': 'Dos',
  'neck': 'Cou',
  'arms': 'Bras',
  'legs': 'Jambes',
  'feet': 'Pieds',
  'hands': 'Mains',
  
  // Pression de massage
  'soft': 'Doux',
  'moderate': 'Modéré',
  'firm': 'Ferme',
  'deep': 'Profond',
  
  // Objectifs de massage
  'relaxation': 'Relaxation',
  'therapeutic': 'Thérapeutique',
  'sport': 'Sport',
  'prenatal': 'Prénatal',
  
  // Types de cheveux
  'straight': 'Raides',
  'wavy': 'Ondulés',
  'curly': 'Bouclés',
  'coily': 'Crépus',
  
  // Préférences de massage
  'scalp': 'Cuir chevelu',
  'face': 'Visage',
  'neck': 'Cou',
  'shoulders': 'Épaules',
  
  // Sons apaisants
  'nature': 'Nature',
  'rain': 'Pluie',
  'ocean': 'Océan',
  'music': 'Musique',
  'silence': 'Silence',
  
  // Conditions de santé
  'pregnant': 'Enceinte',
  'breastfeeding': 'Allaitement',
  'scalp-conditions': 'Affections cutanées du cuir chevelu',
  'allergies': 'Allergies',
  
  // Dernier soin
  'last-week': 'La semaine dernière',
  'last-month': 'Le mois dernier',
  'months-ago': 'Il y a plusieurs mois',
  'never': 'Jamais',
  
  // Effets
  'relaxed': 'Détendu(e)',
  'refreshed': 'Rafraîchi(e)',
  'tension-relief': 'Soulagement des tensions',
  'better-sleep': 'Meilleur sommeil',
  'none': 'Aucun',
  'headache': 'Mal de tête',
  'dizziness': 'Vertiges',
  'discomfort': 'Inconfort'
};

// Fonction pour traduire une valeur
const translateValue = (value: string | string[] | boolean | undefined): string | string[] | boolean => {
  if (value === undefined || value === null) return value;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    return value.map(v => valueTranslations[v] || v);
  }
  if (typeof value === 'string') {
    return valueTranslations[value] || value;
  }
  return value;
};

export interface ClientProfileSummary {
  skincare: SkincareProfile | null;
  massage: MassageProfile | null;
  headspa: HeadSpaProfile | null;
}

export interface SkincareProfile {
  skinType: string;
  currentIssues: string[];
  dermatologicalConditions: string[];
  allergies: string[];
  currentActives: string[];
  recentTreatments: string[];
  primaryGoals: string[];
  extractionPressure: string;
  waterTemperature: string;
  lastFacial: string;
}

export interface MassageProfile {
  backProblems: boolean;
  backProblemsDetails?: string;
  cardiovascular: boolean;
  cardiovascularDetails?: string;
  recentSurgery: boolean;
  surgeryDetails?: string;
  pregnancy: boolean;
  pregnancyDetails?: string;
  medication: boolean;
  medicationDetails?: string;
  allergies: boolean;
  allergiesDetails?: string;
  zonesToFocus: string[];
  zonesToAvoid: string[];
  preferredPressure: string;
  objective: string;
}

export interface HeadSpaProfile {
  healthConditions: string[];
  hairType: string;
  lastShampoo: string;
  massagePreference: string;
  pressurePreference: string;
  waterTemperature: string;
  hadHeadspaBefore: boolean;
  positiveEffects?: string;
  negativeEffects?: string;
  faceSkinType: string;
  calmingSounds: string[];
}

export const generateClientProfile = (diagnostics: Diagnostic[]): ClientProfileSummary => {
  const skincareDiagnostics = diagnostics.filter(d => d.diagnostic_type === 'skincare');
  const massageDiagnostics = diagnostics.filter(d => d.diagnostic_type === 'massage');
  const headspaDiagnostics = diagnostics.filter(d => d.diagnostic_type === 'headspa');

  return {
    skincare: skincareDiagnostics.length > 0 ? generateSkincareProfile(skincareDiagnostics) : null,
    massage: massageDiagnostics.length > 0 ? generateMassageProfile(massageDiagnostics) : null,
    headspa: headspaDiagnostics.length > 0 ? generateHeadSpaProfile(headspaDiagnostics) : null,
  };
};

const generateSkincareProfile = (diagnostics: Diagnostic[]): SkincareProfile => {
  // Prendre le diagnostic le plus récent
  const latest = diagnostics.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  
  const answers = latest.answers as SkincareAnswers;
  
  return {
    skinType: translateValue(answers.skin_type) as string || 'Non spécifié',
    currentIssues: translateValue(answers.current_issues) as string[] || [],
    dermatologicalConditions: answers.dermatological_conditions && answers.dermatological_conditions !== 'none' 
      ? [translateValue(answers.dermatological_conditions) as string] 
      : [],
    allergies: translateValue(answers.known_allergies) as string[] || [],
    currentActives: translateValue(answers.current_actives) as string[] || [],
    recentTreatments: translateValue(answers.recent_treatments) as string[] || [],
    primaryGoals: translateValue(answers.primary_goals) as string[] || [],
    extractionPressure: translateValue(answers.extraction_pressure) as string || 'Non spécifié',
    waterTemperature: translateValue(answers.water_temperature) as string || 'Non spécifié',
    lastFacial: translateValue(answers.last_facial) as string || 'Non spécifié',
  };
};

const generateMassageProfile = (diagnostics: Diagnostic[]): MassageProfile => {
  const latest = diagnostics.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  
  const answers = latest.answers as MassageAnswers;
  
  return {
    backProblems: answers.has_back_problems || false,
    backProblemsDetails: answers.back_problems_details,
    cardiovascular: answers.has_cardiovascular || false,
    cardiovascularDetails: answers.cardiovascular_details,
    recentSurgery: answers.has_recent_surgery || false,
    surgeryDetails: answers.surgery_details,
    pregnancy: answers.is_pregnant || false,
    pregnancyDetails: answers.pregnancy_details,
    medication: answers.has_medication || false,
    medicationDetails: answers.medication_details,
    allergies: answers.has_allergies || false,
    allergiesDetails: answers.allergies_details,
    zonesToFocus: translateValue(answers.zones_to_focus) as string[] || [],
    zonesToAvoid: translateValue(answers.zones_to_avoid) as string[] || [],
    preferredPressure: translateValue(answers.preferred_pressure) as string || 'Non spécifié',
    objective: translateValue(answers.objective) as string || 'Non spécifié',
  };
};

const generateHeadSpaProfile = (diagnostics: Diagnostic[]): HeadSpaProfile => {
  const latest = diagnostics.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  
  const answers = latest.answers as HeadSpaAnswers;
  
  return {
    healthConditions: translateValue(answers.health_conditions) as string[] || [],
    hairType: translateValue(answers.hair_type) as string || 'Non spécifié',
    lastShampoo: translateValue(answers.last_shampoo) as string || 'Non spécifié',
    massagePreference: translateValue(answers.massage_preference) as string || 'Non spécifié',
    pressurePreference: translateValue(answers.pressure_preference) as string || 'Non spécifié',
    waterTemperature: translateValue(answers.water_temperature) as string || 'Non spécifié',
    hadHeadspaBefore: answers.had_headspa_before || false,
    positiveEffects: translateValue(answers.positive_effects) as string,
    negativeEffects: translateValue(answers.negative_effects) as string,
    faceSkinType: translateValue(answers.face_skin_type) as string || 'Non spécifié',
    calmingSounds: translateValue(answers.calming_sounds) as string[] || [],
  };
};

export const formatProfileValue = (value: string | string[] | boolean | undefined, fallback: string = 'Non spécifié'): string => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (Array.isArray(value)) {
    const translatedValues = translateValue(value) as string[];
    return translatedValues.length > 0 ? translatedValues.join(', ') : fallback;
  }
  if (typeof value === 'string') {
    const translatedValue = translateValue(value) as string;
    return translatedValue.trim() || fallback;
  }
  return String(value);
};

export const hasRelevantInfo = (value: string | string[] | boolean | undefined): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
};
