const express = require('express');
const eventsRoutes = require('./routes/eventsRoutes.js'); 
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
        name: 'Events',
        description: 'Endpoints relacionados aos eventos'
      }
    ],
  },
  apis: ['./routes/eventsRoutes.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs-events', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/events', eventsRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
