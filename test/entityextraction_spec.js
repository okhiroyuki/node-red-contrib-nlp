var should = require("should");
var helper = require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));

var entityextractionNode = require("../nodes/entityextraction");

describe('Entity Extraction Node', function () {

  before(function(done) {
    helper.startServer(done);
  });

  after(function(done) {
    helper.stopServer(done);
  });

  afterEach(function() {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "entityextraction", name: "entityextraction" }];
    helper.load(entityextractionNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'entityextraction');
      done();
    });
  });

  it('should make payload', function (done) {
    var flow = [
      { id: "n1", type: "entityextraction", name: "entityextraction", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(entityextractionNode, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.payload.should.have.size(1);
        msg.payload[0].should.have.property("sourceText", "8.8.8.8");
        msg.payload[0].should.have.property("entity", "ip");
        done();
      });
      n1.receive({ payload: "My ip is 8.8.8.8" });
    });
  });

  it('should make empty payload', function (done) {
    var flow = [
      { id: "n1", type: "entityextraction", name: "entityextraction", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(entityextractionNode, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.payload.should.have.size(0);
        done();
      });
      n1.receive({ payload: "" });
    });
  });
});
