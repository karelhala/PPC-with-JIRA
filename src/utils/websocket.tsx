export type WsMessage = {
  type: string;
  gameId: string;
  userMeta: {
    name: string;
    uuid: string;
  };
  data?: unknown;
};

const processData = (
  event: { data: string },
  callback: (event: WsMessage | string) => void,
  id?: string,
) => {
  try {
    const data = JSON.parse(event.data);
    if (data.gameId === id) {
      callback(data);
    }
  } catch (e) {
    callback(event.data);
  }
};

export function isWsMessage(event: WsMessage | string): event is WsMessage {
  return (event as WsMessage).type !== undefined;
}

export class WsClient {
  private static instance: WsClient;

  private client;
  private id;
  constructor(
    id?: string,
    onMessage?: (event: WsMessage | string) => void,
    onOpen?: (event: unknown) => void,
    onClose?: (event: unknown) => void,
    onError?: (event: unknown) => void,
  ) {
    this.id = id;
    this.client = new WebSocket(
      `${process.env.NODE_ENV === "development" ? process.env.REACT_APP_WS_URL : process.env.REACT_APP_WS_URL_PROD}?api_key=${process.env.REACT_APP_WS_API_KEY}`,
    );
    this.client.onmessage = (event) => {
      if (onMessage) {
        processData(event, onMessage, this.id);
      }
    };

    this.client.onclose = (event) => {
      onClose?.(event);
    };

    this.client.onerror = (event) => {
      onError?.(event);
    };
  }

  public static getInstance(
    id?: string,
    onMessage?: (event: WsMessage | string) => void,
    onOpen?: (event: unknown) => void,
    onClose?: (event: unknown) => void,
    onError?: (event: unknown) => void,
  ): WsClient {
    if (!WsClient.instance) {
      WsClient.instance = new WsClient(id, onMessage, onOpen, onClose, onError);
    }

    return WsClient.instance;
  }

  setId = (id: string) => {
    this.id = id;
  };

  sendData = (data: WsMessage) => {
    if (this.client.readyState) {
      this.client.send(JSON.stringify(data));
    }
  };

  receiveData = (callback: (event: WsMessage | string) => void, id: string) => {
    this.client.addEventListener("message", (event) => {
      processData(event, callback, id);
    });
  };

  close = () => {
    this.client.close();
  };
}
