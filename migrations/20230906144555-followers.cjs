"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("followers", {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      follower_id: { type: Sequelize.STRING, allowNull: false },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("followers")
  }
}
