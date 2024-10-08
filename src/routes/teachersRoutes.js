const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const filePath = path.join(__dirname, '../data/teachers.json');
let teachersDB = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Gerenciamento de professores
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 */
router.get('/', (req, res) => {
    const sortedTeachers = teachersDB.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    res.json(sortedTeachers);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Retorna um usuário específico
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const teacher = teachersDB.find(teacher => teacher.id === id);

    if (!teacher) return res.status(404).json({
        "erro": "Usuário não encontrado"
    });

    res.json(teacher);
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     tags: [Teachers]
 *     summary: Insere um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               school_disciplines:
 *                 type: string
 *               contact:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário inserido com sucesso
 *       400:
 *         description: Erro na validação do usuário
 */
router.post('/', (req, res) => {
    const novoteacher = req.body;
    novoteacher.id = uuidv4();

    if (!novoteacher.name) return res.status(400).json({ "erro": "Estudante precisa ter um 'name'" });
    if (!novoteacher.school_disciplines) return res.status(400).json({ "erro": "Estudante precisa ter um 'school_disciplines'" });
    if (!novoteacher.contact) return res.status(400).json({ "erro": "Estudante precisa ter um 'contact'" });
    if (!novoteacher.phone_number) return res.status(400).json({ "erro": "Estudante precisa ter um 'phone_number'" });
    if (!novoteacher.status) return res.status(400).json({ "erro": "Estudante precisa ter um 'status'" });

    const teacherFormatted = {
        id: novoteacher.id,
        name: novoteacher.name,
        school_disciplines: novoteacher.school_disciplines,
        contact: novoteacher.contact,
        phone_number: novoteacher.phone_number,
        status: novoteacher.status
    };

    teachersDB.push(teacherFormatted);
    fs.writeFileSync(filePath, JSON.stringify(teachersDB, null, 2), 'utf8');  
    return res.json({ "sucesso": "Estudante cadastrado com sucesso", "id": novoteacher.id });
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     tags: [Teachers]
 *     summary: Substitui um usuário existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
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
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               school_disciplines:
 *                 type: string
 *               contact:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário substituído com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       400:
 *         description: Erro na validação do usuário
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoteacher = req.body;

    const teachersIndex = teachersDB.findIndex(teacher => teacher.id === id);

    if (teachersIndex === -1) {
        return res.status(404).json({ "erro": "Usuário não encontrado" });
    }

    if (!novoteacher.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!novoteacher.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!novoteacher.school_disciplines) return res.status(400).json({ "erro": "Usuário precisa ter um 'school_disciplines'" });
    if (!novoteacher.contact) return res.status(400).json({ "erro": "Usuário precisa ter um 'contact'" });
    if (!novoteacher.phone_number) return res.status(400).json({ "erro": "Usuário precisa ter uma 'phone_number'" });
    if (!novoteacher.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    teachersDB[teachersIndex] = novoteacher;
    res.json(novoteacher);
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     tags: [Teachers]
 *     summary: Deleta um usuário existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const teachersIndex = teachersDB.findIndex(teacher => teacher.id === id);

    if (teachersIndex === -1) return res.status(404).json({ "erro": "Usuário não encontrado" });

    teachersDB.splice(teachersIndex, 1);
    res.json({ "mensagem": "Usuário deletado com sucesso." });
});

module.exports = router;
