# node-red-contrib-nlp

Node-RED for [NLP.js](https://github.com/axa-group/nlp.js)

 [![Build Status](https://travis-ci.org/okhiroyuki/node-red-contrib-nlp.svg?branch=master)](https://travis-ci.org/okhiroyuki/node-red-contrib-nlp) [![Coverage Status](https://coveralls.io/repos/github/okhiroyuki/node-red-contrib-nlp/badge.svg)](https://coveralls.io/github/okhiroyuki/node-red-contrib-nlp)

# Nodes
- [NLP Maneger](https://github.com/axa-group/nlp.js/blob/master/docs/nlp-manager.md)
- [Brain NLU](https://github.com/axa-group/nlp.js/blob/master/docs/brain-nlu.md)
- [Entity Extraction](https://github.com/axa-group/nlp.js/blob/master/docs/builtin-entity-extraction.md)

# Example of use

```
[{"id":"fda2f3eb.856c6","type":"function","z":"57bdbc17.f41374","name":"","func":"msg.documents =[\n    {\n        \"locale\": \"ja\",\n        \"utterance\":\"あなたを教えて\",\n        \"intent\": \"agent.acquaintance\"}\n    ];\nmsg.answers = [\n    {\n        \"locale\": \"ja\",\n        \"intent\": \"agent.acquaintance\",\n        \"answer\": \"私はバーチャルエージェントです\"\n    }\n    ];\nmsg.locales = [\"ja\"];\nmsg.payload ={\n    \"locale\": \"ja\",\n    // \"utterance\": \"あなたを教えて\"\n}\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":100,"wires":[["3468b289.c3203e"]]},{"id":"6d3877e4.b79c68","type":"inject","z":"57bdbc17.f41374","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":200,"y":60,"wires":[["fda2f3eb.856c6"]]},{"id":"1d2b391c.46bf47","type":"debug","z":"57bdbc17.f41374","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":650,"y":100,"wires":[]},{"id":"3468b289.c3203e","type":"nlpmanager","z":"57bdbc17.f41374","name":"","x":520,"y":60,"wires":[["1d2b391c.46bf47"]]},{"id":"a901b396.da124","type":"brainnlu","z":"57bdbc17.f41374","name":"","x":510,"y":200,"wires":[["e5707bbe.9c0678"]]},{"id":"a18aef34.6369c","type":"function","z":"57bdbc17.f41374","name":"","func":"msg.documents =[\n    {\n        \"utterance\":\"Bonjour\",\n        \"intent\":\"greet\"\n    },\n    {\n        \"utterance\":\"bonne nuit\",\n        \"intent\":\"greet\"\n    },\n    {\n        \"utterance\":\"Bonsoir\",\n        \"intent\":\"greet\"\n    },\n    {\n        \"utterance\":\"J'ai perdu mes clés\",\n        \"intent\": \"keys\"\n    },\n    {\n        \"utterance\":\"Je ne trouve pas mes clés\",\n        \"intent\": \"keys\"\n    },\n    {\n        \"utterance\":\"Je ne me souviens pas où sont mes clés\",\n        \"intent\": \"keys\"\n    }\n    ];\nmsg.payload = \"où sont mes clés\";\nreturn msg;","outputs":1,"noerr":0,"x":330,"y":260,"wires":[["a901b396.da124"]]},{"id":"d7753ad5.a50758","type":"inject","z":"57bdbc17.f41374","name":"Inject","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":190,"y":200,"wires":[["a18aef34.6369c"]]},{"id":"e5707bbe.9c0678","type":"debug","z":"57bdbc17.f41374","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":680,"y":240,"wires":[]}]
```
