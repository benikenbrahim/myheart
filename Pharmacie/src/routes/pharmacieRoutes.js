const express = require('express');
const router = express.Router();
const Medicament = require('../models/Medicament');

// GET tous les médicaments
router.get('/medicaments', async (req, res) => {
  try {
    const medicaments = await Medicament.findAll();
    res.json({ success: true, data: medicaments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET un médicament par ID
router.get('/medicaments/:id', async (req, res) => {
  try {
    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ success: false, message: 'Médicament non trouvé' });
    }
    res.json({ success: true, data: medicament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST créer un médicament
router.post('/medicaments', async (req, res) => {
  try {
    const medicament = await Medicament.create(req.body);
    res.status(201).json({ success: true, message: 'Médicament créé', data: medicament });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT modifier un médicament
router.put('/medicaments/:id', async (req, res) => {
  try {
    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ success: false, message: 'Médicament non trouvé' });
    }
    await medicament.update(req.body);
    res.json({ success: true, message: 'Médicament mis à jour', data: medicament });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE supprimer un médicament
router.delete('/medicaments/:id', async (req, res) => {
  try {
    const medicament = await Medicament.findByPk(req.params.id);
    if (!medicament) {
      return res.status(404).json({ success: false, message: 'Médicament non trouvé' });
    }
    await medicament.destroy();
    res.json({ success: true, message: 'Médicament supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET stock faible (alertes)
router.get('/alertes-stock', async (req, res) => {
  try {
    const medicaments = await Medicament.findAll({
      where: sequelize.literal('"quantiteStock" < "seuilAlerte"')
    });
    res.json({ success: true, data: medicaments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST dispenser un médicament (diminuer stock)
router.post('/dispenser', async (req, res) => {
  try {
    const { medicamentId, quantite } = req.body;
    
    const medicament = await Medicament.findByPk(medicamentId);
    if (!medicament) {
      return res.status(404).json({ success: false, message: 'Médicament non trouvé' });
    }
    
    if (medicament.quantiteStock < quantite) {
      return res.status(400).json({ success: false, message: 'Stock insuffisant' });
    }
    
    medicament.quantiteStock -= quantite;
    await medicament.save();
    
    res.json({ 
      success: true, 
      message: `${quantite} unité(s) de ${medicament.nom} dispensée(s)`,
      data: medicament 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST réapprovisionner stock
router.post('/reapprovisionner', async (req, res) => {
  try {
    const { medicamentId, quantite } = req.body;
    
    const medicament = await Medicament.findByPk(medicamentId);
    if (!medicament) {
      return res.status(404).json({ success: false, message: 'Médicament non trouvé' });
    }
    
    medicament.quantiteStock += parseInt(quantite);
    await medicament.save();
    
    res.json({ 
      success: true, 
      message: `${quantite} unité(s) ajoutée(s) au stock de ${medicament.nom}`,
      data: medicament 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;