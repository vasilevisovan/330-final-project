const request = require("supertest")

const server = require("../server")
const testUtils = require("../test-utils")

const User = require("../models/user")
const test_recipes = require("../utils/test-recipes")
const Recipe = require("../models/recipe")

describe("/recipes", () => {
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

    let token0
    let token1

    beforeEach(async () => {
        await request(server).post("/auth/signup").send(user0);
        const res0 = await request(server).post("/auth/login").send(user0);
        token0 = res0.body.token
        await request(server).post("/auth/signup").send(user1);
        const res1 = await request(server).post("/auth/login").send(user1);
        token1 = res1.body.token
    })

    describe("POST /recipe", () => {
        it("should send 401 without a token", async () => {
            const res = await request(server).post("/recipe").send(test_recipes[0])
            expect(res.statusCode).toEqual(401)
        })

        it("should send 401 with a bad token", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer BAD")
                .send(test_recipes[0]);
            expect(res.statusCode).toEqual(401);
        })

        it("should send 400 withoud a body", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send()
            expect(res.statusCode).toEqual(400)
        })

        it("should send 400 without a title", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send({
                    ...test_recipes[0],
                    title: ""
                })
            expect(res.statusCode).toEqual(400)
        })

        it("should send 400 without a description", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send({
                    ...test_recipes[0],
                    description: ""
                })
            expect(res.statusCode).toEqual(400)
        })

        it("should send 400 without a description", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send({
                    ...test_recipes[0],
                    description: ""
                })
            expect(res.statusCode).toEqual(400)
        })

        it("should send 400 with empty ingredients array", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send({
                    ...test_recipes[0],
                    ingredients: []
                })
            expect(res.statusCode).toEqual(400)
        })

        it("should send 400 without instructions", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send({
                    ...test_recipes[0],
                    instructions: ""
                })
            expect(res.statusCode).toEqual(400)
        })

        it("should send 201", async () => {
            const res = await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[0])
            expect(res.statusCode).toEqual(201)
        })
    })

    describe("GET /recipe", () => {
        it("should return 200 and empty array", async () => {
            const res = await request(server)
                .get("/recipe")
                .send()

            expect(res.body.length).toEqual(0)
        })

        it("should return 200 and 3 recipes", async () => {
            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[0])

            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token1)
                .send(test_recipes[1])

            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[2])

            const res = await request(server)
                .get("/recipe")
                .send()

            expect(res.body.length).toEqual(3)
        })
    })

    describe("GET /recipe/my", () => {
        beforeEach(async () => {
            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[0])

            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token1)
                .send(test_recipes[1])

            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[2])
        })

        it("should send 200 and 2 recipes", async () => {
            const res = await request(server)
                .get("/recipe/my")
                .set("Authorization", "Bearer " + token0)
                .send()

            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toEqual(2)
        })

        it("should send 200 and 1 recipe", async () => {
            const res = await request(server)
                .get("/recipe/my")
                .set("Authorization", "Bearer " + token1)
                .send()

            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toEqual(1)
        })
    })

    describe("GET /recipe/:id", () => {
        let id

        beforeEach(async () => {
            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[0])

            const data = await Recipe.find()
            id = data[0]._id
        })

        it("should send 400 with invalid id", async () => {
            const res = await request(server)
                .get("/recipe/" + "invalid id")
                .send()

            expect(res.statusCode).toEqual(400)
        })

        it("should send 404 with wrong id", async () => {
            const res = await request(server)
                .get("/recipe/" + "665ca7780ddabb8c055d30e6")
                .send()

            expect(res.statusCode).toEqual(404)
        })

        it("should send 200 with correct id", async () => {
            const res = await request(server)
                .get("/recipe/" + id)
                .send()

            expect(res.statusCode).toEqual(200)
        })
    })

    describe("PUT /recipe/:id", () => {
        let id

        beforeEach(async () => {
            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[0])

            const data = await Recipe.find()
            id = data[0]._id
        })

        it("should send 401 without token", async () => {
            const res = await request(server)
                .put("/recipe/" + id)
                .send({
                    title: "New Title",
                    image: "image1.png"
                })

            expect(res.statusCode).toEqual(401)
        })

        it("should send 400 with invalid id", async () => {
            const res = await request(server)
                .put("/recipe/" + "invalidid")
                .set("Authorization", "Bearer " + token0)
                .send({
                    title: "New Title",
                    image: "image1.png"
                })

            expect(res.statusCode).toEqual(400)
        })

        it("should send 404 with wrong id", async () => {
            const res = await request(server)
                .put("/recipe/" + "665ca7780ddabb8c055d30e6")
                .set("Authorization", "Bearer " + token0)
                .send({
                    title: "New Title",
                    image: "image1.png"
                })

            expect(res.statusCode).toEqual(404)
        })

        it("should send 403 with user1's token", async () => {
            const res = await request(server)
                .put("/recipe/" + id)
                .set("Authorization", "Bearer " + token1)
                .send({
                    title: "New Title",
                    image: "image1.png"
                })

            expect(res.statusCode).toEqual(403)
        })

        it("should send 200 with", async () => {
            const res = await request(server)
                .put("/recipe/" + id)
                .set("Authorization", "Bearer " + token0)
                .send({
                    title: "New Title",
                    image: "image1.png"
                })

            expect(res.statusCode).toEqual(200)
        })
    })

    describe("POST /recipe/search", () => {
        beforeEach(async () => {
            await request(server)
                .post("/recipe/")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[0])

            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token1)
                .send(test_recipes[1])

            await request(server)
                .post("/recipe")
                .set("Authorization", "Bearer " + token0)
                .send(test_recipes[2])
        })

        it("should send 400 without query", async () => {
            const res = await request(server)
                .post("/recipe/search")
                .send({
                })

            expect(res.statusCode).toEqual(400)
        })

        it("should send 200 and 1 recipe with 'Spaghetti'", async () => {
            const res = await request(server)
                .post("/recipe/search")
                .send({
                    query: "Spaghetti"
                })

            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toEqual(1)
        })

        it("should send 200 and 2 recipe with 'Lime'", async () => {
            const res = await request(server)
                .post("/recipe/search")
                .send({
                    query: "Lime"
                })

            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toEqual(2)
        })
    })
})