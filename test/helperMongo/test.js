var serverHelper = require('../../index');
var HelperMongo = serverHelper.HelperMongo;
var connStr = "sh_test"
var helperMongo = new Helper(connStr, true);
var mongojs = require('mongojs')
var db = mongojs(connStr)

var chai = require("chai")
var should = chai.should()
var assert = chai.assert

var userColl = "users"

describe("helper mongo", () => {

    beforeEach((done) => {
        db.collection(userColl).remove({}, done)
    })

    after((done) => {
        db.dropDatabase(done)
    })

    describe("#getDateFormat()", () => {
        beforeEach((done) => {
            var user = {
                name: 'Akash',
                cTime: Date("2017-04-01T05:30:30.333Z")
            }
            db.collection(userColl).insert(user, done)
        })

        it("should return Year format")
        it("should return Month format")
        it("should return Day format")
        it("should return Hour format")
        it("should return Minute format")
        it("should return Second format")
        it("should return Millisecond format")
        it("should return Day format by default")
    })

    describe("#createUniqueIndex()", () => {
        beforeEach((done) => {
            // Clear all indexes on the collection
            setTimeout(done, 100)
        })

        it("should create a unique index for the given object")
        it("should create a unique index for the given key")
    })

    describe("#validateExistence()", () => {
        it("should return true if atleast one document was found for the given query")
    })

    describe("#validateNonExistence()", () => {
        it("should return true if there was no document found for the given query")
    })

    describe("#validateNonExistenceWithMsg()", () => {
        it("should return true  if there was no document found for the given query")
        it("should return 'Duplicate Document' if there was no document found for the given query and no Err Msg was specified")
        it("should return errMsg  if atleast one document was found for the given query and errMsg was given")
        it("should iterate through all the validations")
        it("should return corresponding errMsg if duplicates were found for the given query")
    })

    describe("#validateNonExistenceWhileUpdate()", () => {
        it("should validate _id for a valid mongo id")
        it("should check if the given doc with _id exists")
        it("should fetch the existing doc and compare the given field with already present ones")
        it("should validate only the fields which have changed wrt the ones present in DB")
        it("should return corresponding errMsg or 'Duplicate Document' if a document with the query is already present")
        it("should use query if present else form a query based on the name field given")
    })

    describe("#validateUnique()", () => {
        it("should return true only if there was only one document found for the given query")
    })

    describe("#validateId()", () => {
        it("should return 'Invalid Id' if a invalid Mongo Id is passed")
        it("should return document if a document with the given _id exists")
        it("should be able to convert the given id")
    })

    describe("#getForId()", () => {
        it("should return 'Invalid Id' if a invalid Mongo Id is passed")
        it("should return the document if a document is present for the given _id")
    })

    describe("#getMax()", () => {
        it("should find the max value of a field in a collection")
        it("should find the max value within a document array")
    })

    describe("#getNextSeqNo()", () => {
        it("should get Next sequence no for the given collection on the specified key")
        it("should get next sequence no within the given maxValue")
        it("should check for next sequence no from the minValue if the maxValue has been crossed")
        it("should return errMsg if there is no seq no remaining within the maxValue")
        it("should be able to create a next seq no within a doc array")
    })

    describe("#insert()", () => {
        it("should create a new Document")
    })

    describe("#update()", () => {
        it("should validate the given _id in the document")
        it("should update all the specified field for the given document")
        it("should update the utime field on the updated document")
    })

    describe("#getList()", () => {
        it("should fetch all the document in the collection if recordsPerPage is not specified")
        it("should fetch documents for the given query")
        it("should project only the specified fields")
        it("shoud sort the document")
        it("should perform search query on searchField")
        it("should return the required pageNo documents")
    })

    describe("#remove()", () => {
        it("should validate the given id")
        it("should remove the document matching the given id")
        it("should set isDeleted on the document for the given id")
    })

    describe("#copyCollection()", () => {
        it("should copy collection from one db to another")
        it("should use fromCollection name if toCollection name is not specified")
    })

    describe("#sumInStandardSlots()", () => {
        it("should select N Standard slots")
        it("should find sum of data in N standard slots")
    })

    describe("#avgInNSlots()", () => {
        it("should select N slots for the given time range")
        it("should find the average of N slots")
    })

    describe("#firstInNSlots()", () => {
        it("should select N Slots in given time range")
        it("should select first point in each of N time slots")
    })  

    describe("#selectNPoints()", () => {
        it("should select N points in the given time range")
    })
})