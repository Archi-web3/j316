import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import Token from '../components/Token';
import { 
  ArrowLeft, ArrowRight, Home, Sun, Moon, ChevronDown, 
  Sparkles, Share2, BookOpen, ExternalLink, Check, Heart 
} from 'lucide-react';
import VerseCardModal from '../components/VerseCardModal';
import { 
  playPopSound, playChimeSound, playCelebrationSound, 
  hapticLight, hapticSuccess 
} from '../utils/soundAndHaptics';

const textVariants = {
  enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
};

const STORY_SEQUENCE = [
  'step_1', 'step_2', 'step_3', 'step_4', 'step_5', 
  'step_6', 'step_7', 'step_8', 'step_9', 'step_10',
  'step_14', 'step_15', 'step_16', 'step_17', 'step_18',
  'step_success', 'step_21'
];

const BASE = import.meta.env.BASE_URL;

// Specific steps to show drawings on, to avoid clutter and match the mockup
const STAMPS = {
  0: { src: `${BASE}stamp_creation.png`, offsetX: 0, offsetY: -12, width: 130 },
  5: { src: `${BASE}stamp_sin.png`, offsetX: 0, offsetY: -12, width: 140 },
  8: { src: `${BASE}stamp_grace.png`, offsetX: 0, offsetY: 12, width: 150 },
  12: { src: `${BASE}stamp_simple_cross.png`, offsetX: 0, offsetY: -12, width: 130 },
  16: { src: `${BASE}stamp_book.png`, offsetX: -12, offsetY: -12, width: 130 }
};

const PRAYER_SENTENCES = {
  fr: [
    "Cher Père céleste,",
    "Je reconnais que je suis pécheur et je te demande pardon.",
    "Je crois que Jésus-Christ est mort pour moi sur la croix et qu'Il est ressuscité.",
    "Je confesse que Jésus est mon Seigneur et mon Sauveur.",
    "Saint-Esprit, aide-moi à obéir et à suivre Dieu chaque jour.",
    "Transforme-moi de l'intérieur et donne-moi une vie nouvelle.",
    "Au nom de Jésus, amen !"
  ],
  en: [
    "Dear Heavenly Father,",
    "I admit that I am a sinner, and I ask for your forgiveness.",
    "I believe that Jesus Christ died for me on the cross and rose again.",
    "I confess that Jesus is my Lord and Savior.",
    "Holy Spirit, help me to obey and follow God each day.",
    "Transform me from the inside out and give me a new life.",
    "In the name of Jesus, amen!"
  ]
};

const totalSteps = 17;
const mapPoints = Array.from({ length: totalSteps }, (_, i) => {
  const progress = i / (totalSteps - 1); 
  const x = 50 + 35 * Math.sin(progress * Math.PI * 3); 
  const y = 78 - progress * 62; 
  return { x, y };
});

const svgPointsString = mapPoints.map(p => `${p.x},${p.y}`).join(' ');

