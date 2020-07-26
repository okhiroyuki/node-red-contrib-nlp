module.exports = function(RED) {
    "use strict";
    const fs = require('fs');
    const tmp = require('tmp');
    const path = require('path');
    const { dockStart } = require('@nlpjs/basic');

    function getJsonFile(msg){
        let tmpDir = tmp.dirSync({
            unsafeCleanup: true
        });
        let filepath = tmpDir.name + "/" + path.basename(tmpDir.name) + ".json";
        fs.writeFileSync(filepath, JSON.stringify(msg.corpus));
        return filepath;
    }

    const run = async (node, msg) => {
        try{
            const dock = await dockStart({ use: ['Basic']});
            const nlp = dock.get('nlp');
            await nlp.addCorpus(getJsonFile(msg));
            await nlp.train();
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
                    node.warn(RED._("nlp_basic.warn.noUtterance"));
                    return;
                }
            }
            if(hasObject(msg.corpus)){
                run(node, msg);
            }else{
                node.warn(RED._("nlp_basic.warn.noCorpus"));
            }
        });
    }
    RED.nodes.registerType("nlp basic",NlpBasicNode);
};
