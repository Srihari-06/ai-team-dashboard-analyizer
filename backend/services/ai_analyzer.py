import google.generativeai as genai
import os
from models import Task, db
from sqlalchemy import func, text, case
import json
from decimal import Decimal

class AIAnalyzer:
    def __init__(self):
        # Only initialize Gemini
        if os.getenv('AIzaSyAse2SbC0V-LSLrdHb719pfqYseCEs06kc'):
            genai.configure(api_key=os.getenv('AIzaSyAse2SbC0V-LSLrdHb719pfqYseCEs06kc'))
            self.gemini_model = genai.GenerativeModel('gemini-pro')
        else:
            self.gemini_model = None
    
    def generate_insights(self):
        """Generate AI insights from task data"""
        try:
            # Get data for analysis using proper SQLAlchemy syntax
            status_counts = db.session.query(
                Task.status, func.count(Task.id)
            ).group_by(Task.status).all()
            
            # Fix the case statement syntax
            assignee_performance = db.session.query(
                Task.assignee,
                func.count(Task.id).label('total'),
                func.sum(
                    case((Task.status == 'Completed', 1), else_=0)
                ).label('completed')
            ).filter(Task.assignee != '').group_by(Task.assignee).all()
            
            overdue_tasks = Task.query.filter(
                Task.due_date < func.current_date(),
                Task.status != 'Completed'
            ).count()
            
            # Convert Decimal to float for JSON serialization
            data_summary = {
                'total_tasks': sum([count for _, count in status_counts]),
                'status_breakdown': dict(status_counts),
                'team_performance': [
                    {
                        'assignee': perf.assignee,
                        'completion_rate': float(round((perf.completed / perf.total * 100), 2)) if perf.total > 0 else 0.0
                    }
                    for perf in assignee_performance
                ],
                'overdue_tasks': overdue_tasks
            }
            
            prompt = f"""
            Analyze this team task management data and provide key insights:
            
            {json.dumps(data_summary, indent=2, default=self._json_serializer)}
            
            Please provide:
            1. Overall performance summary
            2. Key bottlenecks or issues
            3. Team performance highlights
            4. Recommendations for improvement
            
            Keep it concise and actionable.
            """
            
            if self.gemini_model:
                response = self.gemini_model.generate_content(prompt)
                return response.text
            else:
                # Return basic insights without AI
                return self._generate_basic_insights(data_summary)
                
        except Exception as e:
            print(f"AI insights error: {str(e)}")
            return f"Error generating insights: {str(e)}"
    
    def _json_serializer(self, obj):
        """Custom JSON serializer for objects not serializable by default json code"""
        if isinstance(obj, Decimal):
            return float(obj)
        raise TypeError(f"Object of type {type(obj)} is not JSON serializable")
    
    def _generate_basic_insights(self, data_summary):
        """Generate basic insights when AI is not available"""
        total_tasks = data_summary['total_tasks']
        status_breakdown = data_summary['status_breakdown']
        team_performance = data_summary['team_performance']
        overdue_tasks = data_summary['overdue_tasks']
        
        completed_tasks = status_breakdown.get('Completed', 0)
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        insights = [
            f"📊 **Team Performance Overview**",
            f"• Total Tasks: {total_tasks}",
            f"• Completed: {completed_tasks} ({completion_rate:.1f}%)",
            f"• Overdue: {overdue_tasks}",
            f"• Status Distribution: {', '.join([f'{k}: {v}' for k, v in status_breakdown.items()])}",
            "",
            f"👥 **Team Performance**"
        ]
        
        for perf in team_performance:
            insights.append(f"• {perf['assignee']}: {perf['completion_rate']}% completion rate")
        
        insights.extend([
            "",
            f"🚨 **Areas for Improvement**",
            f"• Focus on completing {overdue_tasks} overdue tasks",
            f"• Review tasks in progress and blocked status",
            f"• Balance workload across team members"
        ])
        
        return "\n".join(insights)
    
    def process_natural_language_query(self, query):
        """Process natural language query and return answer"""
        try:
            # Get database schema info
            schema_info = """
            Database tables:
            - tasks: id, task_id, title, assignee, status, priority, due_date, created_date, completed_date, story_points, tags, sheet_id
            """
            
            # Get sample data for context
            sample_statuses = db.session.query(Task.status).distinct().all()
            sample_assignees = db.session.query(Task.assignee).distinct().limit(10).all()
            
            context = f"""
            {schema_info}
            
            Available statuses: {[s[0] for s in sample_statuses]}
            Sample assignees: {[a[0] for a in sample_assignees if a[0]]}
            
            User Query: {query}
            
            Convert this natural language query into appropriate SQL and provide the answer.
            If you cannot generate SQL, provide a thoughtful response based on the available data.
            """
            
            if self.gemini_model:
                response = self.gemini_model.generate_content(context)
                return self._execute_sql_from_response(response.text, query)
            else:
                return self._answer_without_ai(query)
                
        except Exception as e:
            return f"Error processing query: {str(e)}"
    
    def _answer_without_ai(self, query):
        """Provide basic answers without AI"""
        query_lower = query.lower()
        
        if 'pending' in query_lower or 'todo' in query_lower:
            pending_count = Task.query.filter(Task.status.in_(['Pending', 'Todo', 'To Do'])).count()
            return f"There are {pending_count} pending tasks."
        
        elif 'completed' in query_lower:
            completed_count = Task.query.filter_by(status='Completed').count()
            return f"There are {completed_count} completed tasks."
        
        elif 'overdue' in query_lower:
            overdue_count = Task.query.filter(
                Task.due_date < func.current_date(),
                Task.status != 'Completed'
            ).count()
            return f"There are {overdue_count} overdue tasks."
        
        elif 'blocked' in query_lower:
            blocked_count = Task.query.filter_by(status='Blocked').count()
            return f"There are {blocked_count} blocked tasks."
        
        elif 'completion rate' in query_lower or 'assignee' in query_lower:
            # Calculate completion rate by assignee
            assignee_stats = db.session.query(
                Task.assignee,
                func.count(Task.id).label('total'),
                func.sum(case((Task.status == 'Completed', 1), else_=0)).label('completed')
            ).filter(Task.assignee != '').group_by(Task.assignee).all()
            
            if not assignee_stats:
                return "No team member data available."
            
            response = "Completion rates by assignee:\n"
            for stat in assignee_stats:
                completion_rate = (stat.completed / stat.total * 100) if stat.total > 0 else 0
                response += f"• {stat.assignee}: {completion_rate:.1f}% ({stat.completed}/{stat.total} tasks)\n"
            
            return response
        
        elif 'top performer' in query_lower:
            # Simple top performer calculation
            performers = db.session.query(
                Task.assignee,
                func.count(Task.id).label('total'),
                func.sum(case((Task.status == 'Completed', 1), else_=0)).label('completed')
            ).filter(Task.assignee != '').group_by(Task.assignee).all()
            
            if performers:
                best_performer = max(performers, key=lambda x: (x.completed or 0) / (x.total or 1))
                rate = (best_performer.completed / best_performer.total * 100) if best_performer.total > 0 else 0
                return f"Top performer is {best_performer.assignee} with {rate:.1f}% completion rate ({best_performer.completed}/{best_performer.total} tasks)."
            else:
                return "No team member data available."
        
        else:
            return "I can help with questions about task status, team performance, completion rates, and overdue tasks. Try asking about pending tasks, completed tasks, or team performance."
    
    def _execute_sql_from_response(self, ai_response, original_query):
        """Extract and execute SQL from AI response, or return thoughtful answer"""
        # Simple SQL detection (for demo purposes)
        if 'SELECT' in ai_response.upper() and 'FROM' in ai_response.upper():
            try:
                # Extract SQL query (basic implementation)
                lines = ai_response.split('\n')
                sql_lines = [line for line in lines if any(keyword in line.upper() for keyword in ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY'])]
                sql_query = ' '.join(sql_lines)
                
                # Execute query
                result = db.session.execute(text(sql_query))
                rows = result.fetchall()
                
                if rows:
                    return f"Answer: {rows[0][0] if len(rows[0]) == 1 else rows}"
                else:
                    return "No data found for your query."
            except Exception as e:
                return f"I understood your query but couldn't execute the analysis. Error: {str(e)}"
        else:
            # Return AI's direct response
            return ai_response