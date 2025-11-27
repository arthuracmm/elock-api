'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('doorLockLogs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doorLockId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'doorLocks',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            action: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Adicionar índices para melhor performance
        await queryInterface.addIndex('doorLockLogs', ['doorLockId']);
        await queryInterface.addIndex('doorLockLogs', ['userId']);
        await queryInterface.addIndex('doorLockLogs', ['createdAt']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('doorLockLogs');
    }
};
