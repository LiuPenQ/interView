const express = require("express");
const router = express.Router();
const SQLConnect = require("./SQLConnect");
const { v4: uuidv4 } = require('uuid');

// 健康检查接口
router.get("/health", (req, res) => {
    res.send({
        status: 200,
        data: { status: 'ok', timestamp: new Date().toISOString() }
    });
});

// 公司管理接口

// 获取所有公司
router.get("/companies", (req, res) => {
    const sql = "SELECT * FROM companies ORDER BY created_at DESC";
    SQLConnect(sql, null, result => {
        if (result.length >= 0) {
            res.send({
                status: 200,
                data: result
            });
        } else {
            res.send({
                status: 500,
                msg: "查询信息失败"
            });
        }
    });
});

// 获取单个公司
router.get("/companies/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM companies WHERE id = ?";
    SQLConnect(sql, [id], result => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result[0]
            });
        } else {
            res.send({
                status: 404,
                msg: "Company not found"
            });
        }
    });
});

// 创建公司
router.post("/companies", (req, res) => {
    console.log("Received company creation request:", req.body);
    const { name, description, position, salary } = req.body;
    
    console.log("Extracted fields - name:", name, "position:", position);
    
    if (!name || !position) {
        console.log("Validation failed - name:", name, "position:", position);
        return res.send({
            status: 400,
            msg: "Name and position are required"
        });
    }
    
    const id = uuidv4();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = "INSERT INTO companies (id, name, description, position, salary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const arr = [id, name, description, position, salary, now, now];
    
    SQLConnect(sql, arr, result => {
        if (result.affectedRows > 0) {
            // 查询刚创建的公司
            const selectSql = "SELECT * FROM companies WHERE id = ?";
            SQLConnect(selectSql, [id], companyResult => {
                if (companyResult.length > 0) {
                    res.send({
                        status: 201,
                        data: companyResult[0]
                    });
                } else {
                    res.send({
                        status: 500,
                        msg: "创建成功但查询失败"
                    });
                }
            });
        } else {
            res.send({
                status: 500,
                msg: "创建失败"
            });
        }
    });
});

// 更新公司
router.put("/companies/:id", (req, res) => {
    const id = req.params.id;
    const { name, description, position, salary } = req.body;
    
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = "UPDATE companies SET name = ?, description = ?, position = ?, salary = ?, updated_at = ? WHERE id = ?";
    const arr = [name, description, position, salary, now, id];
    
    SQLConnect(sql, arr, result => {
        if (result.affectedRows > 0) {
            // 查询更新后的公司
            const selectSql = "SELECT * FROM companies WHERE id = ?";
            SQLConnect(selectSql, [id], companyResult => {
                if (companyResult.length > 0) {
                    res.send({
                        status: 200,
                        data: companyResult[0]
                    });
                } else {
                    res.send({
                        status: 500,
                        msg: "更新成功但查询失败"
                    });
                }
            });
        } else {
            res.send({
                status: 404,
                msg: "Company not found"
            });
        }
    });
});

// 删除公司
router.delete("/companies/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM companies WHERE id = ?";
    
    SQLConnect(sql, [id], result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                data: { message: 'Company deleted successfully' }
            });
        } else {
            res.send({
                status: 404,
                msg: "Company not found"
            });
        }
    });
});

// 面试计划管理接口

// 获取所有面试计划
router.get("/interview-plans", (req, res) => {
    const sql = `
        SELECT ip.*, c.name as company_name, c.position as company_position
        FROM interview_plans ip
        JOIN companies c ON ip.company_id = c.id
        ORDER BY ip.created_at DESC
    `;
    SQLConnect(sql, null, result => {
        if (result.length >= 0) {
            res.send({
                status: 200,
                data: result
            });
        } else {
            res.send({
                status: 500,
                msg: "查询信息失败"
            });
        }
    });
});

// 获取单个面试计划
router.get("/interview-plans/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT ip.*, c.name as company_name, c.position as company_position
        FROM interview_plans ip
        JOIN companies c ON ip.company_id = c.id
        WHERE ip.id = ?
    `;
    SQLConnect(sql, [id], result => {
        if (result.length > 0) {
            res.send({
                status: 200,
                data: result[0]
            });
        } else {
            res.send({
                status: 404,
                msg: "Interview plan not found"
            });
        }
    });
});

// 创建面试计划
router.post("/interview-plans", (req, res) => {
    const { company_id, date, time, location, notes, status } = req.body;
    
    if (!company_id) {
        return res.send({
            status: 400,
            msg: "Company ID is required"
        });
    }
    
    // 检查公司是否存在
    const checkSql = "SELECT * FROM companies WHERE id = ?";
    SQLConnect(checkSql, [company_id], companyResult => {
        if (companyResult.length === 0) {
            return res.send({
                status: 404,
                msg: "Company not found"
            });
        }
        
        const id = uuidv4();
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const sql = "INSERT INTO interview_plans (id, company_id, date, time, location, notes, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const arr = [id, company_id, date, time, location, notes, status || 'pending', now, now];
        
        SQLConnect(sql, arr, result => {
            if (result.affectedRows > 0) {
                // 查询刚创建的面试计划
                const selectSql = `
                    SELECT ip.*, c.name as company_name, c.position as company_position
                    FROM interview_plans ip
                    JOIN companies c ON ip.company_id = c.id
                    WHERE ip.id = ?
                `;
                SQLConnect(selectSql, [id], planResult => {
                    if (planResult.length > 0) {
                        res.send({
                            status: 201,
                            data: planResult[0]
                        });
                    } else {
                        res.send({
                            status: 500,
                            msg: "创建成功但查询失败"
                        });
                    }
                });
            } else {
                res.send({
                    status: 500,
                    msg: "创建失败"
                });
            }
        });
    });
});

// 更新面试计划
router.put("/interview-plans/:id", (req, res) => {
    const id = req.params.id;
    const { company_id, date, time, location, notes, status } = req.body;
    
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = "UPDATE interview_plans SET company_id = ?, date = ?, time = ?, location = ?, notes = ?, status = ?, updated_at = ? WHERE id = ?";
    const arr = [company_id, date, time, location, notes, status, now, id];
    
    SQLConnect(sql, arr, result => {
        if (result.affectedRows > 0) {
            // 查询更新后的面试计划
            const selectSql = `
                SELECT ip.*, c.name as company_name, c.position as company_position
                FROM interview_plans ip
                JOIN companies c ON ip.company_id = c.id
                WHERE ip.id = ?
            `;
            SQLConnect(selectSql, [id], planResult => {
                if (planResult.length > 0) {
                    res.send({
                        status: 200,
                        data: planResult[0]
                    });
                } else {
                    res.send({
                        status: 500,
                        msg: "更新成功但查询失败"
                    });
                }
            });
        } else {
            res.send({
                status: 404,
                msg: "Interview plan not found"
            });
        }
    });
});

// 删除面试计划
router.delete("/interview-plans/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM interview_plans WHERE id = ?";
    
    SQLConnect(sql, [id], result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                data: { message: 'Interview plan deleted successfully' }
            });
        } else {
            res.send({
                status: 404,
                msg: "Interview plan not found"
            });
        }
    });
});

module.exports = router;