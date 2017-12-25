module.exports = {
  entry: "./app.ts",
  output: {
    path: __dirname,
    filename: "./dist/bundle.js"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: /node_modules/,
        options: {
          // lintの警告があるとき、ビルド失敗扱いとしたいならtrueにしてください
          failOnHint: false,
          // lintの結果をcheckstyle形式で出力します
          fileOutput: {
            // The directory where each file's report is saved
            dir: './tslint/',

            // The extension to use for each report's filename. Defaults to 'txt'
            ext: 'xml',

            // If true, all files are removed from the report directory at the beginning of run
            clean: true,

            // A string to include at the top of every report file.
            // Useful for some report formats.
            header: '<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="5.7">',

            // A string to include at the bottom of every report file.
            // Useful for some report formats.
            footer: '</checkstyle>'
          }
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      { test: /\.css$/, enforce: 'pre', loader: 'style-loader!css-loader'}
    ]
  }
};
