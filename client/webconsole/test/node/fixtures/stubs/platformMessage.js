/* Any copyright is dedicated to the Public Domain.
  http://creativecommons.org/publicdomain/zero/1.0/ */
/* eslint-disable max-len */

"use strict";

/*
 * THIS FILE IS AUTOGENERATED. DO NOT MODIFY BY HAND. SEE devtools/client/webconsole/test/README.md.
 */

const {
  parsePacketsWithFronts,
} = require("chrome://mochitests/content/browser/devtools/client/webconsole/test/browser/stub-generator-helpers");
const { prepareMessage } = require("devtools/client/webconsole/utils/messages");
const {
  ConsoleMessage,
  NetworkEventMessage,
} = require("devtools/client/webconsole/types");

const rawPackets = new Map();
rawPackets.set(`platform-simple-message`, {
  "message": "foobar test",
  "timeStamp": 1572867483805,
  "resourceType": "platform-message",
  "isAlreadyExistingResource": false
});

rawPackets.set(`platform-longString-message`, {
  "message": {
    "type": "longString",
    "actor": "server0.conn5.longstractor29",
    "length": 20002,
    "initial": "a\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  },
  "timeStamp": 1572867483805,
  "resourceType": "platform-message",
  "isAlreadyExistingResource": false
});


const stubPackets = parsePacketsWithFronts(rawPackets);

const stubPreparedMessages = new Map();
for (const [key, packet] of Array.from(stubPackets.entries())) {
  const transformedPacket = prepareMessage(packet, {
    getNextId: () => "1",
  });
  const message = ConsoleMessage(transformedPacket);
  stubPreparedMessages.set(key, message);
}

module.exports = {
  rawPackets,
  stubPreparedMessages,
  stubPackets,
};
