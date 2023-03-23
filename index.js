import Koa from "koa"
import Router from "koa-router";
import {ChatGPTAPI} from 'chatgpt'
import bodyParser from "koa-bodyparser";



// https://platform.openai.com/docs/api-reference/images


const app = new Koa()
app.use(bodyParser())
const router = new Router();
const chatApi = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-',
  completionParams: {
    model:'gpt-3.5-turbo',
    top_p: 0.8
  }
});

router.post("/chat", async (ctx, next) => {
    // 获取请求中的参数
    const { message,parentMessageId } = ctx.request.body;
    console.log(message) 
    const pamras = parentMessageId ? [message, { parentMessageId, timeoutMs: 60 * 1000}] : [message,{timeoutMs: 60 * 1000}]
  try {
    const ret =await chatApi.sendMessage(...pamras);
    const {id,parentMessageId, text} = ret
    // 将生成的内容返回给客户端
    ctx.body = {id, parentMessageId, text, code:0}
  }catch(err) {
    console.log(err)
    ctx.body = {message: 'error',code:-1} 
  }
});

// 启用路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(process.env.PORT || '3001', () => {
    console.log("Server is listening on port " + (process.env.PORT || '3001'));
});
