'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_shipping', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'items',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ordered_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      shipped_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      delivered_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      shipping_notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('item_shipping', ['item_id'], {
      name: 'item_shipping_item_id_idx',
      unique: true,
    });
    await queryInterface.addIndex('item_shipping', ['delivered_date'], {
      name: 'item_shipping_delivered_date_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first
    await queryInterface.removeIndex('item_shipping', 'item_shipping_delivered_date_idx');
    await queryInterface.removeIndex('item_shipping', 'item_shipping_item_id_idx');
    
    // Drop table
    await queryInterface.dropTable('item_shipping');
  },
};

