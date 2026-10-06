import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Token from '../components/Token';

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 })
};

const tokenOptions = ['sailboat', 'compass', 'anchor', 'fish'];

export default function CharacterSelect({ onNext, onBack, initialGuideName, initialFriendName, initialGuideAvatar, initialFriendAvatar, direction }) {
  const { t } = useTranslation();
  const [guideName, setGuideName] = useState(initialGuideName);
  const [friendName, setFriendName] = useState(initialFriendName);
  
  const [guideTokenIndex, setGuideTokenIndex] = useState(() => Math.max(0, tokenOptions.indexOf(initialGuideAvatar)));
  const [friendTokenIndex, setFriendTokenIndex] = useState(() => Math.max(0, tokenOptions.indexOf(initialFriendAvatar)));

  const handleNextGuide = () => setGuideTokenIndex((prev) => (prev + 1) % tokenOptions.length);
  const handlePrevGuide = () => setGuideTokenIndex((prev) => (prev - 1 + tokenOptions.length) % tokenOptions.length);

  const handleNextFriend = () => setFriendTokenIndex((prev) => (prev + 1) % tokenOptions.length);
  const handlePrevFriend = () => setFriendTokenIndex((prev) => (prev - 1 + tokenOptions.length) % tokenOptions.length);

  return (
    <motion.div
      className="screen"
      style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
    >
      {/* Top Bar with Back Button */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}>
        <button 
          onClick={onBack}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            color: 'var(--text-light)', 
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '7px 15px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <ArrowLeft size={18} /> {t('character.back') || 'Retour'}
        </button>
      </div>

      <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', textAlign: 'center', textTransform: 'uppercase' }}>Choisis ton Pion</h2>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', width: '100%', justifyContent: 'center' }}>
        
        {/* Guide Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', padding: '0 0.5rem' }}>
            <button onClick={handlePrevGuide} style={{ color: 'var(--text-light)', opacity: 0.7 }}><ChevronLeft size={24} /></button>
            <Token iconName={tokenOptions[guideTokenIndex]} color="var(--accent)" size={80} isActive={true} />
            <button onClick={handleNextGuide} style={{ color: 'var(--text-light)', opacity: 0.7 }}><ChevronRight size={24} /></button>
          </div>
          
          <input 
            type="text" 
            placeholder={t('character.guide_placeholder')} 
            value={guideName}
            onChange={(e) => setGuideName(e.target.value)}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.8rem',
              fontSize: '1rem',
              borderRadius: '25px',
              border: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              color: 'var(--text-dark)'
            }}
          />
        </div>

        {/* Friend Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', padding: '0 0.5rem' }}>
            <button onClick={handlePrevFriend} style={{ color: 'var(--text-light)', opacity: 0.7 }}><ChevronLeft size={24} /></button>
            <Token iconName={tokenOptions[friendTokenIndex]} color="#ffffff" size={80} isActive={true} />
            <button onClick={handleNextFriend} style={{ color: 'var(--text-light)', opacity: 0.7 }}><ChevronRight size={24} /></button>
          </div>

          <input 
            type="text" 
            placeholder={t('character.friend_placeholder')} 
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.8rem',
              fontSize: '1rem',
              borderRadius: '25px',
              border: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              color: 'var(--text-dark)'
            }}
          />
        </div>

      </div>

      <div style={{ marginTop: 'auto', marginBottom: '2rem' }}>
        <motion.button 
          className="circle-btn" 
          onClick={() => onNext(guideName, friendName, tokenOptions[guideTokenIndex], tokenOptions[friendTokenIndex])}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('character.next')}
        </motion.button>
      </div>
    </motion.div>
  );
}
