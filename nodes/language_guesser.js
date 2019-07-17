module.exports = function(RED) {
    "use strict";
    const { Language } = require("node-nlp");
    const language = new Language();

    function LanguageGuesserNode(n) {
        RED.nodes.createNode(this,n);
        let node = this;

        node.on("input", function(msg) {
            try{
                const guess = language.guess(msg.payload);
                msg.payload = guess[0];
                node.send(msg);
            }catch(e){
                node.error(e);
            }
        });
    }
    RED.nodes.registerType("language_guesser", LanguageGuesserNode);
};
