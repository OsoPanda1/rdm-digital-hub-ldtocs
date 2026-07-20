# Guía de Integración - Fases 3 & 4

## Resumen

Fases 3 y 4 agregan capacidades avanzadas de música, premium, pagos y patrimonio a la plataforma RDM.

---

## FASE 3: Music, Premium & Commerce

### 3.1 Music Player Streaming Radio

**Componente:** `StreamingRadioPlayer.tsx`
**Ubicación:** `/src/components/music/StreamingRadioPlayer.tsx`

#### Características:
- Radio player con toggle admin/listener
- Streaming en vivo para administradores
- Controles: play, pause, siguiente, anterior
- Control de volumen
- Indicador "EN VIVO" cuando está activo

#### Cómo integrar:

```tsx
import { StreamingRadioPlayer } from '@/components/music/StreamingRadioPlayer';

export function MyPage() {
  return (
    <div className="p-6">
      <StreamingRadioPlayer className="mb-8" />
    </div>
  );
}
```

#### API Endpoints (agregados):

**POST** `/api/radio/stream/start` - Inicia transmisión en vivo
```json
{
  "userId": "admin_id"
}
```

**POST** `/api/radio/stream/stop` - Detiene transmisión
**GET** `/api/radio/streams/active` - Obtiene streams activos
**GET** `/api/radio/stream/:streamId/listeners` - Cuenta de listeners

### 3.2 Premium Tier System

**Componente:** `PremiumTierShowcase.tsx`
**Ubicación:** `/src/components/premium/PremiumTierShowcase.tsx`

#### Tiers Disponibles:

1. **Base** (Gratis)
   - 1x multiplicador de puntos
   - Acceso a contenido público

2. **Guardián** ($99/mes) ⭐ Recomendado
   - 2x multiplicador de puntos
   - 500 puntos iniciales ($50 MXN valor)
   - Tours virtuales avanzados
   - Eventos mensuales

3. **Embajador** ($249/mes)
   - 3x multiplicador de puntos
   - 1500 puntos iniciales ($150 MXN valor)
   - Contenido exclusivo premium
   - Streaming prioritario
   - Soporte directo

#### Cómo integrar:

```tsx
import { PremiumTierShowcase } from '@/components/premium/PremiumTierShowcase';

export function PremiumPage() {
  const currentUser = {
    tier: 'Guardian',
    points: {
      available: 850,
      earned: 1200,
      redeemed: 350,
    },
    nextReward: 150,
  };

  return (
    <PremiumTierShowcase
      currentUser={currentUser}
      onSelectTier={(tier) => console.log('Selected:', tier)}
    />
  );
}
```

### 3.3 Gamification Points System

**Hook:** `useGamificationPoints.ts`
**Ubicación:** `/src/hooks/useGamificationPoints.ts`

#### Funciones:
- Agregar puntos
- Canjear puntos por recompensas
- Mejorar tier
- Historial de actividad

#### Cómo usar:

```tsx
import { useGamificationPoints } from '@/hooks/useGamificationPoints';

export function MyComponent() {
  const { 
    points, 
    activity, 
    addPoints, 
    redeemPoints,
    pointsToNextReward,
    multiplierBonus,
  } = useGamificationPoints();

  const handleGameComplete = () => {
    addPoints({
      points: 100,
      type: 'game',
      description: 'Completó minijuego de territorio'
    });
  };

  return (
    <div>
      <p>Puntos disponibles: {points?.available}</p>
      <p>Próxima recompensa: {pointsToNextReward} pts</p>
      <p>Multiplicador: {multiplierBonus}</p>
      <button onClick={handleGameComplete}>Jugar</button>
    </div>
  );
}
```

### 3.4 Commerce Registration with Stripe

**Componente:** `CommerceRegistrationForm.tsx`
**Ubicación:** `/src/components/commerce/CommerceRegistrationForm.tsx`

#### Planes:
- **Básico:** $99/mes (3 imágenes)
- **Premium:** $299/mes (10 imágenes) - Recomendado
- **Empresarial:** $599/mes (20 imágenes)

#### Flujo:
1. Paso 1: Información del negocio
2. Paso 2: Seleccionar plan
3. Paso 3: Pago con Stripe

#### Cómo integrar:

```tsx
import { CommerceRegistrationForm } from '@/components/commerce/CommerceRegistrationForm';

export function CommerceSignupPage() {
  return <CommerceRegistrationForm />;
}
```

#### API Endpoint:

**POST** `/api/commerce/register`

FormData:
- businessName, ownerName, email, phone
- category, description, address
- images (múltiples)
- plan (basic|premium|enterprise)

Respuesta:
```json
{
  "checkoutUrl": "https://checkout.stripe.com/...",
  "registrationId": "reg_..."
}
```

---

## FASE 4: Heritage & Animations

### 4.1 Heritage Gallery

**Componente:** `HeritageGallery.tsx`
**Ubicación:** `/src/components/heritage/HeritageGallery.tsx`

