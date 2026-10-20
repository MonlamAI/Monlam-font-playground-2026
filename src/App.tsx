/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { FontCatalog } from './components/FontCatalog';
import { ComparisonView } from './components/ComparisonView';
import { TypingPractice } from './components/TypingPractice';
import { TypingQuest } from './components/TypingQuest';
import { TypographyGuide } from './components/TypographyGuide';
import { InstallGuide } from './components/InstallGuide';
import { FeedbackModal } from './components/FeedbackModal';
import { SelectedFontsDrawer } from './components/SelectedFontsDrawer';
import { GlyphModal } from './components/GlyphModal';
import { UpdateNotification } from './components/UpdateNotification';
import { PRESET_TEXTS, resolveDefaultPreset } from './data/fontsData';
import { FontCategory, FontItem } from './types/font';
import { AppFooter } from './components/AppFooter';
import { usePublishedFonts, PublishedFontFaces } from './hooks/usePublishedFonts';
import { usePublishedPresets } from './hooks/usePublishedPresets';
import { useCatalogUpdates } from './hooks/useCatalogUpdates';
import type { AppTab } from './components/Header';
import type { FontKindFilter } from './components/ControlsBar';
import {
  PRESET_ID_CUSTOM,
  PRESET_ID_FONT_SAMPLE
} from './utils/resolvePreviewText';
import { FEATURE_TYPING_QUEST, FEATURE_TYPOGRAPHY_GUIDE } from './config/features';

