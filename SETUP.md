# Video Conferencing Setup Guide

## Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** and npm installed

✅ **LiveKit credentials are already configured - no additional setup needed!**

## Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **LiveKit Configuration:**
   The LiveKit credentials are already hardcoded in the backend for this demo:
   ```
   API Key: APIYT4h6NUqk4TF
   URL: wss://gaap-xh71ra4n.livekit.cloud
   ```
   No additional environment setup required!

3. **Run the FastAPI backend:**
   ```bash
   python backend.py
   ```
   The API will be available at `http://localhost:8000`

## Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Quick Test

**Test LiveKit credentials first (optional):**
```bash
python test_livekit.py
```

## Usage

1. Navigate to `http://localhost:5173/meetings`
2. Create a new meeting by:
   - Entering a meeting name
   - Selecting date and time
   - Clicking "Schedule Meeting"
3. Join the meeting by clicking the "Join" button
4. Allow camera and microphone permissions
5. Enter your name and join the video conference

## Features

- ✅ Real-time video conferencing powered by LiveKit
- ✅ Google Meet-like interface
- ✅ Meeting creation and scheduling
- ✅ Participant management
- ✅ Meeting controls (mute, camera, screen share, leave)
- ✅ Responsive design

## API Endpoints

- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings/{meeting_id}` - Get meeting information
- `POST /api/meetings/{meeting_id}/join` - Join a meeting (get access token)
- `DELETE /api/meetings/{meeting_id}` - End a meeting
- `GET /api/meetings` - List all meetings
- `GET /api/config` - Get frontend configuration

## Troubleshooting

1. **"Meeting not found" error:**
   - Ensure the backend is running
   - Check that the meeting ID is correct

2. **Video/audio not working:**
   - Check browser permissions for camera and microphone
   - Ensure you're using HTTPS in production

3. **Connection issues:**
   - LiveKit credentials are hardcoded and should work out of the box
   - Run `python test_livekit.py` to verify token generation

4. **CORS errors:**
   - The backend is configured to allow all origins in development
   - Update CORS settings for production deployment 