module.exports = function(RED) {
    "use strict";
    const { NerManager } = require('node-nlp');
    let manager;

    function EntityExtractionNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.on("input", function(msg) {
            run(node, msg);
        });
    }
    RED.nodes.registerType("entityextraction", EntityExtractionNode);

    const run = async (node, msg) => {
        try{
            const _threshold = msg.threshold || 0.8;
            manager = new NerManager({ threshold: _threshold });
            const result = await manager.findEntities(msg.payload);
            msg.payload = result;
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };
};
