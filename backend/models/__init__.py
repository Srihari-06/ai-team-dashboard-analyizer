from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class File(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=db.func.now())
    sheets = db.relationship('Sheet', backref='file', lazy=True, cascade='all, delete-orphan')

class Sheet(db.Model):
    __tablename__ = 'sheets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    file_id = db.Column(db.Integer, db.ForeignKey('files.id'), nullable=False)
    tasks = db.relationship('Task', backref='sheet', lazy=True, cascade='all, delete-orphan')

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.String(100))
    title = db.Column(db.String(500))
    assignee = db.Column(db.String(200))
    status = db.Column(db.String(100))
    priority = db.Column(db.String(50))
    due_date = db.Column(db.Date)
    created_date = db.Column(db.Date)
    completed_date = db.Column(db.Date)
    story_points = db.Column(db.Integer)
    tags = db.Column(db.String(500))
    sheet_id = db.Column(db.Integer, db.ForeignKey('sheets.id'), nullable=False)