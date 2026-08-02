'use client';
import React, { useState } from 'react';
import { ActivePillar, Product, CartItem } from './types';
import { Header } from './components/Header';
import { PillarTabs } from './components/PillarTabs';
import { Footer } from './components/Footer';
import { TouristMainShowcase } from './components/TouristMainShowcase';
import { InfoMeshPillar } from './components/InfoMeshPillar';
import { GeoExplorerPillar } from './components/GeoExplorerPillar';
import { TradeNodePillar } from './components/TradeNodePillar';
import { IsabellaAiChat } from './components/IsabellaAiChat';
import { TamvKernelView } from './components/TamvKernelView';
import { ReadinessGovernanceView } from './components/ReadinessGovernanceView';
import { DesignSystemManual } from './components/DesignSystemManual';
import { GastronomyModule } from './components/GastronomyModule';
import { ServicesModule } from './components/ServicesModule';
import { ForumModule } from './components/ForumModule';
import { UserProfileModule } from './components/UserProfileModule';
import { BusinessOnboardingModule } from './components/BusinessOnboardingModule';
import { NativeStoreModule } from './components/NativeStoreModule';
import { MembershipsModule } from './components/MembershipsModule';
import { AdsModule } from './components/AdsModule';
import { FullScreenMapModule } from './components/FullScreenMapModule';
import { MediaPodcastModule } from './components/MediaPodcastModule';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { CartModal } from './components/CartModal';
import { WorkspaceChatMeetModule } from './components/WorkspaceChatMeetModule';
import { OnlinePaymentGateway } from './components/OnlinePaymentGateway';
import { DonationModal } from './components/DonationModal';

export default function App() {
  const [activePillar, setActivePillar] = useState<ActivePillar>('tourist-showcase');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950 relative">
      {/* Navigation Header */}
      <Header
        activePillar={activePillar}
        setActivePillar={setActivePillar}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
      />

      {/* Pillar Tabs Bar (Organized into 4 Planes/Tiers) */}
      <PillarTabs activePillar={activePillar} setActivePillar={setActivePillar} />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activePillar === 'tourist-showcase' && (
          <TouristMainShowcase onNavigateToTab={(p) => setActivePillar(p as ActivePillar)} />
        )}
        {activePillar === 'info' && <InfoMeshPillar />}
        {activePillar === 'turismo' && <GeoExplorerPillar />}
        {activePillar === 'gastronomia' && <GastronomyModule />}
        {activePillar === 'cultura' && <GeoExplorerPillar />}
        {activePillar === 'comercio' && (
          <TradeNodePillar
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
        {activePillar === 'tienda' && <NativeStoreModule onAddToCart={handleAddToCart} />}
        {activePillar === 'pagos-p2p' && <OnlinePaymentGateway />}
        {activePillar === 'servicios' && <ServicesModule />}
        {activePillar === 'media' && <MediaPodcastModule />}
        {activePillar === 'foro' && <ForumModule />}
        {activePillar === 'perfil' && <UserProfileModule />}
        {activePillar === 'onboarding' && <BusinessOnboardingModule />}
        {activePillar === 'mapa' && <FullScreenMapModule />}
        {activePillar === 'membresias' && <MembershipsModule />}
        {activePillar === 'publicidad' && <AdsModule />}
        {activePillar === 'isabella' && <IsabellaAiChat />}
        {activePillar === 'chat-meet' && <WorkspaceChatMeetModule />}
        {activePillar === 'kernel' && <TamvKernelView />}
        {activePillar === 'readiness' && <ReadinessGovernanceView />}
        {activePillar === 'manual' && <DesignSystemManual />}
      </main>

      {/* Footer */}
      <Footer onOpenDonation={() => setIsDonationOpen(true)} />

      {/* Floating ISABELLA AI Assistant (Always accessible) */}
      <FloatingAiAssistant />

      {/* Cattleya Pay Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* Donation Modal (Accessible on every page) */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </div>
  );
}


