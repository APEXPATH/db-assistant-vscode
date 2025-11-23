"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const http = require("http");
const fs = require("fs");
const path = require("path");
let connectionString = '';
let apiKey = '';
let currentPanel;
function callAIService(postData) {
    return new Promise((resolve, reject) => {
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
                    resolve(response.sql);
                }
                catch (error) {
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
function getWebviewContent(context) {
    const htmlPath = path.join(context.extensionPath, 'webview.html');
    if (fs.existsSync(htmlPath)) {
        return fs.readFileSync(htmlPath, 'utf8');
    }
    // Fallback: return inline HTML if file not found
    return getInlineHTML();
}
function getInlineHTML() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database AI Assistant</title>
    <style>
        body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 20px; margin: 0; }
        .container { max-width: 100%; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid var(--vscode-panel-border); border-radius: 4px; background: var(--vscode-editor-background); }
        .section h3 { margin-top: 0; color: var(--vscode-textLink-foreground); }
        input, textarea { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); border-radius: 2px; box-sizing: border-box; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 8px 16px; margin: 5px 5px 5px 0; border-radius: 2px; cursor: pointer; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; display: none; }
        .status.success { background: var(--vscode-testing-iconPassed); color: white; }
        .status.error { background: var(--vscode-errorForeground); color: white; }
        .sql-output { background: var(--vscode-textCodeBlock-background); padding: 10px; border-radius: 4px; font-family: var(--vscode-editor-font-family); white-space: pre-wrap; margin: 10px 0; display: none; }
        .loading { display: none; color: var(--vscode-textLink-foreground); }
    </style>
</head>
<body>
    <div class="container">
        <h2>🤖 Database AI Assistant</h2>
        <div class="section">
            <h3>📡 Database Connection</h3>
            <input type="text" id="connectionString" placeholder="postgresql://user:password@host:port/database" />
            <input type="password" id="apiKey" placeholder="Gemini API Key (from https://ai.google.dev)" />
            <button onclick="saveConnection()">Save Connection</button>
            <div id="connectionStatus" class="status"></div>
        </div>
        <div class="section">
            <h3>💬 Ask Your Database</h3>
            <textarea id="question" rows="3" placeholder="Ask in natural language: 'Show me all customers from New York'"></textarea>
            <button onclick="askQuestion()">Generate SQL</button>
            <button onclick="clearOutput()">Clear</button>
            <div id="loading" class="loading">🔄 Generating SQL...</div>
            <div id="sqlOutput" class="sql-output"></div>
            <button id="copyBtn" onclick="copySQL()" style="display:none;">📋 Copy SQL</button>
            <button id="newFileBtn" onclick="createSQLFile()" style="display:none;">📄 Create SQL File</button>
        </div>
        <div class="section">
            <h3>💡 Example Questions</h3>
            <button onclick="setExample('Show me all customers')">All Customers</button>
            <button onclick="setExample('Find orders over $100')">Orders > $100</button>
            <button onclick="setExample('Show sales by city')">Sales by City</button>
            <button onclick="setExample('Create a function to get customer orders')">Create Function</button>
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        let generatedSQL = '';
        function saveConnection() {
            const connection = document.getElementById('connectionString').value;
            const apiKey = document.getElementById('apiKey').value;
            if (!connection || !apiKey) { showStatus('connectionStatus', 'Please fill in both fields', 'error'); return; }
            vscode.postMessage({ command: 'saveConnection', connection: connection, apiKey: apiKey });
        }
        function askQuestion() {
            const question = document.getElementById('question').value;
            if (!question.trim()) { alert('Please enter a question'); return; }
            document.getElementById('loading').style.display = 'block';
            document.getElementById('sqlOutput').style.display = 'none';
            document.getElementById('copyBtn').style.display = 'none';
            document.getElementById('newFileBtn').style.display = 'none';
            vscode.postMessage({ command: 'askQuestion', question: question });
        }
        function setExample(example) { document.getElementById('question').value = example; }
        function clearOutput() {
            document.getElementById('sqlOutput').style.display = 'none';
            document.getElementById('copyBtn').style.display = 'none';
            document.getElementById('newFileBtn').style.display = 'none';
            document.getElementById('question').value = '';
            generatedSQL = '';
        }
        function copySQL() { navigator.clipboard.writeText(generatedSQL); showStatus('connectionStatus', 'SQL copied to clipboard!', 'success'); }
        function createSQLFile() { vscode.postMessage({ command: 'createSQLFile', sql: generatedSQL, question: document.getElementById('question').value }); }
        function showStatus(elementId, message, type) {
            const status = document.getElementById(elementId);
            status.textContent = message;
            status.className = \`status \${type}\`;
            status.style.display = 'block';
            setTimeout(() => { status.style.display = 'none'; }, 3000);
        }
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'connectionSaved': showStatus('connectionStatus', 'Connection saved successfully!', 'success'); break;
                case 'sqlGenerated':
                    document.getElementById('loading').style.display = 'none';
                    generatedSQL = message.sql;
                    document.getElementById('sqlOutput').textContent = \`-- Question: \${message.question}\\n-- Generated SQL:\\n\\n\${message.sql}\`;
                    document.getElementById('sqlOutput').style.display = 'block';
                    document.getElementById('copyBtn').style.display = 'inline-block';
                    document.getElementById('newFileBtn').style.display = 'inline-block';
                    break;
                case 'error': document.getElementById('loading').style.display = 'none'; showStatus('connectionStatus', message.message, 'error'); break;
            }
        });
    </script>
</body>
</html>`;
}
function activate(context) {
    // Command to open the main panel
    let openPanel = vscode.commands.registerCommand('databaseAI.openPanel', () => {
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.One);
        }
        else {
            currentPanel = vscode.window.createWebviewPanel('databaseAI', 'Database AI Assistant', vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true
            });
            currentPanel.webview.html = getWebviewContent(context);
            // Handle messages from webview
            currentPanel.webview.onDidReceiveMessage(async (message) => {
                switch (message.command) {
                    case 'saveConnection':
                        connectionString = message.connection;
                        apiKey = message.apiKey;
                        currentPanel?.webview.postMessage({
                            command: 'connectionSaved'
                        });
                        break;
                    case 'askQuestion':
                        if (!connectionString || !apiKey) {
                            currentPanel?.webview.postMessage({
                                command: 'error',
                                message: 'Please set database connection first'
                            });
                            return;
                        }
                        try {
                            const postData = JSON.stringify({
                                question: message.question,
                                connection: connectionString,
                                apiKey: apiKey
                            });
                            const sql = await callAIService(postData);
                            currentPanel?.webview.postMessage({
                                command: 'sqlGenerated',
                                sql: sql,
                                question: message.question
                            });
                        }
                        catch (error) {
                            currentPanel?.webview.postMessage({
                                command: 'error',
                                message: `Error generating SQL: ${error}`
                            });
                        }
                        break;
                    case 'createSQLFile':
                        const doc = await vscode.workspace.openTextDocument({
                            content: `-- Question: ${message.question}\n-- Generated SQL:\n\n${message.sql}`,
                            language: 'sql'
                        });
                        await vscode.window.showTextDocument(doc);
                        break;
                }
            }, undefined, context.subscriptions);
            currentPanel.onDidDispose(() => {
                currentPanel = undefined;
            }, null, context.subscriptions);
        }
    });
    // Register tree data provider for sidebar
    const provider = new DatabaseAIProvider();
    vscode.window.registerTreeDataProvider('databaseAI', provider);
    context.subscriptions.push(openPanel);
}
exports.activate = activate;
class DatabaseAIProvider {
    getTreeItem(element) {
        const item = new vscode.TreeItem(element);
        if (element === 'Open Assistant') {
            item.command = {
                command: 'databaseAI.openPanel',
                title: 'Open Database AI Assistant'
            };
            item.iconPath = new vscode.ThemeIcon('database');
        }
        return item;
    }
    getChildren() {
        return ['Open Assistant'];
    }
}
function deactivate() {
    if (currentPanel) {
        currentPanel.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map