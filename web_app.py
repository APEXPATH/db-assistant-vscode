from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from database_agent import DatabaseAgent

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Database Query Assistant</title>
        <style>
            body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
            .container { background: #f5f5f5; padding: 20px; border-radius: 10px; }
            input[type="text"] { width: 70%; padding: 10px; font-size: 16px; }
            button { padding: 10px 20px; font-size: 16px; background: #007cba; color: white; border: none; cursor: pointer; }
            .result { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; white-space: pre-wrap; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Database Query Assistant</h1>
            <p>Ask questions about your database in natural language!</p>
            
            <input type="text" id="question" placeholder="e.g., Show me all customers" />
            <button onclick="askQuestion()">Ask</button>
            
            <div id="result" class="result" style="display:none;"></div>
        </div>
        
        <script>
            function askQuestion() {
                const question = document.getElementById('question').value;
                const resultDiv = document.getElementById('result');
                
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = 'Processing...';
                
                fetch('/ask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({question: question})
                })
                .then(response => response.json())
                .then(data => {
                    resultDiv.innerHTML = `SQL: ${data.sql}\\n\\nResults:\\n${data.results}`;
                });
            }
        </script>
    </body>
    </html>
    '''

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data['question']
    
    agent = DatabaseAgent()
    if agent.connect_postgres():
        agent.get_schema_info()
        sql, results = agent.ask(question)
        return jsonify({'sql': sql, 'results': results})
    
    return jsonify({'error': 'Database connection failed'})

@app.route('/execute', methods=['POST'])
def execute_query():
    data = request.json
    sql = data['sql']
    connection_string = data.get('connection', '')
    
    agent = DatabaseAgent()
    if agent.connect_postgres():
        results = agent.execute_query(sql)
        return jsonify({'results': results})
    
    return jsonify({'error': 'Database connection failed'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7979)