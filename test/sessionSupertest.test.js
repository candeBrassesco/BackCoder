import supertest from "supertest";
import { expect } from "chai";
import config from "../src/config.js";

const requester = supertest.agent('http://localhost:8080')

describe("Session endpoints", () => {
    const userMockLogin = {
        email: "candelabrassesco99@gmail.com",
        password: config.PREMIUM_TEST_PASSWORD
    }
    const userMockRegister = {
        first_name: "Maria",
        last_name: "Gonzales",
        email: "marigonza@gmail.com",
        age: 60,
        password: "mari123"
    }
    const userEmail = {
        email: "marigonza@gmail.com"
    }
    const userEmail2 = {
        email: "candelabrassesco99@gmail.com"
    }
    describe("GET /api/users", () => {
        it("should return all users", async () => {
            const response = await requester.get("/api/users")
            console.log(response._body.usersList)
            expect(response._body.usersList).to.be.an('array')
        })
    })
    describe("POST /api/users/register", () => {
        after(async () => {
            await requester.delete("/api/users/delete").send(userEmail)
            const allCarts = await requester.get("/api/cart")
            const carts = allCarts._body.carts
            const id = carts[carts.length - 1]._id
            await requester.delete("/api/cart/" + id)  
        })
        it("should create a new user and set a token on cookies", async () => {
            const response = await requester.post("/api/users/register").send(userMockRegister)
            expect(response.res.rawHeaders[3]).to.be.include('token')
        })
    });
    describe("POST /api/users/login", () => {
        after(async () => {
            await requester.get("/api/users/logout")
        })
        it("should login and redirect to products view", async () => {
            const response = await requester.post("/api/users/login").send(userMockLogin)
            expect(response.text).to.be.equal('Found. Redirecting to /products')
        })
    });
    describe("POST /api/users/resetPass", () => {
        it("should send and email", async () => {
            const response = await requester.post("/api/users/resetPass").send(userEmail2)
            expect(response.text).to.be.equal('Email sent')
        })
        it("should set a token on a cookie", async () => {
            const response = await requester.post("/api/users/resetPass").send(userEmail2)
            expect(response.res.rawHeaders[3]).to.include('tokenPassReset')
        })
    })
})