/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { FontCatalog } from './components/FontCatalog';
import { ComparisonView } from './components/ComparisonView';
import { TypingPractice } from './components/TypingPractice';
import { TypographyGuide } from './components/TypographyGuide';
import { InstallGuide } from './components/InstallGuide';
import { FeedbackModal } from './components/FeedbackModal';
import { SelectedFontsDrawer } from './components/SelectedFontsDrawer';
import { GlyphModal } from './components/GlyphModal';
import { UpdateNotification } from './components/UpdateNotification';
import { PRESET_TEXTS } from './data/fontsData';
import { FontCategory, FontItem } from './types/font';
import { Heart, Globe, Github, Scale } from 'lucide-react';
import { usePublishedFonts, PublishedFontFaces } from './hooks/usePublishedFonts';
import { usePublishedPresets } from './hooks/usePublishedPresets';
import { useCatalogUpdates } from './hooks/useCatalogUpdates';
import type { AppTab } from './components/Header';
import type { FontKindFilter } from './components/ControlsBar';

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
    () => PRESET_TEXTS[0]?.content || 'ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ།'
  );
  const [fontSize, setFontSize] = useState(36);
  const [lineHeight, setLineHeight] = useState(1.85);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'sample'>('grid');
  const [activePresetId, setActivePresetId] = useState(() => PRESET_TEXTS[0]?.id || 'mantra');

  useEffect(() => {
    if (presets.length === 0) return;
    const stillValid = presets.some((p) => p.id === activePresetId);
    if (!stillValid && activePresetId !== 'custom') {
      setActivePresetId(presets[0].id);
      setPreviewText(presets[0].content);
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
  const [sidebarOpen, setSidebarOpen] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)
  );

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
    const first = presets[0] || PRESET_TEXTS[0];
    setPreviewText(first.content);
    setActivePresetId(first.id);
    setFontSize(36);
    setLineHeight(1.85);
  };

  const handleSendToPlayground = (text: string) => {
    setPreviewText(text);
    setActivePresetId('custom');
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
                  setActivePresetId('custom');
                  const sample =
                    allFonts.find((f) => (f.fontKind || 'normal') === 'special')?.sampleText ||
                    allFonts[0]?.sampleText;
                  if (sample) setPreviewText(sample);
                } else if (activePresetId === 'custom') {
                  const first = presets[0] || PRESET_TEXTS[0];
                  if (first) {
                    setActivePresetId(first.id);
                    setPreviewText(first.content);
                  }
                }
              }}
              previewText={previewText}
              setPreviewText={setPreviewText}
              fontSize={fontSize}
              setFontSize={setFontSize}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
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
            />
          )}

          {activeTab === 'typing' && (
            <TypingPractice onSendToPlayground={handleSendToPlayground} />
          )}

          {activeTab === 'guide' && <TypographyGuide />}

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

      {/* Footer (Google Fonts inspired clean layout) */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-gray-500 dark:text-slate-400">
            {/* Col 1 */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logos/monlam.svg"
                  alt="Monlam"
                  className="w-8 h-8 shrink-0"
                  width={32}
                  height={32}
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-gray-900 dark:text-slate-100">Monlam Font Playground</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    Open Tibetan Typography
                  </span>
                </div>
              </div>
              <p className="leading-relaxed text-gray-600 dark:text-slate-400 max-w-md">
                Dedicated to the preservation, aesthetic perfection, and digital proliferation of the Tibetan language through the typefaces of Venerable Geshe Lobsang Monlam and the Monlam IT Research Centre.
              </p>
              <p className="tibetan-text text-gray-400 dark:text-slate-500 font-monlam-ouchan-1">
                བོད་ཀྱི་སྐད་ཡིག་དང་ཡིག་གཟུགས་འཛམ་གླིང་ཡོངས་ལ་ཁྱབ་སྤེལ་གཏོང་བའི་ཆེད་དུ་དམིགས་པ་ཡིན།
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-800 dark:text-slate-200 uppercase tracking-wider block">
                Resources
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('guide')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Complex Syllable Anatomy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('typing')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Tibetan Typing Practice
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('compare')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Side-by-Side Comparator
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('install')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                    Windows & Mac Setup Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsFeedbackOpen(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-blue-600 dark:text-blue-400">
                    Send Feedback
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-800 dark:text-slate-200 uppercase tracking-wider block">
                Official Links
              </span>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://github.com/MonlamAI/Monlam-font-playground-2026"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>MonlamAI on GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://fonts.google.com/?query=Tibetan"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Google Fonts Tibetan</span>
                  </a>
                </li>
                <li>
                  <Link
                    to="/licence"
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Licence policies</span>
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400 dark:text-slate-500">Unicode Tibetan Block: U+0F00 - U+0FFF</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <img src="/logos/monlam-ai.svg" alt="" className="w-4 h-4 opacity-80" width={16} height={16} />
              <span>© 2026 Monlam Font Playground. Built with React, Vite & Tailwind CSS.</span>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                Admin
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for the Himalayan Tibetan community worldwide.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
