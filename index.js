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

var Data = require('./data'),
    Helpers = require('./helpers/helpers');

var MOLECULE_ALEXA_STATE = {
    START: "START_MODE",
    QUESTION: "QUESTION_MODE",
    HELP: "HELP_MODE"
};

var speechOutput = "";

var languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or What is the chemical formula of carbon dioxide",
            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",
            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day"
        }
    },
    "en-GB": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or What is the chemical formula of carbon dioxide",
            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",
            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day"
        }
    },
    "de": {
        "translation": {
            "WELCOME_MESSAGE": "Welkom bij Molecule! Je kunt me vragen naar Molecules",
            "HELP_MESSAGE": "Probeer te zeggen wat zoiets, kookpunt van methane of Wat is de chemische formule van carbon dioxide",
            "PROPERTIES": "%s van %s is %s",
            "CHEMICAL_FORMULA": "%s voor %s is %s",
            "MOLECULE_ERROR_MESSAGE": "Ik heb geen informatie over hebben %s.",
            "PROPERTIES_ERROR_MESSAGE": "Ik heb geen informatie over hebben %s van %s.",
            "NOTHING_FOUND": "Sorry! Ik heb niet verstaan. Probeer het opnieuw",
            "GOOD_BYE": "Vaarwel! Fijne dag"
        }
    }

};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startMoleculeHandlers, questionMoleculeHandlers);
    alexa.execute();
};

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.START;
        this.emitWithState("StartMolecules");
    },
    "StartMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.START;
        this.emitWithState("StartMolecules");
    },
    "GetMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetMolecules", this.event.request.intent.slots);
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":ask", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("GOOD_BYE"));
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("NOTHING_FOUND");
        this.emit(":ask", speechOutput, speechOutput);
    }
};

var startMoleculeHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.START, {
    "StartMolecules": function () {
        this.emit(":ask", this.t("WELCOME_MESSAGE") + ' ' + this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    "GetMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetMolecules", this.event.request.intent.slots);
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":ask", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("GOOD_BYE"));
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("NOTHING_FOUND");
        this.emit(":ask", speechOutput, speechOutput);
    }
});

var questionMoleculeHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.QUESTION, {

    "GetMolecules": function (slots) {
        var moleculeName = slots.MoleculeName.value;
        var moleculeData = [];
        var _this = this;

        Data.httpGet(moleculeName, function (result) {

            moleculeData = result.data;

            var dataIndex = _.findIndex(moleculeData, function (mol) {
                return mol.IUPACName.toLowerCase() == moleculeName.toLowerCase();
            });

            /**
             * Handle molecule request
             * **/
            if (dataIndex != -1) {

                /**
                 * Handle properties request
                 * **/
                if (slots.Properties && slots.Properties.value) {
                    var propertiesIndex = _.findIndex(moleculeData[dataIndex].properties, function (prop) {
                        return prop.valueTitle.toLowerCase() == slots.Properties.value.toLowerCase();
                    });

                    if (propertiesIndex == -1) {
                        speechOutput += _this.t("PROPERTIES_ERROR_MESSAGE", slots.Properties.value, moleculeName);
                    } else {
                        var properties = moleculeData[dataIndex].properties[propertiesIndex];
                        if (properties.valueTitle == "Density" || properties.valueTitle == "Molar mass") properties.valueData = exports.unitsToReadable(properties.valueData);
                        speechOutput += _this.t("PROPERTIES", properties.valueTitle, moleculeName, properties.valueData);
                    }

                }

                /**
                 * Handle chemical formula request
                 * **/
                if (slots.ChemicalFormula && slots.ChemicalFormula.value) {
                    var chemicalFormulaLong = moleculeData[dataIndex].chemicalFormulaLong;
                    var chemicalFormulaForSpeech = Helpers.chemicalFormulaToReadable(chemicalFormulaLong);
                    speechOutput += _this.t("CHEMICAL_FORMULA", slots.ChemicalFormula.value, moleculeName, chemicalFormulaForSpeech);
                }

                /**
                 * Handle speech is undefined
                 * **/
                if (!speechOutput) {
                    speechOutput += _this.t("NOTHING_FOUND");
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
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":ask", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("GOOD_BYE"));
    },
    'AMAZON.RepeatIntent': function () {
        if (!speechOutput) speechOutput = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("NOTHING_FOUND");
        this.emit(":ask", speechOutput, speechOutput);
    }
});

