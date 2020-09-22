#Electron Bug
This is the code that triggers the issue in the stack overflow question: https://stackoverflow.com/questions/63125631/problems-with-custom-html-dialog-in-electron

#Reproduce.
1. First install electron 9.1.1 (later versions MIGHT have bug)
2. Run `npm start` to trigger electron starting up.
3. Hit CTRL+SHIFT+I to open up dev tools (Do this BEFORE opening the dialog)
4. Click the `Open` button on the page to open the dialog.
5. Hit either button.
6. Repeat Step 4.
7. Look at error in dev tools.
