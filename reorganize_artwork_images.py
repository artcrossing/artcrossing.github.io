#!/usr/bin/env python3
"""
Reorganize Artwork Images Based on PowerPoint Presentation Structure
Maps presentation images to correct artists and artworks based on slide order.
"""

import json
import os
import shutil
from pathlib import Path

# Load the extracted presentation content
def load_presentation_data():
    with open('extracted_content/artist and artwork.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# Create proper artist-artwork mapping based on slide structure
def create_artwork_mapping():
    """
    Based on the PowerPoint presentation structure, map slides to artists and artworks
    """
    
    # Artist and artwork mapping based on slide analysis
    artist_artwork_mapping = {
        # Chapter 1 - The Replicated Self
        'chris_bowes': {
            'name': 'Chris Bowes',
            'chapter': 'chapter1', 
            'slides': ['slide8', 'slide9'],
            'artworks': [
                {
                    'title': 'Mirror',
                    'medium': 'Digital Interactive Art',
                    'year': '2017',
                    'price': 'PoA',
                    'description': 'An interactive artwork that employs a random dithering algorithm to compress and reproduce the form of the spectator standing before the screen.',
                    'slides': ['slide9']
                }
            ]
        },
        
        'jun_wu': {
            'name': 'Jun Wu',
            'chapter': 'chapter1',
            'slides': ['slide10', 'slide11'],
            'artworks': [
                {
                    'title': 'The Joy of Fish',
                    'medium': 'Screen printing',
                    'dimensions': '120 cm × 78 cm',
                    'year': '2023',
                    'price': '$1820',
                    'description': 'Explores everyday sensory experiences through screen printing techniques, questioning the repetitiveness embedded in routine.',
                    'slides': ['slide11']
                },
                {
                    'title': 'N Series',
                    'medium': 'Screen printing', 
                    'dimensions': '58 cm × 70 cm',
                    'year': '2023',
                    'price': '$1495',
                    'description': 'Part of a series exploring repetitive patterns and daily life rhythms.',
                    'slides': ['slide11']
                }
            ]
        },
        
        'haojun_yang': {
            'name': 'Haojun Yang',
            'chapter': 'chapter1',
            'slides': ['slide12', 'slide13'],
            'artworks': [
                {
                    'title': 'Wild Grass',
                    'medium': 'Oil on canvas',
                    'dimensions': '15 cm × 15 cm', 
                    'year': '2021',
                    'description': 'Captures the spirituality and timelessness found in nature\'s subtle details.',
                    'slides': ['slide13']
                },
                {
                    'title': 'Predicament',
                    'medium': 'Oil on wood panel',
                    'dimensions': '10 cm × 10 cm',
                    'year': '2024',
                    'description': 'Explores the relationship between natural decay and spiritual renewal.',
                    'slides': ['slide13']
                },
                {
                    'title': 'Predicament II',
                    'medium': 'Oil on wood panel',
                    'dimensions': '10 cm × 10 cm', 
                    'year': '2024',
                    'description': 'Continuation of the Predicament series exploring life\'s spiritual dimensions.',
                    'slides': ['slide13']
                }
            ]
        },
        
        'sharleen_cu': {
            'name': 'Sharleen Cu',
            'chapter': 'chapter1',
            'slides': ['slide14', 'slide15'],
            'artworks': [
                {
                    'title': 'In Good Company',
                    'medium': 'Acrylic, color pencil, wood and wire',
                    'year': '2025',
                    'description': 'Explores the complicated mess of identity as a Chinese-Filipino living in Australia through mixed media self-portraiture.',
                    'slides': ['slide15']
                }
            ]
        },
        
        # Chapter 2 - The Rewilded Senses  
        'jiahong_lang': {
            'name': 'Jiahong Lang',
            'chapter': 'chapter2',
            'slides': ['slide17', 'slide18'],
            'artworks': [
                {
                    'title': 'Null\'s Lamp',
                    'medium': 'Metal, acrylic',
                    'dimensions': '45 × 15 × 15 cm',
                    'year': '2025',
                    'description': 'Through the skillful use of reflective color, this work creates a rich spatial atmosphere and guides human behavior and visual flow.',
                    'slides': ['slide18']
                },
                {
                    'title': 'Bohemian Rhapsody', 
                    'medium': 'Color, Video, Digital Art',
                    'year': '2025',
                    'description': 'An experimental video composed of dot matrix colors containing hidden 3D imagery using autostereogram technique.',
                    'slides': ['slide18']
                }
            ]
        },
        
        'heng_wang': {
            'name': 'Heng Wang',
            'chapter': 'chapter2',
            'slides': ['slide19', 'slide20'],
            'artworks': [
                {
                    'title': 'Myriad of Dust',
                    'medium': 'Velvet photographic paper (giclée print)',
                    'dimensions': '80 cm × 60 cm',
                    'year': '2025', 
                    'description': 'The microscopic structure of a butterfly\'s wings revealed in entirely different forms under microscopic lens.',
                    'slides': ['slide20']
                }
            ]
        },
        
        'frank_meuschke': {
            'name': 'Frank James Meuschke',
            'chapter': 'chapter2',
            'slides': ['slide21', 'slide22'],
            'artworks': [
                {
                    'title': 'Touch The Sky',
                    'medium': 'Sublimation print on polyethylene fabric',
                    'dimensions': '129 × 172 cm',
                    'year': '2022',
                    'description': 'Expression of melancholy, memory, nature, and place using petroleum-based plastic filters.',
                    'slides': ['slide22']
                },
                {
                    'title': 'Whitewater River',
                    'medium': 'Sublimation print on polyethylene fabric', 
                    'dimensions': '129 × 172cm',
                    'year': '2022',
                    'description': 'Part of the artist\'s exploration of ecologically significant sites at perceptual thresholds.',
                    'slides': ['slide22']
                },
                {
                    'title': 'Fishing, Smith Point, New York',
                    'medium': 'Pigment Print on Hahnemuhle Photo Rag',
                    'dimensions': '57 × 76 cm',
                    'year': '2024',
                    'description': 'Engages dialogue between nature, national identity, place and personal experience.',
                    'slides': ['slide22']
                },
                {
                    'title': 'Mountain House, Aspen, Colorado',
                    'medium': 'Pigment Print on Hahnemuhle Photo Rag',
                    'dimensions': '57 × 76 cm', 
                    'year': '2024',
                    'description': 'Part of the "Aesthetics of Melancholy" series exploring nature and personal experience.',
                    'slides': ['slide22']
                }
            ]
        },
        
        'vivian_qiu': {
            'name': 'Vivian Qiu',
            'chapter': 'chapter2',
            'slides': ['slide23', 'slide24'],
            'artworks': [
                {
                    'title': 'We\'ve Come A Long Way',
                    'medium': 'Rice, embroidery thread, coffee grounds, grass, herbs, tea, grains, hemp yarns',
                    'dimensions': 'Various sizes, 6 x 4 x 4 cm per object',
                    'year': '2025',
                    'description': 'Recreates ancient Chinese clay pots using rice and natural fibers, reconnecting with history and Chinese heritage.',
                    'slides': ['slide24']
                },
                {
                    'title': 'Use What You\'ve Got',
                    'medium': 'Rice, coffee grounds, grass, tea, sand, metal',
                    'dimensions': '15 x 12 x 5cm',
                    'year': '2025',
                    'description': 'Inspired by repurposed ceramic pot walls, exploring resourcefulness and cultural heritage.',
                    'slides': ['slide24']
                }
            ]
        },
        
        'qianxun_li': {
            'name': 'Qianxun Li',
            'chapter': 'chapter2', 
            'slides': ['slide25', 'slide26', 'slide27'],
            'artworks': [
                {
                    'title': 'Rain: The Apparent Threshold',
                    'medium': 'Deconstructed umbrella frame, nylon filament, glass, UV-cured',
                    'dimensions': '105x90cm',
                    'year': '2025',
                    'description': 'Reimagines the umbrella as a skeletal structure, exploring boundaries between shelter and exposure.',
                    'slides': ['slide26']
                },
                {
                    'title': 'Raindrop',
                    'medium': 'Aluminum, UV Resin, Vegetable Oil, Steel Wire, Transparent Thread',
                    'dimensions': '8 × 8 × 3.5 cm',
                    'year': '2024',
                    'description': 'Captures the instant of rain hitting metal, with droplets suspended on transparent threads.',
                    'slides': ['slide27']
                },
                {
                    'title': 'After the Rain',
                    'medium': 'Aluminum, UV resin, vegetable oil, steel wire',
                    'dimensions': '8 × 8 × 3.5 cm',
                    'year': '2024',
                    'description': 'Captures the quiet aftermath of rainfall, when droplets remain on metal surfaces.',
                    'slides': ['slide27']
                },
                {
                    'title': 'World',
                    'medium': 'Aluminum, wood, UV glue, vegetable oil, plastic, handmade paper',
                    'dimensions': '7 × 6 × 6 cm',
                    'year': '2024',
                    'description': 'Incorporates elements of light, shadow, and trees with movable leaves and embedded leaf fragments.',
                    'slides': ['slide27']
                },
                {
                    'title': 'Water Between Fingers',
                    'medium': 'UV glue, vegetable oil, plastic',
                    'dimensions': '3 × 4 × 5 cm',
                    'year': '2024',
                    'description': 'Captures the sensation of water droplets slipping between fingers, symbolizing the flow of life.',
                    'slides': ['slide27']
                }
            ]
        },
        
        'yilin_zhang': {
            'name': 'Yilin Zhang',
            'chapter': 'chapter2',
            'slides': ['slide28', 'slide29'], 
            'artworks': [
                {
                    'title': 'Falling to Me',
                    'medium': 'Acrylic on canvas',
                    'dimensions': '40 x 50 cm',
                    'year': '2025',
                    'price': '$2200',
                    'description': 'Explores themes of mysticism, trauma, and healing through cross-cultural experiences and intuitive artistic practice.',
                    'slides': ['slide29']
                },
                {
                    'title': 'Firework Candy',
                    'medium': 'Pastel on wood panel',
                    'dimensions': '30 x 40 cm',
                    'year': '2025',
                    'description': 'Part of the artist\'s exploration of mysticism and healing through color and form.',
                    'slides': ['slide29']
                },
                {
                    'title': 'Angel\'s Whisper',
                    'medium': 'Pastel on wood panel',
                    'dimensions': '30 x 40 cm', 
                    'year': '2025',
                    'description': 'Explores spiritual themes and the artist\'s intuitive approach to healing through art.',
                    'slides': ['slide29']
                }
            ]
        },
        
        'bei_han': {
            'name': 'Bei Han',
            'chapter': 'chapter2',
            'slides': ['slide30', 'slide31'],
            'artworks': [
                {
                    'title': 'Echo',
                    'medium': 'Paper mounted on wood panel, natural mineral pigments, synthetic pigments, gold leaf',
                    'dimensions': '41 x 31.8cm',
                    'year': '2025',
                    'price': '$1400',
                    'description': 'Connects natural symbols with the act of creation, evoking the viewer\'s sensory experience of the ocean\'s sound.',
                    'slides': ['slide31']
                }
            ]
        },
        
        'shiyin_li': {
            'name': 'Shiyin Li',
            'chapter': 'chapter2',
            'slides': ['slide32', 'slide33'],
            'artworks': [
                {
                    'title': 'Bird of Paradise',
                    'medium': 'Digital tablet drawing + archival pigment print',
                    'dimensions': '100cm x 50 cm',
                    'year': '2025',
                    'description': 'A magical story of children and a glowing bird during wartime, exploring themes of hope and rescue.',
                    'slides': ['slide33']
                }
            ]
        },
        
        'marina_rodriguez': {
            'name': 'Marina Rodriguez', 
            'chapter': 'chapter2',
            'slides': ['slide34', 'slide35'],
            'artworks': [
                {
                    'title': 'Damade Night',
                    'medium': 'Glazed ceramic with iridescent lusters',
                    'dimensions': '28x10x8cm',
                    'year': '2025',
                    'description': 'Celebrates the hidden beauty that emerges in darkness and the adaptability of life.',
                    'slides': ['slide35']
                },
                {
                    'title': 'Santa Lucia Flower',
                    'medium': 'Glazed ceramic with iridescent lusters',
                    'dimensions': '20x14x8cm',
                    'year': '2025',
                    'price': '$210 or $310',
                    'description': 'Celebrates the fleeting nature of life through vibrant ceramic flowers with blue luster details.',
                    'slides': ['slide35']
                }
            ]
        }
    }
    
    return artist_artwork_mapping

def reorganize_images():
    """
    Reorganize presentation images based on slide structure
    """
    print("🎨 Reorganizing artwork images based on PowerPoint presentation structure...")
    
    mapping = create_artwork_mapping()
    presentation_data = load_presentation_data()
    
    # Create directories for properly organized images
    base_images_dir = Path('images')
    base_images_dir.mkdir(exist_ok=True)
    
    presentations_dir = Path('images/presentations')
    
    if not presentations_dir.exists():
        print(f"❌ Presentations directory not found: {presentations_dir}")
        return
    
    # Get all presentation images
    presentation_images = sorted([f for f in presentations_dir.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.JPG', '.PNG']])
    
    print(f"📁 Found {len(presentation_images)} presentation images")
    
    # Map slides to images based on slide numbers
    slide_to_image = {}
    slides_with_content = []
    
    # Extract slides that contain artwork content
    for slide_data in presentation_data.get('slides', []):
        slide_id = slide_data.get('slide', '')
        content = slide_data.get('content', [])
        
        # Look for artwork-related content
        content_text = ' '.join(content).lower()
        if any(keyword in content_text for keyword in ['title:', 'material:', 'artwork', 'size:', 'year:']):
            slides_with_content.append(slide_id)
    
    print(f"🎯 Found {len(slides_with_content)} slides with artwork content")
    
    # Create a mapping between image numbers and slides
    # Assuming presentation images are roughly in slide order
    image_slide_mapping = {}
    
    # Manual mapping based on analysis of the presentation structure
    slide_image_map = {
        'slide9': ['image1.jpg'],  # Chris Bowes - Mirror
        'slide11': ['image2.jpg', 'image3.png'],  # Jun Wu - Joy of Fish, N Series  
        'slide13': ['image4.jpg', 'image5.JPG', 'image6.png'],  # Haojun Yang - Wild Grass, Predicament I&II
        'slide15': ['image7.png'],  # Sharleen Cu - In Good Company
        'slide18': ['image8.png', 'image9.png'],  # Jiahong Lang - Null's Lamp, Bohemian Rhapsody
        'slide20': ['image10.JPG'],  # Heng Wang - Myriad of Dust
        'slide22': ['image11.jpg', 'image12.JPG', 'image13.JPG', 'image14.png'],  # Frank Meuschke - 4 artworks
        'slide24': ['image15.png', 'image16.png'],  # Vivian Qiu - We've Come A Long Way, Use What You've Got
        'slide26': ['image17.png'],  # Qianxun Li - Rain: The Apparent Threshold
        'slide27': ['image18.png', 'image19.jpeg', 'image20.jpeg', 'image21.jpeg', 'image22.jpeg'],  # Qianxun Li - Water Droplet Series
        'slide29': ['image23.jpg', 'image24.PNG', 'image25.png'],  # Yilin Zhang - Falling to Me, Firework Candy, Angel's Whisper
        'slide31': ['image26.png'],  # Bei Han - Echo
        'slide33': ['image27.png'],  # Shiyin Li - Bird of Paradise
        'slide35': ['image28.png', 'image29.jpg']  # Marina Rodriguez - Damade Night, Santa Lucia Flower
    }
    
    # Create proper artist directories and copy images
    images_copied = 0
    
    for artist_key, artist_data in mapping.items():
        artist_dir = base_images_dir / artist_key
        artist_dir.mkdir(exist_ok=True)
        
        print(f"👤 Processing {artist_data['name']}...")
        
        # Process each artwork for this artist
        for artwork in artist_data['artworks']:
            artwork_slides = artwork.get('slides', [])
            
            for slide in artwork_slides:
                if slide in slide_image_map:
                    slide_images = slide_image_map[slide]
                    
                    for img_name in slide_images:
                        src_path = presentations_dir / img_name
                        if src_path.exists():
                            # Create safe filename from artwork title
                            safe_title = artwork['title'].lower().replace(' ', '_').replace("'", '').replace('"', '').replace(',', '').replace(':', '')
                            dst_filename = f"{safe_title}{src_path.suffix}"
                            dst_path = artist_dir / dst_filename
                            
                            try:
                                shutil.copy2(src_path, dst_path)
                                print(f"  ✅ Copied {img_name} → {artist_key}/{dst_filename}")
                                images_copied += 1
                            except Exception as e:
                                print(f"  ❌ Failed to copy {img_name}: {e}")
                        else:
                            print(f"  ⚠️  Image not found: {img_name}")
    
    print(f"\n🎉 Successfully reorganized {images_copied} images!")
    return mapping

def update_artwork_database(mapping):
    """
    Update the artwork database with correct image paths
    """
    print("📝 Updating artwork database with correct image paths...")
    
    database = {
        'chapter1': {
            'title': 'The Replicated Self',
            'description': 'Selfhood is not self-made, but shaped in subtle repetitions, negotiated glances, and quiet adjustments to what is expected.',
            'artists': []
        },
        'chapter2': {
            'title': 'The Rewilded Senses', 
            'description': 'Even in the default disciplinary reality, feelings still find their way to nurturing the part of us that continues to listen beneath it all.',
            'artists': []
        }
    }
    
    for artist_key, artist_data in mapping.items():
        chapter = artist_data['chapter']
        
        artist_entry = {
            'key': artist_key,
            'name': artist_data['name'],
            'bio': f"Artist information from {artist_data['name']}",
            'specialty': artist_data['artworks'][0]['medium'] if artist_data['artworks'] else 'Mixed Media',
            'artworks': []
        }
        
        for artwork in artist_data['artworks']:
            safe_title = artwork['title'].lower().replace(' ', '_').replace("'", '').replace('"', '').replace(',', '').replace(':', '')
            
            artwork_entry = {
                'title': artwork['title'],
                'image': f"images/{artist_key}/{safe_title}.jpg",  # Default to .jpg, will be corrected if needed
                'medium': artwork.get('medium', ''),
                'dimensions': artwork.get('dimensions', ''),
                'year': artwork.get('year', ''),
                'price': artwork.get('price', ''),
                'description': artwork.get('description', '')
            }
            
            artist_entry['artworks'].append(artwork_entry)
        
        database[chapter]['artists'].append(artist_entry)
    
    # Save updated database
    with open('artwork_database.json', 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    
    print("✅ Artwork database updated successfully!")

if __name__ == "__main__":
    print("🎨 Starting artwork image reorganization based on PowerPoint structure...")
    
    try:
        # Reorganize images based on presentation structure
        mapping = reorganize_images()
        
        # Update the artwork database
        update_artwork_database(mapping)
        
        print("\n🎉 Image reorganization completed successfully!")
        print("📁 Images are now properly organized by artist in the images/ directory")
        print("📝 Artwork database has been updated with correct mappings")
        
    except Exception as e:
        print(f"❌ Error during reorganization: {e}")
        import traceback
        traceback.print_exc()