// Blocks every zoom-in gesture, touch and trackpad alike, everywhere the
// site runs — phones, tablets, and desktop trackpads.
//
// iOS Safari has ignored the viewport meta's maximum-scale/user-scalable
// since iOS 10 (an intentional WebKit accessibility decision) — pinch-zoom
// can no longer be stopped declaratively there, only by intercepting the
// gesture events directly, which is what this does.

// iOS touch pinch AND macOS trackpad pinch in Safari (Safari fires the same
// proprietary gesture events for both).
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

// Two-finger touch pinch on any touchscreen browser (Chrome/Firefox/Safari).
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// Double-tap-to-zoom.
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

// Trackpad pinch-zoom and Ctrl/Cmd+scroll zoom on desktop Chrome, Firefox,
// and Edge — those browsers surface both as wheel events with ctrlKey set.
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

// Ctrl/Cmd+Plus, Ctrl/Cmd+Minus, Ctrl/Cmd+0 keyboard zoom shortcuts.
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['=', '+', '-', '0'].includes(e.key)) {
    e.preventDefault();
  }
});
