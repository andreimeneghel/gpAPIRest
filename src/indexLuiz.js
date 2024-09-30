const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const studentsRoutes = require('./routes/studentsRoutes');
const app = express();

app.use(express.json());

app.use('/students', studentsRoutes);   

// Configurações do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestão de Ensino Especial',
      version: '1.0.0',
      description: 'API para gerenciar entidades de alunos, professores, etc.',
    },
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos que contém as rotas da API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da sua API
app.get('/', (req, res) => {
  res.send('API Gestão de Ensino Especial');
});

// Inicie o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
