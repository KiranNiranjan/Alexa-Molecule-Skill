/**
 Copyright 2017 KiKe. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 **/
'use strict';
var Alexa = require('alexa-sdk');
var _ = require('lodash');
var data = require('./data');

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var WELCOME_MESSAGE = "Welcome to Molecule! You can ask me about any Molecules";

var handlers = {

    'LaunchRequest': function () {
        this.emit('GetMolecule');
    },
    'GetMoleculeIntent': function () {
        this.emit('GetMolecule');
    },

    'GetMolecule': function () {
        var moleculeName;
        var moleculeIndex = _.findIndex(this.event.request.intent.slots, {name: 'MoleculeName'});

        if (moleculeIndex != -1) {
            moleculeName = this.event.request.intent.slots[moleculeIndex].type;
        }

        var dataIndex = _.findIndex(data.MOLUCULE_LIST, {IUPACName: moleculeName});

        this.emit(':tell', WELCOME_MESSAGE + data.MOLUCULE_LIST[dataIndex].name);

    },

    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }
};