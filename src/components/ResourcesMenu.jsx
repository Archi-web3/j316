import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, ExternalLink, FileText, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResourcesMenu({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [view, setView] = useState('list'); // 'list' or 'summary'

  // Reset view when closed
  const handleClose = () => {
    onClose();
    setTimeout(() => setView('list'), 300);
  };
  
  const renderList = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={24} /> {t('options.resources')}
        </h2>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
        {/* Bible Card */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '15px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--accent)' }}>La Bible</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.9, marginBottom: '1.5rem' }}>
            L'application YouVersion est la référence mondiale pour lire, écouter et étudier la Bible gratuitement.
          </p>
          <a href="https://www.youversion.com/the-bible-app/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#ffffff', color: 'var(--primary-dark)', padding: '0.8rem 1rem', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {t('options.bible_app')} <ExternalLink size={18} />
          </a>
        </div>
        
        {/* Summary Card */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '15px' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--accent)' }}>{t('options.gospel_summary')}</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.9, marginBottom: '1.5rem' }}>
            Un résumé complet des 7 points clés du message de l'Évangile avec les versets fondateurs.
          </p>
          <button onClick={() => setView('summary')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--accent)', color: 'var(--primary-dark)', padding: '0.8rem 1rem', borderRadius: '25px', border: 'none', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
            Lire le résumé <FileText size={18} />
          </button>
        </div>
      </div>
    </>
  );

  const renderSummary = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '-0.5rem' }}>
          <ArrowLeft size={24} /> {t('options.back_to_resources')}
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '2rem' }}>{t('summary.title')}</h2>
        
        {/* Point 1 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_1')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t('summary.verse_1_ref')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, margin: 0, lineHeight: '1.5' }}>{t('summary.verse_1')}</p>
        </div>

        {/* Point 2 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_2')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t('summary.verse_2_ref')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, margin: 0, lineHeight: '1.5' }}>{t('summary.verse_2')}</p>
        </div>
        
        {/* Point 3 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_3')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t('summary.verse_3_ref')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, margin: 0, lineHeight: '1.5' }}>{t('summary.verse_3')}</p>
        </div>

        <h3 style={{ textAlign: 'center', fontSize: '1.5rem', margin: '3rem 0', color: '#fff' }}>{t('summary.but')}</h3>

        {/* Point 4 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_4')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t('summary.verse_4_ref')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, margin: '0 0 1rem 0', lineHeight: '1.5' }}>{t('summary.verse_4')}</p>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_4_desc')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0', fontWeight: 'bold' }}>{t('summary.verse_4_ref2')}</p>
        </div>

        {/* Point 5 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_5')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0', fontWeight: 'bold' }}>{t('summary.verse_5_ref')}</p>
        </div>

        {/* Point 6 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0', whiteSpace: 'pre-line' }}>{t('summary.point_6')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t('summary.verse_6_ref')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, margin: 0, lineHeight: '1.5' }}>{t('summary.verse_6')}</p>
        </div>

        {/* Point 7 */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>{t('summary.point_7')}</p>
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: 'bold' }}>{t('summary.verse_7_ref')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', opacity: 0.9, margin: 0, lineHeight: '1.5' }}>{t('summary.verse_7')}</p>
        </div>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: view === 'summary' ? '100%' : '85%', maxWidth: view === 'summary' ? '100%' : '350px',
              backgroundColor: 'var(--primary)', zIndex: 100,
              padding: '2rem', boxShadow: '-5px 0 25px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', color: '#ffffff'
            }}
          >
            {view === 'list' ? renderList() : renderSummary()}

            {view === 'list' && (
              <button 
                onClick={handleClose}
                style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {t('options.close') || "Fermer"}
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