#### Características:
- Galería de 4 imágenes históricas
- Zoom y navegación interactiva
- Panel de información detallada
- Línea de tiempo histórica
- Categorización por período

#### Imágenes incluidas:
1. Pedro Romero Terreros (1710-1782)
2. Grabado Histórico 1782
3. Richard Bell - Personaje Teatral
4. Tradición Teatral (XIX-XX)

#### Cómo integrar:

```tsx
import { HeritageGallery } from '@/components/heritage/HeritageGallery';

export function HeritagePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <HeritageGallery />
    </div>
  );
}
```

### 4.2 Global Animations & Scroll Effects

**Componentes:** En `/src/components/animations/ScrollAnimationWrapper.tsx`

#### Componentes disponibles:

1. **ScrollAnimationWrapper** - Anima componentes al entrar en vista
```tsx
<ScrollAnimationWrapper variant="fadeInUp" delay={0.2}>
  <h2>Contenido animado</h2>
</ScrollAnimationWrapper>
```

2. **RevealOnScroll** - Efecto de revelación al scroll
```tsx
<RevealOnScroll>
  <Card>Contenido revelado</Card>
</RevealOnScroll>
```

3. **StaggerContainer + StaggerItem** - Animación en cascada
```tsx
<StaggerContainer staggerDelay={0.1}>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>
```

4. **ClickFeedback** - Feedback al hacer clic
```tsx
<ClickFeedback>
  <button>Click me</button>
</ClickFeedback>
```

#### Variantes de animación:
- `fadeInUp` - Sube con fade
- `fadeInDown` - Baja con fade
- `fadeInLeft` - Viene de izquierda
- `fadeInRight` - Viene de derecha
- `scaleIn` - Aumenta escala
- `slideIn` - Desliza desde lado

---

## API Routes agregadas

### Radio Streaming
- `POST /api/radio/stream/start`
- `POST /api/radio/stream/stop`
- `GET /api/radio/streams/active`
- `GET /api/radio/stream/:streamId/listeners`

### Gamification
- `GET /api/gamification/points` - Obtener puntos del usuario
- `GET /api/gamification/activity` - Historial de actividad
- `POST /api/gamification/points/add` - Agregar puntos
- `POST /api/gamification/points/redeem` - Canjear puntos
- `POST /api/gamification/tier/upgrade` - Mejorar tier

### Commerce
- `POST /api/commerce/register` - Registrar negocio con Stripe

---

## Database Schema

### Music Tracks (ya existe)
```sql
model MusicTrack {
  id          String   @id @default(uuid())
  title       String
  artist      String
  audio_url   String?
  duration_seconds Int
  is_active   Boolean  @default(true)
  sort_order  Int      @default(0)
}
```

### Recomendado agregar:
```sql
model UserPoints {
  id        String   @id @default(cuid())
  userId    String   @unique
  available Int      @default(0)
  earned    Int      @default(0)
  redeemed  Int      @default(0)
  tier      String   @default("Base")
  multiplier Int     @default(1)
  updatedAt DateTime @updatedAt
}

model PointsTransaction {
  id          String   @id @default(cuid())
  userId      String
  points      Int
  type        String   // 'game', 'quiz', 'tour', 'purchase', 'referral'
  description String
  createdAt   DateTime @default(now())
}

model Business {
  id            String   @id @default(cuid())
  businessName  String
  ownerName     String
  email         String
  phone         String
  category      String
  plan          String   // 'basic', 'premium', 'enterprise'
  stripeId      String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}
```

---

## Configuración Stripe

1. Asegurate que `STRIPE_SECRET_KEY` está en `.env.project`
2. Las webhooks deben apuntar a `/api/webhooks/stripe`
3. Los valores de productos deben configurarse en Stripe:
   - Basic: $99 USD (o equivalente MXN)
   - Premium: $299 USD
   - Enterprise: $599 USD

---

## Testing

### Componentes para probar:
1. StreamingRadioPlayer (requiere usuario admin)
2. PremiumTierShowcase (UI visual)
3. CommerceRegistrationForm (flujo multi-paso)
4. HeritageGallery (galería interactiva)
5. Scroll animations en cualquier página

### Checklist:
- [ ] Build sin errores: `npm run build`
- [ ] Dev server funciona: `npm run dev`
- [ ] Componentes renderean correctamente
- [ ] Animations suaves a 60fps
- [ ] Responsive en mobile/tablet/desktop
- [ ] Sin console errors

---

## Deployment

Simplemente hacer push a la rama:
```bash
git add .
git commit -m "Feat: Fases 3-4 completadas - Music, Premium, Commerce, Heritage"
git push origin mineral-del-monte-tourism
```

Vercel auto-deployará en el preview. Una vez aprobado:
```bash
git push origin mineral-del-monte-tourism:main
```

---

## Próximos pasos

- Conectar endpoints API a backend real
- Agregar webhooks de Stripe
- Implementar notificaciones de puntos
- Agregar más imágenes al archivo patrimonial
- Crear dashboard de admin para música
- Implementar analytics de puntos/tiers
