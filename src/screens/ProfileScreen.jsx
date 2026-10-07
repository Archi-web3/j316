import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, HeartHandshake, Calendar, Trash2, Plus, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Token from '../components/Token';
import { isSoundEnabled, toggleSound, hapticLight, playPopSound } from '../utils/soundAndHaptics';

export default function ProfileScreen({ guideName, guideAvatar, onBack, onStartNewJourney }) {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language === 'fr';

  const [soundActive, setSoundActive] = useState(() => isSoundEnabled());
  const [journal, setJournal] = useState(() => {
    try {
      const saved = localStorage.getItem('j316-journal');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [newFriendName, setNewFriendName] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const saveJournal = (entries) => {
    setJournal(entries);
    localStorage.setItem('j316-journal', JSON.stringify(entries));
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    hapticLight();
    playPopSound();
    const entry = {
      id: Date.now(),
      name: newFriendName.trim(),
      note: newNote.trim(),
      date: new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    saveJournal([entry, ...journal]);
    setNewFriendName('');
    setNewNote('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    hapticLight();
    saveJournal(journal.filter(item => item.id !== id));
  };

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundActive(next);
    hapticLight();
    playPopSound();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F9FE',
        overflowY: 'auto',
        color: '#1a1a2e',
        position: 'relative'
      }}
    >
      {/* Top Bar */}
      <div style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ECEEF8',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#3A41E8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '1rem'
          }}
        >
          <ArrowLeft size={20} />
          {isFr ? "Retour" : "Back"}
        </button>

        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#111' }}>
          {isFr ? "Profil & Carnet" : "Profile & Journal"}
        </h2>

        <button
          onClick={handleToggleSound}
          title={isFr ? "Activer/Désactiver le son" : "Toggle Sound"}
          style={{
            background: '#F0F2FA',
            border: 'none',
            color: soundActive ? '#3A41E8' : '#888',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {soundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Guide Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '1.25rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#3A41E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(58, 65, 232, 0.3)'
          }}>
            <Token type={guideAvatar || 'sailboat'} size={40} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              {isFr ? "Guide" : "Guide"}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111' }}>
              {guideName || (isFr ? 'Mon Profil' : 'My Profile')}
            </div>
          </div>
        </div>

        {/* Section: Carnet de Partage */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111' }}>
              {isFr ? "Carnet de Prières & Partages" : "Prayer & Sharing Journal"}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '2px 0 0' }}>
              {isFr ? "Garde en mémoire les amis rencontrés pour continuer à prier" : "Remember friends you shared with to pray for them"}
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: '#3A41E8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            {isFr ? "Ajouter" : "Add"}
          </button>
        </div>

        {/* Add Entry Form Modal/Collapse */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddEntry}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}
            >
              <input
                type="text"
                placeholder={isFr ? "Prénom de l'ami(e)" : "Friend's name"}
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                required
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #DCE0F0',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <textarea
                placeholder={isFr ? "Sujet de prière ou note (optionnel)" : "Prayer request or note (optional)"}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #DCE0F0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#F0F2FA',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  {isFr ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#3A41E8',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isFr ? "Enregistrer" : "Save"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* List of journal entries */}
        {journal.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            color: '#888'
          }}>
            <HeartHandshake size={42} color="#D0D5EE" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 600, color: '#444' }}>
              {isFr ? "Aucun ami enregistré pour l'instant" : "No friends registered yet"}
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
              {isFr ? "Vos partages avec vos amis apparaîtront ici automatiquement ou manuellement." : "Journeys you complete will be saved here."}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {journal.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111' }}>
                    {item.name}
                  </div>
                  {item.note && (
                    <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '0.2rem' }}>
                      {item.note}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#999', marginTop: '0.4rem' }}>
                    <Calendar size={13} />
                    {item.date}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#CCC',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title={isFr ? "Supprimer" : "Delete"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Privacy Note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#888',
          justifyContent: 'center',
          marginTop: 'auto'
        }}>
          <ShieldCheck size={16} color="#10B981" />
          {isFr ? "Ces informations restent 100% privées sur votre appareil." : "This data remains 100% private on your device."}
        </div>

      </div>
    </motion.div>
  );
}
