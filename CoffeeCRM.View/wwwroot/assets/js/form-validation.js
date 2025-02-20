"use strict"
class FormValidation {

    /**
     * 
     * @param {string} form form id
     * @param {array} rules list rules {element:elementId,rule:[{name:ruleName,message:error message,allowNullOrEmpty: allow null or empty, value:valid value or id of target element}]}
     * @param {function} handleSubmit submit function
     */
    constructor({ form, rules, handleSubmit }) {
        this.form = form;
        this.rules = rules;
        this.handleSubmit = handleSubmit;
        $(this.form).on('submit', function (e) {
            e.preventDefault();
            if (this.handleSubmit) {
                this.handleSubmit();
            }
        })
    }

    /**
     * 
     * @returns object {
     *  isValid: boolean,
     *  errorMessages: array of error message
     * }
     */
    validate() {
        let result = {
            isValid: true,
            errorMessages: []
        };
        if (this.rules && this.rules.length > 0) {
            for (let item of this.rules) {
                let element = $(item.element);
                if (element.length > 0) {
                    for (let rule of item.rule) {
                        let isValid = true;
                        switch (rule.name) {
                            case "required":
                                isValid = this.checkRequired(item.element);
                                break;
                            case "minLength":
                                isValid = this.checkMinLength(item.element, rule.value, rule.allowNullOrEmpty);
                                break;
                            case "maxLength":
                                isValid = this.checkMaxLength(item.element, rule.value, rule.allowNullOrEmpty)
                            case "rangeLength":
                                isValid = this.checkRangeLength(item.element, ...rule.value, rule.allowNullOrEmpty)
                                break;
                            case "min":
                                isValid = this.checkMin(item.element, rule.value, rule.allowNullOrEmpty)
                                break;
                            case "max":
                                isValid = this.checkMax(item.element, rule.value, rule.allowNullOrEmpty)
                                break;
                            case "range":
                                isValid = this.checkRange(item.element, ...rule.value, rule.allowNullOrEmpty)
                                break;
                            case "email":
                                isValid = this.checkEmail(item.element, rule.allowNullOrEmpty)
                                break;
                            case "phone":
                                isValid = this.checkPhone(item.element, rule.allowNullOrEmpty)
                                break;
                            case "url":
                                isValid = this.checkUrl(item.element, rule.allowNullOrEmpty)
                                break;
                            case "date":
                                isValid = this.checkDate(item.element, rule.value, rule.allowNullOrEmpty)
                                break;
                            case "number":
                                isValid = this.checkNumber(item.element, rule.allowNullOrEmpty)
                                break;
                            case "digits":
                                isValid = this.checkDigits(item.element, rule.allowNullOrEmpty)
                                break;
                            case "equalTo":
                                isValid = this.checkEqualTo(item.element, rule.value)
                                break;
                            case "notEqualTo":
                                isValid = this.checkNotEqualTo(item.element, rule.value)
                                break;
                            case "customRegex":
                                isValid = this.checkCustomRegex(item.element, rule.value, rule.allowNullOrEmpty)
                                break;
                            case "customFunction":
                                isValid = rule.value(item.element);
                                break;
                            default:
                                break;
                        }
                        if (!isValid) {
                            result.errorMessages.push(rule.message);
                        }
                    }
                }
            }
            result.isValid = result.errorMessages.length === 0;
            return result;
        }
        return result;
    }

