const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    alt: "Students collaborating during internship project workshop",
  },
  {
    src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
    alt: "Professional mentor guiding graduates through interview prep",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    alt: "Engineering students researching with laptops and textbooks",
  },
  {
    src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80",
    alt: "Young intern presenting data insights to team lead",
  },
];

const HERO_SLIDER_INTERVAL = 6500;

const preloadImages = (images) => {
  images.forEach(({ src }) => {
    const img = new Image();
    img.src = src;
  });
};

const startHeroSlider = () => {
  const heroImg = document.getElementById("pm_image");
  if (!heroImg) return;

  // Merge the image currently rendered (if any) to the rotation list (avoid duplicates)
  const currentSrc = heroImg.currentSrc || heroImg.src;
  const currentAlt = heroImg.alt || "Internship spotlight";
  const rotation = [...HERO_IMAGES];

  if (currentSrc && !rotation.find((item) => item.src === currentSrc)) {
    rotation.unshift({ src: currentSrc, alt: currentAlt });
  }

  if (rotation.length <= 1) return;

  preloadImages(rotation);

  let index = 1;

  const swapImage = () => {
    const next = rotation[index];
    heroImg.classList.add("hero-image-fade-out");

    setTimeout(() => {
      heroImg.src = next.src;
      heroImg.alt = next.alt;
      heroImg.classList.remove("hero-image-fade-out");
      heroImg.classList.add("hero-image-fade-in");

      setTimeout(() => {
        heroImg.classList.remove("hero-image-fade-in");
      }, 400);
    }, 250);

    index = (index + 1) % rotation.length;
  };

  // Delay the first swap slightly so that the landing page API can update the hero image if needed
  setTimeout(() => {
    swapImage();
    setInterval(swapImage, HERO_SLIDER_INTERVAL);
  }, 2000);
};

const initHeroSlider = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHeroSlider, { once: true });
  } else {
    startHeroSlider();
  }
};

initHeroSlider();

