module.exports = function(RED) {
    "use strict";
    const { NerManager } = require('node-nlp');
    let manager;

    function BuildinEntityExtractionNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.on("input", function(msg) {
            run(node, msg);
        });
    }
    RED.nodes.registerType("buildin_entity_extraction", BuildinEntityExtractionNode);

    const run = async (node, msg) => {
        try{
            manager = new NerManager({ threshold: 0.8 });
            const result = await manager.findEntities(msg.payload);
            msg.payload = result;
            node.send(msg);
        }catch(err){
            node.error(err.message);
        }
    };
};
