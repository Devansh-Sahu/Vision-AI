
<div align="center">
  <img src="public/vision-ai-banner.png" alt="Vision-AI Banner" width="100%" />
  
  <h1>Vision-AI: The Vision-AI Safety Engine (VASE)</h1>
  <p><strong>Democratizing Advanced Driver Assistance Systems (ADAS) to Save Lives.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_|_TF.js_|_Supabase-blue)](https://nextjs.org)
  [![Status](https://img.shields.io/badge/Status-Production_Ready-green)]()
</div>

---

## � The "Why": A Silent Crisis
Every single year, **1.35 million people** lose their lives in road traffic accidents globally. That is one person every 24 seconds.

Behind these numbers are families destroyed, dreams shattered, and futures stolen. 
The tragedy is that **93%** of these accidents are preventable, caused by human error:
*   **Drowsiness**: The microsleep that happens when you push yourself too hard.
*   **Late Reaction**: Failing to spot a jaywalking pedestrian or a stray animal in the dark.
*   **Infrastructure**: Hitting a deep pothole at high speed.

We asked ourselves: *Why are advanced safety features (ADAS) limited to luxury cars?*
**Vision-AI** is our answer. We operate with a single, unwavering intention: **To reduce accidents and save lives using the hardware you already own.**

---

## 🛠️ Technical Deep Dive: The VASE Architecture

Vision-AI works by transforming standard webcams and smartphones into high-fidelity sensors. It uses a **Dual-Stream Neural Network** architecture called **VASE (Vision-AI Safety Engine)**, running entirely on the client-side (Edge) for zero-latency inference.

### 1. The Core Engine (Client-Side AI)
We utilize **TensorFlow.js** with a **WebGL** backend to accelerate inference on the user's GPU.

#### A. Internal Stream: Driver State Monitoring (FaceMesh)
*   **Model**: MediaPipe Face Landmark Detection (468 distinct keypoints).
*   **Algorithm**: We calculate the **EAR (Eye Aspect Ratio)** in real-time to detect fatigue.
    $$EAR = \frac{||p_2 - p_6|| + ||p_3 - p_5||}{2 \times ||p_1 - p_4||}$$
*   **Logic**:
    *   The vertical distance between eyelids is averaged against the horizontal eye width.
    *   If `EAR < 0.25` for `> 20 frames` (approx 0.8s), it registers as a "Microsleep".
    *   **Head Pose**: We compute the Euler angles (Pitch, Yaw, Roll) to detect distraction (looking away).

#### B. External Stream: Road Hazard Detection (EfficientDet)
*   **Model**: EfficientDet-Lite0 (Quantized Int8).
*   **Classes**: Custom filtered COCO classes + specialized heuristics.
*   **Objects Detected**:
    *   `person` (Pedestrians/Cyclists)
    *   `animal` (Cows, Dogs, Bears - crucial for rural highways)
    *   `vehicle` (Trucks, Cars, "Wrong Way" detection)
    *   `road_hazard` (Potholes, Fallen Trees - *in progress*)
*   **Fusion**: Detections are validated against a "Risk Box" (Center 60% of frame) to ignore safe sidewalk objects.

### 2. Risk Assessment Logic (The Brain)
The sensor data is fused into a single **Safety Score** (0-100%) every 200ms:

```typescript
Risk = (DrowsinessScore * 0.6) + (HazardSeverity * 0.4)
```

| Risk Level | Trigger Condition | Action |
| :--- | :--- | :--- |
| **SAFE** | `Score < 30` | Monitoring (Green UI) |
| **CAUTION** | `Score 30-70` | Visual Warning (Yellow UI) |
| **CRITICAL** | `Score > 70` | **Loud Audio Alarm** + **Emergency Email** |

---

## ⚡ Tech Stack

We use a modern, type-safe stack designed for performance and reliability:

### Frontend & Application
*   **Next.js 16 (App Router)**: The backbone, utilizing Server Actions for secure API handling.
*   **React 19**: Leveraging the latest concurrent features for smooth UI updates.
*   **Tailwind CSS 4**: Zero-runtime styling for the "Futuristic Dashboard" aesthetic.
*   **Shadcn UI**: Accessible, robust component primitives.
*   **Framer Motion**: Smooth GPU-accelerated animations for alerts.

### Artificial Intelligence
*   **@tensorflow/tfjs**: The core tensor operations engine.
*   **@mediapipe/tasks-vision**: Optimized WASM binaries for computer vision tasks.
*   **WebGL**: Utilizing the GPU for non-blocking main thread performance.

### Backend & Infrastructure
*   **Supabase (PostgreSQL)**: Stores session telemetry, user profiles, and alert history.
*   **Row Level Security (RLS)**: Ensures users only access their own driving data.
*   **Nodemailer (SMTP)**: Handles critical "Life Saving" email dispatch logic.
*   **Stripe**: Manages subscription tiers (Pro/Enterprise) for cloud storage.

---

## 🚀 Getting Started

Turn your laptop into a safety device in 5 minutes.

### Prerequisites
*   Node.js 18.17+
*   A Computer with a Webcam (Internal or External)
*   (Optional) A secondary phone for Rear View (via DroidCam/Iriun)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/vision-ai.git
    cd vision-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with the following credentials (see `.env.example`):
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SMTP_USER=...
    SMTP_PASS=... 
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` to access the dashboard.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p><em>Built with Hope, Code, and the intent to Save Lives.</em></p>
  <p><strong>Team Vision-AI</strong></p>
</div>
