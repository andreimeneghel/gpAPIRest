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
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         subject:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         status:
 *           type: string
 * 
 *     TeacherCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         subject:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         status:
 *           type: string
 * 
 *     TeacherUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         subject:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Retorna todos os professores
 *     responses:
 *       200:
 *         description: Uma lista de professores
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
 *     summary: Retorna um professor específico
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do professor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Professor encontrado
 *       404:
 *         description: Professor não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const teacher = teachersDB.find(teacher => teacher.id === id);

    if (!teacher) return res.status(404).json({
        "erro": "Professor não encontrado"
    });

    res.json(teacher);
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     tags: [Teachers]
 *     summary: Insere um novo professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *         description: Professor inserido com sucesso
 *       400:
 *         description: Erro na validação do professor
 */
router.post('/', (req, res) => {
    const novoProfessor = req.body;
    novoProfessor.id = uuidv4();

    if (!novoProfessor.name) return res.status(400).json({ "erro": "Professor precisa ter um 'name'" });
    if (!novoProfessor.school_disciplines) return res.status(400).json({ "erro": "Professor precisa ter um 'school_disciplines'" });
    if (!novoProfessor.contact) return res.status(400).json({ "erro": "Professor precisa ter um 'contact'" });
    if (!novoProfessor.phone_number) return res.status(400).json({ "erro": "Professor precisa ter um 'phone_number'" });
    if (!novoProfessor.status) return res.status(400).json({ "erro": "Professor precisa ter um 'status'" });

    const teacherFormatted = {
        id: novoProfessor.id,
        name: novoProfessor.name,
        school_disciplines: novoProfessor.school_disciplines,
        contact: novoProfessor.contact,
        phone_number: novoProfessor.phone_number,
        status: novoProfessor.status
    };

    teachersDB.push(teacherFormatted);
    fs.writeFileSync(filePath, JSON.stringify(teachersDB, null, 2), 'utf8');  
    return res.json({ "sucesso": "Professor cadastrado com sucesso", "id": novoProfessor.id });
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     tags: [Teachers]
 *     summary: Substitui um professor existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do professor
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
 *         description: Professor substituído com sucesso
 *       404:
 *         description: Professor não encontrado
 *       400:
 *         description: Erro na validação do professor
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoProfessor = req.body;

    const teachersIndex = teachersDB.findIndex(teacher => teacher.id === id);

    if (teachersIndex === -1) {
        return res.status(404).json({ "erro": "Professor não encontrado" });
    }

    if (!novoProfessor.id) return res.status(400).json({ "erro": "Professor precisa ter um 'id'" });
    if (!novoProfessor.name) return res.status(400).json({ "erro": "Professor precisa ter um 'name'" });
    if (!novoProfessor.school_disciplines) return res.status(400).json({ "erro": "Professor precisa ter um 'school_disciplines'" });
    if (!novoProfessor.contact) return res.status(400).json({ "erro": "Professor precisa ter um 'contact'" });
    if (!novoProfessor.phone_number) return res.status(400).json({ "erro": "Professor precisa ter um 'phone_number'" });
    if (!novoProfessor.status) return res.status(400).json({ "erro": "Professor precisa ter um 'status'" });

    teachersDB[teachersIndex] = novoProfessor;
    res.json(novoProfessor);
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     tags: [Teachers]
 *     summary: Deleta um professor existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do professor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Professor deletado com sucesso
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const teachersIndex = teachersDB.findIndex(teacher => teacher.id === id);

    if (teachersIndex === -1) return res.status(404).json({ "erro": "Professor não encontrado" });

    teachersDB.splice(teachersIndex, 1);
    res.json({ "mensagem": "Professor deletado com sucesso." });
});

module.exports = router;
