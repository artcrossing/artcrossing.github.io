#!/usr/bin/env python3
"""
Script to extract text and images from docx and pptx files for Sensitive Beings exhibition website.
"""

import os
import json
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

def extract_from_docx(docx_path):
    """Extract text from docx file"""
    content = []
    
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_file:
            # Extract document.xml which contains the main content
            doc_xml = zip_file.read('word/document.xml')
            root = ET.fromstring(doc_xml)
            
            # Define namespaces
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            # Extract text from paragraphs
            for para in root.findall('.//w:p', namespaces):
                para_text = ""
                for text_elem in para.findall('.//w:t', namespaces):
                    if text_elem.text:
                        para_text += text_elem.text
                
                if para_text.strip():
                    content.append(para_text.strip())
    
    except Exception as e:
        print(f"Error extracting from {docx_path}: {e}")
    
    return content

def extract_from_pptx(pptx_path):
    """Extract text from pptx file"""
    content = []
    
    try:
        with zipfile.ZipFile(pptx_path, 'r') as zip_file:
            # Get list of slide files
            slide_files = [name for name in zip_file.namelist() if name.startswith('ppt/slides/slide') and name.endswith('.xml')]
            
            # Define namespaces
            namespaces = {
                'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'
            }
            
            for slide_file in sorted(slide_files):
                slide_content = []
                slide_xml = zip_file.read(slide_file)
                root = ET.fromstring(slide_xml)
                
                # Extract text from text elements
                for text_elem in root.findall('.//a:t', namespaces):
                    if text_elem.text:
                        slide_content.append(text_elem.text.strip())
                
                if slide_content:
                    content.append({
                        'slide': slide_file.replace('ppt/slides/', '').replace('.xml', ''),
                        'content': slide_content
                    })
    
    except Exception as e:
        print(f"Error extracting from {pptx_path}: {e}")
    
    return content

def main():
    content_dir = Path("content files")
    output_dir = Path("extracted_content")
    output_dir.mkdir(exist_ok=True)
    
    # Extract from docx files
    docx_files = list(content_dir.glob("*.docx"))
    for docx_file in docx_files:
        print(f"Extracting from {docx_file.name}...")
        text_content = extract_from_docx(docx_file)
        
        output_file = output_dir / f"{docx_file.stem}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'source': str(docx_file),
                'type': 'docx',
                'content': text_content
            }, f, indent=2, ensure_ascii=False)
    
    # Extract from pptx files
    pptx_files = list(content_dir.glob("*.pptx"))
    for pptx_file in pptx_files:
        print(f"Extracting from {pptx_file.name}...")
        slide_content = extract_from_pptx(pptx_file)
        
        output_file = output_dir / f"{pptx_file.stem}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'source': str(pptx_file),
                'type': 'pptx',
                'slides': slide_content
            }, f, indent=2, ensure_ascii=False)
    
    print("Content extraction completed!")

if __name__ == "__main__":
    main()