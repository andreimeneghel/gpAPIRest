const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

const filePath = path.join(__dirname, '../data/appointments.json');
let appointmentDB = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Endpoints relacionados aos agendamentos.
 */
/**
 * @swagger
 * /appointment:
 *   get:
 *     tags: [Appointment]
 *     summary: Retorna todos os agendamentos
 *     responses:
 *       200:
 *         description: Uma lista de agendamentos
 */
router.get('/', (req, res) => {
    const agendamentosOrdenados = appointmentDB.sort((a, b) => {
        if (a.professional.toLowerCase() < b.professional.toLowerCase()) return -1;
        if (a.professional.toLowerCase() > b.professional.toLowerCase()) return 1;
        return 0;
    });
    res.json(agendamentosOrdenados);

});


/**
 * @swagger
 * /appointment/{id}:
 *   get:
 *     tags: [Appointment]
 *     summary: Retorna um agendamento específico
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do agendamento a ser retornado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 specialty:
 *                   type: string
 *                 comments:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 student:
 *                   type: string
 *                 professional:
 *                   type: string
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const agendamento = appointmentDB.find(appt => appt.id === id);

    if (!agendamento) {
        return res.status(404).json({
            "erro": "Agendamento não encontrado"
        });
    }

    res.json(agendamento);
});


/**
 * @swagger
 * /appointment:
 *   post:
 *     tags: [Appointment]
 *     summary: Insere um novo agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *               comments:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               student:
 *                 type: string
 *               professional:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento inserido com sucesso
 *       400:
 *         description: Erro na validação do agendamento
 */
router.post('/', (req, res) => {
    const agendamento = req.body;

    agendamento.id = uuidv4();

    if (!agendamento.specialty) return res.status(400).json({ "erro": "Agendamento precisa ter uma 'specialty'." });
    if (!agendamento.comments) return res.status(400).json({ "erro": "Agendamento precisa ter 'comments'." });
    if (!agendamento.date) return res.status(400).json({ "erro": "Agendamento precisa ter uma 'date' no formato 'YYYY-MM-DD HH:mm:ss'." });
    if (!agendamento.student) return res.status(400).json({ "erro": "Agendamento precisa ter um 'student'." });
    if (!agendamento.professional) return res.status(400).json({ "erro": "Agendamento precisa ter um 'professional'." });

    appointmentDB.push(agendamento);

    fs.writeFileSync(filePath, JSON.stringify(appointmentDB, null, 2), 'utf8');

    return res.status(200).json({ "sucesso": "Agendamento cadastrado com sucesso", "id": agendamento.id });
});

/**
 * @swagger
 * /appointment/{id}:
 *   put:
 *     tags: [Appointment]
 *     summary: Substitui um agendamento existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do agendamento a ser substituído
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
 *               specialty:
 *                 type: string
 *               comments:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               student:
 *                 type: string
 *               professional:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento substituído com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *       400:
 *         description: Erro na validação do agendamento
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoAgendamento = req.body;

    const agendamentoIndex = appointmentDB.findIndex(appt => appt.id === id);

    if (agendamentoIndex === -1) {
        return res.status(404).json({ "erro": "Agendamento não encontrado" });
    }

    if (!novoAgendamento.specialty) return res.status(400).json({ "erro": "Agendamento precisa ter uma 'specialty'." });
    if (!novoAgendamento.comments) return res.status(400).json({ "erro": "Agendamento precisa ter 'comments'." });
    if (!novoAgendamento.date) return res.status(400).json({ "erro": "Agendamento precisa ter uma 'date' no formato 'YYYY-MM-DD HH:mm:ss'." });
    if (!novoAgendamento.student) return res.status(400).json({ "erro": "Agendamento precisa ter um 'student'." });
    if (!novoAgendamento.professional) return res.status(400).json({ "erro": "Agendamento precisa ter um 'professional'." });

    appointmentDB[agendamentoIndex] = { id, ...novoAgendamento };

    fs.writeFileSync(filePath, JSON.stringify(appointmentDB, null, 2), 'utf8');

    return res.json(appointmentDB[agendamentoIndex]);
});

/**
 * @swagger
 * /appointment/{id}:
 *   delete:
 *     tags: [Appointment]
 *     summary: Deleta um agendamento existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do agendamento a ser deletado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const appointmentIndex = appointmentDB.findIndex(appointment => appointment.id === id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ "erro": "Agendamento não encontrado" });
    }

    appointmentDB.splice(appointmentIndex, 1);
    res.json({ "mensagem": "Agendamento deletado com sucesso." });
});

module.exports = router;
