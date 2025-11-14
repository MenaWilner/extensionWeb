import * as vscode from 'vscode';

export class HtmlEstructuraViewProvider implements vscode.WebviewViewProvider {

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(view: vscode.WebviewView) {

    view.webview.options = { enableScripts: true };

    view.webview.html = `
      <!DOCTYPE html>
      <html lang="es">
      <body style="font-family:Arial;padding:15px;">

        <h2 style="color:#007acc;text-align:center;">HTML Estructura</h2>

        <button onclick="sendCmd('create')"
          style="width:100%;padding:10px;margin-top:10px;background:#007acc;border:none;border-radius:6px;color:white;">
          📁 Crear Proyecto Base
        </button>

        <button onclick="sendCmd('git')"
          style="width:100%;padding:10px;margin-top:10px;background:#28a745;border:none;border-radius:6px;color:white;">
          🚀 Commit & Push
        </button>

        <script>
          const vscode = acquireVsCodeApi();
          function sendCmd(cmd){
            vscode.postMessage({ cmd });
          }
        </script>

      </body>
      </html>
    `;

    view.webview.onDidReceiveMessage((msg) => {
      if (msg.cmd === "create") {
        vscode.commands.executeCommand("html-estructura.createProject");
      }
      if (msg.cmd === "git") {
        vscode.commands.executeCommand("html-estructura.gitPush");
      }
    });
  }
}
