import supertest from "supertest";
import { expect } from "chai";
import config from "../src/config.js";

const requester = supertest.agent('http://localhost:8080')

describe("Cart endpoints", () => {
    const upCart = [
        {
            pid: "64ed47bee3abb5b38a3a3e27",
            quantity: 2
        },
        {
            pid: "64ed47e9e3abb5b38a3a3e2a",
            quantity: 5
        }
    ]
    const newQuant = {
        quantity: 4
    }
    const backQuant = {
        quantity: 1
    }
    const userMockLogin = {
        email: "candelabrassesco99@gmail.com",
        password: config.PREMIUM_TEST_PASSWORD
    }
    const adminMockLogin = {
        email: "adminCoder@coder.com",
        password: config.ADMIN_PASSWORD
    }
    const restockMock = {
        stock: 38
    }
    describe("GET /api/cart", () => {
        it("should get all carts", async () => {
            const response = await requester.get("/api/cart")
            expect(response.statusCode).to.be.equal(200)
        });
        it("should be an array", async () => {
            const response = await requester.get("/api/cart")
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
            const response = await requester.get("/api/cart/6568c8052a8978f670ee9d69")
            expect(response.statusCode).to.be.equal(200)
        });
    });
    describe("PUT /api/cart/:cid", () => {
        after(async () => {
            await requester.delete("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27")
            await requester.delete("/api/cart/6568c8052a8978f670ee9d69/product/64ed47e9e3abb5b38a3a3e2a")
        });
        it("should update a cart by id", async () => {
            const response = await requester.put("/api/cart/6568c8052a8978f670ee9d69").send(upCart)
            expect(response.statusCode).to.be.equal(200)
        })
    });
    describe("DELETE /api/cart/:cid", async () => {
        it("should delete one cart", async () => {
            const allCarts = await requester.get("/api/cart")
            const carts = allCarts._body.carts
            const id = carts[carts.length - 1]._id
            console.log(id)
            const response = await requester.delete("/api/cart/" + id)
            const newCarts = response._body.newCartsList.length
            expect(newCarts).to.be.equal(carts.length - 1)
        })
    });
    describe("POST /api/cart/:cid/product/:pid", () => {
        after(async () => {
            await requester.get("/api/users/logout")
        })
        it("should add the chosen product to a cart", async () => {
            await requester.post("/api/users/login").send(userMockLogin)
            const response = await requester.post("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27")
            expect(response.statusCode).to.be.equal(200)
        });
        it("should return 'Not authorized'", async () => {
            await requester.get("/api/users/logout")
            const login = await requester.post("/api/users/login").send(adminMockLogin)
            const response = await requester.post("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27")
            expect(response.res.statusMessage).to.be.equal('Unauthorized')
        })   
    });
    describe("PUT /api/cart/:cid/product/:pid", () => {
        before(async () => {
            await requester.post("/api/users/login").send(userMockLogin)
        })
        it("should update the quantity of certain product", async () => {
            const response = await requester.put("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27").send(newQuant)
            const cart = await requester.get("/api/cart/6568c8052a8978f670ee9d69")
            const quant1 = cart._body.cartById.products[0].quantity
            const resetQuant = await requester.put("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27").send(backQuant)
            const cart2 = await requester.get("/api/cart/6568c8052a8978f670ee9d69")
            const quant2 = cart2._body.cartById.products[0].quantity
            expect(quant2).to.not.be.equal(quant1)
        })
    })
    describe("DELETE /api/cart/:cid/product/:pid", () => {
        it("should delete the product on cart", async () => {
            const response = await requester.delete("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27")
            const cart = await requester.get("/api/cart/6568c8052a8978f670ee9d69")
            console.log(cart._body)
            const reset = await requester.put("/api/cart/6568c8052a8978f670ee9d69/product/64ed47bee3abb5b38a3a3e27").send(backQuant)
            expect(cart._body.cartById.products).to.have.lengthOf(0)
        })
        it("should recieve an error when product is not on cart", async () => {
            const response = await requester.delete("/api/cart/6568c8052a8978f670ee9d69/product/64ed48cee3abb5b38a3a3e32")
            expect(response.statusCode).to.be.equal(500)
        })
    })
    describe("GET /api/cart/:cid/purchase", () => {
        after(async () => {
            await requester.get("/api/users/logout")
            await requester.post("/api/users/login").send(adminMockLogin)
            await requester.put("/api/products/64ed47bee3abb5b38a3a3e27").send(restockMock)
            await requester.get("/api/users/logout")
        })
        it("should get the cart ticket", async () => {
            const response = await requester.get("/api/cart/6568c8052a8978f670ee9d69/purchase")
            expect(response._body.purchase.ticket.amount).to.not.be.equal(0)
        })
    })
})  