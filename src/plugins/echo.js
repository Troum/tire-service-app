import Echo from "laravel-echo";
import Pusher from "pusher-js";
export default {
  install: (app) => {
    window.Pusher = Pusher
    const options = import.meta.env.MODE === 'development' ? {
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_WS_URL,
      wsPort: import.meta.env.VITE_WS_PORT,
      wssPort: import.meta.env.VITE_WSS_PORT,
      enableTransports: ['ws', 'wss'],
      forceTLS: false,
      withCredentials: false
    } : {
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
      wsHost: import.meta.env.VITE_PUSHER_HOST,
      wsPort: import.meta.env.VITE_PUSHER_PORT,
      wssPort: import.meta.env.VITE_PUSHER_PORT,
      enabledTransports: ["ws", "wss"],
    }
    const echo = new Echo(options)

    app.provide("echo", echo);
  },
};
