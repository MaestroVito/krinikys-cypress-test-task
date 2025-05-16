import formPage from '../page-objects/formPage';
import { validUsers, genders, hobbies, times, resultUrl } from '../test-data/formData';

describe('Your Average Form - Cypress Test Suite', () => {
  beforeEach(() => {
    formPage.visit();
  });

  describe('TC-01: Test the form with gender selection', () => {
    Object.values(genders).forEach((gender) => {
      it(`Submits the form with gender set to "${gender}"`, () => {
        formPage.getUsernameField().type(validUsers.john.username);
        formPage.getPasswordField().type(validUsers.john.password);
        formPage.selectGender(gender);
        formPage.selectHobbies(hobbies.reading);
        formPage.selectTime(times.morning);
        formPage.clickSubmit();
        formPage.verifySummary({
          username: validUsers.john.username,
          gender: gender,
          hobbies: hobbies.reading,
          time: times.morning
        });
      });
    });
  });

  describe('TC-02: Test the form with hobbies selection', () => {
    Object.values(hobbies).forEach((hobby) => {
      it(`Submits the form with hobbie set to "${hobby}"`, () => {
        formPage.getUsernameField().type(validUsers.john.username);
        formPage.getPasswordField().type(validUsers.john.password);
        formPage.selectGender(genders.male);
        formPage.selectHobbies(hobby);
        formPage.selectTime(times.morning);
        formPage.clickSubmit();
        formPage.verifySummary({
          username: validUsers.john.username,
          gender: genders.male,
          hobbies: hobby,
          time: times.morning
        });
      });
    });
  });

  describe('TC-03: Test the form with time selection', () => {
    Object.values(times).forEach((time) => {
      it(`Submits the form with time set to "${time}"`, () => {
        formPage.getUsernameField().type(validUsers.john.username);
        formPage.getPasswordField().type(validUsers.john.password);
        formPage.selectGender(genders.male);
        formPage.selectHobbies(hobbies.reading);
        formPage.selectTime(time);
        formPage.clickSubmit();
        formPage.verifySummary({
          username: validUsers.john.username,
          gender: genders.male,
          hobbies: hobbies.reading,
          time: time
        });
      });
    });
  });

  describe('TC-04: Fails submission when fields are empty', () => {
    it('Should not allow submission and block with required field validation', () => {
      formPage.clickSubmit();
      cy.contains('Greetings').should('not.exist');
      cy.url().should('not.include', resultUrl);
      formPage.getUsernameField().type(validUsers.john.username);
      formPage.clickSubmit();
      cy.url().should('not.include', resultUrl);
      formPage.getPasswordField().type(validUsers.john.password);
      formPage.clickSubmit();
      cy.url().should('not.include', resultUrl);
      formPage.selectGender(genders.male);
      formPage.clickSubmit();
      cy.url().should('not.include', resultUrl);
      formPage.selectTime(times.morning);
      formPage.clickSubmit();
      cy.url().should('include', resultUrl);
      formPage.verifySummary({
        username: validUsers.john.username,
        gender: genders.male,
        time: times.morning
      });
    });
  });

  describe('TC-05: Verifies gender selection is exclusive', () => {
    it('Should allow selecting only one gender at a time', () => {
      formPage.selectGender(genders.male);
      formPage.verifyGenderExclusiveSelection(genders.male);
      formPage.selectGender(genders.female);
      formPage.verifyGenderExclusiveSelection(genders.female);
    });
  });

  describe('TC-06: Selects all hobbies', () => {
    it('Should allow selecting all hobbies at a time', () => {
      formPage.getUsernameField().type(validUsers.john.username);
      formPage.getPasswordField().type(validUsers.john.password);
      formPage.selectGender(genders.male);
      formPage.selectHobbies([hobbies.reading, hobbies.sports, hobbies.music]);
      formPage.selectTime(times.morning);
      formPage.clickSubmit();
      formPage.verifySummary({
        username: validUsers.john.username,
        gender: genders.male,
        hobbies: [hobbies.reading, hobbies.sports, hobbies.music],
        time: times.morning
      });
    });
  });

  describe('TC-07: Password input is type password', () => {
    it('Should ensure the password input masks entered characters', () => {
      formPage.getPasswordField().should('have.attr', 'type', 'password');
    });
  });

  describe('TC-08: Username input allows special characters', () => {
    it('Should reject submission when username contains special characters', () => {
      formPage.getUsernameField().type(validUsers.specialCharUser.username);
      formPage.getPasswordField().type(validUsers.specialCharUser.password);
      formPage.selectGender(genders.male);
      formPage.selectTime(times.morning);
      formPage.clickSubmit();

      cy.contains(`Greetings, ${validUsers.specialCharUser.username}`).then($el => {
        if ($el.length > 0) {
          throw new Error('Summary page was displayed — submission should have failed due to special characters!');
        }
      });

      cy.url().should('not.include', resultUrl);
      formPage.getUsernameField().should('exist');
    });
  });

  describe('TC-09: User can uncheck selected hobbies', () => {
    it('Should allow user to uncheck selected hobbies before submission', () => {
      formPage.getUsernameField().type(validUsers.john.username);
      formPage.getPasswordField().type(validUsers.john.password);
      formPage.selectGender(genders.male);
      formPage.selectHobbies([hobbies.reading, hobbies.music]);
      formPage.unselectHobbies([hobbies.reading, hobbies.music]);
      formPage.verifyHobbiesAreUnchecked([hobbies.reading, hobbies.music]);
      formPage.selectTime(times.morning);
      formPage.clickSubmit();
      formPage.verifySummary({
        username: validUsers.john.username,
        gender: genders.male,
        hobbies: [],
        time: times.morning
      });
    });
  });
});
