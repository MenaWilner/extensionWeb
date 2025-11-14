import * as vscode from 'vscode';

export class HtmlEstructuraViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'htmlEstructuraView';

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.getHtml(webviewView.webview);

    // Escuchar mensajes desde el webview (los botones)
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'createProject':
          vscode.commands.executeCommand('html-estructura.createProject');
          break;
        case 'gitPush':
          vscode.commands.executeCommand('html-estructura.gitPush');
          break;
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const style = `
      body { font-family: sans-serif; padding: 1rem; }
      h2 { color: #007acc; text-align: center; }
      button {
        background-color: #007acc;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 10px 15px;
        margin: 10px 0;
        width: 100%;
        font-size: 15px;
        cursor: pointer;
      }
      button:hover {
        background-color: #005fa3;
      }
    `;

    const script = `
      const vscode = acquireVsCodeApi();
      function send(command) {
        vscode.postMessage({ command });
      }
    `;

    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>${style}</style>
        </head>
        <body>
          <h2>HTML Estructura</h2>
          <button onclick="send('createProject')">📁 Crear Proyecto Base</button>
          <button onclick="send('gitPush')">🚀 Commit & Push</button>
          <script>${script}</script>
        </body>
      </html>
    `;
  }
}
