const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");

const config = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "src")
  },
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[id].[chunkhash].js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    /**
     * Create another chunk which contains only the webpack runtime
     */
    runtimeChunk: true,
    splitChunks: {
      /**
       * optimize for all chunks (initial and dynamically loaded)
       */
      chunks: "all",
      cacheGroups: {
        /**
         * Put all the modules used from node_modules in a separate vendor file
         */
        vendor: {
          test: /node_modules/,
          chunks: "initial"
          /* name: "vendor" */
        }
      }
    }
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
      /**
       * ExtractTextPlugin exctacts the <style> tag, injected by style-loader, in to a separate css file
       */
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            /* 
            * You need to use useRelativePath along with outputPath so that the path generated in styles.css files
            * are proper. Only using outputPath inserts the physical path of the directory which we do not want
            */
            options: {
              useRelativePath: true,
              outputPath: path.resolve(__dirname, "dist", "assets")
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new ExtractTextPlugin("styles.[chunkhash].css")
  ]
};

module.exports = config;
