import pandas as pd
from models import db, File, Sheet, Task
from datetime import datetime
from sqlalchemy import func, case

class DBService:
    @staticmethod
    def save_file_data(filename, sheets_data):
        """Save uploaded Excel file data to database"""
        try:
            # Create file record
            file_record = File(filename=filename)
            db.session.add(file_record)
            db.session.flush()  # Get the file ID
            
            for sheet_name, df in sheets_data.items():
                # Create sheet record
                sheet_record = Sheet(name=sheet_name, file_id=file_record.id)
                db.session.add(sheet_record)
                db.session.flush()
                
                # Convert DataFrame to task records
                for _, row in df.iterrows():
                    # Handle date conversions properly
                    due_date = row.get('due_date')
                    created_date = row.get('created_date')
                    completed_date = row.get('completed_date')
                    
                    # Convert pandas Timestamp to Python datetime.date
                    if due_date and pd.notna(due_date):
                        due_date = due_date.date() if hasattr(due_date, 'date') else due_date
                    
                    if created_date and pd.notna(created_date):
                        created_date = created_date.date() if hasattr(created_date, 'date') else created_date
                    
                    if completed_date and pd.notna(completed_date):
                        completed_date = completed_date.date() if hasattr(completed_date, 'date') else completed_date
                    
                    # Handle story_points (convert numpy types to Python types)
                    story_points = row.get('story_points')
                    if story_points is not None and pd.notna(story_points):
                        story_points = int(story_points)
                    else:
                        story_points = None
                    
                    task = Task(
                        task_id=str(row.get('task_id', '')),
                        title=str(row.get('title', '')),
                        assignee=str(row.get('assignee', '')),
                        status=str(row.get('status', '')),
                        priority=str(row.get('priority', '')),
                        due_date=due_date,
                        created_date=created_date,
                        completed_date=completed_date,
                        story_points=story_points,
                        tags=str(row.get('tags', '')),
                        sheet_id=sheet_record.id
                    )
                    db.session.add(task)
            
            db.session.commit()
            return file_record.id
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def get_all_files():
        """Get all uploaded files"""
        return File.query.order_by(File.upload_date.desc()).all()
    
    @staticmethod
    def get_file_data(file_id):
        """Get tasks data for a specific file"""
        tasks = Task.query.join(Sheet).join(File).filter(File.id == file_id).all()
        return tasks
    
    @staticmethod
    def get_overview_stats():
        """Get overview statistics for dashboard"""
        total_tasks = Task.query.count()
        
        status_counts = db.session.query(
            Task.status,
            func.count(Task.id)
        ).group_by(Task.status).all()
        
        # Fixed case statement syntax
        assignee_stats = db.session.query(
            Task.assignee,
            func.count(Task.id).label('total_tasks'),
            func.sum(case((Task.status == 'Completed', 1), else_=0)).label('completed')
        ).filter(Task.assignee != '').group_by(Task.assignee).all()
        
        return {
            'total_tasks': total_tasks,
            'status_counts': dict(status_counts),
            'assignee_stats': [
                {
                    'assignee': stat.assignee,
                    'total_tasks': stat.total_tasks,
                    'completed': stat.completed or 0
                }
                for stat in assignee_stats
            ]
        }