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
import { MobileAppContainer } from './components/MobileAppContainer';
import { Footer } from './components/Footer';

export default function App() {
  const {
    state,
    isConnected,
    lastSyncTime,
    updateToggles,
    updateAddresses,
    updateApk,
    triggerHalvingCut,
    updateHalvingDate,
    handleTxidAction,
    submitDepositTxid,
    resetToDefaults,
  } = useAuriumState();

  const auth = useSupabaseAuth();

  const [activeView, setActiveView] = useState<'public' | 'admin' | 'app'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isPresaleModalOpen, setIsPresaleModalOpen] = useState<boolean>(false);

  // Check URL pathname and query params for /admin or ?view=admin or ?view=app routing
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const search = window.location.search;

      if (path.includes('/admin') || search.includes('view=admin')) {
        if (!isAdminAuthenticated) {
          setIsLoginModalOpen(true);
        } else {
          setActiveView('admin');
        }
      } else if (search.includes('view=app') || path.includes('/app')) {
        setActiveView('app');
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
    window.history.pushState({}, '', '/admin');
  };

  const handleOpenAdmin = () => {
    if (!isAdminAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      setActiveView('admin');
      window.history.pushState({}, '', '/admin');
    }
  };

  const handleLaunchApp = () => {
    setActiveView('app');
    window.history.pushState({}, '', '/?view=app');
  };

  const handleBackToPublic = () => {
    setActiveView('public');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="min-h-screen bg-[#090C10] text-[#F0F6FC] selection:bg-[#F5A623]/30 selection:text-[#F5A623]">
      {/* Header with Launch App, Admin Quick Switcher, & Supabase Auth integration */}
      <Header
        state={state}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLaunchApp={handleLaunchApp}
        onOpenAdmin={handleOpenAdmin}
        auth={auth}
        activeView={activeView}
        setActiveView={handleBackToPublic}
        isConnected={isConnected}
      />

      {/* Main View Switcher */}
      {activeView === 'admin' ? (
        <AdminPanel
          state={state}
          onBackToPublic={handleBackToPublic}
          updateToggles={updateToggles}
          updateAddresses={updateAddresses}
          updateApk={updateApk}
          triggerHalvingCut={triggerHalvingCut}
          updateHalvingDate={updateHalvingDate}
          handleTxidAction={handleTxidAction}
          submitDepositTxid={submitDepositTxid}
          resetToDefaults={resetToDefaults}
          isConnected={isConnected}
          lastSyncTime={lastSyncTime}
        />
      ) : activeView === 'app' ? (
        <MobileAppContainer
          state={state}
          onBackToLanding={handleBackToPublic}
          onOpenPresaleModal={() => setIsPresaleModalOpen(true)}
          auth={auth}
        />
      ) : (
        <main>
          {/* Hero Section */}
          <HeroSection
            state={state}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenPresaleModal={() => setIsPresaleModalOpen(true)}
          />

          {/* Core Interactive Triad Section with Generous Breathing Room */}
          <section className="py-6 sm:py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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

          {/* Footer with Developer Admin Portal trigger */}
          <Footer
            state={state}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onOpenAdmin={handleOpenAdmin}
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

      {/* Protected Admin Access Modal triggered by direct /admin path */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (activeView === 'admin') {
            handleBackToPublic();
          } else {
            window.history.pushState({}, '', '/');
          }
        }}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
