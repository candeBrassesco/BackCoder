import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')

describe("DELETE /api/cart/:cid", async () => {
    before( async () => {
        await requester.post("/api/cart")
    })
    const allCarts = await requester.get("/api/cart")
    const carts = allCarts._body.carts
    const id = carts[carts.length - 1]._id
    it("should delete one cart", async () => { 
        const response = (await requester.delete(`/api/cart/${id}`)).send(id)
        expect(response.statusCode).to.be.equal(200)
    })
})
