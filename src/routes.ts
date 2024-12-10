import Elysia from "elysia";

export default function addRoutes(app: Elysia) {
  app.get('/', () => `
    <!DOCTYPE html>
    <html lang='en' >
      <head>
        <title>Hello World </title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/themes/light.css" />
        <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/shoelace-autoloader.js"></script>
        <link rel="stylesheet" href="/public/css/style.css" />
        <script type="module" src="/public/js/htmx.min.js" ></script>
        <script type="text/javascript">
          (function() {
            const socket = new WebSocket("ws://localhost:3000/live-reload");
          socket.onmessage = function(msg) {
              if (msg.data === 'live-reload') {
            location.reload()
          }
            };
          })();
        </script>
      </head>
      <body>
        <h1 class="m-8">Hello World!</h1>
        <sl-button class="mt-6" variant="default">Button</sl-button>
      </body>
    </html>
  `
  );
}
