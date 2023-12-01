import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')

describe("Cart endpoints", () => {
    describe("POST /api/cart/:cid/product/:pid", () => {
        const userMock = {
            email: "candelabrassesco99gmail.com",
            password: "candela99"
        }
        it("should add the chosen product to a cart", async () => {
            await requester.post("/api/session/login").send(userMock)
            const response = await requester.post("/api/cart/6568c8052a8978f670ee9d69/product/64ed452c1b58a98a32eb1be6")
            await requester.delete("/api/cart/6568c8052a8978f670ee9d69/product/64ed452c1b58a98a32eb1be6")
            console.log(response)
            expect(response.statusCode).to.be.equal(200)
        })
    })
})