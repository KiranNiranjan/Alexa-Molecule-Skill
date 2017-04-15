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
    EXAMPLE: "EXAMPLE_MODE",
    QUIZ: "QUIZ_MODE",
    HELP: "HELP_MODE"
};

var repeatSpeechOut = "";

var chemicalFormula = [
    "O",
    "N",
    "CO",
    "CO2",
    "CN",
    "HCN",
    "C2N2",
    "N2O",
    "NO3",
    "NH",
    "NH3",
    "HCOOH",
    "CN2H2",
    "HNCO",
    "N2H4",
    "HN3",
    "HNO3",
    "HNO2",
    "O3",
    "O2",
    "H2CO3",
    "HNO4",
    "F",
    "HF",
    "HFO",
    "F2H5N",
    "COF2",
    "CF4",
    "CHF3",
    "CH2F2",
    "C2F4",
    "FN3",
    "FNO3",
    "NF3",
    "NFO",
    "NO2F",
    "N2F2",
    "N2F4",
    "NH4F",
    "OF2",
    "O2F2",
    "CH3NO",
    "CH4",
    "C2H6",
    "S",
    "HSO3",
    "HSO4",
    "H2S",
    "H2SO3",
    "H2SO4",
    "H2S2O2",
    "H2S2O3",
    "H2S2O4",
    "H2S2O5",
    "H2S2O6",
    "H2S2O7",
    "H2S2O8",
    "C6H6",
    "OH",
    "SO",
    "SO2",
    "SO3",
    "SO4",
    "S2O",
    "S2O2",
    "S2O4",
    "NH4HS",
    "(NH4)2SO4",
    "N2H2",
    "N2O3",
    "N2O4",
    "S2N2",
    "C3H8",
    "C4H10",
    "C5H12",
    "C6H14",
    "C7H16",
    "C8H18",
    "C9H20",
    "C10H22",
    "S4N4",
    "NSF",
    "NSF3",
    "SOF4",
    "SOF2",
    "SO2F2",
    "SF6",
    "SF3",
    "SF4",
    "S2F2",
    "SF2",
    "S2F10",
    "SCN",
    "Na",
    "CH3COONa",
    "CH3ONa",
    "C2H5ONa",
    "C6H6N2O",
    "NaF",
    "NaCN",
    "NaH",
    "HCOONa",
    "NaHCO3",
    "NaHSO3",
    "NaHSO4",
    "NaNO2",
    "NaNO3",
    "NaOH",
    "Na2CO3",
    "Na2C2O4",
    "Na2N2O2",
    "Na2O2",
    "Na2O",
    "Na2S",
    "Na2SO3",
    "Na2SO4",
    "Na2S2O3",
    "Na2S2O5",
    "Na2S2O8",
    "Na2S4"
];
var answers = [];

