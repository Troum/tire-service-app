import Echo from "laravel-echo";
import Pusher from "pusher-js";
export default {
  install: (app) => {
    window.Pusher = Pusher
    const options = {
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_WS_URL,
      wsPort: import.meta.env.VITE_WS_PORT,
      wssPort: import.meta.env.VITE_WSS_PORT,
      enableTransports: ['ws', 'wss'],
      forceTLS: false,
      withCredentials: false
    };
    const echo = new Echo(options)

    app.provide("echo", echo);
  },
};
