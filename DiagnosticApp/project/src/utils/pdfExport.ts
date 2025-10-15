import jsPDF from 'jspdf';
import type { Diagnostic, Client, DiagnosticType } from '../types';

export const exportDiagnosticToPDF = (diagnostic: Diagnostic, client: Client) => {
  // Format A5 (plus petit) au lieu de A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });
  
  // Configuration des couleurs modernes
  const colors = getDiagnosticColors(diagnostic.diagnostic_type);
  const textColor = '#1F2937'; // dark
  const lightTextColor = '#6B7280'; // dark-light
  const borderColor = '#E5E7EB'; // sage-200
  
  // Page 1 - Header avec design moderne
  addModernHeader(doc, diagnostic, client, colors);
  
  // Page 1 - Informations client avec design de carte
  addClientInfoCard(doc, client, colors);
  
  // Page 1 - Réponses du diagnostic avec design moderne
  let yPosition = addDiagnosticAnswers(doc, diagnostic, colors, 80);
  
  // Signature si disponible
  if (diagnostic.signature_data) {
    yPosition = addSignatureSection(doc, diagnostic, colors, yPosition);
  }
  
  // Footer moderne
  addModernFooter(doc, diagnostic);
  
  // Téléchargement
  const fileName = `diagnostic_${client.last_name}_${client.first_name}_${diagnostic.diagnostic_type}_${new Date(diagnostic.created_at).toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const getDiagnosticColors = (type: DiagnosticType) => {
  // Couleurs principales de l'app : blanc et vert sauge (plus doux)
  const baseColors = {
    primary: '#6B7280', // sage-500 - vert sauge principal
    light: '#F3F4F6', // sage-100 - vert sauge clair
    dark: '#374151', // sage-700 - vert sauge foncé
    gradient: '#F9FAFB', // sage-50 - fond dégradé
    accent: '#4B5563', // sage-600 - vert sauge accent
    text: '#1F2937', // dark - texte principal
    textLight: '#6B7280', // dark-light - texte secondaire
    border: '#E5E7EB', // sage-200 - bordures
    background: '#FEFEFE' // blanc pur
  };

  // Variations selon le type de diagnostic
  switch (type) {
    case 'massage':
      return {
        ...baseColors,
        primary: '#10B981', // sage-500
        light: '#D1FAE5', // sage-100
        dark: '#047857', // sage-800
        accent: '#059669' // sage-600
      };
    case 'skincare':
      return {
        ...baseColors,
        primary: '#10B981', // sage-500
        light: '#D1FAE5', // sage-100
        dark: '#047857', // sage-800
        accent: '#059669' // sage-600
      };
    case 'headspa':
      return {
        ...baseColors,
        primary: '#10B981', // sage-500
        light: '#D1FAE5', // sage-100
        dark: '#047857', // sage-800
        accent: '#059669' // sage-600
      };
    default:
      return baseColors;
  }
};

const addModernHeader = (doc: jsPDF, diagnostic: Diagnostic, client: Client, colors: any) => {
  // Fond blanc pur (format A5: 148x210)
  doc.setFillColor(254, 254, 254); // blanc pur
  doc.rect(0, 0, 148, 210, 'F');
  
  // Header avec vert sauge
  const primaryRgb = hexToRgb(colors.primary);
  doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.roundedRect(10, 10, 128, 25, 6, 6, 'F');
  
  // Icône du diagnostic
  const iconText = getDiagnosticIcon(diagnostic.diagnostic_type);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(iconText, 15, 25);
  
  // Titre principal
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Récapitulatif Diagnostic', 25, 20);
  
  // Sous-titre
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${client.first_name} ${client.last_name} • ${getDiagnosticTypeLabel(diagnostic.diagnostic_type)}`, 25, 26);
  
  // Date du diagnostic
  doc.setFontSize(7);
  doc.text(`Réalisé le ${new Date(diagnostic.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 15, 32);
};

const addClientInfoCard = (doc: jsPDF, client: Client, colors: any) => {
  // Carte client avec fond blanc (format A5)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 40, 128, 35, 6, 6, 'F');
  
  // Bordure colorée vert sauge
  const primaryRgb = hexToRgb(colors.primary);
  doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.setLineWidth(1);
  doc.roundedRect(10, 40, 128, 35, 6, 6, 'S');
  
  // Avatar client avec fond vert sauge clair
  const lightRgb = hexToRgb(colors.light);
  doc.setFillColor(lightRgb.r, lightRgb.g, lightRgb.b);
  doc.circle(20, 57, 8, 'F');
  
  const darkRgb = hexToRgb(colors.dark);
  doc.setTextColor(darkRgb.r, darkRgb.g, darkRgb.b);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${client.first_name[0]}${client.last_name[0]}`, 17, 60);
  
  // Informations client
  const textRgb = hexToRgb(colors.text);
  doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${client.first_name} ${client.last_name}`, 35, 50);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const textLightRgb = hexToRgb(colors.textLight);
  doc.setTextColor(textLightRgb.r, textLightRgb.g, textLightRgb.b);
  doc.text('Informations client', 35, 54);
  
  // Détails client (2 colonnes)
  const details = [
    { label: 'Email', value: client.email },
    { label: 'Téléphone', value: client.phone },
    { label: 'Date de naissance', value: new Date(client.date_of_birth).toLocaleDateString('fr-FR') },
    { label: 'Client depuis', value: new Date(client.created_at).toLocaleDateString('fr-FR') }
  ];
  
  let x = 35;
  let y = 60;
  details.forEach((detail, index) => {
    if (index === 2) {
      x = 35;
      y = 68;
    }
    
    doc.setFontSize(6);
    doc.setTextColor(textLightRgb.r, textLightRgb.g, textLightRgb.b);
    doc.text(detail.label, x, y);
    doc.setFontSize(7);
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    doc.text(detail.value, x, y + 3);
    
    x += 60;
  });
};

const addDiagnosticAnswers = (doc: jsPDF, diagnostic: Diagnostic, colors: any, startY: number): number => {
  // Titre de section
  const textRgb = hexToRgb(colors.text);
  doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Réponses du diagnostic', 10, startY);
  
  let yPosition = startY + 8;
  
  // Carte des réponses avec fond blanc (format A5)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, yPosition - 3, 128, 100, 6, 6, 'F');
  
  // Bordure colorée vert sauge
  const primaryRgb = hexToRgb(colors.primary);
  doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.setLineWidth(1);
  doc.roundedRect(10, yPosition - 3, 128, 100, 6, 6, 'S');
  
  yPosition += 3;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  Object.entries(diagnostic.answers).forEach(([key, value], index) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    
    // Vérifier si on dépasse la carte
    if (yPosition > startY + 90) {
      // Nouvelle page pour les réponses restantes
      doc.addPage();
      addPageHeader(doc, colors);
      yPosition = 40;
      
      // Nouvelle carte
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(10, yPosition - 3, 128, 150, 6, 6, 'F');
      doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.setLineWidth(1);
      doc.roundedRect(10, yPosition - 3, 128, 150, 6, 6, 'S');
      yPosition += 3;
    }
    
    // Question avec icône vert sauge clair
    const lightRgb = hexToRgb(colors.light);
    doc.setFillColor(lightRgb.r, lightRgb.g, lightRgb.b);
    doc.circle(15, yPosition + 2, 1.5, 'F');
    
    const darkRgb = hexToRgb(colors.dark);
    doc.setTextColor(darkRgb.r, darkRgb.g, darkRgb.b);
    doc.setFont('helvetica', 'bold');
    const question = formatQuestion(key);
    doc.text(`${question}:`, 18, yPosition + 3);
    yPosition += 6;
    
    // Réponse
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    doc.setFont('helvetica', 'normal');
    const answer = renderAnswerValue(value);
    const lines = doc.splitTextToSize(answer, 100);
    doc.text(lines, 20, yPosition);
    yPosition += lines.length * 3 + 5;
    
    // Ligne de séparation
    if (index < Object.entries(diagnostic.answers).length - 1) {
      const borderRgb = hexToRgb(colors.border);
      doc.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
      doc.setLineWidth(0.3);
      doc.line(15, yPosition - 1, 130, yPosition - 1);
    }
  });
  
  return yPosition + 10;
};

const addSignatureSection = (doc: jsPDF, diagnostic: Diagnostic, colors: any, startY: number): number => {
  // Vérifier si on a besoin d'une nouvelle page (format A5)
  if (startY > 150) {
    doc.addPage();
    addPageHeader(doc, colors);
    startY = 40;
  }
  
  // Titre de section
  const textRgb = hexToRgb(colors.text);
  doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature du client', 10, startY);
  
  // Carte de signature (réduite)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, startY + 5, 128, 30, 6, 6, 'F');
  
  // Bordure colorée
  const primaryRgb = hexToRgb(colors.primary);
  doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.setLineWidth(1);
  doc.roundedRect(10, startY + 5, 128, 30, 6, 6, 'S');
  
  // Importer la signature si disponible
  if (diagnostic.signature_data) {
    try {
      // Ajouter l'image de signature (plus petite)
      doc.addImage(
        diagnostic.signature_data,
        'PNG',
        15, // x
        startY + 10, // y
        100, // width
        20, // height
        undefined,
        'FAST'
      );
      
      // Texte de validation
      const accentRgb = hexToRgb(colors.accent);
      doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ Signature validée', 15, startY + 28);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la signature:', error);
      
      // Fallback si l'image ne peut pas être chargée
      const accentRgb = hexToRgb(colors.accent);
      doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ Signature électronique présente', 15, startY + 20);
      
      const textLightRgb = hexToRgb(colors.textLight);
      doc.setTextColor(textLightRgb.r, textLightRgb.g, textLightRgb.b);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text('Je certifie l\'exactitude des informations', 15, startY + 25);
    }
  } else {
    // Pas de signature
    const textLightRgb = hexToRgb(colors.textLight);
    doc.setTextColor(textLightRgb.r, textLightRgb.g, textLightRgb.b);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Aucune signature fournie', 15, startY + 20);
  }
  
  return startY + 40;
};

const addPageHeader = (doc: jsPDF, colors: any) => {
  // Fond blanc pur (format A5)
  doc.setFillColor(254, 254, 254);
  doc.rect(0, 0, 148, 210, 'F');
  
  // Header simplifié avec vert sauge
  const primaryRgb = hexToRgb(colors.primary);
  doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  doc.roundedRect(10, 10, 128, 15, 6, 6, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DreamSkin Diagnostic - Suite', 15, 20);
};

const addModernFooter = (doc: jsPDF, diagnostic: Diagnostic) => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Ligne de séparation vert sauge (format A5)
    const borderRgb = hexToRgb('#E5E7EB'); // sage-200
    doc.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
    doc.setLineWidth(0.5);
    doc.line(10, 200, 138, 200);
    
    // Footer
    doc.setFontSize(6);
    const textLightRgb = hexToRgb('#6B7280'); // dark-light
    doc.setTextColor(textLightRgb.r, textLightRgb.g, textLightRgb.b);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} sur ${pageCount}`, 10, 205);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 80, 205);
    doc.text('DreamSkin Diagnostic App', 10, 208);
  }
};

const getDiagnosticIcon = (type: DiagnosticType): string => {
  switch (type) {
    case 'massage':
      return '💙';
    case 'skincare':
      return '✨';
    case 'headspa':
      return '✂️';
    default:
      return '📋';
  }
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

const getDiagnosticTypeLabel = (type: DiagnosticType): string => {
  switch (type) {
    case 'massage':
      return 'Massage';
    case 'skincare':
      return 'Skincare Coréen';
    case 'headspa':
      return 'Head Spa';
    default:
      return type;
  }
};

// Fonction utilitaire pour convertir hex en RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 107, g: 114, b: 128 }; // sage-500 par défaut
};
