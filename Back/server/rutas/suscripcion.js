const express = require('express');
const router = express.Router();
const { sendPush,sends } = require('../SendPush.js');  // Usar require en lugar de import
const subs = require('../models/subsModel.js');
const users = require('../models/userModel.js');
const webpush = require('web-push');

// Ruta para obtener la lista de usuarios
router.get('/users', async (req, res) => {
  try {
    const userList = await users.find({}, 'id nombre email suscripcion'); // Obtener solo id, nombre y email
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
});


// Ruta para actualizar la suscripción del usuario
router.post('/suscripcion', async (req, res) => {
  const { userId, suscripcion } = req.body;
  //return res.json({ message: 'si llego' });

  //console.log('Datos recibidos:', req.body); // Log para depuración


  try {
    // Buscar y actualizar el usuario
    const user = await users.findByIdAndUpdate(
      userId, // Buscar por ID
      { suscripcion }, // Actualizar el campo suscripcion
      { new: true } // Devolver el documento actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    //console.log('Usuario actualizado:', user); // Log para depuración


    // Enviar notificación de prueba
    await sendPush(suscripcion, user.nombre);

    res.status(200).json({ message: 'Suscripción actualizada en el usuario', user });
  } catch (error) {
    //console.error('Error en la actualización de suscripción:', error); // Log para errores

    res.status(500).json({ message: error.message });
  }
});



// Ruta para actualizar la suscripción del usuario
router.post('/suscripcionMod', async (req, res) => {
  const { suscripcion, mensaje } = req.body;

  try {
    // Enviar notificación de prueba
    await sends(suscripcion, mensaje);

    res.status(200).json({ message: 'mensaje enviado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/*
router.post('/suscripcion', async (req, res) => {
  const { suscripcion} = req.body;

  try { 

    // Crear el nueva suscripcion
    const newSub = new subs({ suscripcion });
    const savedSub = await newSub.save();
    // Después de guardar la suscripción, enviar la notificación
    await sendPush(savedSub.suscripcion);  // Llamar a la función sendPush con la suscripción guardada

    res.status(201).json(savedSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/


// Crear un nuevo usuario 
router.post('/registro', async (req, res) => {
  const { email, nombre,telefono,password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Crear el nuevo usuario
    const newUser = new users({ email, nombre,telefono,password  });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta de Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Buscar usuario por email
      const user = await users.findOne({ email });
      
      if (!user || user.password !== password) {
        
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
      }
  
      // Crear y enviar token JWT
      //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        //expiresIn: '1h',
      //}
    //);
  
      res.json({  user});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    
  });

module.exports = router;

