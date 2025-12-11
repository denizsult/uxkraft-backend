'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      spec_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ship_from: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ship_to: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      phase: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Phase as numeric string: 1, 2, 3, 4',
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      ship_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create indexes
    await queryInterface.addIndex('items', ['ship_from'], {
      name: 'items_ship_from_idx',
    });
    await queryInterface.addIndex('items', ['phase'], {
      name: 'items_phase_idx',
    });
    await queryInterface.addIndex('items', ['location'], {
      name: 'items_location_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first
    await queryInterface.removeIndex('items', 'items_location_idx');
    await queryInterface.removeIndex('items', 'items_phase_idx');
    await queryInterface.removeIndex('items', 'items_ship_from_idx');
    
    // Drop table
    await queryInterface.dropTable('items');
  },
};

