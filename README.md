# NeuroAI

NeuroAI is an advanced e-learning platform that leverages physiological and behavioral tracking to analyze student focus in real-time. By combining EEG data, eye tracking, and facial recognition, NeuroAI provides deep insights into a student's cognitive state and generates personalized AI feedback to improve their learning experience.

## Features

- **Brain-Computer Interface (EEG)**: Connects to Muse S headbands via `muselsl` to capture raw brainwaves and analyze focus (Beta/Gamma) vs relaxation (Alpha/Theta).
- **Advanced Eye Tracking**: Uses MediaPipe FaceMesh and WebGazer to track gaze direction, pupil stability, and focus percentage entirely in the browser.
- **Continuous Face Verification**: Ensures the authenticity of the student taking the session by continuously matching their face against a registered baseline using Python's `face_recognition`.
- **AI-Powered Insights**: Integrates with Google Gemini API to generate personalized learning tips and focus summaries based on the multi-modal data collected during the session.
- **Interactive Dashboard**: View historical data, overall focus scores, phase-by-phase breakdown, and detailed session reports.

## Technology Stack

### Frontend (Web App)
- **Framework**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: Prisma (PostgreSQL)
- **Authentication**: Better Auth
- **AI/CV Libraries**: MediaPipe FaceMesh, WebGazer

### Backend (AI Analysis)
- **Framework**: FastAPI, Python 3
- **Data Science**: Pandas, NumPy, SciPy
- **EEG Processing**: muselsl, pylsl
- **Face Recognition**: dlib, face_recognition, OpenCV
- **LLM**: google-generativeai (Gemini)

## Prerequisites

- Node.js (v18 or higher)
- Python (3.9 or higher)
- PostgreSQL Database
- C++ Build Tools (required for `dlib` and `face_recognition` in Python)
- Muse S Headband (optional, supports mock data for testing)

## Getting Started

Please see [SETUP.md](./SETUP.md) for detailed instructions on how to install dependencies and run both the Next.js frontend and the FastAPI backend.

## Architecture Overview

1. **Frontend**: The Next.js application runs the UI, handles user authentication, streams webcam data for local eye-tracking, and communicates with the AI backend.
2. **Backend**: The FastAPI server receives buffered eye-tracking data, connects to the local LSL stream for EEG data, performs heavy computations for concentration scoring, and generates AI insights.
3. **Database**: PostgreSQL stores user accounts, study sessions, and the aggregated concentration analysis results.

## License

Private Project - All Rights Reserved.