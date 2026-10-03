import React, { useState, useEffect } from 'react';
import { useAuriumState } from './hooks/useAuriumState';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LiveNodeStatusCard } from './components/LiveNodeStatusCard';
import { EmissionHalvingCard } from './components/EmissionHalvingCard';
import { PresaleCard } from './components/PresaleCard';
import { PresaleDepositModal } from './components/PresaleDepositModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { StepGuide } from './components/StepGuide';
import { RoadmapSection } from './components/RoadmapSection';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SupabaseAuthModal } from './components/SupabaseAuthModal';
import { NotFoundPage } from './components/NotFoundPage';
import { ParticleNetworkCanvas } from './components/ParticleNetworkCanvas';
import { Footer } from './components/Footer';

export default function App() {
  const {
    state,
    isConnected,
    lastSyncTime,
    updateToggles,
    updatePresaleConfig,
    updateAddresses,
    updateApk,
    triggerHalvingCut,
    updateHalvingParams,
    updateHalvingDate,
    handleTxidAction,
    submitDepositTxid,
    resetToDefaults,
  } = useAuriumState();

  const auth = useSupabaseAuth();

  const [activeView, setActiveView] = useState<'public' | 'admin' | '404'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isPresaleModalOpen, setIsPresaleModalOpen] = useState<boolean>(false);

  // Check URL pathname and query params for secret vault gateway or 404 cloaking
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const search = window.location.search;

      // Secret Admin Portal Access: ONLY opens when visiting with ?gate=aurium_vault_9x72
      if (search.includes('gate=aurium_vault_9x72')) {
        if (!isAdminAuthenticated) {
          setIsLoginModalOpen(true);
        } else {
          setActiveView('admin');
        }
      } else if (path.includes('/admin')) {
        // /admin Route Cloaking: MUST immediately render standard "404 - This page doesn't exist" screen
        setActiveView('404');
        setIsLoginModalOpen(false);
      } else {
        setActiveView('public');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, [isAdminAuthenticated]);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginModalOpen(false);
    setActiveView('admin');
  };

  const handleBackToPublic = () => {
    setActiveView('public');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="min-h-screen bg-[#090C10] text-[#F0F6FC] selection:bg-[#F5A623]/30 selection:text-[#F5A623] relative">
      {/* GPU-Accelerated Animated Dark-Luxury DePIN Particle Canvas */}
      <ParticleNetworkCanvas />

      {/* Header with Direct APK Download & Supabase/Web3 Auth */}
      <Header
        state={state}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        auth={auth}
        activeView={activeView}
        setActiveView={handleBackToPublic}
        isConnected={isConnected}
      />

      {/* Main View Switcher */}
      {activeView === 'admin' && isAdminAuthenticated ? (
        <AdminPanel
          state={state}
          onBackToPublic={handleBackToPublic}
          updateToggles={updateToggles}
          updatePresaleConfig={updatePresaleConfig}
          updateAddresses={updateAddresses}
          updateApk={updateApk}
          triggerHalvingCut={triggerHalvingCut}
          updateHalvingParams={updateHalvingParams}
          updateHalvingDate={updateHalvingDate}
          handleTxidAction={handleTxidAction}
          submitDepositTxid={submitDepositTxid}
          resetToDefaults={resetToDefaults}
          isConnected={isConnected}
          lastSyncTime={lastSyncTime}
        />
      ) : activeView === '404' ? (
        <NotFoundPage onBackToHome={handleBackToPublic} />
      ) : (
        <main className="relative z-10">
          {/* Hero Section */}
          <HeroSection
            state={state}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenPresaleModal={() => setIsPresaleModalOpen(true)}
          />

          {/* Core Interactive Triad Section with Generous Breathing Room */}
          <section className="py-4 sm:py-10 relative z-10 w-full max-w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 1. Live Node Status Card */}
                <LiveNodeStatusCard
                  state={state}
                  onOpenApkModal={() => setIsApkModalOpen(true)}
                />

                {/* 2. Emission Halving Countdown Card with Responsive Circular Orbital Gauge */}
                <EmissionHalvingCard state={state} />

                {/* 3. 75% Presale Progress Card */}
                <PresaleCard
                  state={state}
                  onOpenPresaleModal={() => setIsPresaleModalOpen(true)}
                />
              </div>
            </div>
          </section>

          {/* 3-Step Guide */}
          <StepGuide
            state={state}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenPresaleModal={() => setIsPresaleModalOpen(true)}
          />

          {/* Expanded Luxury Roadmap (Milestone Suspense Timeline) */}
          <RoadmapSection />

          {/* Footer without any visible admin hints */}
          <Footer
            state={state}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        </main>
      )}

      {/* Modals */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        apk={state.apk}
      />

      <PresaleDepositModal
        isOpen={isPresaleModalOpen}
        onClose={() => setIsPresaleModalOpen(false)}
        state={state}
        onSubmitTxid={submitDepositTxid}
      />

      {/* Supabase & Web3 Identity Auth Modal */}
      <SupabaseAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        auth={auth}
      />

      {/* Secret Vault Protected Admin Login Modal (only accessed via ?gate=aurium_vault_9x72) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          handleBackToPublic();
        }}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
