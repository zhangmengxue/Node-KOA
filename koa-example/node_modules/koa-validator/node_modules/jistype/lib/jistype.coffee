getType = (obj) ->
    Object::toString.call(obj)

util = class module.exports
    @isString: (obj)->
        '[object String]' is getType(obj)

    @isArray: (obj)->
        '[object Array]' is getType(obj)

    @isRegExp: (obj)->
        '[object RegExp]' is getType(obj)

    @isNumber: (obj)->
        !isNaN(obj) and '[object Number]' is getType(obj)

    @isObject: (obj)->
        '[object Object]' is getType(obj)

    @isFunction: (obj)->
        '[object Function]' is getType(obj)

    @isBoolean: (obj)->
        '[object Boolean]' is getType(obj)

    @isUndefined: (obj)->
        '[object Undefined]' is getType(obj)

    @isNull: (obj)->
        '[object Null]' is getType(obj)

    @isDate: (obj)->
        '[object Date]' is getType(obj)

    @isGlobal: (obj)->
        '[object global]' is getType(obj)

    @isError: (obj)->
        obj instanceof Error and '[object Error]' is getType(obj)

    @isBuffer: (obj)->
        Buffer.isBuffer(obj)

    @isNullOrUndefined: (obj)->
        util.isNull(obj) or util.isUndefined(obj)

    @isNaN: (obj)->
        isNaN(obj)

    @isPrimitive: (obj)->
        util.isNull(obj) or
        util.isBoolean(obj) or
        util.isNumber(obj) or
        util.isString(obj) or
        util.isUndefined(obj)

    @isGenerator: (obj)->
        obj and util.isFunction(obj.next) and util.isFunction(obj.throw)

    @isGeneratorFunction: (obj)->
        obj and obj.constructor and 'GeneratorFunction' is obj.constructor.name

    @isPromise: (obj)->
        obj and util.isFunction(obj.then)

    @type: getType