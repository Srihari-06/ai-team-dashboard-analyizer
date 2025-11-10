import pandas as pd
import os
from datetime import datetime

class ExcelParser:
    @staticmethod
    def parse_excel(file_path):
        """Parse Excel file with multiple sheets"""
        try:
            sheets_data = {}
            xl = pd.ExcelFile(file_path)
            
            for sheet_name in xl.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                
                # Clean and standardize column names
                df.columns = [str(col).lower().replace(' ', '_').strip() for col in df.columns]
                
                # Ensure required columns exist
                required_columns = ['task_id', 'title', 'assignee', 'status']
                for col in required_columns:
                    if col not in df.columns:
                        df[col] = ''
                
                # Handle optional columns
                optional_columns = {
                    'priority': '',
                    'due_date': None,
                    'created_date': None, 
                    'completed_date': None,
                    'story_points': 0,
                    'tags': ''
                }
                
                for col, default_value in optional_columns.items():
                    if col not in df.columns:
                        df[col] = default_value
                
                # Convert date columns safely
                date_columns = ['due_date', 'created_date', 'completed_date']
                for col in date_columns:
                    if col in df.columns:
                        df[col] = pd.to_datetime(df[col], errors='coerce')
                        # Replace NaT with None
                        df[col] = df[col].apply(lambda x: x if pd.notna(x) else None)
                
                # Convert numeric columns
                if 'story_points' in df.columns:
                    df['story_points'] = pd.to_numeric(df['story_points'], errors='coerce')
                    df['story_points'] = df['story_points'].fillna(0)
                
                # Fill NaN values in string columns
                string_columns = ['task_id', 'title', 'assignee', 'status', 'priority', 'tags']
                for col in string_columns:
                    if col in df.columns:
                        df[col] = df[col].fillna('').astype(str)
                
                sheets_data[sheet_name] = df
            
            return sheets_data
        except Exception as e:
            raise Exception(f"Error parsing Excel file: {str(e)}")
    
    @staticmethod
    def validate_dataframe(df):
        """Validate if DataFrame has required structure"""
        required_columns = ['task_id', 'title', 'assignee', 'status']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise Exception(f"Missing required columns: {', '.join(missing_columns)}")
        
        return True