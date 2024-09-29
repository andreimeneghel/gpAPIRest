const express = require('express')
const router = express.Router()
const countriesDB = require('../data/allCountries.json');

// Retornar todos os personagens
router.get('/', (req, res) =>{
  console.log("getroute");
  res.json(countriesDB)
})

// Retornar um personagem especifico
router.get('/:name', (req, res) => {
    const name = req.params.name
    //var countries= countries.name[name]
    if(!countries) return res.status(404).json({
        "erro": "Pais não encontrado"
    })
    res.json(countries)
})

module.exports = router