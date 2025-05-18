describe('Signup Page', () => {
  beforeEach(() => {
    cy.intercept('POST', 'api/ai/google/login', {
      statusCode: 200,
      body: { token: 'fake-token', status: true },
    }).as('googleLogin');

    cy.on('window:alert', cy.stub().as('alert'));

    cy.visit('/signup');
  });

  it('renders inputs and buttons', () => {
    cy.get('input[placeholder="Enter user name"]').should('be.visible');
    cy.get('input[placeholder="Enter Email id"]').should('be.visible');
    cy.get('input[placeholder="Enter new password"]').should('be.visible');
    cy.get('input[placeholder="Confirm password"]').should('be.visible');
    cy.contains('Submit').should('be.visible');
    cy.contains('Continue with Google').should('be.visible');
    cy.contains('Already have an account?').should('be.visible');

    cy.percySnapshot('Signup Page - Initial load with all inputs and buttons');
  });

  it('shows email error message for invalid email', () => {
    cy.get('input[placeholder="Enter Email id"]').type('invalid-email');
    cy.contains('Email is incorrect').should('be.visible');

    cy.percySnapshot('Signup Page - Email validation error shown');

    cy.get('input[placeholder="Enter Email id"]').clear().type('test@gmail.com');
    cy.contains('Email is incorrect').should('not.exist');
  });

  it('shows password mismatch error', () => {
    cy.get('input[placeholder="Enter new password"]').type('password1');
    cy.get('input[placeholder="Confirm password"]').type('password2');
    cy.contains('Submit').click();
    cy.contains('Passwords do not match').should('be.visible');

    cy.percySnapshot('Signup Page - Password mismatch error shown');
  });

  it('navigates to login page on "Already have an account?" click', () => {
    cy.contains('Already have an account?').click();
    cy.url().should('include', '/login');
    cy.percySnapshot('Login Page - After navigating from Signup');
  });

  it('closes signup modal on × click', () => {
    cy.get('button[aria-label="Close"]').click();
    cy.url().should('eq', 'http://localhost:5173/');

    cy.percySnapshot('Home Page - After closing signup modal');
  });
});
