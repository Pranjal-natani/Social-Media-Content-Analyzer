# Social Media Content Analyzer

A web-based application designed to analyze social media content and suggest engagement improvements. This application allows users to upload PDF and image files, extract text using PDF parsing and OCR (Optical Character Recognition), and perform text analysis (sentiment, readability, and hashtags).

## Features

- **Document Upload**: Supports PDF and image files (e.g., scanned documents) with a drag-and-drop or file picker interface.
- **Text Extraction**: 
  - PDF Parsing: Extracts text while preserving the formatting.
  - OCR: Extracts text from image files using Tesseract OCR.
- **Text Analysis**:
  - **Sentiment Analysis**: Analyzes the sentiment of the extracted text.
  - **Readability Analysis**: Evaluates the readability score of the extracted text.
  - **Hashtag Extraction**: Identifies hashtags present in the text for engagement improvements.

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/social-media-analyzer.git
cd social-media-analyzer
```

### Install Dependencies

- **Frontend**:
  1. Navigate to the `frontend` directory.
  2. Install the necessary dependencies:

  ```bash
  npm install
  ```

- **Backend**:
  1. Navigate to the `backend` directory.
  2. Install backend dependencies:

  ```bash
  npm install
  ```

### Run the Application

- To start the frontend:

```bash
cd frontend
npm start
```

- To start the backend:

```bash
cd backend
node server.js
```

The application will be accessible at `http://localhost:3000` (frontend) and the backend will be running at `http://localhost:5000`.

## Usage

1. Upload a PDF or image file by either dragging and dropping or selecting a file.
2. Once the document is uploaded, click on the buttons to extract text, analyze readability, analyze sentiment, or extract hashtags.
3. The results for readability score, sentiment, and hashtags will be displayed on the screen.

## Technologies Used

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **OCR**: Tesseract.js
- **Text Analysis**: Custom logic for readability, sentiment, and hashtag extraction
- **File Upload**: Multer for file uploads

## Contributors

Pranjal Natani
