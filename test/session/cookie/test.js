var chai = require('chai')
var should = chai.should()

var Helper = require("../../../dist/index").Helper;
var helper = new Helper()

chai.use(require("chai-http"));

var config = require("./config")
var db = require("mongojs")(config.options.connStr)
var request = chai.request(require("./server"));
var agent = chai.request.agent(require("./server"));

describe("SESSION-COOKIE", () => {

    function logout(done) {
        agent.get("/logout")
            .end(done);
    }

    before((done) => {
        // db.dropDatabase(done)
        var users = [{
            email: "test1@mail.com",
            password: helper.saltHash('test123')
        }, {
            email: 'test2@mail.com',
            password: helper.saltHash('test123')
        }]
        db.collection(config.options.collName).insert(users, done);
    })

    after(done => {
        db.dropDatabase(done);
    })

    it("should create Cookie and redirect to index page on successfull login", done => {
        var user = {
            email: 'test1@mail.com',
            password: 'test123'
        }
        agent.post("/login")
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.redirect;
                res.should.have.status(200)
                res.text.should.be.eql("Index Page")
                // res.should.have.cookie('connect.sid');


                done()
            })
    })

    it("should not create cookie and redirect back to login page on login failure", done => {
        var user = {
            email: 'failed@mail.com',
            password: 'failed'
        }
        logout(() => {

            agent.post("/login")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err)
                    res.should.redirect;
                    res.should.not.have.cookie('connect.sid');
                    res.should.have.status(200)
                    res.text.should.be.eql("Login Page")

                    done()
                })
        })
    })

    it("should register a user, create cookie and redirect to index page on successfull registration", done => {
        var newUser = {
            email: 'test4@mail.com',
            password: 'test123'
        }

        agent.post("/register")
            .send(newUser)
            .end((err, res) => {
                should.not.exist(err)
                res.should.redirect;
                // res.should.have.cookie("connect.sid")
                res.should.have.status(200);
                res.text.should.be.eql("Index Page")

                agent.get("/logout")
                    .end((err, res) => {
                        should.not.exist(err);
                        res.should.not.have.cookie("connect-sid")
                        res.should.have.status(200)
                        res.text.should.be.eql("Logged Out")

                        agent.post("/login")
                            .send(newUser)
                            .end((err, res) => {
                                should.not.exist(err)
                                res.should.have.status(200)
                                res.text.should.be.eql("Index Page");
                                // res.should.have.cookie("connect.sid")

                                done();
                            })
                    })
            })
    })
    it("should return duplicate Email on duplicate email", done => {
        var newUser = {
            email: 'test1@mail.com',
            password: 'test123'
        }

        agent.post("/register")
            .send(newUser)
            .end((err, res) => {
                // res.should.redirect;
                // res.should.have.cookie("connect.sid")
                res.should.have.status(400);
                res.body.should.include.keys(["error", 'data']);
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Duplicate Email");

                done();
            })
    })

    it("should be redirected to login page, if not logged in")
    it("should be able to access other urls after successfull login")

    it("should use the provided register and login function")

})