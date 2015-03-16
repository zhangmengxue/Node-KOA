var validator = require('validator')
    , is = require('jistype')

    , extend = require('./extend')
    , sanitizers = [
        'trim'
        , 'ltrim'
        , 'rtrim'
        , 'escape'
        , 'stripLow'
        , 'whitelist'
        , 'blacklist'
        , 'normalizeEmail'
    ]
    , checkers = [
        'equals'
        , 'contains'
        , 'matches'
    ]
    ;

function getParams(ctx, name){
    return ctx.params && ctx.params[name];
}

function getQuery(ctx, name){
    return ctx.query && ctx.query[name];
}

function getBody(ctx, name){
    return ctx.request.body && ctx.request.body[name];
}

function getHeader(ctx, name){
    var toCheck;

    if (name === 'referrer' || name === 'referer') {
        toCheck = ctx.headers.referer;
    } else {
        toCheck = ctx.headers[name];
    }
    return toCheck || '';
}

function updateParams(ctx, name, value){
    return ctx.params[name] = value;
}

function updateQuery(ctx, name, value){
    return ctx.query[name] = value;
}

function updateBody(ctx, name, value){
    // If bodyparser middleware is not used, this will throw an error,
    // so check `ctx.request.body` is whether exists
    return ctx.request.body && (ctx.request.body[name] = value);
}

function makeSanitize(field){
    var getter = field === 'params' ? getParams :
                 field === 'query' ? getQuery :
                 getBody
        , updater = field === 'params' ? updateParams :
                    field === 'query' ? updateQuery :
                    updateBody
        ;
    return function(name){
        var ctx = this
            , value = getter(ctx, name)
            , methods = {}
            ;

        Object.keys(validator).forEach(function(methodName){
            if(methodName.match(/^to/) || sanitizers.indexOf(methodName) !== -1){
                methods[methodName] = function(){
                    var args = [value].concat(Array.prototype.slice.call(arguments));
                    var result = validator[methodName].apply(validator, args);
                    updater(ctx, name, result)
                    return result;
                };
            }
        });

        return methods;
    }
}

function makeCheck(field, validationErrorFormatter, onValidationError){
    var getter = field === 'params' ? getParams :
                 field === 'query' ? getQuery :
                 field === 'body' ? getBody :
                 getHeader
        ;

    return function(param, failMsg){
        var ctx = this
            , value
            ;

        if(!Array.isArray(param)){
            param = typeof param === 'number' ?
                [param] :
                param.split('.').filter(function(e){
                    return e !== '';
                });
        }

        param.map(function(item){
            if(value === undefined){
                value = getter(ctx, item);
            }else{
                value = value[item];
            }
        });

        param = param.join('.');

        var errorHandler = function(msg){
            var error = validationErrorFormatter(param, msg, value);

            if (ctx._validationErrors === undefined) {
                ctx._validationErrors = [];
            }
            ctx._validationErrors.push(error);

            if (onValidationError && is.isFunction(onValidationError)) {
                onValidationError.call(ctx, msg);
            }
        };

        var methods = {};

        Object.keys(validator).forEach(function(methodName) {
            if (methodName.match(/^is/) || checkers.indexOf(methodName) !== -1) {
                methods[methodName] = function() {
                    var args = [value].concat(Array.prototype.slice.call(arguments));
                    var isCorrect = validator[methodName].apply(validator, args);

                    if (!isCorrect) {
                        errorHandler(failMsg || 'Invalid value');
                    }

                    return methods;
                }
            }
        });

        return methods;
    };
}

function errorFormatter(param, msg, value){
    return {
        param: param
        , msg: msg
        , value: value
    };
}

function makeExtend(type){
    var regex, dicts;
    if(type === 'check'){
        regex = /^is/;
        dicts = checkers;
    }else if(type === 'sanitize'){
        regex = /^to/;
        dicts = sanitizers;
    }

    return function(name, fn){
        var objs = {};
        if(is.isString(name) && is.isFunction(fn)){
            obj[name] = fn;
        }else if(is.isObject(name)){
            objs = name;
        }

        Object.keys(objs).forEach(function(name){
            if(validator.hasOwnProperty(name)){
                throw new Error('validator already have method ' + name);
                return;
            }

            if(dicts.indexOf(name) !== -1){
                throw new Error('you have already defined method ' + name);
                return;
            }

            if(!name.match(regex)){
                dicts.push(name);
            }
            validator.extend(name, objs[name]);
        });
    }
}

var extendCheck = makeExtend('check')
    , extendSanitize = makeExtend('sanitize')
    ;

// extend validator
extendCheck(extend.check);
extendSanitize(extend.sanitize);

// expose
module.exports = koaValidator;
module.exports.validator = validator;
module.exports.extendSanitize = extendSanitize;
module.exports.extendCheck = extendCheck;

// main function
function koaValidator(options){
    var validationErrorFormatter = errorFormatter
        , onValidationError
        ;

    options = options || {};

    if(options.validationErrorFormatter){
        if(!is.isFunction(options.validationErrorFormatter)){
            throw new Error('validationErrorFormatter must be a function');
        }else{
            validationErrorFormatter = options.validationErrorFormatter;
        }
    }

    if(options.onValidationError){
        if(!is.isFunction(options.onValidationError)){
            throw new Error('onValidationError must be a function');
        }
        else{
            onValidationError = options.onValidationError;
        }
    }

    return function *validator(next){
        var ctx = this;

        ctx.sanitizeParams = makeSanitize('params');
        ctx.sanitizeQuery = makeSanitize('query');
        ctx.sanitizeBody = makeSanitize('body');

        ctx.checkParams = makeCheck('params', validationErrorFormatter, onValidationError);
        ctx.checkQuery = makeCheck('query', validationErrorFormatter, onValidationError);
        ctx.checkBody = makeCheck('body', validationErrorFormatter, onValidationError);
        ctx.checkHeader = makeCheck('header', validationErrorFormatter, onValidationError);

        ctx.assertParams = ctx.checkParams;
        ctx.assertQuery = ctx.checkQuery;
        ctx.assertBody = ctx.checkBody;
        ctx.assertHeader = ctx.checkHeader;

        ctx.haveValidationError = function(){
            return !!this._validationErrors;
        };

        ctx.validationErrors = function(mapped) {
            if(this._validationErrors === undefined){
                return null;
            }
            if (mapped) {
                var errors = {};
                this._validationErrors.forEach(function(err) {
                    errors[err.param] = err;
                });
                return errors;
            }
            return this._validationErrors;
        };

        yield next;
    };
}
