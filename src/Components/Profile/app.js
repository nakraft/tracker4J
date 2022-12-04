/* 
Google Drive API:
Demonstration to:
1. upload 
2. delete 
3. create public URL of a file.
required npm package: googleapis
*/
const stream = require("stream");
const express = require("express");
const multer = require("multer");
// const path = require("path");
// const { google } = require("googleapis");
 
const uploadRouter = express.Router();
const upload = multer();
// const express = require('express');
// const uploadRouter = require('./router');
const app = express();
// const multer = require("multer");
app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/uploadFile.html`);
  
});
 
// const uploadRouter = express.Router();

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '927905110517-4pmv49s08st3o0frbvairivlgtjhoo5q.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04AVpsmagMM-fCgYIARAAGAQSNwF-L9IrGfabfbUZeVFSuBES3c84MWuKsrkDfOnwyL7UJSGKoRRUubh2IS87-kOkxda7S0n3-8c';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/

uploadRouter.post("/upload", upload.any(), async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const { body, files } = req;
   
      for (let f = 0; f < files.length; f += 1) {
        await uploadFile(files[f]);
      }
   
      console.log(body);
      res.status(200).send("Form Submitted");
    } catch (f) {
      res.send(f.message);
    }
    return 
  });
   
  module.exports = uploadRouter;




// const filePath = path.join(__dirname, 'Kanishk Harde Resume.pdf');

// async function uploadFile() {
//   try {
//     const response = await drive.files.create({
//       requestBody: {
//         name: 'Resume.pdf', //This can be name of your choice
//         mimeType: 'application/pdf',
        
//       },
//       media: {
//         mimeType: 'application/pdf',
        

//         body: fs.createReadStream(filePath),
//       },
//     });

//     console.log(response.data.id);
//   } catch (error) {
//     console.log(error.message);
//   }
// }
var fileID ="";
const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    try {
        const response = await drive.files.create({
          requestBody: {
            name: fileObject.originalname,
            mimeType: fileObject.mimeType,
            
          },
          media: {
            mimeType: fileObject.mimeType,
            
    
            body: fs.createReadStream("C:/users/kanishk harde/downloads/"+fileObject.originalname),
          },
        });
        console.log(fileObject);
        console.log(response.data.id);
        document.getElementById('demo').innerHTML = response.data.id;
        fileID = response.data.id;
        
        console.log("test");
        // var fileID = response.data.id;
      } catch (error) {
        console.log(error.message);
        console.log(fileObject);
      }
    }
// uploadFile();


async function deleteFile() {
  try {
    const response = await drive.files.delete({
      fileId: fileID,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

// deleteFile();

async function generatePublicUrl() {
  try {
    const fileId = fileID;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileID,
      fields: 'webViewLink, webContentLink',
    });
    console.log(result.data);
    console.log(fileID)
  } catch (error) {
    console.log(error.message);
  }
}

generatePublicUrl();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadRouter);
 
app.listen(8080, () => {
  console.log('Form running on port 8080');
});