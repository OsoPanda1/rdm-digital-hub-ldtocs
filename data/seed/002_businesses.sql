-- Seed data: Negocios y comercios de Real del Monte
INSERT INTO businesses (id, name, cat, description, address, phone) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Pasteuría La Mina', 'gastronomia', 'Pastes tradicionales desde 1950. Los mejores pastes de papa con carne de la región.', 'Calle Hidalgo 34, Centro', '7711234567'),
  ('b0000001-0000-0000-0000-000000000002', 'Pasteuría La Antigua', 'gastronomia', 'Pastes artesanales horneados en horno de piedra. Receta original de Cornualles.', 'Calle Benito Juárez 12, Centro', '7712345678'),
  ('b0000001-0000-0000-0000-000000000003', 'Pasteuría El Real', 'gastronomia', 'Especialidad en pastes de frijoles y tinga. Ambiente familiar.', 'Plaza de la Constitución 5, Centro', '7713456789'),
  ('b0000001-0000-0000-0000-000000000004', 'Restaurante El Edén', 'gastronomia', 'Cocina tradicional hidalguense. Prueba el mole, los escamoles y las mixiotes.', 'Calle Morelos 8, Centro', '7714567890'),
  ('b0000001-0000-0000-0000-000000000005', 'Restaurante La Terraza', 'gastronomia', 'Cocina de autor con ingredientes locales. Vista panorámica del valle.', 'Cerro del Hiloche s/n', '7715678901'),
  ('b0000001-0000-0000-0000-000000000006', 'Restaurante Casa Grande', 'gastronomia', 'Casona del siglo XVIII convertida en restaurante. Cocina tradicional mexicana.', 'Calle Allende 3, Centro', '7716789012'),
  ('b0000001-0000-0000-0000-000000000007', 'Hotel Real del Monte', 'hospedaje', 'Hotel boutique en el centro histórico. Habitaciones con vista a la plaza principal.', 'Plaza de la Constitución 10, Centro', '7717890123'),
  ('b0000001-0000-0000-0000-000000000008', 'Artesanías El Sopón', 'artesanias', 'Artesanía local: textiles, cerámica, y recuerdos típicos de Real del Monte.', 'Calle Hidalgo 45, Centro', '7718901234'),
  ('b0000001-0000-0000-0000-000000000009', 'Café Real', 'gastronomia', 'Café de altura de la región. Repostería artesanal y ambiente bohemio.', 'Calle Juárez 7, Centro', '7719012345'),
  ('b0000001-0000-0000-0000-000000000010', 'Tienda de Artesanías Mineras', 'artesanias', 'Réplicas de herramientas mineras, joyería de plata y recuerdos únicos.', 'Camino Real a Pachuca 8', '7710123456'),
  ('b0000001-0000-0000-0000-000000000011', 'Galería de Arte Real', 'artesanias', 'Galería con obras de artistas locales y regionales. Exposiciones mensuales.', 'Calle Allende 15, Centro', '7711234500'),
  ('b0000001-0000-0000-0000-000000000012', 'Tour Operador Real del Monte', 'turismo', 'Recorridos guiados por el pueblo mágico. Rutas mineras, gastronómicas y culturales.', 'Plaza de la Constitución 2', '7712345600')
ON CONFLICT (id) DO NOTHING;
