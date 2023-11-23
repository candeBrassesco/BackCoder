import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')

describe("Cart endpoints", () => {
    describe("GET /api/cart", () => {
        it("should get all carts", async () => {
            const response = await requester.get("/api/cart")
            expect(response.statusCode).to.be.equal(200)
        })
    })
    describe("POST /api/cart", () => {
        it("should add a new cart to the collection", async () => {
            const response = await requester.post("/api/cart")
            expect(response.statusCode).to.be.equal(200)
        })
    })
    describe("GET /api/cart/:cid", () => {
        it("should get only one cart by id", async () => {
            const response = await requester.get("/api/cart/65305601858d52a7f5668266")
            
            expect(response.statusCode).to.be.equal(200)
        })
    })
    describe("PUT /api/cart/:cid")
})