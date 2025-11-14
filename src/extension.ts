import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { HtmlEstructuraViewProvider } from './panel';

export function activate(context: vscode.ExtensionContext) {
  console.log("🟢 HTML Estructura: EXTENSIÓN ACTIVADA");

  const provider = new HtmlEstructuraViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("htmlEstructuraView", provider)
  );

  const createCommand = vscode.commands.registerCommand(
    "html-estructura.createProject",
    async () => {
      const folder = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false
      });

      if (!folder) return;

      const base = folder[0].fsPath;

      fs.mkdirSync(path.join(base, "css"), { recursive: true });
      fs.mkdirSync(path.join(base, "js"), { recursive: true });
      fs.mkdirSync(path.join(base, "img"), { recursive: true });
       fs.mkdirSync(path.join(base, "data"), { recursive: true });

      fs.writeFileSync(
        path.join(base, "index.html"),
`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Mi Proyecto Web</title>
<link rel="stylesheet" href="css/estilos.css">
</head>
<body>
<h1>¡Hola Mundo! 🎉</h1>
<script src="js/main.js"></script>
</body>
</html>`
      );

      fs.writeFileSync(
        path.join(base, "css", "estilos.css"),
        "body{font-family:Arial;background:#f2f2f2;padding-top:40px;text-align:center;}"
      );

      fs.writeFileSync(
        path.join(base, "js", "main.js"),
        `console.log("Proyecto listo 🚀");`
      );
       fs.writeFileSync(
        path.join(base, "data", "datos.json"),
        `console.log("Proyecto listo 🗒️");`
      );

      vscode.window.showInformationMessage("✔ Proyecto creado correctamente.");

const uri = vscode.Uri.file(base);
await vscode.commands.executeCommand('vscode.openFolder', uri);
    }
  );

  const gitCommand = vscode.commands.registerCommand(
    "html-estructura.gitPush",
    async () => {
      const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspace) return;

      const message = await vscode.window.showInputBox({
        prompt: "Mensaje del commit",
        value: "Actualización rápida 🚀"
      });

      if (!message) return;

      exec(
        `git add . && git commit -m "${message}" && git push`,
        { cwd: workspace },
        (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage("❌ Error en Git: " + stderr);
            return;
          }
          vscode.window.showInformationMessage("🚀 Cambios enviados a GitHub.");
        }
      );
    }
  );

  context.subscriptions.push(createCommand);
  context.subscriptions.push(gitCommand);
}

export function deactivate() {}
