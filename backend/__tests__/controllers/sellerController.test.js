const sellerController = require("../../controllers/sellerController")

describe('Product Controller', () => {
    test("Should return the storepageName", () => {
        // Arrange
        const sellerID = 1;
        const expectedAnswer = "Demo Storepage";
        // Act
        const result = sellerController.getStorePage(sellerID);
        // Assert
        expect(result[0]['storepageName']).toBe(expectedAnswer)
    })
})