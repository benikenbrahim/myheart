const express = require('express');
const router = express.Router();
const RendezVous = require('../models/RendezVous');
const axios = require('axios');

// GET tous
router.get('/', async (req, res) => {
  try {
    const rdvs = await RendezVous.findAll();
    res.json({ success: true, data: rdvs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET par ID
router.get('/:id', async (req, res) => {
  try {
    const rdv = await RendezVous.findById(req.params.id);
    if (!rdv) return res.status(404).json({ success: false, message: 'Non trouvé' });
    res.json({ success: true, data: rdv });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET par patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const rdvs = await RendezVous.findByPatient(req.params.patientId);
    res.json({ success: true, data: rdvs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET par médecin
router.get('/medecin/:medecinId', async (req, res) => {
  try {
    const rdvs = await RendezVous.findByMedecin(req.params.medecinId);
    res.json({ success: true, data: rdvs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST créer
router.post('/', async (req, res) => {
  try {
    const { patientId, medecinId, dateHeure, motif, notes } = req.body;

    // Vérifier patient
    try {
      await axios.get(`${process.env.PATIENT_SERVICE_URL}/${patientId}`);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Patient non trouvé' });
    }

    // Vérifier disponibilité
    const existing = await RendezVous.checkDisponibilite(medecinId, dateHeure);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Médecin non disponible' });
    }

    const rdv = await RendezVous.create({ patientId, medecinId, dateHeure, motif, notes });
    res.status(201).json({ success: true, data: rdv });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT modifier
router.put('/:id', async (req, res) => {
  try {
    const rdv = await RendezVous.update(req.params.id, req.body);
    res.json({ success: true, data: rdv });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH confirmer
router.patch('/:id/confirmer', async (req, res) => {
  try {
    const rdv = await RendezVous.update(req.params.id, { statut: 'CONFIRME' });
    res.json({ success: true, data: rdv });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH annuler
router.patch('/:id/annuler', async (req, res) => {
  try {
    const rdv = await RendezVous.update(req.params.id, { statut: 'ANNULE' });
    res.json({ success: true, data: rdv });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await RendezVous.delete(req.params.id);
    res.json({ success: true, message: 'Supprimé' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

module.exports = router;