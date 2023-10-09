
<p style="text-align: center">
    <img src="assets/images/2023-10-09-17-10-59.png" alt="centered img"/>
</p>

<p style="text-align: center">
    <strong>Coconotes - A Markdown Note-Taking Web App</strong>
</p>

https://github.com/JesseCN1024/Coconotes/assets/100943944/f716ed4f-5973-427e-aad9-1908d74cb456

# Overview
Coconotes is a web-based note taking app that allows users to create notes in markdown format. Users can create multiple notes and have multi actions on each notes for easy organization.

# Features
* Add new notes
* Manipulation on notes:
  * Edit name
  * Delete note
  * Copy text
  * Clear all content
* Export notes to pdf
* Toggle markdown view

# Tech Stack
**Frontend**
* [React](https://react.dev/): The library for web and native user interfaces
* JavaScript
* Bootstrap, HTML/CSS
* Libraries and dependancies
  * html2canvas, react-markdown, react-to-pdf: contributing to convert pure text to markdown
  * nanoid: generate random id

**Backend**
* Firebase/Firestore

The Frontend is built using React, JavaScript, and Bootstrap for responsive styling and UI components.

The Backend uses Firebase Firestore as a cloud-hosted NoSQL database for storing note data. Firestore provides realtime data 
syncing and offline support for web and mobile apps.

# Installation 
1. Clone the repo
2. Install all dependencies with `npm install` or (`npm i && npm run dev`)
3. Start development server with `npm start`

In case the firestore getting troubles:
1. Create your own firebase project 
2. Add firestore database
3. In /firestore.js -> replace the configuration code of your firestore db

# Contact me at
* Your Name: **Khoa Nguyen**
* Email: nlydkhoa1024@gmail.com
* LinkedIn: https://www.linkedin.com/in/khoa-nguyen-ly/
