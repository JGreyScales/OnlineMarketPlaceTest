const productController = require("../../controllers/productController")

describe('Product Controller', () => {
    test("Should return the correct product by ID", () => {
        // Arrange
        const productID = 1;

        // Act
        const result = productController.getProduct(productID);
        // Assert
        expect(result[0]['productID']).toBe(productID)
    })
})