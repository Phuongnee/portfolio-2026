// Define background colors for each slide
const backgroundColors = {
    0: "#CCE4D1", // Slide 1
    1: "#D1E2FF", // Slide 2
    2: "#FFD1DC", // Slide 3 (Add more as needed)
    3: "#F3D1FF"  // Slide 4 (Add more as needed)
};

// Swiper Configuration
var swiper = new Swiper(".swiper-container", {
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    effect: "fade", // Smooth fade effect
    speed: 800,
    on: {
        slideChangeTransitionStart: function () {
            // Hide all slides except the active one
            document.querySelectorAll(".swiper-slide").forEach(slide => {
                slide.style.opacity = "0"; // Fade out previous slides
            });

            // Show the active slide
            document.querySelector(".swiper-slide-active").style.opacity = "1";

            // Change background color based on active slide
            let currentIndex = swiper.realIndex; // Get active slide index
            if (backgroundColors.hasOwnProperty(currentIndex)) {
                document.body.style.backgroundColor = backgroundColors[currentIndex];
            }
        }
    }
});

