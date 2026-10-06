import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Compass, HeartHandshake, MessageCircle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { guideCoaching } from '../data/guideTips';

const variants = {
  enter: { y: '100%', opacity: 0 },
  center: { zIndex: 1, y: 0, opacity: 1 },
  exit: { zIndex: 0, y: '100%', opacity: 0 }
};

export default function Tutorial({ onClose, steps, guideName, friendName }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'steps'

  const lang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'fr';
  const coaching = guideCoaching[lang] || guideCoaching.fr;

  return (
    <motion.div
      className="screen"
      style={{ 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: 'var(--background)',
        color: 'var(--text-dark)',
        overflowY: 'auto',
        padding: '1.25rem'
      }}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Top Header */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.8rem' }}>
        <button 
          onClick={onClose} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            border: '1px solid rgba(255,255,255,0.35)', 
            color: '#ffffff', 
            padding: '8px 16px', 
            borderRadius: '25px', 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(6px)'
          }}
        >
          <ArrowLeft size={18} /> {t('tutorial.back_to_menu')}
        </button>
        <h2 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)', textAlign: 'right' }}>
          {t('tutorial.title')}
        </h2>
      </div>

      {/* Segmented Tab Selector */}
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        display: 'flex', 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        padding: '4px', 
        borderRadius: '30px', 
        marginBottom: '1.5rem',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <button
          onClick={() => setActiveTab('guide')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '8px 12px',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            backgroundColor: activeTab === 'guide' ? '#ffffff' : 'transparent',
            color: activeTab === 'guide' ? 'var(--primary)' : 'rgba(255,255,255,0.85)',
            boxShadow: activeTab === 'guide' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <HeartHandshake size={18} />
          {t('tutorial.tab_guide')}
        </button>

        <button
          onClick={() => setActiveTab('steps')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '8px 12px',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            backgroundColor: activeTab === 'steps' ? '#ffffff' : 'transparent',
            color: activeTab === 'steps' ? 'var(--primary)' : 'rgba(255,255,255,0.85)',
            boxShadow: activeTab === 'steps' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Compass size={18} />
          {t('tutorial.tab_steps')}
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ width: '100%', maxWidth: '600px', paddingBottom: '2.5rem' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'guide' ? (
            /* TAB 1: METHOD & POSTURE PILLARS */
            <motion.div
              key="guide-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Intro Banner */}
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                color: '#ffffff', 
                padding: '1.25rem', 
                borderRadius: '18px', 
                marginBottom: '1.25rem',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(5px)'
              }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {lang === 'fr' 
                    ? "🤝 Ce guide pratique a été conçu pour t'équiper lorsque tu partages l'Évangile avec un ami. Tu n'es pas là pour faire un cours magistral, mais pour cheminer ensemble avec amour, respect et écoute."
                    : "🤝 This manual is designed to equip you when sharing the Gospel with a friend. You are not giving a lecture, but walking together with warmth, listening, and love."}
                </p>
              </div>

              {/* 6 Practical Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {coaching.pillars.map((pillar) => (
                  <div key={pillar.id} style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '18px', 
                    padding: '1.25rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{pillar.icon}</span>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {pillar.title}
                      </h3>
                    </div>

                    <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                      {pillar.subtitle}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {pillar.points.map((pt, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                          <span style={{ fontSize: '0.9rem', lineHeight: '1.45', color: '#222' }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* TAB 2: STEP-BY-STEP WHAT TO SAY & REFLECT */
            <motion.div
              key="steps-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Intro Banner */}
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                color: '#ffffff', 
                padding: '1.25rem', 
                borderRadius: '18px', 
                marginBottom: '1.25rem',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(5px)'
              }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {lang === 'fr'
                    ? "🗺️ Retrouve pour chaque étape le texte affiché à l'écran, accompagné de phrases d'accroche concrètes et de questions ouvertes pour ouvrir le dialogue."
                    : "🗺️ Explore each step of the journey with the on-screen text, concrete dialogue suggestions, and open questions to spark conversation."}
                </p>
              </div>

              {/* Steps List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {steps.map((step, index) => {
                  const stepTips = coaching.stepCoaching[step];

                  return (
                    <div key={index} style={{ 
                      backgroundColor: '#ffffff', 
                      padding: '1.25rem', 
                      borderRadius: '18px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      {/* Step Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ 
                          backgroundColor: 'var(--primary)', 
                          color: '#ffffff', 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem', 
                          fontWeight: 'bold' 
                        }}>
                          Étape {index + 1} / {steps.length}
                        </span>
                      </div>

                      {/* Displayed Story Text */}
                      <div style={{ 
                        backgroundColor: '#f8f9fe', 
                        padding: '0.8rem 1rem', 
                        borderRadius: '12px', 
                        marginBottom: '0.8rem',
                        borderLeft: '4px solid var(--primary)'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#333', fontStyle: 'italic' }}>
                          « {t(`story.${step}`, { 
                            friendName: friendName || t('character.friend_placeholder') || 'Ami',
                            guideName: guideName || t('character.guide_placeholder') || 'Guide'
                          })} »
                        </p>
                      </div>

                      {/* Coaching Tips */}
                      {stepTips && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {/* What to say */}
                          <div style={{ 
                            backgroundColor: '#eef8f2', 
                            padding: '0.75rem', 
                            borderRadius: '12px',
                            border: '1px solid #d2ebd9'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1b6336', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                              <MessageCircle size={15} /> {t('tutorial.what_to_say')}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#134e29', lineHeight: '1.45' }}>
                              {stepTips.say}
                            </p>
                          </div>

                          {/* To reflect on */}
                          <div style={{ 
                            backgroundColor: '#fffbe8', 
                            padding: '0.75rem', 
                            borderRadius: '12px',
                            border: '1px solid #fae69e'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8c6b00', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                              <Lightbulb size={15} /> {t('tutorial.to_reflect')}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#684f00', lineHeight: '1.45' }}>
                              {stepTips.reflect}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
