module.exports = function(RED) {
    "use strict";
    const {NlpManager} = require("node-nlp");

    function NlpNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.on("input", function(msg) {
            try{
                setDocuments(node, msg);
            }catch(err){
                node.error(err.message);
            }
        });
    }
    RED.nodes.registerType("nlp",NlpNode);

    const setDocuments = async (node, msg) => {
        const manager = new NlpManager({ "languages": msg.locales });
        let documents = msg.documents;
        for(let i = 0; i< documents.length; i++){
            manager.addDocument(
                documents[i].locale,
                documents[i].utterance,
                documents[i].intent
            );
        }
        console.log("Training, please wait..");
        await manager.train();
        console.log("Trained!");
        let answers = msg.answers;
        for(let i = 0; i< answers.length; i++){
            manager.addAnswer(
                answers[i].locale,
                answers[i].intent,
                answers[i].answer
            );
        }
        console.log("add Answers");
        console.log("run process");
        msg.payload = await manager.process(
            msg.payload.locale, msg.payload.utterance);
        node.send(msg);
    };

    // function setAnswers(msg){
    // }

    // function runProcess(node, msg){
    //     console.log("run process");
    //     msg.payload = await manager.process(
    //         msg.payload.locale, msg.payload.utterance);
    //     node.send(msg);
    // }
};
