module.exports = function(RED) {
    "use strict";
    const { BrainNLU } = require("node-nlp");
    let classifier;

    const setDocuments = (msg) => {
        try{
            let documents = msg.documents;
            if(documents === undefined){
                throw new Error("msg.documents is undefined");
            }else{
                for(let i = 0; i< documents.length; i++){
                    classifier.add(
                        documents[i].utterance,
                        documents[i].intent
                    );
                }
            }
        }catch(err){
            throw new Error(err);
        }
    };

    const run = async (node, msg) => {
        try{
            classifier = new BrainNLU({ "languages": msg.locale });
            setDocuments(msg);
            await classifier.train();
            msg.payload = await classifier.getClassifications(msg.payload);
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };

    function BrainNLUNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.on("input", function(msg) {
            run(node, msg);
        });
    }
    RED.nodes.registerType("brain_nlu",BrainNLUNode);
};
