module.exports = {
    entry: './ninth-week/gesture.js',
    module: {
        rules: [
            {
                test:/\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: "geekCreateElement" }]]
                    }
                }
            }
        ]
    },
    mode: "development"
}