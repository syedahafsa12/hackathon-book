#!/usr/bin/env python3
"""
Create Urdu translations for all markdown files
"""
import os
import shutil
from pathlib import Path

# Base paths
DOCS_DIR = Path("docs")
I18N_DIR = Path("i18n/ur/docusaurus-plugin-content-docs/current")

# Urdu translations for common terms
TRANSLATIONS = {
    "# What is Physical AI?": "# فزیکل AI کیا ہے؟",
    "# Embodied Intelligence": "# Embodied Intelligence (جسمانی ذہانت)",
    "# Humanoid Landscape": "# Humanoid Landscape (ہیومنائیڈ روبوٹس کا جائزہ)",
    "# Prerequisites": "# Prerequisites (ضروری چیزیں)",
    "# ROS 2 Overview": "# ROS 2 کا جائزہ",
    "# Nodes & Topics": "# Nodes اور Topics",
    "# Services & Actions": "# Services اور Actions",
    "# rclpy Basics": "# rclpy بنیادی باتیں",
    "# URDF for Humanoids": "# ہیومنائیڈز کے لیے URDF",
    "# Launch Files": "# Launch Files",
    "# Exercises": "# مشقیں",
}

def create_urdu_version(english_file: Path, urdu_file: Path):
    """Create Urdu version of English markdown file"""

    # Ensure directory exists
    urdu_file.parent.mkdir(parents=True, exist_ok=True)

    # Read English content
    with open(english_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Simple translation of headers
    for eng, urdu in TRANSLATIONS.items():
        content = content.replace(eng, urdu)

    # Add note at top for manual translation
    if not content.startswith('---'):
        content = f"---\nsidebar_position: {english_file.stem}\n---\n\n{content}"

    # Add Urdu note
    note = "\n\n---\n\n**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔\n\n"
    content += note

    # Write Urdu file
    with open(urdu_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Created: {urdu_file}")

def main():
    """Main function"""
    print("Creating Urdu translations...")

    # Create intro
    intro_en = DOCS_DIR / "intro.md"
    intro_ur = I18N_DIR / "intro.md"
    if intro_en.exists():
        create_urdu_version(intro_en, intro_ur)

    # Create Module 0
    module0_dir = DOCS_DIR / "module0-intro"
    if module0_dir.exists():
        for file in module0_dir.glob("*.md"):
            urdu_file = I18N_DIR / "module0-intro" / file.name
            create_urdu_version(file, urdu_file)

    # Create Module 1
    module1_dir = DOCS_DIR / "module1-ros2"
    if module1_dir.exists():
        for file in module1_dir.glob("*.md"):
            urdu_file = I18N_DIR / "module1-ros2" / file.name
            create_urdu_version(file, urdu_file)

    print("\nAll Urdu translation files created!")
    print("Note: Files contain English content with Urdu headers.")
    print("For full translation, run through translation service.")

if __name__ == "__main__":
    main()
