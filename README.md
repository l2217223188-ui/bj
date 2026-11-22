# 定制衣柜报价系统

零前端框架的衣柜报价系统（Netlify Functions + Blobs 版）。

## 部署

1. 把这个仓库导入 Netlify：Add new site → Import an existing project
2. 构建设置**全部留空**（`netlify.toml` 已配好）
3. 等部署完成，打开 Netlify 给的网址
4. 登录 `admin` / `admin888` → 立刻到「商品库设置 → 账号安全」改密码

## 文件

```
public/index.html      前端（单文件：界面 + 样式 + 脚本 + 登录层）
functions/api.mjs      后端接口（登录、账号、报价、日志）
netlify.toml           部署配置（Node 22 / 函数目录 / 发布目录）
package.json           依赖：@netlify/blobs
```

## 说明

- 数据存在 Netlify Blobs，不在仓库里
- 备份：登录后「商品库设置 → 数据备份 → 导出备份文件」
- 没有「一键下载 PDF」，用浏览器「打印 → 另存为 PDF」
