const express = require('express');
const router = express.Router();
const { sendPush } = require('../SendPush.js');  // Usar require en lugar de import
const subs = require('../models/subsModel.js');
const users = require('../models/userModel.js');
const webpush = require('web-push');


// Ruta para actualizar la suscripción del usuario
router.post('/suscripcion', async (req, res) => {
  const { userId, suscripcion } = req.body;
  //return res.json({ message: 'si llego' });


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

    // Enviar notificación de prueba
    //await sendPush(suscripcion);

    res.status(200).json({ message: 'Suscripción actualizada en el usuario', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


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

