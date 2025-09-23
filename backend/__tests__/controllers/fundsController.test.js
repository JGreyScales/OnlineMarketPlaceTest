const fundController = require("./fundsController")

desribe('Funds Controller', () => {
    test("should add funds and return the new balance", () => {
        // Arrange
        const userID = "1";
        const amount = 50.0;

        // Act
        const result = fundsController.addFunds(userID, amount);


        // Assert
        expect(result).toBeGreaterThan(0);
    })
})