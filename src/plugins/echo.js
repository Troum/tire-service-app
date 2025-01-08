import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher
export default {
  install: (app) => {
    const echo = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_WS_URL,
      wsPort: import.meta.env.VITE_WS_PORT,
      enableTransports: ['ws'],
      forceTLS: false,
      withCredentials: false
    })

    app.provide("echo", echo);
  },
};
