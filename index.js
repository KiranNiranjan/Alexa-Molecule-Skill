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
            "START_QUIZ_MESSAGE": "OK. I will ask you 10 questions about Molecules.",

            "CORRECT_ANSWER": "Wow that's correct answer",
            "WRONG_ANSWER": "Sorry that's wrong, The correct answer is %s"
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
    "Na2S4",
    "H2O",
    "H2O2",
    "CO3",
    "CO4",
    "CNO",
    "NO",
    "NO2",
    "NH4"
];

var properties = [
    "Chemical Formula"
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
    "AnswerIntent": function () {
        this.handler.state = MOLECULE_ALEXA_STATE.QUIZ;
        this.emitWithState("GuessAnswerIntent", this.event.request.intent.slots);
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
        this.attributes["a"] = chemicalFormula[_.random(0, chemicalFormula.length - 1)];
        this.attributes["b"] = chemicalFormula[_.random(0, chemicalFormula.length - 1)];
        this.attributes["c"] = chemicalFormula[_.random(0, chemicalFormula.length - 1)];
        this.attributes["d"] = chemicalFormula[_.random(0, chemicalFormula.length - 1)];

        var molecule = molecules[moleculesIndex];
        var property = properties[0];

        this.attributes["quizQuestion"] = molecule;
        this.attributes["property"] = property;
        this.attributes["quizCounter"]++;

        var moleculeData;
        Data.httpGet(molecule, function (result) {
            moleculeData = result.data;

            var dataIndex = _.findIndex(moleculeData, function (mol) {
                return mol.IUPACName.toLowerCase() == molecule.toLowerCase();
            });


            if (dataIndex != -1) {

                var arrayOfString = ["a", "b", "c", "d"];
                var ram = _.random(arrayOfString.length - 1);

                var chemicalFormula = moleculeData[dataIndex].chemicalFormula.toLowerCase;
                this.attributes[ram] = chemicalFormula;
                this.attributes["correctAnswer"] = ram;
            }
        });

        question += Helpers.generateQuestion(this.attributes["quizCounter"], property, molecule);

        this.emit(":ask", _this.t(question, this.attributes["a"], this.attributes["b"], this.attributes["c"], this.attributes["d"]), question);
    },

    "GuessAnswerIntent": function (slots) {

        var _this = this;
        var response = "";
        var molecule = this.attributes["quizQuestion"];
        var property = this.attributes["property"];

        var correct = Helpers.checkAnswer(slots, molecule, property);

        if (correct.answer) {
            response = _this.t('CORRECT_ANSWER');
            this.attributes["quizScore"]++;
            this.emit(":tell", response)
        } else {
            response = _this.t('WRONG_ANSWER', correct.key);
            this.emit(":tell", response)
        }

        /*if (this.attributes["quizCounter"] < 10)
         {
         this.emitWithState("AskQuestion");
         }
         else
         {
         this.emit(":tell", response);
         }*/
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
