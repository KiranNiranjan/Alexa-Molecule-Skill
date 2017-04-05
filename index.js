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

var MOLECULE_ALEXA_STATE = {
    START: "STARTMODE",
    HELP: "HELPMODE"
};

var languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",
            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s."
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startMoleculeHandlers);
    alexa.execute();
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.START;
        this.emitWithState("GetMolecules", this.event.request.intent.slots);
    },
    "GetMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.START;
        this.emitWithState("GetMolecules", this.event.request.intent.slots);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.START;
        this.emitWithState("GetMolecules", true);
    },
    "AMAZON.HelpIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.HELP;
        this.emitWithState("helpIntent", true);
    },
    "Unhandled": function () {
        var speechOutput = this.t("START_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    }
};

var startMoleculeHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.START, {

    "GetMolecules": function (slots) {
        var moleculeName = slots.MoleculeName.value;
        var moleculeData = [];
        var _this = this;
        var speechOutput;

        data.httpGet(moleculeName, function (result) {

            moleculeData = result.data;

            var dataIndex = _.findIndex(moleculeData, function (mol) {
                return mol.IUPACName.toLowerCase() == moleculeName.toLowerCase();
            });

            if (dataIndex != -1) {
                if (slots.Properties && slots.Properties.value) {
                    var propertiesIndex = _.findIndex(moleculeData[dataIndex].properties, function (prop) {
                        return prop.valueTitle.toLowerCase() == slots.Properties.value.toLowerCase();
                    });

                    var proObj = moleculeData[dataIndex].properties[propertiesIndex];
                    speechOutput += _this.t("PROPERTIES", proObj.valueTitle, moleculeName, proObj.valueData);

                    if (propertiesIndex == -1) {
                        speechOutput += _this.t("PROPERTIES_ERROR_MESSAGE", slots.Properties.value, moleculeName);
                    }

                }

                if (slots.ChemicalFormula && slots.ChemicalFormula.value) {

                    var cheObj = moleculeData[dataIndex].chemicalFormula;
                    speechOutput += _this.t("CHEMICAL_FORMULA", slots.ChemicalFormula.value, moleculeName, cheObj);

                }

            } else {
                speechOutput += _this.t("MOLECULE_ERROR_MESSAGE", moleculeName);
            }

            if (speechOutput) {
                _this.emit(":tell", speechOutput);
            } else {
                _this.emit(":tell", _this.t("WELCOME_MESSAGE"));
            }

        });
    }
});

