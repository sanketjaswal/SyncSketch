# ![alt text](https://img.icons8.com/color/40/sign-up.png) syncSketch 

### Overview

The **syncSketch** Application is a Multi-User Real-Time Whiteboard Application allows users to collaboratively draw, write, and interact on a shared canvas in real-time. Built using modern web technologies, the application leverages WebSockets for instant updates and seamless collaboration between users.

### 🔗 Application Link

[https://syncsketch-frontend.onrender.com](https://syncsketch-frontend.onrender.com)

## 🌟 Key Features

- **Multi-User Platform** : Multiple users can simultaneously draw, erase and chat on the whiteboard.
- **Real-Time Collaboration** : Changes made by one user are instantly reflected for all connected users.
- **Drawing Tools** : A variety of tools including freehand drawing, shapes, eraser, undo/redo and color selection.
- **WebSocket Integration** : Broadcast events like drawing actions, erasing and chat messages in real-time.
- **Room Authorisation** : Each session has a unique room code for secure user entry.


## 🔧 Setup Instructions

### 1. Clone the repository

```shell
git clone https://github.com/sanketjaswal/SyncSketch.git
cd SyncSketch
```

### 2. Install dependencies for Client and Server

```shell
cd client
npm install

cd server
npm install
```

### 3. Start the application

```shell
npm start
```

This will run the app in development mode in http://localhost:3000.

### 4. Build for production

```shell
npm run build
```

## 🛠️ Dependencies

Below is a list of dependencies used in the project:

- **[React](https://www.npmjs.com/package/react)**: Frontend library for building user interfaces.
- **[React Router](https://www.npmjs.com/package/react-router-dom)**: For client-side routing within the application.
- **[Toastify](https://www.npmjs.com/package/toastify)**: Library for customizable toast notifications in web apps.
- **[Rough.js](https://roughjs.com/)**: Library for creating hand-drawn, sketchy graphics in web applications.
- **[React-Colorful](https://www.npmjs.com/package/react-colorful)**: Library for custom color picker in React.
- **[Socket.io](https://www.npmjs.com/package/scoketio)**: Library for real-time, bidirectional communication between clients and servers.
- **[Eslint](https://www.npmjs.com/package/eslint)**: ESLint tool used to detects and fixes JavaScript code issues.
- **[Prettier](https://www.npmjs.com/package/prettier)**: For code formatter with consistent styling.

## 🎨 Features Breakdown

### `Room` 

A room is a unique identifier that groups users for collaborative interactions within a specific session.

- `Create Room`
   - Define the User name.
   - Generate a unique room code.
   - Create a room. 
   - Room create will be joined to the new room.
 
> Room creater will share the room ID to the other users.

- `Join Room`
   - Define the User name.
   - Enter the unique room code.
   - Join the room. 
   - New user will be joined to the room.

### `Interactive Whiteboard`

An interactive canvas where you can draw, brainstorm, and collaborate with your team in real-time!

### `Color Picker`

Easily choose from a spectrum of colors to enhance your creative projects.

### `Sketching Tools`

Available tools for all your creative needs:
   - **𓂃🖌 Pencil** - Freehand drawing tool.
   - **― Line** - Draw straight lines with precision.
   - **🖍 High lighter** - Semi-transparent highlight effect.
   - **🖊 Marker** - Bold, marker-like strokes.
   - **▭ Quadrilateral** - Shape with four sides. 
   - **△ Triangle** - Shape with three sides.
   - **○ Circle** - Perfect circle shape.
   - **⬭ Eclipse** - Shape of uneven circle.
   - **⬡ Polygon** - Shape with multiple sides.
   - **☆ Star** - A Star shape.
   - **☑ Select** - Select and manipulate drawn elements.
   - **🅰 Text** -  Add text to the canvas.
   - **💨 Spray** - Dotted pattern Spray effect.
   - **🗑 Eraser** - Erase unwanted drawings.
   - **♒︎ Fill pattern** - Apply patterns to shapes fill.
   
> More tools to be added in coming updates.

### `Draw`

To draw on the whiteboard -
   - Chosse your desired tool and color.
   - Press the mouse click button.
   - Hold the click and Drag the mouse to your desire. 
   - Release the Mouse button.

### `Undo / Redo`

Revert or reapply your actions easily using Undo and Redo.

### `Clear Canvas`

Wipe the slate clean with the Clear Canvas option to start fresh.

## 🗂️ Code Structure

```shell
 client ──
  src
  ├── /components                   # Includes  components for application
  |
  ├── /pages                        # Includes pages to be shown
  │   └── index.jsx                 # Page to start the application
  |
  ├── /assets                       # Includes assets for application
  |
  ├── /utils                        # Includes utility functions of application
  |
  ├── App.jsx                       # Main component that houses the layout
  |
  ├── App.css                       # Global CSS file
  │
  └── index.html                    # Main index.html file

server ──
  ├── /utils                        # Includes utilities for server
  |
  ├── server.js                     # Main file for start server 
  |
  └── .env                          # Includes the environmental variables
```



# 🏁 Conclusion

Whether you're collaborating on a team project, brainstorming new ideas, or teaching a lesson, syncSketch makes remote collaboration fun and interactive. Join the creative revolution and start sketching in real-time today!

#

Feel free to reach out if you have any questions or suggestions. Happy sketching! ✍️
