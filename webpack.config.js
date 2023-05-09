 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 const path = require("path");
/*
back-end에서 babel을 통해 코드 처리를 했듯이
프론트 엔드 코드 처리는 webpack.config.js애서 해야함.

webpack-cli를 통해 콘솔에서 webpack을 불러올 수 있음.
webpack.config.js -> webpack이 읽을 콘피크 파일을 설정해서 내보내는 것.

*/

module.exports = {
    // entry => 내가 처리(변경)하고 싶은 파일
    entry: {
        main: "./src/frontend/js/main.js",
        videoPlayer : "./src/frontend/js/videoPlayer.js"
    },
    mode: "development",
    watch:true,
    plugins: [new MiniCssExtractPlugin({
        filename:"css/style.css",
    })
    ],
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    //loader => webpack은 loader를 통해 전환시킴
    module : {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets:"defaults"}]],
                    },
                },

            },
            //scss -> css 컴파일
            {
                test: /\.scss/,
            //webpack의 실행순서는 오른쪽에서 왼쪽으로 역방향. 
        // 3.style이 css 파일 브라우저 설정 , 2. 변경된 css 코드 css-loader전달 , 1. 일반적인 css 변경
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],

    },
};
