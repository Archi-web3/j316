import { motion } from 'framer-motion';
import { Play, Compass, BookHeart, User, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { hapticLight, playPopSound } from '../utils/soundAndHaptics';

const variants = {
  enter: { opacity: 0 },
  center: { zIndex: 1, opacity: 1 },
  exit: { zIndex: 0, opacity: 0 }
};

// Removed stamp index function as vignettes are removed from home

const totalSteps = 21;
const mapPoints = Array.from({ length: totalSteps }, (_, i) => {
  const progress = i / (totalSteps - 1); 
  const x = 50 + 35 * Math.sin(progress * Math.PI * 2.5); 
  const y = 10 + progress * 80; 
  return { x, y };
});

// Remove the first point from the SVG path so the dotted line starts after the cross
const svgPointsString = mapPoints.slice(1).map(p => `${p.x},${p.y}`).join(' ');

export default function Home({ onNext, onGoToProfile, onOpenOptions, onOpenResources }) {
  const { t } = useTranslation();

  return (
    <motion.div
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--primary)', overflow: 'hidden' }}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {/* === TOP AREA: THE MAP (80%) === */}
      <div style={{ flex: 7.8, position: 'relative', width: '100%', overflow: 'hidden' }}>

        {/* Title at the very top left */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}>
           <h1 className="title-font" style={{ color: '#fff', fontSize: '1.5rem', margin: 0, opacity: 0.8 }}>j316</h1>
        </div>

        {/* Dotted SVG Path */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <polyline 
            points={svgPointsString} 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
            strokeDasharray="2 3" 
            opacity="0.8"
          />
        </svg>

        {/* SVG Path only, vignettes removed */}
        {/* Starting Cross (at point 0) */}
        <motion.div
          style={{ position: 'absolute', left: `${mapPoints[0].x}%`, top: `${mapPoints[0].y - 5}%`, transform: 'translate(-50%, -50%)', display: 'flex', zIndex: 20 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <svg width="70" height="90" viewBox="0 0 100 150" fill="none" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))' }}>
            <line x1="50" y1="10" x2="50" y2="140" />
            <line x1="15" y1="50" x2="85" y2="50" />
          </svg>
        </motion.div>
      </div>

      {/* === BOTTOM AREA: THE TEXT CARD (20%) === */}
      <div 
        style={{ 
          flex: 2.2, 
          backgroundColor: '#ffffff', 
          borderTopLeftRadius: '30px', 
          borderTopRightRadius: '30px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 30
        }}
      >
        <h2 className="title-font" style={{ fontSize: '1.4rem', textAlign: 'center', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
          {t('story.journey_title')}
        </h2>
        
        <motion.button 
          onClick={() => {
            hapticLight();
            playPopSound();
            onNext();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '0.8rem 2.5rem', 
            backgroundColor: 'var(--accent)', 
            borderRadius: '50px', 
            color: 'var(--primary-dark)', 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            marginBottom: '1.5rem'
          }}
        >
          {t('home.begin')} <Play size={20} fill="currentColor" />
        </motion.button>

        {/* BOTTOM TAB BAR inside the white area */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', maxWidth: '400px', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary)', cursor: 'pointer' }}>
            <Compass size={24} strokeWidth={2.5} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '4px' }}>Parcours</span>
          </div>
          <div onClick={() => { hapticLight(); playPopSound(); onOpenResources(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#a0a0a0', cursor: 'pointer' }}>
            <BookHeart size={24} />
            <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Ressources</span>
          </div>
          <div onClick={() => { hapticLight(); playPopSound(); onGoToProfile(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#a0a0a0', cursor: 'pointer' }}>
            <User size={24} />
            <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Profil</span>
          </div>
          <div onClick={() => { hapticLight(); playPopSound(); onOpenOptions(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#a0a0a0', cursor: 'pointer' }}>
            <Settings size={24} />
            <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Réglages</span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
