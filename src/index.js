const express = require('express');
const routes = require('./routes');
const appointmentRoutes = require('./routes/appointmentRoutes.js'); 
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
      description: 'API para gerenciar entidades de alunos, professores, etc.',
    },
    tags: [
      {
        name: 'Users',
        description: 'Endpoints relacionados aos usuários'
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/users', routes);
app.use('/appointment', appointmentRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});