import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Settings } from 'lucide-react'
import Home from './screens/Home'
import CharacterSelect from './screens/CharacterSelect'
import StoryStep from './screens/StoryStep'
import OptionsMenu from './components/OptionsMenu'
import ResourcesMenu from './components/ResourcesMenu'
import Tutorial from './screens/Tutorial'
import ProfileScreen from './screens/ProfileScreen'

const storySteps = [
  'step_1', 'step_2', 'step_3', 'step_4', 'step_5', 
  'step_6', 'step_7', 'step_8', 'step_9', 'step_10',
  'step_14', 'step_15', 'step_16', 'step_17', 'step_18',
  'step_success', 'step_21'
];

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [guideName, setGuideName] = useState('');
  const [friendName, setFriendName] = useState('');
  
  // Initial token avatars
  const [guideAvatar, setGuideAvatar] = useState('sailboat');
  const [friendAvatar, setFriendAvatar] = useState('compass');

  const [storyIndex, setStoryIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const [previousScreen, setPreviousScreen] = useState('home');

  const handleBegin = () => {
    setDirection(1);
    setCurrentScreen('character');
  };

  const handleCharacterNext = (gName, fName, gAvatar, fAvatar) => {
    setGuideName(gName || 'Guide');
    setFriendName(fName || 'Ami');
    setGuideAvatar(gAvatar);
    setFriendAvatar(fAvatar);
    setDirection(1);
    setCurrentScreen('story');
  };

  const handleCharacterBack = () => {
    setDirection(-1);
    setCurrentScreen('home');
  };

  const handleStoryNext = () => {
    if (storyIndex < storySteps.length - 1) {
      setDirection(1);
      setStoryIndex(prev => prev + 1);
    }
  };

  const handleStoryPrev = () => {
    if (storyIndex > 0) {
      setDirection(-1);
      setStoryIndex(prev => prev - 1);
    } else {
      setDirection(-1);
      setCurrentScreen('character');
    }
  };

  const openTutorial = () => {
    setIsOptionsOpen(false);
    setPreviousScreen(currentScreen);
    setCurrentScreen('tutorial');
  };

  const closeTutorial = () => {
    setCurrentScreen(previousScreen || 'home'); 
    setIsOptionsOpen(true);
  };

  const goHome = () => {
    setDirection(-1);
    setStoryIndex(0);
    setCurrentScreen('home');
  };

  return (
    <div className="app-container">
      <button 
        onClick={() => setIsOptionsOpen(true)}
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 50, color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Settings size={28} />
      </button>

      <OptionsMenu 
        isOpen={isOptionsOpen} 
        onClose={() => setIsOptionsOpen(false)} 
        onOpenTutorial={openTutorial}
      />

      <ResourcesMenu 
        isOpen={isResourcesOpen} 
        onClose={() => setIsResourcesOpen(false)} 
      />

      <AnimatePresence initial={false} custom={direction}>
        {currentScreen === 'home' && (
          <Home 
            key="home"
            onNext={handleBegin} 
            onGoToProfile={() => setCurrentScreen('profile')}
            onOpenOptions={() => setIsOptionsOpen(true)}
            onOpenResources={() => setIsResourcesOpen(true)}
          />
        )}
        {currentScreen === 'character' && (
          <CharacterSelect 
            key="character" 
            onNext={handleCharacterNext} 
            onBack={handleCharacterBack}
            initialGuideName={guideName}
            initialFriendName={friendName}
            initialGuideAvatar={guideAvatar}
            initialFriendAvatar={friendAvatar}
            direction={direction}
          />
        )}
        {currentScreen === 'story' && (
          <StoryStep 
            key="story"
            stepKey={storySteps[storyIndex]}
            guideName={guideName}
            friendName={friendName}
            guideAvatar={guideAvatar}
            friendAvatar={friendAvatar}
            onNext={handleStoryNext}
            onPrev={handleStoryPrev}
            direction={direction}
            isLast={storyIndex === storySteps.length - 1}
            onGoHome={goHome}
          />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen
            key="profile"
            guideName={guideName}
            guideAvatar={guideAvatar}
            onBack={() => setCurrentScreen('home')}
            onStartNewJourney={() => {
              setDirection(1);
              setCurrentScreen('character');
            }}
          />
        )}
        {currentScreen === 'tutorial' && (
          <Tutorial 
            key="tutorial" 
            onClose={closeTutorial} 
            steps={storySteps} 
            guideName={guideName} 
            friendName={friendName} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
