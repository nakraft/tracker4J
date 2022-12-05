## Troubleshooting 

Having issues with something in Tracker4J? Here is a list of commonly found problems and potential solutions: 

__Launching Application__: When accessing the software, I am not able to launch the application.

Solutions: 
- Check to make sure you are launching both the frontend and backend components. You will need to run ```python3 app.py``` within your virtual enviornment in the backend folder and also run ```yarn start``` within the root directory for the app the launch properly. 

__Website Documentation Not Comprehensive__: 

Accessing the website with full function documentation but missing the home page? You may have overwritten the index.html file by running the generate-documentation script. To open index.html, click the file from your file tree and it will open in a browser. No need to regenerate the documents unless you have additional functionality to describe. If you do, make sure to readd in the HTML within the main-content wrapper in the index.html file after running the script.
