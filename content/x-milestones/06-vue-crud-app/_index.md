---
title: "Vue.js CRUD App"
pre: "6. "
weight: 60
---

This set of milestones is all about building a RESTful API and interface for the [Lost Kansas Communities](https://lostkansas.ccrsdigitalprojects.com/) project. 

## Milestone 6 - Vue.js CRUD App

Building from the [previous milestone](../05-vue-starter/), expand upon the starter project by adding the following features:

1. Most menu items and routes are protected and only allow users with specific roles to view/access them
2. A page that lists all roles in the application for anyone with the `manage_users` role. Roles are not editable.
3. A page that lists all users in a data table for anyone with the `manage_users` role. 
   1. Helpful columns on that page should be searchable and sortable, as well as the ability to filter by role.
   2. A page to edit existing users, including updating their roles.
   3. A page to create new users and assign new roles.
   4. A method to delete existing users.
4. A page that lists all counties in the application for anyone with the `view_communities`, `manage_communities` and `add_communities` roles. Counties are not editable. 
5. A page that lists all communities in a data table for anyone with the  `view_communities`, `manage_communities` and `add_communities` roles.
   1. Helpful columns on that page should be searchable and sortable.
   2. A page to edit existing communities, including changing the county that they are in, for anyone with the `manage_communities` role.
   3. A page to create new communities and associated with a county, for anyone with the `manage_communities` and `add_communities` roles.
   4. A method to delete existing communities, for anyone with the `manage_communities` role.
   5. **For this milestone, you may hard-code the frontend to have all new communities owned by user ID 1 `admin`**
6. A page that lists all documents in a data table for anyone with the  `view_documents`, `manage_documents` and `add_documents` roles.
   1. Helpful columns on that page should be searchable and sortable. Document filenames should be clickable, and it should direct users to the appropriate file on the server (if such file exists; this should work for all uploaded files)
   2. A page to edit existing documents, for anyone with the `manage_documents` role.
   3. A page to create new documents, for anyone with the `manage_documents` and `add_documents` roles.
   4. A method to delete existing documents, for anyone with the `manage_documents` role.
   5. When creating or editing a document, users should also have the ability to upload a new file for that document.

We will **NOT** be handling the interface for metadata in this milestone. That will be the last milestone for this project. 

### Hints

#### Clickable Filenames

To make filenames clickable, you'll need to add an additional proxy route to the `client/vite.config.js` to allow users to access the `uploads` folder (or wherever you are storing your uploaded files). You can continue to use the Express static file middleware to serve these files.

#### File Uploads

To simplify the file upload process, you may want to ensure that files are named with the appropriate file extensions to match their mimetypes on the server. Below is an example if you are using [multer](https://expressjs.com/en/resources/middleware/multer.html) to handle file uploads - it uses [nanoid](https://www.npmjs.com/package/nanoid) to generate random filenames and [mime-types](https://www.npmjs.com/package/mime-types) to get the correct file extension to match the mimetype of the file. You can then store the filename, size, and mimetype you get from multer in your endpoint for uploading files.

```js {title="Document API Handler"}
// Initialize Multer
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    cb(null, nanoid() + "." + mime.extension(file.mimetype));
  },
});
const upload = multer({ storage: storage });
```

On the frontend, you can use the [PrimeVue FileUpload](https://primevue.org/fileupload/) component to select the file, but you should implement a [Custom Upload](https://primevue.org/fileupload/#custom-upload) handler. 

A brief but incomplete example is given below:

```vue {title="File Upload Example"}
<script setup>
// Import Libraries
import { ref } from 'vue'
import { api } from '@/configs/api'
import { FileUpload, Button } from 'primevue'

// Declare State
const file = ref()

// Upload function - could possibly call this after saving the document but before redirecting
const upload = function (documentid) {
  // If the user has selected a file
  if (file.value.hasFiles) {
    // Fetch the file from the user's filesystem into the browser
    fetch(file.value.files[0].objectURL)
      // convert the file to a blob
      .then((response) => response.blob())
      .then((blob) => {
        // Create a file from the blob and add it to a form data object
        const fileUpload = new File([blob], file.value.files[0].name, { type: blob.type })
        const form = new FormData()
        form.append('file', fileUpload)
        // Upload that form to the endpoint
        api
          .post('/api/v1/documents/' + documentid + '/upload', form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(function (response) {
            // handle success
          })
          .catch(function (error) {
            // handle error uploading file
          })
      })
      .catch(function (error) {
        // handle error reading file
      })
  } else {
    // No file was selected
  }
}
</script>
  <FileUpload ref="file" mode="basic" name="file" customUpload />
  <Button severity="success" @click="upload(props.id)" label="Upload" />
<template>
```