export default function App() {
  const { fonts: allFonts } = usePublishedFonts();
  const { presets } = usePublishedPresets();
  const {
    open: updatesOpen,
    collapsed: updatesCollapsed,
    diff: catalogDiff,
    dismiss: dismissUpdates,
    collapse: collapseUpdates,
    expand: expandUpdates
  } = useCatalogUpdates();
  const [activeTab, setActiveTab] = useState<AppTab>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FontCategory>('All');
  const [selectedFontKind, setSelectedFontKind] = useState<FontKindFilter>('normal');
  const [previewText, setPreviewText] = useState(
    () => resolveDefaultPreset(PRESET_TEXTS).content
  );
  const [fontSize, setFontSize] = useState(36);
  const [lineHeight, setLineHeight] = useState(1.85);
  const [fontWeight, setFontWeight] = useState(400);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'sample'>('list');
  const [activePresetId, setActivePresetId] = useState(
    () => resolveDefaultPreset(PRESET_TEXTS).id
  );

  useEffect(() => {
    if (
      (activeTab === 'quest' && !FEATURE_TYPING_QUEST) ||
      (activeTab === 'guide' && !FEATURE_TYPOGRAPHY_GUIDE)
    ) {
      setActiveTab('catalog');
    }
  }, [activeTab]);

  useEffect(() => {
    if (presets.length === 0) return;
    const stillValid = presets.some((p) => p.id === activePresetId);
    if (
      !stillValid &&
      activePresetId !== PRESET_ID_CUSTOM &&
      activePresetId !== PRESET_ID_FONT_SAMPLE
    ) {
      const fallback = resolveDefaultPreset(presets);
      setActivePresetId(fallback.id);
      setPreviewText(fallback.content);
    }
  }, [presets, activePresetId]);

  // Selected fonts for download drawer (empty until user chooses)
  const [selectedFonts, setSelectedFonts] = useState<FontItem[]>([]);

  // Compared fonts for side-by-side mode
  const [comparedFonts, setComparedFonts] = useState<FontItem[]>([]);

  useEffect(() => {
    if (comparedFonts.length === 0 && allFonts.length >= 2) {
      setComparedFonts([allFonts[0], allFonts[3] || allFonts[1]]);
    }
  }, [allFonts, comparedFonts.length]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [inspectingFont, setInspectingFont] = useState<FontItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filtered fonts computation
  const filteredFonts = useMemo(() => {
    return allFonts.filter((font) => {
      const kind = font.fontKind || 'normal';
      if (selectedFontKind !== 'all' && kind !== selectedFontKind) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'All' && font.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = font.name.toLowerCase().includes(query);
        const matchesTibetan = font.tibetanName.includes(query);
        const matchesCategory = font.category.toLowerCase().includes(query);
        const matchesTag = font.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesigner = font.designer.toLowerCase().includes(query);
        const matchesKind = kind.includes(query);
        return (
          matchesName ||
          matchesTibetan ||
          matchesCategory ||
          matchesTag ||
          matchesDesigner ||
          matchesKind
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedFontKind, allFonts]);

  // Toggle selection
  const handleToggleSelect = (font: FontItem) => {
    setSelectedFonts((prev) => {
      const exists = prev.some((f) => f.id === font.id);
      if (exists) {
        return prev.filter((f) => f.id !== font.id);
      } else {
        return [...prev, font];
      }
    });
  };

  // Toggle compare
  const handleToggleCompare = (font: FontItem) => {
    setComparedFonts((prev) => {
      const exists = prev.some((f) => f.id === font.id);
      if (exists) {
        return prev.filter((f) => f.id !== font.id);
      } else {
        if (prev.length >= 4) {
          // Keep max 4
          return [...prev.slice(1), font];
        }
        return [...prev, font];
      }
    });
  };

  const handleAddCompareFont = (font: FontItem) => {
    if (!comparedFonts.some((f) => f.id === font.id)) {
      setComparedFonts((prev) => [...prev, font]);
    }
  };

  const handleRemoveCompareFont = (fontId: string) => {
    setComparedFonts((prev) => prev.filter((f) => f.id !== fontId));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFontKind('normal');
    const first = resolveDefaultPreset(presets.length ? presets : PRESET_TEXTS);
    setPreviewText(first.content);
    setActivePresetId(first.id);
    setFontSize(36);
    setLineHeight(1.85);
    setFontWeight(400);
  };

  const handleSendToPlayground = (text: string) => {
    setPreviewText(text);
    setActivePresetId(PRESET_ID_CUSTOM);
    setActiveTab('catalog');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-between text-gray-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/60 dark:selection:text-blue-100">
      <PublishedFontFaces fonts={allFonts} />
      <div>
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedFonts={selectedFonts}
          setIsDrawerOpen={setIsDrawerOpen}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />

        {/* Tab Views */}
        <main className="pb-16">
          {activeTab === 'catalog' && (
            <ControlsBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedFontKind={selectedFontKind}
              setSelectedFontKind={(kind) => {
                setSelectedFontKind(kind);
                if (kind === 'special') {
                  setActivePresetId(PRESET_ID_FONT_SAMPLE);
                  const sample =
                    allFonts.find((f) => (f.fontKind || 'normal') === 'special')?.sampleText ||
                    allFonts[0]?.sampleText;
                  if (sample) setPreviewText(sample);
                } else if (
                  activePresetId === PRESET_ID_CUSTOM ||
                  activePresetId === PRESET_ID_FONT_SAMPLE
                ) {
                  const first = resolveDefaultPreset(presets.length ? presets : PRESET_TEXTS);
                  setActivePresetId(first.id);
                  setPreviewText(first.content);
                }
              }}
              previewText={previewText}
              setPreviewText={setPreviewText}
              fontSize={fontSize}
              setFontSize={setFontSize}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
              fontWeight={fontWeight}
              setFontWeight={setFontWeight}
              viewMode={viewMode}
              setViewMode={setViewMode}
              activePresetId={activePresetId}
              setActivePresetId={setActivePresetId}
              presets={presets}
              catalogFonts={filteredFonts}
              onReset={handleResetFilters}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            >
              <FontCatalog
                fonts={filteredFonts}
                previewText={previewText}
                activePresetId={activePresetId}
                presets={presets}
                fontSize={fontSize}
                lineHeight={lineHeight}
                fontWeight={fontWeight}
                viewMode={viewMode}
                selectedFonts={selectedFonts}
                onToggleSelect={handleToggleSelect}
                comparedFonts={comparedFonts}
                onToggleCompare={handleToggleCompare}
                onOpenGlyphs={(font) => setInspectingFont(font)}
                onResetFilters={handleResetFilters}
              />
            </ControlsBar>
          )}

          {activeTab === 'compare' && (
            <ComparisonView
              allFonts={allFonts}
              comparedFonts={comparedFonts}
              onAddFont={handleAddCompareFont}
              onRemoveFont={handleRemoveCompareFont}
              onSetComparedFonts={setComparedFonts}
              selectedFonts={selectedFonts}
              onToggleSelect={handleToggleSelect}
              fontWeight={fontWeight}
              onFontWeightChange={setFontWeight}
            />
          )}

          {activeTab === 'typing' && (
            <TypingPractice onSendToPlayground={handleSendToPlayground} />
          )}

          {FEATURE_TYPING_QUEST && activeTab === 'quest' && <TypingQuest />}

          {FEATURE_TYPOGRAPHY_GUIDE && activeTab === 'guide' && <TypographyGuide />}

          {activeTab === 'install' && <InstallGuide allFonts={allFonts} />}
        </main>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Selected Fonts Slide-over Drawer */}
      <SelectedFontsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedFonts={selectedFonts}
        onRemoveFont={(id) => setSelectedFonts((prev) => prev.filter((f) => f.id !== id))}
        onClearAll={() => setSelectedFonts([])}
        onOpenInstall={() => {
          setIsDrawerOpen(false);
          setActiveTab('install');
        }}
      />

      {/* Glyph & Character Map Modal */}
      <GlyphModal font={inspectingFont} onClose={() => setInspectingFont(null)} />

      <UpdateNotification
        open={updatesOpen}
        collapsed={updatesCollapsed}
        diff={catalogDiff}
        onDismiss={dismissUpdates}
        onCollapse={collapseUpdates}
        onExpand={expandUpdates}
        onViewFonts={() => setActiveTab('catalog')}
        onViewKeyboards={() => setActiveTab('install')}
      />

      <AppFooter onNavigate={setActiveTab} onOpenFeedback={() => setIsFeedbackOpen(true)} />
    </div>
  );
}
