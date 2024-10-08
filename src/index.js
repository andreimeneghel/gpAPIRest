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
        description: 'Endpoints relacionados aos usuários'
      },
      {
        name: 'Appointments',
        description: 'Endpoints relacionados aos agendamentos'
      },
      {
        name: 'Students',
        description: 'Endpoints relacionados aos alunos'
      },
      {
        name: 'Events',
        description: 'Endpoints relacionados aos eventos'
      },
      {
        name: 'Teachers',
        description: 'Endpoints relacionados aos teachers'
      },
      {
        name: 'Professionals',
        description: 'Endpoints relacionados aos profissionais'
      }
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/users', usersRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/students', studentsRoutes);
app.use('/events', eventsRoutes); 
app.use('/teachers', teachersRoutes); 
app.use('/professionals', professionalsRoutes); 

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
