# VS Code Extension Installation

## 🚀 Quick Install

### Step 1: Build Extension
```bash
cd vscode-extension
npm install
npm run compile
```

### Step 2: Install in VS Code
```bash
# Package the extension
npx vsce package

# Install the .vsix file
code --install-extension database-ai-assistant-0.0.1.vsix
```

### Step 3: Use Extension
1. **Open VS Code**
2. **Press `Cmd+Shift+P`**
3. **Type "Set Database Connection"**
4. **Enter your PostgreSQL connection string**
5. **Enter your Gemini API key**
6. **Press `Cmd+Shift+Q` to ask questions!**

## 🔧 Development Mode (Alternative)

```bash
cd vscode-extension
npm install
npm run compile
code .
# Press F5 to launch extension development host
```

## 📋 Requirements

- Node.js installed
- VS Code installed
- PostgreSQL database access
- Gemini API key (free from https://ai.google.dev)

## 🎯 Usage

Once installed:
- `Cmd+Shift+P` → "Set Database Connection"
- `Cmd+Shift+Q` → Ask database questions
- Extension generates SQL files automatically

Perfect for developers who want AI-powered SQL generation directly in their code editor! 🤖