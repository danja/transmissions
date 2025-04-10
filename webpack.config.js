// webpack.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/tools/nodeflow/editor.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
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
    })
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@nodeflow': path.resolve(__dirname, 'src/tools/nodeflow/')
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    hot: true,
    port: 9000,
    open: true
  }
};
