const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

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
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      /**
       * This minimizes the css
       */
      new OptimizeCSSAssetsPlugin({})
    ],
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
        },
        /**
         * Extract css in separate file
         */
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/"
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
    new MiniCssExtractPlugin({
      filename: "[name].css"/* ,
      chunkFilename: "[id].css" */
    })
  ]
};

module.exports = config;
