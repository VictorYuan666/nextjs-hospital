describe('My First Test', () => {
  it('successfully visit', () => {
    cy.visit('http://localhost:3000')

  })
  it('successfully login', () => {
    cy.contains('login').click()
    cy.get('#input-username-for-credentials-provider').type('admin')
    cy.get('#input-password-for-credentials-provider').type('admin')
    cy.get('button').click()
    cy.get('.viewAction').click()
  })

})