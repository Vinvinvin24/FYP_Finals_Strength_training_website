let isTextSizeIncreased = false;

document.getElementById('toggleTextSize').addEventListener('click', function() {
  // Target specific elements for resizing. Adjust selectors as needed.
  const elementsToResize = document.querySelectorAll('main, main p, .text-container p');

  if (isTextSizeIncreased) {
    // Reset font sizes
    elementsToResize.forEach(el => {
      el.style.fontSize = ''; // Resets to the stylesheet default
    });
    isTextSizeIncreased = false;
  } else {
    // Increase font sizes
    elementsToResize.forEach(el => {
      el.style.fontSize = '28px'; // Changed to use px
    });
    isTextSizeIncreased = true;
  }
});