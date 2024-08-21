export class WsClient {
  private client;
  constructor(onMessage: (event: unknown) => unknown, onClose?: (event: unknown) => void, onError?: (event: unknown) => void) {
    this.client = new WebSocket(`${process.env.REACT_APP_WS_URL}?api_key=${process.env.REACT_APP_WS_API_KEY}`);
    this.client.onmessage = (event) => {
      onMessage(event?.data);
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
}
