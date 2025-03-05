const webpush = require("web-push");
const { readFileSync } = require("fs");
const path = require("path");

// Carga el archivo keys.json
const keysPath = path.resolve("keys.json");
const keys = JSON.parse(readFileSync(keysPath, "utf-8"));

// Configurar claves VAPID
webpush.setVapidDetails(
  "mailto:pablo.carranza.22e@utzmg.edu.mx", // Cambia esto por tu correo real
  keys.publicKey,
  keys.privateKey
);

// Función para enviar la notificación push
function sendPush(subscription) {
  return webpush.sendNotification(subscription, "¡Tienes una nueva notificación!")
    .then(() => {
      console.log("Notificación enviada con éxito");
    })
    .catch(error => {
      if (error.body && error.body.includes('expired') && error.statusCode == 410) {
        console.log('Suscripción expiró');
      } else {
        console.error('Error al enviar la notificación:', error);
      }
    });
}

module.exports = { sendPush };
