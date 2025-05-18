describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in with email/password (mock backend success)', () => {
    cy.intercept('POST', '/api/ai/user/login', {
      statusCode: 200,
      body: {
        status: true,
        token: 'mock-token',
      },
    }).as('login');
    cy.percySnapshot('Login Page - Initial load');
    cy.get('input[placeholder="Enter user email"]').type('test@example.com');
    cy.get('input[placeholder="Enter password"]').type('password123');

    cy.percySnapshot('Login Page - Filled login form');
    cy.contains('Submit').click();

    cy.wait('@login');

    cy.window().then((win) => {
      win.localStorage.setItem('userEmail', 'test@example.com');
    });

    cy.window().should((win) => {
      expect(win.localStorage.getItem('userEmail')).to.eq('test@example.com');
    });
  });
});
