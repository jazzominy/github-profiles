const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  mode: "development",
  devtool: "inline-source-map",
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "react"]
          }
        }
      },
      {
        test: /\.css$/,
        /*
        * style-loader extracts the contents of css file and puts them in <style> tag in index.html
        * css-loader loads the contents and resolves any urls or import statements
        * 
        * You need to use these loaders in that order for the styles to be applied correctly
        */
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  devServer: {
    contentBase: "./public",
    watchContentBase: true,
    //Using host with 0.0.0.0 value allows access to app from other devices using local ip address
    host: '0.0.0.0',
    port: 3030
  }
};

module.exports = config;
