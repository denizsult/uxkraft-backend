'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_planning', {
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
      po_approval_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      hotel_need_by_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expected_delivery: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.addIndex('item_planning', ['item_id'], {
      name: 'item_planning_item_id_idx',
      unique: true,
    });
    await queryInterface.addIndex('item_planning', ['expected_delivery'], {
      name: 'item_planning_expected_delivery_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first
    await queryInterface.removeIndex('item_planning', 'item_planning_expected_delivery_idx');
    await queryInterface.removeIndex('item_planning', 'item_planning_item_id_idx');
    
    // Drop table
    await queryInterface.dropTable('item_planning');
  },
};

