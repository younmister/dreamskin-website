import type { QuestionConfig } from '../types';

export const massageQuestions: QuestionConfig[] = [
  {
    id: 'has_back_problems',
    type: 'toggle',
    question: 'Avez-vous des problèmes de dos, articulations ou musculaires ?',
  },
  {
    id: 'back_problems_details',
    type: 'textarea',
    question: 'Pouvez-vous préciser la zone et le type de douleur ?',
    placeholder: 'Précisez la zone et le type de douleur...',
    conditional: { dependsOn: 'has_back_problems', value: true },
  },
  {
    id: 'has_cardiovascular',
    type: 'toggle',
    question: 'Souffrez-vous de maladies cardiovasculaires (hypertension, troubles circulatoires, varices) ?',
  },
  {
    id: 'cardiovascular_details',
    type: 'textarea',
    question: 'Pouvez-vous préciser votre condition ?',
    placeholder: 'Précisez votre condition...',
    conditional: { dependsOn: 'has_cardiovascular', value: true },
  },
  {
    id: 'has_recent_surgery',
    type: 'toggle',
    question: 'Avez-vous eu une opération récente ?',
  },
  {
    id: 'surgery_details',
    type: 'textarea',
    question: 'Quelle opération et quand ?',
    placeholder: 'Quelle opération et quand ?',
    conditional: { dependsOn: 'has_recent_surgery', value: true },
  },
  {
    id: 'is_pregnant',
    type: 'toggle',
    question: 'Êtes-vous enceinte ?',
  },
  {
    id: 'pregnancy_details',
    type: 'textarea',
    question: 'À quel mois de grossesse êtes-vous ?',
    placeholder: 'À quel mois de grossesse êtes-vous ?',
    conditional: { dependsOn: 'is_pregnant', value: true },
  },
  {
    id: 'has_medication',
    type: 'toggle',
    question: 'Prenez-vous un traitement médical ?',
  },
  {
    id: 'medication_details',
    type: 'textarea',
    question: 'Quel traitement ?',
    placeholder: 'Quel traitement ?',
    conditional: { dependsOn: 'has_medication', value: true },
  },
  {
    id: 'has_allergies',
    type: 'toggle',
    question: 'Avez-vous des allergies cutanées ou respiratoires (huiles essentielles, produits de massage) ?',
  },
  {
    id: 'allergies_details',
    type: 'textarea',
    question: 'À quoi êtes-vous allergique ?',
    placeholder: 'À quoi êtes-vous allergique ?',
    conditional: { dependsOn: 'has_allergies', value: true },
  },
  {
    id: 'zones_to_focus',
    type: 'chips',
    question: 'Quelles zones souhaitez-vous privilégier ?',
    options: [
      { value: 'back', label: 'Dos' },
      { value: 'neck', label: 'Nuque' },
      { value: 'shoulders', label: 'Épaules' },
      { value: 'legs', label: 'Jambes' },
      { value: 'feet', label: 'Pieds' },
      { value: 'hands', label: 'Mains' },
      { value: 'other', label: 'Autre' },
    ],
    multiple: true,
  },
  {
    id: 'zones_to_avoid',
    type: 'chips',
    question: 'Y a-t-il des zones à éviter ?',
    options: [
      { value: 'back', label: 'Dos' },
      { value: 'neck', label: 'Nuque' },
      { value: 'shoulders', label: 'Épaules' },
      { value: 'legs', label: 'Jambes' },
      { value: 'feet', label: 'Pieds' },
      { value: 'hands', label: 'Mains' },
      { value: 'other', label: 'Autre' },
    ],
    multiple: true,
  },
  {
    id: 'preferred_pressure',
    type: 'cards',
    question: 'Quelle pression préférez-vous ?',
    options: [
      { value: 'soft', label: 'Douces', icon: '🌸' },
      { value: 'moderate', label: 'Modérées', icon: '🌿' },
      { value: 'firm', label: 'Fermes', icon: '💪' },
    ],
  },
  {
    id: 'objective',
    type: 'cards',
    question: 'Quel est votre objectif recherché ?',
    options: [
      { value: 'relaxation', label: 'Détente', icon: '🧘' },
      { value: 'recovery', label: 'Récupération', icon: '🏃' },
      { value: 'anti-stress', label: 'Anti-stress', icon: '😌' },
    ],
  },
];

