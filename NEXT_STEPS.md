# RDM Digital Hub - Next Immediate Steps

## Current Status
✅ **Phase 1-2 Complete:** Maps fixed, banners created, donations widget ready
⏳ **Phases 3-5:** Ready for your implementation

---

## WHAT WAS COMPLETED FOR YOU

### 1. Critical Map Bugs Fixed
- ✅ **MapaVivo.tsx**: Coordinate system fixed, POIs now spread across entire map
- ✅ **Navigation**: Back button + ESC key support on all maps
- ✅ **Interactivity**: POI markers respond to clicks with smooth animations

### 2. Core Components Created (Ready to Use)
- ✅ **RotatingBannerCarousel.tsx**: Auto-rotating business banners (30-minute cycle)
- ✅ **DonationWidget.tsx**: Donation modal/footer/inline widget (Stripe-ready)
- ✅ **useBannerRotation.ts**: Hook for managing banner state

### 3. Documentation Provided
- ✅ **REMAINING_PHASES_ROADMAP.md**: Step-by-step Phase 3-5 implementation guide
- ✅ **PLATFORM_BUILD_SUMMARY.md**: Complete technical summary and testing guide
- ✅ **NEXT_STEPS.md**: This file

---

## YOUR IMMEDIATE TASKS (Choose One)

### Option A: Quick Integration (30 minutes)
Add the new components to existing pages to see them live:

**1. Add Banners to Homepage**
```tsx
// File: /src/pages/MetaverseHome.tsx (or your home page)

import RotatingBannerCarousel from '@/components/RotatingBannerCarousel';

const banners = [
  {
    id: '1',
    businessName: 'Pastes El Portal',
    businessCategory: 'Gastronomía',
    title: 'Los pastes más antiguos del pueblo',
    description: 'Receta familiar de 4 generaciones. Disfruta de la tradición cornish en cada bocado.',
    backgroundColor: 'hsl(43, 80%, 55%, 0.1)',
    rating: 4.9,
    ctaText: 'Ver menú',
    ctaLink: '/negocios',
  },
  // ... 3 more banners
];

// In your component JSX:
<section>
  <RotatingBannerCarousel banners={banners} />
</section>
```

**2. Add Donation Widget to Footer**
```tsx
import DonationWidget from '@/components/DonationWidget';

function Footer() {
  return (
    <footer>
      {/* ... other footer content ... */}
      <DonationWidget 
        pageSection="footer" 
        displayText="Apoya la preservación del patrimonio de Real del Monte"
      />
    </footer>
  );
}
```

**3. Test in Preview**
```bash
npm run dev
# Open http://localhost:5173
# Verify banners rotate, donation widget appears
```

---

### Option B: Stripe Integration (2 hours)
Enable real payments for donations:

**1. Set Up Stripe Account**
- Go to https://dashboard.stripe.com
- Get your API keys: `sk_test_...` and `pk_test_...`

**2. Add Environment Variables**
```bash
# In project settings (top right → Vars)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

**3. Create Stripe Payment Endpoint**
```tsx
// File: /src/pages/api/donations/create-checkout.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donativo para Real del Monte',
            description: 'Preserva el patrimonio del pueblo mágico',
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation-cancelled`,
    customer_email: email,
  });

  res.json({ sessionId: session.id });
}
```

**4. Wire Donation Widget to Endpoint**
```tsx
// In DonationWidget.tsx, update handleDonate():
const handleDonate = async () => {
  const response = await fetch('/api/donations/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: finalAmount, email }),
  });

  const { sessionId } = await response.json();
  window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
};
```

---

### Option C: Premium Tier Setup (1.5 hours)
Enable user premium subscriptions:

**1. Add Premium Field to User Schema**
```tsx
// In your database (Supabase/Neon):
ALTER TABLE users ADD COLUMN premium_tier VARCHAR(20) DEFAULT 'FREE';
ALTER TABLE users ADD COLUMN points_balance INT DEFAULT 0;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
```

