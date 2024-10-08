const express = require('express');
const usersRoutes = require('./routes/usersRoutes.js'); 
const appointmentRoutes = require('./routes/appointmentRoutes.js'); 
const studentsRoutes = require('./routes/studentsRoutes.js'); 
const eventsRoutes = require('./routes/eventsRoutes.js'); 
const teachersRoutes = require('./routes/teachersRoutes.js'); 
const professionalsRoutes = require('./routes/professionalsRoutes.js'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestão de Ensino Especial',
      version: '1.0.0',
      description: 'API para gerenciar entidades de alunos, professores, usuários, profissionais, eventos e compromissos',
    },
    tags: [
      {
        name: 'Users',
        description: 'Endpoints relacionados aos usuários, Andrei Meneghel'
      },
      {
        name: 'Appointment',
        description: 'Endpoints relacionados aos agendamentos, Gustavo Bratti'
      },
      {
        name: 'Students',
        description: 'Endpoints relacionados aos alunos, Luiz Fellipe Rocha'
      },
      {
        name: 'Events',
        description: 'Endpoints relacionados aos eventos, Luiz Fellipe Rocha'
      },
      {
        name: 'Teachers',
        description: 'Endpoints relacionados aos teachers, Gabriel Rocha'
      },
      {
        name: 'Professionals',
        description: 'Endpoints relacionados aos profissionais, Lucas Simão'
      }
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/users', usersRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/students', studentsRoutes);
app.use('/events', eventsRoutes); 
app.use('/teachers', teachersRoutes); 
app.use('/professionals', professionalsRoutes); 

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
