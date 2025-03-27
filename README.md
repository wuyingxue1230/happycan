# 重要事项倒计时小程序

一个帮助你管理和追踪重要事项的微信小程序。你可以添加重要事项，设置截止时间，实时查看倒计时，并随时更新完成进度。

## 功能特点

- 添加重要事项和截止时间
- 实时倒计时显示
- 进度管理和更新
- 圆形进度条可视化
- 任务完成自动归档

## 开始使用

### 环境要求

- 微信开发者工具
- Node.js (建议 v14.0.0 或以上)
- npm 或 yarn
- TypeScript v4.9.5 或以上

### 安装步骤

1. 克隆项目到本地：
```bash
git clone [项目地址]
cd happycan
```

2. 安装依赖：
```bash
# 进入项目目录后执行
npm install
# 或使用 yarn
yarn
```

3. 在微信开发者工具中：
   - 导入项目
   - 选择项目目录
   - 填入自己的小程序 AppID（在微信公众平台申请）
   - 将 `src` 设置为小程序目录

### 项目配置

1. 修改 `project.config.json` 中的 `appid` 为你自己的小程序 AppID
2. 确保微信开发者工具中已启用 npm 模块功能
3. 在微信开发者工具中点击"工具" -> "构建 npm"

## 项目结构

```
happycan/
├── src/                # 小程序源代码
│   ├── components/     # 自定义组件
│   ├── pages/         # 页面文件
│   ├── utils/         # 工具函数
│   └── app.js         # 小程序入口文件
├── package.json       # 项目依赖配置
└── project.config.json # 项目配置文件
```

## 使用的第三方组件

- Vant Weapp UI 组件库 (v1.10.19)
- miniprogram-api-typings (v3.9.1)

## 开发说明

1. 页面开发：
   - 页面文件位于 `src/pages` 目录
   - 每个页面包含 `.ts`、`.wxml`、`.wxss`、`.json` 四个文件

2. 组件开发：
   - 自定义组件位于 `src/components` 目录
   - 组件结构与页面类似

3. 工具函数：
   - 通用函数位于 `src/utils` 目录

## 常见问题

1. 如果遇到 npm 包构建失败：
   - 删除 `src/miniprogram_npm` 目录
   - 重新执行 npm 构建

2. 如果遇到 TypeScript 编译错误：
   - 确保已在开发者工具中开启 TypeScript 支持
   - 检查 `tsconfig.json` 配置是否正确

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT License](LICENSE) 
