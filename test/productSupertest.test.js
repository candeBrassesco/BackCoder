import supertest from "supertest";
import { expect } from "chai";
import config from "../src/config.js";

const requester = supertest.agent('http://localhost:8080')

describe("Product endpoints", () => {
    const userMockLogin = {
        email: "candelabrassesco99@gmail.com",
        password: config.USER_TEST_PASSWORD
    }
    const productMockPost = {
        title: "test",
        description: "test",
        price: 10,
        stock: 20,
        code: "test"
    }
    describe("GET /api/products", () => {
        it("should get all products",  async () => {
            const response = await requester.get("/api/products")
            expect(response._body.products.payload).to.be.an('array')
        })
    });
    describe("POST /api/products", () => {
        it("should add a new product to the collection", async () => {
            const login = await requester.post("/api/session/login").send(userMockLogin)
            const response = await requester.post("/api/products").send(productMockPost)
            expect(response.statusCode).to.be.equal(200)
            expect(response._body.message).to.be.equal('Product added')
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
    })
    describe("GET /api/products/:pid", () => {
        it("should get only one product", async () => {
            const response = await requester.get("/api/products/64ed452c1b58a98a32eb1be6")
            expect(response._body.product).to.be.an('object')
        })
    })
    
})
