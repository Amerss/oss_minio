## 描述

- 将 OSS 桶中的文件迁移到 Minio 中
- 迁移前，请确保 Minio 已经启动
- 启动前，确保在 env 中配置环境变量
- 如有过滤需求，配置在 filter.config.json 中

## 启动

```
npm install
npm run start
```

## 测试

```
npm run test
```

## 构建

```
├── src                           源代码
│   ├── bll
│   │     ├──minio.ts             minio操作
│   │     ├──oss.ts               oss操作
│   ├── test                      测试
│   ├── index.ts                  主要逻辑函数
│   ├── types                     类型定义
│   ├── util                      工具函数
└── tsconfig.json
└── filter.config.json            过滤器配置
```
