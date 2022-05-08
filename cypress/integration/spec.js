/// <reference types="cypress" />

// This goes against the best practices, but I don't get paid for this shit
describe('Interactive tests -- these take a hot minute', () => {
  it('Get the auth cookies from Spotify', () => {
    cy.visit('https://www.spotify.com/us/login', { log: false });

    cy.window({ log: false }).then(() => {
      const { USERNAME_OR_EMAIL, PASSWORD } = Cypress.env('SPOTIFY_CREDS');
      if (!USERNAME_OR_EMAIL || !PASSWORD) {
        const err = new Error('Please add your Spotify credentials to the env file!');
        process.stderr.write(err);
        cy.log(err);
        // cy.abort();
        return;
      }
      cy.get('[data-testid=login-username]', { log: false })
        .invoke({ log: false }, 'attr', 'type', 'password')
        .type(USERNAME_OR_EMAIL, {
          log: false,
        });
      cy.get('[data-testid=login-password]', { log: false }).type(PASSWORD, {
        log: false,
      });
      cy.wait(500, { log: false });
      cy.get('[data-testid=login-button]', { log: false }).click({ log: false });
      Cypress.log({
        name: 'Baking..',
        message: ' Getting cookies, hold tight!!!',
      });
      cy.wait(5000, { log: false }).then(() => {
        Cypress.log({ name: 'Got Gookies!', message: ' Done!\nNow running the real test!' });
      }); // wait just long enough to get the session cookies
      // cy.saveLocalStorage();
    });
    // TODO(?) make it to an actual test and check for cookies
  });

  it('Button exists and logs in as needed', () => {
    Cypress.Cookies.preserveOnce();
    Cypress.Cookies.defaults({
      preserve: ['csrftoken', 'XSRF-TOKEN', 'x-csrf-valid', 'x-csrf', 'x-csrf-token', 'session'],
    });
    cy.visit('http://localhost:19006', {
      onBeforeLoad(_) {
        cy.waitFor(500); // to allow elems to load
      },
    });
    cy.get('[data-testid=AuthButton]').then(($btn) => {
      if (!$btn || !$btn.length) {
        cy.contains('CONNECT WITH SPOTIFY').should('be.visible');
      }

      $btn.trigger('click');
    });
  });
  it('Scrolls and sees at least two songs', () => {
    // 2 to account for the current cache
    // scroll and make sure list is loaded
    cy.wait(1000);
    cy.scrollTo(0, 500);
    cy.wait(500);
    cy.scrollTo(0, 1500);
    cy.wait(500);
    cy.scrollTo(0, 2000);
    cy.get('[data-testid=SongList]').should('be.visible');
    cy.get('[data-testid=SongList]').children().children().its('length').should('be.gte', 2);
    cy.wait(500);
    cy.scrollTo(0, 0);
  });
});
