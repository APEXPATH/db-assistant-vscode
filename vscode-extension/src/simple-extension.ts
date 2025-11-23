import * as vscode from 'vscode';
import * as http from 'http';

let savedConnection = '';
let savedApiKey = '';

function callAIService(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            question: question
        });

        const options = {
            hostname: 'localhost',
            port: 7979,
            path: '/ask',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response.sql || response.results || 'No SQL generated');
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

function executeQuery(sql: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            sql: sql,
            connection: savedConnection
        });

        const options = {
            hostname: 'localhost',
            port: 7979,
            path: '/execute',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response.results || 'No results');
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

export function activate(context: vscode.ExtensionContext) {
    
    // Simple command that definitely works
    let openPanel = vscode.commands.registerCommand('databaseAI.openPanel', () => {
        
        // Create a simple webview panel
        const panel = vscode.window.createWebviewPanel(
            'databaseAI',
            'ApexPath Database AI',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'saveConnection':
                        savedConnection = message.connection;
                        savedApiKey = message.apiKey;
                        panel.webview.postMessage({
                            command: 'connectionSaved'
                        });
                        break;
                    
                    case 'askQuestion':
                        try {
                            const sql = await callAIService(message.question);
                            panel.webview.postMessage({
                                command: 'sqlGenerated',
                                sql: sql,
                                question: message.question
                            });
                        } catch (error) {
                            panel.webview.postMessage({
                                command: 'error',
                                message: `AI service error: ${error}`
                            });
                        }
                        break;
                    
                    case 'executeQuery':
                        if (!savedConnection) {
                            panel.webview.postMessage({
                                command: 'error',
                                message: 'Please save database connection first'
                            });
                            return;
                        }
                        try {
                            const results = await executeQuery(message.sql);
                            panel.webview.postMessage({
                                command: 'queryResults',
                                results: results,
                                sql: message.sql
                            });
                        } catch (error) {
                            panel.webview.postMessage({
                                command: 'error',
                                message: `Database error: ${error}`
                            });
                        }
                        break;
                }
            },
            undefined,
            context.subscriptions
        );

        // Simple HTML content
        panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Database AI Assistant</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: #1e1e1e; 
                    color: #ffffff; 
                }
                .container { max-width: 600px; }
                h1 { color: #4CAF50; }
                input, textarea { 
                    width: 100%; 
                    padding: 10px; 
                    margin: 10px 0; 
                    background: #2d2d30; 
                    color: white; 
                    border: 1px solid #3e3e42; 
                    border-radius: 4px;
                }
                button { 
                    background: #0e639c; 
                    color: white; 
                    padding: 10px 20px; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer; 
                    margin: 5px;
                }
                button:hover { background: #1177bb; }
                .output { 
                    background: #2d2d30; 
                    padding: 15px; 
                    border-radius: 4px; 
                    margin: 10px 0; 
                    white-space: pre-wrap; 
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 ApexPath Database AI Assistant</h1>
                
                <h3>📡 Database Connection</h3>
                <input type="text" id="connection" placeholder="postgresql://user:password@host:port/database" />
                <input type="password" id="apikey" placeholder="Gemini API Key" />
                <button onclick="saveConnection()">Save Connection</button>
                
                <h3>💬 Ask Your Database</h3>
                <textarea id="question" rows="3" placeholder="Ask: Show me all customers"></textarea>
                <button onclick="askQuestion()">Generate SQL</button>
                <button onclick="clearAll()">Clear</button>
                
                <div id="output" class="output" style="display:none;"></div>
                <button id="runBtn" onclick="runQuery()" style="display:none; background:#28a745;">▶️ Run Query</button>
                <div id="results" class="output" style="display:none; background:#0d1117; border:1px solid #30363d;"></div>
                
                <h3>💡 Quick Examples</h3>
                <button onclick="setQuestion('Show me all customers')">All Customers</button>
                <button onclick="setQuestion('Find orders over 100')">Orders > 100</button>
                <button onclick="setQuestion('Show sales by city')">Sales by City</button>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                let generatedSQL = '';
                
                function runQuery() {
                    if (!generatedSQL) {
                        alert('❌ No SQL to run. Generate SQL first.');
                        return;
                    }
                    
                    const results = document.getElementById('results');
                    results.style.display = 'block';
                    results.textContent = '🔄 Executing query...';
                    
                    vscode.postMessage({
                        command: 'executeQuery',
                        sql: generatedSQL
                    });
                }
                
                function saveConnection() {
                    const conn = document.getElementById('connection').value;
                    const key = document.getElementById('apikey').value;
                    if (conn && key) {
                        vscode.postMessage({
                            command: 'saveConnection',
                            connection: conn,
                            apiKey: key
                        });
                    } else {
                        alert('❌ Please fill both fields');
                    }
                }
                
                function askQuestion() {
                    const question = document.getElementById('question').value;
                    if (!question) {
                        alert('❌ Please enter a question');
                        return;
                    }
                    
                    const output = document.getElementById('output');
                    output.style.display = 'block';
                    output.textContent = '🔄 Generating SQL...';
                    
                    vscode.postMessage({
                        command: 'askQuestion',
                        question: question
                    });
                }
                
                // Listen for messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    const output = document.getElementById('output');
                    
                    switch (message.command) {
                        case 'connectionSaved':
                            alert('✅ Connection saved!');
                            break;
                        case 'sqlGenerated':
                            generatedSQL = message.sql;
                            output.textContent = \`-- Question: \${message.question}\n-- Generated SQL:\n\n\${message.sql}\`;
                            document.getElementById('runBtn').style.display = 'inline-block';
                            document.getElementById('results').style.display = 'none';
                            break;
                        case 'queryResults':
                            const results = document.getElementById('results');
                            results.textContent = \`-- Query Results:\n\n\${message.results}\`;
                            break;
                        case 'error':
                            output.textContent = \`❌ Error: \${message.message}\`;
                            break;
                    }
                });
                
                function setQuestion(q) {
                    document.getElementById('question').value = q;
                }
                
                function clearAll() {
                    document.getElementById('question').value = '';
                    document.getElementById('output').style.display = 'none';
                }
            </script>
        </body>
        </html>`;
    });

    context.subscriptions.push(openPanel);
    
    // Show success message
    vscode.window.showInformationMessage('✅ ApexPath Database AI Assistant activated! Use Cmd+Shift+P → "Database AI: Open Database AI Assistant"');
}

export function deactivate() {}