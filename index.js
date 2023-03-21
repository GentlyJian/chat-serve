import Koa from "koa"
import Router from "koa-router";
import {ChatGPTAPI} from 'chatgpt'



// https://platform.openai.com/docs/api-reference/images


const app = new Koa()
const router = new Router();
const chatApi = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-',
});

router.get("/chat", async (ctx, next) => {
    // 获取请求中的参数
    const { message } = ctx.request.query;
  try {
    const ret =await chatApi.sendMessage(message);
    const {id,parentMessageId, text} = ret
    // 将生成的内容返回给客户端
    ctx.success({id,parentMessageId, text})
  }catch(err) {
    ctx.success({message: 'error'})
  }
});

// 启用路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(process.env.PORT || '3000', () => {
    console.log("Server is listening on port " + (process.env.PORT || '3000'));
});
