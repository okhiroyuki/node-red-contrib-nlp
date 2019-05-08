# node-red-contrib-nlp

Node-RED for [NLP.js](https://github.com/axa-group/nlp.js)

# Nodes
- [NLP Maneger](https://github.com/axa-group/nlp.js/blob/master/docs/nlp-manager.md)

# Example of use

```
[{"id":"8bd74c14.d58a4","type":"function","z":"10d190b9.b5a0ef","name":"","func":"msg.documents =[\n    {\n        \"locale\": \"ja\",\n        \"utterance\":\"あなたを教えて\",\n        \"intent\": \"agent.acquaintance\"}\n    ];\nmsg.answers = [\n    {\n        \"locale\": \"ja\",\n        \"intent\": \"agent.acquaintance\",\n        \"answer\": \"私はバーチャルエージェントです\"\n    }\n    ];\nmsg.locales = [\"ja\"];\nmsg.payload ={\n    \"locale\": \"ja\",\n    \"utterance\": \"あなたを教えて\"\n}\nreturn msg;","outputs":1,"noerr":0,"x":320,"y":360,"wires":[["49f1ff88.7dc2b"]]},{"id":"9c2aab73.c31d78","type":"inject","z":"10d190b9.b5a0ef","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":180,"y":280,"wires":[["8bd74c14.d58a4"]]},{"id":"70230ad3.afc6e4","type":"debug","z":"10d190b9.b5a0ef","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":670,"y":180,"wires":[]},{"id":"49f1ff88.7dc2b","type":"nlpmanager","z":"10d190b9.b5a0ef","name":"","x":500,"y":320,"wires":[["70230ad3.afc6e4"]]}]
```
