const formWidgetsPage = require("../../../../locators/FormWidgets.json");
const widgetLocators = require("../../../../locators/Widgets.json");
const dsl = require("../../../../fixtures/widgetPopupDsl.json");

describe("Dropdown Widget Functionality", function() {
  before(() => {
    cy.addDsl(dsl);
  });

  it("Verify dropdown width of Select widgets and menu button", function() {
    cy.wait(7000);
    // Select
    cy.get(formWidgetsPage.dropdownWidget)
      .find(widgetLocators.dropdownSingleSelect)
      .invoke("outerWidth")
      .should("eq", 230.75);
    cy.get(formWidgetsPage.dropdownWidget)
      .find(widgetLocators.dropdownSingleSelect)
      .click({
        force: true,
      });
    cy.get(".select-popover-wrapper")
      .invoke("outerWidth")
      .should("eq", 230.75);

    // Menu Button
    cy.get(formWidgetsPage.menuButtonWidget)
      .find(widgetLocators.menuButton)
      .invoke("outerWidth")
      .should("eq", 230.75);
    cy.get(formWidgetsPage.menuButtonWidget)
      .find(widgetLocators.menuButton)
      .click({
        force: true,
      });
    cy.get(".menu-button-popover")
      .invoke("outerWidth")
      .should("eq", 230.75);

    // MultiSelect
    cy.get(formWidgetsPage.multiselectWidget)
      .find(".rc-select-multiple")
      .invoke("width")
      .should("eq", 230.75);
    cy.get(formWidgetsPage.multiselectWidget)
      .find(".rc-select-selection-search-input")
      .first()
      .focus({ force: true })
      .type("{uparrow}", { force: true });
    cy.get(".multi-select-dropdown")
      .invoke("width")
      .should("eq", 231);

    //Multi tree Select
    cy.get(formWidgetsPage.multiselecttreeWidget)
      .find(".rc-tree-select-multiple")
      .invoke("width")
      .should("eq", 230.75);
    cy.get(formWidgetsPage.multiselecttreeWidget)
      .find(".rc-tree-select-selection-search-input")
      .first()
      .focus({ force: true })
      .type("{uparrow}", { force: true });
    cy.get(".tree-multiselect-dropdown")
      .invoke("outerWidth")
      .should("eq", 231);

    // Tree Select
    cy.get(formWidgetsPage.singleselecttreeWidget)
      .find(".rc-tree-select-single")
      .invoke("outerWidth")
      .should("eq", 230.75);
    cy.get(formWidgetsPage.singleselecttreeWidget)
      .find(".rc-tree-select-selection-search-input")
      .first()
      .focus({ force: true })
      .type("{uparrow}", { force: true });
    cy.get(".single-tree-select-dropdown")
      .invoke("outerWidth")
      .should("eq", 231);
  });
});
