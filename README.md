# dotnet-models-creator
A Visual Studio Code extension to automatically create strongly typed models.

The extension is available at https://marketplace.visualstudio.com/ and can be directly installed in Visual Studio Code.


## Usage

The extension adds a new command, "Create Contentful models", when you right click a folder in Visual Studio Code. To be able to use it you need to add your CDA API access token and space ID in the user settings.

The command will automatically generate a class for each content type in your selected space, complete with a property of the correct type for each field.

![Example gif](https://raw.githubusercontent.com/contentful/dotnet-models-creator-vscode/master/models-creator.gif)
