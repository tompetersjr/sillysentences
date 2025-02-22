// common.js
function setMainPadding() {
    const header = document.querySelector('.sticky-header');
    const main = document.querySelector('main');
    if (header && main) {
      const headerHeight = header.offsetHeight;
      main.style.paddingTop = `${headerHeight + 10}px`; // Add 10px buffer
      console.log(`Header height: ${headerHeight}px, Padding-top set to: ${main.style.paddingTop}`);
    } else {
      console.error('Header or main element not found');
    }
  }
  
  // Run immediately when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setMainPadding();
  });
  
  // Adjust on resize with minimal debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setMainPadding, 50);
  });
  
  // Adjust on full load for late-arriving resources
  window.addEventListener('load', setMainPadding);
  