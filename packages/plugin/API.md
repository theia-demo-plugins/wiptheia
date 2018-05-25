# Introduction

## Theia Plugin system description

### Command API

 A command is a unique identifier of a function which
 can be executed by a user via a keyboard shortcut, a
 menu action or directly.

Commands can be added using the [registerCommand](#commands.registerCommand) and
[registerTextEditorCommand](#commands.registerTextEditorCommand) functions.
Registration can be split in two step: first register command without handler, second register handler by command id.

Any contributed command are available to any plugin, command can be invoked by [executeCommand](#commands.executeCommand) function.

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

    const terminal = theia.window.createTerminal("Bash terminal", "/bin/bash", shellArgs: ["-l"]);

Where are:
    first argument - terminal lable on the UI.
    second argument - optinal path to the executable shell.
    third argument - optional options list arguments for the executable shell.

You can create terminal with specified options:

    const options: theia.TerminalOptions {
		name: "Bash terminal",
		shellPath: "/bin/bash";
        shellArgs: ["-l"];
		cwd: "/projects";
		env: { "TERM": "screen" };
	};

Where are:
 - "shellPath" - path to the executable shell, for example "/bin/bash", "bash", "sh" or so on.
 - "shellArgs" - shell command arguments, for example without login: "-l". If you defined shell command "/bin/bash" and set up shell arguments "-l" than will be created terminal process with command "/bin/bash -l".
And client side will connect to stdin/stdout of this process to interaction with user.
 - "cwd" - current working directory;
Function to create new terminal with defined theia.TerminalOptions described above.
 - "env"- enviroment variables for terminal process, for example TERM - identifier terminal window capabilities.

Function to create new terminal with defined theia.TerminalOptions described above:

    const terminal = theia.window.createTerminal(options);

Created terminal is not applied to a bottom panel. To apply created terminal to the bottom panel use method "show":

    terminal.show();

To hide bottom panel with created terminal use method "hide";

    terminal.hide();

Send text to the terminal:

    terminal.sendText("Hello, Theia!");

Subscribe to close terminal event:

    theia.window.onDidCloseTerminal((term) => {
        console.log("Terminal closed ");
    });

Detect termination terminal by Id:

    terminal.processId.then(id => {
        theia.window.onDidCloseTerminal(async (term) => {
            const currentId = await term.processId;
            if (currentId === id) {
                console.log("Terminal closed ", id);
            }
        }, id);
    });

#### Window State API

It is possible to track state of the IDE window inside a plugin. Window state is defined as:

```javascript
interface WindowState {
    readonly focused: boolean;
}
```

To read a state on demand one can use readonly variable:

```javascript
theia.window.state
```

To track window activity subscribe on `onDidChangeWindowState` event:

```javascript
const disposable = theia.window.onDidChangeWindowState((windowState: theia.WindowState) => {
            console.log('Window focus changed: ', windowState.focused);
});
```
