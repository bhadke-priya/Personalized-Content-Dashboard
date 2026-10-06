describe("dashboard", () => {
  beforeEach(() => cy.visit("/"));
  it("loads feed and searches", () => {
    cy.get("[data-testid=content-card]").should("have.length.greaterThan", 0);
    cy.get("input[type=search]").type("headline");
    cy.get("[data-testid=content-card]").each(($c) => expect($c.text().toLowerCase()).to.contain("headline"));
  });
  it("favorites a card and shows it under Favorites", () => {
    cy.get("[data-testid=content-card]").first().find("button[aria-pressed]").click();
    cy.contains("button", "Favorites").click();
    cy.get("[data-testid=content-card]").should("have.length", 1);
  });
  it("persists dark mode across reload", () => {
    cy.get("button[aria-label='Toggle dark mode']").click();
    cy.reload();
    cy.get("html").should("have.class", "dark");
  });
});
