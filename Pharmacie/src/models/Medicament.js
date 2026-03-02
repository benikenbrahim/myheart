const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicament = sequelize.define('Medicament', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  description: {
    type: DataTypes.TEXT
  },
  
  categorie: {
    type: DataTypes.STRING  // CARDIOLOGIE, ANTIBIOTIQUE, DOULEUR, etc.
  },
  
  quantiteStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  prixUnitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  
  seuilAlerte: {
    type: DataTypes.INTEGER,
    defaultValue: 10  // Alerte si stock < 10
  },
  
  dateExpiration: {
    type: DataTypes.DATE
  },
  
  fabricant: {
    type: DataTypes.STRING
  }

}, {
  tableName: 'medicaments',
  timestamps: true
});

module.exports = Medicament;