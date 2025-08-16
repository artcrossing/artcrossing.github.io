#!/usr/bin/env python3
"""
Script to organize and map artwork images to specific artists and pieces.
Based on the extracted content and known artwork titles.
"""

import os
import shutil
import json
from pathlib import Path

# Artwork mapping based on our extracted content
ARTWORK_MAPPING = {
    # Chapter 1 - The Replicated Self
    "chris_bowes": {
        "artworks": ["Mirror"],
        "images": ["presentations/image1.jpg"]  # Digital art piece
    },
    "jun_wu": {
        "artworks": ["The Joy of Fish", "N Series", "Endless Green Hills"],
        "images": ["presentations/image2.jpg", "presentations/image3.png", "presentations/image4.jpg"]
    },
    "haojun_yang": {
        "artworks": ["Wild Grass", "Predicament", "Predicament II"],
        "images": ["presentations/image5.JPG", "presentations/image6.png", "presentations/image7.png"]
    },
    "sharleen_cu": {
        "artworks": ["In Good Company"],
        "images": ["presentations/image8.png"]  # Mixed media piece
    },
    
    # Chapter 2 - The Rewilded Senses
    "jiahong_lang": {
        "artworks": ["Null's Lamp", "Bohemian Rhapsody"],
        "images": ["presentations/image9.png", "presentations/image10.JPG"]
    },
    "heng_wang": {
        "artworks": ["Myriad of Dust", "Mountains in a Mustard Seed"],
        "images": ["presentations/image11.jpg", "presentations/image12.JPG"]
    },
    "frank_meuschke": {
        "artworks": ["Touch The Sky", "Whitewater River", "Fishing, Smith Point, New York", "Mountain House, Aspen, Colorado"],
        "images": ["presentations/image13.JPG", "presentations/image14.png", "presentations/image15.png", "presentations/image16.png"]
    },
    "vivian_qiu": {
        "artworks": ["We've Come A Long Way", "Use What You've Got"],
        "images": ["presentations/image17.png", "presentations/image18.png"]
    },
    "qianxun_li": {
        "artworks": ["Rain: The Apparent Threshold", "Raindrop", "After the Rain", "World", "Water Between Fingers"],
        "images": ["presentations/image19.jpeg", "presentations/image20.jpeg", "presentations/image21.jpeg", "presentations/image22.jpeg", "presentations/image23.jpg"]
    },
    "yilin_zhang": {
        "artworks": ["Falling to Me", "Angel's Whisper", "Firework Candy"],
        "images": ["presentations/image24.PNG", "presentations/image25.png", "presentations/image26.png"]
    },
    "bei_han": {
        "artworks": ["Echo", "The Universe in between"],
        "images": ["presentations/image27.png", "presentations/image28.png"]
    },
    "shiyin_li": {
        "artworks": ["Bird of Paradise"],
        "images": ["presentations/image29.jpg"]
    },
    "marina_rodriguez": {
        "artworks": ["Santa Lucia Flower", "Damade night"],
        "images": ["presentations/image30.png", "presentations/image31.png"]
    }
}

def organize_images():
    """Organize images into artist directories"""
    images_dir = Path("images")
    
    for artist, data in ARTWORK_MAPPING.items():
        artist_dir = images_dir / artist
        artist_dir.mkdir(exist_ok=True)
        
        print(f"Processing {artist}...")
        
        for i, image_path in enumerate(data["images"]):
            source_path = images_dir / image_path
            
            if source_path.exists():
                # Create meaningful filename
                artwork_name = data["artworks"][min(i, len(data["artworks"]) - 1)]
                file_extension = source_path.suffix
                new_filename = f"{artwork_name.lower().replace(' ', '_').replace(':', '')}{file_extension}"
                
                destination_path = artist_dir / new_filename
                
                # Copy (don't move) the image
                shutil.copy2(source_path, destination_path)
                print(f"  Copied {source_path.name} -> {new_filename}")
            else:
                print(f"  Warning: {source_path} not found")