export const skincareQuestions: QuestionConfig[] = [
  {
    id: 'skin_type',
    type: 'cards',
    question: 'Quel est ton type de peau ?',
    options: [
      { value: 'dry', label: 'Sèche', icon: '💧' },
      { value: 'oily', label: 'Grasse', icon: '✨' },
      { value: 'normal', label: 'Normale', icon: '🌸' },
      { value: 'combination', label: 'Mixte', icon: '⚖️' },
    ],
  },
  {
    id: 'current_issues',
    type: 'chips',
    question: 'Quels problèmes cutanés rencontres-tu actuellement ?',
    options: [
      { value: 'acne', label: 'Acné' },
      { value: 'blackheads', label: 'Points noirs' },
      { value: 'spots', label: 'Taches' },
      { value: 'wrinkles', label: 'Rides' },
      { value: 'dehydration', label: 'Déshydratation' },
      { value: 'redness', label: 'Rougeurs' },
      { value: 'sensitivity', label: 'Sensibilité' },
      { value: 'other', label: 'Autre' },
    ],
    multiple: true,
  },
  {
    id: 'dermatological_conditions',
    type: 'chips',
    question: 'As-tu des pathologies dermatologiques ?',
    options: [
      { value: 'eczema', label: 'Eczéma' },
      { value: 'psoriasis', label: 'Psoriasis' },
      { value: 'rosacea', label: 'Rosacée' },
      { value: 'none', label: 'Aucune' },
      { value: 'other', label: 'Autre' },
    ],
  },
  {
    id: 'known_allergies',
    type: 'chips',
    question: 'As-tu des allergies connues ?',
    options: [
      { value: 'fragrances', label: 'Parfums' },
      { value: 'alcohol', label: 'Alcool' },
      { value: 'retinol', label: 'Rétinol' },
      { value: 'acids', label: 'Acides' },
      { value: 'vitamin-c', label: 'Vitamine C' },
      { value: 'niacinamide', label: 'Niacinamide' },
      { value: 'essential-oils', label: 'Huiles essentielles' },
      { value: 'other', label: 'Autre' },
    ],
    multiple: true,
  },
  {
    id: 'current_actives',
    type: 'chips',
    question: 'Quels actifs cosmétiques utilises-tu actuellement ?',
    options: [
      { value: 'acids', label: 'Acides (AHA/BHA)' },
      { value: 'retinol', label: 'Rétinol' },
      { value: 'vitamin-c', label: 'Vitamine C' },
      { value: 'niacinamide', label: 'Niacinamide' },
      { value: 'peptides', label: 'Peptides' },
      { value: 'bakuchiol', label: 'Bakuchiol' },
      { value: 'none', label: 'Aucun' },
      { value: 'other', label: 'Autre' },
    ],
    multiple: true,
  },
  {
    id: 'last_active_use',
    type: 'cards',
    question: 'Quand as-tu utilisé des actifs pour la dernière fois ?',
    options: [
      { value: 'yesterday', label: 'Hier' },
      { value: '2-3-days', label: 'Il y a 2-3 jours' },
      { value: 'week-plus', label: 'Il y a plus d\'une semaine' },
      { value: 'never', label: 'Jamais' },
    ],
  },
  {
    id: 'recent_treatments',
    type: 'chips',
    question: 'As-tu eu des traitements esthétiques récents (moins de 3 mois) ?',
    options: [
      { value: 'peeling', label: 'Peeling' },
      { value: 'laser', label: 'Laser' },
      { value: 'injections', label: 'Injections' },
      { value: 'microneedling', label: 'Microneedling' },
      { value: 'led', label: 'LED' },
      { value: 'none', label: 'Aucun' },
      { value: 'other', label: 'Autre' },
    ],
    multiple: true,
  },
  {
    id: 'primary_goals',
    type: 'cards',
    question: 'Quels sont tes objectifs prioritaires ? (2 choix maximum)',
    options: [
      { value: 'hydration', label: 'Hydratation', icon: '💧' },
      { value: 'purification', label: 'Purification', icon: '🧼' },
      { value: 'anti-aging', label: 'Anti-âge', icon: '⏳' },
      { value: 'radiance', label: 'Éclat', icon: '✨' },
      { value: 'repair', label: 'Réparation', icon: '🩹' },
    ],
    multiple: true,
    maxSelections: 2,
  },
  {
    id: 'extraction_pressure',
    type: 'cards',
    question: 'Pour les extractions, quelle pression préfères-tu ?',
    options: [
      { value: 'soft', label: 'Douces', icon: '🌸' },
      { value: 'moderate', label: 'Modérées', icon: '🌿' },
      { value: 'firm', label: 'Fermes', icon: '💪' },
    ],
  },
  {
    id: 'water_temperature',
    type: 'cards',
    question: 'Quelle température d\'eau préfères-tu ?',
    options: [
      { value: 'cool', label: 'Fraîche', icon: '❄️' },
      { value: 'warm', label: 'Tiède', icon: '🌡️' },
      { value: 'hot', label: 'Chaude', icon: '🔥' },
    ],
  },
  {
    id: 'last_facial',
    type: 'text',
    question: 'À quand remonte ton dernier soin du visage ?',
    placeholder: 'Ex: Il y a 3 mois',
  },
];

