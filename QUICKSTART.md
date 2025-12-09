# MindTrace Quick Start Guide

Get MindTrace up and running in 10 minutes.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10-3.12 ([Download](https://www.python.org/))
- **uv** Python package manager ([Install](https://docs.astral.sh/uv/getting-started/installation/))
- **Google Gemini API Key** ([Get one free](https://ai.google.dev/))

---

## Installation (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mindtrace.git
cd mindtrace
```

### 2. Install uv (if not already installed)

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 3. Setup Backend

```bash
cd server

# Install all Python dependencies
uv sync

# Create environment file
cp .env.example .env

# Edit .env and add your Gemini API key
nano .env  # or use your favorite editor
```

**Required in `.env`:**
```env
GEMINI_API_KEY=your-gemini-api-key-here
SECRET_KEY=your-secret-key-min-32-chars
```

### 4. Setup Frontend

```bash
# Dashboard
cd ../client
npm install
cp .env.example .env

# Glass Client (optional)
cd ../glass-client
npm install
cp .env.example .env
```

---

## Running the Application (3 minutes)

Open **3 terminal windows**:

### Terminal 1: Backend Server

```bash
cd server
uv run main.py
```

✅ Server running at `http://localhost:8000`
📚 API docs at `http://localhost:8000/docs`

### Terminal 2: Dashboard

```bash
cd client
npm run dev
```

✅ Dashboard running at `http://localhost:5173`

### Terminal 3: Glass Client (Optional)

```bash
cd glass-client
npm run dev
```

✅ Glass HUD running at `http://localhost:5174`

---

## First Steps (2 minutes)

### 1. Create an Account

1. Open `http://localhost:5173` in your browser
2. Click "Register" and create an account
3. Login with your credentials

### 2. Add Your First Contact

1. Navigate to "Contacts" in the sidebar
2. Click "Add Contact"
3. Fill in details:
   - Name: "John Doe"
   - Relationship: "Friend"
   - Upload a profile photo (optional)
4. Click "Save"

### 3. Test Face Recognition

1. Open the Glass Client at `http://localhost:5174`
2. Allow camera access when prompted
3. Show the profile photo to the camera
4. See the name appear on the HUD overlay!

### 4. Try the AI Assistant

1. Go back to the Dashboard
2. Navigate to "AI Summarizer"
3. Click "Chat with Your Memory"
4. Ask: "Who is John Doe?"
5. Get an AI-powered response!

---

## Common Issues

### Port Already in Use

If port 8000 is already in use:

```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or change the port in server/.env
PORT=8001
```

### Python Dependencies Fail

```bash
# Try with pip instead
cd server
pip install -r requirements.txt
python main.py
```

### Camera Not Working

- Ensure you're using HTTPS or localhost
- Check browser permissions
- Try a different browser (Chrome recommended)

### Gemini API Errors

- Verify your API key is correct in `server/.env`
- Check you have API quota remaining
- Ensure no extra spaces in the API key

---

## Next Steps

### Explore Features

- **Reminders**: Set up medication or meal reminders
- **Interactions**: Record conversations and meetings
- **Search**: Use semantic search to find past discussions
- **SOS**: Configure emergency contacts

### Customize

- **Models**: Change face recognition or speech models in `.env`
- **Themes**: Customize Tailwind CSS in `client/src/index.css`
- **API**: Explore the API docs at `http://localhost:8000/docs`

### Deploy

Ready for production? See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Server deployment with Nginx
- Database setup (PostgreSQL)
- SSL certificates
- Docker deployment
- Cloud deployment (AWS, GCP, Azure)

---

## Useful Commands

### Backend

```bash
# Run server
cd server && uv run main.py

# Run with auto-reload
cd server && uv run uvicorn app.app:app --reload

# Check Python dependencies
cd server && uv pip list

# Run tests
cd server && pytest
```

### Frontend

```bash
# Run dashboard
cd client && npm run dev

# Build for production
cd client && npm run build

# Lint code
cd client && npm run lint

# Preview production build
cd client && npm run preview
```

### Database

```bash
# Create tables (SQLite)
cd server && uv run python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Run migrations (if using Alembic)
cd server && uv run alembic upgrade head
```

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Backend**: Changes to Python files auto-reload the server
- **Frontend**: Changes to React files instantly update in browser

### API Testing

Use the interactive API docs:
1. Go to `http://localhost:8000/docs`
2. Click "Authorize" and enter your JWT token
3. Try out endpoints directly in the browser

### Debugging

**Backend:**
```python
# Add breakpoints
import pdb; pdb.set_trace()

# Or use print statements
print(f"Debug: {variable}")
```

**Frontend:**
```javascript
// Use browser DevTools
console.log('Debug:', variable);

// Or React DevTools extension
```

---

## Getting Help

- **Documentation**: [README.md](README.md)
- **API Reference**: [API.md](API.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/mindtrace/issues)

---

## What's Next?

### Learn More

- Read the full [README.md](README.md) for detailed architecture
- Explore [API.md](API.md) for complete API documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

### Build Something Cool

- Add new AI models
- Create mobile apps
- Integrate with other services
- Improve the UI/UX

### Share Your Experience

- Star the repo on GitHub ⭐
- Share on social media
- Write a blog post
- Submit a PR with improvements

---

**Happy coding! 🚀**

Built with ❤️ for people who need a little help remembering.
