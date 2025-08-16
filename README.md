# Sensitive Beings - Art Exhibition Website

A sophisticated, interactive website for the "Sensitive Beings" art exhibition featuring dynamic backgrounds, 3D carousel galleries, and integrated artwork images.

## 🎨 Features

### **Main Landing Page** (`index.html`)
- **Dynamic Wave Background**: Interactive wave animations inspired by the background components
- **Shadow Overlay Effects**: Sophisticated visual effects with blur and gradient overlays  
- **Smooth Animations**: Parallax scrolling and fade-in effects
- **Exhibition Information**: Complete details about dates, location, and organizers
- **Chapter Previews**: Interactive cards showcasing the two exhibition themes

### **Artworks Gallery** (`artworks.html`)
- **3D Carousel**: Sophisticated carousel with perspective transforms inspired by gallery components
- **Real Artwork Images**: 66 images extracted from docx/pptx files and organized by artist
- **Chapter Filtering**: Filter between "The Replicated Self" and "The Rewilded Senses"
- **Artist Modals**: Detailed artwork information with pricing and descriptions
- **Responsive Design**: Touch gestures and mobile-optimized interactions

### **Workshops Timeline** (`workshops.html`)  
- **Timeline Carousel**: Horizontal scrolling timeline showcasing 5 weeks of events
- **Interactive Events**: Detailed workshop descriptions with tags and booking info
- **Responsive Cards**: Week-by-week breakdown with visual hierarchy
- **Event Categories**: Color-coded tags for different workshop types

## 🖼️ Image Integration

- **66 Total Images**: Extracted from pricing.docx (27) and artist and artwork.pptx (39)
- **Organized by Artist**: Images automatically mapped to 13 featured artists
- **Smart Loading**: Lazy loading with fallback placeholders
- **Database Driven**: JSON database linking artworks to images

## 🎯 Design Principles

- **Color Scheme**: Black (#000000), Orange (#E56E4B), White backgrounds
- **Typography**: Modern sans-serif for headings, elegant serif for artistic elements  
- **Interactions**: Hover effects, smooth transitions, and 3D transforms
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 📁 Project Structure

```
sensitive_beings/
├── index.html                 # Main landing page
├── artworks.html             # Gallery with 3D carousel
├── workshops.html            # Workshop timeline
├── styles/
│   ├── main.css             # Landing page styles
│   ├── gallery.css          # Gallery carousel styles
│   └── workshops.css        # Workshop timeline styles
├── scripts/
│   ├── waves.js            # Dynamic wave animations
│   ├── main.js             # Main page interactions
│   ├── gallery-carousel.js # 3D artwork carousel
│   ├── gallery.js          # Gallery utilities
│   ├── artwork-loader.js   # Image loading system
│   └── workshop-carousel.js # Workshop timeline
├── images/                  # Organized artwork images
│   ├── chris_bowes/
│   ├── jun_wu/
│   ├── haojun_yang/
│   └── [13 artist directories]
├── extracted_content/       # Content from docx/pptx
├── artwork_database.json    # Artist and artwork data
└── README.md               # This file
```

## 🚀 Getting Started

1. **Clone or download** all files
2. **Open `index.html`** in a modern web browser
3. **Navigate** between pages using the top navigation
4. **Explore** the interactive elements and galleries

## 📋 Exhibition Details

**Dates**: 23.8.2025 – 16.9.2025  
**Location**: Kindred Cameras, 454 Docklands Dr, Docklands VIC 3008  
**Opening Night**: 22.8.2025, 18:00–21:00  

### Featured Artists (13 total)

**Chapter 1: The Replicated Self**
- Chris Bowes - Digital Interactive Art
- Jun Wu - Screen Printing  
- Haojun Yang - Oil Painting
- Sharleen Cu - Mixed Media

**Chapter 2: The Rewilded Senses**
- Jiahong Lang - Digital Interactive Media
- Heng Wang - Photography
- Frank James Meuschke - Photography
- Vivian Qiu - Mixed Media Sculpture
- Qianxun Li - Fine Crafts
- Yilin Zhang - Painting & Mixed Media
- Bei Han - Mineral Pigment Painting
- Shiyin Li - Digital & Traditional Painting
- Marina Rodriguez - Ceramics

## 🔧 Technical Features

- **Vanilla HTML/CSS/JavaScript** - No framework dependencies
- **Modern CSS**: Grid, Flexbox, Custom Properties, Backdrop Filter
- **ES6+ JavaScript**: Classes, Async/Await, Modules
- **Performance Optimized**: Lazy loading, Intersection Observer
- **Mobile Responsive**: Touch gestures, flexible layouts
- **Cross-Browser Compatible**: Modern browser support

## 🎭 Interactive Elements

- Wave animations respond to mouse movement
- 3D carousel with perspective transforms  
- Smooth scrolling and parallax effects
- Hover states and micro-interactions
- Modal overlays for detailed artwork view
- Touch gesture support for mobile devices

## 📱 Browser Support

- Chrome 80+
- Firefox 72+
- Safari 13+
- Edge 80+

## 🔄 Development Notes

The website uses a hybrid approach:
- **Static content** for fast loading and SEO
- **Dynamic image loading** for artwork galleries
- **Progressive enhancement** for advanced features
- **Graceful degradation** for older browsers

## 📄 License

Created for the Sensitive Beings Exhibition 2025. All artwork images and content belong to their respective artists and organizers.

---

*"Let echo trace the edge of sense"*