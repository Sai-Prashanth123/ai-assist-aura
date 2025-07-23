# AI Features Setup Guide

This guide will help you set up the AI-powered real-time transcription and suggestions features for your video conferencing app.

## 🎯 Features Overview

- **Real-time Speech-to-Text**: Transcribes participant audio during meetings
- **AI-Powered Suggestions**: Provides contextual suggestions to the host based on conversation
- **Host-Only Interface**: AI suggestions panel visible only to meeting hosts
- **WebSocket Integration**: Real-time delivery of suggestions and transcripts

## 📋 Prerequisites

### 1. API Keys Configuration

✅ **Good News**: API keys are now hardcoded in the application for easy setup!

The following API keys are already configured in `ai_agent.py`:
- **OpenAI API Key**: For AI-powered suggestions (GPT-4o-mini model)
- **Deepgram API Key**: For real-time speech-to-text transcription

No additional environment variable setup required for AI services!

### 2. Environment Variables (Optional)

If you need to create a `.env` file for other configurations:

```bash
# LiveKit Configuration (already configured)
LIVEKIT_URL=wss://gaap-xh71ra4n.livekit.cloud
LIVEKIT_API_KEY=APITWWKCKDWYksm
LIVEKIT_API_SECRET=eo6W4iNbSu29eR0Ar14KoFfpuuLlqwfCX8mf2tzaWlbA

# Backend Configuration
API_BASE_URL=http://127.0.0.1:8000
WEBSOCKET_URL=ws://localhost:8765
```

## 🚀 Installation & Setup

### 1. Install AI Dependencies

In your virtual environment, install the required packages:

```bash
# Navigate to project directory
cd ai-assist-aura

# Activate your virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install AI dependencies
pip install -r requirements.txt
```

✅ **Simplified Setup**: All backend and AI agent code is now consolidated in `backend.py` - no separate AI agent file needed!

## 🎮 Usage Instructions

### 1. Start the Consolidated Backend Server

```bash
python backend.py
```

✨ **New**: This single command now starts:
- FastAPI backend server (`http://127.0.0.1:8000`)
- WebSocket server for AI suggestions (`ws://localhost:8765`)
- LiveKit AI Agent integration (automatically starts when needed)

### 2. Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Test the AI Features

1. **Create a Meeting**: Go to the meetings page and create a new meeting
2. **Join as Host**: Join the meeting with any name (first person is automatically host)
3. **Enable AI**: Click the "Start AI" button in the AI Assistant panel (top-right)
4. **Test Transcription**: Start speaking - the AI will transcribe and provide suggestions

## 🧪 Testing the AI Features

### Test Scenarios

Try these conversation scenarios to see AI suggestions:

1. **Price Questions**: "How much does this cost?" or "Is this expensive?"
   - Expected: Cost/ROI related suggestions

2. **Security Concerns**: "Is this secure?" or "What about data privacy?"
   - Expected: Security compliance suggestions

3. **Implementation Questions**: "How long does setup take?"
   - Expected: Implementation timeline suggestions

4. **General Questions**: Any question ending with "?"
   - Expected: Active listening suggestions

### Debugging

#### Check AI Agent Status
```bash
# Check if AI agent is running for a meeting
curl http://127.0.0.1:8000/api/meetings/{meeting_id}/ai-status
```

#### WebSocket Connection
The AI suggestions panel should show:
- "Live" badge when connected
- Real-time suggestions as you speak
- Notification sounds (if not muted)

#### Common Issues

1. **"Failed to start AI agent"**
   - Check that environment variables are set
   - Ensure OpenAI and Deepgram API keys are valid

2. **No WebSocket connection**
   - Verify port 8765 is available
   - Check browser console for WebSocket errors

3. **No transcription**
   - Check microphone permissions
   - Verify Deepgram API key is correct

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI        │    │   LiveKit       │
│   (React)       │    │   Backend        │    │   Agent         │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │AI Suggestions│◄┼────┼►│ WebSocket    │◄┼────┼►│ STT + LLM   │ │
│ │   Panel     │ │    │ │   Server     │ │    │ │ Processing  │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │LiveKit Room │◄┼────┼►│ Meeting API  │◄┼────┼►│ Room Audio  │ │
│ │(Video Call) │ │    │ │              │ │    │ │  Capture    │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Customization

### Knowledge Base Integration

To connect your knowledge base to AI suggestions:

1. Update `SalesAgentConfig.knowledge_base` in `backend.py`
2. Add your product/service information
3. The AI will reference this data in suggestions

### Custom Suggestion Rules

Modify `_create_rule_based_suggestion()` in `backend.py` to add custom logic for specific keywords or phrases.

### AI Model Configuration

Change AI models in the `agent_entrypoint()` function in `backend.py`:
- **STT**: `deepgram.STT(model="nova-2")` → change model
- **LLM**: `openai.LLM(model="gpt-4o-mini")` → use different model

## 📊 Monitoring

### API Endpoints

- `GET /api/meetings/{id}/ai-status` - Check AI agent status
- `POST /api/meetings/{id}/start-ai` - Start AI agent
- `POST /api/meetings/{id}/stop-ai` - Stop AI agent

## 🎉 Success!

You should now have:
- ✅ Real-time speech transcription
- ✅ AI-powered suggestions for hosts
- ✅ WebSocket-based real-time communication
- ✅ Google Meet-style UI with AI panel

The AI assistant will now help sales representatives by providing contextual suggestions during live meetings! 