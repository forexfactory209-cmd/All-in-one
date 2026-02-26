# Vacation Rental App

A scalable Vacation Rental & Homeland Services Mobile App built with React Native and TypeScript.

## 📚 Documentation

Detailed documentation is available in the root directory:

- [**Documentation Index**](../DOCUMENTATION_INDEX.md) - **Start Here!**
- [Project Requirements](../PROJECT_REQUIREMENTS.md)
- [Folder Structure](../FOLDER_STRUCTURE.md)
- [Architecture Diagram](../ARCHITECTURE_DIAGRAM.md)
- [Quick Reference](../QUICK_REFERENCE.md)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Metro Bundler:
   ```bash
   npm start
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

4. Run on iOS:
   ```bash
   npm run ios
   ```

## 🏗️ Project Structure

The project follows a feature-based Clean Architecture:

```
src/
├── screens/              # Feature-based screens
├── components/           # Global reusable components
├── services/             # API & external services
├── store/               # Redux state management
├── hooks/               # Global custom hooks
├── utils/               # Utility functions
├── types/               # Global TypeScript types
├── theme/               # Design system
├── navigation/          # Navigation config
└── config/              # App configuration
```

See [FOLDER_STRUCTURE.md](../FOLDER_STRUCTURE.md) for details.
