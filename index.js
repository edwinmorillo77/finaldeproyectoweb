const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
const nodemailer = require('nodemailer')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({
   extended: false
}));


app.get('/Inicio', function (req, res) {
   res.render('pages/Inicio');
});


app.get('/nosotros', function (req, res) {
   res.render('pages/nosotros');
});

app.get('/menu', function (req, res) {
   res.render('pages/menu');
});

app.get('/contacto', function (req, res) {
   res.render('pages/contacto');
});

app.get('/form', function (req, res) {
   res.render('pages/form');
});

app.get('/clientesagg', function (req, res) {
   res.render('pages/clientesagg');
});

//conexion
const connection = mysql.createConnection({

   host: 'freedb.tech',
   user: 'freedbtech_edwinmorillo',
   password: 'edwinmorillo2020',
   database: 'freedbtech_finalmanon'


});

//check connect
connection.connect(error => {
   if (error) throw error;
   console.log('Database running');
})


app.get('/clientes', (req, res) => {

   const sql = 'SELECT * FROM Clientes';

   connection.query(sql, (error, results) => {
       if (error) throw error;

       res.render('pages/clientesagg', {
           'results': results
       });

   });

});


app.get('/form', (req, res) => res.render('pages/form'))

app.post('/form', (req, res) => {
   const sql = `SELECT * FROM Clientes WHERE correo = '${req.body.correo}'`;
   const sql2 = 'INSERT INTO Clientes SET ?';

   const {
      nombre,
      apellido,
      correo,
      reservacion
   } = req.body;

   contentHTML = `
    <h1> Reservación de un nuevo cliente </h1>
    <ul>

    <li> Nombre: ${nombre} </li>
    <li> Apellido: ${apellido} </li>
    <li> Correo electrónico: ${correo} </li>
    <li> Fecha de reservación: ${reservacion} </li>
    
    </ul>

    <p> Tu reservación fue agregada correctamente </p>

`

   const transporter = nodemailer.createTransport({

      service: 'gmail',

      auth: {

         user: 'machadorgrill@gmail.com',
         pass: 'arrosalami'
      }
   });

   const info = {

      from: 'machadorgrill@gmail.com',
      to: 'edwinmorillo1720@gmail.com',
      subject: 'Formulario del contacto',
      html: contentHTML

   }

   connection.query(sql, (error, results) => {
      if (error) {
         throw error;
      }
      if (!results.length > 0) {
         const clientesObj = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            reservacion: req.body.reservacion
         }

         connection.query(sql2, clientesObj, error => {
            if (error) {
               throw error;
            }

         })
      }
      //enviar correo
      transporter.sendMail(info, error => {
         if (error) {
            throw error;
         } else {
            console.log('El email fue enviado correctamente')
         }
      })

   })
   res.render('pages/Inicio')

})


app.listen(port, () => {
   console.log(`Servidor corriendo en http://localhost:${port}`);

});