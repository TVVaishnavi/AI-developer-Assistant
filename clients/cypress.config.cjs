const { defineConfig } = require('cypress');
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    //defaultCommandTimeout: 120000, // 2 minutes
    //responseTimeout: 120000,
    setupNodeEvents(on, config) {
      
    },
  },
});
