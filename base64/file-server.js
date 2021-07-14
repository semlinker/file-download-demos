const fs = require("fs");
const path = require("path");
const mime = require("mime");
const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();
const PORT = 3000;
const STATIC_PATH = path.join(__dirname, "./static/");

router.get("/file", async (ctx, next) => {
  const { filename } = ctx.query;
  const filePath = STATIC_PATH + filename;
  const fileBuffer = fs.readFileSync(filePath);
  ctx.body = {
    code: 1,
    data: {
      name: filename,
      type: mime.getType(filename),
      content: fileBuffer.toString("base64"),
    },
  };
});

// 注册中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.body = {
      code: 0,
      msg: "服务器开小差",
    };
  }
});
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`应用已经启动：http://localhost:${PORT}/`);
});
