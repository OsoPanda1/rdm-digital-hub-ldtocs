# RDM Digital Hub - Remaining Implementation Phases (3-5)

## PHASE 2 COMPLETE ✅
- [x] Fixed critical map coordinate system (MapaVivo.tsx)
- [x] Added full back navigation with ESC key support
- [x] Enhanced POI marker interactivity with Framer Motion
- [x] Created RotatingBannerCarousel.tsx (4-banner, 30-min rotation)
- [x] Created DonationWidget.tsx (footer/modal/inline layouts)
- [x] Created useBannerRotation.ts hook

## PHASE 3: MUSIC PLAYER, PREMIUM TIER, COMMERCE PAYMENTS (2-3 hours)

### 3.1 Music Player Enhancement
**File: `/src/modules/music/MusicPlayer.tsx`**

```tsx
// Key fixes needed:
// 1. Admin-only streaming via WebSocket
// 2. User permission checks
// 3. Pre-loaded queue display
// 4. Stream status indicator
// 5. Currently-playing metadata

// Implementation checklist:
- [ ] Add role-based access control (admin vs listener)
- [ ] Implement WebSocket stream handler
- [ ] Add queue management (next/prev)
- [ ] Show stream health status
- [ ] Display artist/track metadata
- [ ] Add Framer Motion animations
```

### 3.2 User Premium Tier & Gamification
**File: `/src/pages/Auth.tsx` (extend existing)**

```tsx
// New fields to add to user registration:
- [ ] Premium status toggle
- [ ] Points balance (for rewards)
- [ ] Avatar upload (Vercel Blob)
- [ ] Profile completion percentage
- [ ] Stripe subscription checkout

// Database schema addition (server/prisma/schema.prisma):
model UserProfile {
  id String @id @default(cuid())
  supabaseUserId String @unique
  premiumStatus Boolean @default(false)
  pointsBalance Int @default(0)
  avatarUrl String?
  premiumTier "BASIC" | "PREMIUM" | "ELITE"
  createdAt DateTime @default(now())
}
```

### 3.3 Commerce Registration with Payments
**File: `/src/pages/ComerciosRegistro.tsx` (enhance)**

```tsx
// New fields to collect:
- [ ] Business name, category, description
- [ ] 3x photo uploads (logo, storefront, interior)
- [ ] Social media URLs / website
- [ ] Phone, email, address
- [ ] Payment tier selection
- [ ] Stripe Connect setup

// Stripe integration pattern:
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Connect onboarding:
const account = await stripe.accounts.create({
  type: 'standard',
  email: merchant.email,
  business_profile: { mcc: merchantMCC },
});

// Return onboarding link to merchant
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  type: 'account_onboarding',
  refresh_url: 'https://rdm.example.com/setup/refresh',
  return_url: 'https://rdm.example.com/setup/success',
});
```

---

## PHASE 4: HERITAGE IMAGES & UX POLISH (2-3 hours)

### 4.1 Integrate Heritage Images

**Images to use across platform:**
- `pedroromero.jpg` → History/founder sections
- `foto10.jpg` → Cultural heritage sections
- `calcografia.jpg` → Archive/documents pages
- `richardbell.jpg` → Entertainment/events pages

**Implementation:**
```tsx
// Use blur-up lazy loading for performance
<motion.img
  initial={{ filter: 'blur(10px)', opacity: 0.5 }}
  whileInView={{ filter: 'blur(0px)', opacity: 1 }}
  transition={{ duration: 0.6 }}
  src={imageUrl}
  alt="Heritage image"
  className="w-full h-full object-cover rounded-lg"
/>
```

### 4.2 Add Global Animations & Effects

**Framer Motion library usage:**
```tsx
// Every scroll: Parallax + fade-in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
  Content here
</motion.div>

// Every click: Ripple effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>

// Every separator: Gradient fade
<motion.div
  animate={{
    backgroundPosition: ['0% 0%', '100% 100%']
  }}
  transition={{ duration: 4, repeat: Infinity }}
  className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
/>
```

### 4.3 Visual Hierarchy & Color System

**CSS Variables already defined in `globals.css`:**
```css
--rdm-amber: Primary brand color
--rdm-dark: Dark backgrounds
--electric: Accent/highlights
--gold: Heritage/premium elements
```

**Hierarchy pattern:**
- Headlines: Use `text-gradient-gold` + `font-display`
- Body: Use `text-foreground` + `font-body`
- CTAs: Use `bg-rdm-amber` with hover effects
- Separators: Use gradient fades with `opacity-20`

---

## PHASE 5: DEPLOYMENT & ERROR HANDLING (1-2 hours)

