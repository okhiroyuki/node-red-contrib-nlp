const should = require("should");
const helper = require("node-red-node-test-helper");
const fs = require('fs');
helper.init(require.resolve("node-red"));

const node = require("../nodes/nlp");

describe("nlp Node", () => {

  before(function(done) {
    helper.startServer(done);
  });

  after((done) => {
    helper.stopServer(done);
  });

  afterEach(() => {
    helper.unload();
  });

  it("should be loaded (nlp)", (done) => {
    const flow = [{ id: "n1", type: "nlp", utterance: "who are you", lang: "en", name: "test" }];
    helper.load(node, flow, () => {
      const n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      done();
    });
  });

  it("should be loaded (nlp train)", (done) => {
    const flow = [{ id: "n1", type: "nlp train", lang: "en", name: "test" }];
    helper.load(node, flow, () => {
      const n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      done();
    });
  });

  it("should make payload", function (done) {
    const flow = [
      { id: "n1", type: "nlp train", name: "test", wires:[["n2"]] },
      { id: "n2", type: "nlp", name: "test", utterance: "who are you", lang: "en", wires:[["n3"]] },
      { id: "n3", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n3 = helper.getNode("n3");
      const n1 = helper.getNode("n1");
      n3.on("input", (msg) => {
        should.equal(msg.payload.utterance, "who are you");
        done();
      })
      let corpus = fs.readFileSync(__dirname + "/corpus-en.json");
      n1.receive({
        payload: JSON.parse(corpus)
      });
    });
  });

  it("check msg.payload", function (done) {
    const flow = [
      { id: "n1", type: "nlp", name: "test", utterance: "", lang: "en", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", (msg) => {
        should.equal(msg.payload.utterance, "who are you");
        done();
      });
      n1.receive({
        payload: "who are you"
      });
    });
  });

  it("no Utterance", function (done) {
    const flow = [
      { id: "n1", type: "nlp", name: "test", lang: "en", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n1 = helper.getNode("n1");
      n1.on("call:warn", (msg) => {
        should.equal(msg.lastArg, "nlp.warn.noUtterance");
        done();
      });
      let corpus = fs.readFileSync(__dirname + "/corpus-en.json");
      n1.receive({
        corpus: JSON.parse(corpus)
      });
    });
  });

  it("no corpus", function (done) {
    const flow = [
      { id: "n1", type: "nlp train", name: "test", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n1.on("call:warn", (msg) => {
        should.equal(msg.lastArg, "nlp.warn.noCorpus");
        done();
      });
      n1.receive({ });
    });
  });
});
