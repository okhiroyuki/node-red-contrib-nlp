module.exports = function(RED) {
    "use strict";
    const { Language } = require("node-nlp");
    const language = new Language();

    function LanguageGuesserNode(n) {
        RED.nodes.createNode(this,n);
        let node = this;

        node.on("input", function(msg) {
            if(typeof msg.payload === "string" && msg.payload.length > 0){
                try{
                    const guess = language.guess(msg.payload);
                    msg.payload = guess[0];
                    node.send(msg);
                }catch(e){
                    node.error(e);
                }
            }else{
                node.error("error msg.payload");
            }
        });
    }
    RED.nodes.registerType("language_guesser", LanguageGuesserNode);
};
