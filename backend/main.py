from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from config import settings

# Import routes
from routes.auth_routes import router as auth_router
from routes.upload_routes import router as upload_router
from routes.job_routes import router as job_router
from routes.export_routes import router as export_router
from routes.billing_routes import router as billing_router

app = FastAPI(
    title="AI Resume Screening API",
    description="Backend API for AI-powered resume screening and candidate matching",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(upload_router, prefix="/api/jobs", tags=["Job Upload"])
app.include_router(job_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(export_router, prefix="/api/export", tags=["Export"])
app.include_router(billing_router, prefix="/api/billing", tags=["Billing"])

@app.get("/")
async def root():
    return {"message": "AI Resume Screening API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
