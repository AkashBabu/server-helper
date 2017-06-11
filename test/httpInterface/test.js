var chai = require('chai')
var should = chai.should()

chai.use(require("chai-http"));

var config =require("./config")
var db = require("mongojs")(config.db.url)
var request = chai.request(require("./server"));

describe("HTTP Interface", () =>  {
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
            if(!err) {
                request.get("/api/test2")
                    .end((err, res) => {
                        console.log('res.body:', JSON.stringify(res.body))
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
            if(!err) {
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
    it("should be able update a document PUT /api/:collectionName/:id")
    it("should be able to remove a document DELETE /api/:collectionName/:id")
    it("should check for valid collections")

    it("should validate the input on creation of a document POST /api/:collectionName")
    it("should apply custom validation functions for CRUD")
    it("should support other custom routes")
    it("should allow user to override the default routes")
    it("should authorize a User for an API")
    it("should authorize a User based on roles")
    it("should authorize a User for a CRUD")
    it("should allow us to define API access to Individual User")
    it("should allow us to define API access to Individual Role")
})