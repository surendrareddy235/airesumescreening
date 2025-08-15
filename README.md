# AI Resume Screening SaaS

A full-stack AI-powered resume screening and candidate matching platform built with FastAPI backend and React frontend.

## Features

- **AI-Powered Matching**: Uses sentence-transformers and FAISS for semantic similarity search
- **LLM Integration**: Groq API for intelligent candidate ranking and reasoning
- **Multi-factor Scoring**: Combines skills (60%), experience (30%), and education (10%)
- **Professional Dashboard**: Summary cards, pie charts, candidate tables, and export functionality
- **Secure Payments**: Stripe integration with free trial and paid credits
- **Resume Processing**: Supports PDF and DOCX files with automatic text extraction
- **Real-time Processing**: Background task processing with status updates
- **Export Capabilities**: CSV/Excel export of shortlisted candidates

## Architecture

### Backend (FastAPI)
- **Authentication**: JWT-based with email verification
- **File Processing**: PyPDF2 and python-docx for text extraction
- **AI/ML Pipeline**: sentence-transformers → FAISS → Groq API → Scoring
- **Database**: SQLAlchemy with MySQL support
- **Payments**: Stripe integration with webhook handling
- **Security**: Input validation, file type checking, automatic cleanup

### Frontend (React)
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: TanStack Query for API state
- **Routing**: Wouter for client-side routing
- **Charts**: Chart.js for data visualization
- **File Upload**: Drag-and-drop with react-dropzone

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL database
- Groq API key
- Stripe account (for payments)

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-resume-screening
