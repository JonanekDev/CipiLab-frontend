# CipiLab Frontend

🚧 **Work in Progress** 🚧

Frontend application for [CipiLab Backend](https://github.com/JonanekDev/CipiLab-backend).

## 🛠️ Technologies

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Pinia** - State management
- **Axios** - HTTP client

## 📋 Requirements

- Running instance of [CipiLab Backend](https://github.com/JonanekDev/CipiLab-backend)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server (auto-generates API client)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note:** The `predev` script automatically copies `openapi.json` from the backend repository (expected at `../cipilab-backend/openapi.json`) and generates the API client.