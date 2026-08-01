-- Seed data: Eventos de Real del Monte
INSERT INTO events (id, title, description, date, location, category) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'Feria Internacional del Paste', 'El evento gastronómico más importante de Real del Monte. Decenas de pasteurías compiten por el mejor paste tradicional y de innovación.', '2026-10-15', 'Plaza de la Constitución', 'gastronomia'),
  ('e0000001-0000-0000-0000-000000000002', 'Festival de la Cultura Minera', 'Celebración de la herencia minera con exposiciones, conferencias y recorridos por las minas históricas.', '2026-03-20', 'Mina de Acosta', 'cultura'),
  ('e0000001-0000-0000-0000-000000000003', 'Noche de Leyendas', 'Recorrido nocturno por las calles del centro histórico contando leyendas y mitos del pueblo minero.', '2026-04-05', 'Centro Histórico', 'turismo'),
  ('e0000001-0000-0000-0000-000000000004', 'Concierto de la Orquesta Filarmónica', 'Presentación de la Orquesta Filarmónica del Estado de Hidalgo en la plaza principal.', '2026-06-12', 'Plaza de la Constitución', 'musica'),
  ('e0000001-0000-0000-0000-000000000005', 'Feria de la Cera', 'Exposición y venta de velas y veladoras artesanales. Tradición centenaria de la región.', '2026-02-02', 'Atrio de la Parroquia', 'tradicion'),
  ('e0000001-0000-0000-0000-000000000006', 'Festival del Hongo', 'Recorrido micológico por los bosques de la región. Degustación y talleres de identificación.', '2026-08-15', 'Bosques de Real del Monte', 'naturaleza'),
  ('e0000001-0000-0000-0000-000000000007', 'Semana Santa en Real del Monte', 'Procesiones y representaciones de la Pasión de Cristo con más de 100 años de tradición.', '2026-03-28', 'Centro Histórico', 'tradicion'),
  ('e0000001-0000-0000-0000-000000000008', 'Feria del Libro Real del Monte', 'Editoriales independientes, presentaciones de libros y talleres literarios.', '2026-11-10', 'Casa de la Cultura', 'cultura'),
  ('e0000001-0000-0000-0000-000000000009', 'Torneo de Sapo', 'Tradicional torneo del juego de sapo, herencia de la cultura minera británica.', '2026-12-25', 'Plaza de la Constitución', 'tradicion'),
  ('e0000001-0000-0000-0000-000000000010', 'Feria de la Nieve', 'Degustación de nieves artesanales de sabores tradicionales: pulque, rompope, tejocote.', '2026-04-20', 'Jardín Municipal', 'gastronomia')
ON CONFLICT (id) DO NOTHING;
