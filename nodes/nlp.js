module.exports = function(RED) {
    "use strict";
    const fs = require('fs');
    const tmp = require('tmp');
    const path = require('path');
    const { dockStart } = require('@nlpjs/basic');

    function getJsonFile(data){
        let tmpDir = tmp.dirSync({
            unsafeCleanup: true
        });
        let filepath = tmpDir.name + "/" + path.basename(tmpDir.name) + ".json";
        fs.writeFileSync(filepath, JSON.stringify(data));
        return filepath;
    }

    const runTrain = async (node, msg) => {
        try{
            const dock = await dockStart({ use: ['Basic']});
            const nlp = dock.get('nlp');
            await nlp.addCorpus(getJsonFile(msg.payload));
            await nlp.train();
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };

    const run = async (node, msg) => {
        try{
            const dock = await dockStart({ use: ['Basic']});
            const nlp = dock.get('nlp');
            const response = await nlp.process(node.lang, node.utterance);
            msg.payload = response;
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };

    function hasString(value){
        return value && typeof value === "string" && value.length > 0;
    }

    function hasObject(value){
        return value && typeof value === "object";
    }

    function NlpBasicNode(n) {
        RED.nodes.createNode(this,n);
        this.utterance = n.utterance;
        this.lang = n.lang;
        let node = this;

        node.on("input", function(msg) {
            if(!hasString(node.utterance)){
                if(hasString(msg.payload)){
                    node.utterance = msg.payload;
                }else{
                    node.warn(RED._("nlp.warn.noUtterance"));
                    return;
                }
            }
            run(node, msg);
        });
    }
    RED.nodes.registerType("nlp",NlpBasicNode);

    function NlpTrainNode(n) {
        RED.nodes.createNode(this,n);
        let node = this;

        node.on("input", function(msg) {
            if(hasObject(msg.payload)){
                runTrain(node, msg);
            }else{
                node.warn(RED._("nlp.warn.noCorpus"));
            }
        });
    }
    RED.nodes.registerType("nlp train",NlpTrainNode);
};
