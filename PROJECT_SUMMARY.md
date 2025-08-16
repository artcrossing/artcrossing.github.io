# Sensitive Beings Exhibition Website - Project Summary

## Overview
Created a comprehensive website for the "Sensitive Beings" art exhibition featuring a landing page, artwork gallery, and workshop timeline. The website showcases work from 13 artists across two thematic chapters, with interactive carousels and sophisticated visual design.

## Final Project Structure

```
sensitive_beings/
├── index.html                 # Main landing page with hero section and wave animations
├── artworks.html             # Gallery carousel showcasing all artworks  
├── workshops.html            # Workshop timeline with event details
├── styles/
│   ├── main.css             # Landing page styles with radio wave visualization
│   ├── gallery.css          # Sophisticated carousel and artwork card design
│   └── workshops.css        # Timeline carousel and event card styling
├── scripts/
│   ├── waves.js             # Radio wave visualization with concentric circles
│   ├── gallery-carousel.js  # 3D carousel with navigation and touch support
│   ├── workshop-carousel.js # Timeline navigation with smooth transitions
│   ├── artwork-loader.js    # Dynamic image loading and fallback system
│   ├── navigation.js        # Consistent pill-style navigation utility
│   └── main.js             # General page interactions
├── images/                  # Organized artwork images by artist
│   ├── chris_bowes/
│   ├── jun_wu/
│   ├── haojun_yang/
│   ├── [... other artists]
├── artwork_database.json   # Complete artwork metadata and image mappings
├── extracted_content/      # Content extracted from original office files
└── content files/          # Original PowerPoint and Word documents
```

## Key Features Implemented

### 1. Landing Page (index.html)
- **Hero Section**: Large title with sophisticated overlay effects
- **Radio Wave Visualization**: Dynamic SVG animation with concentric circles and flowing patterns
- **Exhibition Information**: Dates, venue, and opening details in styled cards
- **Chapter Previews**: Introduction to both exhibition themes
- **Visit Information**: Hours, location, and team details

### 2. Artwork Gallery (artworks.html)  
- **3D Carousel**: Sophisticated slide system with perspective transforms
- **Chapter Filtering**: Toggle between "The Replicated Self" and "The Rewilded Senses"
- **Real Artwork Images**: Properly mapped from PowerPoint presentation
- **Enhanced Cards**: Professional layout with detailed artwork information
- **Navigation**: Left/right arrows, keyboard support, touch/swipe gestures
- **Modal System**: Detailed artwork view on click

### 3. Workshop Timeline (workshops.html)
- **5-Week Timeline**: Horizontal scrolling carousel showing all events
- **Event Details**: Complete information for each workshop and special event
- **Timeline Navigation**: Arrow buttons and week indicators
- **Event Types**: Color-coded tags for different workshop categories
- **Registration Information**: Booking details and contact information

