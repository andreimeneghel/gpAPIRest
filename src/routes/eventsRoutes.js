const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

const filePath = path.join(__dirname, '../data/events.json');
let eventsDB = []; 

try {
    const data = fs.readFileSync(filePath, 'utf8');
    eventsDB = JSON.parse(data);
    if (!Array.isArray(eventsDB)) {
        throw new Error("O conteúdo de events.json não é um array");
    }
} catch (error) {
    console.error("Erro ao ler ou parsear o arquivo events.json:", error);
    eventsDB = []; 
}

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
    res.json(eventsDB);
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
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Evento inserido com sucesso
 *       400:
 *         description: Erro na validação do evento
 */
router.post('/', (req, res) => {
    const event = req.body;
    event.id = uuidv4();

    if (!event.date) {
        event.date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); // Formato local
    }

    if (!event.description) return res.status(400).json({ "erro": "Evento precisa ter uma 'description'" });
    if (!event.comments) return res.status(400).json({ "erro": "Evento precisa ter 'comments'" });

    const eventFormatted = {
        id: event.id,
        description: event.description,
        comments: event.comments,
        date: event.date 
    };

    eventsDB.push(eventFormatted);
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');  
    return res.json({ 
        "sucesso": "Evento cadastrado com sucesso", 
        "id": event.id,
        "date": event.date 
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
 *               description:
 *                 type: string
 *               comments:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
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
    const updatedEvent = req.body;
    const eventIndex = eventsDB.findIndex(event => event.id === id);

    if (eventIndex === -1) return res.status(404).json({ "erro": "Evento não encontrado" });

    if (!updatedEvent.date) {
        updatedEvent.date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); // Gera a data atual em formato local
    }

    if (!updatedEvent.description) return res.status(400).json({ "erro": "Evento precisa ter uma 'description'" });
    if (!updatedEvent.comments) return res.status(400).json({ "erro": "Evento precisa ter 'comments'" });

    eventsDB[eventIndex] = { id, ...updatedEvent };
    fs.writeFileSync(filePath, JSON.stringify(eventsDB, null, 2), 'utf8');  
    return res.json(updatedEvent);
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
