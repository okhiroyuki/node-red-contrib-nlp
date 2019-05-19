module.exports = function(RED) {
    "use strict";
    const {NlpManager} = require("node-nlp");
    let manager;

    function NlpManagerNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.on("input", function(msg) {
            run(node, msg);
        });
    }
    RED.nodes.registerType("nlpmanager",NlpManagerNode);

    const run = async (node, msg) => {
        try{
            manager = new NlpManager({ "languages": msg.locales });
            setAssetDomeins(msg);
            setDocuments(msg);
            console.log("Training, please wait..");
            await manager.train();
            console.log("Trained!");
            setAnswers(msg);
            console.log("run process");
            msg.payload = await manager.process(
                msg.payload.locale, msg.payload.utterance);
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };

    const setAssetDomeins = (msg) => {
        console.log("setAssetDomeins");
        try{
            let assetDomeins = msg.assetDomains;
            if(assetDomeins !== undefined){
                for(let i=0;i<assetDomeins.length; i++){
                    manager.assignDomain(
                        documents[i].locale,
                        documents[i].intent,
                        documents[i].domain
                    );
                }
            }
        }catch(err){
            throw new Error(err);
        }
    };

    const setDocuments = (msg) => {
        console.log("setDocumetns");
        try{
            let documents = msg.documents;
            if(documents === undefined){
                throw new Error("msg.documents is undefined");
            }else{
                for(let i = 0; i< documents.length; i++){
                    manager.addDocument(
                        documents[i].locale,
                        documents[i].utterance,
                        documents[i].intent
                    );
                }
            }
        }catch(err){
            throw new Error(err);
        }
    };

    const setAnswers = (msg) => {
        console.log("add Answers");
        try{
            let answers = msg.answers;
            if(answers === undefined){
                throw new Error("msg.answers is undefined");
            }else{
                for(let i = 0; i< answers.length; i++){
                    manager.addAnswer(
                        answers[i].locale,
                        answers[i].intent,
                        answers[i].answer
                    );
                }
            }
    }catch(err){
            throw new Error(err);
        }
    };
};
