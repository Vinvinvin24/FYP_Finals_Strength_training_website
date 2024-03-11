let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
}

// Auto-slide
function autoShowSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(autoShowSlides, 5000); // Change image every 5 seconds
}

autoShowSlides(); // Call the function to start the slideshow

let isTextSizeIncreased = false;

document.getElementById('toggleTextSize').addEventListener('click', function() {
  
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
      el.style.fontSize = '28px'; 
    });
    isTextSizeIncreased = true;
  }
});