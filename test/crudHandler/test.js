var chai = require("chai")
var should = chai.should();

chai.use(require("chai-http"));

var request = chai.request(require("./server"))
var db = require("mongojs")("test")

describe("CRUD Handler", () => {
    before(done => {
        done()
    })
    beforeEach(done => {
        db.dropDatabase(done);
    })

    after(done => {
        db.dropDatabase(done)
    })

    it("should save a document", (done) => {
        var data = {
            name: "test"
        }

        request.post("/test")
            .send(data)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(201);
                res.body.should.be.an("object")
                res.body.should.have.keys(['error', 'data'])
                res.body.error.should.not.be.ok;
                res.body.data.name.should.be.eql("test")
                res.body.data.should.have.property("_id");

                done()
            })
    })
    it("should list all documents", (done ) => {
        var list = [
            {name: 'test21'}, {name: 'test22'}
        ]

        db.collection("test").insert(list, (err, result) => {
            request.get("/test")
                .end((err, res) => {
                    should.not.exist(err)
                    res.should.have.status(200)
                    res.body.should.be.an("object")
                    res.body.should.have.keys(['error', 'data'])
                    res.body.error.should.not.be.ok;
                    res.body.data.should.have.keys(['count', 'list'])
                    res.body.data.count.should.be.eql(2)
                    res.body.data.list.length.should.be.eql(2)

                    done()
                })
        })
    })
    it("should get a single document", done => {
        var doc = {
            name: 'test3'
        }

        db.collection('test').insert(doc, (err, result ) => {
            request.get("/test/" + result._id)
                .end((err, res) => {
                    should.not.exist(err)
                    res.should.have.status(200)
                    res.body.should.be.an("object")
                    res.body.should.have.keys(['error', 'data'])
                    res.body.error.should.not.be.ok;
                    res.body.data.should.have.keys(['_id', 'name'])
                    res.body.data.name.should.be.eql(doc.name);

                    done()
                })
        })
    })
    it("should update an existing document", done => {
         var doc = {
            name: 'test3'
        }

        db.collection('test').insert(doc, (err, result ) => {
            result.name = "test3_updated";

            request.put("/test/" + result._id)
                .send(result)
                .end((err, res) => {
                    should.not.exist(err)
                    res.should.have.status(202)
                    res.body.should.be.an("object")
                    res.body.should.have.keys(['error', 'data'])
                    res.body.error.should.not.be.ok;

                    db.collection('test').findOne({_id: db.ObjectId(result._id)}, (err, result1) => {
                        should.not.exist(err)
                        result1.name.should.be.eql(result.name);

                        done()
                    })

                })
        })
    })
    it("should remove a document", done => {
         var doc = {
            name: 'test3'
        }

        db.collection('test').insert(doc, (err, result ) => {
            request.delete("/test/" + result._id)
                .end((err, res) => {
                    should.not.exist(err)
                    res.should.have.status(202)
                    res.body.should.be.an("object")
                    res.body.should.have.keys(['error', 'data'])
                    res.body.error.should.not.be.ok;

                    db.collection('test').findOne({_id: db.ObjectId(result._id)}, (err, result1) => {
                        should.not.exist(err)
                        should.not.exist(result1);

                        done()
                    })

                })
        })
    })
})