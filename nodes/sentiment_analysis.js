module.exports = function (RED) {
    "use strict";
    const {
        SentimentAnalyzer
    } = require('node-nlp');
    const langs = ["eu", "ca", "en", "es", "nl", "fr", "it", "de", "gl"];

    function SentimentAnalysisNode(n) {
        RED.nodes.createNode(this, n);
        this.lang = n.lang;

        let node = this;

        const checkPayload = (msg) => {
        };

        const getSentiment = (node, msg) => {
            try {
                const sentiment = new SentimentAnalyzer({
                    language: node.lang
                });
                sentiment.getSentiment(node.utterance).then((reuslt) => {
                    msg.payload = result;
                    node.send(msg);
                });
            } catch (e) {
                node.error(e);
            }
        };

        node.on("input", function (msg) {
            if(node.utterance.length === 0 && typeof msg.payload === "string"){
                node.utterance = msg.payload;
            }else{
                node.error(RED._("sentiment_analysis.error.payload"));
                return;
            }
            if (node.lang !== "msg") {
                getSentiment(node, msg);
            }else{
                if (langs.indexOf(msg.lang) !== -1) {
                    node.lang = msg.lang;
                    getSentiment(node, msg);
                } else {
                    node.error(RED._("sentiment_analysis.error.lang"));
                }
            }
        });
    }
    RED.nodes.registerType("sentiment_analysis", SentimentAnalysisNode);
};
