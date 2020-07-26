const should = require("should");
const helper = require("node-red-node-test-helper");
const fs = require('fs');
const path = require('path');
helper.init(require.resolve("node-red"));

const node = require("../nodes/nlp_basic");

describe("nlp basic Node", () => {

  before(function(done) {
    helper.startServer(done);
  });

  after((done) => {
    helper.stopServer(done);
  });

  afterEach(() => {
    helper.unload();
  });

  it("should be loaded", (done) => {
    const flow = [{ id: "n1", type: "nlp basic", utterance: "who are you", lang: "en", name: "test" }];
    helper.load(node, flow, () => {
      const n1 = helper.getNode("n1");
      n1.should.have.property("name", "test");
      done();
    });
  });

  it("should make payload", function (done) {
    const flow = [
      { id: "n1", type: "nlp basic", name: "test", utterance: "who are you", lang: "en", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", (msg) => {
        should.equal(msg.payload.utterance, "who are you");
        done();
      });
      let corpus = fs.readFileSync(__dirname + "/corpus-en.json");
      n1.receive({
        corpus: JSON.parse(corpus)
      });
    });
  });

  it("check msg.payload", function (done) {
    const flow = [
      { id: "n1", type: "nlp basic", name: "test", lang: "en", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", (msg) => {
        should.equal(msg.payload.utterance, "who are you");
        done();
      });
      let corpus = fs.readFileSync(__dirname + "/corpus-en.json");
      n1.receive({
        payload: "who are you",
        corpus: JSON.parse(corpus)
      });
    });
  });

  it("no Utterance", function (done) {
    const flow = [
      { id: "n1", type: "nlp basic", name: "test", lang: "en", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n1.on("call:warn", (msg) => {
        should.equal(msg.lastArg, "nlp_basic.warn.noUtterance");
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
      { id: "n1", type: "nlp basic", name: "test", utterance: "who are you", lang: "en", wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(node, flow, () => {
      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n1.on("call:warn", (msg) => {
        should.equal(msg.lastArg, "nlp_basic.warn.noCorpus");
        done();
      });
      n1.receive({ });
    });
  });
});