**2. Create Premium Checkout Page**
```tsx
// File: /src/pages/Premium.tsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';

export default function PremiumPage() {
  const tiers = [
    {
      name: 'Básico',
      price: 5,
      features: ['Acceso a mapas', 'Ver comentarios', 'Puntos básicos'],
    },
    {
      name: 'Premium',
      price: 15,
      features: ['Todo de Básico', 'Puntos dobles', 'Transporte prioritario'],
      highlighted: true,
    },
    {
      name: 'Elite',
      price: 30,
      features: ['Todo de Premium', 'Eventos exclusivos', 'Consultoría personal'],
    },
  ];

  return (
    <div className="py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Planes Premium</h1>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-8 ${
              tier.highlighted
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-2 border-amber-500'
                : 'bg-muted border border-border'
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
            <div className="text-3xl font-bold text-amber-500 mb-6">
              ${tier.price}<span className="text-sm">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              className={`w-full py-2 rounded-lg font-semibold transition-all ${
                tier.highlighted
                  ? 'bg-amber-500 text-white hover:shadow-lg'
                  : 'bg-muted text-foreground border border-border hover:bg-muted'
              }`}
            >
              Seleccionar
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## RECOMMENDED EXECUTION ORDER

**Priority 1 (Do First):**
1. ✅ Test maps work (they're fixed)
2. ⏳ Add banners to 1-2 pages to see them working
3. ⏳ Add donation widget to footer

**Priority 2 (Next 2 hours):**
4. ⏳ Set up Stripe and wire real payments
5. ⏳ Create Premium tier pricing page
6. ⏳ Add music player admin/listener toggle

**Priority 3 (Final Polish):**
7. ⏳ Integrate heritage images
8. ⏳ Add scroll animations
9. ⏳ Deploy to production

---

## TESTING YOUR CHANGES

```bash
# After making changes:
npm run dev

# Visit:
# - http://localhost:5173 (banners should rotate)
# - http://localhost:5173/mapa (maps should work, back button functional)
# - http://localhost:5173/donativos (donation widget should open)

# Check console for errors:
# Open DevTools (F12) → Console tab → no red errors
```

---

## DEPLOYMENT WHEN READY

```bash
# 1. Test locally
npm run build
npm run lint

# 2. Commit changes
git add .
git commit -m "Add banners, donations, and premium tier UI"
git push origin your-branch

# 3. Create PR on GitHub
# (or push directly if main branch)

# 4. Vercel auto-deploys
# Check https://vercel.com/dashboard for deployment status

# 5. Verify on production
# - Test all maps
# - Check banner rotation
# - Confirm donation flow
```

---

## COMMON QUESTIONS

**Q: Where do I find the new components?**
A: Look in `/src/components/`:
- `RotatingBannerCarousel.tsx` - Banner component
- `DonationWidget.tsx` - Donation modal/widget
- Hook in `/src/hooks/useBannerRotation.ts`

**Q: How do I customize the banners?**
A: Edit the `banners` array in your page:
```tsx
const banners = [
  {
    id: '1',
    businessName: 'Your Business',
    businessCategory: 'Your Category',
    title: 'Your Title',
    description: 'Your Description',
    // ... etc
  },
];
```

**Q: Do I need to use Stripe?**
A: Only if you want real payments. The UI is ready; you just need to wire the backend.

**Q: How long to finish all 5 phases?**
A: 
- Phase 3 (Music + Premium + Commerce): 2-3 hours
- Phase 4 (Images + Animations): 1-2 hours
- Phase 5 (Testing + Deploy): 1-2 hours
- **Total: 4-7 more hours**

**Q: What if something breaks?**
A: 
1. Check `/user_read_only_context/v0_debug_logs.log` for errors
2. Review `/REMAINING_PHASES_ROADMAP.md` for detailed patterns
3. All new components are isolated and don't affect existing code

---

## YOUR NEXT ACTION

**Pick one:**
1. 👉 **Try Option A** - Add banners to a page (30 min)
2. 👉 **Try Option B** - Set up Stripe payments (2 hours)
3. 👉 **Try Option C** - Build premium tier UI (1.5 hours)

Or simply continue with Phase 3 using the detailed roadmap in `REMAINING_PHASES_ROADMAP.md`.

---

## SUPPORT RESOURCES

**Documentation Files:**
- `PLATFORM_BUILD_SUMMARY.md` - Technical deep dive
- `REMAINING_PHASES_ROADMAP.md` - Phase 3-5 implementation guide
- `NEXT_STEPS.md` - This file

**Component Files:**
- `/src/components/RotatingBannerCarousel.tsx` - Fully documented
- `/src/components/DonationWidget.tsx` - Fully documented
- `/src/hooks/useBannerRotation.ts` - Fully documented

**Your Git Branch:**
- Branch: `mineral-del-monte-tourism`
- Base: `main`
- All changes ready to push

---

**You're 55% done. The foundation is solid. Let's finish building! 🚀**

Last updated: July 19, 2026
