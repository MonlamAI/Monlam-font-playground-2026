import React from 'react';
import { Layers, Code, CheckCircle, Sparkles, HelpCircle, Check, Copy } from 'lucide-react';
import {
  DISSECTED_SYLLABLE_BGRUBS,
  TIBETAN_VOWELS,
  SUBJOINED_LETTERS,
  SUPERSCRIPT_LETTERS,
  TIBETAN_ALPHABET
} from '../data/tibetanData';
import { MONLAM_FONTS } from '../data/fontsData';
import { fontAssetLabel } from '../utils/fontDisplay';

export const TypographyGuide: React.FC = () => {
  const [activeComponentId, setActiveComponentId] = React.useState<string>('ming-zhi');
  const [selectedSubjoinGroup, setSelectedSubjoinGroup] = React.useState(0);
  const [previewFont, setPreviewFont] = React.useState(MONLAM_FONTS[0].id);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const activeComponent =
    DISSECTED_SYLLABLE_BGRUBS.find((c) => c.id === activeComponentId) || DISSECTED_SYLLABLE_BGRUBS[2];

  const currentFont = MONLAM_FONTS.find((f) => f.id === previewFont) || MONLAM_FONTS[0];

  const cssGuideSnippet = `/* Production-grade Tibetan OpenType Web Typography */
.tibetan-typography {
  font-family: 'Monlam Uni OuChan 1', 'Noto Serif Tibetan', 'Jomolhari', serif;
  /* Ensure browser utilizes OpenType contextual alternates & shaping */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Critical OpenType Layout Features for Tibetan ligatures */
  font-feature-settings: 
    "calt" 1, /* Contextual Alternates */
    "ccmp" 1, /* Glyph Composition/Decomposition */
    "blws" 1, /* Below-base Substitutions (Subjoined letters) */
    "abvs" 1, /* Above-base Substitutions (Superscripts & vowels) */
    "psts" 1; /* Post-base Substitutions (Tsheg & Shad spacing) */
  
  /* CRITICAL: Generous line-height prevents high vowels (ི, ེ, ོ) */
  /* and deep descenders (ྲ, ྱ, ླ, ུ) from being clipped */
  line-height: 1.85;
  overflow: visible;
}`;

  const handleCopyCss = () => {
    navigator.clipboard.writeText(cssGuideSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* SECTION 1: INTERACTIVE SYLLABLE DISSECTOR (བསྒྲུབས) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-slate-400">Render in:</span>
            <select
              value={previewFont}
              onChange={(e) => setPreviewFont(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg font-semibold text-gray-800 dark:text-slate-200"
            >
              {MONLAM_FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {fontAssetLabel(f)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Syllable Visual Anatomy Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
          {/* Left: Giant Dissected Syllable Diagram */}
          <div className="lg:col-span-6 bg-gradient-to-b from-gray-50 to-slate-100/70 dark:from-slate-800 dark:to-slate-900/70 p-8 rounded-2xl border border-gray-200/80 dark:border-slate-700 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="text-xs text-gray-400 dark:text-slate-500 font-mono mb-4">
              Compound Syllable: /sgrubs/ (accomplished / practiced)
            </div>

            {/* Syllable Assembly Display */}
            <div className="flex items-center gap-4 text-center select-none">
              {/* 1. Prefix: Ba */}
              <button
                onClick={() => setActiveComponentId('ngon-jug')}
                className={`p-3 rounded-xl border-2 transition ${
                  activeComponentId === 'ngon-jug'
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-4 ring-blue-100'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`${currentFont.cssClass} tibetan-text text-5xl text-blue-600 block`}>
                  བ
                </span>
                <span className="text-[10px] font-bold text-blue-700 block mt-1">Prefix</span>
              </button>

              {/* 2. Central Vertical Stack: Sa + Ga + Ra + U */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                {/* Superscript Sa */}
                <button
                  onClick={() => setActiveComponentId('go-chan')}
                  className={`px-3 py-1 rounded-lg border-2 transition ${
                    activeComponentId === 'go-chan'
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`${currentFont.cssClass} tibetan-text text-3xl text-purple-600 block`}>
                    ས
                  </span>
                  <span className="text-[9px] font-bold text-purple-700 block">Superscript</span>
                </button>

                {/* Root Ga */}
                <button
                  onClick={() => setActiveComponentId('ming-zhi')}
                  className={`px-4 py-1 my-1 rounded-lg border-2 transition ${
                    activeComponentId === 'ming-zhi'
                      ? 'border-red-500 bg-red-50 ring-4 ring-red-100 shadow-xs'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`${currentFont.cssClass} tibetan-text text-5xl text-red-600 font-bold block`}>
                    ག
                  </span>
                  <span className="text-[10px] font-bold text-red-700 block">ROOT LETTER</span>
                </button>

                {/* Subscript Ra-ta */}
                <button
                  onClick={() => setActiveComponentId('tag-chan')}
                  className={`px-3 py-1 rounded-lg border-2 transition ${
                    activeComponentId === 'tag-chan'
                      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`${currentFont.cssClass} tibetan-text text-3xl text-amber-600 block`}>
                    ྲ
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 block">Subscript</span>
                </button>

                {/* Vowel Zhabs-kyu */}
                <button
                  onClick={() => setActiveComponentId('yang')}
                  className={`px-3 py-1 rounded-lg border-2 transition ${
                    activeComponentId === 'yang'
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`${currentFont.cssClass} tibetan-text text-3xl text-emerald-600 block`}>
                    ུ
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 block">Vowel (u)</span>
                </button>
              </div>

              {/* 3. Suffix: Ba */}
              <button
                onClick={() => setActiveComponentId('je-jug')}
                className={`p-3 rounded-xl border-2 transition ${
                  activeComponentId === 'je-jug'
                    ? 'border-pink-500 bg-pink-50 shadow-md ring-4 ring-pink-100'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`${currentFont.cssClass} tibetan-text text-5xl text-pink-600 block`}>
                  བ
                </span>
                <span className="text-[10px] font-bold text-pink-700 block mt-1">Suffix</span>
              </button>

              {/* 4. Post-suffix: Sa */}
              <button
                onClick={() => setActiveComponentId('yang-jug')}
                className={`p-3 rounded-xl border-2 transition ${
                  activeComponentId === 'yang-jug'
                    ? 'border-cyan-500 bg-cyan-50 shadow-md ring-4 ring-cyan-100'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`${currentFont.cssClass} tibetan-text text-5xl text-cyan-600 block`}>
                  ས
                </span>
                <span className="text-[10px] font-bold text-cyan-700 block mt-1">Post-suffix</span>
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-slate-400">
              Complete ligature shaped by OpenType engine: <strong className="tibetan-text text-lg text-gray-900 dark:text-slate-100">བསྒྲུབས</strong>
            </div>
          </div>

          {/* Right: Component Deep Dive Inspector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: activeComponent.color }}
                  ></span>
                  <p className="font-bold text-gray-900 dark:text-slate-100 text-base">{activeComponent.name}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 tibetan-text">
                  {activeComponent.tibetanName} ({activeComponent.wylieName})
                </span>
              </div>

              <div className="py-4 space-y-3 text-xs text-gray-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-slate-200 block mb-0.5">Description:</span>
                  <p className="leading-relaxed">{activeComponent.description}</p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-800">
                  <span className="font-semibold text-gray-800 dark:text-slate-200 block mb-0.5">Linguistic & Typographic Rule:</span>
                  <p className="leading-relaxed">{activeComponent.rule}</p>
                </div>
              </div>

              {/* Component Selector Buttons */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {DISSECTED_SYLLABLE_BGRUBS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComponentId(comp.id)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                      activeComponentId === comp.id
                        ? 'bg-gray-900 dark:bg-slate-700 text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {comp.name} ({comp.char})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE FOUR VOWELS (དབྱངས་བཞི) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIBETAN_VOWELS.map((v) => (
            <div
              key={v.name}
              className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition text-center space-y-2"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                <span className={`${currentFont.cssClass} tibetan-text text-4xl text-emerald-600 font-bold`}>
                  {v.example.split(' ')[0]}
                </span>
              </div>
              <p className="font-bold text-gray-900 dark:text-slate-100 text-sm">
                {v.name} <span className="tibetan-text text-gray-600 dark:text-slate-400 font-normal">({v.tibetanName})</span>
              </p>
              <div className="text-xs text-gray-500 dark:text-slate-400 space-y-1">
                <div>Sound: <strong className="text-gray-800 dark:text-slate-200">/{v.vowel}/</strong></div>
                <div>Position: <strong>{v.position}</strong></div>
                <div className="font-mono text-[10px] text-gray-400 dark:text-slate-500">{v.unicode}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: SUBJOINED & SUPERSCRIPT CONSONANT STACKS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
        {/* Subjoined Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700 pb-2 overflow-x-auto">
            {SUBJOINED_LETTERS.map((s, idx) => (
              <button
                key={s.name}
                onClick={() => setSelectedSubjoinGroup(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  selectedSubjoinGroup === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {s.name} ({s.sign})
              </button>
            ))}
          </div>

          {/* Subjoined Examples Grid */}
          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
            <p className="mb-4 text-xs text-gray-500 dark:text-slate-400">
              {SUBJOINED_LETTERS[selectedSubjoinGroup].description}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
              {SUBJOINED_LETTERS[selectedSubjoinGroup].examples.map((ex, i) => (
                <div
                  key={ex}
                  className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 text-center shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition"
                >
                  <span className={`${currentFont.cssClass} tibetan-text text-3xl text-gray-900 dark:text-slate-100 block`}>
                    {ex}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400 block mt-1">
                    {SUBJOINED_LETTERS[selectedSubjoinGroup].wylieExamples[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: WEB OPENTYPE TYPOGRAPHY & CSS IMPLEMENTATION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied CSS!' : 'Copy Snippet'}</span>
          </button>
        </div>

        <div className="mt-4 bg-slate-950 text-slate-100 rounded-xl p-5 overflow-x-auto font-mono text-xs leading-relaxed border border-slate-800">
          <pre>{cssGuideSnippet}</pre>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-slate-400">
          <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
            <strong className="text-gray-900 dark:text-slate-100 block mb-1">1. Anti-Clipping Rule</strong>
            Always specify <code className="text-blue-600 dark:text-blue-400">line-height: 1.8</code> or higher. Tibetan vowels sit high above the x-height line.
          </div>
          <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
            <strong className="text-gray-900 dark:text-slate-100 block mb-1">2. Ligature Enablement</strong>
            Activate <code className="text-blue-600 dark:text-blue-400">font-feature-settings: "calt" 1, "ccmp" 1, "blws" 1</code> so Harfbuzz & DirectWrite render below-base stacks.
          </div>
          <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
            <strong className="text-gray-900 dark:text-slate-100 block mb-1">3. Word Breaking</strong>
            Use <code className="text-blue-600 dark:text-blue-400">word-break: break-all</code> and delimiter <code className="text-blue-600 dark:text-blue-400">་ (U+0F0B)</code> for authentic syllable boundary wrapping.
          </div>
        </div>
      </div>
    </div>
  );
};
