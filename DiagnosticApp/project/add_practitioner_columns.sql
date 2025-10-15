-- Script SQL pour ajouter les colonnes praticien à la table diagnostics
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les colonnes practitioner_id et practitioner_name
ALTER TABLE diagnostics 
ADD COLUMN IF NOT EXISTS practitioner_id text,
ADD COLUMN IF NOT EXISTS practitioner_name text;

-- Créer un index pour les requêtes par praticien
CREATE INDEX IF NOT EXISTS idx_diagnostics_practitioner ON diagnostics(practitioner_id);

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'diagnostics' 
AND column_name IN ('practitioner_id', 'practitioner_name');




