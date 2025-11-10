from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from models import db
from services.excel_parser import ExcelParser
from services.db_service import DBService
from services.ai_analyzer import AIAnalyzer

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Initialize extensions
db.init_app(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize AI analyzer
ai_analyzer = AIAnalyzer()

@app.route('/upload_excel', methods=['POST'])
def upload_excel():
    """Handle Excel file upload and processing"""
    file_path = None  # Define file_path here to ensure it's accessible in finally block
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith(('.xlsx', '.xls')):
            return jsonify({'error': 'Only Excel files are allowed'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Parse Excel
        parser = ExcelParser()
        sheets_data = parser.parse_excel(file_path)
        
        # Validate and store in database
        for sheet_name, df in sheets_data.items():
            parser.validate_dataframe(df)
        
        file_id = DBService.save_file_data(filename, sheets_data)
        
        return jsonify({
            'message': 'File uploaded and processed successfully',
            'file_id': file_id,
            'sheets_processed': list(sheets_data.keys())
        }), 200
        
    except Exception as e:
        # Log the full error for debugging
        print(f"Upload error: {str(e)}")
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500
    finally:
        # Clean up uploaded file - with error handling
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Successfully cleaned up file: {file_path}")
            except Exception as cleanup_error:
                print(f"Warning: Could not delete file {file_path}: {cleanup_error}")
                # Don't fail the upload just because cleanup failed
@app.route('/get_overview', methods=['GET'])
def get_overview():
    """Get dashboard overview statistics"""
    try:
        stats = DBService.get_overview_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_sheet_data', methods=['GET'])
def get_sheet_data():
    """Get data for specific file/sheet"""
    try:
        file_id = request.args.get('file_id')
        if not file_id:
            return jsonify({'error': 'File ID required'}), 400
        
        tasks = DBService.get_file_data(file_id)
        
        tasks_data = []
        for task in tasks:
            tasks_data.append({
                'id': task.id,
                'task_id': task.task_id,
                'title': task.title,
                'assignee': task.assignee,
                'status': task.status,
                'priority': task.priority,
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'created_date': task.created_date.isoformat() if task.created_date else None,
                'completed_date': task.completed_date.isoformat() if task.completed_date else None,
                'story_points': task.story_points,
                'tags': task.tags
            })
        
        return jsonify({'tasks': tasks_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ask_ai', methods=['POST'])
def ask_ai():
    """Process natural language query with AI"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        response = ai_analyzer.process_natural_language_query(query)
        
        return jsonify({
            'query': query,
            'response': response
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_ai_insights', methods=['GET'])
def get_ai_insights():
    """Get AI-generated insights"""
    try:
        insights = ai_analyzer.generate_insights()
        return jsonify({'insights': insights}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files', methods=['GET'])
def get_files():
    """Get list of uploaded files"""
    try:
        files = DBService.get_all_files()
        files_data = []
        for file in files:
            files_data.append({
                'id': file.id,
                'filename': file.filename,
                'upload_date': file.upload_date.isoformat(),
                'sheet_count': len(file.sheets)
            })
        
        return jsonify({'files': files_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/')
def home():
    return jsonify({
        'message': 'AI Team Management Dashboard API is running!',
        'endpoints': {
            'upload_excel': 'POST /upload_excel',
            'get_overview': 'GET /get_overview',
            'get_ai_insights': 'GET /get_ai_insights',
            'ask_ai': 'POST /ask_ai',
            'files': 'GET /files'
        }
    })
def create_tables():
    """Create database tables if they don't exist"""
    try:
        with app.app_context():
            db.create_all()
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == '__main__':
    create_tables()
    app.run(debug=True, port=5000)