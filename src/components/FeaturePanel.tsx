
import React from 'react';
import MeditationTimer from '@/components/MeditationTimer';
import DailyQuote from '@/components/DailyQuote';
import PrayerRequest from '@/components/PrayerRequest';

interface FeaturePanelProps {
  activeFeature: string | null;
  setActiveFeature: (feature: string | null) => void;
}

const FeaturePanel: React.FC<FeaturePanelProps> = ({ activeFeature, setActiveFeature }) => {
  if (!activeFeature) return null;
  
  return (
    <div className="mb-4">
      {activeFeature === "meditation" && (
        <MeditationTimer 
          onComplete={() => setActiveFeature(null)}
          onClose={() => setActiveFeature(null)}
        />
      )}
      
      {activeFeature === "quote" && (
        <DailyQuote />
      )}
      
      {activeFeature === "prayer" && (
        <PrayerRequest onClose={() => setActiveFeature(null)} />
      )}
    </div>
  );
};

export default FeaturePanel;
