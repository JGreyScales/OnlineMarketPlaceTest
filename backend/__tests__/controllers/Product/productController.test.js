const {Product} = require("../../../controllers/Product/productController")

describe('Product Controller', () => {
    let Product;

    beforeEach(() => {
        Product = new Product();
    })

    test("Should return the correct product by ID", () => {
        // Arrange
        const productID = 1;
        const expectedProductName = "Testing Product"

        // Act
        Product.populateObject();
        const result = Product.getProductID(productID);
        // Assert
        expect(result).toBe(expectedProductName)
    })
})