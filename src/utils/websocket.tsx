export class WsClient {
  private client;
  constructor(onMessage?: (event: unknown) => unknown, onClose?: (event: unknown) => void, onError?: (event: unknown) => void) {
    this.client = new WebSocket(`${process.env.NODE_ENV === 'development' ? process.env.REACT_APP_WS_URL : process.env.REACT_APP_WS_URL_PROD}?api_key=${process.env.REACT_APP_WS_API_KEY}`);
    this.client.onmessage = (event) => {
      onMessage?.(event?.data);
    }

    this.client.onclose = (event) => {
      onClose?.(event);
    }

    this.client.onerror = (event) => {
      onError?.(event);
    }
  }

  sendData = (data: string) => {
    this.client.send(data);
  }

  receiveData = (callback: (event: unknown) => void, id: string) => {
    this.client.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          callback(data);
        }
      } catch (e) {
        callback(event.data)
      }
    });
  }

  close = () => {
    this.client.close();
  }
}
