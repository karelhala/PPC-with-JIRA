import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: 8090
});

wss.on('connection', ws => {
  console.log('New client connected!')
  
  ws.send('connection established')
  
  ws.on('close', () => console.log('Client has disconnected!'))
  
  ws.on('message', data => {
    wss.clients.forEach(client => {
      console.log(`distributing message: ${data}`)
      client.send(`${data}`)
    })
  })
  
  ws.onerror = function () {
      console.log('websocket error')
  }
}
)
