var chai = require('chai')
var should = chai.should()

chai.use(require("chai-http"));

var config = require("./config")
var db = require("mongojs")(config.db.url)
var request = chai.request(require("./server"));

describe("HTTP Interface", () => {
    before((done) => {
        db.dropDatabase(done)
    })

    after(done => {
        db.dropDatabase(done);
    })
    it("should be able to create document POST /api/:collectionName", (done) => {
        var data = {
            name: 'test'
        }
        request.post("/api/test")
            .send(data)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(201);
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.name.should.be.eql(data.name);
                should.exist(res.body.data._id);

                done();
            })
    })
    it("should be able to retrieve documents GET /api/:collectionName", (done) => {
        var data = [{
            name: 'test1'
        }, {
            name: 'test2'
        }]
        db.collection('test2').insert(data, (err, result) => {
            if (!err) {
                request.get("/api/test2")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object")
                        res.body.error.should.not.be.ok;
                        res.body.data.count.should.be.eql(data.length);
                        res.body.data.list.length.should.be.eql(data.length);
                        should.exist(res.body.data.list[0].name);

                        done();
                    })

            } else {
                console.error("failed to insert into test2")
                done(err);
            }
        })
    })
    it("should be able to retrieve a Single document GET /api/:collectionName/:id ", (done) => {
        var data = {
            name: 'test'
        }
        db.collection('test3').insert(data, (err, result) => {
            if (!err) {
                request.get("/api/test3/" + result._id)
                    .end((err, res) => {
                        should.not.exist(err)
                        res.should.have.a.status(200);
                        res.body.error.should.not.be.ok;
                        res.body.data.should.be.an("object")
                        res.body.data.name.should.be.eql("test")

                        done();
                    })
            } else {
                console.error("failed to insert into test3")
                done(err)
            }
        })
    })
    it("should be able update a document PUT /api/:collectionName/:id", (done) => {
        var data = {
            name: 'test',
            age: 31
        }

        db.collection('test4').insert(data, (err, result) => {
            if (!err) {
                data.name = "test4"
                data.age = 25
                request.put("/api/test4/" + result._id)
                    .send(data)
                    .end((err, res) => {
                        res.status.should.be.eql(202);
                        res.body.should.be.an("object");
                        res.body.error.should.not.be.ok;
                        res.body.data.should.be.an("object");
                        res.body.data.n.should.be.eql(1);

                        request.get("/api/test4/" + result._id)
                            .end((err, res) => {
                                res.status.should.be.eql(200);
                                res.body.error.should.not.be.ok;
                                res.body.data.name.should.be.eql(data.name);
                                res.body.data.age.should.be.eql(data.age);

                                done()
                            })
                    })
            } else {
                console.error("Failed to insert into test4");
                done(err);
            }
        })
    })
    it("should be able to remove a document DELETE /api/:collectionName/:id", done => {
        var data = {
            name: 'test5'
        }

        db.collection('test5').insert(data, (err, result) => {
            if (!err) {
                request.del("/api/test5/" + result._id)
                    .end((err, res) => {
                        should.not.exist(err)
                        res.status.should.be.eql(202);
                        res.body.should.be.an("object")
                        res.body.error.should.not.be.ok;

                        db.collection('test5').findOne({
                            _id: result._id
                        }, (err, result) => {
                            should.not.exist(err);
                            should.not.exist(result)

                            done();
                        })
                    })
            } else {
                console.error("failed to insert into test5")
                done(err)
            }
        })
    })
    it("should check for valid collections", (done) => {
        var data = {
            name: 'invalidCollection'
        }

        request.post("/api/invalidColl")
            .send(data)
            .end((err, res) => {
                res.status.should.be.eql(404)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("API Not Found");

                done();
            })
    })
    it("should create only the required Operations on a API", (done) => {
        // Since 'GET a single Doc' is not specified in config file, it should be forwarded  

        request.get("/api/test7")
            .end((err, res) => {
                res.status.should.be.eql(404)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("API Not Found");

                done();
            })

    })

    it("should create JWT Tokens")
    it("should create and set cookies")
    it("should create OAuth sessions")

    it("should validate the input on creation of a document POST /api/:collectionName", done => {
        var data = {
            name: 'test8',
            age: 21,

        }

        done()
    })
    it("should apply custom validation functions for CRUD")
    it("should support other custom routes")
    it("should allow user to override the default routes")
    it("should authorize a User based on roles")
    it("should authorize a User for a CRUD")
    it("should authorize a User for an API")
    it("should allow us to define API access to Individual Role")
    it("should allow us to define API access to Individual User")

    it("should be able to provide complex logics with config file, like referring to other collections")
    it("should comply with any one of the existing projects create by me 100%")
})