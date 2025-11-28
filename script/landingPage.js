import { LandingPageAPI } from './api.js';

// Load and render landing page dynamically
const loadLandingPage = async () => {
  try {
    const data = await LandingPageAPI.getAll();
    
    if (!data) {
      console.log("Using default content - API not available");
      return;
    }

    const { sections, images } = data;

    // Load hero section
    const heroSection = sections.find(s => s.sectionType === 'hero');
    if (heroSection) {
      updateHeroSection(heroSection, images);
    }

    // Load eligibility section
    const eligibilitySection = sections.find(s => s.sectionType === 'eligibility');
    if (eligibilitySection) {
      updateEligibilitySection(eligibilitySection);
    }

    // Load benefits section
    const benefitsSection = sections.find(s => s.sectionType === 'benefits');
    if (benefitsSection) {
      updateBenefitsSection(benefitsSection);
    }

    // Load political figures
    const politicalSection = sections.find(s => s.sectionType === 'political_figures');
    if (politicalSection) {
      updatePoliticalFigures(politicalSection, images);
    }

    // Load features
    const featuresSection = sections.find(s => s.sectionType === 'features');
    if (featuresSection) {
      updateFeaturesSection(featuresSection);
    }

    // Load opportunities
    const opportunitiesSection = sections.find(s => s.sectionType === 'opportunities');
    if (opportunitiesSection) {
      updateOpportunitiesSection(opportunitiesSection);
    }

    // Load carousel
    const carouselSection = sections.find(s => s.sectionType === 'carousel');
    if (carouselSection) {
      updateCarouselSection(carouselSection, images);
    }

  } catch (error) {
    console.error("Error loading landing page:", error);
  }
};

// Update Hero Section
const updateHeroSection = (section, images) => {
  const heroText = document.querySelector('#hero_text');
  if (heroText && section.content) {
    if (section.content.acceptedText) {
      const acceptedText = heroText.querySelector('.accepted_text');
      if (acceptedText) acceptedText.textContent = section.content.acceptedText;
    }
    if (section.content.heroQuestion) {
      const heroQuestion = heroText.querySelector('.hero_question');
      if (heroQuestion) heroQuestion.textContent = section.content.heroQuestion;
    }
    if (section.content.orangeBoxText) {
      const orangeBox = heroText.querySelector('.orange_box p');
      if (orangeBox) orangeBox.textContent = section.content.orangeBoxText;
    }
    if (section.content.description) {
      const description = heroText.querySelector('.hero_description');
      if (description) {
        description.innerHTML = section.content.description
          .split('\n')
          .map(p => `<p>${p}</p>`)
          .join('');
      }
    }
    if (section.content.buttonText) {
      const button = heroText.querySelector('#reach_out_btn span');
      if (button) button.textContent = section.content.buttonText;
    }
  }

  // Update hero image
  const heroImage = document.querySelector('#pm_image');
  if (heroImage && section.imageUrl) {
    heroImage.src = section.imageUrl;
    if (section.content?.imageAlt) {
      heroImage.alt = section.content.imageAlt;
    }
  }
};

// Update Eligibility Section
const updateEligibilitySection = (section) => {
  if (section.content && section.content.criteria) {
    const criteriaGrid = document.querySelector('.criteria_grid');
    if (criteriaGrid && Array.isArray(section.content.criteria)) {
      // Update existing criteria or create new ones
      section.content.criteria.forEach((criterion, index) => {
        const existingCard = criteriaGrid.children[index];
        if (existingCard) {
          const label = existingCard.querySelector('.criteria_label');
          const value = existingCard.querySelector('.criteria_value');
          if (label) label.textContent = criterion.label;
          if (value) value.textContent = criterion.value;
        }
      });
    }
  }
};

// Update Benefits Section
const updateBenefitsSection = (section) => {
  if (section.content && section.content.benefits) {
    const benefitsGrid = document.querySelector('.benefits_grid');
    if (benefitsGrid && Array.isArray(section.content.benefits)) {
      section.content.benefits.forEach((benefit, index) => {
        const existingCard = benefitsGrid.children[index];
        if (existingCard) {
          const content = existingCard.querySelector('.benefit_content p');
          if (content) content.textContent = benefit.text;
        }
      });
    }
  }
};

// Update Political Figures
const updatePoliticalFigures = (section, images) => {
  if (section.content && section.content.figures) {
    const figures = section.content.figures;
    const figureCards = document.querySelectorAll('.figure_card');
    
    figures.forEach((figure, index) => {
      if (figureCards[index]) {
        const name = figureCards[index].querySelector('.figure_name');
        const title = figureCards[index].querySelector('.figure_title');
        const quote = figureCards[index].querySelector('.figure_quote');
        const img = figureCards[index].querySelector('.figure_image img');
        
        if (name) name.textContent = figure.name;
        if (title) title.textContent = figure.title;
        if (quote) quote.textContent = figure.quote;
        if (img && figure.imageUrl) img.src = figure.imageUrl;
        if (img && figure.alt) img.alt = figure.alt;
      }
    });
  }
};

// Update Features Section
const updateFeaturesSection = (section) => {
  if (section.content && section.content.features) {
    const featuresGrid = document.querySelector('.feature_cards_grid');
    if (featuresGrid && Array.isArray(section.content.features)) {
      section.content.features.forEach((feature, index) => {
        const existingCard = featuresGrid.children[index];
        if (existingCard) {
          const title = existingCard.querySelector('.feature_card_title');
          const description = existingCard.querySelector('.feature_card_description');
          if (title) title.textContent = feature.title;
          if (description) description.textContent = feature.description;
        }
      });
    }
  }
};

// Update Opportunities Section
const updateOpportunitiesSection = (section) => {
  if (section.content && section.content.opportunities) {
    const opportunities = section.content.opportunities;
    const opportunityBlocks = document.querySelectorAll('.opportunity_block');
    
    opportunities.forEach((opp, index) => {
      if (opportunityBlocks[index]) {
        const title = opportunityBlocks[index].querySelector('.opportunity_title');
        const subtitle = opportunityBlocks[index].querySelector('.opportunity_subtitle');
        if (title) title.textContent = opp.title;
        if (subtitle) subtitle.textContent = opp.subtitle;
      }
    });
  }
};

// Update Carousel Section
const updateCarouselSection = (section, images) => {
  if (section.content && section.content.slides) {
    const slides = section.content.slides;
    const slideItems = document.querySelectorAll('.explore_slide_item');
    
    slides.forEach((slide, index) => {
      if (slideItems[index]) {
        const title = slideItems[index].querySelector('.explore_main_title');
        const subtitle = slideItems[index].querySelector('.explore_subtitle');
        const button = slideItems[index].querySelector('.explore_learn_button');
        
        if (title) title.textContent = slide.title;
        if (subtitle) subtitle.textContent = slide.subtitle;
        if (button) button.textContent = slide.buttonText || "LEARN MORE";
      }
    });
  }
};

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLandingPage);
} else {
  loadLandingPage();
}

export { loadLandingPage };