### 4. Visual Design System
- **Consistent Navigation**: Pill-style navigation bars across all pages
- **Color Palette**: Black (#000000), accent orange (#E56E4B), and neutral grays
- **Typography**: System fonts with serif accents for artist names
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Proper ARIA labels, keyboard navigation, and contrast ratios

## Technical Implementation

### Navigation System
- **Pill-Style Design**: Centered navigation with backdrop blur and glow effects
- **Active States**: Lamp-like glow animation for current page indicators
- **Scroll Behavior**: Navigation adapts on scroll with subtle animations
- **Mobile Responsive**: Simplified navigation for smaller screens

### Gallery Carousel
- **3D Transforms**: CSS transforms for depth and perspective effects
- **Smooth Transitions**: Cubic-bezier easing for professional animations
- **Touch Support**: Swipe gestures for mobile and tablet navigation
- **Performance Optimized**: Intersection Observer and lazy loading
- **Debug System**: Comprehensive logging for troubleshooting

### Workshop Timeline  
- **Horizontal Scrolling**: Smooth timeline navigation between weeks
- **Event Cards**: Rich information display with tags and descriptions
- **Interactive Elements**: Hover effects and click animations
- **Timeline Indicators**: Visual progress through the 5-week program

### Image Management
- **Organized Structure**: Images sorted by artist based on PowerPoint slides
- **Database Integration**: JSON database with proper artwork mappings
- **Fallback System**: Enhanced placeholder graphics when images don't load
- **Lazy Loading**: Performance optimization with intersection observers

## Content Organization

### Artists and Artworks
**Chapter 1 - The Replicated Self:**
- Chris Bowes (Digital Interactive Art) - 1 artwork
- Jun Wu (Screen Printing) - 2 artworks  
- Haojun Yang (Oil Painting) - 3 artworks
- Sharleen Cu (Mixed Media) - 1 artwork

**Chapter 2 - The Rewilded Senses:**
- Jiahong Lang (Digital Interactive Media) - 2 artworks
- Heng Wang (Photography) - 1 artwork
- Frank James Meuschke (Photography) - 4 artworks
- Vivian Qiu (Mixed Media Sculpture) - 2 artworks
- Qianxun Li (Fine Crafts) - 5 artworks
- Yilin Zhang (Painting) - 3 artworks
- Bei Han (Mineral Pigment Art) - 1 artwork
- Shiyin Li (Digital Art) - 1 artwork
- Marina Rodriguez (Ceramics) - 2 artworks

### Workshop Schedule
- **Week 1**: Exhibition Opening Night (Aug 22)
- **Week 2**: Emotion-Inspired Painting Workshop & Chinese Scent Studio
- **Week 3**: Artist Sculpture Workshop & Chinese Scent Studio (English)
- **Week 4**: Rice Painting & Clay Sculpture with Vivian + Repeat Painting Workshop
- **Week 5**: Beyond Identity® "The Void" Closing Night Performance (Sep 16)

## File Processing Pipeline

### Content Extraction
1. **extract_content.py**: Extracted text content from PowerPoint and Word files
2. **Image Organization**: Used Python script to properly map presentation images to artists
3. **Database Creation**: Built comprehensive JSON database with artwork metadata
4. **Quality Control**: Verified image-artwork associations against original presentation

### Image Processing
- **Source**: 39 images extracted from PowerPoint presentation
- **Organization**: Reorganized by artist based on slide sequence and content analysis
- **Formats**: Supports JPG, PNG, JPEG with proper fallbacks
- **Optimization**: Lazy loading and performance enhancements

## Key Technical Decisions

### Architecture
- **Vanilla HTML/CSS/JavaScript**: Chosen over React for easier deployment and maintenance
- **Modular Design**: Separate CSS and JS files for each page section
- **Progressive Enhancement**: Works without JavaScript, enhanced with interactions

### Performance
- **Lazy Loading**: Images load only when needed
- **Intersection Observers**: Efficient scroll and visibility detection  
- **Debounced Events**: Optimized resize and scroll handlers
- **Minimal Dependencies**: Pure vanilla implementation for fast loading

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Proper accessibility attributes throughout
- **Color Contrast**: Meets WCAG guidelines with sufficient contrast ratios
- **Screen Reader Support**: Semantic HTML with descriptive text

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (recent versions)
- **Mobile Support**: iOS Safari, Chrome Mobile, Samsung Internet
- **Fallbacks**: Graceful degradation for older browsers
- **Touch Devices**: Optimized touch interactions for tablets and phones

## Deployment Notes
- **Static Files**: Pure HTML/CSS/JS - no server required
- **Local Testing**: Works by opening index.html directly in browser
- **Hosting Options**: Can be deployed to any static hosting service
- **Asset Paths**: All paths are relative for portability

## Future Enhancements
- **Real Images**: Replace placeholders when actual artwork photos become available  
- **Search Functionality**: Add artwork and artist search capabilities
- **Social Sharing**: Implement artwork sharing features
- **Analytics**: Add visitor tracking and interaction analytics
- **Multi-language**: Support for additional languages beyond English

## Development Commands
```bash
# Extract content from office files
python3 extract_content.py

# Reorganize images based on presentation structure  
python3 reorganize_artwork_images.py

# View local development
open index.html  # or double-click the file
```

## Project Timeline
The website was developed iteratively with focus on:
1. **Content Structure** - Extracted and organized exhibition content
2. **Visual Design** - Created sophisticated, gallery-worthy presentation
3. **Interactive Features** - Built smooth carousels and navigation systems
4. **Image Integration** - Properly mapped artwork images to database
5. **Polish & Optimization** - Enhanced performance and user experience

This comprehensive website successfully captures the essence of the "Sensitive Beings" exhibition while providing an engaging, accessible platform for showcasing the artists' work and workshop offerings.