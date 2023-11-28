import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')

describe("Cart endpoints", () => {
    describe("PUT /api/cart/:cid/product/:pid", () => {
        const newQuant = {
            quantity: 4
        }
        it("should update the quantity of certain product", async () => {
            const response = await requester.put("/api/cart/6533d7493a91900b27ce2753/product/64ed4704e3abb5b38a3a3e23").send(newQuant)
            const cart = await requester.get("/api/cart/6533d7493a91900b27ce2753")
            const quant1 = cart._body.cartById.products[0].quantity
            console.log(quant1)
            const backQuant = {
                quantity: 3
            }
            const resetQuant = await requester.put("/api/cart/6533d7493a91900b27ce2753/product/64ed4704e3abb5b38a3a3e23").send(backQuant)
            const cart2 = await requester.get("/api/cart/6533d7493a91900b27ce2753")
            const quant2 = cart2._body.cartById.products[0].quantity
            console.log(quant2)
            expect(quant2).to.not.be.equal(quant1)
        })
    })
    describre("DELETE /api/cart/:cid/product/:pid", () => {
        it("should delete the product on cart", async () => {
            const response = await requester.delete("/api/cart/6533d7493a91900b27ce2753/product/64ed4704e3abb5b38a3a3e23")
            
        })
    })
})