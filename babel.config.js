// babel.config.js

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        'modules': false, // 设置为 false，让 Babel 保留 ES modules，方便 Webpack 进行 tree-shaking
        'useBuiltIns': 'entry', // 策略：'entry' 会根据目标环境引入所有必需的 polyfill
        'corejs': 3, // 指定 core-js 的版本，必须与步骤一中安装的版本一致
        'targets': { // 指定需要兼容的目标环境，这是关键！
          // uni-app 官方建议的浏览器目标
          'browsers': ["> 1%", "last 2 versions", "not ie <= 8"],
          // 如果你特别关心安卓和iOS的WebView版本，也可以更具体地设置，例如：
          // 'android': '4.4',
          // 'ios': '9'
        }
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': false, // 对于 @babel/runtime，这里设为 false
        'helpers': true, // 减少 helpers 重复
        'regenerator': true, // 是否启用 generator 函数转换
      }
    ]
  ]
}