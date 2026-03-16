# PDF Reader with Gemini AI

A simple web application that leverages Google's Gemini AI to analyze, and summarize PDF documents.

## 🚀 Features

- **PDF Upload**: Easily upload PDF documents for analysis.
- **AI-Powered Insights**: Uses `gemini-2.5-flash-lite` for fast and intelligent processing.
- **Custom Prompts**: Ask specific questions about your PDF or get a general summary.
- **Token Usage Tracking**: Transparent view of input and output token consumption.

## 🛠️ Setup Guide

### 1. Obtain Gemini API Key
To use this application, you need an API key from Google.
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on **"Get API key"** and create a new API key.

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=5050
```

### 3. Installation
Install the necessary dependencies using npm:
```bash
npm install
```

## 🏃 Running the Application

### Development Mode
Runs the server with `nodemon` for automatic restarts on code changes:
```bash
npm run dev
```

### Production Mode
Starts the server normally:
```bash
npm start
```

Once the server is running, open your browser and navigate to:
**[http://localhost:5050](http://localhost:5050)**

## 📖 Usage Instructions

1. **Upload PDF**: Click the "Choose File" button or drag and drop a PDF file into the upload area.
2. **Enter Prompt**: (Optional) Type a specific question or instruction in the text box (e.g., "Summarize the key points in bullet points").
3. **Analyze**: Click the **Analyze PDF** button.
4. **View Results**: The AI-generated response will appear on the screen, along with detailed token usage statistics.

## 🧪 Testing the API

For detailed instructions on how to test the API endpoints using Postman or cURL, please refer to the [API Testing Guide](api_testing.md).

---

Built with Node.js, Express, and Google Gemini AI.
