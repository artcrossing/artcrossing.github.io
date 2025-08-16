#!/usr/bin/env python3
"""
Script to resize artwork images for web optimization.
Resizes images to max width/height of 800px while maintaining aspect ratio.
Creates backup of original images.
"""

import os
import shutil
from PIL import Image
import argparse

def resize_image(input_path, output_path, max_size=800, quality=85):
    """
    Resize an image to fit within max_size while maintaining aspect ratio.
    
    Args:
        input_path: Path to input image
        output_path: Path to save resized image
        max_size: Maximum width or height in pixels
        quality: JPEG quality (1-100), only applies to JPEG images
    """
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if saving as JPEG
            if img.mode == 'RGBA' and output_path.lower().endswith('.jpg'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])  # Use alpha channel as mask
                img = background
            
            # Calculate new size maintaining aspect ratio
            width, height = img.size
            if width > max_size or height > max_size:
                if width > height:
                    new_width = max_size
                    new_height = int((height * max_size) / width)
                else:
                    new_height = max_size
                    new_width = int((width * max_size) / height)
                
                # Resize using high-quality resampling
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with optimization
            save_kwargs = {'optimize': True}
            if output_path.lower().endswith(('.jpg', '.jpeg')):
                save_kwargs['quality'] = quality
            
            img.save(output_path, **save_kwargs)
            return True
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Resize artwork images for web optimization')
    parser.add_argument('--max-size', type=int, default=800, 
                       help='Maximum width or height in pixels (default: 800)')
    parser.add_argument('--quality', type=int, default=85, 
                       help='JPEG quality 1-100 (default: 85)')
    parser.add_argument('--backup', action='store_true', 
                       help='Create backup of original images')
    parser.add_argument('--format', choices=['png', 'jpg'], default='png',
                       help='Output format (default: png)')
    
    args = parser.parse_args()
    
    artwork_dir = 'artwork'
    if not os.path.exists(artwork_dir):
        print(f"Error: {artwork_dir} directory not found")
        return
    
    # Create backup directory if requested
    if args.backup:
        backup_dir = 'artwork_backup'
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
            print(f"Created backup directory: {backup_dir}")
    
    # Get all PNG files in artwork directory
    png_files = [f for f in os.listdir(artwork_dir) if f.lower().endswith('.png')]
    
    if not png_files:
        print("No PNG files found in artwork directory")
        return
    
    print(f"Found {len(png_files)} images to process")
    print(f"Resizing to max {args.max_size}px, quality {args.quality}, format: {args.format}")
    
    processed = 0
    errors = 0
    
    for filename in sorted(png_files):
        input_path = os.path.join(artwork_dir, filename)
        
        # Create backup if requested
        if args.backup:
            backup_path = os.path.join(backup_dir, filename)
            shutil.copy2(input_path, backup_path)
        
        # Determine output filename
        base_name = os.path.splitext(filename)[0]
        if args.format == 'jpg':
            output_filename = f"{base_name}.jpg"
        else:
            output_filename = filename
        
        output_path = os.path.join(artwork_dir, output_filename)
        
        # Get original file size
        original_size = os.path.getsize(input_path) / (1024 * 1024)  # MB
        
        print(f"Processing {filename} ({original_size:.1f}MB)...", end=' ')
        
        if resize_image(input_path, output_path, args.max_size, args.quality):
            new_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
            reduction = ((original_size - new_size) / original_size) * 100
            print(f"✓ {new_size:.1f}MB ({reduction:.1f}% reduction)")
            
            # Remove original PNG if converting to JPG
            if args.format == 'jpg' and output_filename != filename:
                os.remove(input_path)
            
            processed += 1
        else:
            print("✗ Failed")
            errors += 1
    
    print(f"\nProcessing complete:")
    print(f"  Successfully processed: {processed}")
    print(f"  Errors: {errors}")
    
    if args.backup and processed > 0:
        print(f"  Original images backed up to: {backup_dir}/")

if __name__ == "__main__":
    main()