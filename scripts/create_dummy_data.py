import cv2
import numpy as np
from pathlib import Path

# Config
DATASET_ROOT = "C:/HighwayHazardDataset/Raw"
CLEAN_DIR = Path(DATASET_ROOT) / "clean" / "images"
OBJECTS_DIR = Path(DATASET_ROOT) / "objects"

def create_dummies():
    CLEAN_DIR.mkdir(parents=True, exist_ok=True)
    OBJECTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Create 10 Clean Backgrounds (Gray Asphalt)
    print(f"Generating 10 dummy backgrounds in {CLEAN_DIR}...")
    for i in range(10):
        img = np.full((720, 1280, 3), 100, dtype=np.uint8) # Grey
        # Add some noise/lines
        cv2.line(img, (0, 360), (1280, 720), (50, 50, 50), 2)
        cv2.imwrite(str(CLEAN_DIR / f"bg_{i}.jpg"), img)
        
    # 2. Create 10 Dummy Objects (Red Box = Hazard)
    print(f"Generating 10 dummy objects in {OBJECTS_DIR}...")
    for i in range(10):
        # 4 channel PNG
        img = np.zeros((100, 100, 4), dtype=np.uint8)
        # Red square in middle
        img[20:80, 20:80, :3] = [0, 0, 255] # BGR
        img[20:80, 20:80, 3] = 255 # Alpha
        cv2.imwrite(str(OBJECTS_DIR / f"obj_{i}.png"), img)
        
    print("Dummy dataset created.")

if __name__ == "__main__":
    create_dummies()
