import os
import cv2
import yt_dlp
import argparse
from tqdm import tqdm
from pathlib import Path

# Configuration
DATASET_ROOT = "C:/HighwayHazardDataset/Raw"
SPLITS = ["clean", "hazard", "synthetic"]

def download_video(url, output_path):
    """Downloads video from YouTube using yt-dlp."""
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': str(output_path),
        'quiet': True,
        'no_warnings': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            ydl.download([url])
            return True
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            return False

def extract_frames(video_path, output_dir, fps=1):
    """Extracts frames from a video at a specific FPS."""
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"Could not open video {video_path}")
        return

    video_fps = cap.get(cv2.CAP_PROP_FPS)
    if video_fps == 0: return
    
    frame_interval = int(video_fps / fps)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    count = 0
    saved_count = 0
    
    video_name = Path(video_path).stem

    with tqdm(total=total_frames, desc=f"Processing {video_name}") as pbar:
        while True:
            ret, frame = cap.read()
            if not ret: break

            if count % frame_interval == 0:
                frame_name = f"{video_name}_frame_{saved_count:06d}.jpg"
                cv2.imwrite(str(output_dir / frame_name), frame)
                saved_count += 1
            
            count += 1
            pbar.update(1)

    cap.release()
    print(f"Extracted {saved_count} frames to {output_dir}")

def main():
    parser = argparse.ArgumentParser(description="Highway Hazard Data Collector")
    parser.add_argument("--mode", type=str, choices=["download", "extract", "all"], default="all")
    parser.add_argument("--split", type=str, choices=SPLITS, default="clean")
    parser.add_argument("--url", type=str, help="YouTube URL to process")
    parser.add_argument("--file", type=str, help="File containing list of URLs")
    
    args = parser.parse_args()
    
    # Setup Dirs
    raw_dir = Path(DATASET_ROOT) / args.split / "videos"
    frames_dir = Path(DATASET_ROOT) / args.split / "images"
    raw_dir.mkdir(parents=True, exist_ok=True)
    frames_dir.mkdir(parents=True, exist_ok=True)

    urls = []
    if args.url:
        urls.append(args.url)
    elif args.file:
        with open(args.file, 'r') as f:
            urls = [line.strip() for line in f if line.strip()]

    # 1. Download
    if args.mode in ["download", "all"]:
        for i, url in enumerate(urls):
            print(f"Downloading {i+1}/{len(urls)}: {url}")
            # Use video ID as filename
            video_id = url.split("v=")[-1].split("&")[0]
            out_path = raw_dir / f"{video_id}.mp4"
            
            if not out_path.exists():
                download_video(url, out_path)
            else:
                print("Skipping download (exists)")

    # 2. Extract
    if args.mode in ["extract", "all"]:
        video_files = list(raw_dir.glob("*.mp4"))
        for vid in video_files:
            extract_frames(vid, frames_dir, fps=1)

if __name__ == "__main__":
    main()