    /**
     * 
     * @param {string} element element id
     * @returns boolean
     */
    checkRequired(element) {
        if (element && $(element).length > 0) {
            return $(element).val() !== null && $(element).val().toString().trim().length > 0;
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {int} validLength min length
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkMinLength(element, validLength, allowNullOrEmpty = false) {
        if (element && validLength && $(element).length > 0) {
            const value = $(element).val();
            return allowNullOrEmpty || Array.isArray(value) ? value.length >= validLength : value !== null && value.trim().length >= validLength;
        }
        return false;
    }

    /**
     * 
     * @param {string} element element id 
     * @param {int} validLength max length
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns 
     */
    checkMaxLength(element, validLength, allowNullOrEmpty = false) {
        if (element && validLength && $(element).length > 0) {
            const value = $(element).val();
            return allowNullOrEmpty || Array.isArray(value) ? value.length <= validLength : value !== null && value.trim().length <= validLength;
        }
        return false;
    }

    /**
     * 
     * @param {string} element element id
     * @param {int} minLength min length valid
     * @param {int} maxLength max length valid
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns 
     */
    checkRangeLength(element, minLength, maxLength, allowNullOrEmpty = false) {
        if (element && minLength && maxLength && $(element).length > 0) {
            const value = $(element).val();
            const length = Array.isArray(value) ? value.length : (value !== null ? value.trim().length : 0);
            return allowNullOrEmpty || (minLength <= length && length <= maxLength);
        }
        return false;
    }

    /**
     * 
     * @param {string} element element id
     * @param {number} min min value
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns 
     */
    checkMin(element, min, allowNullOrEmpty = false) {
        if (element && min && $(element).length > 0) {
            let value = parseFloat($(element).val());
            if (value) {
                return allowNullOrEmpty || value >= min;
            }
            return allowNullOrEmpty || false;
        }
        return false;
    }

    /**
     * 
     * @param {string} element element id
     * @param {number} max max value
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns 
     */
    checkMax(element, max, allowNullOrEmpty = false) {
        if (element && max && $(element).length > 0) {
            let value = parseFloat($(element).val());
            if (value) {
                return allowNullOrEmpty || value <= max;
            }
            return allowNullOrEmpty || false;
        }
        return false;
    }

    /**
     * 
     * @param {string} element element id
     * @param {number} min min value
     * @param {number} max max value
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns 
     */
    checkRange(element, min, max, allowNullOrEmpty = false) {
        if (element && min && max && $(element).length > 0) {
            let value = parseFloat($(element).val());
            if (value) {
                return allowNullOrEmpty || (min <= value && value <= max);
            }
            return allowNullOrEmpty || false;
        }
        return false;
    }

    /**
     * 
     * @param {string} element element id
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkEmail(element, allowNullOrEmpty = false) {
        if (element && $(element).length > 0) {
            const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return allowNullOrEmpty || ($(element).val() !== null && $(element).val().trim().match(mailformat));
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkUrl(element, allowNullOrEmpty = false) {
        if (element && $(element).length > 0) {
            const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
            return allowNullOrEmpty || ($(element).val() !== null && $(element).val().trim().match(httpRegex));
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkPhone(element, allowNullOrEmpty = false) {
        if (element && $(element).length > 0) {
            const regexPhoneNumber = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
            return allowNullOrEmpty || ($(element).val() !== null && $(element).val().trim().match(regexPhoneNumber));
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {string} format date format
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkDate(element, format, allowNullOrEmpty = false) {
        if (element && format && $(element).length > 0) {
            return allowNullOrEmpty || ($(element).val() !== null && moment($(element).val().trim(), format).isValid());
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkNumber(element, allowNullOrEmpty = false) {
        if (element && $(element).length > 0) {
            return allowNullOrEmpty || !isNaN(parseFloat($(element).val().trim()))
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkDigits(element, allowNullOrEmpty = false) {
        if (element && $(element).length > 0) {
            const digitRex = /^\d+$/;
            return allowNullOrEmpty || ($(element).val() !== null && $(element).val().trim().match(digitRex));
        }
        return false;
    }

    /**
     * 
     * @param {string} element1 element1 id
     * @param {string} element2 element2 id
     * @returns boolean
     */
    checkEqualTo(element1, element2) {
        if (element1 && element2 && $(element1).length > 0 && $(element2).length > 0) {
            return $(element1).val() === $(element2).val();
        }
        return false;
    }


    /**
     * 
     * @param {string} element1 element1 id
     * @param {string} element2 element2 id
     * @returns boolean
     */
    checkNotEqualTo(element1, element2) {
        if (element1 && element2 && $(element1).val() && $(element2).val()) {
            return $(element1).val() !== $(element2).val();
        }
        return false;
    }


    /**
     * 
     * @param {string} element element id
     * @param {RegExp} regexExpression regex expression
     * @param {boolean} allowNullOrEmpty allow null or empty
     * @returns boolean
     */
    checkCustomRegex(element, regexExpression, allowNullOrEmpty = false) {
        if (element && $(element).length > 0) {
            const regex = new RegExp(regexExpression);
            return allowNullOrEmpty || ($(element).val() !== null && regex.test($(element).val().trim()))
        }
        return false;
    }
}
