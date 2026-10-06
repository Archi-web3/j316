import { motion } from 'framer-motion';
import { Sailboat, Compass, Anchor, Fish } from 'lucide-react';

const ICONS = {
  sailboat: Sailboat,
  compass: Compass,
  anchor: Anchor,
  fish: Fish
};

export default function Token({ iconName, color, size = 60, isActive = false }) {
  const IconComponent = ICONS[iconName] || Compass;

  return (
    <motion.div
      animate={isActive ? { y: [0, -10, 0] } : { y: 0 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        border: `3px solid ${color}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.2)',
        color: color,
        position: 'relative'
      }}
    >
      <IconComponent size={size * 0.6} strokeWidth={2.5} />
      
      {/* Wooden texture effect (subtle) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
}
