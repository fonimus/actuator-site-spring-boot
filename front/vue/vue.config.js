module.exports = {
    baseUrl: './',
    outputDir: './build',
    devServer: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:9090',
                ws: true,
                changeOrigin: true
            }
        }
    }
};
