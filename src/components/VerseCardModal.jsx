import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Share2, RefreshCw, X, Check, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRandomVerse } from '../data/randomVerses';
import { playChimeSound, playPopSound, hapticLight, hapticSuccess } from '../utils/soundAndHaptics';

export default function VerseCardModal({ isOpen, onClose, friendName }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'fr';
  const isFr = lang === 'fr';

  const [verse, setVerse] = useState(() => getRandomVerse());
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVerse(getRandomVerse());
      setIsRevealed(false);
      setCopied(false);
    }
  }, [isOpen]);

  const handleReveal = () => {
    hapticSuccess();
    playChimeSound();
    setIsRevealed(true);
  };

  const handleShuffle = () => {
    hapticLight();
    playPopSound();
    let next = getRandomVerse();
    while (next.id === verse.id) {
      next = getRandomVerse();
    }
    setVerse(next);
  };

  const handleShare = async () => {
    hapticLight();
    const verseText = verse.text[lang];
    const verseRef = verse.ref[lang];
    const greeting = friendName ? (isFr ? `Pour ${friendName} : ` : `For ${friendName}: `) : '';
    const shareMessage = `${greeting}${verseText}\n— ${verseRef}\n\n✝️ J316 — Le Chemin vers l'Espérance\nhttps://archi-web3.github.io/j316/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `J316 — ${verseRef}`,
          text: shareMessage,
          url: 'https://archi-web3.github.io/j316/'
        });
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed share dialog
      }
    }

    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="verse-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
            key="verse-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '385px',
              backgroundColor: '#ffffff',
              borderRadius: '26px',
              padding: '1.75rem 1.5rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              color: '#1a1a2e',
              textAlign: 'center',
              position: 'relative',
              maxHeight: '88vh',
              overflowY: 'auto',
              margin: 'auto'
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#888',
                padding: '6px',
                borderRadius: '50%'
              }}
            >
              <X size={22} />
            </button>

            {/* Header Icon */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: '#3A41E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFD700',
              margin: '0 auto 0.75rem auto',
              boxShadow: '0 6px 16px rgba(58, 65, 232, 0.35)'
            }}>
              <Sparkles size={28} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111' }}>
              {isFr ? "Parole d'Encouragement" : "Word of Encouragement"}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 1.25rem 0' }}>
              {friendName ? (isFr ? `Une promesse pour ${friendName}` : `A promise for ${friendName}`) : (isFr ? "Ta promesse pour aujourd'hui" : "Your promise for today")}
            </p>

            {/* Card Body */}
            {!isRevealed ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReveal}
                style={{
                  background: 'linear-gradient(135deg, #3A41E8 0%, #202496 100%)',
                  borderRadius: '20px',
                  padding: '2.5rem 1.5rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(58, 65, 232, 0.3)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 215, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700'
                }}>
                  <Heart size={24} fill="#FFD700" />
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {isFr ? "Touche pour révéler" : "Tap to reveal"}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                  {isFr ? "Découvre le verset qui t'est destiné ✨" : "Discover the verse meant for you ✨"}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                style={{
                  background: 'linear-gradient(135deg, #FFFDF0 0%, #FFFFFF 100%)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: '2px solid #E5E071',
                  boxShadow: '0 8px 24px rgba(229, 224, 113, 0.25)',
                  textAlign: 'left'
                }}
              >
                {/* Theme Tag */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#3A41E8',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  marginBottom: '0.75rem'
                }}>
                  {verse.theme[lang]}
                </div>

                {/* Verse Text */}
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  color: '#1a1a2e',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  margin: '0 0 0.85rem 0'
                }}>
                  {verse.text[lang]}
                </p>

                {/* Reference */}
                <div style={{
                  textAlign: 'right',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#3A41E8'
                }}>
                  — {verse.ref[lang]}
                </div>
              </motion.div>
            )}

            {/* Actions when revealed */}
            {isRevealed && (
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
                <button
                  onClick={handleShuffle}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '14px',
                    border: '1px solid #ddd',
                    backgroundColor: '#F5F5FA',
                    color: '#333',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={16} />
                  {isFr ? "Autre verset" : "Another verse"}
                </button>

                <button
                  onClick={handleShare}
                  style={{
                    flex: 1.4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: '#3A41E8',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(58, 65, 232, 0.3)'
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={17} color="#34D399" />
                      {isFr ? "Copié !" : "Copied!"}
                    </>
                  ) : (
                    <>
                      <Share2 size={17} />
                      {isFr ? "Partager" : "Share"}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
