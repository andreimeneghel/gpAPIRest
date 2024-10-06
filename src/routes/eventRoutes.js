const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

const filePath = path.join(__dirname, '../data/events.json');
let eventsDB = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: Endpoints relacionados aos eventos.
 */
/**
 * @swagger
 * /event:
 *   get:
 *     tags: [Event]
 *     summary: Retorna todos os eventos
 *     responses:
 *       200:
 *         description: Uma lista de eventos
 */
router.get('/', (req, res) => {
    res.json(eventsDB);
});

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     tags: [Event]
 *     summary: Retorna um evento específico
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do evento a ser retornado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: evento encontrado
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
 *         description: evento não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const evento = eventsDB.find(appt => appt.id === id);

    if (!evento) {
        return res.status(404).json({
            "erro": "evento não encontrado"
        });
    }

    res.json(evento);
});


/**
 * @swagger
 * /event:
 *   post:
 *     tags: [Event]
 *     summary: Insere um novo evento
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
 *         description: evento inserido com sucesso
 *       400:
 *         description: Erro na validação do evento
 */
router.post('/', (req, res) => {
    const evento = req.body;

    evento.id = uuidv4();

    if (!evento.specialty) return res.status(400).json({ "erro": "evento precisa ter uma 'specialty'." });
    if (!evento.comments) return res.status(400).json({ "erro": "evento precisa ter 'comments'." });
    if (!evento.date) return res.status(400).json({ "erro": "evento precisa ter uma 'date' no formato 'YYYY-MM-DD HH:mm:ss'." });
    if (!evento.student) return res.status(400).json({ "erro": "evento precisa ter um 'student'." });
    if (!evento.professional) return res.status(400).json({ "erro": "evento precisa ter um 'professional'." });

    eventsDB.push(evento);

    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');

    return res.status(200).json({ "sucesso": "evento cadastrado com sucesso", "id": evento.id });
});

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     tags: [Event]
 *     summary: Substitui um evento existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do evento a ser substituído
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
 *         description: evento substituído com sucesso
 *       404:
 *         description: evento não encontrado
 *       400:
 *         description: Erro na validação do evento
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoevento = req.body;

    const eventoIndex = eventsDB.findIndex(appt => appt.id === id);

    if (eventoIndex === -1) {
        return res.status(404).json({ "erro": "evento não encontrado" });
    }

    if (!novoevento.specialty) return res.status(400).json({ "erro": "evento precisa ter uma 'specialty'." });
    if (!novoevento.comments) return res.status(400).json({ "erro": "evento precisa ter 'comments'." });
    if (!novoevento.date) return res.status(400).json({ "erro": "evento precisa ter uma 'date' no formato 'YYYY-MM-DD HH:mm:ss'." });
    if (!novoevento.student) return res.status(400).json({ "erro": "evento precisa ter um 'student'." });
    if (!novoevento.professional) return res.status(400).json({ "erro": "evento precisa ter um 'professional'." });

    eventsDB[eventoIndex] = { id, ...novoevento };

    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');

    return res.json(eventsDB[eventoIndex]);
});

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     tags: [Event]
 *     summary: Deleta um evento existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do evento a ser deletado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: evento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *       404:
 *         description: evento não encontrado
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

    const eventIndex = eventsDB.findIndex(event => event.id === id);

    if (eventIndex === -1) {
        return res.status(404).json({ "erro": "evento não encontrado" });
    }

    eventsDB.splice(eventIndex, 1);
    res.json({ "mensagem": "evento deletado com sucesso." });
});

module.exports = router;
