/**
 * 配置dev环境下的接口代理路径
 * example: '/api/user_info' 会被转发到 'http://daizong.qq.com:9002/api/user_info'
 */

var target = 'http://localhost:3003';

module.exports = {
    proxys: {
        '/resume': {
            target: target,
            changeOrigin: true
        }
    }
}
