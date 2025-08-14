// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  // Ignore errors from share-modal.js if they're not critical
  if (event.filename && event.filename.includes('share-modal.js')) {
    event.preventDefault();
    console.warn('Non-critical error in share-modal.js:', event.message);
    return false;
  }
  
  // Log other errors
  console.error('Uncaught error:', event.error || event.message);
  return false;
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});
