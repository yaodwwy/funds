# 基金量化AI助手 (Fund AI Assistant)

AI诊断自选基金，实时查看您关注的基金，助您快速获取实时数据，提供量化决策建议。支持 Chrome、Edge 和 Firefox 浏览器。

## 项目概览

*   **项目名称**: 自选基金助手 (choose-funds)
*   **核心框架**: Vue.js 2.x
*   **构建工具**: Webpack 4
*   **UI 框架**: Element UI
*   **图表库**: ECharts
*   **数据源**: 主要依赖 `eastmoney.com` (天天基金/东方财富) 接口

## 目录结构

```text
C:\dev\funds\
├── src\
│   ├── background.js       # 扩展后台脚本 (Background Script)
│   ├── manifest.json       # 扩展配置文件
│   ├── common\             # 公共组件 (Vue组件) 和工具类
│   │   ├── js\             # 公共 JS 工具
│   │   └── ...             # 各类 Vue 组件 (图表、详情页等)
│   ├── options\            # 扩展选项/设置页面 (Options Page)
│   ├── popup\              # 扩展弹出页面 (Popup Page - 主要交互界面)
│   └── icons\              # 图标资源
├── scripts\                # 构建脚本
├── webpack.config.js       # Webpack 配置文件
├── package.json            # 项目依赖与脚本配置
└── README.md               # 项目说明文档
```

## 开发与构建

### 1. 安装依赖

需要 Node.js 环境 (建议 Node >= 10)。

```bash
npm install
```

### 2. 开发模式

启动监听模式，代码修改后自动重新编译。

```bash
npm run watch:dev
```

*   此命令会生成 `dist` 目录。
*   在 Chrome/Edge 浏览器中开启“开发者模式”，选择“加载已解压的扩展程序”，指向项目的 `dist` 目录即可预览。

### 3. 生产构建

构建用于发布的生产环境代码。

```bash
npm run build
```

### 4. 打包发布

生成用于上传商店的 `.zip` 压缩包。

```bash
npm run build-zip
```

该命令会读取 `manifest.json` 中的版本号，生成 `{name}-v{version}.zip` 文件。

## 代码规范与风格

*   **格式化**: 项目配置了 `prettier`，可通过 `npm run prettier:write` 自动格式化代码。
*   **CSS预处理**: 使用 SASS/SCSS (`sass-loader`, `node-sass`)。
*   **组件通信**: 使用 Vue 标准的 props/events 以及 Web Extension 的消息传递机制。

## 注意事项

*   **权限**: `manifest.json` 中声明了 `storage`, `contextMenus` 以及对 `https://*.eastmoney.com/*` 的跨域访问权限。
*   **调试**: 由于是浏览器扩展，调试主要依赖浏览器的开发者工具（针对 Popup 和 Background 页面的 Console）。
*   **兼容性**: 构建配置中通过 `cross-env` 适配了不同环境。

## 常用文件说明

*   `src/manifest.json`: 扩展的核心配置，定义了版本、图标、权限、入口文件等。
*   `src/background.js`: 处理后台任务，如定时抓取数据、角标更新等。
*   `src/popup/App.vue`: 点击浏览器工具栏图标弹出的主界面。
*   `src/common/js/`: 包含数据请求、格式化等核心逻辑。
