# ApexPath Database AI Assistant

[![ApexPath](https://img.shields.io/badge/ApexPath-Professional-blue)](https://apexpath.com)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://marketplace.visualstudio.com/items?itemName=ApexPath.apexpath-database-ai)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **Professional AI-powered SQL query generator for PostgreSQL databases. Transform natural language into optimized SQL queries instantly.**

![ApexPath Database AI Assistant](https://raw.githubusercontent.com/apexpath/database-ai-assistant/main/demo.gif)

## 🚀 Features

### ✨ **Natural Language to SQL**
- Convert plain English questions into optimized PostgreSQL queries
- Support for complex joins, aggregations, and subqueries
- Intelligent query optimization suggestions

### 🎯 **Professional Interface**
- Clean, integrated VS Code panel
- Real-time SQL preview and validation
- One-click copy to clipboard or create SQL files
- VS Code theme integration

### 🔧 **Enterprise Ready**
- Secure connection string management
- Support for multiple database environments
- Stored procedure and function generation
- Query history and favorites

### 🤖 **AI-Powered**
- Powered by Google Gemini AI (free tier available)
- Context-aware query generation
- Schema-intelligent suggestions
- Natural language understanding

## 📦 Installation

1. **Install from VS Code Marketplace:**
   - Open VS Code
   - Go to Extensions (`Cmd+Shift+X`)
   - Search for "ApexPath Database AI Assistant"
   - Click Install

2. **Or install manually:**
   ```bash
   code --install-extension apexpath-database-ai-1.0.0.vsix
   ```

## 🎯 Quick Start

### 1. Open the Assistant
- Click the **Database icon** in the Activity Bar
- Or use Command Palette: `ApexPath: Open Database AI Assistant`

### 2. Configure Connection
```
Connection String: postgresql://username:password@localhost:5432/database
API Key: Your Gemini API key (get free at https://ai.google.dev)
```

### 3. Start Asking Questions
- **"Show me all customers from New York"**
- **"Find orders placed in the last 30 days"**
- **"Create a function to calculate monthly revenue"**
- **"Show top 10 products by sales"**

## 💡 Example Queries

| Natural Language | Generated SQL |
|------------------|---------------|
| "Show me all active users" | `SELECT * FROM users WHERE status = 'active'` |
| "Find orders over $1000" | `SELECT * FROM orders WHERE amount > 1000` |
| "Top 5 customers by revenue" | `SELECT customer_id, SUM(amount) as revenue FROM orders GROUP BY customer_id ORDER BY revenue DESC LIMIT 5` |
| "Create user lookup function" | `CREATE OR REPLACE FUNCTION get_user(user_id INT) RETURNS TABLE(...) AS $$...` |

## 🔧 Configuration

### Database Connection Formats
```bash
# Local PostgreSQL
postgresql://username:password@localhost:5432/database_name

# Remote PostgreSQL
postgresql://username:password@hostname:5432/database_name

# PostgreSQL with SSL
postgresql://username:password@hostname:5432/database_name?sslmode=require
```

### API Key Setup
1. Visit [Google AI Studio](https://ai.google.dev)
2. Create a new API key (free tier available)
3. Copy the key to the extension settings

## 🎨 Screenshots

### Main Interface
![Main Interface](https://raw.githubusercontent.com/apexpath/database-ai-assistant/main/screenshots/main-interface.png)

### Query Generation
![Query Generation](https://raw.githubusercontent.com/apexpath/database-ai-assistant/main/screenshots/query-generation.png)

### SQL Output
![SQL Output](https://raw.githubusercontent.com/apexpath/database-ai-assistant/main/screenshots/sql-output.png)

## 🏢 Enterprise Features

### Security
- ✅ Local credential storage
- ✅ Encrypted API key handling
- ✅ No data sent to external servers (except AI API)
- ✅ Read-only query generation by default

### Team Collaboration
- ✅ Shareable query templates
- ✅ Standardized SQL formatting
- ✅ Version control friendly output
- ✅ Team workspace support

### Performance
- ✅ Optimized query suggestions
- ✅ Index usage recommendations
- ✅ Query execution plan analysis
- ✅ Performance monitoring integration

## 📚 Documentation

- [Getting Started Guide](https://docs.apexpath.com/database-ai/getting-started)
- [API Reference](https://docs.apexpath.com/database-ai/api)
- [Best Practices](https://docs.apexpath.com/database-ai/best-practices)
- [Troubleshooting](https://docs.apexpath.com/database-ai/troubleshooting)

## 🆘 Support

### Community Support
- [GitHub Issues](https://github.com/apexpath/database-ai-assistant/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/apexpath-database-ai)
- [Community Forum](https://community.apexpath.com)

### Professional Support
- **Email:** support@apexpath.com
- **Enterprise Support:** enterprise@apexpath.com
- **Documentation:** https://docs.apexpath.com

## 🔄 Updates & Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ PostgreSQL support
- ✅ Natural language processing
- ✅ VS Code integration
- ✅ Stored procedure generation

### Roadmap
- 🔄 MySQL support
- 🔄 SQL Server support
- 🔄 Query optimization suggestions
- 🔄 Team collaboration features
- 🔄 Advanced AI models

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏢 About ApexPath

**ApexPath Technologies** is a leading provider of AI-powered development tools and enterprise solutions. We specialize in making complex technologies accessible through intuitive interfaces and intelligent automation.

- **Website:** https://apexpath.com
- **Products:** https://apexpath.com/products
- **Careers:** https://apexpath.com/careers
- **Contact:** hello@apexpath.com

---

**Made with ❤️ by ApexPath Technologies**

*Transform your database workflow with AI-powered intelligence.*