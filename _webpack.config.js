// webpack.config.js
import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
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
      '@src': path.resolve(__dirname, 'src/'),
      'rdf-utils-fs': path.resolve(__dirname, 'src/utils/browser-rdf-utils.js')
    },
    fallback: {
      fs: false,
      path: false,
      stream: false,
      buffer: false
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
    new CopyPlugin({
      patterns: [
        { from: 'src/applications/intro', to: 'samples' },
        { from: path.resolve(__dirname, 'src/tools/nodeflow/samples'), to: 'samples' },
        { from: 'src/applications/example-application', to: 'samples/example-application' }
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