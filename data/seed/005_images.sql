-- Seed data: Imágenes curadas para lugares, negocios, eventos y rutas
-- Idempotente: solo actualiza cuando image_url está vacío.

-- LUGARES
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000001' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000002' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000003' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1543429259-ecc661a2bec7?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000004' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000005' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000006' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000007' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000008' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000009' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000010' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000011' AND image_url = '';
UPDATE places SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' WHERE id = 'a0000001-0000-0000-0000-000000000012' AND image_url = '';

-- NEGOCIOS
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000001' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000002' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000003' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000004' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000005' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000006' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000007' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000008' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000009' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000010' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1598902108854-10e313adf98c?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000011' AND image_url = '';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80' WHERE id = 'b0000001-0000-0000-0000-000000000012' AND image_url = '';

-- EVENTOS
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000001' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000002' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000003' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1507838153414-b4b953384aa6?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000004' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000005' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000006' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000007' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000008' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000009' AND image_url = '';
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80' WHERE id = 'e0000001-0000-0000-0000-000000000010' AND image_url = '';

-- RUTAS
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000001' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000002' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000003' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000004' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000005' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000006' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000007' AND image_url = '';
UPDATE routes SET image_url = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80' WHERE id = 'd0000001-0000-0000-0000-000000000008' AND image_url = '';
