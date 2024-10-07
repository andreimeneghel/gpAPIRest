const express = require('express');
const usersRoutes = require('./routes/usersRoutes.js'); 
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
      description: 'API para gerenciar os usuários.',
    },
    tags: [
      {
        name: 'Users',
        description: 'Endpoints relacionados aos usuários.'
      }
    ],
  },
  apis: ['./routes/usersRoutes.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs-users', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/users', usersRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
