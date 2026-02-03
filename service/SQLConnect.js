/*
 * @Descripttion: 
 * @version: 
 * @Author: liupq
 * @Date: 2023-05-12 18:09:12
 * @LastEditors: liupq
 * @LastEditTime: 2023-05-12 18:12:28
 */

const mysql = require("mysql");
const sqlObj = {
    host:"127.0.0.1",
    user:"root",
    password:"150159",
    database:"boss",
    timezone:"08:00",
    charset:"utf8mb4"
}

const client = mysql.createConnection(sqlObj);

client.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    client.query('SET NAMES utf8mb4', (err) => {
        if (err) {
            console.error('设置字符集失败:', err);
        } else {
            console.log('数据库连接成功，字符集设置为 utf8mb4');
        }
    });
});

function SQLConnect(sql,arr,callback){
    client.query(sql,arr,(error,result) =>{
        if(error){
            console.log(error);
            return;
        }
        callback(result)
    })
}

module.exports = SQLConnect