def create_artwork_database():
    """Create a comprehensive artwork database with image paths"""
    
    artwork_db = {
        "chapter1": {
            "title": "The Replicated Self",
            "description": "Selfhood is not self-made, but shaped in subtle repetitions, negotiated glances, and quiet adjustments to what is expected.",
            "artists": []
        },
        "chapter2": {
            "title": "The Rewilded Senses", 
            "description": "Even in the default disciplinary reality, feelings still find their way to nurturing the part of us that continues to listen beneath it all.",
            "artists": []
        }
    }
    
    # Chapter 1 artists
    chapter1_artists = ["chris_bowes", "jun_wu", "haojun_yang", "sharleen_cu"]
    # Chapter 2 artists
    chapter2_artists = ["jiahong_lang", "heng_wang", "frank_meuschke", "vivian_qiu", "qianxun_li", "yilin_zhang", "bei_han", "shiyin_li", "marina_rodriguez"]
    
    # Artist information from our extracted content
    artist_info = {
        "chris_bowes": {
            "name": "Chris Bowes",
            "bio": "Multidisciplinary artist based in Melbourne whose practice incorporates photography, video and installation.",
            "specialty": "Digital Interactive Art"
        },
        "jun_wu": {
            "name": "Jun Wu", 
            "bio": "Chinese artist whose upbringing and education have shaped a sensitive and reflective approach to art-making.",
            "specialty": "Screen Printing"
        },
        "haojun_yang": {
            "name": "Haojun Yang",
            "bio": "Enjoys wandering alone through the wilderness; the quietude of nature serves as the wellspring of his creativity.",
            "specialty": "Oil Painting"
        },
        "sharleen_cu": {
            "name": "Sharleen Cu",
            "bio": "Multidisciplinary artist exploring identity as a Chinese-Filipino living in Australia through mixed media.",
            "specialty": "Mixed Media"
        },
        "jiahong_lang": {
            "name": "Jiahong Lang",
            "bio": "Hangzhou-based artist and designer focused on installation art and digital interactive media.",
            "specialty": "Digital Interactive Media"
        },
        "heng_wang": {
            "name": "Heng Wang",
            "bio": "Untamable and wild-spirited extreme photographer specializing in nature and macro photography.",
            "specialty": "Photography"
        },
        "frank_meuschke": {
            "name": "Frank James Meuschke",
            "bio": "Photographer exploring melancholy, memory, nature, and place through experimental techniques.",
            "specialty": "Photography"
        },
        "vivian_qiu": {
            "name": "Vivian Qiu",
            "bio": "Emerging artist combining wearable art and sculpture, exploring cultural identity and healing.",
            "specialty": "Mixed Media Sculpture"
        },
        "qianxun_li": {
            "name": "Qianxun Li",
            "bio": "Chinese artist focusing on capturing sensory details of daily life and microscopic beauty in nature.",
            "specialty": "Fine Crafts"
        },
        "yilin_zhang": {
            "name": "Yilin Zhang",
            "bio": "Mystic and astrologer exploring trauma, mythology, and healing through cross-cultural experiences.",
            "specialty": "Painting & Mixed Media"
        },
        "bei_han": {
            "name": "Bei Han",
            "bio": "Contemporary gansai artist merging ancient Eastern mineral pigments with personal emotional experiences.",
            "specialty": "Mineral Pigment Painting"
        },
        "shiyin_li": {
            "name": "Shiyin Li",
            "bio": "Artist with 16 years of practice, creating through intuitive and spontaneous strokes.",
            "specialty": "Digital & Traditional Painting"
        },
        "marina_rodriguez": {
            "name": "Marina Rodriguez",
            "bio": "Visual artist, ceramist, and architect from Argentina exploring fusion of cultural identities.",
            "specialty": "Ceramics"
        }
    }
    
    # Build database
    for artist_key in chapter1_artists:
        if artist_key in ARTWORK_MAPPING and artist_key in artist_info:
            artist_data = {
                "key": artist_key,
                "name": artist_info[artist_key]["name"],
                "bio": artist_info[artist_key]["bio"],
                "specialty": artist_info[artist_key]["specialty"],
                "artworks": []
            }
            
            # Add artworks
            for i, artwork_title in enumerate(ARTWORK_MAPPING[artist_key]["artworks"]):
                artwork_data = {
                    "title": artwork_title,
                    "image": f"images/{artist_key}/{artwork_title.lower().replace(' ', '_').replace(':', '')}.jpg"
                }
                # Add specific artwork details here if available
                artist_data["artworks"].append(artwork_data)
            
            artwork_db["chapter1"]["artists"].append(artist_data)
    
    # Same for chapter 2
    for artist_key in chapter2_artists:
        if artist_key in ARTWORK_MAPPING and artist_key in artist_info:
            artist_data = {
                "key": artist_key,
                "name": artist_info[artist_key]["name"],
                "bio": artist_info[artist_key]["bio"],
                "specialty": artist_info[artist_key]["specialty"],
                "artworks": []
            }
            
            for i, artwork_title in enumerate(ARTWORK_MAPPING[artist_key]["artworks"]):
                artwork_data = {
                    "title": artwork_title,
                    "image": f"images/{artist_key}/{artwork_title.lower().replace(' ', '_').replace(':', '')}.jpg"
                }
                artist_data["artworks"].append(artwork_data)
            
            artwork_db["chapter2"]["artists"].append(artist_data)
    
    # Save database
    with open("artwork_database.json", 'w') as f:
        json.dump(artwork_db, f, indent=2)
    
    print("Created artwork database with image mappings")
    return artwork_db

def main():
    print("Organizing artwork images...")
    organize_images()
    
    print("\nCreating artwork database...")
    db = create_artwork_database()
    
    print(f"\nOrganization completed!")
    print(f"Chapter 1: {len(db['chapter1']['artists'])} artists")
    print(f"Chapter 2: {len(db['chapter2']['artists'])} artists")
    print("Check 'artwork_database.json' for the complete mapping")

if __name__ == "__main__":
    main()