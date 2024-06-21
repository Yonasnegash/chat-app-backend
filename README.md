# Chat Application Backend

This is the backend code for a chat application that supports both text messages and file uploads. The server is built with Express.js, WebSocket, and MongoDB.

## Features

- Real-time messaging using WebSocket
- File uploads with Multer
- Stores messages and file links in MongoDB
- Serves uploaded files as static content

## Prerequisites

- Node.js
- MongoDB

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Yonasnegash/chat-app-backend.git
   cd chat-app-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Ensure MongoDB is running:**

   Make sure your MongoDB server is running. You can start it using the following command:

   ```bash
   mongod
   ```

4. **Create `uploads` directory if it doesn't exist:**

   The server will create the `uploads` directory automatically if it doesn't exist.

5. **Start the server:**

   ```bash
   node server.js
   ```

   The server will start on `http://localhost:5000`.

## Endpoints

### POST /upload

Endpoint for uploading files and text messages.

**Request:**

- `file` (optional): The file to upload.
- `username` (required): The username of the sender.
- `message` (optional): The text message.

**Response:**

- `message`: A success message.
- `chatMessage`: The uploaded file and message details.

**Example:**

Using `curl`:

```bash
curl -X POST -F 'file=@path/to/your/file' -F 'username=YourName' -F 'message=Hello' http://localhost:5000/send
```
