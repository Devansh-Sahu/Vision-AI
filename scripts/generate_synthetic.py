import cv2
import numpy as np
import os
import random
from pathlib import Path
from tqdm import tqdm
# import albumentations as A

# Config
DATASET_ROOT = "C:/HighwayHazardDataset/Raw"
OUTPUT_DIR = "C:/HighwayHazardDataset/Processed/Synthetic"
NUM_IMAGES = 200000

def add_shadow(image, x, y, w, h):
    """Adds a fake shadow under the object."""
    mask = np.zeros_like(image, dtype=np.uint8)
    center = (int(x + w/2), int(y + h))
    axes = (int(w/2), int(h/4))
    cv2.ellipse(mask, center, axes, 0, 0, 360, (0, 0, 0), -1)
    
    # Blur the shadow
    mask = cv2.GaussianBlur(mask, (21, 21), 0)
    
    # Blend: Darken image where shadow is
    shadow_layer = image.astype(np.float32) * 0.6
    original_layer = image.astype(np.float32)
    
    alpha = mask.astype(np.float32) / 255.0
    blended = (shadow_layer * alpha) + (original_layer * (1 - alpha))
    return blended.astype(np.uint8)

def load_assets(root):
    bg_dir = Path(root) / "clean" / "images"
    fg_dir = Path(root) / "objects" # PNGs with alpha
    
    backgrounds = list(bg_dir.glob("*.jpg"))
    foregrounds = list(fg_dir.glob("*.png"))
    return backgrounds, foregrounds

def compose_image(bg_path, fg_path):
    bg = cv2.imread(str(bg_path))
    fg = cv2.imread(str(fg_path), cv2.IMREAD_UNCHANGED)
    
    if bg is None or fg is None: return None, None

    h_bg, w_bg = bg.shape[:2]
    
    # Resize FG (Random Scale imitating depth)
    # Objects closer to bottom should be bigger
    scale = random.uniform(0.1, 0.4)
    target_w = int(w_bg * scale)
    ratio = target_w / fg.shape[1]
    target_h = int(fg.shape[0] * ratio)
    
    fg_resized = cv2.resize(fg, (target_w, target_h))
    
    # Extract Alpha
    if fg_resized.shape[2] < 4: return None, None # No alpha
    alpha = fg_resized[:, :, 3] / 255.0
    fg_rgb = fg_resized[:, :, :3]
    
    # Position: constrained to bottom half (road area approx)
    x_pos = random.randint(0, w_bg - target_w)
    y_pos = random.randint(int(h_bg * 0.4), h_bg - target_h)
    
    # Add Shadow to BG first
    bg = add_shadow(bg, x_pos, y_pos, target_w, target_h)

    # Composite
    roi = bg[y_pos:y_pos+target_h, x_pos:x_pos+target_w]
    
    for c in range(3):
        roi[:, :, c] = (alpha * fg_rgb[:, :, c]) + ((1 - alpha) * roi[:, :, c])
        
    bg[y_pos:y_pos+target_h, x_pos:x_pos+target_w] = roi

    # Label (YOLO format: class x_center y_center w h)
    # Class 0 = Hazard (Generic for now)
    x_c = (x_pos + target_w/2) / w_bg
    y_c = (y_pos + target_h/2) / h_bg
    w_n = target_w / w_bg
    h_n = target_h / h_bg
    label = f"0 {x_c:.6f} {y_c:.6f} {w_n:.6f} {h_n:.6f}"
    
    return bg, label

def main():
    bgs, fgs = load_assets(DATASET_ROOT)
    if not bgs or not fgs:
        print("Please place .jpg backgrounds in Raw/clean/images and .png foregrounds in Raw/objects")
        return

    out_img_dir = Path(OUTPUT_DIR) / "images"
    out_lbl_dir = Path(OUTPUT_DIR) / "labels"
    out_img_dir.mkdir(parents=True, exist_ok=True)
    out_lbl_dir.mkdir(parents=True, exist_ok=True)

    print(f"Generating synthetic images...")
    
    # DRY RUN LIMIT
    limit = 10 
    for i in tqdm(range(limit)):
        bg_path = random.choice(bgs)
        fg_path = random.choice(fgs)
        
        img, label = compose_image(bg_path, fg_path)
        if img is not None:
            fname = f"syn_{i:06d}"
            cv2.imwrite(str(out_img_dir / f"{fname}.jpg"), img)
            with open(out_lbl_dir / f"{fname}.txt", "w") as f:
                f.write(label)

if __name__ == "__main__":
    main()
