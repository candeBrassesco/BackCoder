import supertest from "supertest";
import { expect } from "chai";
import config from "../src/config.js";

const requester = supertest.agent('http://localhost:8080')

describe("Product endpoints", () => {
    const premiumMockLogin = {
        email: "candelabrassesco99@gmail.com",
        password: config.PREMIUM_TEST_PASSWORD
    }
    const productMockPost = {
        title: "test",
        description: "test",
        price: 10,
        stock: 20,
        code: "test"
    }
    const productMockUpdate = {
        stock: 34
    }
    const resetMockUpdate = {
        stock: 52
    }
    describe("GET /api/products", () => {
        it("should get all products",  async () => {
            const response = await requester.get("/api/products")
            expect(response._body.products.payload).to.be.an('array')
        })
    });
    describe("POST /api/products", () => {
        it("should add a new product to the collection", async () => {
            const login = await requester.post("/api/users/login").send(premiumMockLogin)
            const response = await requester.post("/api/products").send(productMockPost)
            expect(response.statusCode).to.be.equal(200)
            expect(response._body.message).to.be.equal('Product added')
        })
    });
    describe("GET /api/products/:pid", () => {
        it("should get only one product", async () => {
            const response = await requester.get("/api/products/654d45e44b3aabc32e2da47c")
            expect(response._body.product).to.be.an('object')
        })
    });
    describe("DELETE /api/products/:pid", async () => {
        it("should delete the product", async () => {
           const product = await requester.get("/api/products/code/test")
           console.log(product._body.product._id)
           const id = product._body.product._id
           const response = await requester.delete("/api/products/" + id)
           expect(response.statusCode).to.be.equal(200)
        })
        it("should return not authorized", async () => {
            const response = await requester.delete("/api/products/64ed47bee3abb5b38a3a3e27")
            console.log(response.res.statusMessage)
            expect(response.res.statusMessage).to.be.equal('Unauthorized')
        })
    });
    describe("PUT /api/products/:pid", () => {
        after (async () => {
            const res = await requester.put("/api/products/654d45e44b3aabc32e2da47c").send(resetMockUpdate)
        })
        it("should update the product stock", async () => {
            const update = await requester.put("/api/products/654d45e44b3aabc32e2da47c").send(productMockUpdate)
            console.log(update._body)
            expect(update._body.product.stock).to.be.equal(34)
        })
        it("should return not authorized", async () => {
            const update = await requester.put("/api/products/64ed47bee3abb5b38a3a3e27").send(productMockUpdate)
            expect(update.statusCode).to.be.equal(401)
        })
    })
})
