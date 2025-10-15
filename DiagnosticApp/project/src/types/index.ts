export type DiagnosticType = 'massage' | 'skincare' | 'headspa';

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ClientInput {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
}

export interface MassageAnswers {
  has_back_problems?: boolean;
  back_problems_details?: string;
  has_cardiovascular?: boolean;
  cardiovascular_details?: string;
  has_recent_surgery?: boolean;
  surgery_details?: string;
  is_pregnant?: boolean;
  pregnancy_details?: string;
  has_medication?: boolean;
  medication_details?: string;
  has_allergies?: boolean;
  allergies_details?: string;
  zones_to_focus?: string[];
  zones_to_focus_other?: string;
  zones_to_avoid?: string[];
  zones_to_avoid_other?: string;
  preferred_pressure?: 'soft' | 'moderate' | 'firm';
  objective?: 'relaxation' | 'recovery' | 'anti-stress';
}

export interface SkincareAnswers {
  skin_type?: 'dry' | 'oily' | 'normal' | 'combination';
  current_issues?: string[];
  current_issues_other?: string;
  dermatological_conditions?: 'eczema' | 'psoriasis' | 'rosacea' | 'none' | 'other';
  dermatological_conditions_other?: string;
  known_allergies?: string[];
  known_allergies_other?: string;
  current_actives?: string[];
  current_actives_other?: string;
  last_active_use?: 'yesterday' | '2-3-days' | 'week-plus' | 'never';
  recent_treatments?: string[];
  recent_treatments_other?: string;
  primary_goals?: string[];
  extraction_pressure?: 'soft' | 'moderate' | 'firm';
  water_temperature?: 'cool' | 'warm' | 'hot';
  last_facial?: string;
}

export interface HeadSpaAnswers {
  health_conditions?: string[];
  health_conditions_details?: string;
  hair_type?: 'dry' | 'oily' | 'combination' | 'normal';
  last_shampoo?: string;
  massage_preference?: 'tonic' | 'relaxing';
  pressure_preference?: 'soft' | 'firm';
  water_temperature?: 'cool' | 'warm' | 'hot';
  had_headspa_before?: boolean;
  positive_effects?: string;
  negative_effects?: string;
  face_skin_type?: 'dry' | 'oily' | 'combination' | 'normal';
  calming_sounds?: string[];
}

export type DiagnosticAnswers = MassageAnswers | SkincareAnswers | HeadSpaAnswers;

export interface Diagnostic {
  id: string;
  client_id: string;
  diagnostic_type: DiagnosticType;
  answers: DiagnosticAnswers;
  signature_data?: string;
  created_at: string;
  completed_at?: string;
}

export interface DiagnosticWithClient extends Diagnostic {
  client: Client;
}

export interface QuestionConfig {
  id: string;
  type: 'toggle' | 'text' | 'textarea' | 'chips' | 'cards' | 'date';
  question: string;
  placeholder?: string;
  options?: { value: string; label: string; icon?: string }[];
  multiple?: boolean;
  maxSelections?: number;
  conditional?: {
    dependsOn: string;
    value: any;
  };
}
