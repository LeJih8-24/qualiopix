-- Rôle utilisé par l'application : PAS superutilisateur et PAS propriétaire
-- des tables, pour que la sécurité au niveau des lignes (RLS) s'applique.
CREATE ROLE qualiopix_app LOGIN PASSWORD 'qualiopix_app';
CREATE DATABASE qualiopix_test OWNER qualiopix;
GRANT CONNECT ON DATABASE qualiopix TO qualiopix_app;
GRANT CONNECT ON DATABASE qualiopix_test TO qualiopix_app;
