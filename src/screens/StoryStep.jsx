import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import Token from '../components/Token';
import { ArrowLeft, ArrowRight, Home, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';

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

const totalSteps = 17;
const mapPoints = Array.from({ length: totalSteps }, (_, i) => {
  // Creating a nice winding path that starts from bottom and goes up
  const progress = i / (totalSteps - 1); 
  const x = 50 + 35 * Math.sin(progress * Math.PI * 3); 
  const y = 78 - progress * 62; // From 78% up to 16% (gives space for the card at bottom)
  return { x, y };
});

const svgPointsString = mapPoints.map(p => `${p.x},${p.y}`).join(' ');

export default function StoryStep({ stepKey, guideName, friendName, guideAvatar, friendAvatar, onNext, onPrev, direction, isLast, onGoHome }) {
  const { t } = useTranslation();
  const [activeBubble, setActiveBubble] = useState(null);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('story-theme') || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('story-theme', newTheme);
  }; 
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    setActiveBubble(null);
    if (stepKey === 'step_success') {
      fireConfetti();
    }
    // Auto-expand card on interactive bubble/choice steps so user sees options
    if (stepKey === 'step_10' || stepKey === 'step_18') {
      setIsCardCollapsed(false);
    }
  }, [stepKey]);

  const currentIndex = STORY_SEQUENCE.indexOf(stepKey); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeBubble || stepKey === 'step_10' || stepKey === 'step_18') return;
      if (e.key === 'ArrowRight' && !isLast) onNext();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onPrev();
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
    
    // Disable swipe if bubble is active or on decision screen to force button press
    if (activeBubble || stepKey === 'step_10' || stepKey === 'step_18') return;

    if (isLeftSwipe && !isLast) onNext();
    if (isRightSwipe && currentIndex > 0) onPrev();
  };

  const isBubbleScreen = stepKey === 'step_10';
  const isDecisionScreen = stepKey === 'step_18';

  const renderTextWithVerses = (text) => {
    return text.split('\n').map((line, i) => {
      const isVerse = /^(Jean|John|Romains|Romans) \d+:\d+/.test(line);
      return (
        <span key={i} style={{ color: isVerse ? 'var(--primary)' : 'inherit', display: 'block', marginTop: i > 0 ? '0.5rem' : 0 }}>
          {line}
        </span>
      );
    });
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FFFFFF', '#27408B'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFD700', '#FFFFFF', '#27408B'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleChoice = (choice) => {
    if (choice === 'yes') {
      setActiveBubble('step_19');
    } else {
      setActiveBubble('step_20');
    }
  };

  return (
    <div 
      data-theme={theme}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', overflow: 'hidden', position: 'relative' }}
    >
      
      {/* TOP HEADER */}
      <div style={{ paddingTop: '3rem', textAlign: 'center', zIndex: 10 }}>
         <h1 className="title-font" style={{ color: 'var(--text-main)', fontSize: '1.6rem', letterSpacing: '2px', margin: 0, textShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.5)' : 'none' }}>
          {stepKey === 'step_21' ? t('story.book_of_life_title') : t('story.journey_title')}
        </h1>
      </div>

      {/* TOP LEFT NAVIGATION: BACK & HOME */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 50, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button 
          onClick={activeBubble ? () => setActiveBubble(null) : onPrev} 
          title={t('story.btn_back')}
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
          onClick={onGoHome} 
          title="Accueil"
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

      {/* THEME BUTTON */}
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

        {/* Removed Labels for steps as requested */}
        {/* Moving Tokens */}
        <motion.div
          animate={{ left: `${mapPoints[currentIndex].x}%`, top: `${mapPoints[currentIndex].y}%` }}
          transition={{ type: 'spring', stiffness: 40, damping: 12 }}
          style={{ position: 'absolute', zIndex: 20 }}
        >
          {/* Guide Token (Above the path) */}
          <div style={{ position: 'absolute', transform: 'translate(-50%, -100%)', top: '-5px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
            <Token iconName={guideAvatar} color="var(--accent)" size={35} isActive={!activeBubble} />
          </div>
          {/* Friend Token (Below the path) */}
          {friendAvatar && (
            <div style={{ position: 'absolute', transform: 'translate(-50%, 0)', top: '5px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
              <Token iconName={friendAvatar} color="var(--text-main)" size={35} isActive={!activeBubble} />
            </div>
          )}
        </motion.div>
      </div>

      {/* BOTTOM CARD (Floating transparent bordered card with collapsible mode) */}
      <div style={{ padding: '0 1rem 1rem 1rem', zIndex: 30 }}>
        <motion.div 
          layout
          style={{ 
            border: '2px solid var(--card-border)', 
            borderRadius: '24px', 
            padding: isCardCollapsed ? '0.75rem 1.25rem' : '1.1rem 1.25rem',
            backgroundColor: 'var(--card-bg)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            transition: 'padding 0.3s ease'
          }}
        >
          {isCardCollapsed ? (
            /* COLLAPSED VIEW: Sleek mini bar revealing full path */
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={onPrev}
                title={t('story.btn_back')}
                style={{ color: 'var(--card-text)', display: 'flex', alignItems: 'center', padding: '4px', cursor: 'pointer' }}
              >
                <ArrowLeft size={18} />
              </button>

              <button 
                onClick={() => setIsCardCollapsed(false)}
                title="Agrandir la bulle de texte"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  color: 'var(--card-text)', 
                  fontWeight: 'bold', 
                  fontSize: '0.9rem',
                  background: 'rgba(0,0,0,0.08)',
                  padding: '5px 14px',
                  borderRadius: '15px',
                  cursor: 'pointer'
                }}
              >
                <span>Étape {currentIndex + 1} / {STORY_SEQUENCE.length}</span>
                <ChevronUp size={16} />
              </button>

              <button 
                onClick={!isLast ? onNext : onGoHome}
                title={!isLast ? t('story.btn_continue') : 'Accueil'}
                style={{ color: 'var(--card-text)', display: 'flex', alignItems: 'center', padding: '4px', cursor: 'pointer' }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            /* EXPANDED VIEW: Compact typography & collapsible button */
            <>
              {/* Card Top Navigation & Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                {activeBubble ? (
                  <button 
                    onClick={() => setActiveBubble(null)} 
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
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={15} /> {t('story.btn_back_bubbles')}
                  </button>
                ) : (
                  <button 
                    onClick={onPrev} 
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
                      cursor: 'pointer'
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
                    title="Réduire pour admirer tout le parcours"
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

              <AnimatePresence mode="wait" custom={direction}>
                {!activeBubble ? (
                  <motion.div 
                    key={`text-${stepKey}`} custom={direction} variants={textVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'tween', duration: 0.25 }}
                    style={{ minHeight: '65px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <h2 style={{ fontSize: '1.15rem', textAlign: 'center', lineHeight: '1.45', color: 'var(--card-text)', margin: '0 0 1rem 0', fontWeight: '500' }}>
                      {renderTextWithVerses(t(`story.${stepKey}`, { friendName: friendName || 'Friend', guideName: guideName || 'Guide' }))}
                    </h2>

                    {isBubbleScreen && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setActiveBubble('step_11')} style={{ padding: '0.65rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem' }}>{t('story.bubble_success')}</motion.button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setActiveBubble('step_12')} style={{ padding: '0.65rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem' }}>{t('story.bubble_good')}</motion.button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setActiveBubble('step_13')} style={{ padding: '0.65rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem' }}>{t('story.bubble_religion')}</motion.button>
                      </div>
                    )}

                    {isDecisionScreen && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleChoice('yes')} style={{ padding: '0.65rem 1rem', borderRadius: '20px', backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem' }}>{t('story.btn_yes')}</motion.button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={() => handleChoice('no')} style={{ padding: '0.65rem 1rem', borderRadius: '20px', backgroundColor: 'transparent', border: '2px solid var(--card-text)', color: 'var(--card-text)', fontWeight: 'bold', fontSize: '0.95rem' }}>{t('story.btn_no')}</motion.button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key={`bubble-${activeBubble}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '65px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '1.15rem', textAlign: 'center', lineHeight: '1.45', color: 'var(--card-text)', margin: '0 0 1rem 0', fontWeight: '500' }}>
                      {renderTextWithVerses(t(`story.${activeBubble}`))}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MAIN CONTINUE BUTTON (White Pill with Arrow) */}
              {(!isBubbleScreen && !isDecisionScreen || activeBubble) && (
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
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

    </div>
  );
}
