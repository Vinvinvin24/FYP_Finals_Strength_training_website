let isTextSizeIncreased = false;

document.getElementById('toggleTextSize').addEventListener('click', function() {
  
  const elementsToResize = document.querySelectorAll('main, main p, .text-container p');

  if (isTextSizeIncreased) {
    // Reset font sizes
    elementsToResize.forEach(el => {
      el.style.fontSize = ''; 
    });
    isTextSizeIncreased = false;
  } else {
    // Increase font sizes
    elementsToResize.forEach(el => {
      el.style.fontSize = '28px'; 
    });
    isTextSizeIncreased = true;
  }
});