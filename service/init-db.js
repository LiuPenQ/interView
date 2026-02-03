/*
 * @Descripttion: 数据库初始化脚本
 * @version: 1.0.0
 * @Author: 
 * @Date: 2024-01-01 00:00:00
 */

const mysql = require("mysql");
const sqlObj = {
    host:"127.0.0.1",
    user:"root",
    password:"150159",
    database:"web2019",
    timezone:"08:00"
};

const connection = mysql.createConnection(sqlObj);

connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
    
    // 创建 companies 表
    const createCompaniesTable = `
        CREATE TABLE IF NOT EXISTS companies (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            position VARCHAR(255) NOT NULL,
            salary VARCHAR(100),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    
    connection.query(createCompaniesTable, (err, result) => {
        if (err) {
            console.error('创建 companies 表失败:', err);
        } else {
            console.log('companies 表创建成功或已存在');
        }
        
        // 创建 interview_plans 表
        const createInterviewPlansTable = `
            CREATE TABLE IF NOT EXISTS interview_plans (
                id VARCHAR(36) PRIMARY KEY,
                company_id VARCHAR(36) NOT NULL,
                date DATE,
                time TIME,
                location VARCHAR(255),
                notes TEXT,
                status ENUM('pending', 'scheduled', 'completed', 'cancelled') DEFAULT 'pending',
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        
        connection.query(createInterviewPlansTable, (err, result) => {
            if (err) {
                console.error('创建 interview_plans 表失败:', err);
            } else {
                console.log('interview_plans 表创建成功或已存在');
            }
            
            // 创建索引
            const createIndexCompanies = `
                CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);
            `;
            
            connection.query(createIndexCompanies, (err, result) => {
                if (err) {
                    console.error('创建 companies 索引失败:', err);
                } else {
                    console.log('companies 索引创建成功或已存在');
                }
                
                const createIndexInterviewPlans = `
                    CREATE INDEX IF NOT EXISTS idx_interview_plans_created_at ON interview_plans(created_at);
                `;
                
                connection.query(createIndexInterviewPlans, (err, result) => {
                    if (err) {
                        console.error('创建 interview_plans 索引失败:', err);
                    } else {
                        console.log('interview_plans 索引创建成功或已存在');
                    }
                    
                    console.log('数据库初始化完成');
                    connection.end();
                });
            });
        });
    });
});