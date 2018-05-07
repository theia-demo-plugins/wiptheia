# Introduction
## Theia Plugin system description

### Command API
 A command is a unique identifier of a function which
 can be executed by a user via a keyboard shortcut, a
 menu action or directly.

Commands can be added using the [registerCommand](#commands.registerCommand) and
[registerTextEditorCommand](#commands.registerTextEditorCommand) functions.
Registration can be split in two step: first register command without handler, 
second register handler by command id.

Any contributed command are available to any plugin, command can be invoked 
by [executeCommand](#commands.executeCommand) function.

Simple example that register command:
```javascript
theia.commands.registerCommand({id:'say.hello.command'}, ()=>{
    console.log("Hello World!");
});
```

Simple example that invoke command:

```javascript
theia.commands.executeCommand('core.about');
```

### window

Common namespace for dealing with window and editor, showing messages and user input.

#### Quick Pick

Function to ask user select some value from the list.

Example of using:

```javascript
//configure quick pick options
 const option: theia.QuickPickOptions = {
        machOnDescription: true,
        machOnDetail: true,
        canPickMany: false,
        placeHolder: "Select string:",
        onDidSelectItem: (item) => console.log(`Item ${item} is selected`)
    };
 // call Theia api to show quick pick
theia.window.showQuickPick(["foo", "bar", "foobar"], option).then((val: string[] | undefined) => {
        console.log(`Quick Pick Selected: ${val}`);
    });
```
#### Notification API
 A notification shows an information message to users.
 Optionally provide an array of items which will be presented as clickable buttons.

 Notifications can be shown using the [showInformationMessage](#window.showInformationMessage),
 [showWarningMessage](#window.showWarningMessage) and [showErrorMessage](#window.showErrorMessage) functions.


Simple example that show an information message:
```javascript
theia.window.showInformationMessage('Information message');
```

Simple example that show an information message with buttons:
```javascript
theia.window.showInformationMessage('Information message', 'Btn1', 'Btn2').then(result => {
    console.log("Click button", result);
});
```
### Terminal

Function to create new terminal with specified arguments:

    theia.window.createTerminal("Bash terminal", "/bin/bash", shellArgs: ["-l"]);

You can create terminal with specified options:

    const options: theia.TerminalOptions {
		name: "Bash terminal",
		shellPath: "/bin/bash";
        shellArgs: ["-l"];
		cwd: "/projects";
		env: { "TERM": "screen" };
	};

Where are:
 - "shellPath" - shell executable command, for example "/bin/bash", "bash", "sh" or so on.
 - "shellArgs" - shell command arguments, for example without login: "-l". If you defined shell command "/bin/bash" and set up shell arguments "-l" then will be created terminal process with command "/bin/bash -l".
And client side will connect to stdin/stdout of this process to interaction with user.
 - "cwd" - current working directory;
Function to create new terminal with defined theia.TerminalOptions described above.
 - "env"- enviroment variables for terminal process, for example TERM - identifier terminal window capabilities.

Function to create new terminal with defined theia.TerminalOptions described above:

    theia.window.createTerminal(options);

Subscribe to close terminal event:
    # theia.window.onDidCloseTerminal: Event<Terminal>; // todo
