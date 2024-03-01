import ollama from 'ollama'
import express from 'express'
import http from 'http'
import cors from 'cors'

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
app.use('/api/askme', cors());

app.get('/api/askme/:question', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let question = req.params.question;

  const response = await ollama.chat({ model: 'llama2', messages: [{ role: 'assistant', content: question }], stream: true })
  
  for await (const part of response) {
    if(part.message.content === '?') continue;
    res.write(`data: ${part.message.content}\n\n`);
  }

  res.end()
})


const port = 6000;
server.listen(port, () => {
    console.log(`SSE server is running on port ${port}`);
});