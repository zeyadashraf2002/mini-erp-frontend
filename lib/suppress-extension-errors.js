// Suppress browser extension errors
if (typeof window !== 'undefined') {
  // Suppress "Could not establish connection" errors from browser extensions
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('Could not establish connection') ||
      message.includes('Receiving end does not exist') ||
      message.includes('Extension context invalidated') ||
      message.includes('chrome-extension://')
    ) {
      // Silently ignore these errors
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('Could not establish connection') ||
      message.includes('Extension context invalidated')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Suppress unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || '';
    if (
      message.includes('Could not establish connection') ||
      message.includes('Extension context invalidated') ||
      message.includes('chrome-extension://')
    ) {
      event.preventDefault();
      return;
    }
  });

  // Suppress error events from extensions
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (
      message.includes('Could not establish connection') ||
      message.includes('Extension context invalidated') ||
      message.includes('chrome-extension://')
    ) {
      event.preventDefault();
      return false;
    }
  }, true);
}
