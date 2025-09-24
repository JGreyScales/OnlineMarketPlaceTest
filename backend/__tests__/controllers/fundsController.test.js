const { Funds } = require("../../controllers/fundsController")

/// funds controller object for testing has

/// userID 1
/// fundsAmount 100.0


describe('Funds Controller', () => {
    let fundsController;

    beforeEach(() => {
        fundsController = new Funds(1, 100.0);
    })

    test("should add funds and return the new balance", () => {
        // Arrange
        const amount = 50.0;

        // Act
        const result = fundsController.addMoney(fundsController.userID, amount);


        // Assert
        expect(result).toBe(100.0);
    }),

    test("should spend funds and return the new balance", () => {
        // Arrange
        const amount = 30.0;

        // Act
        const result = fundsController.removeMoney(fundsController.userID, amount);

        // Assert
        expect(result).toBe(70.0)
    })
})