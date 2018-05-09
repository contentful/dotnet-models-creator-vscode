'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.createModels', (folder) => {

        if (!folder) {
            return; // No folder
        }

        const path = folder.fsPath;
        const config = vscode.workspace.getConfiguration('contentful');
        
        const accessToken = config.get("accesstoken");
        if(accessToken === ""){
            vscode.window.showErrorMessage('You need to set contentful.accesstoken in your configuration');
            return;
        }
        
        const spaceId = config.get("spaceId");
        if(spaceId === ""){
            vscode.window.showErrorMessage('You need to set contentful.spaceId in your configuration');
            return;
        }

        let namespace = config.get("namespace");

        if(namespace === ""){
            namespace = "Replace.Me";
        }

        const command = `Contentful.ModelsCreator.Cli -a ${accessToken} -s ${spaceId} -p "${path}" -n ${namespace} -f`;

        const terminal = vscode.window.createTerminal("contentful-create-model");

        terminal.sendText(command);

        terminal.show();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}