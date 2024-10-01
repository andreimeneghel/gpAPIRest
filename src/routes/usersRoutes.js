const express = require('express');
const router = express.Router();
const usersDB = require('../data/users.json');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados aos usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 */
router.get('/', (req, res) => {
    const sortedUsers = usersDB.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    res.json(sortedUsers);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
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

    const usuario = usersDB.find(user => user.id === id);

    if (!usuario) return res.status(404).json({
        "erro": "Usuário não encontrado"
    });

    res.json(usuario);
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               user:
 *                 type: string
 *               pwd:
 *                 type: string
 *               level:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário inserido com sucesso
 *       400:
 *         description: Erro na validação do usuário
 */
router.post('/', (req, res) => {
    const usuario = req.body;
    console.log(usuario);
    const idExists = usersDB.some(user => user.id === usuario.id);
    console.log(idExists);
    if (idExists) {
        return res.status(400).json({ "erro": "O ID fornecido já está em uso. Escolha um ID diferente." });
    }

    // Validações
    if (!usuario.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!usuario.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!usuario.email) return res.status(400).json({ "erro": "Usuário precisa ter um 'email'" });
    if (!usuario.user) return res.status(400).json({ "erro": "Usuário precisa ter um 'user'" });
    if (!usuario.pwd) return res.status(400).json({ "erro": "Usuário precisa ter uma 'pwd'" });
    if (!usuario.level) return res.status(400).json({ "erro": "Usuário precisa ter um 'level'" });
    if (!usuario.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    usersDB.push(usuario);
    return res.json(usuario);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               user:
 *                 type: string
 *               pwd:
 *                 type: string
 *               level:
 *                 type: integer
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
    const novoUsuario = req.body;

    const usuarioIndex = usersDB.findIndex(user => user.id === id);

    if (usuarioIndex === -1) {
        return res.status(404).json({ "erro": "Usuário não encontrado" });
    }

    // Validações
    if (!novoUsuario.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!novoUsuario.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!novoUsuario.email) return res.status(400).json({ "erro": "Usuário precisa ter um 'email'" });
    if (!novoUsuario.user) return res.status(400).json({ "erro": "Usuário precisa ter um 'user'" });
    if (!novoUsuario.pwd) return res.status(400).json({ "erro": "Usuário precisa ter uma 'pwd'" });
    if (!novoUsuario.level) return res.status(400).json({ "erro": "Usuário precisa ter um 'level'" });
    if (!novoUsuario.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    usersDB[usuarioIndex] = novoUsuario;
    return res.json(novoUsuario);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
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

    const usuarioIndex = usersDB.findIndex(user => user.id === id);

    if (usuarioIndex === -1) return res.status(404).json({ "erro": "Usuário não encontrado" });

    usersDB.splice(usuarioIndex, 1);
    res.json({ "mensagem": "Usuário deletado com sucesso." });
});

module.exports = router;