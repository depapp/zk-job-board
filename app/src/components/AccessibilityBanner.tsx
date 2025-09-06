import React, { useState } from 'react';

/**
 * Accessibility Banner Component
 * Provides accessibility options and privacy status indicators
 */
const AccessibilityBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  // Skip to main content for keyboard navigation
  const skipToMain = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.focus();
      mainElement.scrollIntoView();
    }
  };

  return (
    <>
      {/* Skip Navigation Link (visible on focus) */}
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          skipToMain();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Accessibility Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        aria-label="Accessibility options"
        aria-expanded={isVisible}
      >
        <svg
          className="w-6 h-6 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </button>

      {/* Accessibility Panel */}
      {isVisible && (
        <div
          className="accessibility-panel fixed bottom-20 right-4 z-50 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-6"
          role="dialog"
          aria-label="Accessibility options panel"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Accessibility & Privacy
          </h3>

          {/* Privacy Status */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Privacy Mode Active</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Your personal data never leaves your device. Only zero-knowledge proofs are shared.
            </p>
          </div>

          {/* Font Size Controls */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setFontSize('small');
                  document.documentElement.style.fontSize = '14px';
                }}
                className={`px-3 py-1 rounded-lg ${
                  fontSize === 'small'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={fontSize === 'small'}
              >
                A-
              </button>
              <button
                onClick={() => {
                  setFontSize('normal');
                  document.documentElement.style.fontSize = '16px';
                }}
                className={`px-3 py-1 rounded-lg ${
                  fontSize === 'normal'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={fontSize === 'normal'}
              >
                A
              </button>
              <button
                onClick={() => {
                  setFontSize('large');
                  document.documentElement.style.fontSize = '18px';
                }}
                className={`px-3 py-1 rounded-lg ${
                  fontSize === 'large'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={fontSize === 'large'}
              >
                A+
              </button>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => {
                  setHighContrast(e.target.checked);
                  document.documentElement.classList.toggle('high-contrast');
                }}
                className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-500"
                aria-label="Toggle high contrast mode"
              />
              <span className="text-sm text-gray-700">High Contrast Mode</span>
            </label>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Keyboard Shortcuts
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                <kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> - Navigate elements
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> - Activate buttons
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> - Close dialogs
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-100 rounded">?</kbd> - Show help
              </li>
            </ul>
          </div>

          {/* Screen Reader Notice */}
          <div className="text-xs text-gray-600 border-t border-gray-200 pt-3">
            <p>
              This site is optimized for screen readers. All interactive elements have proper ARIA labels.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-sm text-white transition-colors"
            aria-label="Close accessibility panel"
          >
            Close
          </button>
        </div>
      )}

      {/* Live Region for Screen Readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isVisible ? 'Accessibility panel opened' : 'Accessibility panel closed'}
      </div>
    </>
  );
};

export default AccessibilityBanner;
