import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, PlusSquare, CheckCircle, Smartphone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function InstallPromptModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if already installed (standalone mode)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };
    checkInstalled();

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPWAInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        onClose();
      }
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="install-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflowY: 'auto'
          }}
        >
          <motion.div
            key="install-modal-card"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '380px',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
                color: '#1a1a2e',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                margin: 'auto'
              }}
            >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#3A41E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                  boxShadow: '0 4px 10px rgba(58, 65, 232, 0.3)'
                }}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#111' }}>
                    {isFr ? "Installer l'application" : "Install the App"}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                    {isFr ? "Sans passer par les stores" : "Directly without app stores"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#666',
                  borderRadius: '50%'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Content based on state */}
            {isInstalled ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                  {isFr ? "Application déjà installée !" : "App already installed!"}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  {isFr ? "Vous profitez déjà de l'expérience plein écran sur votre appareil." : "You are already using the full standalone app experience."}
                </p>
              </div>
            ) : isIOS ? (
              /* Instructions for iPhone / iPad Safari */
              <div>
                <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                  {isFr
                    ? "Sur iPhone / iPad, vous pouvez ajouter l'application en 3 étapes simples :"
                    : "On iPhone / iPad, you can install the app in 3 simple steps:"}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: '#F4F5FB', padding: '0.75rem 1rem', borderRadius: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3A41E8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                      1
                    </div>
                    <div style={{ fontSize: '0.88rem' }}>
                      {isFr ? (
                        <>Appuyez sur <Share size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Partager</strong> en bas de Safari</>
                      ) : (
                        <>Tap <Share size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Share</strong> in Safari menu</>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: '#F4F5FB', padding: '0.75rem 1rem', borderRadius: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3A41E8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                      2
                    </div>
                    <div style={{ fontSize: '0.88rem' }}>
                      {isFr ? (
                        <>Sélectionnez <PlusSquare size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Sur l'écran d'accueil</strong></>
                      ) : (
                        <>Select <PlusSquare size={15} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> <strong>Add to Home Screen</strong></>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: '#F4F5FB', padding: '0.75rem 1rem', borderRadius: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3A41E8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                      3
                    </div>
                    <div style={{ fontSize: '0.88rem' }}>
                      {isFr ? (
                        <>Confirmez en touchant <strong>Ajouter</strong> en haut à droite</>
                      ) : (
                        <>Confirm by tapping <strong>Add</strong> at top right</>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <button
                    onClick={onClose}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '14px',
                      backgroundColor: '#3A41E8',
                      color: '#ffffff',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                  >
                    {isFr ? "C'est compris !" : "Got it!"}
                  </button>
                </div>
              </div>
            ) : (
              /* Android or Desktop Chromium */
              <div>
                <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                  {isFr
                    ? "Installez l'application pour y accéder hors-ligne d'un simple toucher depuis votre écran d'accueil."
                    : "Install the app for instant offline access directly from your home screen."}
                </p>

                {(deferredPrompt || window.deferredPWAInstallPrompt) ? (
                  <button
                    onClick={handleInstallClick}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      padding: '0.9rem',
                      borderRadius: '14px',
                      backgroundColor: '#3A41E8',
                      color: '#ffffff',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      boxShadow: '0 4px 12px rgba(58, 65, 232, 0.35)'
                    }}
                  >
                    <Download size={20} />
                    {isFr ? "Installer maintenant" : "Install Now"}
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#F4F5FB', padding: '0.85rem 1rem', borderRadius: '14px', fontSize: '0.88rem', color: '#333' }}>
                      {isFr ? (
                        <>Appuyez sur le menu du navigateur (<strong>⋮</strong> en haut à droite) puis sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</>
                      ) : (
                        <>Open the browser menu (<strong>⋮</strong> at top right) and select <strong>« Install app »</strong> or <strong>« Add to Home screen »</strong>.</>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        borderRadius: '14px',
                        backgroundColor: '#3A41E8',
                        color: '#ffffff',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                      }}
                    >
                      {isFr ? "Fermer" : "Close"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
