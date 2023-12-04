import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')

describe("Product endpoints", () => {
    describe("GET /api/products", () => {
        it("shoul get all products",  async () => {
            const response = await requester.get("/api/products")
            console.log(response._body.products.payload)
            expect(response._body.products.payload).to.be.an('array')
        })
    });
    describe("GET /api/:cid", () => {
        it("should get only one product", async () => {
            const response = await requester.get("/api/products/64ed452c1b58a98a32eb1be6")
            console.log(response._body.product)
            expect(response._body.product).to.be.an('object')
        })
    })
    
})
