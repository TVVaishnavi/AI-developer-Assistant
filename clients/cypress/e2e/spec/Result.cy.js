describe('Result Page', () => {
  beforeEach(() => {
    cy.visit('/result');
    cy.get('input[placeholder="What can i do for you?"]').type('Create a simple landing page');
    cy.get('button').contains(/send/i).click({ force: true });
    cy.contains('Create a simple landing page', { timeout: 80000 }).should('exist');
    cy.url().should('include', '/result');
  });

  const getIframeBody = () => {
    const timeout = 120000;
    const interval = 2000;
    const start = Date.now();

    return cy
      .get('iframe.w-full.h-full', { timeout })
      .should('exist')
      .then(($iframe) => {
        const iframe = $iframe[0];
        return new Cypress.Promise((resolve, reject) => {
          const check = () => {
            try {
              const doc = iframe.contentDocument || iframe.contentWindow.document;
              if (doc && doc.readyState === 'complete' && doc.body && doc.body.innerText.trim().length > 0) {
                resolve(Cypress.$(doc.body));
              } else if (Date.now() - start > timeout) {
                reject(new Error('Iframe content did not load within timeout'));
              } else {
                setTimeout(check, interval);
              }
            } catch (e) {
              reject(e);
            }
          };
          check();
        });
      });
  };

  it('loads initial iframe content correctly', () => {
    cy.visit('/result');
    cy.get('input[placeholder="What can i do for you?"]').type('Create a simple landing page');
    cy.get('button').contains(/send/i).scrollIntoView().click({ force: true });
    cy.contains('Create a simple landing page', { timeout: 100000 }).should('exist');
    cy.get('iframe.w-full.h-full', { timeout: 120000 }).should('exist');

    getIframeBody().should(($body) => {
      expect($body.text().trim()).to.not.equal('');
    });

    cy.percySnapshot('Result Page - Initial iframe content loaded');
  });

  it('renders initial prompt in main page', () => {
    cy.contains('Create a simple landing page', { timeout: 100000 }).should('exist');

    cy.percySnapshot('Result Page - Initial prompt rendered');
  });

  it('submits a new prompt and renders AI response in iframe', () => {
    const prompt = 'Create a dark mode navbar';

    cy.get('input[placeholder="What can i do for you?"]').clear().type(prompt);
    cy.get('button').contains(/send/i).scrollIntoView().click({ force: true });

    cy.contains(prompt, { timeout: 100000 }).should('exist');

    getIframeBody().should('contain.text', 'Hello from AI!');

    cy.percySnapshot('Result Page - New prompt submitted and AI response rendered');
  });

  it('allows editing the user prompt', () => {
    cy.contains('Create a simple landing page', { timeout: 100000 })
      .parents('div')
      .first()
      .within(() => {
        cy.get('button').contains('Edit').click({ force: true });
        cy.get('textarea').clear().type('Updated prompt');

        cy.percySnapshot('Result Page - Editing prompt');

        cy.get('button').contains('Save').click();
      });

    cy.contains('Updated prompt', { timeout: 50000 }).should('exist');
    cy.percySnapshot('Result Page - Edited prompt saved');
  });

  it('copies the prompt to clipboard', () => {
    const promptToCopy = 'Create a simple landing page';

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('copyStub');
    });

    cy.contains(promptToCopy, { timeout: 100000 })
      .parents('div')
      .first()
      .within(() => {
        cy.get('button').contains(/copy/i).click({ force: true });
      });

    cy.get('@copyStub').should('have.been.calledWith', promptToCopy);
    cy.percySnapshot('Result Page - Prompt copied to clipboard');
  });
});
