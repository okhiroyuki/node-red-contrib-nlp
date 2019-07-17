const should = require("should");
const helper = require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));

const node = require("../nodes/language_guesser");

describe("Entity Extraction Node", () => {

  before((done) => {
    helper.startServer(done);
  });

  after((done) => {
    helper.stopServer(done);
  });

  afterEach(() => {
    helper.unload();
  });

  it("should be loaded", (done) => {
    const flow = [{ id: "n1", type: "language_guesser", name: "test" }];
    helper.load(node, flow, () => {
      const n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      done();
    });
  });

  it("should make payload", (done) => {
    const flow = [
      { id: "n1", type: "language_guesser", name: "test", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.payload.should.have.property("language", "English");
        done();
      });
      n1.receive({ payload: "When the night has come And the land is dark And the moon is the only light we see" });
    });
  });

  it("should make empty payload", (done) => {
    const flow = [
      { id: "n1", type: "language_guesser", name: "test", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n1.receive({ payload: "" });
      n1.on("call:error", function (msg) {
        done();
      });
    });
  });

  it("should make object payload", (done) => {
    const flow = [
      { id: "n1", type: "language_guesser", name: "test", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n1.receive({ payload: {"test":"test"} });
      n1.on("call:error",(msg) => {
        done();
      });
    });
  });

});
