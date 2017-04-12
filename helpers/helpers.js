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

// Method to convert chemical formula to alexa readable format
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

// Method to convert units to alexa readable format
exports.unitsToReadable = function (string) {

    string = string.replace(/−/g, '');
    return "<say-as interpret-as='unit'>" + string + "</say-as>";

};

exports.generateQuestion = function (counter, property, question) {

    return "Here is your " + counter + "th question.  What is the " + property + " of " + question + "?";
};
