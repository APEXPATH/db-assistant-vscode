#!/bin/bash

echo "🔨 Building VS Code Extension..."

# Install dependencies
npm install

# Install vsce (VS Code Extension manager)
npm install -g vsce

# Compile TypeScript
npm run compile

# Package extension
vsce package

echo "✅ Extension built: database-ai-assistant-0.0.1.vsix"
echo ""
echo "📦 To install:"
echo "code --install-extension database-ai-assistant-0.0.1.vsix"