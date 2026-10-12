import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { loadLevelProgress, saveLevelProgress } from '../../utils/questStorage';
import { LevelProgress } from '../../types/typing';

interface AssessmentModalProps {
  onClose: () => void;
  onRecommendedWorld: (worldId: number) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  onClose,
  onRecommendedWorld,
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const tiers = [
    {
      id: 1,
      title: 'Complete Beginner',
      tibetan: 'ལས་དང་པོ་པ།',
      desc: 'I am new to Tibetan script. I want to start from the 30 root consonants (Ka, Kha, Ga, Nga).',
      recommendWorld: 1,
      startLevel: 1,
      icon: '🌱',
    },
    {
      id: 2,
      title: 'Basic Typist',
      tibetan: 'སློབ་ཕྲུག',
      desc: 'I know the basic alphabet and vowels, but want to master whole syllables and tsek markers.',
      recommendWorld: 3,
      startLevel: 21,
      icon: '🏯',
    },
    {
      id: 3,
      title: 'Intermediate Scribe',
      tibetan: 'ཡིག་མཁན།',
      desc: 'I can type basic Tibetan words. I want to conquer complex vertical stacks (Ra-go, Ya-tag, བསྒྲ) and compound words.',
      recommendWorld: 5,
      startLevel: 41,
      icon: '🏔️',
    },
    {
      id: 4,
      title: 'Advanced Lotsawa',
      tibetan: 'ལོ་ཙཱ་བ།',
      desc: 'I am an experienced Tibetan typist seeking speed trials, classical sutras, high WPM and Master Scribe challenges.',
      recommendWorld: 7,
      startLevel: 61,
      icon: '👑',
    },
  ];

  const handleApplyPlacement = () => {
    if (!selectedTier) return;
    const tier = tiers.find(t => t.id === selectedTier);
    if (!tier) return;

    // Unlock all levels up to the start level
    const progress = loadLevelProgress();
    for (let i = 1; i <= tier.startLevel; i++) {
      if (!progress[i]) {
        progress[i] = {
          levelId: i,
          unlocked: true,
          completed: false,
          stars: 0,
          bestAccuracy: 0,
          bestWpm: 0,
          highScore: 0,
          attempts: 0,
        };
      } else {
        progress[i].unlocked = true;
      }
    }
    saveLevelProgress(progress);
    onRecommendedWorld(tier.recommendWorld);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Difficulty Placement
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Where Should You Begin?
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Choose your current familiarity with Tibetan typing. We will tailor your journey and unlock the appropriate world.
          </p>
        </div>

        {/* Tiers List */}
        <div className="space-y-3 mb-8">
          {tiers.map(tier => {
            const isSelected = selectedTier === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-white dark:bg-slate-950/50 border-gray-200 dark:border-slate-800 hover:border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                  {tier.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{tier.title}</span>
                      <span className="tibetan-text font-monlam-ouchan-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">{tier.tibetan}</span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                      Starts World {tier.recommendWorld}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            disabled={!selectedTier}
            onClick={handleApplyPlacement}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-102 transition-all"
          >
            <span>Start at Selected World</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
