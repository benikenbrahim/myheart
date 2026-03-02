const { pool } = require('../config/db');

class RendezVous {
  static async create(data) {
    const { patientId, medecinId, dateHeure, motif, notes } = data;
    const result = await pool.query(
      `INSERT INTO rendez_vous (patient_id, medecin_id, date_heure, motif, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patientId, medecinId, dateHeure, motif, notes]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM rendez_vous ORDER BY date_heure DESC');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM rendez_vous WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByPatient(patientId) {
    const result = await pool.query(
      'SELECT * FROM rendez_vous WHERE patient_id = $1 ORDER BY date_heure DESC',
      [patientId]
    );
    return result.rows;
  }

  static async findByMedecin(medecinId) {
    const result = await pool.query(
      'SELECT * FROM rendez_vous WHERE medecin_id = $1 ORDER BY date_heure DESC',
      [medecinId]
    );
    return result.rows;
  }

  static async checkDisponibilite(medecinId, dateHeure) {
    const result = await pool.query(
      `SELECT * FROM rendez_vous 
       WHERE medecin_id = $1 AND date_heure = $2 AND statut IN ('EN_ATTENTE', 'CONFIRME')`,
      [medecinId, dateHeure]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { motif, notes, statut } = data;
    const result = await pool.query(
      `UPDATE rendez_vous SET motif = $1, notes = $2, statut = $3 WHERE id = $4 RETURNING *`,
      [motif, notes, statut, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM rendez_vous WHERE id = $1', [id]);
    return { message: 'Supprimé' };
  }
}

module.exports = RendezVous;