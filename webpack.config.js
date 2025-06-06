// webpack.config.js
import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(path.dirname(__filename), './')

const distPath = path.resolve(__dirname, 'dist')

console.log(distPath)

export default {
  mode: 'development',
  entry: './src/tools/nodeflow/editor.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@nodeflow': path.resolve(__dirname, 'src/tools/nodeflow/'),
      '@src': path.resolve(__dirname, 'src/')
    },
    fallback: {
      fs: false,
      path: false,
      util: false,
      stream: false,
      buffer: false,
      crypto: false,
      http: false,
      https: false,
      os: false,
      url: false,
      zlib: false,
      assert: false,
      querystring: false,
      'rdf-utils-fs': false
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!rdf-utils-fs)/, // Exclude node_modules except rdf-utils-fs
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.25%, not dead',
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.js$/,
        include: /node_modules\/(rdf-utils-fs)/, // Only apply to rdf-utils-fs
        resolve: {
          fullySpecified: false
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.25%, not dead',
                modules: 'commonjs', // Force CommonJS for this module
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ]
          }
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
        { from: 'src/apps/intro', to: 'samples' },
        { from: path.resolve(__dirname, 'src/tools/nodeflow/samples'), to: 'samples' },
        { from: 'src/apps/example-app', to: 'samples/example-app' }
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