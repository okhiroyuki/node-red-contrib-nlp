# node-red-contrib-nlp

Node-RED for [NLP.js](https://github.com/axa-group/nlp.js)

## Nodes

Support for Nlp.js v4.

- [nlp](https://github.com/axa-group/nlp.js/blob/master/docs/v4/quickstart.md)

## Install

Run the following command in your Node-RED user directory - typically ~/.node-red

```bash
npm install node-red-contrib-nlp
```

## Usages

1. Add [node-red-contrib-browser-utils](https://flows.nodered.org/node/node-red-contrib-browser-utils).
2. Download [sample qna.tsv](https://raw.githubusercontent.com/jesus-seijas-sp/nlpjs-examples/master/03.qna/01.filecorpus/qna.tsv) locally.
3. Import [qna_basic](https://github.com/okhiroyuki/node-red-contrib-nlp/tree/master/examples).
4. Deploy.
5. Execute fileinject node.
6. Select qna.tsv.
