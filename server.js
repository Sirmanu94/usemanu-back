const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // Utilizza la variabile d'ambiente per la porta
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Configurazione del trasportatore SMTP (esempio con Gmail)
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Usa la variabile d'ambiente per l'email
    pass: process.env.EMAIL_PASS  // Usa la variabile d'ambiente per la password
  }
});

// Rotta POST per gestire l'invio dei dati del form
app.post('/contattaci', (req, res) => {
  const { servizio, name, email, messaggio } = req.body;

  // Opzioni per l'email
  let mailOptions = {
    from: email, // Mittente
    to: process.env.EMAIL_USER, // Destinatario
    subject: 'Messaggio da useManu.com', // Oggetto dell'email
    text: `Nome: ${name}\nEmail: ${email}\nServizio: ${servizio}\nMessaggio: ${messaggio}` // Contenuto dell'email
  };

  // Invia l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Errore durante l\'invio dell\'email');
    } else {
      console.log('Email inviata: ' + info.response);
      res.status(200).send('Email inviata con successo');
    }
  });
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
