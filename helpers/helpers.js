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

var _ = require('lodash');

/** Method to convert chemical formula to alexa readable format **/
exports.chemicalFormulaToReadable = function (string) {
    var result = '';

    var stringSplit = string.split(/(?=[A-Z])/);

    var count = _.countBy(stringSplit, function (num) {
        return num == num ? num : num;
    });

    _.mapKeys(count, function (val, key) {

        if (val == 1) {
            return result += key;
        } else {
            return result += key + val;
        }
    });

    return "<say-as interpret-as='spell-out'>" + result + "</say-as>";
};

/** Method to convert units to alexa readable format **/
exports.unitsToReadable = function (string) {

    string = string.replace(/−/g, '');
    return "<say-as interpret-as='unit'>" + string + "</say-as>";

};

/** Method to provide a random example **/
exports.examples = function () {

    var examples = [
        "What is the atomic number of Carbon?",
        "What is the boiling point of Water?",
        "Odor for Hydrogen cyanide?",
        "How does Formic acid looks like?",
        "Chemical Formula of Fluorine?",
        "What is the chemical formula of Benzene?",
        "What is the autoignition temperature of Carbon Monoxide?",
        "How does Ammonia smells like?",
        "Does Ammonia soluble in water?",
        "How does Fluoroform looks like or  appears like?",
        "What are the Hazards of Difluoromethane?",
        "Melting point for Sodium fluoride?",
        "What is the Flash point of Sodium nitrate?",
        "What is the density of Sodium?",
        "What is the odor of Nonane?",
        "What is the Critical point of Ammonia?",
        "Can you describe Nitrate?"
    ];

    return examples[_.random(0, examples.length - 1)];

};

/** Method to convert custom properties to required **/
exports.propertiesConverter = function (prop) {

    switch (prop.toLowerCase()) {
        case "smells like":
            prop = "Odor";
            break;
        case "smells":
            prop = "Odor";
            break;
        case "looks like":
            prop = "Appearance";
            break;
        case "appears like":
            prop = "Appearance";
            break;
    }

    return prop

};

/** Method to replace and to the last index of "," **/
exports.replaceLastIndexWithComma = function (prop) {
    return prop.replaceAt(prop.lastIndexOf(","), " and")
};

/** Method to replace a char using index **/
String.prototype.replaceAt = function (index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
};

