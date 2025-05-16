class FormPage {
  visit() {
    cy.visit('http://localhost:3000');
  }

  getUsernameField() {
    return cy.get('input[type="text"]');
  }

  getPasswordField() {
    return cy.get('input[type="password"]');
  }

  selectGender(gender) {
    cy.get(`input[type="radio"][value="${gender}"]`).check();
  }

  selectHobbies(hobbyList) {
    const hobbies = Array.isArray(hobbyList) ? hobbyList : [hobbyList];

    hobbies.forEach(hobby => {
      cy.contains('td', hobby)
        .siblings('td')
        .find('input[type="checkbox"]')
        .check({ force: true });
    });
  }

  unselectHobbies(hobbies) {
    hobbies.forEach(hobby => {
      cy.contains('td', hobby)
        .siblings('td')
        .find('input[type="checkbox"]')
        .uncheck({ force: true });
    });
  }

  selectTime(value) {
    cy.get('select').select(value);
  }

  clickSubmit() {
    cy.contains('Submit').click();
  }

verifySummary({ username, gender, hobbies, time }) {
  cy.url().should('include', '/results');

  cy.contains(`Greetings, ${username}`).should('be.visible');
  cy.contains('Gender').siblings().contains(gender).should('exist');

  if (hobbies) {
    const hobbyList = Array.isArray(hobbies) ? hobbies : [hobbies];
    hobbyList.forEach(hobby => {
      cy.contains('Hobbies').siblings().contains(hobby).should('exist');
    });
  }

  if (time) {
    cy.contains('Time').siblings().contains(time).should('exist');
  }
}

  verifyGenderExclusiveSelection(selected) {
    const other = selected === 'Male' ? 'Female' : 'Male';
    cy.get(`input[type="radio"][value="${selected}"]`).should('be.checked');
    cy.get(`input[type="radio"][value="${other}"]`).should('not.be.checked');
  }

  verifyHobbiesAreUnchecked(hobbyList) {
  const hobbies = Array.isArray(hobbyList) ? hobbyList : [hobbyList];

  hobbies.forEach(hobby => {
    cy.contains('td', hobby)
      .siblings('td')
      .find('input[type="checkbox"]')
      .should('not.be.checked');
    });
  }
}

export default new FormPage();