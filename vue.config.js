// vue.config.js
module.exports = {
    // proxy all webpack dev-server requests starting with /api
    // to our Spring Boot backend (localhost:8088) using http-proxy-middleware
    // see https://cli.vuejs.org/config/#devserver-proxy
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://iti0203-team04-back.azurewebsites.net', // this configuration needs to correspond to the Spring Boot backends' application.properties server.port TODO Fred
                ws: true,
                changeOrigin: true
            }
        }
    }
};
