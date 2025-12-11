'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Sample items data
    const items = [
      {
        spec_number: 'SPEC-001',
        item_name: 'Widget A',
        ship_from: 'Vendor Inc.',
        ship_to: '123 Main St, City',
        qty: 100,
        phase: '1',
        price: 99.99,
        item_notes: 'Handle with care',
        location: 'Warehouse A',
        category: 'Electronics',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        spec_number: 'SPEC-002',
        item_name: 'Widget B',
        ship_from: 'Tech Solutions',
        ship_to: '456 Oak Ave, City',
        qty: 50,
        phase: '2',
        price: 149.50,
        location: 'Warehouse B',
        category: 'Electronics',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_name: 'Component X',
        spec_number: 'SPEC-003',
        ship_from: 'Parts Co.',
        ship_to: '789 Pine Rd, City',
        qty: 200,
        phase: '3',
        price: 29.99,
        location: 'Warehouse C',
        category: 'Components',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_name: 'Product Y',
        spec_number: 'SPEC-004',
        ship_from: 'Manufacturing Ltd.',
        ship_to: '321 Elm St, City',
        qty: 75,
        phase: '4',
        price: 199.99,
        item_notes: 'Delivered successfully',
        location: 'Warehouse A',
        category: 'Products',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert items and get their IDs
    await queryInterface.bulkInsert('items', items);

    // Get inserted item IDs (PostgreSQL returns the inserted rows)
    const itemIds = await queryInterface.sequelize.query(
      "SELECT id FROM items WHERE item_name IN ('Widget A', 'Widget B', 'Component X', 'Product Y') ORDER BY item_name",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create planning records
    const planningRecords = [
      {
        item_id: itemIds[0].id,
        po_approval_date: '2024-01-15',
        hotel_need_by_date: '2024-02-01',
        expected_delivery: '2024-03-01',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemIds[1].id,
        po_approval_date: '2024-01-20',
        expected_delivery: '2024-03-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('item_planning', planningRecords);

    // Create production records
    const productionRecords = [
      {
        item_id: itemIds[1].id,
        cfa_shops_send: '2024-02-01',
        cfa_shops_approved: '2024-02-05',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemIds[2].id,
        cfa_shops_send: '2024-02-10',
        cfa_shops_approved: '2024-02-12',
        cfa_shops_delivered: '2024-02-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('item_production', productionRecords);

    // Create shipping records
    const shippingRecords = [
      {
        item_id: itemIds[2].id,
        ordered_date: '2024-02-20',
        shipped_date: '2024-02-25',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        item_id: itemIds[3].id,
        ordered_date: '2024-01-10',
        shipped_date: '2024-01-15',
        delivered_date: '2024-01-20',
        shipping_notes: 'Delivered to front desk',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('item_shipping', shippingRecords);
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order (respecting foreign keys)
    await queryInterface.bulkDelete('item_shipping', null, {});
    await queryInterface.bulkDelete('item_production', null, {});
    await queryInterface.bulkDelete('item_planning', null, {});
    await queryInterface.bulkDelete('items', {
      item_name: {
        [Sequelize.Op.in]: ['Widget A', 'Widget B', 'Component X', 'Product Y'],
      },
    }, {});
  },
};
