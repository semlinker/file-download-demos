const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();
const PORT = 3000;

router.get("/file", async (ctx, next) => {
  const { filename } = ctx.query;
  const filePath = path.join(__dirname, filename);
  ctx.set({
    "Content-Type": "text/plain;charset=utf-8",
  });
  ctx.body = fs.createReadStream(filePath);
});

// 注册中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // ENOENT（无此文件或目录）：通常是由文件操作引起的，这表明在给定的路径上无法找到任何文件或目录
    ctx.status = error.code === "ENOENT" ? 404 : 500;
    ctx.body = error.code === "ENOENT" ? "文件不存在" : "服务器开小差";
  }
});
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`应用已经启动：http://localhost:${PORT}/`);
});
