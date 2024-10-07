const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const filePath = path.join(__dirname, '../data/students.json');
let studentsDB = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Endpoints relacionados aos estudantes.
 */

/**
 * @swagger
 * /students:
 *   get:
 *     tags: [Students]
 *     summary: Retorna todos os estudantes, ordenados por nome
 *     responses:
 *       200:
 *         description: Uma lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   parents:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   special:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', (req, res) => {
    const sortedStudents = studentsDB.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });
    res.json(sortedStudents);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Retorna um estudante específico
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do estudante a ser retornado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 parents:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 special:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Estudante não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const student = studentsDB.find(student => student.id === id);
    if (!student) return res.status(404).json({ "erro": "Estudante não encontrado" });
    res.json(student);
});

/**
 * @swagger
 * /students:
 *   post:
 *     tags: [Students]
 *     summary: Insere um novo estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               parents:
 *                 type: string
 *               phone:
 *                 type: string
 *               special:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estudante inserido com sucesso
 *       400:
 *         description: Erro na validação do estudante
 */
router.post('/', (req, res) => {
    const student = req.body;
    student.id = uuidv4();

    if (!student.name) return res.status(400).json({ "erro": "Estudante precisa ter um 'name'" });
    if (!student.age) return res.status(400).json({ "erro": "Estudante precisa ter um 'age'" });
    if (!student.parents) return res.status(400).json({ "erro": "Estudante precisa ter um 'parents'" });
    if (!student.phone) return res.status(400).json({ "erro": "Estudante precisa ter um 'phone'" });
    if (!student.special) return res.status(400).json({ "erro": "Estudante precisa ter um 'special'" });
    if (!student.status) return res.status(400).json({ "erro": "Estudante precisa ter um 'status'" });

    const studentFormatted = {
        id: student.id,
        name: student.name,
        age: student.age,
        parents: student.parents,
        phone: student.phone,
        special: student.special,
        status: student.status
    };

    studentsDB.push(studentFormatted);
    fs.writeFileSync(filePath, JSON.stringify(studentsDB, null, 2), 'utf8');  
    return res.json({ "sucesso": "Estudante cadastrado com sucesso", "id": student.id });
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     tags: [Students]
 *     summary: Substitui um estudante existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do estudante a ser substituído
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
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               parents:
 *                 type: string
 *               phone:
 *                 type: string
 *               special:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estudante substituído com sucesso
 *       404:
 *         description: Estudante não encontrado
 *       400:
 *         description: Erro na validação do estudante
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedStudent = req.body;
    const studentIndex = studentsDB.findIndex(student => student.id === id);

    if (studentIndex === -1) return res.status(404).json({ "erro": "Estudante não encontrado" });

    if (!updatedStudent.name) return res.status(400).json({ "erro": "Estudante precisa ter um 'name'" });
    if (!updatedStudent.age) return res.status(400).json({ "erro": "Estudante precisa ter um 'age'" });
    if (!updatedStudent.parents) return res.status(400).json({ "erro": "Estudante precisa ter um 'parents'" });
    if (!updatedStudent.phone) return res.status(400).json({ "erro": "Estudante precisa ter um 'phone'" });
    if (!updatedStudent.special) return res.status(400).json({ "erro": "Estudante precisa ter um 'special'" });
    if (!updatedStudent.status) return res.status(400).json({ "erro": "Estudante precisa ter um 'status'" });

    studentsDB[studentIndex] = { id, ...updatedStudent };
    fs.writeFileSync(filePath, JSON.stringify(studentsDB, null, 2), 'utf8');  
    return res.json(updatedStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Deleta um estudante existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do estudante a ser deletado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudante deletado com sucesso
 *       404:
 *         description: Estudante não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const studentIndex = studentsDB.findIndex(student => student.id === id);

    if (studentIndex === -1) return res.status(404).json({ "erro": "Estudante não encontrado" });

    studentsDB.splice(studentIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(studentsDB, null, 2), 'utf8');  
    res.json({ "mensagem": "Estudante deletado com sucesso." });
});

module.exports = router;
