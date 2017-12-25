# webpackでtypescriptをコンパイル

## 参考サイト
[webpackチュートリアル](https://github.ips.fdinet.fujifilm.co.jp/takumitokisa/foaf/tree/master/src/03_javascript/webpack_tutorial)
[ts-loader公式](https://github.com/TypeStrong/ts-loader)

## 0. はじめに
typescriptのコンパイルを自動化したい。

typescriptでモジュール化。モジュール（ファイル）分割したい。

依存関係はwebpackに任せたい（import/export）

ということをしたいなら、webpackを使いましょう。

## 1. インストール
webpackがインストールされている前提。[webpackチュートリアル](https://github.ips.fdinet.fujifilm.co.jp/takumitokisa/foaf/tree/master/src/03_javascript/webpack_tutorial)参照

typescriptとts-loaderをインストールします
```sh
npm install --save-dev typescript
npm install --save-dev ts-loader
```

## 2. webpackの設定ファイルを更新

```javascript
// webpack.config.js
module.exports = {
  entry: './app.ts',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
  },
  module: {
    loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
```

## 3. typescriptの設定ファイルを追加

tsconfig.jsonを追加してください。
```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "noImplicitAny": true,
    "outDir": ".",
    "rootDir": ".",
    "sourceMap": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

## 4. Lintの導入

typescriptのLintは、"tsLint"です。

webpackのコンパイル前に実行するよう仕込みます。

インストール
```sh
npm install -save-dev tslint tslint-loader
```

設定ファイルはルートに"tslint.json"を置いてください。

とりあえず設定できる項目を全部入れたサンプルとして、tslint.jsonを作っているので参考にしてください。

webpack設定ファイルの編集

```javascript
// webpack.config.js
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
      }
    ]
  }
```

長いですね。

設定は[公式ドキュメント](https://github.com/wbuchwalter/tslint-loader)が一番参考になります。

コメントで補足している通り、lint警告がある場合、ビルド失敗扱いにすることも可能です。

### 所感
これを入れると、特に型チェックがとても厳しくなります。

コンパイルは通るレベルだけど、警告は出る…

これまでJSDOCで書いていた型定義がより厳密に、より強迫感を持って来る感じです。

小規模（ファイル数が少ない）だとタイプ量が増えるだけに感じます。

規模が大きくなるにつれ、コード補完、定義ジャンプがパワフルに効いてくるようです。

## Debug

ソースマップの表示はconfigに設定を追加します。

serverに配置した状態でないと機能しない様子。

```
// webpack.config.js
{
  devtool: "source-map"
}
```

## 4. おわり

以上。あとは、コンパイル（webpack）を叩けばOK。
