# Physical AI & Humanoid Robotics - AI-Native Textbook

An interactive, AI-powered textbook built with Docusaurus, Better-Auth, and Gemini 2.0 Flash.

## ✨ Features

- 📚 **Comprehensive Content**: Modules on ROS 2, Gazebo, NVIDIA Isaac, and more
- 🤖 **AI Assistant**: Gemini 2.0 Flash powered chatbot with RAG
- 🔐 **Authentication**: Better-Auth with user profiles
- 🌍 **Multi-language**: English and Urdu (RTL support)
- 🎨 **Modern UI**: Purple gradient theme with glassmorphism
- 📊 **Progress Tracking**: Floating progress bar
- 🎯 **Personalization**: Content adapted to user background

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running (see backend/README.md)

### 1. Install Dependencies
```bash
cd website
npm install
```

### 2. Setup Environment
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm start
```

Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## 📖 Usage

### Authentication
1. Click "Login" in the navbar
2. Sign up with your email and profile information
3. Answer questions about your background (used for personalization)

### Using the AI Assistant
1. Click the "🤖 Ask AI" button (bottom-right)
2. Ask questions about the course content
3. Get personalized answers based on your profile

### Language Toggle
- Use the language dropdown in the navbar
- Switch between English and Urdu
- Content automatically adapts

## 🎨 Customization

### Theme
Edit `src/css/custom.css` to customize:
- Purple gradient colors
- Typography
- Spacing
- Animations

### Content
- Add new modules in `docs/`
- Update sidebar in `sidebars.ts`
- Configure in `docusaurus.config.ts`

## 🌐 Internationalization

### Adding Urdu Content
1. Create files in `i18n/ur/docusaurus-plugin-content-docs/current/`
2. Mirror the structure of `docs/`
3. Translate content to Urdu

### Adding More Languages
1. Update `docusaurus.config.ts`:
```typescript
i18n: {
  locales: ['en', 'ur', 'ar'], // Add new locale
  ...
}
```
2. Create `i18n/<locale>/` directory
3. Add translations

## 🚢 Deployment

### GitHub Pages
1. Update `docusaurus.config.ts`:
```typescript
url: 'https://yourusername.github.io',
baseUrl: '/repo-name/',
organizationName: 'yourusername',
projectName: 'repo-name',
```

2. Deploy:
```bash
npm run deploy
```

### Vercel
1. Import project in Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Deploy

## 📁 Project Structure

```
website/
├── docs/                    # Course content (Markdown)
│   ├── module0-intro/
│   ├── module1-ros2/
│   └── ...
├── i18n/                    # Translations
│   └── ur/                  # Urdu translations
├── src/
│   ├── components/          # React components
│   │   ├── Auth/           # Authentication components
│   │   ├── RAGChatbot.tsx  # AI chatbot
│   │   └── ProgressTracker.tsx
│   ├── css/
│   │   └── custom.css      # Custom styling
│   ├── pages/              # Custom pages
│   └── theme/              # Theme overrides
├── static/                  # Static assets
├── docusaurus.config.ts    # Docusaurus configuration
└── sidebars.ts             # Sidebar configuration
```

## 🔧 Development

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm run serve`: Serve production build locally
- `npm run clear`: Clear cache
- `npm run deploy`: Deploy to GitHub Pages

### Adding New Components
1. Create component in `src/components/`
2. Import in pages or `Root.js`
3. Style with CSS modules

## 🐛 Troubleshooting

### Build Errors
- Clear cache: `npm run clear`
- Delete `node_modules` and reinstall
- Check for MDX syntax errors

### Chatbot Not Working
- Verify backend is running
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for errors

### i18n 404 Errors
- Verify locale is configured in `docusaurus.config.ts`
- Check file structure in `i18n/` matches `docs/`
- Rebuild the site

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License
MIT
