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
    QUIZ: "QUIZ_MODE",
    HELP: "HELP_MODE"
};

var speechOutput = "";
var question = "";

var languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or  What is the chemical formula of carbon dioxide",

            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",
            "SOLUBILITY_NOT_FOUND": "I don't think %s soluble in %s. But %s is soluble in %s",
            "SOLUBLE_MESSAGE": "Yes, %s is soluble in %s",

            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",

            "EXAMPLE": "%s",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day",
            "START_QUIZ_MESSAGE": "OK. I will ask you 10 questions about Molecules."
        }
    },
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or  What is the chemical formula of carbon dioxide",
            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",
            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day",
            "START_QUIZ_MESSAGE": "OK. I will ask you 10 questions about Molecules."
        }
    },
    "en-GB": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or  What is the chemical formula of carbon dioxide",
            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",
            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day",
            "START_QUIZ_MESSAGE": "OK. I will ask you 10 questions about Molecules."
        }
    },
    "de-DE": {
        "translation": {
            "WELCOME_MESSAGE": "Willkommen bei Molecule! Du kannst mich nach irgendwelchen Molekülen fragen",
            "HELP_MESSAGE": "Versuchen Sie, etwas zu sagen, Siedepunkt von Methane oder Was ist die chemische Formel von carbon dioxide",
            "PROPERTIES": "%s von %s Ist %s",
            "CHEMICAL_FORMULA": "%s zum %s Ist %s",
            "MOLECULE_ERROR_MESSAGE": "Ich habe keine Informationen für %s.",
            "PROPERTIES_ERROR_MESSAGE": "Ich habe keine Informationen über %s von %s.",
            "NOTHING_FOUND": "Es tut uns leid! Ich habe das nicht gefangen. Bitte versuche es erneut",
            "GOOD_BYE": "Auf Wiedersehen! Einen schönen Tag noch",
            "START_QUIZ_MESSAGE": "OK. Ich werde euch 10 Fragen über Molecules stellen."
        }
    }
};

var molecules = [
    "Nitrogen",
    "CarbonMonoxide",
    "Carbon dioxide",
    "Cyanide",
    "Hydrogen Cyanide",
    "Cyanogen",
    "Nitrous oxide",
    "Nitrate",
    "Nitrogen monohydride",
    "Ammonia",
    "Formic acid",
    "Cyanamide",
    "Isocyanic acid",
    "Hydrazine ",
    "Hydrazoic acid",
    "Nitric acid",
    "Nitrous acid",
    "Ozone",
    "Oxygen",
    "Carbonic acid ",
    "Peroxynitric acid",
    "Fluorine",
    "Hydrogen fluoride",
    "Hypofluorous acid",
    "Ammonium bifluoride",
    "Carbonyl fluoride",
    "Tetrafluoromethane",
    "Fluoroform",
    "Difluoromethane",
    "tetrafluoroethylene",
    "Fluorine azide",
    "Fluorine nitrate",
    "Nitrogen trifluoride",
    "Nitrosyl fluoride",
    "Nitryl fluoride",
    "Dinitrogen difluoride",
    "Tetrafluorohydrazine",
    "Ammonium fluoride",
    "Oxygen difluoride"
];

var properties = [
    "Molar mass",
    "Boiling point",
    "Melting point",
    "Autoignition temperature",
    "Odor",
    "Solubility",
    "Density",
    "Phase",
    "Triple point",
    "Critical point",
    "Atomic number",
    "Atomic mass",
    "Smell"
];

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startMoleculeHandlers, questionMoleculeHandlers, quizMoleculeHandlers);
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
    "SolubilityIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetSoluble", this.event.request.intent.slots);
    },
    "QuizMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("StartQuiz");
    },
    "ExampleMoleculeIntent": function () {
        // TODO: Examples
        this.emitWithState("GetMoleculesExamples");
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
    "SolubilityIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetSoluble", this.event.request.intent.slots);
    },
    "QuizMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("StartQuiz");
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

var quizMoleculeHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.QUIZ, {

    "StartQuiz": function () {
        this.attributes["response"] = "";
        this.attributes["quizCounter"] = 0;
        this.attributes["quizScore"] = 0;
        this.emitWithState("AskQuestion");
        question = ""
    },

    "AskQuestion": function () {
        var _this = this;

        if (this.attributes["quizCounter"] == 0) {
            this.attributes["response"] = _this.t("START_QUIZ_MESSAGE")
        }

        var moleculesIndex = _.random(0, molecules.length - 1);
        var propertyIndex = _.random(0, properties.length - 1);

        var molecule = molecules[moleculesIndex];
        var property = properties[propertyIndex];

        this.attributes["quizQuestion"] = molecule;
        this.attributes["property"] = property;
        this.attributes["quizCounter"]++;

        question += Helpers.generateQuestion(this.attributes["quizCounter"], property, molecule);

        this.emit(":ask", question, question);
    },

    "AnswerIntent": function () {
        this.emit(":tell", question);
    },

    "AMAZON.HelpIntent": function () {
        this.emit(":ask", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("GOOD_BYE"));
    },
    'AMAZON.RepeatIntent': function () {
        if (!question) question = this.t("HELP_MESSAGE");
        this.emit(':ask', question, this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        this.emitWithState("AnswerIntent");
    }


});

var questionMoleculeHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.QUESTION, {

    /**
     * Method to process Molecule Question Intent
     */

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

    /**
     * Method to process Solubility Intent
     */

    "GetSoluble": function (slots) {
        var moleculeName = slots.MoleculeName.value;
        var secondMoleculeName = slots.SecondMoleculeName.value;
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
                 * Handle Solubility request
                 * **/
                if (slots.Properties && slots.Properties.value) {
                    var propertiesIndex = _.findIndex(moleculeData[dataIndex].properties, function (prop) {
                        return prop.valueTitle.toLowerCase() == "solubility";
                    });

                    if (propertiesIndex == -1) {
                        speechOutput += _this.t("PROPERTIES_ERROR_MESSAGE", "solubility", moleculeName);
                    } else {
                        var property = moleculeData[dataIndex].properties[propertiesIndex];
                        var solubilityList = property.valueData.split(', ');

                        var solubleIndex = _.indexOf(solubilityList, secondMoleculeName);

                        if (solubleIndex == -1) {

                            if (_.includes(property.valueData, secondMoleculeName)) {
                                speechOutput += _this.t("SOLUBLE_MESSAGE", moleculeName, secondMoleculeName);
                            } else {
                                speechOutput += _this.t("SOLUBILITY_NOT_FOUND", moleculeName, secondMoleculeName, property.valueData.toString());
                            }

                        } else {
                            speechOutput += _this.t("SOLUBLE_MESSAGE", moleculeName, secondMoleculeName);
                        }
                    }

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

