'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.createModels', async (folder) => {

        if (!folder) {
            return; // No folder
        }

        const path:string = folder.fsPath;
        const config = vscode.workspace.getConfiguration('contentful');
        const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

        const appsettingsFiles = await vscode.workspace.findFiles("appsettings.json");
        let appsettings = "";
        if(appsettingsFiles.length > 0){
              appsettings = fs.readFileSync(appsettingsFiles[0].fsPath, 
                "utf8");
        }

        let accessToken = config.get("accesstoken");
        let spaceId = config.get("spaceId");

        if(appsettings.length > 0) {
            accessToken = getJsonValue(appsettings, 'DeliveryApiKey');
            spaceId = getJsonValue(appsettings, 'SpaceId');
        }

        if(accessToken === ""){
            vscode.window.showErrorMessage('You need to set contentful.accesstoken in your configuration');
            return;
        }
        
        if(spaceId === ""){
            vscode.window.showErrorMessage('You need to set contentful.spaceId in your configuration');
            return;
        }

        let namespace = config.get("namespace");

        if(namespace === ""){
            namespace = "Replace.Me";
        }

        const terminal = vscode.window.createTerminal("contentful-create-model");        

        // This API is still not available in the stable release of VS Code
        //  (<any>terminal).onData((data: string) => {
        //      const version = data.split(".");
        //      if(parseInt(version[0]) < 2 || (parseInt(version[0]) === 2  && parseInt(version[1]) < 1))
        //      {
        //          vscode.window.showErrorMessage('Unable to run command. .NET Core needs to be updated to at least version 2.1');
        //          return;
        //      } 
        //  });

        terminal.sendText("dotnet --version");

        if(!fs.existsSync(`${homeDir}\\.dotnet\\tools\\contentful.modelscreator.cli.exe`)) {
            vscode.window.showInformationMessage('Tool contentful.modelscreator.cli not installed. It will be installed globally.');
            terminal.sendText("dotnet tool install --global contentful.modelscreator.cli");
        }

        const command = `Contentful.ModelsCreator.Cli -a ${accessToken} -s ${spaceId} -p "${path}" -n ${namespace} -f`;

        terminal.sendText(command);

        terminal.show();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}

function getJsonValue(json:string, key:string){
    var regex = new RegExp('(?:"' + key + '": *")(.*?)(?:")');

    var matches = regex.exec(json);

    if(matches === null){
        return "";
    }

    return matches[1];
}