module.exports = function(RED) {
    "use strict";
    const fs = require('fs');
    const tmp = require('tmp');
    const path = require('path');
    const { dockStart } = require('@nlpjs/basic');

    function getFile(data){
        let tmpDir = tmp.dirSync({
            unsafeCleanup: true
        });
        let filepath = tmpDir.name + "/" + path.basename(tmpDir.name) + ".tsv";
        fs.writeFileSync(filepath, data);
        return filepath;
    }

    const runTrain = async (node, msg) => {
        try{
            const dock = await dockStart({ use: ['Basic', 'Qna' , "LangJa"] });
            const nlp = dock.get('nlp');
            await nlp.addCorpus({ filename: getFile(msg.payload), importer: 'qna', locale: node.lang});
            await nlp.train();
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };

    function getUtterance(node, msg){
        if(!hasString(node.utterance) && hasString(msg.payload)){
            return msg.payload;
        }else{
            return node.utterance;
        }
    }

    function isEmptyUtterance(node, msg){
        return !hasString(node.utterance) && !hasString(msg.payload);
    }

    const run = async (node, msg) => {
        try{
            const dock = await dockStart({ use: ['Basic', 'Qna', "LangJa"] });
            const nlp = dock.get('nlp');
            const response = await nlp.process(node.lang, getUtterance(node,msg));
            msg.payload = response;
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };

    function hasString(value){
        return value && typeof value === "string" && value.length > 0;
    }

    function hasPayload(value){
        return value && (typeof value === "string" || typeof value === "object");
    }

    function NlpBasicNode(n) {
        RED.nodes.createNode(this,n);
        this.utterance = n.utterance;
        this.lang = n.lang;
        let node = this;

        node.on("input", function(msg) {
            if(isEmptyUtterance(node, msg)){
                node.warn(RED._("nlp.warn.noUtterance"));
            }else{
                run(node,msg);
            }
        });
    }
    RED.nodes.registerType("nlp",NlpBasicNode);

    function NlpTrainNode(n) {
        RED.nodes.createNode(this,n);
        this.lang = n.lang;
        if(!this.lang){
            this.lang = "en";
        }
        let node = this;

        node.on("input", function(msg) {
            if(hasPayload(msg.payload)){
                runTrain(node, msg);
            }else{
                node.warn(RED._("nlp.warn.noCorpus"));
            }
        });
    }
    RED.nodes.registerType("nlp train",NlpTrainNode);
};
