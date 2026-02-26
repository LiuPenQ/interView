module.exports = {
    jwt: {
        secret: "your-secret-key-for-jwt-token-generation",
        refreshSecret: "your-secret-key-for-refresh-token-generation",
        expiresIn: "15m", // 15分钟
        refreshExpiresIn: "7d" // 7天
    }
};