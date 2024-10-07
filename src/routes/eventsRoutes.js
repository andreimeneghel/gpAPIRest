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
 *   name: Events
 *   description: Endpoints relacionados aos eventos.
 */

/**
 * @swagger
 * /events:
 *   get:
 *     tags: [Events]
 *     summary: Retorna todos os eventos
 *     responses:
 *       200:
 *         description: Uma lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   description:
 *                     type: string
 *                   comments:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get('/', (req, res) => {
    const sortedEvents = eventsDB.sort((a, b) => {
        if (a.description.toLowerCase() < b.description.toLowerCase()) return -1;
        if (a.description.toLowerCase() > b.description.toLowerCase()) return 1;
        return 0;
    }); 
    res.json(sortedEvents);
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags: [Events]
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
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 description:
 *                   type: string
 *                 comments:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const event = eventsDB.find(event => event.id === id);
    if (!event) return res.status(404).json({ "erro": "Evento não encontrado" });
    res.json(event);
});

/**
 * @swagger
 * /events:
 *   post:
 *     tags: [Events]
 *     summary: Insere um novo evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento inserido com sucesso
 *       400:
 *         description: Erro na validação do evento
 */
router.post('/', (req, res) => {
    const eventos = req.body;
    eventos.id = uuidv4();

    if (!eventos.date) {
        eventos.date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); // Formato local
    }
    if (!eventos.description) return res.status(400).json({ "erro": "Evento precisa ter uma 'description'" });
    if (!eventos.comments) return res.status(400).json({ "erro": "Evento precisa ter 'comments'" });

    const eventoFormatado = {
        id: eventos.id,
        description: eventos.description,
        comments: eventos.comments,
        date: eventos.date 
    };

    eventsDB.push(eventoFormatado);
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');  
    return res.json({ 
        "sucesso": "Evento cadastrado com sucesso", 
        "id": eventos.id,
        "date": eventos.date 
    });
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Atualiza um evento existente
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do evento a ser atualizado
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
 *               description:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       404:
 *         description: Evento não encontrado
 *       400:
 *         description: Erro na validação do evento
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoEvento = req.body;
    const eventoIndex = eventsDB.findIndex(event => event.id === id);

    if (eventoIndex === -1) return res.status(404).json({ "erro": "Evento não encontrado" });

    if (!novoEvento.date) {
        novoEvento.date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); 
    }

    if (!novoEvento.description) return res.status(400).json({ "erro": "Evento precisa ter uma 'description'" });
    if (!novoEvento.comments) return res.status(400).json({ "erro": "Evento precisa ter 'comments'" });

    eventsDB[eventoIndex] = { id, ...novoEvento};
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');  
    return res.json(novoEvento);
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     tags: [Events]
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
 *         description: Evento deletado com sucesso
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const eventIndex = eventsDB.findIndex(event => event.id === id);

    if (eventIndex === -1) return res.status(404).json({ "erro": "Evento não encontrado" });

    eventsDB.splice(eventIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');  
    res.json({ "mensagem": "Evento deletado com sucesso." });
});

module.exports = router;
