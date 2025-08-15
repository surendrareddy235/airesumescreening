# Overview

AI Resume Screening SaaS is a full-stack application that automates resume screening and candidate matching using artificial intelligence. The platform allows recruiters to upload job descriptions and resumes, then uses machine learning models to rank candidates based on semantic similarity, skills matching, and experience evaluation. The system provides a professional dashboard with analytics, candidate management, and export capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built as a modern React single-page application using:

- **Framework**: React with TypeScript for type safety
- **Build System**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for data visualization (pie charts, analytics)
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe React components for payment processing

The frontend follows a component-based architecture with clear separation between pages, reusable UI components, and service layers for API communication.

## Backend Architecture

The backend uses a hybrid approach combining FastAPI (Python) and Express.js (Node.js):

- **Python Backend**: FastAPI handles AI/ML processing, resume parsing, and complex business logic
- **Node.js Server**: Express.js manages authentication, database operations, and API routing
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with email verification
- **File Processing**: Supports PDF (PyPDF2) and DOCX (python-docx) resume parsing
- **Background Processing**: FastAPI BackgroundTasks for asynchronous resume processing

## AI/ML Pipeline

The system implements a sophisticated AI-powered matching pipeline:

1. **Text Extraction**: Resumes are parsed and converted to plain text
2. **Embeddings Generation**: Uses sentence-transformers (all-MiniLM-L6-v2) to create vector representations
3. **Similarity Search**: FAISS (Facebook AI Similarity Search) for efficient vector similarity matching
4. **LLM Enhancement**: Groq API integration for intelligent candidate ranking and reasoning
5. **Multi-factor Scoring**: Combines skills (60%), experience (30%), and education (10%) weights

## Data Storage

- **Primary Database**: PostgreSQL for structured data (users, jobs, candidates, billing)
- **Vector Storage**: FAISS in-memory indices for similarity search (rebuilt per job)
- **Temporary Storage**: File uploads are processed and immediately cleaned up for security
- **Session Management**: JWT tokens stored client-side with automatic expiration

## External Integrations

### Payment Processing
- **Stripe**: Complete payment solution with checkout sessions, webhooks, and subscription management
- **Billing Model**: Free trial (50 resumes) + paid credits system
- **Security**: Webhook signature verification and secure payment handling

### Email Services
- **SMTP Integration**: Configurable email service for verification codes and notifications
- **Templates**: HTML/text email templates for user verification and password reset

### AI Services
- **Groq API**: LLM-powered candidate ranking and intelligent reasoning
- **Sentence Transformers**: Open-source embedding models for semantic similarity
- **FAISS**: Facebook's similarity search library for efficient vector operations

## Security Architecture

- **Authentication**: JWT tokens with configurable expiration times
- **Authorization**: Route-level protection with user context validation
- **File Security**: Strict file type validation, size limits, and automatic cleanup
- **Input Validation**: Zod schemas for comprehensive request validation
- **Environment Configuration**: Secure secret management through environment variables

## Deployment Architecture

The application is designed for containerized deployment:

- **Development**: Vite dev server with hot module replacement
- **Production**: Static file serving with API proxy configuration
- **Database**: PostgreSQL with connection pooling
- **File Storage**: Temporary local storage with automatic cleanup
- **Monitoring**: Structured logging and error handling throughout the stack

# External Dependencies

## Database Systems
- **PostgreSQL**: Primary relational database for all persistent data
- **Drizzle ORM**: Type-safe database operations and migrations

## AI/ML Services
- **Groq API**: Large language model for intelligent candidate ranking
- **Sentence Transformers**: Embedding generation for semantic similarity
- **FAISS**: Vector similarity search engine
- **PyTorch**: Machine learning framework (dependency of sentence-transformers)

## Payment Processing
- **Stripe**: Complete payment infrastructure including checkout, webhooks, and customer management

## Email Services
- **SMTP Provider**: Configurable email service (Gmail SMTP supported out of the box)

## File Processing
- **PyPDF2**: PDF text extraction
- **python-docx**: Microsoft Word document processing

## Development Tools
- **TypeScript**: Type safety across frontend and shared schemas
- **ESBuild**: Fast JavaScript bundling for production
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Unstyled, accessible UI primitives

## Runtime Dependencies
- **Node.js**: JavaScript runtime for the Express server
- **Python 3.11+**: Python runtime for FastAPI and AI processing
- **uvicorn**: ASGI server for FastAPI applications