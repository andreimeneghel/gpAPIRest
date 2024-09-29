const express = require('express');
const router = express.Router();
const studentsDB = require('../data/students.json');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 */
router.get('/', (req, res) => {
    // Retorna todos os estudantes como um array
    const sortedStudents = studentsDB.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    res.json(sortedStudents); // Retorna um array de estudantes
});

/**
 * @swagger
 * /students/{id}:
 *   get:
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

    // Encontrar o estudante pelo ID
    const student = studentsDB.find(student => student.id === id);

    if (!student) return res.status(404).json({
        "erro": "Usuário não encontrado"
    });

    res.json(student); // Retorna um único estudante
});

/**
 * @swagger
 * /students:
 *   post:
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
 *               students:
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
    const usuario = req.body; // Supondo que req.body é um único objeto

    // Verifica se o ID já existe
    const idExists = studentsDB.some(student => student.id === usuario.id);
    if (idExists) {
        return res.status(400).json({ "erro": `O ID ${usuario.id} já está em uso. Escolha um ID diferente.` });
    }

    // Validações
    if (!usuario.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!usuario.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!usuario.age) return res.status(400).json({ "erro": "Usuário precisa ter um 'age'" });
    if (!usuario.parents) return res.status(400).json({ "erro": "Usuário precisa ter 'parents'" });
    if (!usuario.phone) return res.status(400).json({ "erro": "Usuário precisa ter um 'phone'" });
    if (!usuario.special) return res.status(400).json({ "erro": "Usuário precisa ter um 'special'" });
    if (!usuario.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    // Adiciona o usuário ao array de estudantes
    studentsDB.push(usuario);
    
    // Retorna o usuário adicionado
    return res.status(201).json(usuario);
});



/**
 * @swagger
 * /students/{id}:
 *   put:
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
 *               students:
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
    const novostudent = req.body;

    const studentsIndex = studentsDB.findIndex(student => student.id === id);

    if (studentsIndex === -1) {
        return res.status(404).json({ "erro": "Usuário não encontrado" });
    }

    // Validações
    if (!novostudent.id) return res.status(400).json({ "erro": "Usuário precisa ter um 'id'" });
    if (!novostudent.name) return res.status(400).json({ "erro": "Usuário precisa ter um 'name'" });
    if (!novostudent.age) return res.status(400).json({ "erro": "Usuário precisa ter um 'age'" });
    if (!novostudent.parents) return res.status(400).json({ "erro": "Usuário precisa ter um 'parents'" });
    if (!novostudent.phone) return res.status(400).json({ "erro": "Usuário precisa ter uma 'phone_number'" });
    if (!novostudent.special) return res.status(400).json({ "erro": "Usuário precisa ter um 'special_needs'" });
    if (!novostudent.status) return res.status(400).json({ "erro": "Usuário precisa ter um 'status'" });

    // Atualiza o estudante no array
    studentsDB[studentsIndex] = novostudent;
    res.json(novostudent); // Retorna o estudante atualizado
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
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

    const studentsIndex = studentsDB.findIndex(student => student.id === id);

    if (studentsIndex === -1) return res.status(404).json({ "erro": "Usuário não encontrado" });

    // Remove o estudante do array
    studentsDB.splice(studentsIndex, 1);
    res.json({ "mensagem": "Usuário deletado com sucesso." });
});

module.exports = router;
