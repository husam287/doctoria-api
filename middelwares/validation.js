const { validationResult, body } = require("express-validator");
const uError = require("../utils/uError");
const { Model } = require("mongoose");

//################################################################################
//########### The last middleware after all validators to catch errors ###########
//################################################################################

exports.validationResult = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    try {
        if (!errors.isEmpty()) uError(400, "invalid data", errors.array());
        next();
    } catch (err) {
        next(err);
    } 
};

//#######################################
//########### Email Validator ###########
//#######################################

/**
 * Validate email field
 * @param {string} fieldName - Field name in the request
 */
exports.vEmail = (fieldName = "email") => body(fieldName).isEmail().withMessage("Invalid email");

//######################################
//########### Text Validator ###########
//######################################

/**
 * @typedef {Object} TextOptions
 * @property {boolean} [required] - Field is required or not
 * @property {number} [min] - Min length for the field
 * @property {number} [max] - Max length for the field
 * @property {boolean} [specialChars] - Allow special characters
 */
/**
 * Validate text field
 * @param {string} fieldName - Field name in the request
 * @param {TextOptions} options - Options for the validator
 */
exports.vText = (fieldName, options = {}) => {
    return body(fieldName)
        .trim()
        .custom((value) => {
            const { required, min, max, specialChars } = options;
            // ##### Validatation #####

            // Check if the field is empty in case it is required
            if (required && !value) throw new Error(`${fieldName} is required`);

            // Check if the field is below minimum length
            if (min && value.length < min)
                throw new Error(`${fieldName} should be at least ${min} characters`);

            // Check if the field exceeds the maximum length
            if (max && value.length > max)
                throw new Error(`${fieldName} should be less than or equal ${max} characters`);

            // Check if field includes special characters
            if (!specialChars && /[^\w ]/.test(value))
                throw new Error(`${fieldName} should not include special characters `);
            
            return true;
        })
        .escape(); // Protect against XSS attacks
};

//########################################
//########## Password Validator ##########
//########################################

/**
 * @typedef {Object} PasswordOptions
 * @property {number} [min] - Min length for the field
 * @property {boolean} [lowercase] - Forced to have at least one lowercase character
 * @property {boolean} [uppercase] - Forced to have at least one uppercase character
 * @property {boolean} [digit] - Forced to have at least one digit
 * @property {boolean} [specialChars] - Forced to have at least one special Character
 */
/**
 * Validate password field
 * @param {string} fieldName - Field name in the request
 * @param {PasswordOptions} options - Options for the validator
 */
exports.vPassword = (fieldName, options = {}) => {
    return body(fieldName)
        .trim()
        .custom((value) => {
            let { min, lowercase, uppercase, digit, specialChars } = options;

            min = min || 6; // Set default min length to 6

            // ##### Validatation #####

            // Check if the field is empty in case it is required
            if (!value) throw new Error(`${fieldName} is required`);

            if (value.length < min)
                throw new Error(`${fieldName} should be at least ${min} characters`);

            if (lowercase && !/[a-z]/.test(value))
                throw new Error(`${fieldName} must include at least one lowercase character`);

            if (uppercase && !/[A-Z]/.test(value))
                throw new Error(`${fieldName} must include at least one uppercase character`);

            if (digit && !/[0-9]/.test(value))
                throw new Error(`${fieldName} must include at least one digit`);

            if (specialChars && !/\W+/.test(value))
                throw new Error(`${fieldName} must include at least one Special character`);

            return true;
        });
};

//##########################################
//########### Repeated Validator ###########
//##########################################

/**
 * @typedef {Object} RepeatOptions
 * @property {Model} [Model] - Mongoose model
 * @property {string} [modelFieldName] - Field name in the model
 * @property {boolean} [shouldExist=false] - Set whether field value should exist
 */
/**
 * Validate if field value exists in database
 * @param {string} fieldName - Field name in the request
 * @param {RepeatOptions} options - Options for the validator
 */
exports.vRepeated = (fieldName, options = {}) => {
    return body(fieldName).custom((value) => {
        let { Model, modelFieldName, shouldExist } = options;
        modelFieldName = modelFieldName || fieldName;

        return Model.findOne({ [modelFieldName]: value }).then((doExist) => {
            // if value exists and it should not exist
            if (doExist && !shouldExist) throw new Error(`${fieldName} already exists`);

            // if value doesn't exist but it should exist
            if (!doExist && shouldExist) throw new Error(`${fieldName} doesn't exist`);

            return true;
        });
    });
};
