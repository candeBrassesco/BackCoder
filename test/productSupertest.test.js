import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')



describe("GET /api/cart", () => {
    it("should get all carts", async () => {
        const response = await requester.get("/api/cart")
        expect(response.statusCode).to.be.equal(200)
    });
    it("should be an array", async () => {
        const response = await requester.get("/api/cart")
        console.log(response._body)
        expect(response._body.carts).to.be.an('array')
    })
});
describe("POST /api/cart", () => {
    it("should add a new cart to the collection with no products added", async () => {
        const response = await requester.post("/api/cart")
        console.log(response._body)
        expect(response.statusCode).to.be.equal(200)
        expect(response._body.cart.products).to.be.an('array').with.lengthOf(0)
    })
});
describe("GET /api/cart/:cid", () => {
    it("should get the cart", async () => {
        const response = await requester.get("/api/cart/6531a6fd9c9be72dbdd4b9a2")
        console.log(response._body)
        expect(response.statusCode).to.be.equal(200)
    });
});
describe("PUT /api/cart/:cid", () => {
    after(async () => {
        await requester.delete("/api/cart/6560c9efb18af7ab3bd12176/product/64ed452c1b58a98a32eb1be6")
        await requester.delete("/api/cart/6560c9efb18af7ab3bd12176/product/65305b95ea44194772ec7688")
    });
    const upCart = [
        {
            pid: "64ed452c1b58a98a32eb1be6",
            quantity: 2
        },
        {
            pid: "65305b95ea44194772ec7688",
            quantity: 5
        }
    ]
    it("should update a cart by id", async () => {
        const response = await requester.put("/api/cart/6560c9efb18af7ab3bd12176").send(upCart)
        console.log(response)
        expect(response.statusCode).to.be.equal(200)
    })
})
describe("DELETE /api/cart/:cid", async () => {
    it("should delete one cart", async () => {
        await requester.post("/api/cart")
        const allCarts = await requester.get("/api/cart")
        const carts = allCarts._body.carts
        const id = carts[carts.length - 1]._id
        const response = await requester.delete("/api/cart/" + id)
        const newCarts = response._body.newCartsList.length
        expect(newCarts).to.be.equal(carts.length - 1)
    })
})

