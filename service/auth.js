// 认证相关工具函数
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./config');

// 生成访问token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

// 生成刷新token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
    );
};

// 验证访问token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        return null;
    }
};

// 验证刷新token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
        return null;
    }
};

// 密码加密
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// 验证密码
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashPassword,
    verifyPassword
};