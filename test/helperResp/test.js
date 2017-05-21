var chai = require('chai')
var should = chai.should()

chai.use(require('chai-http'))

var request = chai.request(require("./server"))

describe("HelperResp", () => {
    describe("#unauth", () => {
        it("should respond with 401 UNAUTHORIZED", (done) => {
            request.get("/unauth")
                .end((err, res) => {
                    res.should.have.status(401)
                    console.log('res.body:', res.body);
                    res.body.error.should.be.ok
                    res.body.data.should.be.eql("UNAUTHORIZED ACCESS")

                    done()
                })
        })
        it("should send the required response status message", (done) => {
            request.get("/unauth?comments=UNAUTHORIZED")
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.error.should.be.ok
                    res.body.data.should.be.eql("UNAUTHORIZED")

                    done()
                })
        })
    })

    describe("#serverError", () => {
        it("should  responed with 500 INTERNAL SERVER ERROR", (done) => {
            request.get("/serverError")
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.error.should.be.ok
                    res.body.data.should.be.eql("INTERNAL SERVER ERROR")

                    done()
                })
        })
        it("should send the required response status message", (done) => {
            request.get("/serverError?comments=Server-Error")
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.error.should.be.ok
                    res.body.data.should.be.eql("Server-Error")

                    done()
                })
        })
    })

    describe("#handleResult", () => {
        it("should respond with 204 NO CONTENT when there  is no content", () => {
            request.get("/handleResult")
                .end((err, res) => {
                    res.should.have.status(204)
                    res.body.error.should.not.be.ok
                    res.body.data.should.be.an('array')
                    res.body.data.length.should.be.eql(0)

                    done()
                })
        })
        it("should respond with 200 If there is content", () => {
            request.get("/handleResult?name=test&age=21")
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.error.should.not.be.ok
                    res.body.data.should.be.an('object')
                    should.exist(res.body.data.name)
                    res.body.data.name.should.be.eql("test")

                    done()
                })
        })
        it("should respond with 204 NO CONTENT with data in response as array", () => {
            request.get("/handleResult/array")
                .end((err, res) => {
                    res.should.have.status(204)
                    res.body.error.should.not.be.ok
                    res.body.data.should.be.an('array')
                    res.body.data.length.should.be.eql(0)

                    done()
                })
        })
        it("should respond with 204 NO CONTENT with data in response as object", () => {
            request.get("/handleResult/object")
                .end((err, res) => {
                    res.should.have.status(204)
                    res.body.error.should.not.be.ok
                    res.body.data.should.be.an('object')
                    Object.keys(res.body.data).length.should.be.eql(0)

                    done()
                })
        })
    })

    describe("#success", function() {
        it("should respond with http success", () => {
            request.get("/success")
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.an("object")
                    res.body.data.name.should.be.eql("test")

                    done();
                })
        })
    })

    describe("#failed", function() {
        it("should respond with http failure", () => {
            request.get("/failed")
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.a("string")
                    res.body.data.should.be.eql("Invalid Data")

                    done();
                })
        })
    })

    describe("#post", () => {
        it("should respond with HTTP created", () => {
            request.post("/post")
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.an("object")
                    res.body.data.create.should.be.ok;

                    done()
                })
        })
    })


    describe("#put", () => {
        it("should respond with HTTP accepted", () => {
            request.put("/put")
                .end((err, res) => {
                    res.should.have.status(202)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.an("object")
                    res.body.data.accepted.should.be.ok;

                    done()
                })
        })
    })

    describe("#delete", () => {
        it("should respond with HTTP Delete", () => {
            request.delete("/delete")
                .end((err, res) => {
                    res.should.have.status(202)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.an("object")
                    res.body.data.remove.should.be.ok;

                    done()
                })
        })
    })

    describe("#get", () => {
        it("should respond with HTTP List []", () => {
            request.get("/list")
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.an("array")

                    done()
                })
        })
        it("should respond with HTTP get /:id", () => {
            request.get("/test/testname")
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.error.should.not.be.ok;
                    res.body.data.should.be.an("object")
                    res.body.data.name.should.be.eql("testname")

                    done()
                })
        })
    })
})