export const headspaQuestions: QuestionConfig[] = [
  {
    id: 'health_conditions',
    type: 'chips',
    question: 'As-tu des éléments de santé à mentionner ?',
    options: [
      { value: 'pregnant', label: 'Enceinte', icon: '🤰' },
      { value: 'breastfeeding', label: 'Allaitement', icon: '🍼' },
      { value: 'scalp-conditions', label: 'Affections cutanées du cuir chevelu', icon: '🩺' },
      { value: 'allergies', label: 'Allergies', icon: '🌸' },
      { value: 'none', label: 'Aucun', icon: '✅' },
    ],
    multiple: true,
  },
  {
    id: 'health_conditions_details',
    type: 'textarea',
    question: 'Pouvez-vous préciser ?',
    placeholder: 'Précisez vos conditions de santé...',
    conditional: { dependsOn: 'health_conditions', value: ['allergies', 'scalp-conditions'] },
  },
  {
    id: 'hair_type',
    type: 'cards',
    question: 'Dirais-tu que tu as le cheveu :',
    options: [
      { value: 'dry', label: 'Sec', icon: '💧' },
      { value: 'oily', label: 'Gras', icon: '✨' },
      { value: 'combination', label: 'Mixte', icon: '⚖️' },
      { value: 'normal', label: 'Normal', icon: '🌸' },
    ],
  },
  {
    id: 'last_shampoo',
    type: 'text',
    question: 'À quand remonte ton dernier shampoing ?',
    placeholder: 'Aujourd\'hui, hier, il y a 2 jours...',
  },
  {
    id: 'massage_preference',
    type: 'cards',
    question: 'Préfères-tu les massages :',
    options: [
      { value: 'tonic', label: 'Tonique', icon: '⚡' },
      { value: 'relaxing', label: 'Relaxant', icon: '🧘' },
    ],
  },
  {
    id: 'pressure_preference',
    type: 'cards',
    question: 'Préfères-tu une pression :',
    options: [
      { value: 'soft', label: 'Douce', icon: '🌸' },
      { value: 'firm', label: 'Forte', icon: '💪' },
    ],
  },
  {
    id: 'water_temperature',
    type: 'cards',
    question: 'Préfères-tu te laver les cheveux à l\'eau :',
    options: [
      { value: 'cool', label: 'Fraîche', icon: '❄️' },
      { value: 'warm', label: 'Tiède', icon: '🌡️' },
      { value: 'hot', label: 'Chaude', icon: '🔥' },
    ],
  },
  {
    id: 'had_headspa_before',
    type: 'toggle',
    question: 'As-tu déjà bénéficié d\'un traitement HeadSpa ?',
  },
  {
    id: 'positive_effects',
    type: 'textarea',
    question: 'Quels effets positifs as-tu observés ?',
    placeholder: 'Décris ce que tu as aimé et les bienfaits ressentis...',
    conditional: { dependsOn: 'had_headspa_before', value: true },
  },
  {
    id: 'negative_effects',
    type: 'textarea',
    question: 'As-tu ressenti des effets indésirables ou inconforts ?',
    placeholder: 'Y a-t-il eu des moments inconfortables ? Des sensations désagréables ?',
    conditional: { dependsOn: 'had_headspa_before', value: true },
  },
  {
    id: 'face_skin_type',
    type: 'cards',
    question: 'Tu as la peau (du visage) :',
    options: [
      { value: 'dry', label: 'Sèche', icon: '💧' },
      { value: 'oily', label: 'Grasse', icon: '✨' },
      { value: 'combination', label: 'Mixte', icon: '⚖️' },
      { value: 'normal', label: 'Normale', icon: '🌸' },
    ],
  },
  {
    id: 'calming_sounds',
    type: 'chips',
    question: 'Coche les sons qui t\'apaisent :',
    options: [
      { value: 'rain', label: 'Pluie', icon: '🌧️' },
      { value: 'waves', label: 'Vagues', icon: '🌊' },
      { value: 'thunder', label: 'Orage', icon: '⛈️' },
      { value: 'stream', label: 'Ruisseau', icon: '💧' },
      { value: 'birds', label: 'Oiseaux', icon: '🐦' },
      { value: 'lullaby', label: 'Berceuse', icon: '🎵' },
      { value: 'summer-night', label: 'Nuit d\'été', icon: '🌙' },
      { value: 'wind', label: 'Vent', icon: '💨' },
    ],
    multiple: true,
  },
];

export const getDiagnosticQuestions = (type: string): QuestionConfig[] => {
  switch (type) {
    case 'massage':
      return massageQuestions;
    case 'skincare':
      return skincareQuestions;
    case 'headspa':
      return headspaQuestions;
    default:
      return [];
  }
};
