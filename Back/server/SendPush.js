const webpush = require("web-push");
const { readFileSync } = require("fs");
const path = require("path");
const { error } = require("console");

// Carga el archivo keys.json
const keysPath = path.resolve("keys.json");
const keys = JSON.parse(readFileSync(keysPath, "utf-8"));

// Configurar claves VAPID
webpush.setVapidDetails(
  "mailto:pablo.carranza.22e@utzmg.edu.mx", 
  keys.publicKey,
  keys.privateKey
);

// Función para enviar la notificación push
function sendPush(subscription,userName) {
  return webpush.sendNotification(subscription, `¡Hola ${userName}, tienes una nueva notificación!`)
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

async function sends(sub, mensaje) {
  try {
    await webpush.sendNotification(sub, mensaje);
    return { mensaje: "ok" }; // Retorna un objeto, pero no usa `res.json()`
  } catch (error) {
    if (error.body.includes('expired') && error.statusCode == 410) {
      console.log('Sub expirada:');
    }
    return { mensaje: "error", error: error.message }; // Retorna error sin usar `res.json()`
  }
}

module.exports = { sendPush,sends };
