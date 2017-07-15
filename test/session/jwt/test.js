var chai = require('chai')
var should = chai.should()

chai.use(require("chai-http"));
var Helper = new require("../../../dist/index").Helper;
var helper = new Helper(false);

var config = require("./config")
var db = require("mongojs")(config.options.connStr)
var request = chai.request(require("./server"));

describe("SESSION-JWT", () => {
    before((done) => {
        // db.dropDatabase(done)
        var users = [{
            email: "test1@mail.com",
            pwd: 'test123'
        }, {
            email: 'test2@mail.com',
            pwd: 'test123'
        }, {
            email: 'test3@mail.com',
            password: helper.saltHash('test123')
        }]
        db.collection(config.options.collName).insert(users, done);
    })

    after(done => {
        db.dropDatabase(done);
    })

    it("should create JWT Tokens on login", (done) => {
        var user = {
            email: "test1@mail.com",
            pwd: 'test123'
        }
        request.post('/login')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                done();
            })
    })
    it("should use default handlers while login handler is not specified", done => {
        var user = {
            email: "test3@mail.com",
            password: 'test123'
        }
        request.post('/login-default')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                done();
            })
    })
    it("should return 'Please specify a password' when the password field is not present/is mispelled", done => {
        var user = {
            email: "test3@mail.com",
            passwo: 'test123'
        }
        request.post('/login-default')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Please specify a password")

                done();
            })
    })

    it("should create JWT tokens on Register", (done) => {
        var user = {
            name: 'test',
            email: 'test3@example.com',
            pwd: 'test123'
        }
        request.post("/register")
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                done();
            })
    });

    it("should return 'Duplicate User' when email is duplicate and default handler is used", done => {
        var user = {
            name: 'test',
            email: 'test1@mail.com',
            password: 'test123'
        }
        request.post("/register-default")
            .send(user)
            .end((err, res) => {
                should.exist(err)
                res.should.have.status(400)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Duplicate User");

                done();
            })
    })
    it("should return 'Please specify a password' when password field is not present/ is mispelled", done => {
        var user = {
            name: 'test',
            email: 'test10@mail.com',
            passwo: 'test123'
        }
        request.post("/register-default")
            .send(user)
            .end((err, res) => {
                should.exist(err)
                res.should.have.status(400)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Please specify a password");

                done();
            })
    })
    it("should use default-handler(save user) while register handler is not specified", done => {
        var user = {
            name: 'test',
            email: 'test4@example.com',
            password: 'test123'
        }
        request.post("/register-default")
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                db.collection(config.options.collName).findOne({
                    email: user.email
                }, (err, result) => {
                    if (result) {
                        done();
                    } else {
                        done(err ? err : true);
                    }
                })
            })
    })

    it("should return 'UNAUTHORIZED ACCESS' if token is invalid", done => {
        request.post("/validate")
            .set("x-access-token", 'asdf')
            .end((err, res) => {
                should.exist(err)
                res.should.have.status(401)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("UNAUTHORIZED ACCESS")

                done();
            })
    })

    it("should validate JWT token in headers", done => {
        var user = {
            email: "test1@mail.com",
            pwd: 'test123'
        }
        request.post('/login')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                request.post('/validate')
                    .set('x-access-token', res.body.data.token)
                    .end((err, res1) => {
                        should.not.exist(err)
                        res1.should.have.status(200)
                        res1.body.should.be.an("object")
                        res1.body.error.should.not.be.ok;
                        res1.body.data.should.be.eql("valid")

                        done();
                    })
            })
    });
    it("should validate JWT token in query", done => {
        var user = {
            email: "test1@mail.com",
            pwd: 'test123'
        }
        request.post('/login')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                request.post('/validate?access_token=' + res.body.data.token)
                    .end((err, res1) => {
                        should.not.exist(err)
                        res1.should.have.status(200)
                        res1.body.should.be.an("object")
                        res1.body.error.should.not.be.ok;
                        res1.body.data.should.be.eql("valid")

                        done();
                    })
            })
    });
    it("should validate JWT token in body", done => {
        var user = {
            email: "test1@mail.com",
            pwd: 'test123'
        }
        request.post('/login')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                request.post('/validate')
                    .send({
                        access_token: res.body.data.token
                    })
                    .end((err, res1) => {
                        should.not.exist(err)
                        res1.should.have.status(200)
                        res1.body.should.be.an("object")
                        res1.body.error.should.not.be.ok;
                        res1.body.data.should.be.eql("valid")

                        done();
                    })
            })
    });

    it("should use default handler if validate handler has not been specified", done => {
        var user = {
            email: "test1@mail.com",
            pwd: 'test123'
        }
        request.post('/login')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                request.post('/validate-default')
                    .set('x-access-token', res.body.data.token)
                    .end((err, res1) => {
                        should.not.exist(err)
                        res1.should.have.status(200)
                        res1.body.should.be.an("object")
                        res1.body.error.should.not.be.ok;
                        res1.body.data.should.be.eql("valid")

                        done();
                    })
            })
    })

    it("should validate whitelisted URL even without a token", done => {
        request.post('/validate-whitelist?asdf=asdf')
            .end((err, res1) => {
                should.not.exist(err)
                res1.should.have.status(200)
                res1.body.should.be.an("object")
                res1.body.error.should.not.be.ok;
                res1.body.data.should.be.eql("valid")

                done();
            })
    })
    it("should validate whitelisted URL in Object even without a token", done => {
        request.post('/validate-whitelist-object?asdf=asdf')
            .end((err, res1) => {
                should.not.exist(err)
                res1.should.have.status(200)
                res1.body.should.be.an("object")
                res1.body.error.should.not.be.ok;
                res1.body.data.should.be.eql("valid")

                done();
            })
    })

    it("should set a req.user on token validate", done => {
        var user = {
            email: "test1@mail.com",
            pwd: 'test123'
        }
        request.post('/login')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                should.exist(res.body.data.token);
                should.exist(res.body.data.expires);
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(user.email)

                request.get('/user')
                    .set('x-access-token', res.body.data.token)
                    .end((err, res1) => {
                        should.not.exist(err)
                        res1.should.have.status(200)
                        res1.body.should.be.an("object")
                        res1.body.email.should.be.eql(user.email);

                        done();
                    })
            })
    })

})