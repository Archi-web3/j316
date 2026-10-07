import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Globe, BookOpen, Info, Download, Volume2, VolumeX } from 'lucide-react';
import InstallPromptModal from './InstallPromptModal';
import { isSoundEnabled, toggleSound, hapticLight, playPopSound, playChimeSound } from '../utils/soundAndHaptics';

export default function OptionsMenu({ isOpen, onClose, onOpenTutorial }) {
  const { t, i18n } = useTranslation();
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(() => isSoundEnabled());

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                zIndex: 90
              }}
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '80%',
                maxWidth: '300px',
                height: '100%',
                backgroundColor: '#ffffff',
                zIndex: 100,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '5px 0 15px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>{t('options.title')}</h2>
                <button onClick={onClose} style={{ color: 'var(--primary-dark)' }}><X size={28} /></button>
              </div>

              <button 
                onClick={toggleLanguage}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '1.5rem', padding: '0.5rem 0' }}
              >
                <Globe size={24} />
                {t('options.language')}: {i18n.language === 'fr' ? 'FR' : 'EN'}
              </button>

              <button 
                onClick={onOpenTutorial}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '1.5rem', padding: '0.5rem 0' }}
              >
                <BookOpen size={24} />
                {t('options.tutorial')}
              </button>

              <button 
                onClick={() => setIsInstallOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary-dark)', fontSize: '1.2rem', marginBottom: '1.5rem', padding: '0.5rem 0' }}
              >
                <Download size={24} />
                {t('options.install')}
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => {
                    const next = toggleSound();
                    setSoundActive(next);
                    hapticLight();
                    if (next) {
                      playChimeSound();
                    } else {
                      playPopSound();
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary-dark)', fontSize: '1.2rem', padding: '0.5rem 0', width: '100%' }}
                >
                  {soundActive ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  {t('options.sound')}: {soundActive ? (i18n.language === 'fr' ? 'Activé' : 'On') : (i18n.language === 'fr' ? 'Désactivé' : 'Off')}
                </button>
                {soundActive && (
                  <p style={{ margin: '0.2rem 0 0 2.5rem', fontSize: '0.78rem', color: '#666', lineHeight: 1.3 }}>
                    {t('options.sound_hint')}
                  </p>
                )}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontSize: '1rem' }}>
                  <Info size={18} />
                  <span>{t('options.about')}</span>
                </div>
                <a href="https://www.egliseboom.fr/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={`${import.meta.env.BASE_URL}logo_eglise_boom.png`} alt="Église Boom" style={{ width: '100px', objectFit: 'contain' }} />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <InstallPromptModal isOpen={isInstallOpen} onClose={() => setIsInstallOpen(false)} />
    </>
  );
}
