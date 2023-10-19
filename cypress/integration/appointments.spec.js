describe("Appointments", () => {
  
  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");
  });
  
  it("should book an interview", () => {
    // 2. Click on the add button in the second appointment
    cy.get("[alt=Add]")
      .first()
      .click();

    // 3. enter the name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    // 4. Choose an interviewer
    cy.get("[alt='Sylvia Palmer']").click();

    // 5. Click the save button
    cy.contains("Save").click();

    // 6. Verify the appointment is booked
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  }) 
  
  it("should edit an interview", () => {
    // 2. Click the edit button for the existing appointment
    cy.get("[alt=Edit]")
      .first()
      .click({ force: true });

    // 3. Change the name and interviewer
    cy.get("[data-testid=student-name-input]").clear().type("Lydia Miller-Jones");
    cy.get("[alt='Tori Malcolm']").click();

    // 4. Click the save button
    cy.contains("Save").click();

    // 5. Verify the edit to the appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");

  })
  
  it("should cancel an interview", () => {
    // 2. Click the delete button for the existing appointment
    cy.get("[alt=Delete]").click({ force: true });

    // 3. Click the confirm button
    cy.contains("Confirm").click();

    // 4. Verify that the appointment slot is empty
    cy.contains("Deleting");
    cy.contains("Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  })
})
