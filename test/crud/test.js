var chai = require("chai")
var chaiHttp = require("chai-http")
var mongojs = require("mongojs")
var db = mongojs("sh_test")
var server = require("./server")

var should = chai.should()
chai.use(chaiHttp)

var userColl = "users"

describe("CRUD on Users", function () {
    beforeEach((done) => {
        db.collection(userColl).remove({}, done)
    })

    after((done) => {
        db.dropDatabase(function () {
            done();
        })
    })

    it("should list ALL users on /users GET", (done) => {
        chai.request(server)
            .get("/users")
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.be.eql(false)
                res.body.data.should.be.a("array")
                res.body.data.length.should.be.eql(0)
                done()
            })
    })

    it("should get a SINGLE user on /users/<id> GET", (done) => {
        var user = {
            name: "Akash",
            email: "001akashbabu@gmail.com",
            phone: "1234567890"
        }
        db.collection(userColl).insert(user, (err, result) => {
            if (result) {
                chai.request(server)
                    .get("/users/" + result._id)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.error.should.be.eql(false)
                        res.body.data.name.should.be.eql(user.name)
                        res.body.data.email.should.be.eql(user.email)
                        res.body.data.phone.should.be.eql(user.phone)
                        done()
                    })
            } else {
                done(err, result)
            }
        })
    })

    it("should create a SINGLE user on /user POST", (done) => {
        var user = {
            name: "Akash",
            email: "001akashbabu@gmail.com",
            phone: "1234567890"
        }
        chai.request(server)
            .post('/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.error.should.not.be.ok

                done()
            })
    })

    it("should update a SINGLE user on /user/<id> PUT", (done) => {
        var user = {
            name: "Akash",
            email: "001akashbabu@gmail.com",
            phone: "1234567890"
        }
        var update = {
            name: "Maneesh"
        }
        db.collection(userColl).insert(user, (err, result) => {
            if (result) {
                chai.request(server)
                    .put("/users/" + user._id)
                    .send(update)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.error.should.not.be.ok

                        db.collection(userColl).findOne({}, (err, updatedUser) => {
                            updatedUser.name.should.be.eql(update.name)
                            done()
                        })

                    })
            } else {
                console.log("Failed to Insert User for Update");
                done(err, result)
            }
        })
    })
    it("should remove a SINGLE user on /user DELETE", (done) => {
        var user = {
            name: "Akash",
            email: "001akashbabu@gmail.com",
            phone: "1234567890"
        }
        db.collection(userColl).insert(user, (err, result) => {
            if (result) {
                chai.request(server)
                    .delete("/users/" + user._id)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.error.should.not.be.ok

                        db.collection(userColl).find({}, (err, users) => {
                            users.should.be.an("array")
                            users.length.should.be.eql(0)

                            done();
                        })
                    })
            } else {
                console.log("Failed to Insert User for /users DELETE");
                done(err, result)
            }
        })
    })

    // it("should return method not allowed error for any other methods", (done) => {
    //     chai.request(server)
    //         .options("/users/")
    //         .end((err, res) => {
    //             res.should.have.status(405)
    //             res.body.error.should.be.ok
    //             res.body.data.should.be.eql("Method Not Allowed")
    //             done()
    //         })
    // })

    it("should forward a request if handler is not present", (done) => {
        chai.request(server)
            .get("/users/get/names")
            .end((res) => {
                res.should.have.status(404)
                done()
            })
    })
})