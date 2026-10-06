import React from 'react';
import {
  Download,
  Laptop,
  Apple,
  Terminal,
  Smartphone,
  Sparkles,
  ExternalLink,
  FileArchive
} from 'lucide-react';
import { FontItem } from '../types/font';
import { downloadSingleFont } from '../utils/fontDownloader';
import {
  BODYIG_SUITE,
  OFFICIAL_BODYIG_DOWNLOADS,
  OFFICIAL_KEYBOARD_DOWNLOADS,
  openOfficialDownload
} from '../data/officialDownloads';

interface InstallGuideProps {
  allFonts: FontItem[];
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ allFonts }) => {
  const [activeOs, setActiveOs] = React.useState<'windows' | 'mac' | 'linux' | 'mobile'>('windows');

  const macDownload = OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === 'mac')!;
  const winDownload = OFFICIAL_BODYIG_DOWNLOADS.find((d) => d.platform === 'windows')!;
  const winKeyboard = OFFICIAL_KEYBOARD_DOWNLOADS.find((d) => d.id === 'bodyig-keyboard-win-2025');
  const iosKeyboard = OFFICIAL_KEYBOARD_DOWNLOADS.find((d) => d.platform === 'ios');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <img
            src="/logos/bodyig.svg"
            alt="Monlam Bodyig"
            className="w-9 h-9 shrink-0"
            width={36}
            height={36}
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Download & Installation Center</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 max-w-3xl">
          Get official Monlam IT Tibetan fonts, keyboard layouts, and step-by-step installation instructions for your operating system.
          Choose Mac or Windows for the complete Font &amp; Keyboard Suite, or download individual .ttf assets below.
        </p>
      </div>

      {/* DOWNLOAD PACKAGES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Official Font & Keyboard Suite (Mac / Windows) */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-blue-800/50 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Font &amp; Keyboard Suite</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {BODYIG_SUITE.name} {BODYIG_SUITE.version}
            </h3>
            <p className="text-sm tibetan-text text-blue-200/90 mt-1">{BODYIG_SUITE.tibetanName}</p>
            <p className="text-sm text-blue-200/90 mt-2 leading-relaxed">{BODYIG_SUITE.description}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-blue-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-md">✓ Full typeface set</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md">✓ Keyboard installers</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md">✓ Mac &amp; Windows</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <p className="text-xs text-blue-200/80 font-medium">Select your operating system:</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => openOfficialDownload(macDownload.url)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-semibold text-sm transition active:scale-95 shadow-md"
              >
                <Apple className="w-4 h-4" />
                <span>{macDownload.label}</span>
              </button>
              <button
                type="button"
                onClick={() => openOfficialDownload(winDownload.url)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition active:scale-95 shadow-md"
              >
                <Laptop className="w-4 h-4" />
                <span>{winDownload.label}</span>
              </button>
            </div>
            <a
              href={BODYIG_SUITE.sourcePage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Source: monlamit.com/software/2</span>
            </a>
          </div>
        </div>

        {/* Card 2: Individual / selected assets guidance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
              <FileArchive className="w-3.5 h-3.5" />
              <span>Individual &amp; selected assets</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
              Typeface asset downloads
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">
              Prefer specific fonts? Use the catalog <strong>+</strong> button to add typefaces to your selection, then download only those as a .zip — or grab a single .ttf from the list below. Individual .ttf files work on both Mac and Windows.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-slate-400">
              <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">{allFonts.length} typefaces listed</span>
              <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">Selected-only ZIP</span>
              <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">Cross-platform .ttf</span>
            </div>

            {(winKeyboard || iosKeyboard) && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">Additional keyboard downloads</p>
                <div className="flex flex-wrap gap-2">
                  {winKeyboard && (
                    <button
                      type="button"
                      onClick={() => openOfficialDownload(winKeyboard.url)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      {winKeyboard.label}
                    </button>
                  )}
                  {iosKeyboard && (
                    <a
                      href={iosKeyboard.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      {iosKeyboard.label}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
            Custom ZIP packages (selected fonts only) are available from the header <strong>Selected</strong> bag or <strong>Font &amp; Keyboard Suite</strong> menu after you choose typefaces.
          </div>
        </div>
      </div>

      {/* OS STEP-BY-STEP INSTALLATION GUIDES */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">How to Install on Your Computer & Phone</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Select your operating system for verified step-by-step instructions.
            </p>
          </div>

          {/* OS Switcher */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveOs('windows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeOs === 'windows' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Windows</span>
            </button>
            <button
              onClick={() => setActiveOs('mac')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeOs === 'mac' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>macOS</span>
            </button>
            <button
              onClick={() => setActiveOs('linux')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeOs === 'linux' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Linux</span>
            </button>
            <button
              onClick={() => setActiveOs('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeOs === 'mobile' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iOS & Android</span>
            </button>
          </div>
        </div>

        {/* WINDOWS GUIDE */}
        {activeOs === 'windows' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Install Font Files (.ttf)</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                Download the font bundle and extract the <code className="text-blue-600 dark:text-blue-400">.zip</code>. Select all <code className="text-blue-600 dark:text-blue-400">.ttf</code> files, right-click, and select <strong>"Install for all users"</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Enable Windows Tibetan Keyboard</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                Open <strong>Settings &gt; Time & Language &gt; Language & Region</strong>. Click <strong>"Add a language"</strong>, search for <strong>Tibetan (བོད་སྐད)</strong>, and install it.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Switch Keyboards & Type</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded text-[11px] font-mono shadow-xs">Win + Space</kbd> anytime to toggle between English and Tibetan. Open Word, Notepad, or your browser and start typing!
              </p>
            </div>
          </div>
        )}

        {/* MACOS GUIDE */}
        {activeOs === 'mac' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Install via Font Book</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                Open <strong>Font Book</strong> (in Applications or Spotlight). Drag and drop the downloaded <code className="text-blue-600 dark:text-blue-400">.ttf</code> files into the Font Book window and click <strong>Install</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Add Input Source</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                Go to <strong>System Settings &gt; Keyboard &gt; Text Input</strong>. Click <strong>Edit...</strong> or the <strong>+</strong> button. Search for <strong>"Tibetan"</strong> and add <strong>Tibetan - QWERTY</strong> or <strong>Tibetan - Otani</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Fast Switching</h4>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                Check <em>"Show Input menu in menu bar"</em>. Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded text-[11px] font-mono shadow-xs">Ctrl + Space</kbd> to seamlessly switch between English and Tibetan.
              </p>
            </div>
          </div>
        )}

        {/* LINUX GUIDE */}
        {activeOs === 'linux' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-600 dark:text-slate-400">
              On Ubuntu, Debian, Arch, or Fedora, fonts can be installed locally and activated via fontconfig:
            </p>
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1">
              <div className="text-emerald-400"># 1. Create local font directory and copy TTF files</div>
              <div>mkdir -p ~/.local/share/fonts/monlam</div>
              <div>cp *.ttf ~/.local/share/fonts/monlam/</div>
              <div className="text-emerald-400 pt-2"># 2. Rebuild the font cache</div>
              <div>fc-cache -f -v</div>
              <div className="text-emerald-400 pt-2"># 3. For typing, install Tibetan input engine</div>
              <div>sudo apt install ibus-m17n m17n-db</div>
            </div>
          </div>
        )}

        {/* MOBILE GUIDE */}
        {activeOs === 'mobile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-gray-800 dark:text-slate-200" />
                <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">iOS / iPhone / iPad</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                1. Open <strong>Settings &gt; General &gt; Keyboard &gt; Keyboards</strong>.<br />
                2. Tap <strong>Add New Keyboard...</strong> and choose <strong>Tibetan</strong>.<br />
                3. You can now tap the Globe 🌐 icon in any app to type Tibetan directly.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm">Android / Samsung / Pixel</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                1. In <strong>Gboard Settings</strong>, tap <strong>Languages &gt; Add keyboard</strong> and select <strong>Tibetan</strong>.<br />
                2. Alternatively, install the official <strong>Monlam Tibetan Keyboard</strong> from the Google Play Store for Geshe Monlam’s specialized layout.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* INDIVIDUAL FONT ASSET DIRECT DOWNLOAD TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base">Direct Font Asset Downloads</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Individual .ttf files work on both Mac and Windows. For the full Font &amp; Keyboard installer, use the Mac / Windows buttons above.
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start">
            {allFonts.length} Typefaces Available
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800 overflow-x-auto">
          {allFonts.map((font) => (
            <div
              key={font.id}
              className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold text-gray-700 dark:text-slate-300 text-lg tibetan-text">
                  {font.sampleText.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm">{font.name}</span>
                    <span className="text-xs text-gray-500 dark:text-slate-400 tibetan-text">({font.tibetanName})</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                    <span>{font.category}</span>
                    <span>•</span>
                    <span>{font.fileSize}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{font.filename}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Mac &amp; Windows</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => downloadSingleFont(font)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ttf</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
