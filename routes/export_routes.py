from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
import pandas as pd
import io
from typing import List

from db import get_db
from models import User, Job, CandidateSummary
from utils import get_current_user

router = APIRouter()

@router.get("/job/{job_id}/shortlisted")
async def export_shortlisted_candidates(
    job_id: str,
    format: str = "csv",  # csv or xlsx
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export shortlisted candidates as CSV or Excel"""
    try:
        # Verify job belongs to user
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Get shortlisted candidates
        candidates = db.query(CandidateSummary).filter(
            CandidateSummary.job_id == job_id,
            CandidateSummary.status == "shortlisted"
        ).order_by(CandidateSummary.match_score.desc()).all()

        if not candidates:
            raise HTTPException(status_code=404, detail="No shortlisted candidates found")

        # Prepare data for export
        export_data = []
        for candidate in candidates:
            export_data.append({
                "Name": candidate.name,
                "Email": candidate.email or "N/A",
                "Phone": candidate.phone or "N/A",
                "Experience (Years)": candidate.experience_years,
                "Skills": candidate.skills or "N/A",
                "Match Score (%)": float(candidate.match_score),
                "Status": candidate.status.replace('_', ' ').title(),
                "Reasoning": candidate.reasoning or "N/A"
            })

        # Create DataFrame
        df = pd.DataFrame(export_data)

        if format.lower() == "xlsx":
            # Create Excel file
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='Shortlisted Candidates')
                
                # Auto-adjust column widths
                worksheet = writer.sheets['Shortlisted Candidates']
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)
                    worksheet.column_dimensions[column_letter].width = adjusted_width

            output.seek(0)
            
            return Response(
                content=output.getvalue(),
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={
                    "Content-Disposition": f"attachment; filename=shortlisted-candidates-{job.title.replace(' ', '-')}.xlsx"
                }
            )
        else:
            # Create CSV file
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)
            csv_content = csv_buffer.getvalue()

            return Response(
                content=csv_content,
                media_type="text/csv",
                headers={
                    "Content-Disposition": f"attachment; filename=shortlisted-candidates-{job.title.replace(' ', '-')}.csv"
                }
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Export failed: {str(e)}"
        )

@router.get("/job/{job_id}/all")
async def export_all_candidates(
    job_id: str,
    format: str = "csv",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export all candidates as CSV or Excel"""
    try:
        # Verify job belongs to user
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Get all candidates
        candidates = db.query(CandidateSummary).filter(
            CandidateSummary.job_id == job_id
        ).order_by(CandidateSummary.match_score.desc()).all()

        if not candidates:
            raise HTTPException(status_code=404, detail="No candidates found")

        # Prepare data for export
        export_data = []
        for candidate in candidates:
            export_data.append({
                "Name": candidate.name,
                "Email": candidate.email or "N/A",
                "Phone": candidate.phone or "N/A",
                "Experience (Years)": candidate.experience_years,
                "Skills": candidate.skills or "N/A",
                "Match Score (%)": float(candidate.match_score),
                "Status": candidate.status.replace('_', ' ').title(),
                "Reasoning": candidate.reasoning or "N/A"
            })

        # Create DataFrame
        df = pd.DataFrame(export_data)

        if format.lower() == "xlsx":
            # Create Excel file
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='All Candidates')
                
                # Auto-adjust column widths
                worksheet = writer.sheets['All Candidates']
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)
                    worksheet.column_dimensions[column_letter].width = adjusted_width

            output.seek(0)
            
            return Response(
                content=output.getvalue(),
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={
                    "Content-Disposition": f"attachment; filename=all-candidates-{job.title.replace(' ', '-')}.xlsx"
                }
            )
        else:
            # Create CSV file
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)
            csv_content = csv_buffer.getvalue()

            return Response(
                content=csv_content,
                media_type="text/csv",
                headers={
                    "Content-Disposition": f"attachment; filename=all-candidates-{job.title.replace(' ', '-')}.csv"
                }
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Export failed: {str(e)}"
        )
