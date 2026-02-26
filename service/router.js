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

// 任务管理接口

// 获取所有任务
router.get("/todos", (req, res) => {
    const sql = "SELECT * FROM todos ORDER BY date DESC, created_at DESC";
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

// 根据日期获取任务
router.get("/todos/date/:date", (req, res) => {
    const date = req.params.date;
    const sql = "SELECT * FROM todos WHERE date = ? ORDER BY created_at DESC";
    SQLConnect(sql, [date], result => {
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

// 创建任务
router.post("/todos", (req, res) => {
    const { date, title, description, completed } = req.body;
    
    if (!date || !title) {
        return res.send({
            status: 400,
            msg: "Date and title are required"
        });
    }
    
    const id = uuidv4();
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = "INSERT INTO todos (id, date, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const arr = [id, date, title, description, completed || false, now, now];
    
    SQLConnect(sql, arr, result => {
        if (result.affectedRows > 0) {
            // 查询刚创建的任务
            const selectSql = "SELECT * FROM todos WHERE id = ?";
            SQLConnect(selectSql, [id], todoResult => {
                if (todoResult.length > 0) {
                    res.send({
                        status: 201,
                        data: todoResult[0]
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

// 更新任务
router.put("/todos/:id", (req, res) => {
    const id = req.params.id;
    const { date, title, description, completed } = req.body;
    
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = "UPDATE todos SET date = ?, title = ?, description = ?, completed = ?, updated_at = ? WHERE id = ?";
    const arr = [date, title, description, completed, now, id];
    
    SQLConnect(sql, arr, result => {
        if (result.affectedRows > 0) {
            // 查询更新后的任务
            const selectSql = "SELECT * FROM todos WHERE id = ?";
            SQLConnect(selectSql, [id], todoResult => {
                if (todoResult.length > 0) {
                    res.send({
                        status: 200,
                        data: todoResult[0]
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
                msg: "Task not found"
            });
        }
    });
});

// 切换任务完成状态
router.patch("/todos/:id/completed", (req, res) => {
    const id = req.params.id;
    const { completed } = req.body;
    
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = "UPDATE todos SET completed = ?, updated_at = ? WHERE id = ?";
    const arr = [completed, now, id];
    
    SQLConnect(sql, arr, result => {
        if (result.affectedRows > 0) {
            // 查询更新后的任务
            const selectSql = "SELECT * FROM todos WHERE id = ?";
            SQLConnect(selectSql, [id], todoResult => {
                if (todoResult.length > 0) {
                    res.send({
                        status: 200,
                        data: todoResult[0]
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
                msg: "Task not found"
            });
        }
    });
});

// 删除任务
router.delete("/todos/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM todos WHERE id = ?";
    
    SQLConnect(sql, [id], result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                data: { message: 'Task deleted successfully' }
            });
        } else {
            res.send({
                status: 404,
                msg: "Task not found"
            });
        }
    });
});

// 认证相关接口
const auth = require('./auth');

// 注册接口
router.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.send({
                status: 400,
                msg: "用户名、邮箱和密码不能为空"
            });
        }
        
        // 检查用户名是否已存在
        const checkUsernameSql = "SELECT * FROM users WHERE username = ?";
        SQLConnect(checkUsernameSql, [username], usernameResult => {
            if (usernameResult.length > 0) {
                return res.send({
                    status: 400,
                    msg: "用户名已存在"
                });
            }
            
            // 检查邮箱是否已存在
            const checkEmailSql = "SELECT * FROM users WHERE email = ?";
            SQLConnect(checkEmailSql, [email], emailResult => {
                if (emailResult.length > 0) {
                    return res.send({
                        status: 400,
                        msg: "邮箱已存在"
                    });
                }
                
                // 密码加密
                auth.hashPassword(password).then(hashedPassword => {
                    const id = require('uuid').v4();
                    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    
                    const sql = "INSERT INTO users (id, username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)";
                    const arr = [id, username, email, hashedPassword, now, now];
                    
                    SQLConnect(sql, arr, result => {
                        if (result.affectedRows > 0) {
                            res.send({
                                status: 201,
                                data: { message: '注册成功' }
                            });
                        } else {
                            res.send({
                                status: 500,
                                msg: "注册失败"
                            });
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.send({
            status: 500,
            msg: "服务器内部错误"
        });
    }
});

// 登录接口
router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.send({
                status: 400,
                msg: "用户名和密码不能为空"
            });
        }
        
        // 查找用户
        const sql = "SELECT * FROM users WHERE username = ?";
        SQLConnect(sql, [username], result => {
            if (result.length === 0) {
                return res.send({
                    status: 401,
                    msg: "用户名或密码错误"
                });
            }
            
            const user = result[0];
            
            // 验证密码
            auth.verifyPassword(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return res.send({
                        status: 401,
                        msg: "用户名或密码错误"
                    });
                }
                
                // 生成token
                const accessToken = auth.generateAccessToken(user);
                const refreshToken = auth.generateRefreshToken(user);
                
                // 更新用户的refresh token
                const updateSql = "UPDATE users SET refresh_token = ? WHERE id = ?";
                SQLConnect(updateSql, [refreshToken, user.id], updateResult => {
                    if (updateResult.affectedRows > 0) {
                        res.send({
                            status: 200,
                            data: {
                                accessToken,
                                refreshToken,
                                user: {
                                    id: user.id,
                                    username: user.username,
                                    email: user.email
                                }
                            }
                        });
                    } else {
                        res.send({
                            status: 500,
                            msg: "登录失败"
                        });
                    }
                });
            });
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.send({
            status: 500,
            msg: "服务器内部错误"
        });
    }
});

// 刷新token接口
router.post("/auth/refresh", (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.send({
                status: 400,
                msg: "刷新token不能为空"
            });
        }
        
        // 验证refresh token
        const decoded = auth.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.send({
                status: 401,
                msg: "刷新token无效"
            });
        }
        
        // 查找用户并验证refresh token
        const sql = "SELECT * FROM users WHERE id = ? AND refresh_token = ?";
        SQLConnect(sql, [decoded.id, refreshToken], result => {
            if (result.length === 0) {
                return res.send({
                    status: 401,
                    msg: "刷新token无效"
                });
            }
            
            const user = result[0];
            
            // 生成新的access token
            const newAccessToken = auth.generateAccessToken(user);
            
            res.send({
                status: 200,
                data: {
                    accessToken: newAccessToken
                }
            });
        });
    } catch (error) {
        console.error('刷新token错误:', error);
        res.send({
            status: 500,
            msg: "服务器内部错误"
        });
    }
});

// 退出登录接口
router.post("/auth/logout", (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.send({
                status: 400,
                msg: "刷新token不能为空"
            });
        }
        
        // 验证refresh token
        const decoded = auth.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.send({
                status: 401,
                msg: "刷新token无效"
            });
        }
        
        // 清除用户的refresh token
        const sql = "UPDATE users SET refresh_token = NULL WHERE id = ?";
        SQLConnect(sql, [decoded.id], result => {
            if (result.affectedRows > 0) {
                res.send({
                    status: 200,
                    data: { message: '退出登录成功' }
                });
            } else {
                res.send({
                    status: 500,
                    msg: "退出登录失败"
                });
            }
        });
    } catch (error) {
        console.error('退出登录错误:', error);
        res.send({
            status: 500,
            msg: "服务器内部错误"
        });
    }
});

// 获取用户信息接口
router.get("/auth/me", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.send({
                status: 401,
                msg: "未授权"
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = auth.verifyAccessToken(token);
        
        if (!decoded) {
            return res.send({
                status: 401,
                msg: "token无效"
            });
        }
        
        // 查找用户
        const sql = "SELECT id, username, email, created_at FROM users WHERE id = ?";
        SQLConnect(sql, [decoded.id], result => {
            if (result.length === 0) {
                return res.send({
                    status: 404,
                    msg: "用户不存在"
                });
            }
            
            res.send({
                status: 200,
                data: result[0]
            });
        });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.send({
            status: 500,
            msg: "服务器内部错误"
        });
    }
});

module.exports = router;