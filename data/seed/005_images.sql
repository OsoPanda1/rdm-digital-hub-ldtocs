-- Seed data: Imágenes reales de Real del Monte (localizadas en /public/images)
-- Sobrescribe image_url apuntando a los assets propios del proyecto.
-- Envuelto en un bloque DO para que `supabase db query --file`
-- lo ejecute como una sola sentencia preparada.

DO $$
BEGIN

-- LUGARES
UPDATE places SET image_url = '/images/museo-medicina.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000001';
UPDATE places SET image_url = '/images/hiloche.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000002';
UPDATE places SET image_url = '/images/mina-acosta.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000003';
UPDATE places SET image_url = '/images/plaza-principal.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000004';
UPDATE places SET image_url = '/images/realito-gastronomia.png' WHERE id = 'a0000001-0000-0000-0000-000000000005';
UPDATE places SET image_url = '/images/plaza-principal.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000006';
UPDATE places SET image_url = '/images/mina-acosta.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000007';
UPDATE places SET image_url = '/images/realito-cultura.png' WHERE id = 'a0000001-0000-0000-0000-000000000008';
UPDATE places SET image_url = '/images/plaza-dos.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000009';
UPDATE places SET image_url = '/images/rosario.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000010';
UPDATE places SET image_url = '/images/ecoturismo.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000011';
UPDATE places SET image_url = '/images/mirador-purisima.jpg' WHERE id = 'a0000001-0000-0000-0000-000000000012';

-- NEGOCIOS
UPDATE businesses SET image_url = '/images/gastronomia-2.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000001';
UPDATE businesses SET image_url = '/images/gastronomia-2.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000002';
UPDATE businesses SET image_url = '/images/gastronomia-3.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000003';
UPDATE businesses SET image_url = '/images/gastronomia-4.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000004';
UPDATE businesses SET image_url = '/images/gastronomia-5.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000005';
UPDATE businesses SET image_url = '/images/realito-gastronomia.png' WHERE id = 'b0000001-0000-0000-0000-000000000006';
UPDATE businesses SET image_url = '/images/real-1.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000007';
UPDATE businesses SET image_url = '/images/realito-platerias.png' WHERE id = 'b0000001-0000-0000-0000-000000000008';
UPDATE businesses SET image_url = '/images/gastronomia-2.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000009';
UPDATE businesses SET image_url = '/images/realito-minas.png' WHERE id = 'b0000001-0000-0000-0000-000000000010';
UPDATE businesses SET image_url = '/images/realito-arte.png' WHERE id = 'b0000001-0000-0000-0000-000000000011';
UPDATE businesses SET image_url = '/images/real-3.jpg' WHERE id = 'b0000001-0000-0000-0000-000000000012';

-- EVENTOS
UPDATE events SET image_url = '/images/gastronomia-2.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000001';
UPDATE events SET image_url = '/images/mina-acosta.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000002';
UPDATE events SET image_url = '/images/callejon.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000003';
UPDATE events SET image_url = '/images/plaza-principal.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000004';
UPDATE events SET image_url = '/images/plaza-dos.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000005';
UPDATE events SET image_url = '/images/ecoturismo.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000006';
UPDATE events SET image_url = '/images/centro.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000007';
UPDATE events SET image_url = '/images/calles.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000008';
UPDATE events SET image_url = '/images/plaza.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000009';
UPDATE events SET image_url = '/images/gastronomia-5.jpg' WHERE id = 'e0000001-0000-0000-0000-000000000010';

-- RUTAS
UPDATE routes SET image_url = '/images/gastronomia-2.jpg' WHERE id = 'd0000001-0000-0000-0000-000000000001';
UPDATE routes SET image_url = '/images/mina-acosta.jpg' WHERE id = 'd0000001-0000-0000-0000-000000000002';
UPDATE routes SET image_url = '/images/realito-cultura.png' WHERE id = 'd0000001-0000-0000-0000-000000000003';
UPDATE routes SET image_url = '/images/ecoturismo.jpg' WHERE id = 'd0000001-0000-0000-0000-000000000004';
UPDATE routes SET image_url = '/images/callejon.jpg' WHERE id = 'd0000001-0000-0000-0000-000000000005';
UPDATE routes SET image_url = '/images/plaza-dos.jpg' WHERE id = 'd0000001-0000-0000-0000-000000000006';
UPDATE routes SET image_url = '/images/realito-bares.png' WHERE id = 'd0000001-0000-0000-0000-000000000007';
UPDATE routes SET image_url = '/images/mirador-purisima.jpg' WHERE id = 'd0000001-0000-0000-0000-000000000008';

END $$;
