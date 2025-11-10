CREATE DATABASE IF NOT EXISTS team_dashboard;
USE team_dashboard;



CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_id INT NOT NULL,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id VARCHAR(100),
    title VARCHAR(500),
    assignee VARCHAR(200),
    status VARCHAR(100),
    priority VARCHAR(50),
    due_date DATE,
    created_date DATE,
    completed_date DATE,
    story_points INT,
    tags VARCHAR(500),
    sheet_id INT NOT NULL,
    FOREIGN KEY (sheet_id) REFERENCES sheets(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);