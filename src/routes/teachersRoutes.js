const express = require('express');
const router = express.Router();
const teachersDB = require('../data/teachers.json');

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
    // Retorna todos os professores como um array
    const sortedTeachers = teachersDB.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    res.json(sortedTeachers); // Retorna um array de professores
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

    // Encontrar o professor pelo ID
    const teacher = teachersDB.find(teacher => teacher.id === id);

    if (!teacher) return res.status(404).json({
        "erro": "Usuário não encontrado"
    });

    res.json(teacher); // Retorna um único professor
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
    const usuario = req.body; // Supondo que req.body é um único objeto

    // Verifica se o ID já existe
    const idExists = teachersDB.some(teacher => teacher.id === usuario.id);
    if (idExists) {
        return res.status(400).json({ "erro": `O ID ${usuario.id} já está em uso. Escolha um ID diferente.` });
    }

    // Validações
    if (!usuario.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!usuario.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!usuario.school_disciplines) return res.status(400).json({ "erro": "Usuário precisa ter um 'school_disciplines'" });
    if (!usuario.contact) return res.status(400).json({ "erro": "Usuário precisa ter 'contact'" });
    if (!usuario.phone_number) return res.status(400).json({ "erro": "Usuário precisa ter um 'phone_number'" });
    if (!usuario.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    // Adiciona o usuário ao array de professores
    teachersDB.push(usuario);
    
    // Retorna o usuário adicionado
    return res.status(201).json(usuario);
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

    // Validações
    if (!novoteacher.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!novoteacher.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!novoteacher.school_disciplines) return res.status(400).json({ "erro": "Usuário precisa ter um 'school_disciplines'" });
    if (!novoteacher.contact) return res.status(400).json({ "erro": "Usuário precisa ter um 'contact'" });
    if (!novoteacher.phone_number) return res.status(400).json({ "erro": "Usuário precisa ter uma 'phone_number'" });
    if (!novoteacher.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    // Atualiza o estudante no array
    teachersDB[teachersIndex] = novoteacher;
    res.json(novoteacher); // Retorna o professor atualizado
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

    // Remove o estudante do array
    teachersDB.splice(teachersIndex, 1);
    res.json({ "mensagem": "Usuário deletado com sucesso." });
});

module.exports = router;