export default function StoryStep({ stepKey, guideName, friendName, guideAvatar, friendAvatar, onNext, onPrev, direction, isLast, onGoHome }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'fr';
  const isFr = lang === 'fr';

  const [activeBubble, setActiveBubble] = useState(null);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Guided Prayer State
  const [isGuidedPrayer, setIsGuidedPrayer] = useState(true);
  const [prayerIndex, setPrayerIndex] = useState(0);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('story-theme') || 'dark';
  });

  const toggleTheme = () => {
    hapticLight();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('story-theme', newTheme);
  }; 

  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    setActiveBubble(null);
    setIsGuidedPrayer(true);
    setPrayerIndex(0);

    if (stepKey === 'step_success') {
      fireConfetti();
      playCelebrationSound();
      hapticSuccess();
      
      // Auto-save friend to journal if not already present
      try {
        const existing = JSON.parse(localStorage.getItem('j316-journal') || '[]');
        const targetName = friendName || (isFr ? 'Mon Ami(e)' : 'My Friend');
        if (!existing.some(e => e.name.toLowerCase() === targetName.toLowerCase())) {
          const newEntry = {
            id: Date.now(),
            name: targetName,
            note: isFr ? 'A dit OUI à Jésus à la croix ✨' : 'Accepted Jesus at the cross ✨',
            date: new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          };
          localStorage.setItem('j316-journal', JSON.stringify([newEntry, ...existing]));
        }
      } catch (e) {}
    }

    if (stepKey === 'step_10' || stepKey === 'step_18' || stepKey === 'step_21') {
      setIsCardCollapsed(false);
    }
  }, [stepKey, friendName, isFr]);

  const currentIndex = STORY_SEQUENCE.indexOf(stepKey); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeBubble || stepKey === 'step_10' || stepKey === 'step_18') return;
      if (e.key === 'ArrowRight' && !isLast) {
        hapticLight();
        playPopSound();
        onNext();
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        hapticLight();
        playPopSound();
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeBubble, stepKey, isLast, currentIndex, onNext, onPrev]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (activeBubble || stepKey === 'step_10' || stepKey === 'step_18') return;

    if (isLeftSwipe && !isLast) {
      hapticLight();
      playPopSound();
      onNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      hapticLight();
      playPopSound();
      onPrev();
    }
  };

  const isBubbleScreen = stepKey === 'step_10';
  const isDecisionScreen = stepKey === 'step_18';
  const isFinalStep = stepKey === 'step_21';

  const renderTextWithVerses = (text) => {
    return text.split('\n').map((line, i) => {
      const isVerse = /^(Jean|John|Romains|Romans) \d+:\d+/.test(line);
      return (
        <span 
          key={i} 
          style={{ 
            display: 'block', 
            marginBottom: i < text.split('\n').length - 1 ? '0.5rem' : '0',
            color: isVerse ? 'var(--primary)' : 'inherit',
            fontWeight: isVerse ? 'bold' : 'normal',
            fontSize: isVerse ? '0.95rem' : 'inherit'
          }}
        >
          {line}
        </span>
      );
    });
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FFFFFF', '#3A41E8'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFD700', '#FFFFFF', '#3A41E8'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleChoice = (choice) => {
    if (choice === 'yes') {
      hapticSuccess();
      playCelebrationSound();
      setActiveBubble('step_19');
      setIsGuidedPrayer(true);
      setPrayerIndex(0);
    } else {
      hapticLight();
      playPopSound();
      setActiveBubble('step_20');
    }
  };

  const handleNextPrayerSentence = () => {
    hapticLight();
    playPopSound();
    const sentences = PRAYER_SENTENCES[lang];
    if (prayerIndex < sentences.length - 1) {
      setPrayerIndex(prev => prev + 1);
    } else {
      hapticSuccess();
      playCelebrationSound();
      onNext();
    }
  };

  const handleShareSummary = async () => {
    hapticLight();
    const friend = friendName || (isFr ? 'mon ami' : 'my friend');
    const msg = isFr
      ? `✝️ J316 — Félicitations ${friend} pour cette étape franchie avec Dieu aujourd'hui !\n\n📖 « Car Dieu a tant aimé le monde qu'il a donné son Fils unique... » (Jean 3:16)\n\nDécouvre le parcours interactif : https://archi-web3.github.io/j316/`
      : `✝️ J316 — Congratulations ${friend} for taking this step with God today!\n\n📖 “For God so loved the world that he gave his one and only Son...” (John 3:16)\n\nExplore the interactive guide: https://archi-web3.github.io/j316/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'J316 — Le Chemin vers l\'Espérance',
          text: msg,
          url: 'https://archi-web3.github.io/j316/'
        });
        return;
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(msg);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch (e) {}
  };

  const sentences = PRAYER_SENTENCES[lang];

  return (
    <div 
      data-theme={theme}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', overflow: 'hidden', position: 'relative' }}
    >
      {/* TOP NAVIGATION BAR */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 50, display: 'flex', gap: '0.8rem' }}>
        <button 
          onClick={() => {
            hapticLight();
            playPopSound();
            if (activeBubble) {
              setActiveBubble(null);
            } else if (currentIndex > 0) {
              onPrev();
            } else {
              onGoHome();
            }
          }}
          title={isFr ? "Retour" : "Back"}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: 'none', 
            color: 'var(--text-main)',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <button 
          onClick={() => {
            hapticLight();
            playPopSound();
            onGoHome();
          }}
          title={isFr ? "Accueil" : "Home"}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            border: 'none', 
            color: 'var(--text-main)',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
          }}
        >
          <Home size={20} />
        </button>
      </div>

      {/* THEME TOGGLE BUTTON */}
      <button 
        onClick={toggleTheme} 
        style={{ 
          position: 'absolute', 
          top: '1.5rem', 
          right: '4.5rem', 
          zIndex: 50, 
          background: 'rgba(255,255,255,0.2)', 
          border: 'none', 
          color: 'var(--text-main)',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* MAP SVG & TOKENS */}
      <div style={{ flex: 1, position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <polyline points={svgPointsString} fill="none" stroke="var(--path-color)" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.8" />
          {mapPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i <= currentIndex ? "1.5" : "1"} fill={i <= currentIndex ? 'var(--accent)' : 'rgba(255,255,255,0.3)'} />
          ))}
        </svg>

        {/* Small Drawings next to specific steps */}
        <AnimatePresence>
          {Object.entries(STAMPS).map(([indexStr, stamp]) => {
            const index = parseInt(indexStr, 10);
            if (currentIndex >= index) {
              const p = mapPoints[index];
              const offsetX = stamp.offsetX || 0;
              const offsetY = stamp.offsetY || 0;
              
              return (
                <motion.img 
                  key={`stamp-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: index === 20 ? 1 : 0.8, scale: 1 }} 
                  transition={{ duration: 0.8 }}
                  src={stamp.src} 
                  style={{ 
                    position: 'absolute', 
                    left: `${p.x + offsetX}%`, 
                    top: `${p.y + offsetY}%`, 
                    width: `${stamp.width}px`, 
                    transform: 'translate(-50%, -50%)', 
                    pointerEvents: 'none', 
                    filter: 'var(--image-filter)',
                    mixBlendMode: 'var(--image-blend)'
                  }} 
                  alt="" 
                />
              )
            }
            return null;
          })}
        </AnimatePresence>

        {/* Moving Tokens */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {currentIndex >= 0 && currentIndex < mapPoints.length && (
            <>
              {/* Guide Token */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                style={{
                  position: 'absolute',
                  left: `${mapPoints[currentIndex].x}%`,
                  top: `${mapPoints[currentIndex].y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 10
                }}
              >
                <div style={{ transform: 'translate(-14px, -14px)' }}>
                  <Token type={guideAvatar} size={30} isGuide={true} />
                </div>
                {guideName && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--text-main)', 
                    backgroundColor: 'rgba(0,0,0,0.4)', 
                    padding: '1px 5px', 
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    marginTop: '-8px'
                  }}>
                    {guideName}
                  </span>
                )}
              </motion.div>

              {/* Friend Token */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.08 }}
                style={{
                  position: 'absolute',
                  left: `${mapPoints[currentIndex].x}%`,
                  top: `${mapPoints[currentIndex].y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 9
                }}
              >
                <div style={{ transform: 'translate(14px, 14px)' }}>
                  <Token type={friendAvatar} size={30} isGuide={false} />
                </div>
                {friendName && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--text-main)', 
                    backgroundColor: 'rgba(0,0,0,0.4)', 
                    padding: '1px 5px', 
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    marginTop: '20px'
                  }}>
                    {friendName}
                  </span>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* BOTTOM CARD: CONTENT AREA */}
      <div style={{ position: 'relative', width: '100%', zIndex: 40 }}>
        <motion.div 
          animate={{ height: isCardCollapsed ? '48px' : 'auto' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderTopLeftRadius: '32px', 
            borderTopRightRadius: '32px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.18)',
            padding: isCardCollapsed ? '0.6rem 1.5rem' : '1.25rem 1.5rem 1.25rem 1.5rem',
            border: '2px solid var(--card-border)',
            borderBottom: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '62vh'
          }}
        >
          {isCardCollapsed ? (
            <div 
              onClick={() => setIsCardCollapsed(false)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', height: '100%' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--card-text)' }}>
                {t('story.swipe')} — Étape {currentIndex + 1} / {STORY_SEQUENCE.length}
              </span>
              <button style={{ background: 'none', border: 'none', color: 'var(--card-text)', cursor: 'pointer' }}>
                <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          ) : (
            <>
              {/* Card Controls Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                {activeBubble ? (
                  <button 
                    onClick={() => {
                      hapticLight();
                      playPopSound();
                      setActiveBubble(null);
                    }} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      color: 'var(--card-text)', 
                      fontWeight: 'bold', 
                      fontSize: '0.85rem',
                      background: 'rgba(0,0,0,0.08)',
                      padding: '4px 10px',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <ArrowLeft size={15} /> {t('story.btn_back_bubbles')}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      hapticLight();
                      playPopSound();
                      onPrev();
                    }} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      color: 'var(--card-text)', 
                      fontWeight: 'bold', 
                      fontSize: '0.85rem',
                      background: 'rgba(0,0,0,0.08)',
                      padding: '4px 10px',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <ArrowLeft size={15} /> {t('story.btn_back')}
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--card-text)', opacity: 0.65 }}>
                    {currentIndex + 1} / {STORY_SEQUENCE.length}
                  </span>
                  <button 
                    onClick={() => setIsCardCollapsed(true)} 
                    title={isFr ? "Réduire pour admirer tout le parcours" : "Collapse"}
                    style={{ 
                      background: 'rgba(0,0,0,0.08)', 
                      border: 'none', 
                      color: 'var(--card-text)', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    <ChevronDown size={15} />
                  </button>
                </div>
              </div>

              {/* CARD TEXT / INTERACTION CONTAINER */}
              <div style={{ overflowY: 'auto', maxHeight: '45vh', paddingRight: '2px' }}>
                <AnimatePresence mode="wait" custom={direction}>
                  {!activeBubble ? (
                    <motion.div 
                      key={`text-${stepKey}`} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'tween', duration: 0.25 }}
                      style={{ minHeight: '65px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                      <h2 style={{ fontSize: '1.15rem', textAlign: 'center', lineHeight: '1.45', color: 'var(--card-text)', margin: '0 0 1rem 0', fontWeight: '500' }}>
                        {renderTextWithVerses(t(`story.${stepKey}`, { friendName: friendName || 'Friend', guideName: guideName || 'Guide' }))}
                      </h2>

                      {/* Bubble Screen 10 */}
                      {isBubbleScreen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticLight(); playPopSound(); setActiveBubble('step_11'); }} style={{ padding: '0.75rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 3px 10px rgba(58,65,232,0.25)' }}>
                            🏆 {t('story.bubble_success')}
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticLight(); playPopSound(); setActiveBubble('step_12'); }} style={{ padding: '0.75rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 3px 10px rgba(58,65,232,0.25)' }}>
                            🤝 {t('story.bubble_good')}
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => { hapticLight(); playPopSound(); setActiveBubble('step_13'); }} style={{ padding: '0.75rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 3px 10px rgba(58,65,232,0.25)' }}>
                            ⛪ {t('story.bubble_religion')}
                          </motion.button>

                          {/* Direct Continue Button if user wants to proceed directly */}
                          <motion.button 
                            whileTap={{ scale: 0.96 }} 
                            onClick={() => { 
                              hapticLight(); 
                              playPopSound(); 
                              onNext(); 
                            }} 
                            style={{ 
                              marginTop: '0.35rem',
                              padding: '0.65rem 1rem', 
                              borderRadius: '20px', 
                              backgroundColor: 'rgba(255,255,255,0.08)', 
                              border: '1.5px solid var(--primary)', 
                              color: 'var(--card-text)', 
                              fontWeight: '600', 
                              fontSize: '0.88rem', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <span>{t('story.continue_journey')}</span>
                            <ArrowRight size={16} />
                          </motion.button>
                        </div>
                      )}

                      {/* Decision Screen 18 */}
                      {isDecisionScreen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleChoice('yes')} style={{ padding: '0.75rem 1rem', borderRadius: '22px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(58, 65, 232, 0.35)' }}>{t('story.btn_yes')}</motion.button>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleChoice('no')} style={{ padding: '0.75rem 1rem', borderRadius: '22px', backgroundColor: 'transparent', border: '2px solid var(--card-text)', color: 'var(--card-text)', fontWeight: 'bold', fontSize: '0.95rem' }}>{t('story.btn_no')}</motion.button>
                        </div>
                      )}

                      {/* FINAL STEP 21: INTERACTIVE ACTION CARDS */}
                      {isFinalStep && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', marginTop: '0.5rem' }}>
                          
                          {/* Reveal Random Promise Verse */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              hapticLight();
                              playPopSound();
                              setIsVerseModalOpen(true);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.8rem 1rem',
                              borderRadius: '16px',
                              backgroundColor: 'var(--primary)',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              boxShadow: '0 4px 14px rgba(58, 65, 232, 0.35)',
                              cursor: 'pointer'
                            }}
                          >
                            <Sparkles size={18} color="#FFD700" />
                            {t('options.random_verse')}
                          </motion.button>

                          {/* Church Boom */}
                          <a
                            href="https://www.egliseboom.fr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.7rem 1rem',
                              borderRadius: '16px',
                              backgroundColor: '#ffffff',
                              color: '#111',
                              border: '1.5px solid #E0E2F0',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              textDecoration: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                          >
                            <ExternalLink size={16} color="#3A41E8" />
                            {t('options.church_boom')}
                          </a>

                          {/* Gospel of Luke (Bible.com) */}
                          <a
                            href={isFr ? "https://www.bible.com/bible/176/LUK.1.LSG" : "https://www.bible.com/bible/111/LUK.1.NIV"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.7rem 1rem',
                              borderRadius: '16px',
                              backgroundColor: '#ffffff',
                              color: '#111',
                              border: '1.5px solid #E0E2F0',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              textDecoration: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                          >
                            <BookOpen size={16} color="#3A41E8" />
                            {t('options.read_luke')}
                          </a>

                          {/* Share with friend */}
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleShareSummary}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              padding: '0.7rem 1rem',
                              borderRadius: '16px',
                              backgroundColor: 'transparent',
                              color: 'var(--card-text)',
                              border: '1.5px solid var(--card-text)',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer'
                            }}
                          >
                            {copiedSummary ? <Check size={16} color="#10B981" /> : <Share2 size={16} />}
                            {copiedSummary ? (isFr ? "Message copié !" : "Copied!") : t('options.share_summary')}
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ) : activeBubble === 'step_19' ? (
                    /* GUIDED STEP-BY-STEP PRAYER */
                    <motion.div key="guided-prayer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                          {isFr ? "Prière d'Engagement" : "Prayer of Commitment"}
                        </span>
                        <button
                          onClick={() => {
                            hapticLight();
                            setIsGuidedPrayer(!isGuidedPrayer);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--card-text)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textDecoration: 'underline',
                            cursor: 'pointer'
                          }}
                        >
                          {isGuidedPrayer ? t('options.prayer_full') : t('options.prayer_step_by_step')}
                        </button>
                      </div>

                      {isGuidedPrayer ? (
                        <div>
                          {/* Progress Dots */}
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '0.8rem' }}>
                            {sentences.map((_, i) => (
                              <div
                                key={i}
                                style={{
                                  width: i === prayerIndex ? '20px' : '7px',
                                  height: '7px',
                                  borderRadius: '4px',
                                  backgroundColor: i <= prayerIndex ? 'var(--primary)' : 'rgba(0,0,0,0.15)',
                                  transition: 'all 0.25s'
                                }}
                              />
                            ))}
                          </div>

                          {/* Sentence Display */}
                          <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            padding: '1.25rem 1rem',
                            textAlign: 'center',
                            minHeight: '85px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            margin: '0.25rem 0 0.85rem 0'
                          }}>
                            <p style={{
                              fontSize: '1.15rem',
                              fontWeight: 700,
                              color: '#1a1a2e',
                              lineHeight: 1.45,
                              margin: 0
                            }}>
                              {sentences[prayerIndex]}
                            </p>
                          </div>

                          {/* Next Sentence Button */}
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={handleNextPrayerSentence}
                            style={{
                              width: '100%',
                              padding: '0.8rem',
                              borderRadius: '18px',
                              backgroundColor: 'var(--primary)',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(58, 65, 232, 0.3)'
                            }}
                          >
                            {prayerIndex < sentences.length - 1 ? t('options.next_phrase') : t('options.finish_prayer')}
                          </motion.button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: '1rem', lineHeight: 1.5, color: 'var(--card-text)', fontWeight: 500, margin: '0 0 1rem 0' }}>
                            {renderTextWithVerses(t('story.step_19'))}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    /* Other Bubbles (e.g., step 11, 12, 13, 20) */
                    <motion.div key={`bubble-${activeBubble}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '65px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {/* Bubble Badge on Step 10 */}
                      {isBubbleScreen && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 800, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            color: 'var(--primary)',
                            backgroundColor: 'rgba(58, 65, 232, 0.12)',
                            padding: '4px 14px',
                            borderRadius: '12px'
                          }}>
                            {activeBubble === 'step_11' && `🏆 ${t('story.bubble_success')}`}
                            {activeBubble === 'step_12' && `🤝 ${t('story.bubble_good')}`}
                            {activeBubble === 'step_13' && `⛪ ${t('story.bubble_religion')}`}
                          </span>
                        </div>
                      )}

                      <h2 style={{ fontSize: '1.15rem', textAlign: 'center', lineHeight: '1.45', color: 'var(--card-text)', margin: '0 0 1.25rem 0', fontWeight: '500' }}>
                        {renderTextWithVerses(t(`story.${activeBubble}`))}
                      </h2>

                      {/* Bubble Action Buttons for Step 10 */}
                      {isBubbleScreen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', marginTop: '0.25rem' }}>
                          <motion.button 
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              hapticLight();
                              playPopSound();
                              onNext();
                            }}
                            style={{ 
                              padding: '0.8rem 1rem', 
                              borderRadius: '22px', 
                              backgroundColor: 'var(--primary)', 
                              border: 'none', 
                              color: '#ffffff', 
                              fontWeight: 'bold', 
                              fontSize: '0.98rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              boxShadow: '0 4px 15px rgba(58, 65, 232, 0.35)',
                              cursor: 'pointer'
                            }}
                          >
                            <span>{t('story.continue_journey')}</span>
                            <ArrowRight size={18} />
                          </motion.button>

                          <motion.button 
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              hapticLight();
                              playPopSound();
                              setActiveBubble(null);
                            }}
                            style={{ 
                              padding: '0.65rem 1rem', 
                              borderRadius: '20px', 
                              backgroundColor: 'transparent', 
                              border: '1.5px solid var(--card-text)', 
                              color: 'var(--card-text)', 
                              fontWeight: '600', 
                              fontSize: '0.88rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              cursor: 'pointer'
                            }}
                          >
                            <ArrowLeft size={16} />
                            <span>{t('story.btn_back_bubbles')}</span>
                          </motion.button>
                        </div>
                      )}

                      {/* Finish button if step_20 */}
                      {activeBubble === 'step_20' && (
                        <motion.button 
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            hapticLight();
                            playPopSound();
                            onGoHome();
                          }}
                          style={{ 
                            padding: '0.75rem 1rem', 
                            borderRadius: '20px', 
                            backgroundColor: 'var(--primary)', 
                            border: 'none', 
                            color: '#ffffff', 
                            fontWeight: 'bold', 
                            fontSize: '0.95rem',
                            marginTop: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          {isFr ? "Terminer & Retour à l'accueil" : "Finish & Go Home"}
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MAIN CONTINUE BUTTON (White Pill with Arrow) */}
              {!isDecisionScreen && !(activeBubble === 'step_19' && isGuidedPrayer) && (
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    hapticLight();
                    playPopSound();
                    if (activeBubble) {
                      if (activeBubble === 'step_20') {
                        onGoHome();
                      } else {
                        onNext();
                      }
                    } else if (!isLast) {
                      onNext();
                    } else {
                      onGoHome();
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '25px', 
                    color: 'var(--primary-dark)', 
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    marginTop: '0.6rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowRight size={22} strokeWidth={2.5} />
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* VERSE CARD MODAL */}
      <VerseCardModal 
        isOpen={isVerseModalOpen} 
        onClose={() => setIsVerseModalOpen(false)} 
        friendName={friendName} 
      />

    </div>
  );
}
