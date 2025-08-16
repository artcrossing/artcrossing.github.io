#!/usr/bin/env python3
"""
Script to extract images from docx and pptx files for Sensitive Beings exhibition website.
"""

import os
import zipfile
import shutil
from pathlib import Path

def extract_images_from_office_file(file_path, output_dir):
    """Extract images from docx or pptx files"""
    images_extracted = []
    
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_file:
            # Look for media files in the archive
            media_files = [name for name in zip_file.namelist() if name.startswith('word/media/') or name.startswith('ppt/media/')]
            
            if not media_files:
                print(f"No media files found in {file_path}")
                return images_extracted
            
            # Create output directory
            os.makedirs(output_dir, exist_ok=True)
            
            # Extract each media file
            for media_file in media_files:
                # Get the filename
                filename = os.path.basename(media_file)
                
                # Extract the file
                with zip_file.open(media_file) as source:
                    with open(os.path.join(output_dir, filename), 'wb') as target:
                        target.write(source.read())
                
                images_extracted.append(filename)
                print(f"Extracted: {filename}")
    
    except Exception as e:
        print(f"Error extracting from {file_path}: {e}")
    
    return images_extracted

def organize_artwork_images(images_dir):
    """Organize extracted images by artist/artwork"""
    
    # Create artist directories based on our extracted content
    artists = [
        'chris_bowes', 'jun_wu', 'haojun_yang', 'sharleen_cu',
        'bei_han', 'frank_meuschke', 'vivian_qiu', 'qianxun_li',
        'yilin_zhang', 'shiyin_li', 'marina_rodriguez', 'jiahong_lang',
        'heng_wang'
    ]
    
    # Create directory structure
    for artist in artists:
        artist_dir = os.path.join(images_dir, artist)
        os.makedirs(artist_dir, exist_ok=True)
    
    print("Created artist directories for image organization")

def create_image_manifest():
    """Create a manifest of available images for the website"""
    images_dir = Path("images")
    manifest = {
        "artists": {},
        "workshop_images": [],
        "general_images": []
    }
    
    if images_dir.exists():
        # Scan for artist images
        for artist_dir in images_dir.iterdir():
            if artist_dir.is_dir():
                artist_images = []
                for image_file in artist_dir.glob("*"):
                    if image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                        artist_images.append({
                            "filename": image_file.name,
                            "path": str(image_file.relative_to(images_dir)),
                            "size": image_file.stat().st_size if image_file.exists() else 0
                        })
                
                if artist_images:
                    manifest["artists"][artist_dir.name] = artist_images
        
        # Scan for general images
        for image_file in images_dir.glob("*"):
            if image_file.is_file() and image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                manifest["general_images"].append({
                    "filename": image_file.name,
                    "path": str(image_file.relative_to(images_dir)),
                    "size": image_file.stat().st_size
                })
    
    # Write manifest
    import json
    with open("image_manifest.json", 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print("Created image manifest")
    return manifest

def main():
    content_dir = Path("content files")
    images_dir = Path("images")
    
    # Create images directory
    images_dir.mkdir(exist_ok=True)
    
    # Extract from docx files
    docx_files = list(content_dir.glob("*.docx"))
    for docx_file in docx_files:
        print(f"\nProcessing {docx_file.name}...")
        extracted = extract_images_from_office_file(docx_file, images_dir / "documents")
        print(f"Extracted {len(extracted)} images from {docx_file.name}")
    
    # Extract from pptx files
    pptx_files = list(content_dir.glob("*.pptx"))
    for pptx_file in pptx_files:
        print(f"\nProcessing {pptx_file.name}...")
        extracted = extract_images_from_office_file(pptx_file, images_dir / "presentations")
        print(f"Extracted {len(extracted)} images from {pptx_file.name}")
    
    # Organize images
    organize_artwork_images(images_dir)
    
    # Create manifest
    manifest = create_image_manifest()
    
    print(f"\nImage extraction completed!")
    print(f"Check the 'images' directory for extracted files")
    print(f"Image manifest created with {len(manifest['general_images'])} general images")
    print(f"Artist directories created for {len(manifest['artists'])} artists")

if __name__ == "__main__":
    main()