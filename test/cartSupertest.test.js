import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')

describe("Cart endpoints", () => {
    describe("POST /api/cart/:cid/product/:pid", () => {
        after( async () => {
            await requester.delete("/api/cart/654d1f8c8f4518328a4dd436/product/64ed452c1b58a98a32eb1be6")
        })
        it("should add the chosen product to a cart", async () => {
            const response = await requester.post("/api/cart/654d1f8c8f4518328a4dd436/product/64ed452c1b58a98a32eb1be6")
            console.log(response)
            expect(response.statusCode).to.be.equal(200)
        })
    })
})