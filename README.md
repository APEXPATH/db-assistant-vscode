# Database Query Assistant 🤖

A simple AI agent that converts natural language to SQL queries for both PostgreSQL and SQL Server.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and OpenAI API key
   ```

3. **Create sample data (PostgreSQL only):**
   ```bash
   python setup_sample_db.py
   ```

4. **Run the agent:**
   ```bash
   python database_agent.py
   ```

## Example Questions

- "Show me all customers"
- "What orders did John make?"
- "Show orders over $100"
- "How many customers per city?"

## Features

✅ Supports PostgreSQL and SQL Server  
✅ Natural language to SQL conversion  
✅ Safe (SELECT queries only)  
✅ Shows database schema  
✅ Easy to learn and extend  

## Learning Path

1. Start with sample data
2. Try different questions
3. Look at generated SQL
4. Modify for your own database
5. Add more features!

## Safety

- Only SELECT queries allowed
- Results limited to 10 rows
- No data modification possible