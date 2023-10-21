# Tempdrop

An app to execute my future extensions(of this project) without needing to install every file every single time and to choose what all extensions you want running at one time
This app runs as the main thread to some of my testing projects or projects that I do as an experiment.

This also serves as a simple app for users who would like to install and use the extensions rather than installing large electron apps for each one of the project that anyone creates.

# How it works
An electron app scans for the extension in the `tempdrop` folder in the `documents` in your PC. Find a project that was created for this app on github and download it, paste the folder in the `documents/tempdrop/extensions/` folder, then open the app. Once it finds an extension it shows up on the app under the requests section (click on the inbox icon on the top-left corner), click on the plus icon. Then go back via the top-left corner back button and enable the extension using the toggle next to the extension. All enabled extensions will be executed when then app is run.

# Creating and running an extenstion

First we will be creating an extension then we will be looking into how to run them!

## The following steps will help you create a extension for this app
- Step1 : Install and run this app (you will notice a new folder in the documents)
- Step2 : Open the extensions folder under the folder that the app had created
- Step3 : Now create a file called `main.js` and write all your electron based code. This file will be executed in the `MAIN PROCESS` of the electron app, you can import any electron object here
`NOTE: MAKE SURE TO USE __dirname WHEN REFERING TO A PATH IN YOUR EXTENSION `
- Step4 : Create a file called `ext.json` and add the following keys and values
  1. `name` - app name (STRING)
  2. `icon` - base64 data url (STRING)
  3. `developer` - name of the developer (STRING)
  4. `version` - version number (STRING)

Now that you know how to create an extension we will look into how to execute this

## Executing the extension that you created
- Step1 : Open the app and click on the inbox icon shown on the top-left corner of the app
- Step2 : If you did everything correctly, you should see the extension listed there, click on the plus button next to the app
- Step3 : Now click on the back icon from the top-left corner and turn on the toggle for your extension (enabling the extension)
- Step4 : Now you should see the extensions window / output as you had coded

## Thanks for checking this app out!

hope you found it fun and intresting... I'll be creating apps later for this and you can try them out!

Thank you!
