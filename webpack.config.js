import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  mode: 'development',
  entry: './src/tools/nodeflow/editor.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@nodeflow': path.resolve(__dirname, 'src/tools/nodeflow/'),
      'rdf-utils-fs': path.resolve(__dirname, 'src/utils/browser-rdf-utils.js')
    },
    // Use a function that dynamically constructs the fallback object
    fallback: {
      "fs": false,
      "path": false,
      "url": false,
      "util": false,
      "stream": false,
      "buffer": false,
      "process": false,
      "events": false,
      "string_decoder": false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        // Handle node: protocol imports
        test: /\.js$/,
        include: /node_modules/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tools/nodeflow/editor.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/applications/intro', to: 'samples' }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    hot: true,
    port: 9000,
    open: true
  }
}