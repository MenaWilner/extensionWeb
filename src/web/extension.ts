import { exec } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // =====================
  // Comando 1: Crear estructura base
  // =====================
  const createCommand = vscode.commands.registerCommand('html-estructura.createProject', async () => {
    const folder = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Seleccionar carpeta para crear el proyecto'
    });

    if (!folder || folder.length === 0) {
      vscode.window.showWarningMessage('No se seleccionó ninguna carpeta.');
      return;
    }

    const baseUri = folder[0];
    const encoder = new TextEncoder();

    const cssDir = vscode.Uri.joinPath(baseUri, 'css');
    const jsDir = vscode.Uri.joinPath(baseUri, 'js');
    const imgDir = vscode.Uri.joinPath(baseUri, 'img');
    await vscode.workspace.fs.createDirectory(cssDir);
    await vscode.workspace.fs.createDirectory(jsDir);
    await vscode.workspace.fs.createDirectory(imgDir);

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(baseUri, 'index.html'),
      encoder.encode(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Mi Proyecto Web</title><link rel="stylesheet" href="css/estilos.css"></head><body><h1>¡Hola Mundo!</h1><script src="js/main.js"></script></body></html>`)
    );

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(cssDir, 'estilos.css'),
      encoder.encode('body { font-family: Arial; text-align: center; margin-top: 50px; }')
    );

    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(jsDir, 'main.js'),
      encoder.encode('console.log("Hola desde JavaScript 🚀");')
    );

    vscode.window.showInformationMessage('✅ Estructura HTML/CSS/JS creada con éxito.');
  });

  // =====================
  // Comando 2: Git Commit & Push
  // =====================
  const pushCommand = vscode.commands.registerCommand('html-estructura.gitPush', async () => {
    const folder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!folder) {
      vscode.window.showErrorMessage('❌ No hay carpeta de proyecto abierta.');
      return;
    }

    const message = await vscode.window.showInputBox({
      prompt: 'Mensaje del commit',
      value: 'Actualización rápida 🚀'
    });

    if (!message) {
      vscode.window.showWarningMessage('⚠️ No se proporcionó mensaje de commit.');
      return;
    }

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Ejecutando Git...',
      cancellable: false
    }, async () => {
      return new Promise<void>((resolve) => {
        exec(`git add . && git commit -m "${message}" && git push`, { cwd: folder }, (error, stdout, stderr) => {
          if (error) {
            vscode.window.showErrorMessage(`❌ Error en Git: ${stderr}`);
            resolve();
            return;
          }
          vscode.window.showInformationMessage('✅ Cambios enviados a GitHub correctamente.');
          resolve();
        });
      });
    });
  });

  // Registrar ambos comandos
  context.subscriptions.push(createCommand);
  context.subscriptions.push(pushCommand);
}

export function deactivate() {}