var languageString = {
    "en": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or  What is the chemical formula of carbon dioxide",

            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",

            "DESCRIPTION": "%s",
            "CHEMICAL_NAME": "Chemical name for %s is %s",

            "SOLUBILITY_NOT_FOUND": "I don't think %s soluble in %s. But %s is soluble in %s",
            "SOLUBILITY_SINGLE_NOT_FOUND": "I don't think %s soluble in %s. But %s %s",
            "SOLUBLE_MESSAGE": "Yes, %s is soluble in %s",
            "SOLUBLE_SINGLE_MESSAGE": "Yes, %s %s",

            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",

            "EXAMPLE": "Here is an example,  %s",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day",
            "START_QUIZ_MESSAGE": "OK. I will ask you 10 questions about Molecules.",

            "FIRST_QUESTIONS": "Here is your first question. What is the %s of %s?. Here are the options %s",
            "QUESTIONS": "What is the %s of %s?. Here are the options %s",
            "WRONG_ANSWER": "Sorry! that was a wrong answer"
        }
    },
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": "Welcome to Molecule! You can ask me about any Molecules",
            "HELP_MESSAGE": "Try saying some thing like, Boiling point of methane or  What is the chemical formula of carbon dioxide",

            "PROPERTIES": "%s of %s is %s",
            "CHEMICAL_FORMULA": "%s for %s is %s",

            "DESCRIPTION": "%s",

            "SOLUBILITY_NOT_FOUND": "I don't think %s soluble in %s. But %s is soluble in %s",
            "SOLUBILITY_SINGLE_NOT_FOUND": "I don't think %s soluble in %s. But %s %s",
            "SOLUBLE_MESSAGE": "Yes, %s is soluble in %s",
            "SOLUBLE_SINGLE_MESSAGE": "Yes, %s %s",

            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",

            "EXAMPLE": "Here is an example,  %s",
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

            "DESCRIPTION": "%s",

            "SOLUBILITY_NOT_FOUND": "I don't think %s soluble in %s. But %s is soluble in %s",
            "SOLUBILITY_SINGLE_NOT_FOUND": "I don't think %s soluble in %s. But %s %s",
            "SOLUBLE_MESSAGE": "Yes, %s is soluble in %s",
            "SOLUBLE_SINGLE_MESSAGE": "Yes, %s %s",

            "MOLECULE_ERROR_MESSAGE": "I don't have any information for %s.",
            "PROPERTIES_ERROR_MESSAGE": "I don't have any information on %s of %s.",

            "EXAMPLE": "Here is an example,  %s",
            "NOTHING_FOUND": "Sorry! I din't catch that. Please try again",
            "GOOD_BYE": "Goodbye! Have a nice day",
            "START_QUIZ_MESSAGE": "OK. I will ask you 10 questions about Molecules."
        }
    },
    "de-DE": {
        "translation": {
            "WELCOME_MESSAGE": "Willkommen bei Molecule! Du kannst mich nach irgendwelchen Molekülen fragen",
            "HELP_MESSAGE": "Versuchen Sie, etwas zu sagen, Siedepunkt von Methan oder Was ist die chemische Formel von Kohlendioxid",

            "PROPERTIES": "%s von %s Ist %s",
            "CHEMICAL_FORMULA": "%s für %s ist %s",

            "DESCRIPTION": "%s",

            "SOLUBILITY_NOT_FOUND": "Ich glaube nicht, dass %s in %s löslich ist. Aber %s ist in %s löslich",
            "SOLUBILITY_SINGLE_NOT_FOUND": "Ich glaube nicht, dass %s in %s löslich ist. Aber %s %s",
            "SOLUBLE_MESSAGE": "Ja, %s ist in %s löslich",
            "SOLUBLE_SINGLE_MESSAGE": "Ja, %s %s",

            "MOLECULE_ERROR_MESSAGE": "Ich habe keine Informationen für %s.",
            "PROPERTIES_ERROR_MESSAGE": "Ich habe keine Informationen über %s von %s.",

            "EXAMPLE": "Hier ist ein Beispiel, %s",
            "NOTHING_FOUND": "Es tut uns leid! Ich fange das nicht an. Bitte versuche es erneut",
            "GOOD_BYE": "Auf Wiedersehen! Einen schönen Tag noch",
            "START_QUIZ_MESSAGE": "OK. Ich werde euch 10 Fragen über Molecules stellen."
        }
    }
};

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startMoleculeHandlers, questionMoleculeHandlers, exampleMoleculeHandlers, moleculeQuizHandlers);
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
    "ChemicalNameIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetChemicalName", this.event.request.intent.slots);
    },
    "SolubilityMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetSoluble", this.event.request.intent.slots);
    },
    "ExampleMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.EXAMPLE;
        this.emitWithState("GetExamples");
    },
    "MoleculeQuizIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("MoleculeQuiz");
    },
    "AnswerMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("Answer", this.event.request.intent.slots);
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
    "ChemicalNameIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetChemicalName", this.event.request.intent.slots);
    },
    "SolubilityMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUESTION;
        this.emitWithState("GetSoluble", this.event.request.intent.slots);
    },
    "ExampleMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.EXAMPLE;
        this.emitWithState("GetExamples");
    },
    "MoleculeQuizIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("MoleculeQuiz");
    },
    "AnswerMoleculeIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("Answer", this.event.request.intent.slots);
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

    /**
     * Method to process Molecule Question Intent
     */

    "GetMolecules": function (slots) {
        var speechOutput = "";
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

                    slots.Properties.value = Helpers.propertiesConverter(slots.Properties.value);

                    var propertiesIndex = _.findIndex(moleculeData[dataIndex].properties, function (prop) {
                        return prop.valueTitle.toLowerCase() == slots.Properties.value.toLowerCase();
                    });

                    if (propertiesIndex == -1) {
                        speechOutput += _this.t("PROPERTIES_ERROR_MESSAGE", slots.Properties.value, moleculeName);
                    } else {
                        var properties = moleculeData[dataIndex].properties[propertiesIndex];
                        if (properties.valueTitle == "Density" || properties.valueTitle == "Molar mass") properties.valueData = Helpers.unitsToReadable(properties.valueData);
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
                 * Handle description request
                 * **/
                if (slots.Description && slots.Description.value) {
                    var description = moleculeData[dataIndex].description;
                    speechOutput += _this.t("DESCRIPTION", description);
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
                repeatSpeechOut = speechOutput;
                _this.emit(":tell", speechOutput);
            } else {
                repeatSpeechOut = _this.t("WELCOME_MESSAGE");
                _this.emit(":tell", _this.t("WELCOME_MESSAGE"));
            }

        });
    },

    /**
     * Method to process Solubility Intent
     */

    "GetSoluble": function (slots) {
        var speechOutput = "";
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
                if (slots.SecondMoleculeName && slots.SecondMoleculeName.value) {
                    var propertiesIndex = _.findIndex(moleculeData[dataIndex].properties, function (prop) {
                        return prop.valueTitle.toLowerCase() == "solubility";
                    });

                    if (propertiesIndex == -1) {
                        speechOutput += _this.t("PROPERTIES_ERROR_MESSAGE", "solubility", moleculeName);
                    } else {
                        var property = moleculeData[dataIndex].properties[propertiesIndex];
                        var solubilityList = property.valueData.toLowerCase().split(', ');

                        var solubleIndex = _.indexOf(solubilityList, secondMoleculeName.toLowerCase());

                        if (solubleIndex == -1) {

                            if (_.includes(property.valueData, secondMoleculeName)) {

                                if (property.valueData.split(', ').length > 1) {
                                    speechOutput += _this.t("SOLUBLE_MESSAGE", moleculeName, secondMoleculeName);
                                } else {
                                    if (property.valueData.split(' ').length > 1) {
                                        speechOutput += _this.t("SOLUBLE_SINGLE_MESSAGE", moleculeName, property.valueData);
                                    } else {
                                        speechOutput += _this.t("SOLUBLE_MESSAGE", moleculeName, secondMoleculeName, property.valueData);
                                    }
                                }

                            } else {

                                if (property.valueData.split(', ').length > 1) {
                                    property.valueData = Helpers.replaceLastIndexWithComma(property.valueData);
                                    speechOutput += _this.t("SOLUBILITY_NOT_FOUND", moleculeName, secondMoleculeName, moleculeName, property.valueData);
                                } else {
                                    if (property.valueData.split(' ').length > 1) {
                                        speechOutput += _this.t("SOLUBILITY_SINGLE_NOT_FOUND", moleculeName, secondMoleculeName, moleculeName, property.valueData);
                                    } else {
                                        speechOutput += _this.t("SOLUBILITY_NOT_FOUND", moleculeName, secondMoleculeName, moleculeName, property.valueData);
                                    }
                                }

                            }

                        } else {
                            speechOutput += _this.t("SOLUBLE_MESSAGE", moleculeName, secondMoleculeName, property.valueData);
                        }
                    }

                }

                /**
                 * Handle speech is undefined
                 * **/
                if (!speechOutput) {
                    speechOutput += _this.t("NOTHING_FOUND");
                }

                /**
                 * Handle molecule is undefined
                 * **/
            } else {
                speechOutput += _this.t("MOLECULE_ERROR_MESSAGE", moleculeName);
            }

            if (speechOutput) {
                repeatSpeechOut = speechOutput;
                _this.emit(":tell", speechOutput);

            } else {
                /**
                 * Welcome message
                 * **/
                repeatSpeechOut = _this.t("WELCOME_MESSAGE");
                _this.emit(":tell", _this.t("WELCOME_MESSAGE"));
            }

        });
    },
    "GetChemicalName": function () {

        var speechOutput = "";
        var chemicalFormula = slots.ChemicalName.value;
        var moleculeData = [];
        var _this = this;

        Data.httpGet(moleculeName, function (result) {

            moleculeData = result.data;

            var dataIndex = _.findIndex(moleculeData, function (mol) {
                return mol.chemicalFormula.toLowerCase() == chemicalFormula.toLowerCase();
            });

            /**
             * Handle molecule request
             * **/
            if (dataIndex != -1) {

                /**
                 * Handle chemical name request
                 * **/
                if (slots.ChemicalName && slots.ChemicalName.value) {
                    var chemicalName = moleculeData[dataIndex].IUPACName;
                    speechOutput += _this.t("CHEMICAL_NAME", Helpers.chemicalFormulaToReadable(slots.ChemicalName.value), chemicalName);
                }

                /**
                 * Handle molecule is undefined
                 * **/
            } else {
                speechOutput += _this.t("MOLECULE_ERROR_MESSAGE", chemicalFormula);
            }

            if (speechOutput) {
                repeatSpeechOut = speechOutput;
                _this.emit(":tell", speechOutput);
            } else {
                /**
                 * Welcome message
                 * **/
                repeatSpeechOut = _this.t("WELCOME_MESSAGE");
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
        if (!repeatSpeechOut) repeatSpeechOut = this.t("HELP_MESSAGE");
        this.emit(':ask', repeatSpeechOut, this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("NOTHING_FOUND");
        this.emit(":ask", speechOutput, speechOutput);
    }
});

var exampleMoleculeHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.EXAMPLE, {

    "GetExamples": function () {
        var example = Helpers.examples();
        this.attributes["example"] = example;
        this.emit(":tell", this.t("EXAMPLE", example), this.t("EXAMPLE", example));
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":ask", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("GOOD_BYE"));
    },
    'AMAZON.RepeatIntent': function () {
        repeatSpeechOut = this.attributes["example"] ? this.attributes["example"] : this.t("HELP_MESSAGE");
        this.emit(':ask', repeatSpeechOut, this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("NOTHING_FOUND");
        this.emit(":ask", speechOutput, speechOutput);
    }
});

// Method to handle Molecule Quiz Intent
var moleculeQuizHandlers = Alexa.CreateStateHandler(MOLECULE_ALEXA_STATE.QUIZ, {

    "MoleculeQuiz": function () {
        var moleculeData;
        var question = "";
        this.attributes["score"] = 0;
        this.attributes["correctAns"] = "";

        if (!this.attributes["questionCount"]) {
            this.attributes["questionCount"] = 0;
        }

        var _this = this;

        var selectedChemical = chemicalFormula[_.random(chemicalFormula.length - 1)];
        answers = ["", "", "", ""];

        Data.httpGet(selectedChemical, function (result) {

            moleculeData = result.data[0];
            var selectedProp = moleculeData.properties[_.random(moleculeData.properties.length - 1)];
            _this.attributes["correctAns"] = selectedProp.valueData;

            var correctAnsIndex = _.random(answers.length - 1);
            answers[correctAnsIndex] = selectedProp.valueData;

            Data.getDataForQuiz(selectedProp.valueTitle, function (result) {

                var propsValue = [];
                _.each(result.data, function (molecule) {
                    var index = _.findIndex(molecule.properties, function (prop) {
                        return prop.valueTitle.toLowerCase() == selectedProp.valueTitle.toLowerCase();
                    });

                    if (index != -1) {
                        propsValue.push(molecule.properties[index].valueData);
                    }
                });

                _.each(answers, function (ans, index) {
                    if (ans == "") {
                        var randomPropIndex = _.random(propsValue.length - 1);
                        answers[index] = propsValue[randomPropIndex];
                    }
                });

                var optionsToReadable = "";

                _.each(answers, function (ans, index) {
                    switch (index) {
                        case 0:
                            optionsToReadable += "<p>" + "Option A: " + ans + "</p>";
                            break;
                        case 1:
                            optionsToReadable += "<p>" + "Option B: " + ans + "</p>";
                            break;
                        case 2:
                            optionsToReadable += "<p>" + "Option C: " + ans + "</p>";
                            break;
                        case 3:
                            optionsToReadable += "<p>" + "Option D: " + ans + "</p>";
                            break;
                    }

                });

                _this.attributes["questionCount"]++;

                if (_this.attributes["questionCount"] == 1) {
                    question = _this.t("FIRST_QUESTIONS", selectedProp.valueTitle, moleculeData.IUPACName, optionsToReadable);
                } else {
                    question = _this.t("QUESTIONS", selectedProp.valueTitle, moleculeData.IUPACName, optionsToReadable);
                }

                _this.emit(":ask", question, question);

            });

        });

    },
    "Answer": function (slots) {

        var speechOutput = "";

        console.error(slots);

        if (slots.Answer && slots.Answer.value) {

            switch (slots.Answer.value) {
                case "a":
                    answers[0] = this.attributes["correctAns"];
                    this.attributes["score"]++;
                    speechOutput += this.t("CORRECT_ANSWER");
                    break;
                case "b":
                    answers[1] = this.attributes["correctAns"];
                    this.attributes["score"]++;
                    speechOutput += this.t("CORRECT_ANSWER");
                    break;

                case "c":
                    answers[2] = this.attributes["correctAns"];
                    this.attributes["score"]++;
                    speechOutput += this.t("CORRECT_ANSWER");
                    break;

                case "d":
                    answers[3] = this.attributes["correctAns"];
                    this.attributes["score"]++;
                    speechOutput += this.t("CORRECT_ANSWER");
                    break;
                default:
                    speechOutput += this.t("WRONG_ANSWER");
            }

            if (this.attributes["questionCount"] >= 10) {
                speechOutput += this.t("GAME_COMPLETED");
            }

            this.emit(":tell", speechOutput, speechOutput);
            this.emitWithState("MoleculeQuiz");
        } else {
            this.emit(":tell", this.t("WRONG_ANSWER"), this.t("WRONG_ANSWER"));
        }
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":ask", this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("GOOD_BYE"));
    },
    'AMAZON.RepeatIntent': function () {
        repeatSpeechOut = this.attributes["example"] ? this.attributes["example"] : this.t("HELP_MESSAGE");
        this.emit(':ask', repeatSpeechOut, this.t("HELP_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("NOTHING_FOUND");
        this.emit(":ask", speechOutput, speechOutput);
    }

});