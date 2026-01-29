"""
Dataset Preprocessing Script
============================

Preprocesses CASIA and Columbia datasets for training:
1. Resize images to uniform size
2. Generate ELA representations
3. Organize into training structure

Usage:
    python preprocess_dataset.py --input_dir ./raw_data --output_dir ./processed_data
"""

import os
import argparse
from io import BytesIO
from PIL import Image
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm


def generate_ela(image_path, quality=90, scale=10):
    """
    Generate Error Level Analysis image.
    
    Args:
        image_path: Path to input image
        quality: JPEG recompression quality (default: 90)
        scale: ELA difference amplification factor (default: 10)
    
    Returns:
        PIL Image of the ELA result
    """
    try:
        original = Image.open(image_path).convert('RGB')
        
        # Resave at specified quality
        buffer = BytesIO()
        original.save(buffer, 'JPEG', quality=quality)
        buffer.seek(0)
        resaved = Image.open(buffer)
        
        # Calculate ELA
        original_array = np.array(original, dtype=np.float32)
        resaved_array = np.array(resaved, dtype=np.float32)
        
        # Compute difference and amplify
        diff = np.abs(original_array - resaved_array)
        diff = (diff * scale).clip(0, 255).astype(np.uint8)
        
        return Image.fromarray(diff)
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None


def resize_image(image, target_size=(128, 128)):
    """Resize image to target size."""
    return image.resize(target_size, Image.Resampling.LANCZOS)


def process_image(args):
    """Process a single image (for parallel processing)."""
    input_path, output_path, target_size = args
    
    try:
        # Generate ELA
        ela = generate_ela(input_path)
        if ela is None:
            return False
        
        # Resize
        ela_resized = resize_image(ela, target_size)
        
        # Save
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        ela_resized.save(output_path, 'PNG')
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False


def preprocess_casia(input_dir, output_dir, target_size=(128, 128)):
    """
    Preprocess CASIA dataset.
    
    Expected CASIA structure:
    input_dir/
        Au/         # Authentic images
        Tp/         # Tampered images
    """
    print("Processing CASIA dataset...")
    
    tasks = []
    
    # Process authentic images
    au_dir = os.path.join(input_dir, 'Au')
    if os.path.exists(au_dir):
        for filename in os.listdir(au_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.bmp')):
                input_path = os.path.join(au_dir, filename)
                output_path = os.path.join(output_dir, 'authentic', f"{os.path.splitext(filename)[0]}.png")
                tasks.append((input_path, output_path, target_size))
    
    # Process tampered images
    tp_dir = os.path.join(input_dir, 'Tp')
    if os.path.exists(tp_dir):
        for filename in os.listdir(tp_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.bmp')):
                input_path = os.path.join(tp_dir, filename)
                output_path = os.path.join(output_dir, 'forged', f"{os.path.splitext(filename)[0]}.png")
                tasks.append((input_path, output_path, target_size))
    
    return tasks


def preprocess_columbia(input_dir, output_dir, target_size=(128, 128)):
    """
    Preprocess Columbia Image Splicing dataset.
    
    Expected Columbia structure:
    input_dir/
        4cam_auth/      # Authentic images
        4cam_splc/      # Spliced images
    """
    print("Processing Columbia dataset...")
    
    tasks = []
    
    # Process authentic images
    auth_dir = os.path.join(input_dir, '4cam_auth')
    if os.path.exists(auth_dir):
        for filename in os.listdir(auth_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.bmp')):
                input_path = os.path.join(auth_dir, filename)
                output_path = os.path.join(output_dir, 'authentic', f"columbia_{os.path.splitext(filename)[0]}.png")
                tasks.append((input_path, output_path, target_size))
    
    # Process spliced images
    splc_dir = os.path.join(input_dir, '4cam_splc')
    if os.path.exists(splc_dir):
        for filename in os.listdir(splc_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.tif', '.bmp')):
                input_path = os.path.join(splc_dir, filename)
                output_path = os.path.join(output_dir, 'forged', f"columbia_{os.path.splitext(filename)[0]}.png")
                tasks.append((input_path, output_path, target_size))
    
    return tasks


def main(input_dir, output_dir, target_size=(128, 128), workers=4):
    """
    Main preprocessing pipeline.
    """
    print("=" * 60)
    print("Dataset Preprocessing for Image Forgery Detection")
    print("=" * 60)
    print(f"Input directory: {input_dir}")
    print(f"Output directory: {output_dir}")
    print(f"Target size: {target_size}")
    print(f"Workers: {workers}")
    print("=" * 60)
    
    # Collect all tasks
    tasks = []
    
    # Check for CASIA structure
    if os.path.exists(os.path.join(input_dir, 'Au')) or os.path.exists(os.path.join(input_dir, 'Tp')):
        tasks.extend(preprocess_casia(input_dir, output_dir, target_size))
    
    # Check for Columbia structure
    if os.path.exists(os.path.join(input_dir, '4cam_auth')) or os.path.exists(os.path.join(input_dir, '4cam_splc')):
        tasks.extend(preprocess_columbia(input_dir, output_dir, target_size))
    
    # Also check subdirectories
    for subdir in os.listdir(input_dir):
        subdir_path = os.path.join(input_dir, subdir)
        if os.path.isdir(subdir_path):
            if os.path.exists(os.path.join(subdir_path, 'Au')):
                tasks.extend(preprocess_casia(subdir_path, output_dir, target_size))
            if os.path.exists(os.path.join(subdir_path, '4cam_auth')):
                tasks.extend(preprocess_columbia(subdir_path, output_dir, target_size))
    
    if not tasks:
        print("\nNo images found! Please check your directory structure.")
        print("Expected structures:")
        print("  CASIA: input_dir/Au/, input_dir/Tp/")
        print("  Columbia: input_dir/4cam_auth/, input_dir/4cam_splc/")
        return
    
    print(f"\nFound {len(tasks)} images to process...")
    
    # Process in parallel
    success = 0
    failed = 0
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(tqdm(executor.map(process_image, tasks), total=len(tasks), desc="Processing"))
        success = sum(results)
        failed = len(results) - success
    
    # Summary
    print("\n" + "=" * 60)
    print("Preprocessing Complete!")
    print(f"  Successful: {success}")
    print(f"  Failed: {failed}")
    
    # Count output
    authentic_count = len(os.listdir(os.path.join(output_dir, 'authentic'))) if os.path.exists(os.path.join(output_dir, 'authentic')) else 0
    forged_count = len(os.listdir(os.path.join(output_dir, 'forged'))) if os.path.exists(os.path.join(output_dir, 'forged')) else 0
    
    print(f"  Authentic images: {authentic_count}")
    print(f"  Forged images: {forged_count}")
    print("=" * 60)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Preprocess dataset for Image Forgery Detection')
    parser.add_argument('--input_dir', type=str, required=True, help='Path to raw dataset')
    parser.add_argument('--output_dir', type=str, required=True, help='Path to output processed dataset')
    parser.add_argument('--size', type=int, default=128, help='Target image size (default: 128)')
    parser.add_argument('--workers', type=int, default=4, help='Number of parallel workers')
    
    args = parser.parse_args()
    
    main(
        input_dir=args.input_dir,
        output_dir=args.output_dir,
        target_size=(args.size, args.size),
        workers=args.workers
    )
