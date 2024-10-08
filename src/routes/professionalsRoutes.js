const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const filePath = path.join(__dirname, '../data/professionals.json');
let professionalDB = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: Endpoints relacionados aos profissionais.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         especialidade:
 *           type: string
 *         contact:
 *           type: string
 *         status:
 *           type: string
 * 
 *     ProfessionalCreate:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         especialidade:
 *           type: string
 *         contact:
 *           type: string
 *         status:
 *           type: string
 * 
 *     ProfessionalUpdate:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         especialidade:
 *           type: string
 *         contact:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     tags: [Professionals]
 *     summary: Retorna todos os profissionais, ordenados por nome
 *     responses:
 *       200:
 *         description: Uma lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   especialidade:
 *                     type: string
 *                   contact:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', (req, res) => {
    const profissionaisOrdenados = professionalDB
        .filter(profissional => profissional.nome) // Filtra profissionais sem nome
        .sort((a, b) => {
            if (a.nome && b.nome) {
                return a.nome.toLowerCase().localeCompare(b.nome.toLowerCase());
            }
            return 0;
        });
    res.json(profissionaisOrdenados);
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     tags: [Professionals]
 *     summary: Retorna um profissional específico
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do profissional a ser retornado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profissional encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 especialidade:
 *                   type: string
 *                 contact:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const profissional = professionalDB.find(profissional => profissional.id === id);
    if (!profissional) return res.status(404).json({ "erro": "Profissional não encontrado" });
    res.json(profissional);
});

/**
 * @swagger
 * /professionals:
 *   post:
 *     tags: [Professionals]
 *     summary: Insere um novo profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               contact:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profissional inserido com sucesso
 *       400:
 *         description: Erro na validação do profissional
 */
router.post('/', (req, res) => {
    const profissional = req.body;
    profissional.id = uuidv4();

    if (!profissional.nome || !profissional.especialidade || !profissional.contact || !profissional.status) {
        return res.status(400).json({ "erro": "Profissional precisa ter os seguintes campos: nome, especialidade, contact e status" });
    }

    professionalDB.push(profissional);
    fs.writeFileSync(filePath, JSON.stringify(professionalDB, null, 2), 'utf8');
    return res.json({ "sucesso": "Profissional cadastrado com sucesso", "id": profissional.id });
});

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     tags: [Professionals]
 *     summary: Atualiza um profissional existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do profissional a ser atualizado
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               contact:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso
 *       404:
 *         description: Profissional não encontrado
 *       400:
 *         description: Erro na validação do profissional
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const profissionalAtualizado = req.body;
    const indiceProfissional = professionalDB.findIndex(profissional => profissional.id === id);

    if (indiceProfissional === -1) return res.status(404).json({ "erro": "Profissional não encontrado" });

    if (!profissionalAtualizado.nome || !profissionalAtualizado.especialidade || !profissionalAtualizado.contact || !profissionalAtualizado.status) {
        return res.status(400).json({ "erro": "Profissional precisa ter os seguintes campos: nome, especialidade, contact e status" });
    }

    professionalDB[indiceProfissional] = { id, ...profissionalAtualizado };
    fs.writeFileSync(filePath, JSON.stringify(professionalDB, null, 2), 'utf8');
    res.json(profissionalAtualizado);
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     tags: [Professionals]
 *     summary: Deleta um profissional existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do profissional a ser deletado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profissional deletado com sucesso
 *       404:
 *         description: Profissional não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const indiceProfissional = professionalDB.findIndex(profissional => profissional.id === id);

    if (indiceProfissional === -1) return res.status(404).json({ "erro": "Profissional não encontrado" });

    professionalDB.splice(indiceProfissional, 1);
    fs.writeFileSync(filePath, JSON.stringify(professionalDB, null, 2), 'utf8');
    res.json({ "mensagem": "Profissional deletado com sucesso." });
});

module.exports = router;