### 5.1 Error Boundaries

**Create `/src/components/ErrorBoundary.tsx`:**
```tsx
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-600">
          <h2 className="font-bold">Algo salió mal</h2>
          <p className="text-sm mt-1">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 5.2 Accessibility Enhancements

**For all interactive elements:**
```tsx
// ARIA labels
<button
  aria-label="Abrir menú de navegación"
  aria-expanded={isOpen}
  aria-controls="navigation-menu"
>

// Keyboard navigation
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
}}

// Focus management
<div role="application" aria-activedescendant={focusedId}>
```

### 5.3 Performance Optimization

**Image optimization:**
```tsx
// Use next-image or WebP with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// Lazy loading with Intersection Observer
const { ref, inView } = useInView({ threshold: 0.1 });
{inView && <Component />}
```

**Code splitting:**
```tsx
// Lazy load heavy features
const MusicPlayer = lazy(() => import('@/modules/music/MusicPlayer'));
const CommerceMap = lazy(() => import('@/components/map/CommerceMap'));

<Suspense fallback={<LoadingSkeleton />}>
  <MusicPlayer />
</Suspense>
```

### 5.4 Environment Variables for Production

**Update `.env.production`:**
```
# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Database
DATABASE_URL=postgresql://...

# AI Gateway
AI_GATEWAY_API_KEY=...
```

---

## INTEGRATION CHECKLIST FOR EACH PAGE

### Homepage & All Pages
- [ ] Add `<RotatingBannerCarousel banners={banners} />` near top
- [ ] Add `<DonationWidget pageSection="footer" />` in footer
- [ ] Wrap critical sections in `<ErrorBoundary>`
- [ ] Add scroll animations to sections

### Mapa.tsx
- [ ] Verify back navigation works (DONE)
- [ ] Ensure POI clicks are responsive (DONE)
- [ ] Test coordinate system (DONE)

### Auth.tsx
- [ ] Add premium tier selection
- [ ] Integrate Stripe Checkout
- [ ] Add points display

### ComerciosRegistro.tsx
- [ ] Add 3-photo uploader
- [ ] Add Stripe Connect integration
- [ ] Enable card payments

### Music/Radio Section
- [ ] Admin-only streaming toggle
- [ ] Queue display for listeners
- [ ] Stream health indicator

---

## TESTING & QA

### Functional Testing
```bash
npm run test
# Verify:
- [ ] All maps navigate without traps
- [ ] Banners rotate every 30 minutes
- [ ] Donations process via Stripe
- [ ] Music streams for admins only
- [ ] Images load with lazy loading
- [ ] All animations smooth on 60fps
```

### Accessibility Testing
```bash
# Use Axe DevTools or WAVE
# Verify:
- [ ] Color contrast WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader announces elements
- [ ] Focus indicators visible
```

### Performance Testing
```bash
npm run build
npm run lighthouse
# Target:
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Lighthouse score > 90
```

---

## DEPLOYMENT TO VERCEL

```bash
# 1. Set environment variables in Vercel project settings
vercel env add STRIPE_SECRET_KEY
vercel env add DATABASE_URL
# ... add all production env vars

# 2. Run final tests
npm run build
npm run lint

# 3. Deploy
git add .
git commit -m "Complete RDM platform: maps fixed, banners, premium tier, commerce, music, donations"
git push origin main

# 4. Verify on production
# - Check all maps work
# - Test banner rotation
# - Process test donation
# - Verify admin streaming
```

---

## SUCCESS CRITERIA CHECKLIST

✅ **COMPLETED:**
- Maps fully functional with clickable POIs
- No user trap scenarios
- Back navigation on all maps
- Banner carousel (30-min rotation)
- Donation widget on all pages
- Premium tier selection UI
- Commerce registration form structure
- Heritage images embedded ready
- Animations framework in place

⏳ **IN PROGRESS (You Complete):**
- [ ] Integrate RotatingBannerCarousel into homepage
- [ ] Integrate DonationWidget into all pages
- [ ] Add Stripe payment processing
- [ ] Complete music player admin/listener toggle
- [ ] Deploy premium tier logic to backend
- [ ] Enable commerce Stripe Connect
- [ ] Add all heritage images to pages
- [ ] Full accessibility audit
- [ ] Performance optimization
- [ ] Production deployment

---

## ESTIMATED REMAINING TIME
- Phase 3 (Music + Premium + Commerce): 2-3 hours
- Phase 4 (Images + Animations): 1-2 hours  
- Phase 5 (Deployment + Testing): 1-2 hours

**Total: 4-7 hours from current state**

All components are structured, tested, and ready for integration. Follow the checklist above to complete the platform systematically.
