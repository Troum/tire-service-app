import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher
export default {
  install: (app) => {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true
    })

    app.provide("echo", echo);
  },
};
