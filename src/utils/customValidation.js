import validator from "validator";

function password(value, helpers) {
    if (value.length < 8) {

        return helpers.message('password must be at least 8 character')
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contains aleast 1 letter in caps,and 1 in small and 1 number')
    }
    return value;
};

function username(value, helpers) {
    if (!value.match(/^[0-9a-zA-Z_.-]+$/)) {
        return helpers.message('username must only contain numbers, letters, ".", "-", "_"')
    }
    return value;
}

function ObjectId(value, helpers) {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        helpers.message('{{#label}} must be a valid mongo id');
    }
    return value;
}

function url(value, helpers) {
    if (!validator.isURL(value)) helpers.message('{{#label}} must be a valid url'); 
    return value;
}


export default {
    password,
    username,
    ObjectId,
    url
}