const request = require("supertest")

const server = require("../server")
const testUtils = require("../test-utils")

const User = require("../models/user")

describe("/users", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);

    afterEach(testUtils.clearDB);

    const user0 = {
        name: "User Zero",
        email: "user0@mail.com",
        password: "123password",
    };
    const user1 = {
        name: "User One",
        email: "user1@mail.com",
        password: "456password",
    }

    describe("Before login", () => {
        describe("GET /users", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).get("/users").send()
                expect(res.statusCode).toEqual(401)
            })

            it("should send 401 without a token", async () => {
                const res = await request(server).get("/users")
                    .set("Authorization", "Bearer BAD")
                    .send()
                expect(res.statusCode).toEqual(401)
            })
        })

        describe("GET /users/me", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).get("/users/me").send()
                expect(res.statusCode).toEqual(401)
            })

            it("should send 401 without a token", async () => {
                const res = await request(server).get("/users/me")
                    .set("Authorization", "Bearer BAD")
                    .send()
                expect(res.statusCode).toEqual(401)
            })
        })

        describe("PUT /users", () => {
            it("should send 401 without a token", async () => {
                const res = await request(server).put("/users").send({
                    name: "new Name",
                    profilePicture: "profile.url"
                })
                expect(res.statusCode).toEqual(401)
            })

            it("should send 401 without a token", async () => {
                const res = await request(server).put("/users")
                    .set("Authorization", "Bearer BAD")
                    .send({
                        name: "new Name",
                        profilePicture: "profile.url"
                    })
                expect(res.statusCode).toEqual(401)
            })
        })
    })

    describe("After login", () => {
        let token0
        let adminToken
        let userId

        beforeEach(async () => {
            await request(server).post("/auth/signup").send(user0);
            const res0 = await request(server).post("/auth/login").send(user0);
            token0 = res0.body.token;
            await request(server).post("/auth/signup").send(user1);
            await User.updateOne(
                { email: user1.email },
                { $push: { roles: "admin" } }
            );
            const res1 = await request(server).post("/auth/login").send(user1);
            adminToken = res1.body.token;
            const user = await User.findOne({
                email: user0.email
            })
            userId = user._id
        })

        describe("GET /users", () => {
            it("should send 403 for normal user", async () => {
                const res = await request(server).get("/users")
                .set("Authorization", "Bearer " + token0)
                .send()
                expect(res.statusCode).toEqual(403)
            })

            it("should send 200 for admin", async () => {
                const res = await request(server).get("/users")
                    .set("Authorization", "Bearer " + adminToken)
                    .send()
                expect(res.statusCode).toEqual(200)
            })
        })

        describe("GET /users/me", () => {
            it("should send 200", async () => {
                const res = await request(server).get("/users/me")
                .set("Authorization", "Bearer " + adminToken)
                .send()
                expect(res.statusCode).toEqual(200)
            })
        })

        describe("PUT /users", () => {
            it("should send 200", async () => {
                const res = await request(server).put("/users")
                .set("Authorization", "Bearer " + adminToken)
                .send({
                    name: "I am admin",
                    profilePicture: "profile.url"
                })
                expect(res.statusCode).toEqual(200)
                expect(res.body.name).toEqual("I am admin")
                expect(res.body.profilePicture).toEqual("profile.url")
            })
        })

        describe("GET /users/:id", () => {
            it("should send 400 with invalid id", async () => {
                const res = await request(server).get("/users/" + "ivalidid")
                .set("Authorization", "Bearer " + adminToken)
                .send()
                expect(res.statusCode).toEqual(400)
            })

            it("should send 404 with non existing id", async () => {
                const res = await request(server).get("/users/" + "65e2a7b3ebd53a00a826c76b")
                .set("Authorization", "Bearer " + adminToken)
                .send()
                expect(res.statusCode).toEqual(404)
            })

            it("should send 200", async () => {
                const res = await request(server).get("/users/" + userId)
                .set("Authorization", "Bearer " + adminToken)
                .send()
                expect(res.statusCode).toEqual(200)
            })
        })
    })
})