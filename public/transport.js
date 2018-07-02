var COMPILED = false
var goog = goog || {}
goog.global = this
goog.global.CLOSURE_UNCOMPILED_DEFINES
goog.global.CLOSURE_DEFINES
goog.isDef = function (val) {
  return val !== void 0
}
goog.isString = function (val) {
  return typeof val === 'string'
}
goog.isBoolean = function (val) {
  return typeof val === 'boolean'
}
goog.isNumber = function (val) {
  return typeof val === 'number'
}
goog.exportPath_ = function (name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.')
  var cur = opt_objectToExportTo || goog.global
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0])
  }
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    } else {
      if (cur[part] && cur[part] !== Object.prototype[part]) {
        cur = cur[part]
      } else {
        cur = cur[part] = {}
      }
    }
  }
}
goog.define = function (name, defaultValue) {
  var value = defaultValue
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && goog.global.CLOSURE_UNCOMPILED_DEFINES.nodeType === undefined && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name]
    } else {
      if (goog.global.CLOSURE_DEFINES && goog.global.CLOSURE_DEFINES.nodeType === undefined && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name]
      }
    }
  }
  goog.exportPath_(name, value)
}
goog.define('goog.DEBUG', true)
goog.define('goog.LOCALE', 'en')
goog.define('goog.TRUSTED_SITE', true)
goog.define('goog.STRICT_MODE_COMPATIBLE', false)
goog.define('goog.DISALLOW_TEST_ONLY_CODE', COMPILED && !goog.DEBUG)
goog.define('goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING', false)
goog.provide = function (name) {
  if (goog.isInModuleLoader_()) {
    throw new Error('goog.provide can not be used within a goog.module.')
  }
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw new Error('Namespace "' + name + '" already declared.')
    }
  }
  goog.constructNamespace_(name)
}
goog.constructNamespace_ = function (name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name]
    var namespace = name
    while (namespace = namespace.substring(0, namespace.lastIndexOf('.'))) {
      if (goog.getObjectByName(namespace)) {
        break
      }
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name, opt_obj)
}
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/
goog.module = function (name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw new Error('Invalid module identifier')
  }
  if (!goog.isInModuleLoader_()) {
    throw new Error('Module ' + name + ' has been loaded incorrectly. Note, ' + 'modules cannot be loaded as normal scripts. They require some kind of ' + "pre-processing step. You're likely trying to load a module via a " + 'script tag or as a part of a concatenated bundle without rewriting the ' + 'module. For more info see: ' + 'https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.')
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw new Error('goog.module may only be called once per module.')
  }
  goog.moduleLoaderState_.moduleName = name
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw new Error('Namespace "' + name + '" already declared.')
    }
    delete goog.implicitNamespaces_[name]
  }
}
goog.module.get = function (name) {
  return goog.module.getInternal_(name)
}
goog.module.getInternal_ = function (name) {
  if (!COMPILED) {
    if (name in goog.loadedModules_) {
      return goog.loadedModules_[name]
    } else {
      if (!goog.implicitNamespaces_[name]) {
        var ns = goog.getObjectByName(name)
        return ns != null ? ns : null
      }
    }
  }
  return null
}
goog.moduleLoaderState_ = null
goog.isInModuleLoader_ = function () {
  return goog.moduleLoaderState_ != null
}
goog.module.declareLegacyNamespace = function () {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error('goog.module.declareLegacyNamespace must be called from ' + 'within a goog.module')
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw new Error('goog.module must be called prior to ' + 'goog.module.declareLegacyNamespace.')
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true
}
goog.setTestOnly = function (opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || ''
    throw new Error('Importing test-only code into non-debug environment' + (opt_message ? ': ' + opt_message : '.'))
  }
}
goog.forwardDeclare = function (name) {
}
goog.forwardDeclare('Document')
goog.forwardDeclare('HTMLScriptElement')
goog.forwardDeclare('XMLHttpRequest')
if (!COMPILED) {
  goog.isProvided_ = function (name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name))
  }
  goog.implicitNamespaces_ = {'goog.module': true}
}
goog.getObjectByName = function (name, opt_obj) {
  var parts = name.split('.')
  var cur = opt_obj || goog.global
  for (var i = 0; i < parts.length; i++) {
    cur = cur[parts[i]]
    if (!goog.isDefAndNotNull(cur)) {
      return null
    }
  }
  return cur
}
goog.globalize = function (obj, opt_global) {
  var global = opt_global || goog.global
  for (var x in obj) {
    global[x] = obj[x]
  }
}
goog.addDependency = function (relPath, provides, requires, opt_loadFlags) {
  if (goog.DEPENDENCIES_ENABLED) {
    var loader = goog.getLoader_()
    if (loader) {
      loader.addDependency(relPath, provides, requires, opt_loadFlags)
    }
  }
}
goog.define('goog.ENABLE_DEBUG_LOADER', true)
goog.logToConsole_ = function (msg) {
  if (goog.global.console) {
    goog.global.console['error'](msg)
  }
}
goog.require = function (name) {
  if (goog.ENABLE_DEBUG_LOADER && goog.debugLoader_) {
    goog.getLoader_().earlyProcessLoad(name)
  }
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name)
      }
    } else {
      if (goog.ENABLE_DEBUG_LOADER) {
        var moduleLoaderState = goog.moduleLoaderState_
        goog.moduleLoaderState_ = null
        try {
          var loader = goog.getLoader_()
          if (loader) {
            loader.load(name)
          } else {
            goog.logToConsole_('Could not load ' + name + ' because there is no debug loader.')
          }
        } finally {
          goog.moduleLoaderState_ = moduleLoaderState
        }
      }
    }
    return null
  }
}
goog.basePath = ''
goog.global.CLOSURE_BASE_PATH
goog.global.CLOSURE_NO_DEPS
goog.global.CLOSURE_IMPORT_SCRIPT
goog.nullFunction = function () {
}
goog.abstractMethod = function () {
  throw new Error('unimplemented abstract method')
}
goog.addSingletonGetter = function (ctor) {
  ctor.instance_ = undefined
  ctor.getInstance = function () {
    if (ctor.instance_) {
      return ctor.instance_
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor
    }
    return ctor.instance_ = new ctor()
  }
}
goog.instantiatedSingletons_ = []
goog.define('goog.LOAD_MODULE_USING_EVAL', true)
goog.define('goog.SEAL_MODULE_EXPORTS', goog.DEBUG)
goog.loadedModules_ = {}
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER
goog.define('goog.TRANSPILE', 'detect')
goog.define('goog.TRANSPILER', 'transpile.js')
goog.define('goog.DEBUG_LOADER', '')
goog.hasBadLetScoping = null
goog.useSafari10Workaround = function () {
  if (goog.hasBadLetScoping == null) {
    var hasBadLetScoping
    try {
      hasBadLetScoping = !eval('"use strict";' + 'let x = 1; function f() { return typeof x; };' + 'f() == "number";')
    } catch (e) {
      hasBadLetScoping = false
    }
    goog.hasBadLetScoping = hasBadLetScoping
  }
  return goog.hasBadLetScoping
}
goog.workaroundSafari10EvalBug = function (moduleDef) {
  return '(function(){' + moduleDef + '\n' + ';' + '})();\n'
}
goog.loadModule = function (moduleDef) {
  var previousState = goog.moduleLoaderState_
  try {
    goog.moduleLoaderState_ = {moduleName: undefined, declareLegacyNamespace: false}
    var exports
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {})
    } else {
      if (goog.isString(moduleDef)) {
        if (goog.useSafari10Workaround()) {
          moduleDef = goog.workaroundSafari10EvalBug(moduleDef)
        }
        exports = goog.loadModuleFromSource_.call(undefined, moduleDef)
      } else {
        throw new Error('Invalid module definition')
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName
    if (!goog.isString(moduleName) || !moduleName) {
      throw new Error('Invalid module name "' + moduleName + '"')
    }
    if (goog.moduleLoaderState_.declareLegacyNamespace) {
      goog.constructNamespace_(moduleName, exports)
    } else {
      if (goog.SEAL_MODULE_EXPORTS && Object.seal && typeof exports === 'object' && exports != null) {
        Object.seal(exports)
      }
    }
    goog.loadedModules_[moduleName] = exports
  } finally {
    goog.moduleLoaderState_ = previousState
  }
}
goog.loadModuleFromSource_ = function () {
  var exports = {}
  eval(arguments[0])
  return exports
}
goog.normalizePath_ = function (path) {
  var components = path.split('/')
  var i = 0
  while (i < components.length) {
    if (components[i] == '.') {
      components.splice(i, 1)
    } else {
      if (i && components[i] == '..' && components[i - 1] && components[i - 1] != '..') {
        components.splice(--i, 2)
      } else {
        i++
      }
    }
  }
  return components.join('/')
}
goog.global.CLOSURE_LOAD_FILE_SYNC
goog.loadFileSync_ = function (src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src)
  } else {
    try {
      var xhr = new goog.global['XMLHttpRequest']()
      xhr.open('get', src, false)
      xhr.send()
      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null
    } catch (err) {
      return null
    }
  }
}
goog.transpile_ = function (code, path) {
  var jscomp = goog.global['$jscomp']
  if (!jscomp) {
    goog.global['$jscomp'] = jscomp = {}
  }
  var transpile = jscomp.transpile
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER
    var transpilerCode = goog.loadFileSync_(transpilerPath)
    if (transpilerCode) {
      (function () {
        eval(transpilerCode + '\n//# sourceURL=' + transpilerPath)
      }).call(goog.global)
      if (goog.global['$gwtExport'] && goog.global['$gwtExport']['$jscomp'] && !goog.global['$gwtExport']['$jscomp']['transpile']) {
        throw new Error('The transpiler did not properly export the "transpile" ' + 'method. $gwtExport: ' + JSON.stringify(goog.global['$gwtExport']))
      }
      goog.global['$jscomp'].transpile = goog.global['$gwtExport']['$jscomp']['transpile']
      jscomp = goog.global['$jscomp']
      transpile = jscomp.transpile
    }
  }
  if (!transpile) {
    var suffix = ' requires transpilation but no transpiler was found.'
    transpile = jscomp.transpile = function (code, path) {
      goog.logToConsole_(path + suffix)
      return code
    }
  }
  return transpile(code, path)
}
goog.typeOf = function (value) {
  var s = typeof value
  if (s == 'object') {
    if (value) {
      if (value instanceof Array) {
        return 'array'
      } else {
        if (value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value)
      if (className == '[object Window]') {
        return 'object'
      }
      if (className == '[object Array]' || typeof value.length === 'number' && typeof value.splice !== 'undefined' && typeof value.propertyIsEnumerable !== 'undefined' && !value.propertyIsEnumerable('splice')) {
        return 'array'
      }
      if (className == '[object Function]' || typeof value.call !== 'undefined' && typeof value.propertyIsEnumerable !== 'undefined' && !value.propertyIsEnumerable('call')) {
        return 'function'
      }
    } else {
      return 'null'
    }
  } else {
    if (s == 'function' && typeof value.call === 'undefined') {
      return 'object'
    }
  }
  return s
}
goog.isNull = function (val) {
  return val === null
}
goog.isDefAndNotNull = function (val) {
  return val != null
}
goog.isArray = function (val) {
  return goog.typeOf(val) == 'array'
}
goog.isArrayLike = function (val) {
  var type = goog.typeOf(val)
  return type == 'array' || type == 'object' && typeof val.length === 'number'
}
goog.isDateLike = function (val) {
  return goog.isObject(val) && typeof val.getFullYear === 'function'
}
goog.isFunction = function (val) {
  return goog.typeOf(val) == 'function'
}
goog.isObject = function (val) {
  var type = typeof val
  return type == 'object' && val != null || type == 'function'
}
goog.getUid = function (obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
}
goog.hasUid = function (obj) {
  return !!obj[goog.UID_PROPERTY_]
}
goog.removeUid = function (obj) {
  if (obj !== null && 'removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  } catch (ex) {
  }
}
goog.UID_PROPERTY_ = 'closure_uid_' + (Math.random() * 1e9 >>> 0)
goog.uidCounter_ = 0
goog.getHashCode = goog.getUid
goog.removeHashCode = goog.removeUid
goog.cloneObject = function (obj) {
  var type = goog.typeOf(obj)
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone()
    }
    var clone = type == 'array' ? [] : {}
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
}
goog.bindNative_ = function (fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
}
goog.bindJs_ = function (fn, selfObj, var_args) {
  if (!fn) {
    throw new Error()
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2)
    return function () {
      var newArgs = Array.prototype.slice.call(arguments)
      Array.prototype.unshift.apply(newArgs, boundArgs)
      return fn.apply(selfObj, newArgs)
    }
  } else {
    return function () {
      return fn.apply(selfObj, arguments)
    }
  }
}
goog.bind = function (fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_
  } else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
}
goog.partial = function (fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function () {
    var newArgs = args.slice()
    newArgs.push.apply(newArgs, arguments)
    return fn.apply(this, newArgs)
  }
}
goog.mixin = function (target, source) {
  for (var x in source) {
    target[x] = source[x]
  }
}
goog.now = goog.TRUSTED_SITE && Date.now || function () {
  return +new Date()
}
goog.globalEval = function (script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript')
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        try {
          goog.global.eval('var _evalTest_ = 1;')
        } catch (ignore) {
        }
        if (typeof goog.global['_evalTest_'] !== 'undefined') {
          try {
            delete goog.global['_evalTest_']
          } catch (ignore$0) {
          }
          goog.evalWorksForGlobals_ = true
        } else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      } else {
        var doc = goog.global.document
        var scriptElt = doc.createElement('SCRIPT')
        scriptElt.type = 'text/javascript'
        scriptElt.defer = false
        scriptElt.appendChild(doc.createTextNode(script))
        doc.head.appendChild(scriptElt)
        doc.head.removeChild(scriptElt)
      }
    } else {
      throw new Error('goog.globalEval not available')
    }
  }
}
goog.evalWorksForGlobals_ = null
goog.cssNameMapping_
goog.cssNameMappingStyle_
goog.global.CLOSURE_CSS_NAME_MAP_FN
goog.getCssName = function (className, opt_modifier) {
  if (String(className).charAt(0) == '.') {
    throw new Error('className passed in goog.getCssName must not start with ".".' + ' You passed: ' + className)
  }
  var getMapping = function (cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  }
  var renameByParts = function (cssName) {
    var parts = cssName.split('-')
    var mapped = []
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join('-')
  }
  var rename
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ? getMapping : renameByParts
  } else {
    rename = function (a) {
      return a
    }
  }
  var result = opt_modifier ? className + '-' + rename(opt_modifier) : rename(className)
  if (goog.global.CLOSURE_CSS_NAME_MAP_FN) {
    return goog.global.CLOSURE_CSS_NAME_MAP_FN(result)
  }
  return result
}
goog.setCssNameMapping = function (mapping, opt_style) {
  goog.cssNameMapping_ = mapping
  goog.cssNameMappingStyle_ = opt_style
}
goog.global.CLOSURE_CSS_NAME_MAPPING
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING
}
goog.getMsg = function (str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function (match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match
    })
  }
  return str
}
goog.getMsgWithFallback = function (a, b) {
  return a
}
goog.exportSymbol = function (publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
}
goog.exportProperty = function (object, publicName, symbol) {
  object[publicName] = symbol
}
goog.inherits = function (childCtor, parentCtor) {
  function tempCtor () {
  }
  tempCtor.prototype = parentCtor.prototype
  childCtor.superClass_ = parentCtor.prototype
  childCtor.prototype = new tempCtor()
  childCtor.prototype.constructor = childCtor
  childCtor.base = function (me, methodName, var_args) {
    var args = new Array(arguments.length - 2)
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i]
    }
    return parentCtor.prototype[methodName].apply(me, args)
  }
}
goog.base = function (me, opt_methodName, var_args) {
  var caller = arguments.callee.caller
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw new Error('arguments.caller not defined.  goog.base() cannot be used ' + 'with strict mode code. See ' + 'http://www.ecma-international.org/ecma-262/5.1/#sec-C')
  }
  if (caller.superClass_) {
    var ctorArgs = new Array(arguments.length - 1)
    for (var i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i]
    }
    return caller.superClass_.constructor.apply(me, ctorArgs)
  }
  var args = new Array(arguments.length - 2)
  for (var i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i]
  }
  var foundCaller = false
  for (var ctor = me.constructor; ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  } else {
    throw new Error('goog.base called from a method of one name ' + 'to a method of a different name')
  }
}
goog.scope = function (fn) {
  if (goog.isInModuleLoader_()) {
    throw new Error('goog.scope is not supported within a goog.module.')
  }
  fn.call(goog.global)
}
if (!COMPILED) {
  goog.global['COMPILED'] = COMPILED
}
goog.defineClass = function (superClass, def) {
  var constructor = def.constructor
  var statics = def.statics
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function () {
      throw new Error('cannot instantiate an interface (no constructor defined).')
    }
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass)
  if (superClass) {
    goog.inherits(cls, superClass)
  }
  delete def.constructor
  delete def.statics
  goog.defineClass.applyProperties_(cls.prototype, def)
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls)
    } else {
      goog.defineClass.applyProperties_(cls, statics)
    }
  }
  return cls
}
goog.defineClass.ClassDescriptor
goog.define('goog.defineClass.SEAL_CLASS_INSTANCES', goog.DEBUG)
goog.defineClass.createSealingConstructor_ = function (ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return ctr
  }
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass)
  var wrappedCtr = function () {
    var instance = ctr.apply(this, arguments) || this
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_]
    if (this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function) {
      Object.seal(instance)
    }
    return instance
  }
  return wrappedCtr
}
goog.defineClass.isUnsealable_ = function (ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]
}
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf']
goog.defineClass.applyProperties_ = function (target, source) {
  var key
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key]
    }
  }
  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i]
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key]
    }
  }
}
goog.tagUnsealableClass = function (ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true
  }
}
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable'
if (goog.DEPENDENCIES_ENABLED) {
  goog.inHtmlDocument_ = function () {
    var doc = goog.global.document
    return doc != null && 'write' in doc
  }
  goog.findBasePath_ = function () {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH) && goog.isString(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH
      return
    } else {
      if (!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document
    var currentScript = doc.currentScript
    if (currentScript) {
      var scripts = [currentScript]
    } else {
      var scripts = doc.getElementsByTagName('SCRIPT')
    }
    for (var i = scripts.length - 1; i >= 0; --i) {
      var script = scripts[i]
      var src = script.src
      var qmark = src.lastIndexOf('?')
      var l = qmark == -1 ? src.length : qmark
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7)
        return
      }
    }
  }
  goog.findBasePath_()
  goog.Transpiler = function () {
    this.requiresTranspilation_ = null
  }
  goog.Transpiler.prototype.createRequiresTranspilation_ = function () {
    var requiresTranspilation = {'es3': false}
    var transpilationRequiredForAllLaterModes = false
    function addNewerLanguageTranspilationCheck (modeName, isSupported) {
      if (transpilationRequiredForAllLaterModes) {
        requiresTranspilation[modeName] = true
      } else {
        if (isSupported()) {
          requiresTranspilation[modeName] = false
        } else {
          requiresTranspilation[modeName] = true
          transpilationRequiredForAllLaterModes = true
        }
      }
    }
    function evalCheck (code) {
      try {
        return !!eval(code)
      } catch (ignored) {
        return false
      }
    }
    var userAgent = goog.global.navigator && goog.global.navigator.userAgent ? goog.global.navigator.userAgent : ''
    addNewerLanguageTranspilationCheck('es5', function () {
      return evalCheck('[1,].length==1')
    })
    addNewerLanguageTranspilationCheck('es6', function () {
      var re = /Edge\/(\d+)(\.\d)*/i
      var edgeUserAgent = userAgent.match(re)
      if (edgeUserAgent && Number(edgeUserAgent[1]) < 15) {
        return false
      }
      var es6fullTest = 'class X{constructor(){if(new.target!=String)throw 1;this.x=42}}' + 'let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof ' + 'String))throw 1;for(const a of[2,3]){if(a==2)continue;function ' + 'f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()' + '==3}'
      return evalCheck('(()=>{"use strict";' + es6fullTest + '})()')
    })
    addNewerLanguageTranspilationCheck('es6-impl', function () {
      return true
    })
    addNewerLanguageTranspilationCheck('es7', function () {
      return evalCheck('2 ** 2 == 4')
    })
    addNewerLanguageTranspilationCheck('es8', function () {
      return evalCheck('async () => 1, true')
    })
    return requiresTranspilation
  }
  goog.Transpiler.prototype.needsTranspile = function (lang) {
    if (goog.TRANSPILE == 'always') {
      return true
    } else {
      if (goog.TRANSPILE == 'never') {
        return false
      } else {
        if (!this.requiresTranspilation_) {
          this.requiresTranspilation_ = this.createRequiresTranspilation_()
        }
      }
    }
    if (lang in this.requiresTranspilation_) {
      return this.requiresTranspilation_[lang]
    } else {
      throw new Error('Unknown language mode: ' + lang)
    }
  }
  goog.Transpiler.prototype.transpile = function (code, path) {
    return goog.transpile_(code, path)
  }
  goog.transpiler_ = new goog.Transpiler()
  goog.DebugLoader = function () {
    this.dependencies_ = {loadFlags: {}, nameToPath: {}, requires: {}, visited: {}, written: {}, deferred: {}}
    this.oldIeWaiting_ = false
    this.queuedModules_ = []
    this.lastNonModuleScriptIndex_ = 0
  }
  goog.DebugLoader.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document && goog.global.document.all)
  goog.DebugLoader.prototype.earlyProcessLoad = function (name) {
    if (goog.DebugLoader.IS_OLD_IE_) {
      this.maybeProcessDeferredDep_(name)
    }
  }
  goog.DebugLoader.prototype.load = function (name) {
    var pathToLoad = this.getPathFromDeps_(name)
    if (!pathToLoad) {
      var errorMessage = 'goog.require could not find: ' + name
      this.logToConsole(errorMessage)
      throw Error(errorMessage)
    } else {
      var visitNode = function (path) {
        if (path in deps.written) {
          return
        }
        if (path in deps.visited) {
          return
        }
        deps.visited[path] = true
        if (path in deps.requires) {
          for (var requireName in deps.requires[path]) {
            if (!loader.isProvided(requireName)) {
              if (requireName in deps.nameToPath) {
                visitNode(deps.nameToPath[requireName])
              } else {
                throw Error('Undefined nameToPath for ' + requireName)
              }
            }
          }
        }
        if (!(path in seenScript)) {
          seenScript[path] = true
          scripts.push(path)
        }
      }
      var scripts = []
      var seenScript = {}
      var deps = this.dependencies_
      var loader = this
      visitNode(pathToLoad)
      for (var i = 0; i < scripts.length; i++) {
        var path = scripts[i]
        this.dependencies_.written[path] = true
      }
      for (var i = 0; i < scripts.length; i++) {
        var path = scripts[i]
        if (path) {
          var loadFlags = deps.loadFlags[path] || {}
          var languageLevel = loadFlags['lang'] || 'es3'
          var needsTranspile = this.getTranspiler().needsTranspile(languageLevel)
          if (loadFlags['module'] == 'goog' || needsTranspile) {
            this.importProcessedScript_(goog.basePath + path, loadFlags['module'] == 'goog', needsTranspile)
          } else {
            this.importScript_(goog.basePath + path)
          }
        } else {
          throw Error('Undefined script input')
        }
      }
    }
  }
  goog.DebugLoader.prototype.addDependency = function (relPath, provides, requires, opt_loadFlags) {
    var provide, require
    var path = relPath.replace(/\\/g, '/')
    var deps = this.dependencies_
    if (!opt_loadFlags || typeof opt_loadFlags === 'boolean') {
      opt_loadFlags = opt_loadFlags ? {'module': 'goog'} : {}
    }
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path
      deps.loadFlags[path] = opt_loadFlags
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
  goog.DebugLoader.prototype.importScript_ = function (src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.bind(this.writeScriptTag_, this)
    if (importScript(src, opt_sourceText)) {
      this.dependencies_.written[src] = true
    }
  }
  goog.DebugLoader.prototype.importProcessedScript_ = function (src, isModule, needsTranspile) {
    var bootstrap = 'goog.debugLoader_.retrieveAndExec_("' + src + '", ' + isModule + ', ' + needsTranspile + ');'
    this.importScript_('', bootstrap)
  }
  goog.DebugLoader.prototype.retrieveAndExec_ = function (src, isModule, needsTranspile) {
    if (!COMPILED) {
      var originalPath = src
      src = this.normalizePath(src)
      var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.bind(this.writeScriptTag_, this)
      var scriptText = this.loadFileSync(src)
      if (scriptText == null) {
        throw new Error('Load of "' + src + '" failed')
      }
      if (needsTranspile) {
        scriptText = this.getTranspiler().transpile(scriptText, src)
      }
      if (isModule) {
        scriptText = this.wrapModule_(src, scriptText)
      } else {
        scriptText += '\n//# sourceURL=' + src
      }
      var isOldIE = goog.DebugLoader.IS_OLD_IE_
      if (isOldIE && this.oldIeWaiting_) {
        this.dependencies_.deferred[originalPath] = scriptText
        this.queuedModules_.push(originalPath)
      } else {
        importScript(src, scriptText)
      }
    }
  }
  goog.DebugLoader.prototype.wrapModule_ = function (srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return '' + 'goog.loadModule(function(exports) {' + '"use strict";' + scriptText + '\n' + ';return exports' + '});' + '\n//# sourceURL=' + srcUrl + '\n'
    } else {
      return '' + 'goog.loadModule(' + goog.global.JSON.stringify(scriptText + '\n//# sourceURL=' + srcUrl + '\n') + ');'
    }
  }
  goog.DebugLoader.prototype.loadQueuedModules_ = function () {
    var count = this.queuedModules_.length
    if (count > 0) {
      var queue = this.queuedModules_
      this.queuedModules_ = []
      for (var i = 0; i < count; i++) {
        var path = queue[i]
        this.maybeProcessDeferredPath_(path)
      }
    }
    this.oldIeWaiting_ = false
  }
  goog.DebugLoader.prototype.maybeProcessDeferredDep_ = function (name) {
    if (this.isDeferredModule_(name) && this.allDepsAreAvailable_(name)) {
      var path = this.getPathFromDeps_(name)
      this.maybeProcessDeferredPath_(goog.basePath + path)
    }
  }
  goog.DebugLoader.prototype.isDeferredModule_ = function (name) {
    var path = this.getPathFromDeps_(name)
    var loadFlags = path && this.dependencies_.loadFlags[path] || {}
    var languageLevel = loadFlags['lang'] || 'es3'
    if (path && (loadFlags['module'] == 'goog' || this.getTranspiler().needsTranspile(languageLevel))) {
      var abspath = goog.basePath + path
      return abspath in this.dependencies_.deferred
    }
    return false
  }
  goog.DebugLoader.prototype.allDepsAreAvailable_ = function (name) {
    var path = this.getPathFromDeps_(name)
    if (path && path in this.dependencies_.requires) {
      for (var requireName in this.dependencies_.requires[path]) {
        if (!this.isProvided(requireName) && !this.isDeferredModule_(requireName)) {
          return false
        }
      }
    }
    return true
  }
  goog.DebugLoader.prototype.maybeProcessDeferredPath_ = function (abspath) {
    if (abspath in this.dependencies_.deferred) {
      var src = this.dependencies_.deferred[abspath]
      delete this.dependencies_.deferred[abspath]
      goog.globalEval(src)
    }
  }
  goog.DebugLoader.prototype.writeScriptSrcNode_ = function (src) {
    goog.global.document.write('<script type="text/javascript" src="' + src + '"></' + 'script>')
  }
  goog.DebugLoader.prototype.appendScriptSrcNode_ = function (src) {
    var doc = goog.global.document
    var scriptEl = doc.createElement('script')
    scriptEl.type = 'text/javascript'
    scriptEl.src = src
    scriptEl.defer = false
    scriptEl.async = false
    doc.head.appendChild(scriptEl)
  }
  goog.DebugLoader.prototype.writeScriptTag_ = function (src, opt_sourceText) {
    if (this.inHtmlDocument()) {
      var doc = goog.global.document
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && doc.readyState == 'complete') {
        var isDeps = /\bdeps.js$/.test(src)
        if (isDeps) {
          return false
        } else {
          throw Error('Cannot write "' + src + '" after document load')
        }
      }
      if (opt_sourceText === undefined) {
        if (!goog.DebugLoader.IS_OLD_IE_) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            this.appendScriptSrcNode_(src)
          } else {
            this.writeScriptSrcNode_(src)
          }
        } else {
          this.oldIeWaiting_ = true
          var state = " onreadystatechange='goog.debugLoader_" + '.onScriptLoad_(this, ' + ++this.lastNonModuleScriptIndex_ + ")' "
          doc.write('<script type="text/javascript" src="' + src + '"' + state + '></' + 'script>')
        }
      } else {
        doc.write('<script type="text/javascript">' + this.protectScriptTag_(opt_sourceText) + '</' + 'script>')
      }
      return true
    } else {
      return false
    }
  }
  goog.DebugLoader.prototype.protectScriptTag_ = function (str) {
    return str.replace(/<\/(SCRIPT)/ig, '\\x3c/$1')
  }
  goog.DebugLoader.prototype.onScriptLoad_ = function (script, scriptIndex) {
    if (script.readyState == 'complete' && this.lastNonModuleScriptIndex_ == scriptIndex) {
      this.loadQueuedModules_()
    }
    return true
  }
  goog.DebugLoader.prototype.getPathFromDeps_ = function (rule) {
    if (rule in this.dependencies_.nameToPath) {
      return this.dependencies_.nameToPath[rule]
    } else {
      return null
    }
  }
  goog.DebugLoader.prototype.getTranspiler = function () {
    return goog.transpiler_
  }
  goog.DebugLoader.prototype.isProvided = function (namespaceOrPath) {
    return goog.isProvided_(namespaceOrPath)
  }
  goog.DebugLoader.prototype.inHtmlDocument = function () {
    return goog.inHtmlDocument_()
  }
  goog.DebugLoader.prototype.logToConsole = function (message) {
    goog.logToConsole_(message)
  }
  goog.DebugLoader.prototype.loadFileSync = function (srcUrl) {
    return goog.loadFileSync_(srcUrl)
  }
  goog.DebugLoader.prototype.normalizePath = function (path) {
    return goog.normalizePath_(path)
  }
  goog.debugLoader_ = null
  goog.registerDebugLoader = function (loader) {
    if (goog.debugLoader_) {
      throw new Error('Debug loader already registered!')
    }
    if (!(loader instanceof goog.DebugLoader)) {
      throw new Error('Not a goog.DebugLoader.')
    }
    goog.debugLoader_ = loader
  }
  goog.getLoader_ = function () {
    if (!goog.debugLoader_ && goog.DEBUG_LOADER) {
      throw new Error('Loaded debug loader file but no loader was registered!')
    } else {
      if (!goog.debugLoader_) {
        goog.debugLoader_ = new goog.DebugLoader()
      }
    }
    return goog.debugLoader_
  };
  (function () {
    var tempLoader
    if (goog.DEBUG_LOADER) {
      tempLoader = new goog.DebugLoader()
      tempLoader.importScript_(goog.basePath + goog.DEBUG_LOADER)
    }
    if (!goog.global.CLOSURE_NO_DEPS) {
      tempLoader = tempLoader || new goog.DebugLoader()
      if (!goog.DEBUG_LOADER) {
        goog.registerDebugLoader(tempLoader)
      }
      tempLoader.importScript_(goog.basePath + 'deps.js')
    }
  })()
}
;goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.ClientReadableStream')
  goog.module.declareLegacyNamespace()
  var ClientReadableStream = function () {
  }
  ClientReadableStream.prototype.on = goog.abstractMethod
  ClientReadableStream.prototype.cancel = goog.abstractMethod
  exports = ClientReadableStream
  return exports
})
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.Error')
  goog.module.declareLegacyNamespace()
  var Error
  exports = Error
  return exports
})
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.AbstractClientBase')
  goog.module.declareLegacyNamespace()
  var ClientReadableStream = goog.require('grpc.web.ClientReadableStream')
  var Error = goog.require('grpc.web.Error')
  var AbstractClientBase = function () {
  }
  AbstractClientBase.MethodInfo = function (responseType, requestSerializeFn, responseDeserializeFn) {
    this.responseType = responseType
    this.requestSerializeFn = requestSerializeFn
    this.responseDeserializeFn = responseDeserializeFn
  }
  AbstractClientBase.prototype.rpcCall = goog.abstractMethod
  AbstractClientBase.prototype.serverStreaming = goog.abstractMethod
  exports = AbstractClientBase
  return exports
})
goog.provide('goog.net.EventType')
goog.net.EventType = {COMPLETE: 'complete', SUCCESS: 'success', ERROR: 'error', ABORT: 'abort', READY: 'ready', READY_STATE_CHANGE: 'readystatechange', TIMEOUT: 'timeout', INCREMENTAL_DATA: 'incrementaldata', PROGRESS: 'progress', DOWNLOAD_PROGRESS: 'downloadprogress', UPLOAD_PROGRESS: 'uploadprogress'}
goog.provide('goog.net.streams.StreamParser')
goog.net.streams.StreamParser = function () {
}
goog.net.streams.StreamParser.prototype.isInputValid = goog.abstractMethod
goog.net.streams.StreamParser.prototype.getErrorMessage = goog.abstractMethod
goog.net.streams.StreamParser.prototype.parse = goog.abstractMethod
goog.provide('goog.debug.Error')
goog.debug.Error = function (opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error)
  } else {
    var stack = (new Error()).stack
    if (stack) {
      this.stack = stack
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg)
  }
  this.reportErrorToServer = true
}
goog.inherits(goog.debug.Error, Error)
goog.debug.Error.prototype.name = 'CustomError'
goog.provide('goog.dom.NodeType')
goog.dom.NodeType = {ELEMENT: 1, ATTRIBUTE: 2, TEXT: 3, CDATA_SECTION: 4, ENTITY_REFERENCE: 5, ENTITY: 6, PROCESSING_INSTRUCTION: 7, COMMENT: 8, DOCUMENT: 9, DOCUMENT_TYPE: 10, DOCUMENT_FRAGMENT: 11, NOTATION: 12}
goog.provide('goog.string')
goog.provide('goog.string.Unicode')
goog.define('goog.string.DETECT_DOUBLE_ESCAPING', false)
goog.define('goog.string.FORCE_NON_DOM_HTML_UNESCAPING', false)
goog.string.Unicode = {NBSP: '\u00a0'}
goog.string.startsWith = function (str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0
}
goog.string.endsWith = function (str, suffix) {
  var l = str.length - suffix.length
  return l >= 0 && str.indexOf(suffix, l) == l
}
goog.string.caseInsensitiveStartsWith = function (str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
}
goog.string.caseInsensitiveEndsWith = function (str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
}
goog.string.caseInsensitiveEquals = function (str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase()
}
goog.string.subs = function (str, var_args) {
  var splitParts = str.split('%s')
  var returnString = ''
  var subsArguments = Array.prototype.slice.call(arguments, 1)
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift()
  }
  return returnString + splitParts.join('%s')
}
goog.string.collapseWhitespace = function (str) {
  return str.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '')
}
goog.string.isEmptyOrWhitespace = function (str) {
  return /^[\s\xa0]*$/.test(str)
}
goog.string.isEmptyString = function (str) {
  return str.length == 0
}
goog.string.isEmpty = goog.string.isEmptyOrWhitespace
goog.string.isEmptyOrWhitespaceSafe = function (str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str))
}
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe
goog.string.isBreakingWhitespace = function (str) {
  return !/[^\t\n\r ]/.test(str)
}
goog.string.isAlpha = function (str) {
  return !/[^a-zA-Z]/.test(str)
}
goog.string.isNumeric = function (str) {
  return !/[^0-9]/.test(str)
}
goog.string.isAlphaNumeric = function (str) {
  return !/[^a-zA-Z0-9]/.test(str)
}
goog.string.isSpace = function (ch) {
  return ch == ' '
}
goog.string.isUnicodeChar = function (ch) {
  return ch.length == 1 && ch >= ' ' && ch <= '~' || ch >= '\u0080' && ch <= '\ufffd'
}
goog.string.stripNewlines = function (str) {
  return str.replace(/(\r\n|\r|\n)+/g, ' ')
}
goog.string.canonicalizeNewlines = function (str) {
  return str.replace(/(\r\n|\r|\n)/g, '\n')
}
goog.string.normalizeWhitespace = function (str) {
  return str.replace(/\xa0|\s/g, ' ')
}
goog.string.normalizeSpaces = function (str) {
  return str.replace(/\xa0|[ \t]+/g, ' ')
}
goog.string.collapseBreakingSpaces = function (str) {
  return str.replace(/[\t\r\n ]+/g, ' ').replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '')
}
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function (str) {
  return str.trim()
} : function (str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '')
}
goog.string.trimLeft = function (str) {
  return str.replace(/^[\s\xa0]+/, '')
}
goog.string.trimRight = function (str) {
  return str.replace(/[\s\xa0]+$/, '')
}
goog.string.caseInsensitiveCompare = function (str1, str2) {
  var test1 = String(str1).toLowerCase()
  var test2 = String(str2).toLowerCase()
  if (test1 < test2) {
    return -1
  } else {
    if (test1 == test2) {
      return 0
    } else {
      return 1
    }
  }
}
goog.string.numberAwareCompare_ = function (str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0
  }
  if (!str1) {
    return -1
  }
  if (!str2) {
    return 1
  }
  var tokens1 = str1.toLowerCase().match(tokenizerRegExp)
  var tokens2 = str2.toLowerCase().match(tokenizerRegExp)
  var count = Math.min(tokens1.length, tokens2.length)
  for (var i = 0; i < count; i++) {
    var a = tokens1[i]
    var b = tokens2[i]
    if (a != b) {
      var num1 = parseInt(a, 10)
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10)
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2
        }
      }
      return a < b ? -1 : 1
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length
  }
  return str1 < str2 ? -1 : 1
}
goog.string.intAwareCompare = function (str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g)
}
goog.string.floatAwareCompare = function (str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g)
}
goog.string.numerateCompare = goog.string.floatAwareCompare
goog.string.urlEncode = function (str) {
  return encodeURIComponent(String(str))
}
goog.string.urlDecode = function (str) {
  return decodeURIComponent(str.replace(/\+/g, ' '))
}
goog.string.newLineToBr = function (str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>')
}
goog.string.htmlEscape = function (str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, '&amp;').replace(goog.string.LT_RE_, '&lt;').replace(goog.string.GT_RE_, '&gt;').replace(goog.string.QUOT_RE_, '&quot;').replace(goog.string.SINGLE_QUOTE_RE_, '&#39;').replace(goog.string.NULL_RE_, '&#0;')
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, '&#101;')
    }
    return str
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str
    }
    if (str.indexOf('&') != -1) {
      str = str.replace(goog.string.AMP_RE_, '&amp;')
    }
    if (str.indexOf('<') != -1) {
      str = str.replace(goog.string.LT_RE_, '&lt;')
    }
    if (str.indexOf('>') != -1) {
      str = str.replace(goog.string.GT_RE_, '&gt;')
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, '&quot;')
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, '&#39;')
    }
    if (str.indexOf('\x00') != -1) {
      str = str.replace(goog.string.NULL_RE_, '&#0;')
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf('e') != -1) {
      str = str.replace(goog.string.E_RE_, '&#101;')
    }
    return str
  }
}
goog.string.AMP_RE_ = /&/g
goog.string.LT_RE_ = /</g
goog.string.GT_RE_ = />/g
goog.string.QUOT_RE_ = /"/g
goog.string.SINGLE_QUOTE_RE_ = /'/g
goog.string.NULL_RE_ = /\x00/g
goog.string.E_RE_ = /e/g
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/
goog.string.unescapeEntities = function (str) {
  if (goog.string.contains(str, '&')) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && 'document' in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str)
    } else {
      return goog.string.unescapePureXmlEntities_(str)
    }
  }
  return str
}
goog.string.unescapeEntitiesWithDocument = function (str, document) {
  if (goog.string.contains(str, '&')) {
    return goog.string.unescapeEntitiesUsingDom_(str, document)
  }
  return str
}
goog.string.unescapeEntitiesUsingDom_ = function (str, opt_document) {
  var seen = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"'}
  var div
  if (opt_document) {
    div = opt_document.createElement('div')
  } else {
    div = goog.global.document.createElement('div')
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function (s, entity) {
    var value = seen[s]
    if (value) {
      return value
    }
    if (entity.charAt(0) == '#') {
      var n = Number('0' + entity.substr(1))
      if (!isNaN(n)) {
        value = String.fromCharCode(n)
      }
    }
    if (!value) {
      div.innerHTML = s + ' '
      value = div.firstChild.nodeValue.slice(0, -1)
    }
    return seen[s] = value
  })
}
goog.string.unescapePureXmlEntities_ = function (str) {
  return str.replace(/&([^;]+);/g, function (s, entity) {
    switch (entity) {
      case 'amp':
        return '&'
      case 'lt':
        return '<'
      case 'gt':
        return '>'
      case 'quot':
        return '"'
      default:
        if (entity.charAt(0) == '#') {
          var n = Number('0' + entity.substr(1))
          if (!isNaN(n)) {
            return String.fromCharCode(n)
          }
        }
        return s
    }
  })
}
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g
goog.string.whitespaceEscape = function (str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/ {2}/g, ' &#160;'), opt_xml)
}
goog.string.preserveSpaces = function (str) {
  return str.replace(/(^|[\n ]) /g, '$1' + goog.string.Unicode.NBSP)
}
goog.string.stripQuotes = function (str, quoteChars) {
  var length = quoteChars.length
  for (var i = 0; i < length; i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i)
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1)
    }
  }
  return str
}
goog.string.truncate = function (str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + '...'
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
}
goog.string.truncateMiddle = function (str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars
    }
    var endPoint = str.length - opt_trailingChars
    var startPoint = chars - opt_trailingChars
    str = str.substring(0, startPoint) + '...' + str.substring(endPoint)
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2)
      var endPos = str.length - half
      half += chars % 2
      str = str.substring(0, half) + '...' + str.substring(endPos)
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
}
goog.string.specialEscapeChars_ = {'\x00': '\\0', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t', '\x0B': '\\x0B', '"': '\\"', '\\': '\\\\', '<': '<'}
goog.string.jsEscapeCache_ = {"'": "\\'"}
goog.string.quote = function (s) {
  s = String(s)
  var sb = ['"']
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i)
    var cc = ch.charCodeAt(0)
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
  }
  sb.push('"')
  return sb.join('')
}
goog.string.escapeString = function (str) {
  var sb = []
  for (var i = 0; i < str.length; i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i))
  }
  return sb.join('')
}
goog.string.escapeChar = function (c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c]
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c]
  }
  var rv = c
  var cc = c.charCodeAt(0)
  if (cc > 31 && cc < 127) {
    rv = c
  } else {
    if (cc < 256) {
      rv = '\\x'
      if (cc < 16 || cc > 256) {
        rv += '0'
      }
    } else {
      rv = '\\u'
      if (cc < 4096) {
        rv += '0'
      }
    }
    rv += cc.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[c] = rv
}
goog.string.contains = function (str, subString) {
  return str.indexOf(subString) != -1
}
goog.string.caseInsensitiveContains = function (str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase())
}
goog.string.countOf = function (s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0
}
goog.string.removeAt = function (s, index, stringLength) {
  var resultStr = s
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength)
  }
  return resultStr
}
goog.string.remove = function (str, substr) {
  return str.replace(substr, '')
}
goog.string.removeAll = function (s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), 'g')
  return s.replace(re, '')
}
goog.string.replaceAll = function (s, ss, replacement) {
  var re = new RegExp(goog.string.regExpEscape(ss), 'g')
  return s.replace(re, replacement.replace(/\$/g, '$$$$'))
}
goog.string.regExpEscape = function (s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08')
}
goog.string.repeat = String.prototype.repeat ? function (string, length) {
  return string.repeat(length)
} : function (string, length) {
  return (new Array(length + 1)).join(string)
}
goog.string.padNumber = function (num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num)
  var index = s.indexOf('.')
  if (index == -1) {
    index = s.length
  }
  return goog.string.repeat('0', Math.max(0, length - index)) + s
}
goog.string.makeSafe = function (obj) {
  return obj == null ? '' : String(obj)
}
goog.string.buildString = function (var_args) {
  return Array.prototype.join.call(arguments, '')
}
goog.string.getRandomString = function () {
  var x = 2147483648
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
}
goog.string.compareVersions = function (version1, version2) {
  var order = 0
  var v1Subs = goog.string.trim(String(version1)).split('.')
  var v2Subs = goog.string.trim(String(version2)).split('.')
  var subCount = Math.max(v1Subs.length, v2Subs.length)
  for (var subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
    var v1Sub = v1Subs[subIdx] || ''
    var v2Sub = v2Subs[subIdx] || ''
    do {
      var v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ['', '', '', '']
      var v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ['', '', '', '']
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10)
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10)
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
      v1Sub = v1Comp[3]
      v2Sub = v2Comp[3]
    } while (order == 0)
  }
  return order
}
goog.string.compareElements_ = function (left, right) {
  if (left < right) {
    return -1
  } else {
    if (left > right) {
      return 1
    }
  }
  return 0
}
goog.string.hashCode = function (str) {
  var result = 0
  for (var i = 0; i < str.length; ++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0
  }
  return result
}
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0
goog.string.createUniqueString = function () {
  return 'goog_' + goog.string.uniqueStringCounter_++
}
goog.string.toNumber = function (str) {
  var num = Number(str)
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN
  }
  return num
}
goog.string.isLowerCamelCase = function (str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str)
}
goog.string.isUpperCamelCase = function (str) {
  return /^([A-Z][a-z]*)+$/.test(str)
}
goog.string.toCamelCase = function (str) {
  return String(str).replace(/\-([a-z])/g, function (all, match) {
    return match.toUpperCase()
  })
}
goog.string.toSelectorCase = function (str) {
  return String(str).replace(/([A-Z])/g, '-$1').toLowerCase()
}
goog.string.toTitleCase = function (str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : '\\s'
  delimiters = delimiters ? '|[' + delimiters + ']+' : ''
  var regexp = new RegExp('(^' + delimiters + ')([a-z])', 'g')
  return str.replace(regexp, function (all, p1, p2) {
    return p1 + p2.toUpperCase()
  })
}
goog.string.capitalize = function (str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase()
}
goog.string.parseInt = function (value) {
  if (isFinite(value)) {
    value = String(value)
  }
  if (goog.isString(value)) {
    return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10)
  }
  return NaN
}
goog.string.splitLimit = function (str, separator, limit) {
  var parts = str.split(separator)
  var returnVal = []
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift())
    limit--
  }
  if (parts.length) {
    returnVal.push(parts.join(separator))
  }
  return returnVal
}
goog.string.lastComponent = function (str, separators) {
  if (!separators) {
    return str
  } else {
    if (typeof separators === 'string') {
      separators = [separators]
    }
  }
  var lastSeparatorIndex = -1
  for (var i = 0; i < separators.length; i++) {
    if (separators[i] == '') {
      continue
    }
    var currentSeparatorIndex = str.lastIndexOf(separators[i])
    if (currentSeparatorIndex > lastSeparatorIndex) {
      lastSeparatorIndex = currentSeparatorIndex
    }
  }
  if (lastSeparatorIndex == -1) {
    return str
  }
  return str.slice(lastSeparatorIndex + 1)
}
goog.string.editDistance = function (a, b) {
  var v0 = []
  var v1 = []
  if (a == b) {
    return 0
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length)
  }
  for (var i = 0; i < b.length + 1; i++) {
    v0[i] = i
  }
  for (var i = 0; i < a.length; i++) {
    v1[0] = i + 1
    for (var j = 0; j < b.length; j++) {
      var cost = Number(a[i] != b[j])
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost)
    }
    for (var j = 0; j < v0.length; j++) {
      v0[j] = v1[j]
    }
  }
  return v1[b.length]
}
goog.provide('goog.asserts')
goog.provide('goog.asserts.AssertionError')
goog.require('goog.debug.Error')
goog.require('goog.dom.NodeType')
goog.require('goog.string')
goog.define('goog.asserts.ENABLE_ASSERTS', goog.DEBUG)
goog.asserts.AssertionError = function (messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern)
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs))
  messageArgs.shift()
  this.messagePattern = messagePattern
}
goog.inherits(goog.asserts.AssertionError, goog.debug.Error)
goog.asserts.AssertionError.prototype.name = 'AssertionError'
goog.asserts.DEFAULT_ERROR_HANDLER = function (e) {
  throw e
}
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER
goog.asserts.doAssertFailure_ = function (defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = 'Assertion failed'
  if (givenMessage) {
    message += ': ' + givenMessage
    var args = givenArgs
  } else {
    if (defaultMessage) {
      message += ': ' + defaultMessage
      args = defaultArgs
    }
  }
  var e = new goog.asserts.AssertionError('' + message, args || [])
  goog.asserts.errorHandler_(e)
}
goog.asserts.setErrorHandler = function (errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler
  }
}
goog.asserts.assert = function (condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_('', null, opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return condition
}
goog.asserts.fail = function (opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError('Failure' + (opt_message ? ': ' + opt_message : ''), Array.prototype.slice.call(arguments, 1)))
  }
}
goog.asserts.assertNumber = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_('Expected number but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertString = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_('Expected string but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertFunction = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_('Expected function but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertObject = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_('Expected object but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertArray = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_('Expected array but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertBoolean = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_('Expected boolean but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertElement = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_('Expected Element but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertInstanceof = function (value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_('Expected instanceof %s but got %s.', [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3))
  }
  return value
}
goog.asserts.assertFinite = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (typeof value !== 'number' || !isFinite(value))) {
    goog.asserts.doAssertFailure_('Expected %s to be a finite number but it is not.', [value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
}
goog.asserts.assertObjectPrototypeIsIntact = function () {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + ' should not be enumerable in Object.prototype.')
  }
}
goog.asserts.getType_ = function (value) {
  if (value instanceof Function) {
    return value.displayName || value.name || 'unknown type name'
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value)
    } else {
      return value === null ? 'null' : typeof value
    }
  }
}
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.GrpcWebStreamParser')
  goog.module.declareLegacyNamespace()
  var StreamParser = goog.require('goog.net.streams.StreamParser')
  var asserts = goog.require('goog.asserts')
  var GrpcWebStreamParser = function () {
    this.errorMessage_ = null
    this.result_ = []
    this.streamPos_ = 0
    this.state_ = Parser.State_.INIT
    this.frame_ = 0
    this.length_ = 0
    this.countLengthBytes_ = 0
    this.messageBuffer_ = null
    this.countMessageBytes_ = 0
  }
  var Parser = GrpcWebStreamParser
  Parser.State_ = {INIT: 0, LENGTH: 1, MESSAGE: 2, INVALID: 3}
  GrpcWebStreamParser.FrameType = {DATA: 0, TRAILER: 128}
  var FrameType = GrpcWebStreamParser.FrameType
  GrpcWebStreamParser.prototype.isInputValid = function () {
    return this.state_ != Parser.State_.INVALID
  }
  GrpcWebStreamParser.prototype.getErrorMessage = function () {
    return this.errorMessage_
  }
  Parser.prototype.error_ = function (inputBytes, pos, errorMsg) {
    this.state_ = Parser.State_.INVALID
    this.errorMessage_ = 'The stream is broken @' + this.streamPos_ + '/' + pos + '. ' + 'Error: ' + errorMsg + '. ' + 'With input:\n' + inputBytes
    throw new Error(this.errorMessage_)
  }
  GrpcWebStreamParser.prototype.parse = function (input) {
    asserts.assert(input instanceof Array || input instanceof ArrayBuffer)
    var parser = this
    var inputBytes = input instanceof Array ? input : new Uint8Array(input)
    var pos = 0
    while (pos < inputBytes.length) {
      switch (parser.state_) {
        case Parser.State_.INVALID:
        {
          parser.error_(inputBytes, pos, 'stream already broken')
          break
        }
        case Parser.State_.INIT:
        {
          processFrameByte(inputBytes[pos])
          break
        }
        case Parser.State_.LENGTH:
        {
          processLengthByte(inputBytes[pos])
          break
        }
        case Parser.State_.MESSAGE:
        {
          processMessageByte(inputBytes[pos])
          break
        }
        default:
        {
          throw new Error('unexpected parser state: ' + parser.state_)
        }
      }
      parser.streamPos_++
      pos++
    }
    var msgs = parser.result_
    parser.result_ = []
    return msgs.length > 0 ? msgs : null
    function processFrameByte (b) {
      if (b == FrameType.DATA) {
        parser.frame_ = b
      } else {
        if (b == FrameType.TRAILER) {
          parser.frame_ = b
        } else {
          parser.error_(inputBytes, pos, 'invalid frame byte')
        }
      }
      parser.state_ = Parser.State_.LENGTH
      parser.length_ = 0
      parser.countLengthBytes_ = 0
    }
    function processLengthByte (b) {
      parser.countLengthBytes_++
      parser.length_ = (parser.length_ << 8) + b
      if (parser.countLengthBytes_ == 4) {
        parser.state_ = Parser.State_.MESSAGE
        parser.countMessageBytes_ = 0
        if (typeof Uint8Array !== 'undefined') {
          parser.messageBuffer_ = new Uint8Array(parser.length_)
        } else {
          parser.messageBuffer_ = new Array(parser.length_)
        }
        if (parser.length_ == 0) {
          finishMessage()
        }
      }
    }
    function processMessageByte (b) {
      parser.messageBuffer_[parser.countMessageBytes_++] = b
      if (parser.countMessageBytes_ == parser.length_) {
        finishMessage()
      }
    }
    function finishMessage () {
      var message = {}
      message[parser.frame_] = parser.messageBuffer_
      parser.result_.push(message)
      parser.state_ = Parser.State_.INIT
    }
  }
  exports = GrpcWebStreamParser
  return exports
})
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.StatusCode')
  goog.module.declareLegacyNamespace()
  var StatusCode = {OK: 0, CANCELLED: 1, UNKNOWN: 2, INVALID_ARGUMENT: 3, DEADLINE_EXCEEDED: 4, NOT_FOUND: 5, ALREADY_EXISTS: 6, PERMISSION_DENIED: 7, UNAUTHENTICATED: 16, RESOURCE_EXHAUSTED: 8, FAILED_PRECONDITION: 9, ABORTED: 10, OUT_OF_RANGE: 11, UNIMPLEMENTED: 12, INTERNAL: 13, UNAVAILABLE: 14, DATA_LOSS: 15}
  StatusCode.fromHttpStatus = function (http_status) {
    switch (http_status) {
      case 200:
        return StatusCode.OK
      case 400:
        return StatusCode.INVALID_ARGUMENT
      case 401:
        return StatusCode.UNAUTHENTICATED
      case 403:
        return StatusCode.PERMISSION_DENIED
      case 404:
        return StatusCode.NOT_FOUND
      case 409:
        return StatusCode.ABORTED
      case 412:
        return StatusCode.FAILED_PRECONDITION
      case 429:
        return StatusCode.RESOURCE_EXHAUSTED
      case 499:
        return StatusCode.CANCELLED
      case 500:
        return StatusCode.UNKNOWN
      case 501:
        return StatusCode.UNIMPLEMENTED
      case 503:
        return StatusCode.UNAVAILABLE
      case 504:
        return StatusCode.DEADLINE_EXCEEDED
      default:
        return StatusCode.UNKNOWN
    }
  }
  exports = StatusCode
  return exports
})
goog.provide('goog.Thenable')
goog.forwardDeclare('goog.Promise')
goog.Thenable = function () {
}
goog.Thenable.prototype.then = function (opt_onFulfilled, opt_onRejected, opt_context) {
}
goog.Thenable.IMPLEMENTED_BY_PROP = '$goog_Thenable'
goog.Thenable.addImplementation = function (ctor) {
  ctor.prototype['then'] = ctor.prototype.then
  if (COMPILED) {
    ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = true
  } else {
    ctor.prototype.$goog_Thenable = true
  }
}
goog.Thenable.isImplementedBy = function (object) {
  if (!object) {
    return false
  }
  try {
    if (COMPILED) {
      return !!object[goog.Thenable.IMPLEMENTED_BY_PROP]
    }
    return !!object.$goog_Thenable
  } catch (e) {
    return false
  }
}
goog.provide('goog.async.FreeList')
goog.async.FreeList = goog.defineClass(null, {constructor: function (create, reset, limit) {
  this.limit_ = limit
  this.create_ = create
  this.reset_ = reset
  this.occupants_ = 0
  this.head_ = null
},
get: function () {
  var item
  if (this.occupants_ > 0) {
    this.occupants_--
    item = this.head_
    this.head_ = item.next
    item.next = null
  } else {
    item = this.create_()
  }
  return item
},
put: function (item) {
  this.reset_(item)
  if (this.occupants_ < this.limit_) {
    this.occupants_++
    item.next = this.head_
    this.head_ = item
  }
},
occupants: function () {
  return this.occupants_
}})
goog.provide('goog.async.WorkItem')
goog.provide('goog.async.WorkQueue')
goog.require('goog.asserts')
goog.require('goog.async.FreeList')
goog.async.WorkQueue = function () {
  this.workHead_ = null
  this.workTail_ = null
}
goog.define('goog.async.WorkQueue.DEFAULT_MAX_UNUSED', 100)
goog.async.WorkQueue.freelist_ = new goog.async.FreeList(function () {
  return new goog.async.WorkItem()
}, function (item) {
  item.reset()
}, goog.async.WorkQueue.DEFAULT_MAX_UNUSED)
goog.async.WorkQueue.prototype.add = function (fn, scope) {
  var item = this.getUnusedItem_()
  item.set(fn, scope)
  if (this.workTail_) {
    this.workTail_.next = item
    this.workTail_ = item
  } else {
    goog.asserts.assert(!this.workHead_)
    this.workHead_ = item
    this.workTail_ = item
  }
}
goog.async.WorkQueue.prototype.remove = function () {
  var item = null
  if (this.workHead_) {
    item = this.workHead_
    this.workHead_ = this.workHead_.next
    if (!this.workHead_) {
      this.workTail_ = null
    }
    item.next = null
  }
  return item
}
goog.async.WorkQueue.prototype.returnUnused = function (item) {
  goog.async.WorkQueue.freelist_.put(item)
}
goog.async.WorkQueue.prototype.getUnusedItem_ = function () {
  return goog.async.WorkQueue.freelist_.get()
}
goog.async.WorkItem = function () {
  this.fn = null
  this.scope = null
  this.next = null
}
goog.async.WorkItem.prototype.set = function (fn, scope) {
  this.fn = fn
  this.scope = scope
  this.next = null
}
goog.async.WorkItem.prototype.reset = function () {
  this.fn = null
  this.scope = null
  this.next = null
}
goog.provide('goog.debug.EntryPointMonitor')
goog.provide('goog.debug.entryPointRegistry')
goog.require('goog.asserts')
goog.debug.EntryPointMonitor = function () {
}
goog.debug.EntryPointMonitor.prototype.wrap
goog.debug.EntryPointMonitor.prototype.unwrap
goog.debug.entryPointRegistry.refList_ = []
goog.debug.entryPointRegistry.monitors_ = []
goog.debug.entryPointRegistry.monitorsMayExist_ = false
goog.debug.entryPointRegistry.register = function (callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    var monitors = goog.debug.entryPointRegistry.monitors_
    for (var i = 0; i < monitors.length; i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]))
    }
  }
}
goog.debug.entryPointRegistry.monitorAll = function (monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true
  var transformer = goog.bind(monitor.wrap, monitor)
  for (var i = 0; i < goog.debug.entryPointRegistry.refList_.length; i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor)
}
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function (monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_
  goog.asserts.assert(monitor == monitors[monitors.length - 1], 'Only the most recent monitor can be unwrapped.')
  var transformer = goog.bind(monitor.unwrap, monitor)
  for (var i = 0; i < goog.debug.entryPointRegistry.refList_.length; i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
  monitors.length--
}
goog.provide('goog.dom.HtmlElement')
goog.dom.HtmlElement = function () {
}
goog.provide('goog.dom.TagName')
goog.require('goog.dom.HtmlElement')
goog.dom.TagName = function (tagName) {
  this.tagName_ = tagName
}
goog.dom.TagName.prototype.toString = function () {
  return this.tagName_
}
goog.dom.TagName.A = new goog.dom.TagName('A')
goog.dom.TagName.ABBR = new goog.dom.TagName('ABBR')
goog.dom.TagName.ACRONYM = new goog.dom.TagName('ACRONYM')
goog.dom.TagName.ADDRESS = new goog.dom.TagName('ADDRESS')
goog.dom.TagName.APPLET = new goog.dom.TagName('APPLET')
goog.dom.TagName.AREA = new goog.dom.TagName('AREA')
goog.dom.TagName.ARTICLE = new goog.dom.TagName('ARTICLE')
goog.dom.TagName.ASIDE = new goog.dom.TagName('ASIDE')
goog.dom.TagName.AUDIO = new goog.dom.TagName('AUDIO')
goog.dom.TagName.B = new goog.dom.TagName('B')
goog.dom.TagName.BASE = new goog.dom.TagName('BASE')
goog.dom.TagName.BASEFONT = new goog.dom.TagName('BASEFONT')
goog.dom.TagName.BDI = new goog.dom.TagName('BDI')
goog.dom.TagName.BDO = new goog.dom.TagName('BDO')
goog.dom.TagName.BIG = new goog.dom.TagName('BIG')
goog.dom.TagName.BLOCKQUOTE = new goog.dom.TagName('BLOCKQUOTE')
goog.dom.TagName.BODY = new goog.dom.TagName('BODY')
goog.dom.TagName.BR = new goog.dom.TagName('BR')
goog.dom.TagName.BUTTON = new goog.dom.TagName('BUTTON')
goog.dom.TagName.CANVAS = new goog.dom.TagName('CANVAS')
goog.dom.TagName.CAPTION = new goog.dom.TagName('CAPTION')
goog.dom.TagName.CENTER = new goog.dom.TagName('CENTER')
goog.dom.TagName.CITE = new goog.dom.TagName('CITE')
goog.dom.TagName.CODE = new goog.dom.TagName('CODE')
goog.dom.TagName.COL = new goog.dom.TagName('COL')
goog.dom.TagName.COLGROUP = new goog.dom.TagName('COLGROUP')
goog.dom.TagName.COMMAND = new goog.dom.TagName('COMMAND')
goog.dom.TagName.DATA = new goog.dom.TagName('DATA')
goog.dom.TagName.DATALIST = new goog.dom.TagName('DATALIST')
goog.dom.TagName.DD = new goog.dom.TagName('DD')
goog.dom.TagName.DEL = new goog.dom.TagName('DEL')
goog.dom.TagName.DETAILS = new goog.dom.TagName('DETAILS')
goog.dom.TagName.DFN = new goog.dom.TagName('DFN')
goog.dom.TagName.DIALOG = new goog.dom.TagName('DIALOG')
goog.dom.TagName.DIR = new goog.dom.TagName('DIR')
goog.dom.TagName.DIV = new goog.dom.TagName('DIV')
goog.dom.TagName.DL = new goog.dom.TagName('DL')
goog.dom.TagName.DT = new goog.dom.TagName('DT')
goog.dom.TagName.EM = new goog.dom.TagName('EM')
goog.dom.TagName.EMBED = new goog.dom.TagName('EMBED')
goog.dom.TagName.FIELDSET = new goog.dom.TagName('FIELDSET')
goog.dom.TagName.FIGCAPTION = new goog.dom.TagName('FIGCAPTION')
goog.dom.TagName.FIGURE = new goog.dom.TagName('FIGURE')
goog.dom.TagName.FONT = new goog.dom.TagName('FONT')
goog.dom.TagName.FOOTER = new goog.dom.TagName('FOOTER')
goog.dom.TagName.FORM = new goog.dom.TagName('FORM')
goog.dom.TagName.FRAME = new goog.dom.TagName('FRAME')
goog.dom.TagName.FRAMESET = new goog.dom.TagName('FRAMESET')
goog.dom.TagName.H1 = new goog.dom.TagName('H1')
goog.dom.TagName.H2 = new goog.dom.TagName('H2')
goog.dom.TagName.H3 = new goog.dom.TagName('H3')
goog.dom.TagName.H4 = new goog.dom.TagName('H4')
goog.dom.TagName.H5 = new goog.dom.TagName('H5')
goog.dom.TagName.H6 = new goog.dom.TagName('H6')
goog.dom.TagName.HEAD = new goog.dom.TagName('HEAD')
goog.dom.TagName.HEADER = new goog.dom.TagName('HEADER')
goog.dom.TagName.HGROUP = new goog.dom.TagName('HGROUP')
goog.dom.TagName.HR = new goog.dom.TagName('HR')
goog.dom.TagName.HTML = new goog.dom.TagName('HTML')
goog.dom.TagName.I = new goog.dom.TagName('I')
goog.dom.TagName.IFRAME = new goog.dom.TagName('IFRAME')
goog.dom.TagName.IMG = new goog.dom.TagName('IMG')
goog.dom.TagName.INPUT = new goog.dom.TagName('INPUT')
goog.dom.TagName.INS = new goog.dom.TagName('INS')
goog.dom.TagName.ISINDEX = new goog.dom.TagName('ISINDEX')
goog.dom.TagName.KBD = new goog.dom.TagName('KBD')
goog.dom.TagName.KEYGEN = new goog.dom.TagName('KEYGEN')
goog.dom.TagName.LABEL = new goog.dom.TagName('LABEL')
goog.dom.TagName.LEGEND = new goog.dom.TagName('LEGEND')
goog.dom.TagName.LI = new goog.dom.TagName('LI')
goog.dom.TagName.LINK = new goog.dom.TagName('LINK')
goog.dom.TagName.MAP = new goog.dom.TagName('MAP')
goog.dom.TagName.MARK = new goog.dom.TagName('MARK')
goog.dom.TagName.MATH = new goog.dom.TagName('MATH')
goog.dom.TagName.MENU = new goog.dom.TagName('MENU')
goog.dom.TagName.META = new goog.dom.TagName('META')
goog.dom.TagName.METER = new goog.dom.TagName('METER')
goog.dom.TagName.NAV = new goog.dom.TagName('NAV')
goog.dom.TagName.NOFRAMES = new goog.dom.TagName('NOFRAMES')
goog.dom.TagName.NOSCRIPT = new goog.dom.TagName('NOSCRIPT')
goog.dom.TagName.OBJECT = new goog.dom.TagName('OBJECT')
goog.dom.TagName.OL = new goog.dom.TagName('OL')
goog.dom.TagName.OPTGROUP = new goog.dom.TagName('OPTGROUP')
goog.dom.TagName.OPTION = new goog.dom.TagName('OPTION')
goog.dom.TagName.OUTPUT = new goog.dom.TagName('OUTPUT')
goog.dom.TagName.P = new goog.dom.TagName('P')
goog.dom.TagName.PARAM = new goog.dom.TagName('PARAM')
goog.dom.TagName.PRE = new goog.dom.TagName('PRE')
goog.dom.TagName.PROGRESS = new goog.dom.TagName('PROGRESS')
goog.dom.TagName.Q = new goog.dom.TagName('Q')
goog.dom.TagName.RP = new goog.dom.TagName('RP')
goog.dom.TagName.RT = new goog.dom.TagName('RT')
goog.dom.TagName.RUBY = new goog.dom.TagName('RUBY')
goog.dom.TagName.S = new goog.dom.TagName('S')
goog.dom.TagName.SAMP = new goog.dom.TagName('SAMP')
goog.dom.TagName.SCRIPT = new goog.dom.TagName('SCRIPT')
goog.dom.TagName.SECTION = new goog.dom.TagName('SECTION')
goog.dom.TagName.SELECT = new goog.dom.TagName('SELECT')
goog.dom.TagName.SMALL = new goog.dom.TagName('SMALL')
goog.dom.TagName.SOURCE = new goog.dom.TagName('SOURCE')
goog.dom.TagName.SPAN = new goog.dom.TagName('SPAN')
goog.dom.TagName.STRIKE = new goog.dom.TagName('STRIKE')
goog.dom.TagName.STRONG = new goog.dom.TagName('STRONG')
goog.dom.TagName.STYLE = new goog.dom.TagName('STYLE')
goog.dom.TagName.SUB = new goog.dom.TagName('SUB')
goog.dom.TagName.SUMMARY = new goog.dom.TagName('SUMMARY')
goog.dom.TagName.SUP = new goog.dom.TagName('SUP')
goog.dom.TagName.SVG = new goog.dom.TagName('SVG')
goog.dom.TagName.TABLE = new goog.dom.TagName('TABLE')
goog.dom.TagName.TBODY = new goog.dom.TagName('TBODY')
goog.dom.TagName.TD = new goog.dom.TagName('TD')
goog.dom.TagName.TEMPLATE = new goog.dom.TagName('TEMPLATE')
goog.dom.TagName.TEXTAREA = new goog.dom.TagName('TEXTAREA')
goog.dom.TagName.TFOOT = new goog.dom.TagName('TFOOT')
goog.dom.TagName.TH = new goog.dom.TagName('TH')
goog.dom.TagName.THEAD = new goog.dom.TagName('THEAD')
goog.dom.TagName.TIME = new goog.dom.TagName('TIME')
goog.dom.TagName.TITLE = new goog.dom.TagName('TITLE')
goog.dom.TagName.TR = new goog.dom.TagName('TR')
goog.dom.TagName.TRACK = new goog.dom.TagName('TRACK')
goog.dom.TagName.TT = new goog.dom.TagName('TT')
goog.dom.TagName.U = new goog.dom.TagName('U')
goog.dom.TagName.UL = new goog.dom.TagName('UL')
goog.dom.TagName.VAR = new goog.dom.TagName('VAR')
goog.dom.TagName.VIDEO = new goog.dom.TagName('VIDEO')
goog.dom.TagName.WBR = new goog.dom.TagName('WBR')
goog.provide('goog.functions')
goog.functions.constant = function (retValue) {
  return function () {
    return retValue
  }
}
goog.functions.FALSE = goog.functions.constant(false)
goog.functions.TRUE = goog.functions.constant(true)
goog.functions.NULL = goog.functions.constant(null)
goog.functions.identity = function (opt_returnValue, var_args) {
  return opt_returnValue
}
goog.functions.error = function (message) {
  return function () {
    throw new Error(message)
  }
}
goog.functions.fail = function (err) {
  return function () {
    throw err
  }
}
goog.functions.lock = function (f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0
  return function () {
    var self = this
    return f.apply(self, Array.prototype.slice.call(arguments, 0, opt_numArgs))
  }
}
goog.functions.nth = function (n) {
  return function () {
    return arguments[n]
  }
}
goog.functions.partialRight = function (fn, var_args) {
  var rightArgs = Array.prototype.slice.call(arguments, 1)
  return function () {
    var self = this
    var newArgs = Array.prototype.slice.call(arguments)
    newArgs.push.apply(newArgs, rightArgs)
    return fn.apply(self, newArgs)
  }
}
goog.functions.withReturnValue = function (f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue))
}
goog.functions.equalTo = function (value, opt_useLooseComparison) {
  return function (other) {
    return opt_useLooseComparison ? value == other : value === other
  }
}
goog.functions.compose = function (fn, var_args) {
  var functions = arguments
  var length = functions.length
  return function () {
    var self = this
    var result
    if (length) {
      result = functions[length - 1].apply(self, arguments)
    }
    for (var i = length - 2; i >= 0; i--) {
      result = functions[i].call(self, result)
    }
    return result
  }
}
goog.functions.sequence = function (var_args) {
  var functions = arguments
  var length = functions.length
  return function () {
    var self = this
    var result
    for (var i = 0; i < length; i++) {
      result = functions[i].apply(self, arguments)
    }
    return result
  }
}
goog.functions.and = function (var_args) {
  var functions = arguments
  var length = functions.length
  return function () {
    var self = this
    for (var i = 0; i < length; i++) {
      if (!functions[i].apply(self, arguments)) {
        return false
      }
    }
    return true
  }
}
goog.functions.or = function (var_args) {
  var functions = arguments
  var length = functions.length
  return function () {
    var self = this
    for (var i = 0; i < length; i++) {
      if (functions[i].apply(self, arguments)) {
        return true
      }
    }
    return false
  }
}
goog.functions.not = function (f) {
  return function () {
    var self = this
    return !f.apply(self, arguments)
  }
}
goog.functions.create = function (constructor, var_args) {
  var temp = function () {
  }
  temp.prototype = constructor.prototype
  var obj = new temp()
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1))
  return obj
}
goog.define('goog.functions.CACHE_RETURN_VALUE', true)
goog.functions.cacheReturnValue = function (fn) {
  var called = false
  var value
  return function () {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn()
    }
    if (!called) {
      value = fn()
      called = true
    }
    return value
  }
}
goog.functions.once = function (f) {
  var inner = f
  return function () {
    if (inner) {
      var tmp = inner
      inner = null
      tmp()
    }
  }
}
goog.functions.debounce = function (f, interval, opt_scope) {
  var timeout = 0
  return function (var_args) {
    goog.global.clearTimeout(timeout)
    var args = arguments
    timeout = goog.global.setTimeout(function () {
      f.apply(opt_scope, args)
    }, interval)
  }
}
goog.functions.throttle = function (f, interval, opt_scope) {
  var timeout = 0
  var shouldFire = false
  var args = []
  var handleTimeout = function () {
    timeout = 0
    if (shouldFire) {
      shouldFire = false
      fire()
    }
  }
  var fire = function () {
    timeout = goog.global.setTimeout(handleTimeout, interval)
    f.apply(opt_scope, args)
  }
  return function (var_args) {
    args = arguments
    if (!timeout) {
      fire()
    } else {
      shouldFire = true
    }
  }
}
goog.functions.rateLimit = function (f, interval, opt_scope) {
  var timeout = 0
  var handleTimeout = function () {
    timeout = 0
  }
  return function (var_args) {
    if (!timeout) {
      timeout = goog.global.setTimeout(handleTimeout, interval)
      f.apply(opt_scope, arguments)
    }
  }
}
goog.provide('goog.array')
goog.require('goog.asserts')
goog.define('goog.NATIVE_ARRAY_PROTOTYPES', goog.TRUSTED_SITE)
goog.define('goog.array.ASSUME_NATIVE_FUNCTIONS', false)
goog.array.peek = function (array) {
  return array[array.length - 1]
}
goog.array.last = goog.array.peek
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function (arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex)
} : function (arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1
    }
    return arr.indexOf(obj, fromIndex)
  }
  for (var i = fromIndex; i < arr.length; i++) {
    if (i in arr && arr[i] === obj) {
      return i
    }
  }
  return -1
}
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function (arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null)
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex
  return Array.prototype.lastIndexOf.call(arr, obj, fromIndex)
} : function (arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex)
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1
    }
    return arr.lastIndexOf(obj, fromIndex)
  }
  for (var i = fromIndex; i >= 0; i--) {
    if (i in arr && arr[i] === obj) {
      return i
    }
  }
  return -1
}
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null)
  Array.prototype.forEach.call(arr, f, opt_obj)
} : function (arr, f, opt_obj) {
  var l = arr.length
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = 0; i < l; i++) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
}
goog.array.forEachRight = function (arr, f, opt_obj) {
  var l = arr.length
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = l - 1; i >= 0; --i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
}
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.filter.call(arr, f, opt_obj)
} : function (arr, f, opt_obj) {
  var l = arr.length
  var res = []
  var resLength = 0
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = 0; i < l; i++) {
    if (i in arr2) {
      var val = arr2[i]
      if (f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val
      }
    }
  }
  return res
}
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.map.call(arr, f, opt_obj)
} : function (arr, f, opt_obj) {
  var l = arr.length
  var res = new Array(l)
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = 0; i < l; i++) {
    if (i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr)
    }
  }
  return res
}
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function (arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null)
  if (opt_obj) {
    f = goog.bind(f, opt_obj)
  }
  return Array.prototype.reduce.call(arr, f, val)
} : function (arr, f, val, opt_obj) {
  var rval = val
  goog.array.forEach(arr, function (val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  })
  return rval
}
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function (arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null)
  goog.asserts.assert(f != null)
  if (opt_obj) {
    f = goog.bind(f, opt_obj)
  }
  return Array.prototype.reduceRight.call(arr, f, val)
} : function (arr, f, val, opt_obj) {
  var rval = val
  goog.array.forEachRight(arr, function (val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  })
  return rval
}
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.some.call(arr, f, opt_obj)
} : function (arr, f, opt_obj) {
  var l = arr.length
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = 0; i < l; i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true
    }
  }
  return false
}
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.every.call(arr, f, opt_obj)
} : function (arr, f, opt_obj) {
  var l = arr.length
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = 0; i < l; i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false
    }
  }
  return true
}
goog.array.count = function (arr, f, opt_obj) {
  var count = 0
  goog.array.forEach(arr, function (element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count
    }
  }, opt_obj)
  return count
}
goog.array.find = function (arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj)
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
}
goog.array.findIndex = function (arr, f, opt_obj) {
  var l = arr.length
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = 0; i < l; i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return -1
}
goog.array.findRight = function (arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj)
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
}
goog.array.findIndexRight = function (arr, f, opt_obj) {
  var l = arr.length
  var arr2 = goog.isString(arr) ? arr.split('') : arr
  for (var i = l - 1; i >= 0; i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return -1
}
goog.array.contains = function (arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0
}
goog.array.isEmpty = function (arr) {
  return arr.length == 0
}
goog.array.clear = function (arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1; i >= 0; i--) {
      delete arr[i]
    }
  }
  arr.length = 0
}
goog.array.insert = function (arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj)
  }
}
goog.array.insertAt = function (arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj)
}
goog.array.insertArrayAt = function (arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
}
goog.array.insertBefore = function (arr, obj, opt_obj2) {
  var i
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj)
  } else {
    goog.array.insertAt(arr, obj, i)
  }
}
goog.array.remove = function (arr, obj) {
  var i = goog.array.indexOf(arr, obj)
  var rv
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i)
  }
  return rv
}
goog.array.removeLast = function (arr, obj) {
  var i = goog.array.lastIndexOf(arr, obj)
  if (i >= 0) {
    goog.array.removeAt(arr, i)
    return true
  }
  return false
}
goog.array.removeAt = function (arr, i) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.splice.call(arr, i, 1).length == 1
}
goog.array.removeIf = function (arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj)
  if (i >= 0) {
    goog.array.removeAt(arr, i)
    return true
  }
  return false
}
goog.array.removeAllIf = function (arr, f, opt_obj) {
  var removedCount = 0
  goog.array.forEachRight(arr, function (val, index) {
    if (f.call(opt_obj, val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++
      }
    }
  })
  return removedCount
}
goog.array.concat = function (var_args) {
  return Array.prototype.concat.apply([], arguments)
}
goog.array.join = function (var_args) {
  return Array.prototype.concat.apply([], arguments)
}
goog.array.toArray = function (object) {
  var length = object.length
  if (length > 0) {
    var rv = new Array(length)
    for (var i = 0; i < length; i++) {
      rv[i] = object[i]
    }
    return rv
  }
  return []
}
goog.array.clone = goog.array.toArray
goog.array.extend = function (arr1, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var arr2 = arguments[i]
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0
      var len2 = arr2.length || 0
      arr1.length = len1 + len2
      for (var j = 0; j < len2; j++) {
        arr1[len1 + j] = arr2[j]
      }
    } else {
      arr1.push(arr2)
    }
  }
}
goog.array.splice = function (arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null)
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1))
}
goog.array.slice = function (arr, start, opt_end) {
  goog.asserts.assert(arr.length != null)
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start)
  } else {
    return Array.prototype.slice.call(arr, start, opt_end)
  }
}
goog.array.removeDuplicates = function (arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr
  var defaultHashFn = function (item) {
    return goog.isObject(item) ? 'o' + goog.getUid(item) : (typeof item).charAt(0) + item
  }
  var hashFn = opt_hashFn || defaultHashFn
  var seen = {}, cursorInsert = 0, cursorRead = 0
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++]
    var key = hashFn(current)
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true
      returnArray[cursorInsert++] = current
    }
  }
  returnArray.length = cursorInsert
}
goog.array.binarySearch = function (arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
}
goog.array.binarySelect = function (arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
}
goog.array.binarySearch_ = function (arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0
  var right = arr.length
  var found
  while (left < right) {
    var middle = left + right >> 1
    var compareResult
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr)
    } else {
      compareResult = compareFn(opt_target, arr[middle])
    }
    if (compareResult > 0) {
      left = middle + 1
    } else {
      right = middle
      found = !compareResult
    }
  }
  return found ? left : ~left
}
goog.array.sort = function (arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare)
}
goog.array.stableSort = function (arr, opt_compareFn) {
  var compArr = new Array(arr.length)
  for (var i = 0; i < arr.length; i++) {
    compArr[i] = {index: i, value: arr[i]}
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare
  function stableCompareFn (obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
  }
  goog.array.sort(compArr, stableCompareFn)
  for (var i = 0; i < arr.length; i++) {
    arr[i] = compArr[i].value
  }
}
goog.array.sortByKey = function (arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare
  goog.array.sort(arr, function (a, b) {
    return keyCompareFn(keyFn(a), keyFn(b))
  })
}
goog.array.sortObjectsByKey = function (arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function (obj) {
    return obj[key]
  }, opt_compareFn)
}
goog.array.isSorted = function (arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare
  for (var i = 1; i < arr.length; i++) {
    var compareResult = compare(arr[i - 1], arr[i])
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false
    }
  }
  return true
}
goog.array.equals = function (arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false
  }
  var l = arr1.length
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality
  for (var i = 0; i < l; i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
}
goog.array.compare3 = function (arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare
  var l = Math.min(arr1.length, arr2.length)
  for (var i = 0; i < l; i++) {
    var result = compare(arr1[i], arr2[i])
    if (result != 0) {
      return result
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length)
}
goog.array.defaultCompare = function (a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}
goog.array.inverseDefaultCompare = function (a, b) {
  return -goog.array.defaultCompare(a, b)
}
goog.array.defaultCompareEquality = function (a, b) {
  return a === b
}
goog.array.binaryInsert = function (array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn)
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1))
    return true
  }
  return false
}
goog.array.binaryRemove = function (array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn)
  return index >= 0 ? goog.array.removeAt(array, index) : false
}
goog.array.bucket = function (array, sorter, opt_obj) {
  var buckets = {}
  for (var i = 0; i < array.length; i++) {
    var value = array[i]
    var key = sorter.call(opt_obj, value, i, array)
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = [])
      bucket.push(value)
    }
  }
  return buckets
}
goog.array.toObject = function (arr, keyFunc, opt_obj) {
  var ret = {}
  goog.array.forEach(arr, function (element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element
  })
  return ret
}
goog.array.range = function (startOrEnd, opt_end, opt_step) {
  var array = []
  var start = 0
  var end = startOrEnd
  var step = opt_step || 1
  if (opt_end !== undefined) {
    start = startOrEnd
    end = opt_end
  }
  if (step * (end - start) < 0) {
    return []
  }
  if (step > 0) {
    for (var i = start; i < end; i += step) {
      array.push(i)
    }
  } else {
    for (var i = start; i > end; i += step) {
      array.push(i)
    }
  }
  return array
}
goog.array.repeat = function (value, n) {
  var array = []
  for (var i = 0; i < n; i++) {
    array[i] = value
  }
  return array
}
goog.array.flatten = function (var_args) {
  var CHUNK_SIZE = 8192
  var result = []
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i]
    if (goog.isArray(element)) {
      for (var c = 0; c < element.length; c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE)
        var recurseResult = goog.array.flatten.apply(null, chunk)
        for (var r = 0; r < recurseResult.length; r++) {
          result.push(recurseResult[r])
        }
      }
    } else {
      result.push(element)
    }
  }
  return result
}
goog.array.rotate = function (array, n) {
  goog.asserts.assert(array.length != null)
  if (array.length) {
    n %= array.length
    if (n > 0) {
      Array.prototype.unshift.apply(array, array.splice(-n, n))
    } else {
      if (n < 0) {
        Array.prototype.push.apply(array, array.splice(0, -n))
      }
    }
  }
  return array
}
goog.array.moveItem = function (arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length)
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length)
  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1)
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0])
}
goog.array.zip = function (var_args) {
  if (!arguments.length) {
    return []
  }
  var result = []
  var minLen = arguments[0].length
  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i].length < minLen) {
      minLen = arguments[i].length
    }
  }
  for (var i = 0; i < minLen; i++) {
    var value = []
    for (var j = 0; j < arguments.length; j++) {
      value.push(arguments[j][i])
    }
    result.push(value)
  }
  return result
}
goog.array.shuffle = function (arr, opt_randFn) {
  var randFn = opt_randFn || Math.random
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(randFn() * (i + 1))
    var tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}
goog.array.copyByIndex = function (arr, index_arr) {
  var result = []
  goog.array.forEach(index_arr, function (index) {
    result.push(arr[index])
  })
  return result
}
goog.array.concatMap = function (arr, f, opt_obj) {
  return goog.array.concat.apply([], goog.array.map(arr, f, opt_obj))
}
goog.provide('goog.labs.userAgent.util')
goog.require('goog.string')
goog.labs.userAgent.util.getNativeUserAgentString_ = function () {
  var navigator = goog.labs.userAgent.util.getNavigator_()
  if (navigator) {
    var userAgent = navigator.userAgent
    if (userAgent) {
      return userAgent
    }
  }
  return ''
}
goog.labs.userAgent.util.getNavigator_ = function () {
  return goog.global.navigator
}
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_()
goog.labs.userAgent.util.setUserAgent = function (opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_()
}
goog.labs.userAgent.util.getUserAgent = function () {
  return goog.labs.userAgent.util.userAgent_
}
goog.labs.userAgent.util.matchUserAgent = function (str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent()
  return goog.string.contains(userAgent, str)
}
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function (str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent()
  return goog.string.caseInsensitiveContains(userAgent, str)
}
goog.labs.userAgent.util.extractVersionTuples = function (userAgent) {
  var versionRegExp = new RegExp('(\\w[\\w ]+)' + '/' + '([^\\s]+)' + '\\s*' + '(?:\\((.*?)\\))?', 'g')
  var data = []
  var match
  while (match = versionRegExp.exec(userAgent)) {
    data.push([match[1], match[2], match[3] || undefined])
  }
  return data
}
goog.provide('goog.object')
goog.object.is = function (v, v2) {
  if (v === v2) {
    return v !== 0 || 1 / v === 1 / v2
  }
  return v !== v && v2 !== v2
}
goog.object.forEach = function (obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj)
  }
}
goog.object.filter = function (obj, f, opt_obj) {
  var res = {}
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key]
    }
  }
  return res
}
goog.object.map = function (obj, f, opt_obj) {
  var res = {}
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj)
  }
  return res
}
goog.object.some = function (obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true
    }
  }
  return false
}
goog.object.every = function (obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false
    }
  }
  return true
}
goog.object.getCount = function (obj) {
  var rv = 0
  for (var key in obj) {
    rv++
  }
  return rv
}
goog.object.getAnyKey = function (obj) {
  for (var key in obj) {
    return key
  }
}
goog.object.getAnyValue = function (obj) {
  for (var key in obj) {
    return obj[key]
  }
}
goog.object.contains = function (obj, val) {
  return goog.object.containsValue(obj, val)
}
goog.object.getValues = function (obj) {
  var res = []
  var i = 0
  for (var key in obj) {
    res[i++] = obj[key]
  }
  return res
}
goog.object.getKeys = function (obj) {
  var res = []
  var i = 0
  for (var key in obj) {
    res[i++] = key
  }
  return res
}
goog.object.getValueByKeys = function (obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args)
  var keys = isArrayLike ? var_args : arguments
  for (var i = isArrayLike ? 0 : 1; i < keys.length; i++) {
    if (obj == null) {
      return undefined
    }
    obj = obj[keys[i]]
  }
  return obj
}
goog.object.containsKey = function (obj, key) {
  return obj !== null && key in obj
}
goog.object.containsValue = function (obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true
    }
  }
  return false
}
goog.object.findKey = function (obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key
    }
  }
  return undefined
}
goog.object.findValue = function (obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this)
  return key && obj[key]
}
goog.object.isEmpty = function (obj) {
  for (var key in obj) {
    return false
  }
  return true
}
goog.object.clear = function (obj) {
  for (var i in obj) {
    delete obj[i]
  }
}
goog.object.remove = function (obj, key) {
  var rv
  if (rv = key in obj) {
    delete obj[key]
  }
  return rv
}
goog.object.add = function (obj, key, val) {
  if (obj !== null && key in obj) {
    throw new Error('The object already contains the key "' + key + '"')
  }
  goog.object.set(obj, key, val)
}
goog.object.get = function (obj, key, opt_val) {
  if (obj !== null && key in obj) {
    return obj[key]
  }
  return opt_val
}
goog.object.set = function (obj, key, value) {
  obj[key] = value
}
goog.object.setIfUndefined = function (obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value
}
goog.object.setWithReturnValueIfNotSet = function (obj, key, f) {
  if (key in obj) {
    return obj[key]
  }
  var val = f()
  obj[key] = val
  return val
}
goog.object.equals = function (a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return false
    }
  }
  for (var k in b) {
    if (!(k in a)) {
      return false
    }
  }
  return true
}
goog.object.clone = function (obj) {
  var res = {}
  for (var key in obj) {
    res[key] = obj[key]
  }
  return res
}
goog.object.unsafeClone = function (obj) {
  var type = goog.typeOf(obj)
  if (type == 'object' || type == 'array') {
    if (goog.isFunction(obj.clone)) {
      return obj.clone()
    }
    var clone = type == 'array' ? [] : {}
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key])
    }
    return clone
  }
  return obj
}
goog.object.transpose = function (obj) {
  var transposed = {}
  for (var key in obj) {
    transposed[obj[key]] = key
  }
  return transposed
}
goog.object.PROTOTYPE_FIELDS_ = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf']
goog.object.extend = function (target, var_args) {
  var key, source
  for (var i = 1; i < arguments.length; i++) {
    source = arguments[i]
    for (key in source) {
      target[key] = source[key]
    }
    for (var j = 0; j < goog.object.PROTOTYPE_FIELDS_.length; j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j]
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
}
goog.object.create = function (var_args) {
  var argLength = arguments.length
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if (argLength % 2) {
    throw new Error('Uneven number of arguments')
  }
  var rv = {}
  for (var i = 0; i < argLength; i += 2) {
    rv[arguments[i]] = arguments[i + 1]
  }
  return rv
}
goog.object.createSet = function (var_args) {
  var argLength = arguments.length
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var rv = {}
  for (var i = 0; i < argLength; i++) {
    rv[arguments[i]] = true
  }
  return rv
}
goog.object.createImmutableView = function (obj) {
  var result = obj
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj)
    Object.freeze(result)
  }
  return result
}
goog.object.isImmutableView = function (obj) {
  return !!Object.isFrozen && Object.isFrozen(obj)
}
goog.object.getAllPropertyNames = function (obj, opt_includeObjectPrototype, opt_includeFunctionPrototype) {
  if (!obj) {
    return []
  }
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
    return goog.object.getKeys(obj)
  }
  var visitedSet = {}
  var proto = obj
  while (proto && (proto !== Object.prototype || !!opt_includeObjectPrototype) && (proto !== Function.prototype || !!opt_includeFunctionPrototype)) {
    var names = Object.getOwnPropertyNames(proto)
    for (var i = 0; i < names.length; i++) {
      visitedSet[names[i]] = true
    }
    proto = Object.getPrototypeOf(proto)
  }
  return goog.object.getKeys(visitedSet)
}
goog.provide('goog.labs.userAgent.browser')
goog.require('goog.array')
goog.require('goog.labs.userAgent.util')
goog.require('goog.object')
goog.require('goog.string')
goog.labs.userAgent.browser.matchOpera_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Opera')
}
goog.labs.userAgent.browser.matchIE_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Trident') || goog.labs.userAgent.util.matchUserAgent('MSIE')
}
goog.labs.userAgent.browser.matchEdge_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Edge')
}
goog.labs.userAgent.browser.matchFirefox_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Firefox')
}
goog.labs.userAgent.browser.matchSafari_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Safari') && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent('Android'))
}
goog.labs.userAgent.browser.matchCoast_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Coast')
}
goog.labs.userAgent.browser.matchIosWebview_ = function () {
  return (goog.labs.userAgent.util.matchUserAgent('iPad') || goog.labs.userAgent.util.matchUserAgent('iPhone')) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent('AppleWebKit')
}
goog.labs.userAgent.browser.matchChrome_ = function () {
  return (goog.labs.userAgent.util.matchUserAgent('Chrome') || goog.labs.userAgent.util.matchUserAgent('CriOS')) && !goog.labs.userAgent.browser.matchEdge_()
}
goog.labs.userAgent.browser.matchAndroidBrowser_ = function () {
  return goog.labs.userAgent.util.matchUserAgent('Android') && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk())
}
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_
goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_
goog.labs.userAgent.browser.isSilk = function () {
  return goog.labs.userAgent.util.matchUserAgent('Silk')
}
goog.labs.userAgent.browser.getVersion = function () {
  var userAgentString = goog.labs.userAgent.util.getUserAgent()
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString)
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString)
  var versionMap = {}
  goog.array.forEach(versionTuples, function (tuple) {
    var key = tuple[0]
    var value = tuple[1]
    versionMap[key] = value
  })
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap)
  function lookUpValueWithKeys (keys) {
    var key = goog.array.find(keys, versionMapHasKey)
    return versionMap[key] || ''
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(['Version', 'Opera'])
  }
  if (goog.labs.userAgent.browser.isEdge()) {
    return lookUpValueWithKeys(['Edge'])
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(['Chrome', 'CriOS'])
  }
  var tuple = versionTuples[2]
  return tuple && tuple[1] || ''
}
goog.labs.userAgent.browser.isVersionOrHigher = function (version) {
  return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0
}
goog.labs.userAgent.browser.getIEVersion_ = function (userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent)
  if (rv && rv[1]) {
    return rv[1]
  }
  var version = ''
  var msie = /MSIE +([\d\.]+)/.exec(userAgent)
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent)
    if (msie[1] == '7.0') {
      if (tridentVersion && tridentVersion[1]) {
        switch (tridentVersion[1]) {
          case '4.0':
            version = '8.0'
            break
          case '5.0':
            version = '9.0'
            break
          case '6.0':
            version = '10.0'
            break
          case '7.0':
            version = '11.0'
            break
        }
      } else {
        version = '7.0'
      }
    } else {
      version = msie[1]
    }
  }
  return version
}
goog.provide('goog.labs.userAgent.engine')
goog.require('goog.array')
goog.require('goog.labs.userAgent.util')
goog.require('goog.string')
goog.labs.userAgent.engine.isPresto = function () {
  return goog.labs.userAgent.util.matchUserAgent('Presto')
}
goog.labs.userAgent.engine.isTrident = function () {
  return goog.labs.userAgent.util.matchUserAgent('Trident') || goog.labs.userAgent.util.matchUserAgent('MSIE')
}
goog.labs.userAgent.engine.isEdge = function () {
  return goog.labs.userAgent.util.matchUserAgent('Edge')
}
goog.labs.userAgent.engine.isWebKit = function () {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase('WebKit') && !goog.labs.userAgent.engine.isEdge()
}
goog.labs.userAgent.engine.isGecko = function () {
  return goog.labs.userAgent.util.matchUserAgent('Gecko') && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge()
}
goog.labs.userAgent.engine.getVersion = function () {
  var userAgentString = goog.labs.userAgent.util.getUserAgent()
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString)
    var engineTuple = goog.labs.userAgent.engine.getEngineTuple_(tuples)
    if (engineTuple) {
      if (engineTuple[0] == 'Gecko') {
        return goog.labs.userAgent.engine.getVersionForKey_(tuples, 'Firefox')
      }
      return engineTuple[1]
    }
    var browserTuple = tuples[0]
    var info
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info)
      if (match) {
        return match[1]
      }
    }
  }
  return ''
}
goog.labs.userAgent.engine.getEngineTuple_ = function (tuples) {
  if (!goog.labs.userAgent.engine.isEdge()) {
    return tuples[1]
  }
  for (var i = 0; i < tuples.length; i++) {
    var tuple = tuples[i]
    if (tuple[0] == 'Edge') {
      return tuple
    }
  }
}
goog.labs.userAgent.engine.isVersionOrHigher = function (version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0
}
goog.labs.userAgent.engine.getVersionForKey_ = function (tuples, key) {
  var pair = goog.array.find(tuples, function (pair) {
    return key == pair[0]
  })
  return pair && pair[1] || ''
}
goog.provide('goog.async.nextTick')
goog.provide('goog.async.throwException')
goog.require('goog.debug.entryPointRegistry')
goog.require('goog.dom.TagName')
goog.require('goog.functions')
goog.require('goog.labs.userAgent.browser')
goog.require('goog.labs.userAgent.engine')
goog.async.throwException = function (exception) {
  goog.global.setTimeout(function () {
    throw exception
  }, 0)
}
goog.async.nextTick = function (callback, opt_context, opt_useSetImmediate) {
  var cb = callback
  if (opt_context) {
    cb = goog.bind(callback, opt_context)
  }
  cb = goog.async.nextTick.wrapCallback_(cb)
  if (goog.isFunction(goog.global.setImmediate) && (opt_useSetImmediate || goog.async.nextTick.useSetImmediate_())) {
    goog.global.setImmediate(cb)
    return
  }
  if (!goog.async.nextTick.setImmediate_) {
    goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_()
  }
  goog.async.nextTick.setImmediate_(cb)
}
goog.async.nextTick.useSetImmediate_ = function () {
  if (!goog.global.Window || !goog.global.Window.prototype) {
    return true
  }
  if (goog.labs.userAgent.browser.isEdge() || goog.global.Window.prototype.setImmediate != goog.global.setImmediate) {
    return true
  }
  return false
}
goog.async.nextTick.setImmediate_
goog.async.nextTick.getSetImmediateEmulator_ = function () {
  var Channel = goog.global['MessageChannel']
  if (typeof Channel === 'undefined' && typeof window !== 'undefined' && window.postMessage && window.addEventListener && !goog.labs.userAgent.engine.isPresto()) {
    Channel = function () {
      var iframe = document.createElement(String(goog.dom.TagName.IFRAME))
      iframe.style.display = 'none'
      iframe.src = ''
      document.documentElement.appendChild(iframe)
      var win = iframe.contentWindow
      var doc = win.document
      doc.open()
      doc.write('')
      doc.close()
      var message = 'callImmediate' + Math.random()
      var origin = win.location.protocol == 'file:' ? '*' : win.location.protocol + '//' + win.location.host
      var onmessage = goog.bind(function (e) {
        if (origin != '*' && e.origin != origin || e.data != message) {
          return
        }
        this['port1'].onmessage()
      }, this)
      win.addEventListener('message', onmessage, false)
      this['port1'] = {}
      this['port2'] = {postMessage: function () {
        win.postMessage(message, origin)
      }}
    }
  }
  if (typeof Channel !== 'undefined' && !goog.labs.userAgent.browser.isIE()) {
    var channel = new Channel()
    var head = {}
    var tail = head
    channel['port1'].onmessage = function () {
      if (goog.isDef(head.next)) {
        head = head.next
        var cb = head.cb
        head.cb = null
        cb()
      }
    }
    return function (cb) {
      tail.next = {cb: cb}
      tail = tail.next
      channel['port2'].postMessage(0)
    }
  }
  if (typeof document !== 'undefined' && 'onreadystatechange' in document.createElement(String(goog.dom.TagName.SCRIPT))) {
    return function (cb) {
      var script = document.createElement(String(goog.dom.TagName.SCRIPT))
      script.onreadystatechange = function () {
        script.onreadystatechange = null
        script.parentNode.removeChild(script)
        script = null
        cb()
        cb = null
      }
      document.documentElement.appendChild(script)
    }
  }
  return function (cb) {
    goog.global.setTimeout(cb, 0)
  }
}
goog.async.nextTick.wrapCallback_ = goog.functions.identity
goog.debug.entryPointRegistry.register(function (transformer) {
  goog.async.nextTick.wrapCallback_ = transformer
})
goog.provide('goog.async.run')
goog.require('goog.async.WorkQueue')
goog.require('goog.async.nextTick')
goog.require('goog.async.throwException')
goog.async.run = function (callback, opt_context) {
  if (!goog.async.run.schedule_) {
    goog.async.run.initializeRunner_()
  }
  if (!goog.async.run.workQueueScheduled_) {
    goog.async.run.schedule_()
    goog.async.run.workQueueScheduled_ = true
  }
  goog.async.run.workQueue_.add(callback, opt_context)
}
goog.async.run.initializeRunner_ = function () {
  if (String(goog.global.Promise).indexOf('[native code]') != -1) {
    var promise = goog.global.Promise.resolve(undefined)
    goog.async.run.schedule_ = function () {
      promise.then(goog.async.run.processWorkQueue)
    }
  } else {
    goog.async.run.schedule_ = function () {
      goog.async.nextTick(goog.async.run.processWorkQueue)
    }
  }
}
goog.async.run.forceNextTick = function (opt_realSetTimeout) {
  goog.async.run.schedule_ = function () {
    goog.async.nextTick(goog.async.run.processWorkQueue)
    if (opt_realSetTimeout) {
      opt_realSetTimeout(goog.async.run.processWorkQueue)
    }
  }
}
goog.async.run.schedule_
goog.async.run.workQueueScheduled_ = false
goog.async.run.workQueue_ = new goog.async.WorkQueue()
if (goog.DEBUG) {
  goog.async.run.resetQueue = function () {
    goog.async.run.workQueueScheduled_ = false
    goog.async.run.workQueue_ = new goog.async.WorkQueue()
  }
}
goog.async.run.processWorkQueue = function () {
  var item = null
  while (item = goog.async.run.workQueue_.remove()) {
    try {
      item.fn.call(item.scope)
    } catch (e) {
      goog.async.throwException(e)
    }
    goog.async.run.workQueue_.returnUnused(item)
  }
  goog.async.run.workQueueScheduled_ = false
}
goog.provide('goog.promise.Resolver')
goog.promise.Resolver = function () {
}
goog.promise.Resolver.prototype.promise
goog.promise.Resolver.prototype.resolve
goog.promise.Resolver.prototype.reject
goog.provide('goog.Promise')
goog.require('goog.Thenable')
goog.require('goog.asserts')
goog.require('goog.async.FreeList')
goog.require('goog.async.run')
goog.require('goog.async.throwException')
goog.require('goog.debug.Error')
goog.require('goog.promise.Resolver')
goog.Promise = function (resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING
  this.result_ = undefined
  this.parent_ = null
  this.callbackEntries_ = null
  this.callbackEntriesTail_ = null
  this.executing_ = false
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    this.unhandledRejectionId_ = 0
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      this.hadUnhandledRejection_ = false
    }
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.stack_ = []
    this.addStackTrace_(new Error('created'))
    this.currentStep_ = 0
  }
  if (resolver != goog.nullFunction) {
    try {
      var self = this
      resolver.call(opt_context, function (value) {
        self.resolve_(goog.Promise.State_.FULFILLED, value)
      }, function (reason) {
        if (goog.DEBUG && !(reason instanceof goog.Promise.CancellationError)) {
          try {
            if (reason instanceof Error) {
              throw reason
            } else {
              throw new Error('Promise rejected.')
            }
          } catch (e) {
          }
        }
        self.resolve_(goog.Promise.State_.REJECTED, reason)
      })
    } catch (e) {
      this.resolve_(goog.Promise.State_.REJECTED, e)
    }
  }
}
goog.define('goog.Promise.LONG_STACK_TRACES', false)
goog.define('goog.Promise.UNHANDLED_REJECTION_DELAY', 0)
goog.Promise.State_ = {PENDING: 0, BLOCKED: 1, FULFILLED: 2, REJECTED: 3}
goog.Promise.CallbackEntry_ = function () {
  this.child = null
  this.onFulfilled = null
  this.onRejected = null
  this.context = null
  this.next = null
  this.always = false
}
goog.Promise.CallbackEntry_.prototype.reset = function () {
  this.child = null
  this.onFulfilled = null
  this.onRejected = null
  this.context = null
  this.always = false
}
goog.define('goog.Promise.DEFAULT_MAX_UNUSED', 100)
goog.Promise.freelist_ = new goog.async.FreeList(function () {
  return new goog.Promise.CallbackEntry_()
}, function (item) {
  item.reset()
}, goog.Promise.DEFAULT_MAX_UNUSED)
goog.Promise.getCallbackEntry_ = function (onFulfilled, onRejected, context) {
  var entry = goog.Promise.freelist_.get()
  entry.onFulfilled = onFulfilled
  entry.onRejected = onRejected
  entry.context = context
  return entry
}
goog.Promise.returnEntry_ = function (entry) {
  goog.Promise.freelist_.put(entry)
}
goog.Promise.resolve = function (opt_value) {
  if (opt_value instanceof goog.Promise) {
    return opt_value
  }
  var promise = new goog.Promise(goog.nullFunction)
  promise.resolve_(goog.Promise.State_.FULFILLED, opt_value)
  return promise
}
goog.Promise.reject = function (opt_reason) {
  return new goog.Promise(function (resolve, reject) {
    reject(opt_reason)
  })
}
goog.Promise.resolveThen_ = function (value, onFulfilled, onRejected) {
  var isThenable = goog.Promise.maybeThen_(value, onFulfilled, onRejected, null)
  if (!isThenable) {
    goog.async.run(goog.partial(onFulfilled, value))
  }
}
goog.Promise.race = function (promises) {
  return new goog.Promise(function (resolve, reject) {
    if (!promises.length) {
      resolve(undefined)
    }
    for (var i = 0, promise; i < promises.length; i++) {
      promise = promises[i]
      goog.Promise.resolveThen_(promise, resolve, reject)
    }
  })
}
goog.Promise.all = function (promises) {
  return new goog.Promise(function (resolve, reject) {
    var toFulfill = promises.length
    var values = []
    if (!toFulfill) {
      resolve(values)
      return
    }
    var onFulfill = function (index, value) {
      toFulfill--
      values[index] = value
      if (toFulfill == 0) {
        resolve(values)
      }
    }
    var onReject = function (reason) {
      reject(reason)
    }
    for (var i = 0, promise; i < promises.length; i++) {
      promise = promises[i]
      goog.Promise.resolveThen_(promise, goog.partial(onFulfill, i), onReject)
    }
  })
}
goog.Promise.allSettled = function (promises) {
  return new goog.Promise(function (resolve, reject) {
    var toSettle = promises.length
    var results = []
    if (!toSettle) {
      resolve(results)
      return
    }
    var onSettled = function (index, fulfilled, result) {
      toSettle--
      results[index] = fulfilled ? {fulfilled: true, value: result} : {fulfilled: false, reason: result}
      if (toSettle == 0) {
        resolve(results)
      }
    }
    for (var i = 0, promise; i < promises.length; i++) {
      promise = promises[i]
      goog.Promise.resolveThen_(promise, goog.partial(onSettled, i, true), goog.partial(onSettled, i, false))
    }
  })
}
goog.Promise.firstFulfilled = function (promises) {
  return new goog.Promise(function (resolve, reject) {
    var toReject = promises.length
    var reasons = []
    if (!toReject) {
      resolve(undefined)
      return
    }
    var onFulfill = function (value) {
      resolve(value)
    }
    var onReject = function (index, reason) {
      toReject--
      reasons[index] = reason
      if (toReject == 0) {
        reject(reasons)
      }
    }
    for (var i = 0, promise; i < promises.length; i++) {
      promise = promises[i]
      goog.Promise.resolveThen_(promise, onFulfill, goog.partial(onReject, i))
    }
  })
}
goog.Promise.withResolver = function () {
  var resolve, reject
  var promise = new goog.Promise(function (rs, rj) {
    resolve = rs
    reject = rj
  })
  return new goog.Promise.Resolver_(promise, resolve, reject)
}
goog.Promise.prototype.then = function (opt_onFulfilled, opt_onRejected, opt_context) {
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, 'opt_onFulfilled should be a function.')
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, 'opt_onRejected should be a function. Did you pass opt_context ' + 'as the second argument instead of the third?')
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('then'))
  }
  return this.addChildPromise_(goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, goog.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context)
}
goog.Thenable.addImplementation(goog.Promise)
goog.Promise.prototype.thenVoid = function (opt_onFulfilled, opt_onRejected, opt_context) {
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, 'opt_onFulfilled should be a function.')
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, 'opt_onRejected should be a function. Did you pass opt_context ' + 'as the second argument instead of the third?')
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('then'))
  }
  this.addCallbackEntry_(goog.Promise.getCallbackEntry_(opt_onFulfilled || goog.nullFunction, opt_onRejected || null, opt_context))
}
goog.Promise.prototype.thenAlways = function (onSettled, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('thenAlways'))
  }
  var entry = goog.Promise.getCallbackEntry_(onSettled, onSettled, opt_context)
  entry.always = true
  this.addCallbackEntry_(entry)
  return this
}
goog.Promise.prototype.thenCatch = function (onRejected, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('thenCatch'))
  }
  return this.addChildPromise_(null, onRejected, opt_context)
}
goog.Promise.prototype.cancel = function (opt_message) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    goog.async.run(function () {
      var err = new goog.Promise.CancellationError(opt_message)
      this.cancelInternal_(err)
    }, this)
  }
}
goog.Promise.prototype.cancelInternal_ = function (err) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    if (this.parent_) {
      this.parent_.cancelChild_(this, err)
      this.parent_ = null
    } else {
      this.resolve_(goog.Promise.State_.REJECTED, err)
    }
  }
}
goog.Promise.prototype.cancelChild_ = function (childPromise, err) {
  if (!this.callbackEntries_) {
    return
  }
  var childCount = 0
  var childEntry = null
  var beforeChildEntry = null
  for (var entry = this.callbackEntries_; entry; entry = entry.next) {
    if (!entry.always) {
      childCount++
      if (entry.child == childPromise) {
        childEntry = entry
      }
      if (childEntry && childCount > 1) {
        break
      }
    }
    if (!childEntry) {
      beforeChildEntry = entry
    }
  }
  if (childEntry) {
    if (this.state_ == goog.Promise.State_.PENDING && childCount == 1) {
      this.cancelInternal_(err)
    } else {
      if (beforeChildEntry) {
        this.removeEntryAfter_(beforeChildEntry)
      } else {
        this.popEntry_()
      }
      this.executeCallback_(childEntry, goog.Promise.State_.REJECTED, err)
    }
  }
}
goog.Promise.prototype.addCallbackEntry_ = function (callbackEntry) {
  if (!this.hasEntry_() && (this.state_ == goog.Promise.State_.FULFILLED || this.state_ == goog.Promise.State_.REJECTED)) {
    this.scheduleCallbacks_()
  }
  this.queueEntry_(callbackEntry)
}
goog.Promise.prototype.addChildPromise_ = function (onFulfilled, onRejected, opt_context) {
  var callbackEntry = goog.Promise.getCallbackEntry_(null, null, null)
  callbackEntry.child = new goog.Promise(function (resolve, reject) {
    callbackEntry.onFulfilled = onFulfilled ? function (value) {
      try {
        var result = onFulfilled.call(opt_context, value)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    } : resolve
    callbackEntry.onRejected = onRejected ? function (reason) {
      try {
        var result = onRejected.call(opt_context, reason)
        if (!goog.isDef(result) && reason instanceof goog.Promise.CancellationError) {
          reject(reason)
        } else {
          resolve(result)
        }
      } catch (err) {
        reject(err)
      }
    } : reject
  })
  callbackEntry.child.parent_ = this
  this.addCallbackEntry_(callbackEntry)
  return callbackEntry.child
}
goog.Promise.prototype.unblockAndFulfill_ = function (value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED)
  this.state_ = goog.Promise.State_.PENDING
  this.resolve_(goog.Promise.State_.FULFILLED, value)
}
goog.Promise.prototype.unblockAndReject_ = function (reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED)
  this.state_ = goog.Promise.State_.PENDING
  this.resolve_(goog.Promise.State_.REJECTED, reason)
}
goog.Promise.prototype.resolve_ = function (state, x) {
  if (this.state_ != goog.Promise.State_.PENDING) {
    return
  }
  if (this === x) {
    state = goog.Promise.State_.REJECTED
    x = new TypeError('Promise cannot resolve to itself')
  }
  this.state_ = goog.Promise.State_.BLOCKED
  var isThenable = goog.Promise.maybeThen_(x, this.unblockAndFulfill_, this.unblockAndReject_, this)
  if (isThenable) {
    return
  }
  this.result_ = x
  this.state_ = state
  this.parent_ = null
  this.scheduleCallbacks_()
  if (state == goog.Promise.State_.REJECTED && !(x instanceof goog.Promise.CancellationError)) {
    goog.Promise.addUnhandledRejection_(this, x)
  }
}
goog.Promise.maybeThen_ = function (value, onFulfilled, onRejected, context) {
  if (value instanceof goog.Promise) {
    value.thenVoid(onFulfilled, onRejected, context)
    return true
  } else {
    if (goog.Thenable.isImplementedBy(value)) {
      value = value
      value.then(onFulfilled, onRejected, context)
      return true
    } else {
      if (goog.isObject(value)) {
        try {
          var then = value['then']
          if (goog.isFunction(then)) {
            goog.Promise.tryThen_(value, then, onFulfilled, onRejected, context)
            return true
          }
        } catch (e) {
          onRejected.call(context, e)
          return true
        }
      }
    }
  }
  return false
}
goog.Promise.tryThen_ = function (thenable, then, onFulfilled, onRejected, context) {
  var called = false
  var resolve = function (value) {
    if (!called) {
      called = true
      onFulfilled.call(context, value)
    }
  }
  var reject = function (reason) {
    if (!called) {
      called = true
      onRejected.call(context, reason)
    }
  }
  try {
    then.call(thenable, resolve, reject)
  } catch (e) {
    reject(e)
  }
}
goog.Promise.prototype.scheduleCallbacks_ = function () {
  if (!this.executing_) {
    this.executing_ = true
    goog.async.run(this.executeCallbacks_, this)
  }
}
goog.Promise.prototype.hasEntry_ = function () {
  return !!this.callbackEntries_
}
goog.Promise.prototype.queueEntry_ = function (entry) {
  goog.asserts.assert(entry.onFulfilled != null)
  if (this.callbackEntriesTail_) {
    this.callbackEntriesTail_.next = entry
    this.callbackEntriesTail_ = entry
  } else {
    this.callbackEntries_ = entry
    this.callbackEntriesTail_ = entry
  }
}
goog.Promise.prototype.popEntry_ = function () {
  var entry = null
  if (this.callbackEntries_) {
    entry = this.callbackEntries_
    this.callbackEntries_ = entry.next
    entry.next = null
  }
  if (!this.callbackEntries_) {
    this.callbackEntriesTail_ = null
  }
  if (entry != null) {
    goog.asserts.assert(entry.onFulfilled != null)
  }
  return entry
}
goog.Promise.prototype.removeEntryAfter_ = function (previous) {
  goog.asserts.assert(this.callbackEntries_)
  goog.asserts.assert(previous != null)
  if (previous.next == this.callbackEntriesTail_) {
    this.callbackEntriesTail_ = previous
  }
  previous.next = previous.next.next
}
goog.Promise.prototype.executeCallbacks_ = function () {
  var entry = null
  while (entry = this.popEntry_()) {
    if (goog.Promise.LONG_STACK_TRACES) {
      this.currentStep_++
    }
    this.executeCallback_(entry, this.state_, this.result_)
  }
  this.executing_ = false
}
goog.Promise.prototype.executeCallback_ = function (callbackEntry, state, result) {
  if (state == goog.Promise.State_.REJECTED && callbackEntry.onRejected && !callbackEntry.always) {
    this.removeUnhandledRejection_()
  }
  if (callbackEntry.child) {
    callbackEntry.child.parent_ = null
    goog.Promise.invokeCallback_(callbackEntry, state, result)
  } else {
    try {
      callbackEntry.always ? callbackEntry.onFulfilled.call(callbackEntry.context) : goog.Promise.invokeCallback_(callbackEntry, state, result)
    } catch (err) {
      goog.Promise.handleRejection_.call(null, err)
    }
  }
  goog.Promise.returnEntry_(callbackEntry)
}
goog.Promise.invokeCallback_ = function (callbackEntry, state, result) {
  if (state == goog.Promise.State_.FULFILLED) {
    callbackEntry.onFulfilled.call(callbackEntry.context, result)
  } else {
    if (callbackEntry.onRejected) {
      callbackEntry.onRejected.call(callbackEntry.context, result)
    }
  }
}
goog.Promise.prototype.addStackTrace_ = function (err) {
  if (goog.Promise.LONG_STACK_TRACES && goog.isString(err.stack)) {
    var trace = err.stack.split('\n', 4)[3]
    var message = err.message
    message += Array(11 - message.length).join(' ')
    this.stack_.push(message + trace)
  }
}
goog.Promise.prototype.appendLongStack_ = function (err) {
  if (goog.Promise.LONG_STACK_TRACES && err && goog.isString(err.stack) && this.stack_.length) {
    var longTrace = ['Promise trace:']
    for (var promise = this; promise; promise = promise.parent_) {
      for (var i = this.currentStep_; i >= 0; i--) {
        longTrace.push(promise.stack_[i])
      }
      longTrace.push('Value: ' + '[' + (promise.state_ == goog.Promise.State_.REJECTED ? 'REJECTED' : 'FULFILLED') + '] ' + '<' + String(promise.result_) + '>')
    }
    err.stack += '\n\n' + longTrace.join('\n')
  }
}
goog.Promise.prototype.removeUnhandledRejection_ = function () {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    for (var p = this; p && p.unhandledRejectionId_; p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_)
      p.unhandledRejectionId_ = 0
    }
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      for (var p = this; p && p.hadUnhandledRejection_; p = p.parent_) {
        p.hadUnhandledRejection_ = false
      }
    }
  }
}
goog.Promise.addUnhandledRejection_ = function (promise, reason) {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    promise.unhandledRejectionId_ = goog.global.setTimeout(function () {
      promise.appendLongStack_(reason)
      goog.Promise.handleRejection_.call(null, reason)
    }, goog.Promise.UNHANDLED_REJECTION_DELAY)
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      promise.hadUnhandledRejection_ = true
      goog.async.run(function () {
        if (promise.hadUnhandledRejection_) {
          promise.appendLongStack_(reason)
          goog.Promise.handleRejection_.call(null, reason)
        }
      })
    }
  }
}
goog.Promise.handleRejection_ = goog.async.throwException
goog.Promise.setUnhandledRejectionHandler = function (handler) {
  goog.Promise.handleRejection_ = handler
}
goog.Promise.CancellationError = function (opt_message) {
  goog.Promise.CancellationError.base(this, 'constructor', opt_message)
}
goog.inherits(goog.Promise.CancellationError, goog.debug.Error)
goog.Promise.CancellationError.prototype.name = 'cancel'
goog.Promise.Resolver_ = function (promise, resolve, reject) {
  this.promise = promise
  this.resolve = resolve
  this.reject = reject
}
goog.provide('goog.disposable.IDisposable')
goog.disposable.IDisposable = function () {
}
goog.disposable.IDisposable.prototype.dispose = goog.abstractMethod
goog.disposable.IDisposable.prototype.isDisposed = goog.abstractMethod
goog.provide('goog.Disposable')
goog.provide('goog.dispose')
goog.provide('goog.disposeAll')
goog.require('goog.disposable.IDisposable')
goog.Disposable = function () {
  this.creationStack
  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {
      this.creationStack = (new Error()).stack
    }
    goog.Disposable.instances_[goog.getUid(this)] = this
  }
  this.disposed_ = this.disposed_
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_
}
goog.Disposable.MonitoringMode = {OFF: 0, PERMANENT: 1, INTERACTIVE: 2}
goog.define('goog.Disposable.MONITORING_MODE', 0)
goog.define('goog.Disposable.INCLUDE_STACK_ON_CREATION', true)
goog.Disposable.instances_ = {}
goog.Disposable.getUndisposedObjects = function () {
  var ret = []
  for (var id in goog.Disposable.instances_) {
    if (goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)])
    }
  }
  return ret
}
goog.Disposable.clearUndisposedObjects = function () {
  goog.Disposable.instances_ = {}
}
goog.Disposable.prototype.disposed_ = false
goog.Disposable.prototype.onDisposeCallbacks_
goog.Disposable.prototype.isDisposed = function () {
  return this.disposed_
}
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed
goog.Disposable.prototype.dispose = function () {
  if (!this.disposed_) {
    this.disposed_ = true
    this.disposeInternal()
    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
      var uid = goog.getUid(this)
      if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw new Error(this + ' did not call the goog.Disposable base ' + 'constructor or was disposed of after a clearUndisposedObjects ' + 'call')
      }
      delete goog.Disposable.instances_[uid]
    }
  }
}
goog.Disposable.prototype.registerDisposable = function (disposable) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable))
}
goog.Disposable.prototype.addOnDisposeCallback = function (callback, opt_scope) {
  if (this.disposed_) {
    goog.isDef(opt_scope) ? callback.call(opt_scope) : callback()
    return
  }
  if (!this.onDisposeCallbacks_) {
    this.onDisposeCallbacks_ = []
  }
  this.onDisposeCallbacks_.push(goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback)
}
goog.Disposable.prototype.disposeInternal = function () {
  if (this.onDisposeCallbacks_) {
    while (this.onDisposeCallbacks_.length) {
      this.onDisposeCallbacks_.shift()()
    }
  }
}
goog.Disposable.isDisposed = function (obj) {
  if (obj && typeof obj.isDisposed === 'function') {
    return obj.isDisposed()
  }
  return false
}
goog.dispose = function (obj) {
  if (obj && typeof obj.dispose === 'function') {
    obj.dispose()
  }
}
goog.disposeAll = function (var_args) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    var disposable = arguments[i]
    if (goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable)
    } else {
      goog.dispose(disposable)
    }
  }
}
goog.provide('goog.debug.errorcontext')
goog.debug.errorcontext.addErrorContext = function (err, contextKey, contextValue) {
  if (!err[goog.debug.errorcontext.CONTEXT_KEY_]) {
    err[goog.debug.errorcontext.CONTEXT_KEY_] = {}
  }
  err[goog.debug.errorcontext.CONTEXT_KEY_][contextKey] = contextValue
}
goog.debug.errorcontext.getErrorContext = function (err) {
  return err[goog.debug.errorcontext.CONTEXT_KEY_] || {}
}
goog.debug.errorcontext.CONTEXT_KEY_ = '__closure__error__context__984382'
goog.provide('goog.labs.userAgent.platform')
goog.require('goog.labs.userAgent.util')
goog.require('goog.string')
goog.labs.userAgent.platform.isAndroid = function () {
  return goog.labs.userAgent.util.matchUserAgent('Android')
}
goog.labs.userAgent.platform.isIpod = function () {
  return goog.labs.userAgent.util.matchUserAgent('iPod')
}
goog.labs.userAgent.platform.isIphone = function () {
  return goog.labs.userAgent.util.matchUserAgent('iPhone') && !goog.labs.userAgent.util.matchUserAgent('iPod') && !goog.labs.userAgent.util.matchUserAgent('iPad')
}
goog.labs.userAgent.platform.isIpad = function () {
  return goog.labs.userAgent.util.matchUserAgent('iPad')
}
goog.labs.userAgent.platform.isIos = function () {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod()
}
goog.labs.userAgent.platform.isMacintosh = function () {
  return goog.labs.userAgent.util.matchUserAgent('Macintosh')
}
goog.labs.userAgent.platform.isLinux = function () {
  return goog.labs.userAgent.util.matchUserAgent('Linux')
}
goog.labs.userAgent.platform.isWindows = function () {
  return goog.labs.userAgent.util.matchUserAgent('Windows')
}
goog.labs.userAgent.platform.isChromeOS = function () {
  return goog.labs.userAgent.util.matchUserAgent('CrOS')
}
goog.labs.userAgent.platform.getVersion = function () {
  var userAgentString = goog.labs.userAgent.util.getUserAgent()
  var version = '', re
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/
    var match = re.exec(userAgentString)
    if (match) {
      version = match[1]
    } else {
      version = '0.0'
    }
  } else {
    if (goog.labs.userAgent.platform.isIos()) {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/
      var match = re.exec(userAgentString)
      version = match && match[1].replace(/_/g, '.')
    } else {
      if (goog.labs.userAgent.platform.isMacintosh()) {
        re = /Mac OS X ([0-9_.]+)/
        var match = re.exec(userAgentString)
        version = match ? match[1].replace(/_/g, '.') : '10'
      } else {
        if (goog.labs.userAgent.platform.isAndroid()) {
          re = /Android\s+([^\);]+)(\)|;)/
          var match = re.exec(userAgentString)
          version = match && match[1]
        } else {
          if (goog.labs.userAgent.platform.isChromeOS()) {
            re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/
            var match = re.exec(userAgentString)
            version = match && match[1]
          }
        }
      }
    }
  }
  return version || ''
}
goog.labs.userAgent.platform.isVersionOrHigher = function (version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0
}
goog.provide('goog.reflect')
goog.reflect.object = function (type, object) {
  return object
}
goog.reflect.objectProperty = function (prop, object) {
  return prop
}
goog.reflect.sinkValue = function (x) {
  goog.reflect.sinkValue[' '](x)
  return x
}
goog.reflect.sinkValue[' '] = goog.nullFunction
goog.reflect.canAccessProperty = function (obj, prop) {
  try {
    goog.reflect.sinkValue(obj[prop])
    return true
  } catch (e) {
  }
  return false
}
goog.reflect.cache = function (cacheObj, key, valueFn, opt_keyFn) {
  var storedKey = opt_keyFn ? opt_keyFn(key) : key
  if (Object.prototype.hasOwnProperty.call(cacheObj, storedKey)) {
    return cacheObj[storedKey]
  }
  return cacheObj[storedKey] = valueFn(key)
}
goog.provide('goog.userAgent')
goog.require('goog.labs.userAgent.browser')
goog.require('goog.labs.userAgent.engine')
goog.require('goog.labs.userAgent.platform')
goog.require('goog.labs.userAgent.util')
goog.require('goog.reflect')
goog.require('goog.string')
goog.define('goog.userAgent.ASSUME_IE', false)
goog.define('goog.userAgent.ASSUME_EDGE', false)
goog.define('goog.userAgent.ASSUME_GECKO', false)
goog.define('goog.userAgent.ASSUME_WEBKIT', false)
goog.define('goog.userAgent.ASSUME_MOBILE_WEBKIT', false)
goog.define('goog.userAgent.ASSUME_OPERA', false)
goog.define('goog.userAgent.ASSUME_ANY_VERSION', false)
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA
goog.userAgent.getUserAgentString = function () {
  return goog.labs.userAgent.util.getUserAgent()
}
goog.userAgent.getNavigator = function () {
  return goog.global['navigator'] || null
}
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera()
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE()
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge()
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko()
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit()
goog.userAgent.isMobile_ = function () {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent('Mobile')
}
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_()
goog.userAgent.SAFARI = goog.userAgent.WEBKIT
goog.userAgent.determinePlatform_ = function () {
  var navigator = goog.userAgent.getNavigator()
  return navigator && navigator.platform || ''
}
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_()
goog.define('goog.userAgent.ASSUME_MAC', false)
goog.define('goog.userAgent.ASSUME_WINDOWS', false)
goog.define('goog.userAgent.ASSUME_LINUX', false)
goog.define('goog.userAgent.ASSUME_X11', false)
goog.define('goog.userAgent.ASSUME_ANDROID', false)
goog.define('goog.userAgent.ASSUME_IPHONE', false)
goog.define('goog.userAgent.ASSUME_IPAD', false)
goog.define('goog.userAgent.ASSUME_IPOD', false)
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh()
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows()
goog.userAgent.isLegacyLinux_ = function () {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS()
}
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_()
goog.userAgent.isX11_ = function () {
  var navigator = goog.userAgent.getNavigator()
  return !!navigator && goog.string.contains(navigator['appVersion'] || '', 'X11')
}
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_()
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid()
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone()
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad()
goog.userAgent.IPOD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIpod()
goog.userAgent.IOS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIos()
goog.userAgent.determineVersion_ = function () {
  var version = ''
  var arr = goog.userAgent.getVersionRegexResult_()
  if (arr) {
    version = arr ? arr[1] : ''
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_()
    if (docMode != null && docMode > parseFloat(version)) {
      return String(docMode)
    }
  }
  return version
}
goog.userAgent.getVersionRegexResult_ = function () {
  var userAgent = goog.userAgent.getUserAgentString()
  if (goog.userAgent.GECKO) {
    return /rv:([^\);]+)(\)|;)/.exec(userAgent)
  }
  if (goog.userAgent.EDGE) {
    return /Edge\/([\d\.]+)/.exec(userAgent)
  }
  if (goog.userAgent.IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent)
  }
  if (goog.userAgent.WEBKIT) {
    return /WebKit\/(\S+)/.exec(userAgent)
  }
  if (goog.userAgent.OPERA) {
    return /(?:Version)[ \/]?(\S+)/.exec(userAgent)
  }
  return undefined
}
goog.userAgent.getDocumentMode_ = function () {
  var doc = goog.global['document']
  return doc ? doc['documentMode'] : undefined
}
goog.userAgent.VERSION = goog.userAgent.determineVersion_()
goog.userAgent.compare = function (v1, v2) {
  return goog.string.compareVersions(v1, v2)
}
goog.userAgent.isVersionOrHigherCache_ = {}
goog.userAgent.isVersionOrHigher = function (version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_, version, function () {
    return goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0
  })
}
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher
goog.userAgent.isDocumentModeOrHigher = function (documentMode) {
  return Number(goog.userAgent.DOCUMENT_MODE) >= documentMode
}
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher
goog.userAgent.DOCUMENT_MODE = (function () {
  var doc = goog.global['document']
  var mode = goog.userAgent.getDocumentMode_()
  if (!doc || !goog.userAgent.IE) {
    return undefined
  }
  return mode || (doc['compatMode'] == 'CSS1Compat' ? parseInt(goog.userAgent.VERSION, 10) : 5)
}())
goog.provide('goog.debug')
goog.require('goog.array')
goog.require('goog.debug.errorcontext')
goog.require('goog.userAgent')
goog.define('goog.debug.LOGGING_ENABLED', goog.DEBUG)
goog.define('goog.debug.FORCE_SLOPPY_STACKS', false)
goog.debug.catchErrors = function (logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global
  var oldErrorHandler = target.onerror
  var retVal = !!opt_cancel
  if (goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher('535.3')) {
    retVal = !retVal
  }
  target.onerror = function (message, url, line, opt_col, opt_error) {
    if (oldErrorHandler) {
      oldErrorHandler(message, url, line, opt_col, opt_error)
    }
    logFunc({message: message, fileName: url, line: line, lineNumber: line, col: opt_col, error: opt_error})
    return retVal
  }
}
goog.debug.expose = function (obj, opt_showFn) {
  if (typeof obj === 'undefined') {
    return 'undefined'
  }
  if (obj == null) {
    return 'NULL'
  }
  var str = []
  for (var x in obj) {
    if (!opt_showFn && goog.isFunction(obj[x])) {
      continue
    }
    var s = x + ' = '
    try {
      s += obj[x]
    } catch (e) {
      s += '*** ' + e + ' ***'
    }
    str.push(s)
  }
  return str.join('\n')
}
goog.debug.deepExpose = function (obj, opt_showFn) {
  var str = []
  var uidsToCleanup = []
  var ancestorUids = {}
  var helper = function (obj, space) {
    var nestspace = space + '  '
    var indentMultiline = function (str) {
      return str.replace(/\n/g, '\n' + space)
    }
    try {
      if (!goog.isDef(obj)) {
        str.push('undefined')
      } else {
        if (goog.isNull(obj)) {
          str.push('NULL')
        } else {
          if (goog.isString(obj)) {
            str.push('"' + indentMultiline(obj) + '"')
          } else {
            if (goog.isFunction(obj)) {
              str.push(indentMultiline(String(obj)))
            } else {
              if (goog.isObject(obj)) {
                if (!goog.hasUid(obj)) {
                  uidsToCleanup.push(obj)
                }
                var uid = goog.getUid(obj)
                if (ancestorUids[uid]) {
                  str.push('*** reference loop detected (id=' + uid + ') ***')
                } else {
                  ancestorUids[uid] = true
                  str.push('{')
                  for (var x in obj) {
                    if (!opt_showFn && goog.isFunction(obj[x])) {
                      continue
                    }
                    str.push('\n')
                    str.push(nestspace)
                    str.push(x + ' = ')
                    helper(obj[x], nestspace)
                  }
                  str.push('\n' + space + '}')
                  delete ancestorUids[uid]
                }
              } else {
                str.push(obj)
              }
            }
          }
        }
      }
    } catch (e) {
      str.push('*** ' + e + ' ***')
    }
  }
  helper(obj, '')
  for (var i = 0; i < uidsToCleanup.length; i++) {
    goog.removeUid(uidsToCleanup[i])
  }
  return str.join('')
}
goog.debug.exposeArray = function (arr) {
  var str = []
  for (var i = 0; i < arr.length; i++) {
    if (goog.isArray(arr[i])) {
      str.push(goog.debug.exposeArray(arr[i]))
    } else {
      str.push(arr[i])
    }
  }
  return '[ ' + str.join(', ') + ' ]'
}
goog.debug.normalizeErrorObject = function (err) {
  var href = goog.getObjectByName('window.location.href')
  if (goog.isString(err)) {
    return {'message': err, 'name': 'Unknown error', 'lineNumber': 'Not available', 'fileName': href, 'stack': 'Not available'}
  }
  var lineNumber, fileName
  var threwError = false
  try {
    lineNumber = err.lineNumber || err.line || 'Not available'
  } catch (e) {
    lineNumber = 'Not available'
    threwError = true
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || goog.global['$googDebugFname'] || href
  } catch (e$1) {
    fileName = 'Not available'
    threwError = true
  }
  if (threwError || !err.lineNumber || !err.fileName || !err.stack || !err.message || !err.name) {
    return {'message': err.message || 'Not available', 'name': err.name || 'UnknownError', 'lineNumber': lineNumber, 'fileName': fileName, 'stack': err.stack || 'Not available'}
  }
  return err
}
goog.debug.enhanceError = function (err, opt_message) {
  var error
  if (!(err instanceof Error)) {
    error = Error(err)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, goog.debug.enhanceError)
    }
  } else {
    error = err
  }
  if (!error.stack) {
    error.stack = goog.debug.getStacktrace(goog.debug.enhanceError)
  }
  if (opt_message) {
    var x = 0
    while (error['message' + x]) {
      ++x
    }
    error['message' + x] = String(opt_message)
  }
  return error
}
goog.debug.enhanceErrorWithContext = function (err, opt_context) {
  var error = goog.debug.enhanceError(err)
  if (opt_context) {
    for (var key in opt_context) {
      goog.debug.errorcontext.addErrorContext(error, key, opt_context[key])
    }
  }
  return error
}
goog.debug.getStacktraceSimple = function (opt_depth) {
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    var stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple)
    if (stack) {
      return stack
    }
  }
  var sb = []
  var fn = arguments.callee.caller
  var depth = 0
  while (fn && (!opt_depth || depth < opt_depth)) {
    sb.push(goog.debug.getFunctionName(fn))
    sb.push('()\n')
    try {
      fn = fn.caller
    } catch (e) {
      sb.push('[exception trying to get caller]\n')
      break
    }
    depth++
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push('[...long stack...]')
      break
    }
  }
  if (opt_depth && depth >= opt_depth) {
    sb.push('[...reached max depth limit...]')
  } else {
    sb.push('[end]')
  }
  return sb.join('')
}
goog.debug.MAX_STACK_DEPTH = 50
goog.debug.getNativeStackTrace_ = function (fn) {
  var tempErr = new Error()
  if (Error.captureStackTrace) {
    Error.captureStackTrace(tempErr, fn)
    return String(tempErr.stack)
  } else {
    try {
      throw tempErr
    } catch (e) {
      tempErr = e
    }
    var stack = tempErr.stack
    if (stack) {
      return String(stack)
    }
  }
  return null
}
goog.debug.getStacktrace = function (fn) {
  var stack
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    var contextFn = fn || goog.debug.getStacktrace
    stack = goog.debug.getNativeStackTrace_(contextFn)
  }
  if (!stack) {
    stack = goog.debug.getStacktraceHelper_(fn || arguments.callee.caller, [])
  }
  return stack
}
goog.debug.getStacktraceHelper_ = function (fn, visited) {
  var sb = []
  if (goog.array.contains(visited, fn)) {
    sb.push('[...circular reference...]')
  } else {
    if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + '(')
      var args = fn.arguments
      for (var i = 0; args && i < args.length; i++) {
        if (i > 0) {
          sb.push(', ')
        }
        var argDesc
        var arg = args[i]
        switch (typeof arg) {
          case 'object':
            argDesc = arg ? 'object' : 'null'
            break
          case 'string':
            argDesc = arg
            break
          case 'number':
            argDesc = String(arg)
            break
          case 'boolean':
            argDesc = arg ? 'true' : 'false'
            break
          case 'function':
            argDesc = goog.debug.getFunctionName(arg)
            argDesc = argDesc || '[fn]'
            break
          case 'undefined':
          default:
            argDesc = typeof arg
            break
        }
        if (argDesc.length > 40) {
          argDesc = argDesc.substr(0, 40) + '...'
        }
        sb.push(argDesc)
      }
      visited.push(fn)
      sb.push(')\n')
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited))
      } catch (e) {
        sb.push('[exception trying to get caller]\n')
      }
    } else {
      if (fn) {
        sb.push('[...long stack...]')
      } else {
        sb.push('[end]')
      }
    }
  }
  return sb.join('')
}
goog.debug.setFunctionResolver = function (resolver) {
  goog.debug.fnNameResolver_ = resolver
}
goog.debug.getFunctionName = function (fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn]
  }
  if (goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn)
    if (name) {
      goog.debug.fnNameCache_[fn] = name
      return name
    }
  }
  var functionSource = String(fn)
  if (!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource)
    if (matches) {
      var method = matches[1]
      goog.debug.fnNameCache_[functionSource] = method
    } else {
      goog.debug.fnNameCache_[functionSource] = '[Anonymous]'
    }
  }
  return goog.debug.fnNameCache_[functionSource]
}
goog.debug.makeWhitespaceVisible = function (string) {
  return string.replace(/ /g, '[_]').replace(/\f/g, '[f]').replace(/\n/g, '[n]\n').replace(/\r/g, '[r]').replace(/\t/g, '[t]')
}
goog.debug.runtimeType = function (value) {
  if (value instanceof Function) {
    return value.displayName || value.name || 'unknown type name'
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value)
    } else {
      return value === null ? 'null' : typeof value
    }
  }
}
goog.debug.fnNameCache_ = {}
goog.debug.fnNameResolver_
goog.debug.freezeInternal_ = goog.DEBUG && Object.freeze || function (arg) {
  return arg
}
goog.debug.freeze = function (arg) {
  return {valueOf: function () {
    return goog.debug.freezeInternal_(arg)
  }}.valueOf()
}
goog.provide('goog.events.BrowserFeature')
goog.require('goog.userAgent')
goog.scope(function () {
  goog.events.BrowserFeature = {HAS_W3C_BUTTON: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    HAS_W3C_EVENT_SUPPORT: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    SET_KEY_CODE_TO_PREVENT_DEFAULT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('9'),
    HAS_NAVIGATOR_ONLINE_PROPERTY: !goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher('528'),
    HAS_HTML5_NETWORK_EVENT_SUPPORT: goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher('1.9b') || goog.userAgent.IE &&
  goog.userAgent.isVersionOrHigher('8') || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher('9.5') || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher('528'),
    HTML5_NETWORK_EVENTS_FIRE_ON_BODY: goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher('8') || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('9'),
    TOUCH_ENABLED: 'ontouchstart' in goog.global || !!(goog.global['document'] && document.documentElement && 'ontouchstart' in document.documentElement) || !!(goog.global['navigator'] &&
  (goog.global['navigator']['maxTouchPoints'] || goog.global['navigator']['msMaxTouchPoints'])),
    POINTER_EVENTS: 'PointerEvent' in goog.global,
    MSPOINTER_EVENTS: 'MSPointerEvent' in goog.global && !!(goog.global['navigator'] && goog.global['navigator']['msPointerEnabled']),
    PASSIVE_EVENTS: purify(function () {
      if (!goog.global.addEventListener || !Object.defineProperty) {
        return false
      }
      var passive = false
      var options = Object.defineProperty({}, 'passive', {get: function () {
        passive = true
      }})
      goog.global.addEventListener('test', goog.nullFunction, options)
      goog.global.removeEventListener('test', goog.nullFunction, options)
      return passive
    })}
  function purify (fn) {
    return {valueOf: fn}.valueOf()
  }
})
goog.provide('goog.events.EventId')
goog.events.EventId = function (eventId) {
  this.id = eventId
}
goog.events.EventId.prototype.toString = function () {
  return this.id
}
goog.provide('goog.events.Event')
goog.provide('goog.events.EventLike')
goog.require('goog.Disposable')
goog.require('goog.events.EventId')
goog.events.EventLike
goog.events.Event = function (type, opt_target) {
  this.type = type instanceof goog.events.EventId ? String(type) : type
  this.target = opt_target
  this.currentTarget = this.target
  this.propagationStopped_ = false
  this.defaultPrevented = false
  this.returnValue_ = true
}
goog.events.Event.prototype.stopPropagation = function () {
  this.propagationStopped_ = true
}
goog.events.Event.prototype.preventDefault = function () {
  this.defaultPrevented = true
  this.returnValue_ = false
}
goog.events.Event.stopPropagation = function (e) {
  e.stopPropagation()
}
goog.events.Event.preventDefault = function (e) {
  e.preventDefault()
}
goog.provide('goog.events.EventType')
goog.provide('goog.events.PointerFallbackEventType')
goog.require('goog.events.BrowserFeature')
goog.require('goog.userAgent')
goog.events.getVendorPrefixedName_ = function (eventName) {
  return goog.userAgent.WEBKIT ? 'webkit' + eventName : goog.userAgent.OPERA ? 'o' + eventName.toLowerCase() : eventName.toLowerCase()
}
goog.events.EventType = {CLICK: 'click',
  RIGHTCLICK: 'rightclick',
  DBLCLICK: 'dblclick',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEOVER: 'mouseover',
  MOUSEOUT: 'mouseout',
  MOUSEMOVE: 'mousemove',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',
  SELECTIONCHANGE: 'selectionchange',
  SELECTSTART: 'selectstart',
  WHEEL: 'wheel',
  KEYPRESS: 'keypress',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  BLUR: 'blur',
  FOCUS: 'focus',
  DEACTIVATE: 'deactivate',
  FOCUSIN: goog.userAgent.IE ? 'focusin' : 'DOMFocusIn',
  FOCUSOUT: goog.userAgent.IE
    ? 'focusout' : 'DOMFocusOut',
  CHANGE: 'change',
  RESET: 'reset',
  SELECT: 'select',
  SUBMIT: 'submit',
  INPUT: 'input',
  PROPERTYCHANGE: 'propertychange',
  DRAGSTART: 'dragstart',
  DRAG: 'drag',
  DRAGENTER: 'dragenter',
  DRAGOVER: 'dragover',
  DRAGLEAVE: 'dragleave',
  DROP: 'drop',
  DRAGEND: 'dragend',
  TOUCHSTART: 'touchstart',
  TOUCHMOVE: 'touchmove',
  TOUCHEND: 'touchend',
  TOUCHCANCEL: 'touchcancel',
  BEFOREUNLOAD: 'beforeunload',
  CONSOLEMESSAGE: 'consolemessage',
  CONTEXTMENU: 'contextmenu',
  DEVICEMOTION: 'devicemotion',
  DEVICEORIENTATION: 'deviceorientation',
  DOMCONTENTLOADED: 'DOMContentLoaded',
  ERROR: 'error',
  HELP: 'help',
  LOAD: 'load',
  LOSECAPTURE: 'losecapture',
  ORIENTATIONCHANGE: 'orientationchange',
  READYSTATECHANGE: 'readystatechange',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  UNLOAD: 'unload',
  CANPLAY: 'canplay',
  CANPLAYTHROUGH: 'canplaythrough',
  DURATIONCHANGE: 'durationchange',
  EMPTIED: 'emptied',
  ENDED: 'ended',
  LOADEDDATA: 'loadeddata',
  LOADEDMETADATA: 'loadedmetadata',
  PAUSE: 'pause',
  PLAY: 'play',
  PLAYING: 'playing',
  RATECHANGE: 'ratechange',
  SEEKED: 'seeked',
  SEEKING: 'seeking',
  STALLED: 'stalled',
  SUSPEND: 'suspend',
  TIMEUPDATE: 'timeupdate',
  VOLUMECHANGE: 'volumechange',
  WAITING: 'waiting',
  SOURCEOPEN: 'sourceopen',
  SOURCEENDED: 'sourceended',
  SOURCECLOSED: 'sourceclosed',
  ABORT: 'abort',
  UPDATE: 'update',
  UPDATESTART: 'updatestart',
  UPDATEEND: 'updateend',
  HASHCHANGE: 'hashchange',
  PAGEHIDE: 'pagehide',
  PAGESHOW: 'pageshow',
  POPSTATE: 'popstate',
  COPY: 'copy',
  PASTE: 'paste',
  CUT: 'cut',
  BEFORECOPY: 'beforecopy',
  BEFORECUT: 'beforecut',
  BEFOREPASTE: 'beforepaste',
  ONLINE: 'online',
  OFFLINE: 'offline',
  MESSAGE: 'message',
  CONNECT: 'connect',
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
  FOREIGNFETCH: 'foreignfetch',
  MESSAGEERROR: 'messageerror',
  STATECHANGE: 'statechange',
  UPDATEFOUND: 'updatefound',
  CONTROLLERCHANGE: 'controllerchange',
  ANIMATIONSTART: goog.events.getVendorPrefixedName_('AnimationStart'),
  ANIMATIONEND: goog.events.getVendorPrefixedName_('AnimationEnd'),
  ANIMATIONITERATION: goog.events.getVendorPrefixedName_('AnimationIteration'),
  TRANSITIONEND: goog.events.getVendorPrefixedName_('TransitionEnd'),
  POINTERDOWN: 'pointerdown',
  POINTERUP: 'pointerup',
  POINTERCANCEL: 'pointercancel',
  POINTERMOVE: 'pointermove',
  POINTEROVER: 'pointerover',
  POINTEROUT: 'pointerout',
  POINTERENTER: 'pointerenter',
  POINTERLEAVE: 'pointerleave',
  GOTPOINTERCAPTURE: 'gotpointercapture',
  LOSTPOINTERCAPTURE: 'lostpointercapture',
  MSGESTURECHANGE: 'MSGestureChange',
  MSGESTUREEND: 'MSGestureEnd',
  MSGESTUREHOLD: 'MSGestureHold',
  MSGESTURESTART: 'MSGestureStart',
  MSGESTURETAP: 'MSGestureTap',
  MSGOTPOINTERCAPTURE: 'MSGotPointerCapture',
  MSINERTIASTART: 'MSInertiaStart',
  MSLOSTPOINTERCAPTURE: 'MSLostPointerCapture',
  MSPOINTERCANCEL: 'MSPointerCancel',
  MSPOINTERDOWN: 'MSPointerDown',
  MSPOINTERENTER: 'MSPointerEnter',
  MSPOINTERHOVER: 'MSPointerHover',
  MSPOINTERLEAVE: 'MSPointerLeave',
  MSPOINTERMOVE: 'MSPointerMove',
  MSPOINTEROUT: 'MSPointerOut',
  MSPOINTEROVER: 'MSPointerOver',
  MSPOINTERUP: 'MSPointerUp',
  TEXT: 'text',
  TEXTINPUT: goog.userAgent.IE ? 'textinput' : 'textInput',
  COMPOSITIONSTART: 'compositionstart',
  COMPOSITIONUPDATE: 'compositionupdate',
  COMPOSITIONEND: 'compositionend',
  BEFOREINPUT: 'beforeinput',
  EXIT: 'exit',
  LOADABORT: 'loadabort',
  LOADCOMMIT: 'loadcommit',
  LOADREDIRECT: 'loadredirect',
  LOADSTART: 'loadstart',
  LOADSTOP: 'loadstop',
  RESPONSIVE: 'responsive',
  SIZECHANGED: 'sizechanged',
  UNRESPONSIVE: 'unresponsive',
  VISIBILITYCHANGE: 'visibilitychange',
  STORAGE: 'storage',
  DOMSUBTREEMODIFIED: 'DOMSubtreeModified',
  DOMNODEINSERTED: 'DOMNodeInserted',
  DOMNODEREMOVED: 'DOMNodeRemoved',
  DOMNODEREMOVEDFROMDOCUMENT: 'DOMNodeRemovedFromDocument',
  DOMNODEINSERTEDINTODOCUMENT: 'DOMNodeInsertedIntoDocument',
  DOMATTRMODIFIED: 'DOMAttrModified',
  DOMCHARACTERDATAMODIFIED: 'DOMCharacterDataModified',
  BEFOREPRINT: 'beforeprint',
  AFTERPRINT: 'afterprint'}
goog.events.getPointerFallbackEventName_ = function (pointerEventName, msPointerEventName, mouseEventName) {
  if (goog.events.BrowserFeature.POINTER_EVENTS) {
    return pointerEventName
  }
  if (goog.events.BrowserFeature.MSPOINTER_EVENTS) {
    return msPointerEventName
  }
  return mouseEventName
}
goog.events.PointerFallbackEventType = {POINTERDOWN: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERDOWN, goog.events.EventType.MSPOINTERDOWN, goog.events.EventType.MOUSEDOWN),
  POINTERUP: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERUP, goog.events.EventType.MSPOINTERUP, goog.events.EventType.MOUSEUP),
  POINTERCANCEL: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERCANCEL, goog.events.EventType.MSPOINTERCANCEL, 'mousecancel'),
  POINTERMOVE: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERMOVE,
    goog.events.EventType.MSPOINTERMOVE, goog.events.EventType.MOUSEMOVE),
  POINTEROVER: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTEROVER, goog.events.EventType.MSPOINTEROVER, goog.events.EventType.MOUSEOVER),
  POINTEROUT: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTEROUT, goog.events.EventType.MSPOINTEROUT, goog.events.EventType.MOUSEOUT),
  POINTERENTER: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERENTER, goog.events.EventType.MSPOINTERENTER,
    goog.events.EventType.MOUSEENTER),
  POINTERLEAVE: goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERLEAVE, goog.events.EventType.MSPOINTERLEAVE, goog.events.EventType.MOUSELEAVE)}
goog.provide('goog.events.BrowserEvent')
goog.provide('goog.events.BrowserEvent.MouseButton')
goog.provide('goog.events.BrowserEvent.PointerType')
goog.require('goog.debug')
goog.require('goog.events.BrowserFeature')
goog.require('goog.events.Event')
goog.require('goog.events.EventType')
goog.require('goog.reflect')
goog.require('goog.userAgent')
goog.events.BrowserEvent = function (opt_e, opt_currentTarget) {
  goog.events.BrowserEvent.base(this, 'constructor', opt_e ? opt_e.type : '')
  this.target = null
  this.currentTarget = null
  this.relatedTarget = null
  this.offsetX = 0
  this.offsetY = 0
  this.clientX = 0
  this.clientY = 0
  this.screenX = 0
  this.screenY = 0
  this.button = 0
  this.key = ''
  this.keyCode = 0
  this.charCode = 0
  this.ctrlKey = false
  this.altKey = false
  this.shiftKey = false
  this.metaKey = false
  this.state = null
  this.platformModifierKey = false
  this.pointerId = 0
  this.pointerType = ''
  this.event_ = null
  if (opt_e) {
    this.init(opt_e, opt_currentTarget)
  }
}
goog.inherits(goog.events.BrowserEvent, goog.events.Event)
goog.events.BrowserEvent.MouseButton = {LEFT: 0, MIDDLE: 1, RIGHT: 2}
goog.events.BrowserEvent.PointerType = {MOUSE: 'mouse', PEN: 'pen', TOUCH: 'touch'}
goog.events.BrowserEvent.IEButtonMap = goog.debug.freeze([1, 4, 2])
goog.events.BrowserEvent.IE_BUTTON_MAP = goog.events.BrowserEvent.IEButtonMap
goog.events.BrowserEvent.IE_POINTER_TYPE_MAP = goog.debug.freeze({2: goog.events.BrowserEvent.PointerType.TOUCH, 3: goog.events.BrowserEvent.PointerType.PEN, 4: goog.events.BrowserEvent.PointerType.MOUSE})
goog.events.BrowserEvent.prototype.init = function (e, opt_currentTarget) {
  var type = this.type = e.type
  var relevantTouch = e.changedTouches ? e.changedTouches[0] : null
  this.target = e.target || e.srcElement
  this.currentTarget = opt_currentTarget
  var relatedTarget = e.relatedTarget
  if (relatedTarget) {
    if (goog.userAgent.GECKO) {
      if (!goog.reflect.canAccessProperty(relatedTarget, 'nodeName')) {
        relatedTarget = null
      }
    }
  } else {
    if (type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement
    } else {
      if (type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement
      }
    }
  }
  this.relatedTarget = relatedTarget
  if (!goog.isNull(relevantTouch)) {
    this.clientX = relevantTouch.clientX !== undefined ? relevantTouch.clientX : relevantTouch.pageX
    this.clientY = relevantTouch.clientY !== undefined ? relevantTouch.clientY : relevantTouch.pageY
    this.screenX = relevantTouch.screenX || 0
    this.screenY = relevantTouch.screenY || 0
  } else {
    this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== undefined ? e.offsetX : e.layerX
    this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== undefined ? e.offsetY : e.layerY
    this.clientX = e.clientX !== undefined ? e.clientX : e.pageX
    this.clientY = e.clientY !== undefined ? e.clientY : e.pageY
    this.screenX = e.screenX || 0
    this.screenY = e.screenY || 0
  }
  this.button = e.button
  this.keyCode = e.keyCode || 0
  this.key = e.key || ''
  this.charCode = e.charCode || (type == 'keypress' ? e.keyCode : 0)
  this.ctrlKey = e.ctrlKey
  this.altKey = e.altKey
  this.shiftKey = e.shiftKey
  this.metaKey = e.metaKey
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey
  this.pointerId = e.pointerId || 0
  this.pointerType = goog.events.BrowserEvent.getPointerType_(e)
  this.state = e.state
  this.event_ = e
  if (e.defaultPrevented) {
    this.preventDefault()
  }
}
goog.events.BrowserEvent.prototype.isButton = function (button) {
  if (!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if (this.type == 'click') {
      return button == goog.events.BrowserEvent.MouseButton.LEFT
    } else {
      return !!(this.event_.button & goog.events.BrowserEvent.IE_BUTTON_MAP[button])
    }
  } else {
    return this.event_.button == button
  }
}
goog.events.BrowserEvent.prototype.isMouseActionButton = function () {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
}
goog.events.BrowserEvent.prototype.stopPropagation = function () {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this)
  if (this.event_.stopPropagation) {
    this.event_.stopPropagation()
  } else {
    this.event_.cancelBubble = true
  }
}
goog.events.BrowserEvent.prototype.preventDefault = function () {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this)
  var be = this.event_
  if (!be.preventDefault) {
    be.returnValue = false
    if (goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        var VK_F1 = 112
        var VK_F12 = 123
        if (be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1
        }
      } catch (ex) {
      }
    }
  } else {
    be.preventDefault()
  }
}
goog.events.BrowserEvent.prototype.getBrowserEvent = function () {
  return this.event_
}
goog.events.BrowserEvent.getPointerType_ = function (e) {
  if (goog.isString(e.pointerType)) {
    return e.pointerType
  }
  return goog.events.BrowserEvent.IE_POINTER_TYPE_MAP[e.pointerType] || ''
}
goog.provide('goog.events.Listenable')
goog.provide('goog.events.ListenableKey')
goog.require('goog.events.EventId')
goog.forwardDeclare('goog.events.EventLike')
goog.forwardDeclare('goog.events.EventTarget')
goog.events.Listenable = function () {
}
goog.events.Listenable.IMPLEMENTED_BY_PROP = 'closure_listenable_' + (Math.random() * 1e6 | 0)
goog.events.Listenable.addImplementation = function (cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = true
}
goog.events.Listenable.isImplementedBy = function (obj) {
  return !!(obj && obj[goog.events.Listenable.IMPLEMENTED_BY_PROP])
}
goog.events.Listenable.prototype.listen
goog.events.Listenable.prototype.listenOnce
goog.events.Listenable.prototype.unlisten
goog.events.Listenable.prototype.unlistenByKey
goog.events.Listenable.prototype.dispatchEvent
goog.events.Listenable.prototype.removeAllListeners
goog.events.Listenable.prototype.getParentEventTarget
goog.events.Listenable.prototype.fireListeners
goog.events.Listenable.prototype.getListeners
goog.events.Listenable.prototype.getListener
goog.events.Listenable.prototype.hasListener
goog.events.ListenableKey = function () {
}
goog.events.ListenableKey.counter_ = 0
goog.events.ListenableKey.reserveKey = function () {
  return ++goog.events.ListenableKey.counter_
}
goog.events.ListenableKey.prototype.src
goog.events.ListenableKey.prototype.type
goog.events.ListenableKey.prototype.listener
goog.events.ListenableKey.prototype.capture
goog.events.ListenableKey.prototype.handler
goog.events.ListenableKey.prototype.key
goog.provide('goog.events.Listener')
goog.require('goog.events.ListenableKey')
goog.events.Listener = function (listener, proxy, src, type, capture, opt_handler) {
  if (goog.events.Listener.ENABLE_MONITORING) {
    this.creationStack = (new Error()).stack
  }
  this.listener = listener
  this.proxy = proxy
  this.src = src
  this.type = type
  this.capture = !!capture
  this.handler = opt_handler
  this.key = goog.events.ListenableKey.reserveKey()
  this.callOnce = false
  this.removed = false
}
goog.define('goog.events.Listener.ENABLE_MONITORING', false)
goog.events.Listener.prototype.creationStack
goog.events.Listener.prototype.markAsRemoved = function () {
  this.removed = true
  this.listener = null
  this.proxy = null
  this.src = null
  this.handler = null
}
goog.provide('goog.events.ListenerMap')
goog.require('goog.array')
goog.require('goog.events.Listener')
goog.require('goog.object')
goog.events.ListenerMap = function (src) {
  this.src = src
  this.listeners = {}
  this.typeCount_ = 0
}
goog.events.ListenerMap.prototype.getTypeCount = function () {
  return this.typeCount_
}
goog.events.ListenerMap.prototype.getListenerCount = function () {
  var count = 0
  for (var type in this.listeners) {
    count += this.listeners[type].length
  }
  return count
}
goog.events.ListenerMap.prototype.add = function (type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString()
  var listenerArray = this.listeners[typeStr]
  if (!listenerArray) {
    listenerArray = this.listeners[typeStr] = []
    this.typeCount_++
  }
  var listenerObj
  var index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope)
  if (index > -1) {
    listenerObj = listenerArray[index]
    if (!callOnce) {
      listenerObj.callOnce = false
    }
  } else {
    listenerObj = new goog.events.Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope)
    listenerObj.callOnce = callOnce
    listenerArray.push(listenerObj)
  }
  return listenerObj
}
goog.events.ListenerMap.prototype.remove = function (type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString()
  if (!(typeStr in this.listeners)) {
    return false
  }
  var listenerArray = this.listeners[typeStr]
  var index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope)
  if (index > -1) {
    var listenerObj = listenerArray[index]
    listenerObj.markAsRemoved()
    goog.array.removeAt(listenerArray, index)
    if (listenerArray.length == 0) {
      delete this.listeners[typeStr]
      this.typeCount_--
    }
    return true
  }
  return false
}
goog.events.ListenerMap.prototype.removeByKey = function (listener) {
  var type = listener.type
  if (!(type in this.listeners)) {
    return false
  }
  var removed = goog.array.remove(this.listeners[type], listener)
  if (removed) {
    listener.markAsRemoved()
    if (this.listeners[type].length == 0) {
      delete this.listeners[type]
      this.typeCount_--
    }
  }
  return removed
}
goog.events.ListenerMap.prototype.removeAll = function (opt_type) {
  var typeStr = opt_type && opt_type.toString()
  var count = 0
  for (var type in this.listeners) {
    if (!typeStr || type == typeStr) {
      var listenerArray = this.listeners[type]
      for (var i = 0; i < listenerArray.length; i++) {
        ++count
        listenerArray[i].markAsRemoved()
      }
      delete this.listeners[type]
      this.typeCount_--
    }
  }
  return count
}
goog.events.ListenerMap.prototype.getListeners = function (type, capture) {
  var listenerArray = this.listeners[type.toString()]
  var rv = []
  if (listenerArray) {
    for (var i = 0; i < listenerArray.length; ++i) {
      var listenerObj = listenerArray[i]
      if (listenerObj.capture == capture) {
        rv.push(listenerObj)
      }
    }
  }
  return rv
}
goog.events.ListenerMap.prototype.getListener = function (type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()]
  var i = -1
  if (listenerArray) {
    i = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope)
  }
  return i > -1 ? listenerArray[i] : null
}
goog.events.ListenerMap.prototype.hasListener = function (opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type)
  var typeStr = hasType ? opt_type.toString() : ''
  var hasCapture = goog.isDef(opt_capture)
  return goog.object.some(this.listeners, function (listenerArray, type) {
    for (var i = 0; i < listenerArray.length; ++i) {
      if ((!hasType || listenerArray[i].type == typeStr) && (!hasCapture || listenerArray[i].capture == opt_capture)) {
        return true
      }
    }
    return false
  })
}
goog.events.ListenerMap.findListenerIndex_ = function (listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0; i < listenerArray.length; ++i) {
    var listenerObj = listenerArray[i]
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i
    }
  }
  return -1
}
goog.provide('goog.events')
goog.provide('goog.events.CaptureSimulationMode')
goog.provide('goog.events.Key')
goog.provide('goog.events.ListenableType')
goog.require('goog.asserts')
goog.require('goog.debug.entryPointRegistry')
goog.require('goog.events.BrowserEvent')
goog.require('goog.events.BrowserFeature')
goog.require('goog.events.Listenable')
goog.require('goog.events.ListenerMap')
goog.forwardDeclare('goog.debug.ErrorHandler')
goog.forwardDeclare('goog.events.EventWrapper')
goog.events.Key
goog.events.ListenableType
goog.events.LISTENER_MAP_PROP_ = 'closure_lm_' + (Math.random() * 1e6 | 0)
goog.events.onString_ = 'on'
goog.events.onStringMap_ = {}
goog.events.CaptureSimulationMode = {OFF_AND_FAIL: 0, OFF_AND_SILENT: 1, ON: 2}
goog.define('goog.events.CAPTURE_SIMULATION_MODE', 2)
goog.events.listenerCountEstimate_ = 0
goog.events.listen = function (src, type, listener, opt_options, opt_handler) {
  if (opt_options && opt_options.once) {
    return goog.events.listenOnce(src, type, listener, opt_options, opt_handler)
  }
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.listen(src, type[i], listener, opt_options, opt_handler)
    }
    return null
  }
  listener = goog.events.wrapListener(listener)
  if (goog.events.Listenable.isImplementedBy(src)) {
    var capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options
    return src.listen(type, listener, capture, opt_handler)
  } else {
    return goog.events.listen_(src, type, listener, false, opt_options, opt_handler)
  }
}
goog.events.listen_ = function (src, type, listener, callOnce, opt_options, opt_handler) {
  if (!type) {
    throw new Error('Invalid event type')
  }
  var capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      goog.asserts.fail('Can not register capture listener in IE8-.')
      return null
    } else {
      if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
        return null
      }
    }
  }
  var listenerMap = goog.events.getListenerMap_(src)
  if (!listenerMap) {
    src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new goog.events.ListenerMap(src)
  }
  var listenerObj = listenerMap.add(type, listener, callOnce, capture, opt_handler)
  if (listenerObj.proxy) {
    return listenerObj
  }
  var proxy = goog.events.getProxy()
  listenerObj.proxy = proxy
  proxy.src = src
  proxy.listener = listenerObj
  if (src.addEventListener) {
    if (!goog.events.BrowserFeature.PASSIVE_EVENTS) {
      opt_options = capture
    }
    if (opt_options === undefined) {
      opt_options = false
    }
    src.addEventListener(type.toString(), proxy, opt_options)
  } else {
    if (src.attachEvent) {
      src.attachEvent(goog.events.getOnString_(type.toString()), proxy)
    } else {
      if (src.addListener && src.removeListener) {
        goog.asserts.assert(type === 'change', 'MediaQueryList only has a change event')
        src.addListener(proxy)
      } else {
        throw new Error('addEventListener and attachEvent are unavailable.')
      }
    }
  }
  goog.events.listenerCountEstimate_++
  return listenerObj
}
goog.events.getProxy = function () {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_
  var f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function (eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject)
  } : function (eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.listener, eventObject)
    if (!v) {
      return v
    }
  }
  return f
}
goog.events.listenOnce = function (src, type, listener, opt_options, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.listenOnce(src, type[i], listener, opt_options, opt_handler)
    }
    return null
  }
  listener = goog.events.wrapListener(listener)
  if (goog.events.Listenable.isImplementedBy(src)) {
    var capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options
    return src.listenOnce(type, listener, capture, opt_handler)
  } else {
    return goog.events.listen_(src, type, listener, true, opt_options, opt_handler)
  }
}
goog.events.listenWithWrapper = function (src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler)
}
goog.events.unlisten = function (src, type, listener, opt_options, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.unlisten(src, type[i], listener, opt_options, opt_handler)
    }
    return null
  }
  var capture = goog.isObject(opt_options) ? !!opt_options.capture : !!opt_options
  listener = goog.events.wrapListener(listener)
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(type, listener, capture, opt_handler)
  }
  if (!src) {
    return false
  }
  var listenerMap = goog.events.getListenerMap_(src)
  if (listenerMap) {
    var listenerObj = listenerMap.getListener(type, listener, capture, opt_handler)
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj)
    }
  }
  return false
}
goog.events.unlistenByKey = function (key) {
  if (goog.isNumber(key)) {
    return false
  }
  var listener = key
  if (!listener || listener.removed) {
    return false
  }
  var src = listener.src
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener)
  }
  var type = listener.type
  var proxy = listener.proxy
  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, listener.capture)
  } else {
    if (src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy)
    } else {
      if (src.addListener && src.removeListener) {
        src.removeListener(proxy)
      }
    }
  }
  goog.events.listenerCountEstimate_--
  var listenerMap = goog.events.getListenerMap_(src)
  if (listenerMap) {
    listenerMap.removeByKey(listener)
    if (listenerMap.getTypeCount() == 0) {
      listenerMap.src = null
      src[goog.events.LISTENER_MAP_PROP_] = null
    }
  } else {
    listener.markAsRemoved()
  }
  return true
}
goog.events.unlistenWithWrapper = function (src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler)
}
goog.events.removeAll = function (obj, opt_type) {
  if (!obj) {
    return 0
  }
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.removeAllListeners(opt_type)
  }
  var listenerMap = goog.events.getListenerMap_(obj)
  if (!listenerMap) {
    return 0
  }
  var count = 0
  var typeStr = opt_type && opt_type.toString()
  for (var type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      var listeners = listenerMap.listeners[type].concat()
      for (var i = 0; i < listeners.length; ++i) {
        if (goog.events.unlistenByKey(listeners[i])) {
          ++count
        }
      }
    }
  }
  return count
}
goog.events.getListeners = function (obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture)
  } else {
    if (!obj) {
      return []
    }
    var listenerMap = goog.events.getListenerMap_(obj)
    return listenerMap ? listenerMap.getListeners(type, capture) : []
  }
}
goog.events.getListener = function (src, type, listener, opt_capt, opt_handler) {
  type = type
  listener = goog.events.wrapListener(listener)
  var capture = !!opt_capt
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler)
  }
  if (!src) {
    return null
  }
  var listenerMap = goog.events.getListenerMap_(src)
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, opt_handler)
  }
  return null
}
goog.events.hasListener = function (obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture)
  }
  var listenerMap = goog.events.getListenerMap_(obj)
  return !!listenerMap && listenerMap.hasListener(opt_type, opt_capture)
}
goog.events.expose = function (e) {
  var str = []
  for (var key in e) {
    if (e[key] && e[key].id) {
      str.push(key + ' = ' + e[key] + ' (' + e[key].id + ')')
    } else {
      str.push(key + ' = ' + e[key])
    }
  }
  return str.join('\n')
}
goog.events.getOnString_ = function (type) {
  if (type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type]
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type
}
goog.events.fireListeners = function (obj, type, capture, eventObject) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.fireListeners(type, capture, eventObject)
  }
  return goog.events.fireListeners_(obj, type, capture, eventObject)
}
goog.events.fireListeners_ = function (obj, type, capture, eventObject) {
  var retval = true
  var listenerMap = goog.events.getListenerMap_(obj)
  if (listenerMap) {
    var listenerArray = listenerMap.listeners[type.toString()]
    if (listenerArray) {
      listenerArray = listenerArray.concat()
      for (var i = 0; i < listenerArray.length; i++) {
        var listener = listenerArray[i]
        if (listener && listener.capture == capture && !listener.removed) {
          var result = goog.events.fireListener(listener, eventObject)
          retval = retval && result !== false
        }
      }
    }
  }
  return retval
}
goog.events.fireListener = function (listener, eventObject) {
  var listenerFn = listener.listener
  var listenerHandler = listener.handler || listener.src
  if (listener.callOnce) {
    goog.events.unlistenByKey(listener)
  }
  return listenerFn.call(listenerHandler, eventObject)
}
goog.events.getTotalListenerCount = function () {
  return goog.events.listenerCountEstimate_
}
goog.events.dispatchEvent = function (src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), 'Can not use goog.events.dispatchEvent with ' + 'non-goog.events.Listenable instance.')
  return src.dispatchEvent(e)
}
goog.events.protectBrowserEventEntryPoint = function (errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_)
}
goog.events.handleBrowserEvent_ = function (listener, opt_evt) {
  if (listener.removed) {
    return true
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || goog.getObjectByName('window.event')
    var evt = new goog.events.BrowserEvent(ieEvent, this)
    var retval = true
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent)
        var ancestors = []
        for (var parent = evt.currentTarget; parent; parent = parent.parentNode) {
          ancestors.push(parent)
        }
        var type = listener.type
        for (var i = ancestors.length - 1; !evt.propagationStopped_ && i >= 0; i--) {
          evt.currentTarget = ancestors[i]
          var result = goog.events.fireListeners_(ancestors[i], type, true, evt)
          retval = retval && result
        }
        for (var i = 0; !evt.propagationStopped_ && i < ancestors.length; i++) {
          evt.currentTarget = ancestors[i]
          var result = goog.events.fireListeners_(ancestors[i], type, false, evt)
          retval = retval && result
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt)
    }
    return retval
  }
  return goog.events.fireListener(listener, new goog.events.BrowserEvent(opt_evt, this))
}
goog.events.markIeEvent_ = function (e) {
  var useReturnValue = false
  if (e.keyCode == 0) {
    try {
      e.keyCode = -1
      return
    } catch (ex) {
      useReturnValue = true
    }
  }
  if (useReturnValue || e.returnValue == undefined) {
    e.returnValue = true
  }
}
goog.events.isMarkedIeEvent_ = function (e) {
  return e.keyCode < 0 || e.returnValue != undefined
}
goog.events.uniqueIdCounter_ = 0
goog.events.getUniqueId = function (identifier) {
  return identifier + '_' + goog.events.uniqueIdCounter_++
}
goog.events.getListenerMap_ = function (src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_]
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null
}
goog.events.LISTENER_WRAPPER_PROP_ = '__closure_events_fn_' + (Math.random() * 1e9 >>> 0)
goog.events.wrapListener = function (listener) {
  goog.asserts.assert(listener, 'Listener can not be null.')
  if (goog.isFunction(listener)) {
    return listener
  }
  goog.asserts.assert(listener.handleEvent, 'An object listener must have handleEvent method.')
  if (!listener[goog.events.LISTENER_WRAPPER_PROP_]) {
    listener[goog.events.LISTENER_WRAPPER_PROP_] = function (e) {
      return listener.handleEvent(e)
    }
  }
  return listener[goog.events.LISTENER_WRAPPER_PROP_]
}
goog.debug.entryPointRegistry.register(function (transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_)
})
goog.provide('goog.events.EventTarget')
goog.require('goog.Disposable')
goog.require('goog.asserts')
goog.require('goog.events')
goog.require('goog.events.Event')
goog.require('goog.events.Listenable')
goog.require('goog.events.ListenerMap')
goog.require('goog.object')
goog.events.EventTarget = function () {
  goog.Disposable.call(this)
  this.eventTargetListeners_ = new goog.events.ListenerMap(this)
  this.actualEventTarget_ = this
  this.parentEventTarget_ = null
}
goog.inherits(goog.events.EventTarget, goog.Disposable)
goog.events.Listenable.addImplementation(goog.events.EventTarget)
goog.events.EventTarget.MAX_ANCESTORS_ = 1000
goog.events.EventTarget.prototype.getParentEventTarget = function () {
  return this.parentEventTarget_
}
goog.events.EventTarget.prototype.setParentEventTarget = function (parent) {
  this.parentEventTarget_ = parent
}
goog.events.EventTarget.prototype.addEventListener = function (type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope)
}
goog.events.EventTarget.prototype.removeEventListener = function (type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope)
}
goog.events.EventTarget.prototype.dispatchEvent = function (e) {
  this.assertInitialized_()
  var ancestorsTree, ancestor = this.getParentEventTarget()
  if (ancestor) {
    ancestorsTree = []
    var ancestorCount = 1
    for (; ancestor; ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor)
      goog.asserts.assert(++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_, 'infinite loop')
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree)
}
goog.events.EventTarget.prototype.disposeInternal = function () {
  goog.events.EventTarget.superClass_.disposeInternal.call(this)
  this.removeAllListeners()
  this.parentEventTarget_ = null
}
goog.events.EventTarget.prototype.listen = function (type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_()
  return this.eventTargetListeners_.add(String(type), listener, false, opt_useCapture, opt_listenerScope)
}
goog.events.EventTarget.prototype.listenOnce = function (type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, true, opt_useCapture, opt_listenerScope)
}
goog.events.EventTarget.prototype.unlisten = function (type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope)
}
goog.events.EventTarget.prototype.unlistenByKey = function (key) {
  return this.eventTargetListeners_.removeByKey(key)
}
goog.events.EventTarget.prototype.removeAllListeners = function (opt_type) {
  if (!this.eventTargetListeners_) {
    return 0
  }
  return this.eventTargetListeners_.removeAll(opt_type)
}
goog.events.EventTarget.prototype.fireListeners = function (type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)]
  if (!listenerArray) {
    return true
  }
  listenerArray = listenerArray.concat()
  var rv = true
  for (var i = 0; i < listenerArray.length; ++i) {
    var listener = listenerArray[i]
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener
      var listenerHandler = listener.handler || listener.src
      if (listener.callOnce) {
        this.unlistenByKey(listener)
      }
      rv = listenerFn.call(listenerHandler, eventObject) !== false && rv
    }
  }
  return rv && eventObject.returnValue_ != false
}
goog.events.EventTarget.prototype.getListeners = function (type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture)
}
goog.events.EventTarget.prototype.getListener = function (type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope)
}
goog.events.EventTarget.prototype.hasListener = function (opt_type, opt_capture) {
  var id = goog.isDef(opt_type) ? String(opt_type) : undefined
  return this.eventTargetListeners_.hasListener(id, opt_capture)
}
goog.events.EventTarget.prototype.setTargetForTesting = function (target) {
  this.actualEventTarget_ = target
}
goog.events.EventTarget.prototype.assertInitialized_ = function () {
  goog.asserts.assert(this.eventTargetListeners_, 'Event target is not initialized. Did you call the superclass ' + '(goog.events.EventTarget) constructor?')
}
goog.events.EventTarget.dispatchEventInternal_ = function (target, e, opt_ancestorsTree) {
  var type = e.type || e
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target)
  } else {
    if (!(e instanceof goog.events.Event)) {
      var oldEvent = e
      e = new goog.events.Event(type, target)
      goog.object.extend(e, oldEvent)
    } else {
      e.target = e.target || target
    }
  }
  var rv = true, currentTarget
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1; !e.propagationStopped_ && i >= 0; i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i]
      rv = currentTarget.fireListeners(type, true, e) && rv
    }
  }
  if (!e.propagationStopped_) {
    currentTarget = e.currentTarget = target
    rv = currentTarget.fireListeners(type, true, e) && rv
    if (!e.propagationStopped_) {
      rv = currentTarget.fireListeners(type, false, e) && rv
    }
  }
  if (opt_ancestorsTree) {
    for (i = 0; !e.propagationStopped_ && i < opt_ancestorsTree.length; i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i]
      rv = currentTarget.fireListeners(type, false, e) && rv
    }
  }
  return rv
}
goog.provide('goog.Timer')
goog.require('goog.Promise')
goog.require('goog.events.EventTarget')
goog.Timer = function (opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this)
  this.interval_ = opt_interval || 1
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject
  this.boundTick_ = goog.bind(this.tick_, this)
  this.last_ = goog.now()
}
goog.inherits(goog.Timer, goog.events.EventTarget)
goog.Timer.MAX_TIMEOUT_ = 2147483647
goog.Timer.INVALID_TIMEOUT_ID_ = -1
goog.Timer.prototype.enabled = false
goog.Timer.defaultTimerObject = goog.global
goog.Timer.intervalScale = 0.8
goog.Timer.prototype.timer_ = null
goog.Timer.prototype.getInterval = function () {
  return this.interval_
}
goog.Timer.prototype.setInterval = function (interval) {
  this.interval_ = interval
  if (this.timer_ && this.enabled) {
    this.stop()
    this.start()
  } else {
    if (this.timer_) {
      this.stop()
    }
  }
}
goog.Timer.prototype.tick_ = function () {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_
    if (elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed)
      return
    }
    if (this.timer_) {
      this.timerObject_.clearTimeout(this.timer_)
      this.timer_ = null
    }
    this.dispatchTick()
    if (this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_)
      this.last_ = goog.now()
    }
  }
}
goog.Timer.prototype.dispatchTick = function () {
  this.dispatchEvent(goog.Timer.TICK)
}
goog.Timer.prototype.start = function () {
  this.enabled = true
  if (!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_)
    this.last_ = goog.now()
  }
}
goog.Timer.prototype.stop = function () {
  this.enabled = false
  if (this.timer_) {
    this.timerObject_.clearTimeout(this.timer_)
    this.timer_ = null
  }
}
goog.Timer.prototype.disposeInternal = function () {
  goog.Timer.superClass_.disposeInternal.call(this)
  this.stop()
  delete this.timerObject_
}
goog.Timer.TICK = 'tick'
goog.Timer.callOnce = function (listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    if (opt_handler) {
      listener = goog.bind(listener, opt_handler)
    }
  } else {
    if (listener && typeof listener.handleEvent === 'function') {
      listener = goog.bind(listener.handleEvent, listener)
    } else {
      throw new Error('Invalid listener argument')
    }
  }
  if (Number(opt_delay) > goog.Timer.MAX_TIMEOUT_) {
    return goog.Timer.INVALID_TIMEOUT_ID_
  } else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0)
  }
}
goog.Timer.clear = function (timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId)
}
goog.Timer.promise = function (delay, opt_result) {
  var timerKey = null
  return (new goog.Promise(function (resolve, reject) {
    timerKey = goog.Timer.callOnce(function () {
      resolve(opt_result)
    }, delay)
    if (timerKey == goog.Timer.INVALID_TIMEOUT_ID_) {
      reject(new Error('Failed to schedule timer.'))
    }
  })).thenCatch(function (error) {
    goog.Timer.clear(timerKey)
    throw error
  })
}
goog.provide('goog.json')
goog.provide('goog.json.Replacer')
goog.provide('goog.json.Reviver')
goog.provide('goog.json.Serializer')
goog.define('goog.json.USE_NATIVE_JSON', false)
goog.define('goog.json.TRY_NATIVE_JSON', false)
goog.json.isValid = function (s) {
  if (/^\s*$/.test(s)) {
    return false
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g
  var simpleValuesRe = /(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/
  return remainderRe.test(s.replace(backslashesRe, '@').replace(simpleValuesRe, ']').replace(openBracketsRe, ''))
}
goog.json.errorLogger_ = goog.nullFunction
goog.json.setErrorLogger = function (errorLogger) {
  goog.json.errorLogger_ = errorLogger
}
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global['JSON']['parse'] : function (s) {
  var error
  if (goog.json.TRY_NATIVE_JSON) {
    try {
      return goog.global['JSON']['parse'](s)
    } catch (ex) {
      error = ex
    }
  }
  var o = String(s)
  if (goog.json.isValid(o)) {
    try {
      var result = eval('(' + o + ')')
      if (error) {
        goog.json.errorLogger_('Invalid JSON: ' + o, error)
      }
      return result
    } catch (ex$2) {
    }
  }
  throw new Error('Invalid JSON string: ' + o)
}
goog.json.Replacer
goog.json.Reviver
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global['JSON']['stringify'] : function (object, opt_replacer) {
  return (new goog.json.Serializer(opt_replacer)).serialize(object)
}
goog.json.Serializer = function (opt_replacer) {
  this.replacer_ = opt_replacer
}
goog.json.Serializer.prototype.serialize = function (object) {
  var sb = []
  this.serializeInternal(object, sb)
  return sb.join('')
}
goog.json.Serializer.prototype.serializeInternal = function (object, sb) {
  if (object == null) {
    sb.push('null')
    return
  }
  if (typeof object === 'object') {
    if (goog.isArray(object)) {
      this.serializeArray(object, sb)
      return
    } else {
      if (object instanceof String || object instanceof Number || object instanceof Boolean) {
        object = object.valueOf()
      } else {
        this.serializeObject_(object, sb)
        return
      }
    }
  }
  switch (typeof object) {
    case 'string':
      this.serializeString_(object, sb)
      break
    case 'number':
      this.serializeNumber_(object, sb)
      break
    case 'boolean':
      sb.push(String(object))
      break
    case 'function':
      sb.push('null')
      break
    default:
      throw new Error('Unknown type: ' + typeof object)
  }
}
goog.json.Serializer.charToJsonCharCache_ = {'"': '\\"', '\\': '\\\\', '/': '\\/', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t', '\x0B': '\\u000b'}
goog.json.Serializer.charsToReplace_ = /\uffff/.test('\uffff') ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g
goog.json.Serializer.prototype.serializeString_ = function (s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function (c) {
    var rv = goog.json.Serializer.charToJsonCharCache_[c]
    if (!rv) {
      rv = '\\u' + (c.charCodeAt(0) | 65536).toString(16).substr(1)
      goog.json.Serializer.charToJsonCharCache_[c] = rv
    }
    return rv
  }), '"')
}
goog.json.Serializer.prototype.serializeNumber_ = function (n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? String(n) : 'null')
}
goog.json.Serializer.prototype.serializeArray = function (arr, sb) {
  var l = arr.length
  sb.push('[')
  var sep = ''
  for (var i = 0; i < l; i++) {
    sb.push(sep)
    var value = arr[i]
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb)
    sep = ','
  }
  sb.push(']')
}
goog.json.Serializer.prototype.serializeObject_ = function (obj, sb) {
  sb.push('{')
  var sep = ''
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key]
      if (typeof value !== 'function') {
        sb.push(sep)
        this.serializeString_(key, sb)
        sb.push(':')
        this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb)
        sep = ','
      }
    }
  }
  sb.push('}')
}
goog.provide('goog.json.hybrid')
goog.require('goog.asserts')
goog.require('goog.json')
goog.json.hybrid.stringify = goog.json.USE_NATIVE_JSON ? goog.global['JSON']['stringify'] : function (obj) {
  if (goog.global.JSON) {
    try {
      return goog.global.JSON.stringify(obj)
    } catch (e) {
    }
  }
  return goog.json.serialize(obj)
}
goog.json.hybrid.parse_ = function (jsonString, fallbackParser) {
  if (goog.global.JSON) {
    try {
      var obj = goog.global.JSON.parse(jsonString)
      goog.asserts.assert(typeof obj === 'object')
      return obj
    } catch (e) {
    }
  }
  return fallbackParser(jsonString)
}
goog.json.hybrid.parse = goog.json.USE_NATIVE_JSON ? goog.global['JSON']['parse'] : function (jsonString) {
  return goog.json.hybrid.parse_(jsonString, goog.json.parse)
}
goog.provide('goog.debug.LogRecord')
goog.debug.LogRecord = function (level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber)
}
goog.debug.LogRecord.prototype.time_
goog.debug.LogRecord.prototype.level_
goog.debug.LogRecord.prototype.msg_
goog.debug.LogRecord.prototype.loggerName_
goog.debug.LogRecord.prototype.sequenceNumber_ = 0
goog.debug.LogRecord.prototype.exception_ = null
goog.define('goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS', true)
goog.debug.LogRecord.nextSequenceNumber_ = 0
goog.debug.LogRecord.prototype.reset = function (level, msg, loggerName, opt_time, opt_sequenceNumber) {
  if (goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof opt_sequenceNumber === 'number' ? opt_sequenceNumber : goog.debug.LogRecord.nextSequenceNumber_++
  }
  this.time_ = opt_time || goog.now()
  this.level_ = level
  this.msg_ = msg
  this.loggerName_ = loggerName
  delete this.exception_
}
goog.debug.LogRecord.prototype.getLoggerName = function () {
  return this.loggerName_
}
goog.debug.LogRecord.prototype.getException = function () {
  return this.exception_
}
goog.debug.LogRecord.prototype.setException = function (exception) {
  this.exception_ = exception
}
goog.debug.LogRecord.prototype.setLoggerName = function (loggerName) {
  this.loggerName_ = loggerName
}
goog.debug.LogRecord.prototype.getLevel = function () {
  return this.level_
}
goog.debug.LogRecord.prototype.setLevel = function (level) {
  this.level_ = level
}
goog.debug.LogRecord.prototype.getMessage = function () {
  return this.msg_
}
goog.debug.LogRecord.prototype.setMessage = function (msg) {
  this.msg_ = msg
}
goog.debug.LogRecord.prototype.getMillis = function () {
  return this.time_
}
goog.debug.LogRecord.prototype.setMillis = function (time) {
  this.time_ = time
}
goog.debug.LogRecord.prototype.getSequenceNumber = function () {
  return this.sequenceNumber_
}
goog.provide('goog.debug.LogBuffer')
goog.require('goog.asserts')
goog.require('goog.debug.LogRecord')
goog.debug.LogBuffer = function () {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), 'Cannot use goog.debug.LogBuffer without defining ' + 'goog.debug.LogBuffer.CAPACITY.')
  this.clear()
}
goog.debug.LogBuffer.getInstance = function () {
  if (!goog.debug.LogBuffer.instance_) {
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer()
  }
  return goog.debug.LogBuffer.instance_
}
goog.define('goog.debug.LogBuffer.CAPACITY', 0)
goog.debug.LogBuffer.prototype.buffer_
goog.debug.LogBuffer.prototype.curIndex_
goog.debug.LogBuffer.prototype.isFull_
goog.debug.LogBuffer.prototype.addRecord = function (level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY
  this.curIndex_ = curIndex
  if (this.isFull_) {
    var ret = this.buffer_[curIndex]
    ret.reset(level, msg, loggerName)
    return ret
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName)
}
goog.debug.LogBuffer.isBufferingEnabled = function () {
  return goog.debug.LogBuffer.CAPACITY > 0
}
goog.debug.LogBuffer.prototype.clear = function () {
  this.buffer_ = new Array(goog.debug.LogBuffer.CAPACITY)
  this.curIndex_ = -1
  this.isFull_ = false
}
goog.debug.LogBuffer.prototype.forEachRecord = function (func) {
  var buffer = this.buffer_
  if (!buffer[0]) {
    return
  }
  var curIndex = this.curIndex_
  var i = this.isFull_ ? curIndex : -1
  do {
    i = (i + 1) % goog.debug.LogBuffer.CAPACITY
    func(buffer[i])
  } while (i != curIndex)
}
goog.provide('goog.debug.LogManager')
goog.provide('goog.debug.Loggable')
goog.provide('goog.debug.Logger')
goog.provide('goog.debug.Logger.Level')
goog.require('goog.array')
goog.require('goog.asserts')
goog.require('goog.debug')
goog.require('goog.debug.LogBuffer')
goog.require('goog.debug.LogRecord')
goog.debug.Loggable
goog.debug.Logger = function (name) {
  this.name_ = name
  this.parent_ = null
  this.level_ = null
  this.children_ = null
  this.handlers_ = null
}
goog.debug.Logger.ROOT_LOGGER_NAME = ''
goog.define('goog.debug.Logger.ENABLE_HIERARCHY', true)
goog.define('goog.debug.Logger.ENABLE_PROFILER_LOGGING', false)
if (!goog.debug.Logger.ENABLE_HIERARCHY) {
  goog.debug.Logger.rootHandlers_ = []
  goog.debug.Logger.rootLevel_
}
goog.debug.Logger.Level = function (name, value) {
  this.name = name
  this.value = value
}
goog.debug.Logger.Level.prototype.toString = function () {
  return this.name
}
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level('OFF', Infinity)
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level('SHOUT', 1200)
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level('SEVERE', 1000)
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level('WARNING', 900)
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level('INFO', 800)
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level('CONFIG', 700)
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level('FINE', 500)
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level('FINER', 400)
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level('FINEST', 300)
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level('ALL', 0)
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL]
goog.debug.Logger.Level.predefinedLevelsCache_ = null
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function () {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {}
  for (var i = 0, level; level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i]; i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level
    goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level
  }
}
goog.debug.Logger.Level.getPredefinedLevel = function (name) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_()
  }
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null
}
goog.debug.Logger.Level.getPredefinedLevelByValue = function (value) {
  if (!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_()
  }
  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value]
  }
  for (var i = 0; i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length; ++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i]
    if (level.value <= value) {
      return level
    }
  }
  return null
}
goog.debug.Logger.getLogger = function (name) {
  return goog.debug.LogManager.getLogger(name)
}
goog.debug.Logger.logToProfilers = function (msg) {
  if (goog.debug.Logger.ENABLE_PROFILER_LOGGING) {
    var msWriteProfilerMark = goog.global['msWriteProfilerMark']
    if (msWriteProfilerMark) {
      msWriteProfilerMark(msg)
      return
    }
    var console = goog.global['console']
    if (console && console['timeStamp']) {
      console['timeStamp'](msg)
    }
  }
}
goog.debug.Logger.prototype.getName = function () {
  return this.name_
}
goog.debug.Logger.prototype.addHandler = function (handler) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      if (!this.handlers_) {
        this.handlers_ = []
      }
      this.handlers_.push(handler)
    } else {
      goog.asserts.assert(!this.name_, 'Cannot call addHandler on a non-root logger when ' + 'goog.debug.Logger.ENABLE_HIERARCHY is false.')
      goog.debug.Logger.rootHandlers_.push(handler)
    }
  }
}
goog.debug.Logger.prototype.removeHandler = function (handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_
    return !!handlers && goog.array.remove(handlers, handler)
  } else {
    return false
  }
}
goog.debug.Logger.prototype.getParent = function () {
  return this.parent_
}
goog.debug.Logger.prototype.getChildren = function () {
  if (!this.children_) {
    this.children_ = {}
  }
  return this.children_
}
goog.debug.Logger.prototype.setLevel = function (level) {
  if (goog.debug.LOGGING_ENABLED) {
    if (goog.debug.Logger.ENABLE_HIERARCHY) {
      this.level_ = level
    } else {
      goog.asserts.assert(!this.name_, 'Cannot call setLevel() on a non-root logger when ' + 'goog.debug.Logger.ENABLE_HIERARCHY is false.')
      goog.debug.Logger.rootLevel_ = level
    }
  }
}
goog.debug.Logger.prototype.getLevel = function () {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF
}
goog.debug.Logger.prototype.getEffectiveLevel = function () {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if (this.level_) {
    return this.level_
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail('Root logger has no level set.')
  return null
}
goog.debug.Logger.prototype.isLoggable = function (level) {
  return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value
}
goog.debug.Logger.prototype.log = function (level, msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(level)) {
    if (goog.isFunction(msg)) {
      msg = msg()
    }
    this.doLogRecord_(this.getLogRecord(level, msg, opt_exception))
  }
}
goog.debug.Logger.prototype.getLogRecord = function (level, msg, opt_exception) {
  if (goog.debug.LogBuffer.isBufferingEnabled()) {
    var logRecord = goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_)
  } else {
    logRecord = new goog.debug.LogRecord(level, String(msg), this.name_)
  }
  if (opt_exception) {
    logRecord.setException(opt_exception)
  }
  return logRecord
}
goog.debug.Logger.prototype.shout = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.severe = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.warning = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.info = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.INFO, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.config = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.fine = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINE, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.finer = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINER, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.finest = function (msg, opt_exception) {
  if (goog.debug.LOGGING_ENABLED) {
    this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception)
  }
}
goog.debug.Logger.prototype.logRecord = function (logRecord) {
  if (goog.debug.LOGGING_ENABLED && this.isLoggable(logRecord.getLevel())) {
    this.doLogRecord_(logRecord)
  }
}
goog.debug.Logger.prototype.doLogRecord_ = function (logRecord) {
  if (goog.debug.Logger.ENABLE_PROFILER_LOGGING) {
    goog.debug.Logger.logToProfilers('log:' + logRecord.getMessage())
  }
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var target = this
    while (target) {
      target.callPublish_(logRecord)
      target = target.getParent()
    }
  } else {
    for (var i = 0, handler; handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord)
    }
  }
}
goog.debug.Logger.prototype.callPublish_ = function (logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler; handler = this.handlers_[i]; i++) {
      handler(logRecord)
    }
  }
}
goog.debug.Logger.prototype.setParent_ = function (parent) {
  this.parent_ = parent
}
goog.debug.Logger.prototype.addChild_ = function (name, logger) {
  this.getChildren()[name] = logger
}
goog.debug.LogManager = {}
goog.debug.LogManager.loggers_ = {}
goog.debug.LogManager.rootLogger_ = null
goog.debug.LogManager.initialize = function () {
  if (!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME)
    goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG)
  }
}
goog.debug.LogManager.getLoggers = function () {
  return goog.debug.LogManager.loggers_
}
goog.debug.LogManager.getRoot = function () {
  goog.debug.LogManager.initialize()
  return goog.debug.LogManager.rootLogger_
}
goog.debug.LogManager.getLogger = function (name) {
  goog.debug.LogManager.initialize()
  var ret = goog.debug.LogManager.loggers_[name]
  return ret || goog.debug.LogManager.createLogger_(name)
}
goog.debug.LogManager.createFunctionForCatchErrors = function (opt_logger) {
  return function (info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot()
    logger.severe('Error: ' + info.message + ' (' + info.fileName + ' @ Line: ' + info.line + ')')
  }
}
goog.debug.LogManager.createLogger_ = function (name) {
  var logger = new goog.debug.Logger(name)
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf('.')
    var parentName = name.substr(0, lastDotIndex)
    var leafName = name.substr(lastDotIndex + 1)
    var parentLogger = goog.debug.LogManager.getLogger(parentName)
    parentLogger.addChild_(leafName, logger)
    logger.setParent_(parentLogger)
  }
  goog.debug.LogManager.loggers_[name] = logger
  return logger
}
goog.provide('goog.log')
goog.provide('goog.log.Level')
goog.provide('goog.log.LogRecord')
goog.provide('goog.log.Logger')
goog.require('goog.debug')
goog.require('goog.debug.LogManager')
goog.require('goog.debug.LogRecord')
goog.require('goog.debug.Logger')
goog.define('goog.log.ENABLED', goog.debug.LOGGING_ENABLED)
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME
goog.log.Logger = goog.debug.Logger
goog.log.Level = goog.debug.Logger.Level
goog.log.LogRecord = goog.debug.LogRecord
goog.log.getLogger = function (name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name)
    if (opt_level && logger) {
      logger.setLevel(opt_level)
    }
    return logger
  } else {
    return null
  }
}
goog.log.addHandler = function (logger, handler) {
  if (goog.log.ENABLED && logger) {
    logger.addHandler(handler)
  }
}
goog.log.removeHandler = function (logger, handler) {
  if (goog.log.ENABLED && logger) {
    return logger.removeHandler(handler)
  } else {
    return false
  }
}
goog.log.log = function (logger, level, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.log(level, msg, opt_exception)
  }
}
goog.log.error = function (logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.severe(msg, opt_exception)
  }
}
goog.log.warning = function (logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.warning(msg, opt_exception)
  }
}
goog.log.info = function (logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.info(msg, opt_exception)
  }
}
goog.log.fine = function (logger, msg, opt_exception) {
  if (goog.log.ENABLED && logger) {
    logger.fine(msg, opt_exception)
  }
}
goog.provide('goog.net.ErrorCode')
goog.net.ErrorCode = {NO_ERROR: 0, ACCESS_DENIED: 1, FILE_NOT_FOUND: 2, FF_SILENT_ERROR: 3, CUSTOM_ERROR: 4, EXCEPTION: 5, HTTP_ERROR: 6, ABORT: 7, TIMEOUT: 8, OFFLINE: 9}
goog.net.ErrorCode.getDebugMessage = function (errorCode) {
  switch (errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return 'No Error'
    case goog.net.ErrorCode.ACCESS_DENIED:
      return 'Access denied to content document'
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return 'File not found'
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return 'Firefox silently errored'
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return 'Application custom error'
    case goog.net.ErrorCode.EXCEPTION:
      return 'An exception occurred'
    case goog.net.ErrorCode.HTTP_ERROR:
      return 'Http response at 400 or 500 level'
    case goog.net.ErrorCode.ABORT:
      return 'Request was aborted'
    case goog.net.ErrorCode.TIMEOUT:
      return 'Request timed out'
    case goog.net.ErrorCode.OFFLINE:
      return 'The resource is not available offline'
    default:
      return 'Unrecognized error code'
  }
}
goog.provide('goog.net.HttpStatus')
goog.net.HttpStatus = {CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUEST_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
  QUIRK_IE_NO_CONTENT: 1223}
goog.net.HttpStatus.isSuccess = function (status) {
  switch (status) {
    case goog.net.HttpStatus.OK:
    case goog.net.HttpStatus.CREATED:
    case goog.net.HttpStatus.ACCEPTED:
    case goog.net.HttpStatus.NO_CONTENT:
    case goog.net.HttpStatus.PARTIAL_CONTENT:
    case goog.net.HttpStatus.NOT_MODIFIED:
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return true
    default:
      return false
  }
}
goog.provide('goog.net.XhrLike')
goog.net.XhrLike = function () {
}
goog.net.XhrLike.OrNative
goog.net.XhrLike.prototype.onreadystatechange
goog.net.XhrLike.prototype.responseText
goog.net.XhrLike.prototype.responseXML
goog.net.XhrLike.prototype.readyState
goog.net.XhrLike.prototype.status
goog.net.XhrLike.prototype.statusText
goog.net.XhrLike.prototype.open = function (method, url, opt_async, opt_user, opt_password) {
}
goog.net.XhrLike.prototype.send = function (opt_data) {
}
goog.net.XhrLike.prototype.abort = function () {
}
goog.net.XhrLike.prototype.setRequestHeader = function (header, value) {
}
goog.net.XhrLike.prototype.getResponseHeader = function (header) {
}
goog.net.XhrLike.prototype.getAllResponseHeaders = function () {
}
goog.provide('goog.net.XmlHttpFactory')
goog.require('goog.net.XhrLike')
goog.net.XmlHttpFactory = function () {
}
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null
goog.net.XmlHttpFactory.prototype.createInstance = goog.abstractMethod
goog.net.XmlHttpFactory.prototype.getOptions = function () {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions())
}
goog.net.XmlHttpFactory.prototype.internalGetOptions = goog.abstractMethod
goog.provide('goog.net.WrapperXmlHttpFactory')
goog.require('goog.net.XhrLike')
goog.require('goog.net.XmlHttpFactory')
goog.net.WrapperXmlHttpFactory = function (xhrFactory, optionsFactory) {
  goog.net.XmlHttpFactory.call(this)
  this.xhrFactory_ = xhrFactory
  this.optionsFactory_ = optionsFactory
}
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory)
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function () {
  return this.xhrFactory_()
}
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function () {
  return this.optionsFactory_()
}
goog.provide('goog.net.DefaultXmlHttpFactory')
goog.provide('goog.net.XmlHttp')
goog.provide('goog.net.XmlHttp.OptionType')
goog.provide('goog.net.XmlHttp.ReadyState')
goog.provide('goog.net.XmlHttpDefines')
goog.require('goog.asserts')
goog.require('goog.net.WrapperXmlHttpFactory')
goog.require('goog.net.XmlHttpFactory')
goog.net.XmlHttp = function () {
  return goog.net.XmlHttp.factory_.createInstance()
}
goog.define('goog.net.XmlHttp.ASSUME_NATIVE_XHR', false)
goog.net.XmlHttpDefines = {}
goog.define('goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR', false)
goog.net.XmlHttp.getOptions = function () {
  return goog.net.XmlHttp.factory_.getOptions()
}
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION: 0, LOCAL_REQUEST_ERROR: 1}
goog.net.XmlHttp.ReadyState = {UNINITIALIZED: 0, LOADING: 1, LOADED: 2, INTERACTIVE: 3, COMPLETE: 4}
goog.net.XmlHttp.factory_
goog.net.XmlHttp.setFactory = function (factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(goog.asserts.assert(factory), goog.asserts.assert(optionsFactory)))
}
goog.net.XmlHttp.setGlobalFactory = function (factory) {
  goog.net.XmlHttp.factory_ = factory
}
goog.net.DefaultXmlHttpFactory = function () {
  goog.net.XmlHttpFactory.call(this)
}
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory)
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function () {
  var progId = this.getProgId_()
  if (progId) {
    return new ActiveXObject(progId)
  } else {
    return new XMLHttpRequest()
  }
}
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function () {
  var progId = this.getProgId_()
  var options = {}
  if (progId) {
    options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = true
    options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = true
  }
  return options
}
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function () {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR || goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return ''
  }
  if (!this.ieProgId_ && typeof XMLHttpRequest === 'undefined' && typeof ActiveXObject !== 'undefined') {
    var ACTIVE_X_IDENTS = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP']
    for (var i = 0; i < ACTIVE_X_IDENTS.length; i++) {
      var candidate = ACTIVE_X_IDENTS[i]
      try {
        new ActiveXObject(candidate)
        this.ieProgId_ = candidate
        return candidate
      } catch (e) {
      }
    }
    throw new Error('Could not create ActiveXObject. ActiveX might be disabled,' + ' or MSXML might not be installed')
  }
  return this.ieProgId_
}
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory())
goog.provide('goog.structs')
goog.require('goog.array')
goog.require('goog.object')
goog.structs.getCount = function (col) {
  if (col.getCount && typeof col.getCount === 'function') {
    return col.getCount()
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return col.length
  }
  return goog.object.getCount(col)
}
goog.structs.getValues = function (col) {
  if (col.getValues && typeof col.getValues === 'function') {
    return col.getValues()
  }
  if (goog.isString(col)) {
    return col.split('')
  }
  if (goog.isArrayLike(col)) {
    var rv = []
    var l = col.length
    for (var i = 0; i < l; i++) {
      rv.push(col[i])
    }
    return rv
  }
  return goog.object.getValues(col)
}
goog.structs.getKeys = function (col) {
  if (col.getKeys && typeof col.getKeys === 'function') {
    return col.getKeys()
  }
  if (col.getValues && typeof col.getValues === 'function') {
    return undefined
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    var rv = []
    var l = col.length
    for (var i = 0; i < l; i++) {
      rv.push(i)
    }
    return rv
  }
  return goog.object.getKeys(col)
}
goog.structs.contains = function (col, val) {
  if (col.contains && typeof col.contains === 'function') {
    return col.contains(val)
  }
  if (col.containsValue && typeof col.containsValue === 'function') {
    return col.containsValue(val)
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(col, val)
  }
  return goog.object.containsValue(col, val)
}
goog.structs.isEmpty = function (col) {
  if (col.isEmpty && typeof col.isEmpty === 'function') {
    return col.isEmpty()
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty(col)
  }
  return goog.object.isEmpty(col)
}
goog.structs.clear = function (col) {
  if (col.clear && typeof col.clear === 'function') {
    col.clear()
  } else {
    if (goog.isArrayLike(col)) {
      goog.array.clear(col)
    } else {
      goog.object.clear(col)
    }
  }
}
goog.structs.forEach = function (col, f, opt_obj) {
  if (col.forEach && typeof col.forEach === 'function') {
    col.forEach(f, opt_obj)
  } else {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj)
    } else {
      var keys = goog.structs.getKeys(col)
      var values = goog.structs.getValues(col)
      var l = values.length
      for (var i = 0; i < l; i++) {
        f.call(opt_obj, values[i], keys && keys[i], col)
      }
    }
  }
}
goog.structs.filter = function (col, f, opt_obj) {
  if (typeof col.filter === 'function') {
    return col.filter(f, opt_obj)
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj)
  }
  var rv
  var keys = goog.structs.getKeys(col)
  var values = goog.structs.getValues(col)
  var l = values.length
  if (keys) {
    rv = {}
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i]
      }
    }
  } else {
    rv = []
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i])
      }
    }
  }
  return rv
}
goog.structs.map = function (col, f, opt_obj) {
  if (typeof col.map === 'function') {
    return col.map(f, opt_obj)
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj)
  }
  var rv
  var keys = goog.structs.getKeys(col)
  var values = goog.structs.getValues(col)
  var l = values.length
  if (keys) {
    rv = {}
    for (var i = 0; i < l; i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col)
    }
  } else {
    rv = []
    for (var i = 0; i < l; i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col)
    }
  }
  return rv
}
goog.structs.some = function (col, f, opt_obj) {
  if (typeof col.some === 'function') {
    return col.some(f, opt_obj)
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col)
  var values = goog.structs.getValues(col)
  var l = values.length
  for (var i = 0; i < l; i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true
    }
  }
  return false
}
goog.structs.every = function (col, f, opt_obj) {
  if (typeof col.every === 'function') {
    return col.every(f, opt_obj)
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col)
  var values = goog.structs.getValues(col)
  var l = values.length
  for (var i = 0; i < l; i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false
    }
  }
  return true
}
goog.provide('goog.math')
goog.require('goog.array')
goog.require('goog.asserts')
goog.math.randomInt = function (a) {
  return Math.floor(Math.random() * a)
}
goog.math.uniformRandom = function (a, b) {
  return a + Math.random() * (b - a)
}
goog.math.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max)
}
goog.math.modulo = function (a, b) {
  var r = a % b
  return r * b < 0 ? r + b : r
}
goog.math.lerp = function (a, b, x) {
  return a + x * (b - a)
}
goog.math.nearlyEquals = function (a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 0.000001)
}
goog.math.standardAngle = function (angle) {
  return goog.math.modulo(angle, 360)
}
goog.math.standardAngleInRadians = function (angle) {
  return goog.math.modulo(angle, 2 * Math.PI)
}
goog.math.toRadians = function (angleDegrees) {
  return angleDegrees * Math.PI / 180
}
goog.math.toDegrees = function (angleRadians) {
  return angleRadians * 180 / Math.PI
}
goog.math.angleDx = function (degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees))
}
goog.math.angleDy = function (degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees))
}
goog.math.angle = function (x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)))
}
goog.math.angleDifference = function (startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle)
  if (d > 180) {
    d = d - 360
  } else {
    if (d <= -180) {
      d = 360 + d
    }
  }
  return d
}
goog.math.sign = function (x) {
  if (x > 0) {
    return 1
  }
  if (x < 0) {
    return -1
  }
  return x
}
goog.math.longestCommonSubsequence = function (array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function (a, b) {
    return a == b
  }
  var collect = opt_collectorFn || function (i1, i2) {
    return array1[i1]
  }
  var length1 = array1.length
  var length2 = array2.length
  var arr = []
  for (var i = 0; i < length1 + 1; i++) {
    arr[i] = []
    arr[i][0] = 0
  }
  for (var j = 0; j < length2 + 1; j++) {
    arr[0][j] = 0
  }
  for (i = 1; i <= length1; i++) {
    for (j = 1; j <= length2; j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1])
      }
    }
  }
  var result = []
  var i = length1, j = length2
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1))
      i--
      j--
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--
      } else {
        j--
      }
    }
  }
  return result
}
goog.math.sum = function (var_args) {
  return goog.array.reduce(arguments, function (sum, value) {
    return sum + value
  }, 0)
}
goog.math.average = function (var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length
}
goog.math.sampleVariance = function (var_args) {
  var sampleSize = arguments.length
  if (sampleSize < 2) {
    return 0
  }
  var mean = goog.math.average.apply(null, arguments)
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function (val) {
    return Math.pow(val - mean, 2)
  })) / (sampleSize - 1)
  return variance
}
goog.math.standardDeviation = function (var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
}
goog.math.isInt = function (num) {
  return isFinite(num) && num % 1 == 0
}
goog.math.isFiniteNumber = function (num) {
  return isFinite(num)
}
goog.math.isNegativeZero = function (num) {
  return num == 0 && 1 / num < 0
}
goog.math.log10Floor = function (num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E)
    return x - (parseFloat('1e' + x) > num ? 1 : 0)
  }
  return num == 0 ? -Infinity : NaN
}
goog.math.safeFloor = function (num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0)
  return Math.floor(num + (opt_epsilon || 2e-15))
}
goog.math.safeCeil = function (num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0)
  return Math.ceil(num - (opt_epsilon || 2e-15))
}
goog.provide('goog.iter')
goog.provide('goog.iter.Iterable')
goog.provide('goog.iter.Iterator')
goog.provide('goog.iter.StopIteration')
goog.require('goog.array')
goog.require('goog.asserts')
goog.require('goog.functions')
goog.require('goog.math')
goog.iter.Iterable
goog.iter.StopIteration = 'StopIteration' in goog.global ? goog.global['StopIteration'] : {message: 'StopIteration', stack: ''}
goog.iter.Iterator = function () {
}
goog.iter.Iterator.prototype.next = function () {
  throw goog.iter.StopIteration
}
goog.iter.Iterator.prototype.__iterator__ = function (opt_keys) {
  return this
}
goog.iter.toIterator = function (iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable
  }
  if (typeof iterable.__iterator__ === 'function') {
    return iterable.__iterator__(false)
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0
    var newIter = new goog.iter.Iterator()
    newIter.next = function () {
      while (true) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration
        }
        if (!(i in iterable)) {
          i++
          continue
        }
        return iterable[i++]
      }
    }
    return newIter
  }
  throw new Error('Not implemented')
}
goog.iter.forEach = function (iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj)
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable)
    try {
      while (true) {
        f.call(opt_obj, iterable.next(), undefined, iterable)
      }
    } catch (ex$3) {
      if (ex$3 !== goog.iter.StopIteration) {
        throw ex$3
      }
    }
  }
}
goog.iter.filter = function (iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable)
  var newIter = new goog.iter.Iterator()
  newIter.next = function () {
    while (true) {
      var val = iterator.next()
      if (f.call(opt_obj, val, undefined, iterator)) {
        return val
      }
    }
  }
  return newIter
}
goog.iter.filterFalse = function (iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj)
}
goog.iter.range = function (startOrStop, opt_stop, opt_step) {
  var start = 0
  var stop = startOrStop
  var step = opt_step || 1
  if (arguments.length > 1) {
    start = startOrStop
    stop = opt_stop
  }
  if (step == 0) {
    throw new Error('Range step argument must not be zero')
  }
  var newIter = new goog.iter.Iterator()
  newIter.next = function () {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration
    }
    var rv = start
    start += step
    return rv
  }
  return newIter
}
goog.iter.join = function (iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator)
}
goog.iter.map = function (iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable)
  var newIter = new goog.iter.Iterator()
  newIter.next = function () {
    var val = iterator.next()
    return f.call(opt_obj, val, undefined, iterator)
  }
  return newIter
}
goog.iter.reduce = function (iterable, f, val, opt_obj) {
  var rval = val
  goog.iter.forEach(iterable, function (val) {
    rval = f.call(opt_obj, rval, val)
  })
  return rval
}
goog.iter.some = function (iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable)
  try {
    while (true) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex
    }
  }
  return false
}
goog.iter.every = function (iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable)
  try {
    while (true) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex
    }
  }
  return true
}
goog.iter.chain = function (var_args) {
  return goog.iter.chainFromIterable(arguments)
}
goog.iter.chainFromIterable = function (iterable) {
  var iterator = goog.iter.toIterator(iterable)
  var iter = new goog.iter.Iterator()
  var current = null
  iter.next = function () {
    while (true) {
      if (current == null) {
        var it = iterator.next()
        current = goog.iter.toIterator(it)
      }
      try {
        return current.next()
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex
        }
        current = null
      }
    }
  }
  return iter
}
goog.iter.dropWhile = function (iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable)
  var newIter = new goog.iter.Iterator()
  var dropping = true
  newIter.next = function () {
    while (true) {
      var val = iterator.next()
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue
      } else {
        dropping = false
      }
      return val
    }
  }
  return newIter
}
goog.iter.takeWhile = function (iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable)
  var iter = new goog.iter.Iterator()
  iter.next = function () {
    var val = iterator.next()
    if (f.call(opt_obj, val, undefined, iterator)) {
      return val
    }
    throw goog.iter.StopIteration
  }
  return iter
}
goog.iter.toArray = function (iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable)
  }
  iterable = goog.iter.toIterator(iterable)
  var array = []
  goog.iter.forEach(iterable, function (val) {
    array.push(val)
  })
  return array
}
goog.iter.equals = function (iterable1, iterable2, opt_equalsFn) {
  var fillValue = {}
  var pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2)
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality
  return goog.iter.every(pairs, function (pair) {
    return equalsFn(pair[0], pair[1])
  })
}
goog.iter.nextOrValue = function (iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next()
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e
    }
    return defaultValue
  }
}
goog.iter.product = function (var_args) {
  var someArrayEmpty = goog.array.some(arguments, function (arr) {
    return !arr.length
  })
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator()
  }
  var iter = new goog.iter.Iterator()
  var arrays = arguments
  var indicies = goog.array.repeat(0, arrays.length)
  iter.next = function () {
    if (indicies) {
      var retVal = goog.array.map(indicies, function (valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex]
      })
      for (var i = indicies.length - 1; i >= 0; i--) {
        goog.asserts.assert(indicies)
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++
          break
        }
        if (i == 0) {
          indicies = null
          break
        }
        indicies[i] = 0
      }
      return retVal
    }
    throw goog.iter.StopIteration
  }
  return iter
}
goog.iter.cycle = function (iterable) {
  var baseIterator = goog.iter.toIterator(iterable)
  var cache = []
  var cacheIndex = 0
  var iter = new goog.iter.Iterator()
  var useCache = false
  iter.next = function () {
    var returnElement = null
    if (!useCache) {
      try {
        returnElement = baseIterator.next()
        cache.push(returnElement)
        return returnElement
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e
        }
        useCache = true
      }
    }
    returnElement = cache[cacheIndex]
    cacheIndex = (cacheIndex + 1) % cache.length
    return returnElement
  }
  return iter
}
goog.iter.count = function (opt_start, opt_step) {
  var counter = opt_start || 0
  var step = goog.isDef(opt_step) ? opt_step : 1
  var iter = new goog.iter.Iterator()
  iter.next = function () {
    var returnValue = counter
    counter += step
    return returnValue
  }
  return iter
}
goog.iter.repeat = function (value) {
  var iter = new goog.iter.Iterator()
  iter.next = goog.functions.constant(value)
  return iter
}
goog.iter.accumulate = function (iterable) {
  var iterator = goog.iter.toIterator(iterable)
  var total = 0
  var iter = new goog.iter.Iterator()
  iter.next = function () {
    total += iterator.next()
    return total
  }
  return iter
}
goog.iter.zip = function (var_args) {
  var args = arguments
  var iter = new goog.iter.Iterator()
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator)
    iter.next = function () {
      var arr = goog.array.map(iterators, function (it) {
        return it.next()
      })
      return arr
    }
  }
  return iter
}
goog.iter.zipLongest = function (fillValue, var_args) {
  var args = goog.array.slice(arguments, 1)
  var iter = new goog.iter.Iterator()
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator)
    iter.next = function () {
      var iteratorsHaveValues = false
      var arr = goog.array.map(iterators, function (it) {
        var returnValue
        try {
          returnValue = it.next()
          iteratorsHaveValues = true
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex
          }
          returnValue = fillValue
        }
        return returnValue
      })
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration
      }
      return arr
    }
  }
  return iter
}
goog.iter.compress = function (iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors)
  return goog.iter.filter(iterable, function () {
    return !!selectorIterator.next()
  })
}
goog.iter.GroupByIterator_ = function (iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable)
  this.keyFunc = opt_keyFunc || goog.functions.identity
  this.targetKey
  this.currentKey
  this.currentValue
}
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator)
goog.iter.GroupByIterator_.prototype.next = function () {
  while (this.currentKey == this.targetKey) {
    this.currentValue = this.iterator.next()
    this.currentKey = this.keyFunc(this.currentValue)
  }
  this.targetKey = this.currentKey
  return [this.currentKey, this.groupItems_(this.targetKey)]
}
goog.iter.GroupByIterator_.prototype.groupItems_ = function (targetKey) {
  var arr = []
  while (this.currentKey == targetKey) {
    arr.push(this.currentValue)
    try {
      this.currentValue = this.iterator.next()
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex
      }
      break
    }
    this.currentKey = this.keyFunc(this.currentValue)
  }
  return arr
}
goog.iter.groupBy = function (iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc)
}
goog.iter.starMap = function (iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable)
  var iter = new goog.iter.Iterator()
  iter.next = function () {
    var args = goog.iter.toArray(iterator.next())
    return f.apply(opt_obj, goog.array.concat(args, undefined, iterator))
  }
  return iter
}
goog.iter.tee = function (iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable)
  var num = goog.isNumber(opt_num) ? opt_num : 2
  var buffers = goog.array.map(goog.array.range(num), function () {
    return []
  })
  var addNextIteratorValueToBuffers = function () {
    var val = iterator.next()
    goog.array.forEach(buffers, function (buffer) {
      buffer.push(val)
    })
  }
  var createIterator = function (buffer) {
    var iter = new goog.iter.Iterator()
    iter.next = function () {
      if (goog.array.isEmpty(buffer)) {
        addNextIteratorValueToBuffers()
      }
      goog.asserts.assert(!goog.array.isEmpty(buffer))
      return buffer.shift()
    }
    return iter
  }
  return goog.array.map(buffers, createIterator)
}
goog.iter.enumerate = function (iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable)
}
goog.iter.limit = function (iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0)
  var iterator = goog.iter.toIterator(iterable)
  var iter = new goog.iter.Iterator()
  var remaining = limitSize
  iter.next = function () {
    if (remaining-- > 0) {
      return iterator.next()
    }
    throw goog.iter.StopIteration
  }
  return iter
}
goog.iter.consume = function (iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && count >= 0)
  var iterator = goog.iter.toIterator(iterable)
  while (count-- > 0) {
    goog.iter.nextOrValue(iterator, null)
  }
  return iterator
}
goog.iter.slice = function (iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && start >= 0)
  var iterator = goog.iter.consume(iterable, start)
  if (goog.isNumber(opt_end)) {
    goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start)
    iterator = goog.iter.limit(iterator, opt_end - start)
  }
  return iterator
}
goog.iter.hasDuplicates_ = function (arr) {
  var deduped = []
  goog.array.removeDuplicates(arr, deduped)
  return arr.length != deduped.length
}
goog.iter.permutations = function (iterable, opt_length) {
  var elements = goog.iter.toArray(iterable)
  var length = goog.isNumber(opt_length) ? opt_length : elements.length
  var sets = goog.array.repeat(elements, length)
  var product = goog.iter.product.apply(undefined, sets)
  return goog.iter.filter(product, function (arr) {
    return !goog.iter.hasDuplicates_(arr)
  })
}
goog.iter.combinations = function (iterable, length) {
  var elements = goog.iter.toArray(iterable)
  var indexes = goog.iter.range(elements.length)
  var indexIterator = goog.iter.permutations(indexes, length)
  var sortedIndexIterator = goog.iter.filter(indexIterator, function (arr) {
    return goog.array.isSorted(arr)
  })
  var iter = new goog.iter.Iterator()
  function getIndexFromElements (index) {
    return elements[index]
  }
  iter.next = function () {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements)
  }
  return iter
}
goog.iter.combinationsWithReplacement = function (iterable, length) {
  var elements = goog.iter.toArray(iterable)
  var indexes = goog.array.range(elements.length)
  var sets = goog.array.repeat(indexes, length)
  var indexIterator = goog.iter.product.apply(undefined, sets)
  var sortedIndexIterator = goog.iter.filter(indexIterator, function (arr) {
    return goog.array.isSorted(arr)
  })
  var iter = new goog.iter.Iterator()
  function getIndexFromElements (index) {
    return elements[index]
  }
  iter.next = function () {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements)
  }
  return iter
}
goog.provide('goog.structs.Map')
goog.require('goog.iter.Iterator')
goog.require('goog.iter.StopIteration')
goog.require('goog.object')
goog.structs.Map = function (opt_map, var_args) {
  this.map_ = {}
  this.keys_ = []
  this.count_ = 0
  this.version_ = 0
  var argLength = arguments.length
  if (argLength > 1) {
    if (argLength % 2) {
      throw new Error('Uneven number of arguments')
    }
    for (var i = 0; i < argLength; i += 2) {
      this.set(arguments[i], arguments[i + 1])
    }
  } else {
    if (opt_map) {
      this.addAll(opt_map)
    }
  }
}
goog.structs.Map.prototype.getCount = function () {
  return this.count_
}
goog.structs.Map.prototype.getValues = function () {
  this.cleanupKeysArray_()
  var rv = []
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i]
    rv.push(this.map_[key])
  }
  return rv
}
goog.structs.Map.prototype.getKeys = function () {
  this.cleanupKeysArray_()
  return this.keys_.concat()
}
goog.structs.Map.prototype.containsKey = function (key) {
  return goog.structs.Map.hasKey_(this.map_, key)
}
goog.structs.Map.prototype.containsValue = function (val) {
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i]
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true
    }
  }
  return false
}
goog.structs.Map.prototype.equals = function (otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return true
  }
  if (this.count_ != otherMap.getCount()) {
    return false
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals
  this.cleanupKeysArray_()
  for (var key, i = 0; key = this.keys_[i]; i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return false
    }
  }
  return true
}
goog.structs.Map.defaultEquals = function (a, b) {
  return a === b
}
goog.structs.Map.prototype.isEmpty = function () {
  return this.count_ == 0
}
goog.structs.Map.prototype.clear = function () {
  this.map_ = {}
  this.keys_.length = 0
  this.count_ = 0
  this.version_ = 0
}
goog.structs.Map.prototype.remove = function (key) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key]
    this.count_--
    this.version_++
    if (this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_()
    }
    return true
  }
  return false
}
goog.structs.Map.prototype.cleanupKeysArray_ = function () {
  if (this.count_ != this.keys_.length) {
    var srcIndex = 0
    var destIndex = 0
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex]
      if (goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
  if (this.count_ != this.keys_.length) {
    var seen = {}
    var srcIndex = 0
    var destIndex = 0
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex]
      if (!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key
        seen[key] = 1
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
}
goog.structs.Map.prototype.get = function (key, opt_val) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key]
  }
  return opt_val
}
goog.structs.Map.prototype.set = function (key, value) {
  if (!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++
    this.keys_.push(key)
    this.version_++
  }
  this.map_[key] = value
}
goog.structs.Map.prototype.addAll = function (map) {
  var keys, values
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys()
    values = map.getValues()
  } else {
    keys = goog.object.getKeys(map)
    values = goog.object.getValues(map)
  }
  for (var i = 0; i < keys.length; i++) {
    this.set(keys[i], values[i])
  }
}
goog.structs.Map.prototype.forEach = function (f, opt_obj) {
  var keys = this.getKeys()
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var value = this.get(key)
    f.call(opt_obj, value, key, this)
  }
}
goog.structs.Map.prototype.clone = function () {
  return new goog.structs.Map(this)
}
goog.structs.Map.prototype.transpose = function () {
  var transposed = new goog.structs.Map()
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i]
    var value = this.map_[key]
    transposed.set(value, key)
  }
  return transposed
}
goog.structs.Map.prototype.toObject = function () {
  this.cleanupKeysArray_()
  var obj = {}
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i]
    obj[key] = this.map_[key]
  }
  return obj
}
goog.structs.Map.prototype.getKeyIterator = function () {
  return this.__iterator__(true)
}
goog.structs.Map.prototype.getValueIterator = function () {
  return this.__iterator__(false)
}
goog.structs.Map.prototype.__iterator__ = function (opt_keys) {
  this.cleanupKeysArray_()
  var i = 0
  var version = this.version_
  var selfObj = this
  var newIter = new goog.iter.Iterator()
  newIter.next = function () {
    if (version != selfObj.version_) {
      throw new Error('The map has changed since the iterator was created')
    }
    if (i >= selfObj.keys_.length) {
      throw goog.iter.StopIteration
    }
    var key = selfObj.keys_[i++]
    return opt_keys ? key : selfObj.map_[key]
  }
  return newIter
}
goog.structs.Map.hasKey_ = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
goog.provide('goog.uri.utils')
goog.provide('goog.uri.utils.ComponentIndex')
goog.provide('goog.uri.utils.QueryArray')
goog.provide('goog.uri.utils.QueryValue')
goog.provide('goog.uri.utils.StandardQueryParam')
goog.require('goog.array')
goog.require('goog.asserts')
goog.require('goog.string')
goog.uri.utils.CharCode_ = {AMPERSAND: 38, EQUAL: 61, HASH: 35, QUESTION: 63}
goog.uri.utils.buildFromEncodedParts = function (opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = ''
  if (opt_scheme) {
    out += opt_scheme + ':'
  }
  if (opt_domain) {
    out += '//'
    if (opt_userInfo) {
      out += opt_userInfo + '@'
    }
    out += opt_domain
    if (opt_port) {
      out += ':' + opt_port
    }
  }
  if (opt_path) {
    out += opt_path
  }
  if (opt_queryData) {
    out += '?' + opt_queryData
  }
  if (opt_fragment) {
    out += '#' + opt_fragment
  }
  return out
}
goog.uri.utils.splitRe_ = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([^/#?]*?)' + '(?::([0-9]+))?' + '(?=[/#?]|$)' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#([\\s\\S]*))?' + '$')
goog.uri.utils.ComponentIndex = {SCHEME: 1, USER_INFO: 2, DOMAIN: 3, PORT: 4, PATH: 5, QUERY_DATA: 6, FRAGMENT: 7}
goog.uri.utils.split = function (uri) {
  return uri.match(goog.uri.utils.splitRe_)
}
goog.uri.utils.decodeIfPossible_ = function (uri, opt_preserveReserved) {
  if (!uri) {
    return uri
  }
  return opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri)
}
goog.uri.utils.getComponentByIndex_ = function (componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null
}
goog.uri.utils.getScheme = function (uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri)
}
goog.uri.utils.getEffectiveScheme = function (uri) {
  var scheme = goog.uri.utils.getScheme(uri)
  if (!scheme && goog.global.self && goog.global.self.location) {
    var protocol = goog.global.self.location.protocol
    scheme = protocol.substr(0, protocol.length - 1)
  }
  return scheme ? scheme.toLowerCase() : ''
}
goog.uri.utils.getUserInfoEncoded = function (uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri)
}
goog.uri.utils.getUserInfo = function (uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri))
}
goog.uri.utils.getDomainEncoded = function (uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri)
}
goog.uri.utils.getDomain = function (uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri), true)
}
goog.uri.utils.getPort = function (uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null
}
goog.uri.utils.getPathEncoded = function (uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri)
}
goog.uri.utils.getPath = function (uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri), true)
}
goog.uri.utils.getQueryData = function (uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri)
}
goog.uri.utils.getFragmentEncoded = function (uri) {
  var hashIndex = uri.indexOf('#')
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1)
}
goog.uri.utils.setFragmentEncoded = function (uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? '#' + fragment : '')
}
goog.uri.utils.getFragment = function (uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri))
}
goog.uri.utils.getHost = function (uri) {
  var pieces = goog.uri.utils.split(uri)
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT])
}
goog.uri.utils.getOrigin = function (uri) {
  var pieces = goog.uri.utils.split(uri)
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], null, pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT])
}
goog.uri.utils.getPathAndAfter = function (uri) {
  var pieces = goog.uri.utils.split(uri)
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT])
}
goog.uri.utils.removeFragment = function (uri) {
  var hashIndex = uri.indexOf('#')
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex)
}
goog.uri.utils.haveSameDomain = function (uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1)
  var pieces2 = goog.uri.utils.split(uri2)
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
}
goog.uri.utils.assertNoFragmentsOrQueries_ = function (uri) {
  goog.asserts.assert(uri.indexOf('#') < 0 && uri.indexOf('?') < 0, 'goog.uri.utils: Fragment or query identifiers are not supported: [%s]', uri)
}
goog.uri.utils.QueryValue
goog.uri.utils.QueryArray
goog.uri.utils.parseQueryData = function (encodedQuery, callback) {
  if (!encodedQuery) {
    return
  }
  var pairs = encodedQuery.split('&')
  for (var i = 0; i < pairs.length; i++) {
    var indexOfEquals = pairs[i].indexOf('=')
    var name = null
    var value = null
    if (indexOfEquals >= 0) {
      name = pairs[i].substring(0, indexOfEquals)
      value = pairs[i].substring(indexOfEquals + 1)
    } else {
      name = pairs[i]
    }
    callback(name, value ? goog.string.urlDecode(value) : '')
  }
}
goog.uri.utils.splitQueryData_ = function (uri) {
  var hashIndex = uri.indexOf('#')
  if (hashIndex < 0) {
    hashIndex = uri.length
  }
  var questionIndex = uri.indexOf('?')
  var queryData
  if (questionIndex < 0 || questionIndex > hashIndex) {
    questionIndex = hashIndex
    queryData = ''
  } else {
    queryData = uri.substring(questionIndex + 1, hashIndex)
  }
  return [uri.substr(0, questionIndex), queryData, uri.substr(hashIndex)]
}
goog.uri.utils.joinQueryData_ = function (parts) {
  return parts[0] + (parts[1] ? '?' + parts[1] : '') + parts[2]
}
goog.uri.utils.appendQueryData_ = function (queryData, newData) {
  if (!newData) {
    return queryData
  }
  return queryData ? queryData + '&' + newData : newData
}
goog.uri.utils.appendQueryDataToUri_ = function (uri, queryData) {
  if (!queryData) {
    return uri
  }
  var parts = goog.uri.utils.splitQueryData_(uri)
  parts[1] = goog.uri.utils.appendQueryData_(parts[1], queryData)
  return goog.uri.utils.joinQueryData_(parts)
}
goog.uri.utils.appendKeyValuePairs_ = function (key, value, pairs) {
  goog.asserts.assertString(key)
  if (goog.isArray(value)) {
    goog.asserts.assertArray(value)
    for (var j = 0; j < value.length; j++) {
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs)
    }
  } else {
    if (value != null) {
      pairs.push(key + (value === '' ? '' : '=' + goog.string.urlEncode(value)))
    }
  }
}
goog.uri.utils.buildQueryData = function (keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, 'goog.uri.utils: Key/value lists must be even in length.')
  var params = []
  for (var i = opt_startIndex || 0; i < keysAndValues.length; i += 2) {
    var key = keysAndValues[i]
    goog.uri.utils.appendKeyValuePairs_(key, keysAndValues[i + 1], params)
  }
  return params.join('&')
}
goog.uri.utils.buildQueryDataFromMap = function (map) {
  var params = []
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], params)
  }
  return params.join('&')
}
goog.uri.utils.appendParams = function (uri, var_args) {
  var queryData = arguments.length == 2 ? goog.uri.utils.buildQueryData(arguments[1], 0) : goog.uri.utils.buildQueryData(arguments, 1)
  return goog.uri.utils.appendQueryDataToUri_(uri, queryData)
}
goog.uri.utils.appendParamsFromMap = function (uri, map) {
  var queryData = goog.uri.utils.buildQueryDataFromMap(map)
  return goog.uri.utils.appendQueryDataToUri_(uri, queryData)
}
goog.uri.utils.appendParam = function (uri, key, opt_value) {
  var value = goog.isDefAndNotNull(opt_value) ? '=' + goog.string.urlEncode(opt_value) : ''
  return goog.uri.utils.appendQueryDataToUri_(uri, key + value)
}
goog.uri.utils.findParam_ = function (uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex
  var keyLength = keyEncoded.length
  while ((index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1)
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength)
      if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index
      }
    }
    index += keyLength + 1
  }
  return -1
}
goog.uri.utils.hashOrEndRe_ = /#|$/
goog.uri.utils.hasParam = function (uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0
}
goog.uri.utils.getParamValue = function (uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_)
  var foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex)
  if (foundIndex < 0) {
    return null
  } else {
    var endPosition = uri.indexOf('&', foundIndex)
    if (endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex
    }
    foundIndex += keyEncoded.length + 1
    return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex))
  }
}
goog.uri.utils.getParamValues = function (uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_)
  var position = 0
  var foundIndex
  var result = []
  while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    position = uri.indexOf('&', foundIndex)
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex
    }
    foundIndex += keyEncoded.length + 1
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)))
  }
  return result
}
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/
goog.uri.utils.removeParam = function (uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_)
  var position = 0
  var foundIndex
  var buffer = []
  while ((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    buffer.push(uri.substring(position, foundIndex))
    position = Math.min(uri.indexOf('&', foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex)
  }
  buffer.push(uri.substr(position))
  return buffer.join('').replace(goog.uri.utils.trailingQueryPunctuationRe_, '$1')
}
goog.uri.utils.setParam = function (uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value)
}
goog.uri.utils.setParamsFromMap = function (uri, params) {
  var parts = goog.uri.utils.splitQueryData_(uri)
  var queryData = parts[1]
  var buffer = []
  if (queryData) {
    goog.array.forEach(queryData.split('&'), function (pair) {
      var indexOfEquals = pair.indexOf('=')
      var name = indexOfEquals >= 0 ? pair.substr(0, indexOfEquals) : pair
      if (!params.hasOwnProperty(name)) {
        buffer.push(pair)
      }
    })
  }
  parts[1] = goog.uri.utils.appendQueryData_(buffer.join('&'), goog.uri.utils.buildQueryDataFromMap(params))
  return goog.uri.utils.joinQueryData_(parts)
}
goog.uri.utils.appendPath = function (baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri)
  if (goog.string.endsWith(baseUri, '/')) {
    baseUri = baseUri.substr(0, baseUri.length - 1)
  }
  if (goog.string.startsWith(path, '/')) {
    path = path.substr(1)
  }
  return goog.string.buildString(baseUri, '/', path)
}
goog.uri.utils.setPath = function (uri, path) {
  if (!goog.string.startsWith(path, '/')) {
    path = '/' + path
  }
  var parts = goog.uri.utils.split(uri)
  return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT])
}
goog.uri.utils.StandardQueryParam = {RANDOM: 'zx'}
goog.uri.utils.makeUnique = function (uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
}
goog.provide('goog.net.XhrIo')
goog.provide('goog.net.XhrIo.ResponseType')
goog.require('goog.Timer')
goog.require('goog.array')
goog.require('goog.asserts')
goog.require('goog.debug.entryPointRegistry')
goog.require('goog.events.EventTarget')
goog.require('goog.json.hybrid')
goog.require('goog.log')
goog.require('goog.net.ErrorCode')
goog.require('goog.net.EventType')
goog.require('goog.net.HttpStatus')
goog.require('goog.net.XmlHttp')
goog.require('goog.string')
goog.require('goog.structs')
goog.require('goog.structs.Map')
goog.require('goog.uri.utils')
goog.require('goog.userAgent')
goog.forwardDeclare('goog.Uri')
goog.net.XhrIo = function (opt_xmlHttpFactory) {
  goog.net.XhrIo.base(this, 'constructor')
  this.headers = new goog.structs.Map()
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null
  this.active_ = false
  this.xhr_ = null
  this.xhrOptions_ = null
  this.lastUri_ = ''
  this.lastMethod_ = ''
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR
  this.lastError_ = ''
  this.errorDispatched_ = false
  this.inSend_ = false
  this.inOpen_ = false
  this.inAbort_ = false
  this.timeoutInterval_ = 0
  this.timeoutId_ = null
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT
  this.withCredentials_ = false
  this.progressEventsEnabled_ = false
  this.useXhr2Timeout_ = false
}
goog.inherits(goog.net.XhrIo, goog.events.EventTarget)
goog.net.XhrIo.ResponseType = {DEFAULT: '', TEXT: 'text', DOCUMENT: 'document', BLOB: 'blob', ARRAY_BUFFER: 'arraybuffer'}
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger('goog.net.XhrIo')
goog.net.XhrIo.CONTENT_TYPE_HEADER = 'Content-Type'
goog.net.XhrIo.CONTENT_TRANSFER_ENCODING = 'Content-Transfer-Encoding'
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ['POST', 'PUT']
goog.net.XhrIo.FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8'
goog.net.XhrIo.XHR2_TIMEOUT_ = 'timeout'
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = 'ontimeout'
goog.net.XhrIo.sendInstances_ = []
goog.net.XhrIo.send = function (url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new goog.net.XhrIo()
  goog.net.XhrIo.sendInstances_.push(x)
  if (opt_callback) {
    x.listen(goog.net.EventType.COMPLETE, opt_callback)
  }
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_)
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval)
  }
  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials)
  }
  x.send(url, opt_method, opt_content, opt_headers)
  return x
}
goog.net.XhrIo.cleanup = function () {
  var instances = goog.net.XhrIo.sendInstances_
  while (instances.length) {
    instances.pop().dispose()
  }
}
goog.net.XhrIo.protectEntryPoints = function (errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
}
goog.net.XhrIo.prototype.cleanupSend_ = function () {
  this.dispose()
  goog.array.remove(goog.net.XhrIo.sendInstances_, this)
}
goog.net.XhrIo.prototype.getTimeoutInterval = function () {
  return this.timeoutInterval_
}
goog.net.XhrIo.prototype.setTimeoutInterval = function (ms) {
  this.timeoutInterval_ = Math.max(0, ms)
}
goog.net.XhrIo.prototype.setResponseType = function (type) {
  this.responseType_ = type
}
goog.net.XhrIo.prototype.getResponseType = function () {
  return this.responseType_
}
goog.net.XhrIo.prototype.setWithCredentials = function (withCredentials) {
  this.withCredentials_ = withCredentials
}
goog.net.XhrIo.prototype.getWithCredentials = function () {
  return this.withCredentials_
}
goog.net.XhrIo.prototype.setProgressEventsEnabled = function (enabled) {
  this.progressEventsEnabled_ = enabled
}
goog.net.XhrIo.prototype.getProgressEventsEnabled = function () {
  return this.progressEventsEnabled_
}
goog.net.XhrIo.prototype.send = function (url, opt_method, opt_content, opt_headers) {
  if (this.xhr_) {
    throw new Error('[goog.net.XhrIo] Object is active with another request=' + this.lastUri_ + '; newUri=' + url)
  }
  var method = opt_method ? opt_method.toUpperCase() : 'GET'
  this.lastUri_ = url
  this.lastError_ = ''
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR
  this.lastMethod_ = method
  this.errorDispatched_ = false
  this.active_ = true
  this.xhr_ = this.createXhr()
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions()
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this)
  if (this.getProgressEventsEnabled() && 'onprogress' in this.xhr_) {
    this.xhr_.onprogress = goog.bind(function (e) {
      this.onProgressHandler_(e, true)
    }, this)
    if (this.xhr_.upload) {
      this.xhr_.upload.onprogress = goog.bind(this.onProgressHandler_, this)
    }
  }
  try {
    goog.log.fine(this.logger_, this.formatMsg_('Opening Xhr'))
    this.inOpen_ = true
    this.xhr_.open(method, String(url), true)
    this.inOpen_ = false
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_('Error opening Xhr: ' + err.message))
    this.error_(goog.net.ErrorCode.EXCEPTION, err)
    return
  }
  var content = opt_content || ''
  var headers = this.headers.clone()
  if (opt_headers) {
    goog.structs.forEach(opt_headers, function (value, key) {
      headers.set(key, value)
    })
  }
  var contentTypeKey = goog.array.find(headers.getKeys(), goog.net.XhrIo.isContentTypeHeader_)
  var contentIsFormData = goog.global['FormData'] && content instanceof goog.global['FormData']
  if (goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) && !contentTypeKey && !contentIsFormData) {
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE)
  }
  headers.forEach(function (value, key) {
    this.xhr_.setRequestHeader(key, value)
  }, this)
  if (this.responseType_) {
    this.xhr_.responseType = this.responseType_
  }
  if ('withCredentials' in this.xhr_ && this.xhr_.withCredentials !== this.withCredentials_) {
    this.xhr_.withCredentials = this.withCredentials_
  }
  try {
    this.cleanUpTimeoutTimer_()
    if (this.timeoutInterval_ > 0) {
      this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_)
      goog.log.fine(this.logger_, this.formatMsg_('Will abort after ' + this.timeoutInterval_ + 'ms if incomplete, xhr2 ' + this.useXhr2Timeout_))
      if (this.useXhr2Timeout_) {
        this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_
        this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = goog.bind(this.timeout_, this)
      } else {
        this.timeoutId_ = goog.Timer.callOnce(this.timeout_, this.timeoutInterval_, this)
      }
    }
    goog.log.fine(this.logger_, this.formatMsg_('Sending request'))
    this.inSend_ = true
    this.xhr_.send(content)
    this.inSend_ = false
  } catch (err$4) {
    goog.log.fine(this.logger_, this.formatMsg_('Send error: ' + err$4.message))
    this.error_(goog.net.ErrorCode.EXCEPTION, err$4)
  }
}
goog.net.XhrIo.shouldUseXhr2Timeout_ = function (xhr) {
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher(9) && goog.isNumber(xhr[goog.net.XhrIo.XHR2_TIMEOUT_]) && goog.isDef(xhr[goog.net.XhrIo.XHR2_ON_TIMEOUT_])
}
goog.net.XhrIo.isContentTypeHeader_ = function (header) {
  return goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, header)
}
goog.net.XhrIo.prototype.createXhr = function () {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp()
}
goog.net.XhrIo.prototype.timeout_ = function () {
  if (typeof goog === 'undefined') {
  } else {
    if (this.xhr_) {
      this.lastError_ = 'Timed out after ' + this.timeoutInterval_ + 'ms, aborting'
      this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT
      goog.log.fine(this.logger_, this.formatMsg_(this.lastError_))
      this.dispatchEvent(goog.net.EventType.TIMEOUT)
      this.abort(goog.net.ErrorCode.TIMEOUT)
    }
  }
}
goog.net.XhrIo.prototype.error_ = function (errorCode, err) {
  this.active_ = false
  if (this.xhr_) {
    this.inAbort_ = true
    this.xhr_.abort()
    this.inAbort_ = false
  }
  this.lastError_ = err
  this.lastErrorCode_ = errorCode
  this.dispatchErrors_()
  this.cleanUpXhr_()
}
goog.net.XhrIo.prototype.dispatchErrors_ = function () {
  if (!this.errorDispatched_) {
    this.errorDispatched_ = true
    this.dispatchEvent(goog.net.EventType.COMPLETE)
    this.dispatchEvent(goog.net.EventType.ERROR)
  }
}
goog.net.XhrIo.prototype.abort = function (opt_failureCode) {
  if (this.xhr_ && this.active_) {
    goog.log.fine(this.logger_, this.formatMsg_('Aborting'))
    this.active_ = false
    this.inAbort_ = true
    this.xhr_.abort()
    this.inAbort_ = false
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT
    this.dispatchEvent(goog.net.EventType.COMPLETE)
    this.dispatchEvent(goog.net.EventType.ABORT)
    this.cleanUpXhr_()
  }
}
goog.net.XhrIo.prototype.disposeInternal = function () {
  if (this.xhr_) {
    if (this.active_) {
      this.active_ = false
      this.inAbort_ = true
      this.xhr_.abort()
      this.inAbort_ = false
    }
    this.cleanUpXhr_(true)
  }
  goog.net.XhrIo.base(this, 'disposeInternal')
}
goog.net.XhrIo.prototype.onReadyStateChange_ = function () {
  if (this.isDisposed()) {
    return
  }
  if (!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    this.onReadyStateChangeEntryPoint_()
  } else {
    this.onReadyStateChangeHelper_()
  }
}
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function () {
  this.onReadyStateChangeHelper_()
}
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function () {
  if (!this.active_) {
    return
  }
  if (typeof goog === 'undefined') {
  } else {
    if (this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && this.getStatus() == 2) {
      goog.log.fine(this.logger_, this.formatMsg_('Local request error detected and ignored'))
    } else {
      if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.callOnce(this.onReadyStateChange_, 0, this)
        return
      }
      this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE)
      if (this.isComplete()) {
        goog.log.fine(this.logger_, this.formatMsg_('Request complete'))
        this.active_ = false
        try {
          if (this.isSuccess()) {
            this.dispatchEvent(goog.net.EventType.COMPLETE)
            this.dispatchEvent(goog.net.EventType.SUCCESS)
          } else {
            this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR
            this.lastError_ = this.getStatusText() + ' [' + this.getStatus() + ']'
            this.dispatchErrors_()
          }
        } finally {
          this.cleanUpXhr_()
        }
      }
    }
  }
}
goog.net.XhrIo.prototype.onProgressHandler_ = function (e, opt_isDownload) {
  goog.asserts.assert(e.type === goog.net.EventType.PROGRESS, 'goog.net.EventType.PROGRESS is of the same type as raw XHR progress.')
  this.dispatchEvent(goog.net.XhrIo.buildProgressEvent_(e, goog.net.EventType.PROGRESS))
  this.dispatchEvent(goog.net.XhrIo.buildProgressEvent_(e, opt_isDownload ? goog.net.EventType.DOWNLOAD_PROGRESS : goog.net.EventType.UPLOAD_PROGRESS))
}
goog.net.XhrIo.buildProgressEvent_ = function (e, eventType) {
  return {type: eventType, lengthComputable: e.lengthComputable, loaded: e.loaded, total: e.total}
}
goog.net.XhrIo.prototype.cleanUpXhr_ = function (opt_fromDispose) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_()
    var xhr = this.xhr_
    var clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null
    this.xhr_ = null
    this.xhrOptions_ = null
    if (!opt_fromDispose) {
      this.dispatchEvent(goog.net.EventType.READY)
    }
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange
    } catch (e) {
      goog.log.error(this.logger_, 'Problem encountered resetting onreadystatechange: ' + e.message)
    }
  }
}
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function () {
  if (this.xhr_ && this.useXhr2Timeout_) {
    this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null
  }
  if (this.timeoutId_) {
    goog.Timer.clear(this.timeoutId_)
    this.timeoutId_ = null
  }
}
goog.net.XhrIo.prototype.isActive = function () {
  return !!this.xhr_
}
goog.net.XhrIo.prototype.isComplete = function () {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE
}
goog.net.XhrIo.prototype.isSuccess = function () {
  var status = this.getStatus()
  return goog.net.HttpStatus.isSuccess(status) || status === 0 && !this.isLastUriEffectiveSchemeHttp_()
}
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function () {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_))
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme)
}
goog.net.XhrIo.prototype.getReadyState = function () {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED
}
goog.net.XhrIo.prototype.getStatus = function () {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1
  } catch (e) {
    return -1
  }
}
goog.net.XhrIo.prototype.getStatusText = function () {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : ''
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get status: ' + e.message)
    return ''
  }
}
goog.net.XhrIo.prototype.getLastUri = function () {
  return String(this.lastUri_)
}
goog.net.XhrIo.prototype.getResponseText = function () {
  try {
    return this.xhr_ ? this.xhr_.responseText : ''
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get responseText: ' + e.message)
    return ''
  }
}
goog.net.XhrIo.prototype.getResponseBody = function () {
  try {
    if (this.xhr_ && 'responseBody' in this.xhr_) {
      return this.xhr_['responseBody']
    }
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get responseBody: ' + e.message)
  }
  return null
}
goog.net.XhrIo.prototype.getResponseXml = function () {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get responseXML: ' + e.message)
    return null
  }
}
goog.net.XhrIo.prototype.getResponseJson = function (opt_xssiPrefix) {
  if (!this.xhr_) {
    return undefined
  }
  var responseText = this.xhr_.responseText
  if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length)
  }
  return goog.json.hybrid.parse(responseText)
}
goog.net.XhrIo.prototype.getResponse = function () {
  try {
    if (!this.xhr_) {
      return null
    }
    if ('response' in this.xhr_) {
      return this.xhr_.response
    }
    switch (this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ('mozResponseArrayBuffer' in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer
        }
    }
    goog.log.error(this.logger_, 'Response type ' + this.responseType_ + ' is not ' + 'supported on this browser')
    return null
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get response: ' + e.message)
    return null
  }
}
goog.net.XhrIo.prototype.getResponseHeader = function (key) {
  if (!this.xhr_ || !this.isComplete()) {
    return undefined
  }
  var value = this.xhr_.getResponseHeader(key)
  return goog.isNull(value) ? undefined : value
}
goog.net.XhrIo.prototype.getAllResponseHeaders = function () {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : ''
}
goog.net.XhrIo.prototype.getResponseHeaders = function () {
  var headersObject = {}
  var headersArray = this.getAllResponseHeaders().split('\r\n')
  for (var i = 0; i < headersArray.length; i++) {
    if (goog.string.isEmptyOrWhitespace(headersArray[i])) {
      continue
    }
    var keyValue = goog.string.splitLimit(headersArray[i], ': ', 2)
    if (headersObject[keyValue[0]]) {
      headersObject[keyValue[0]] += ', ' + keyValue[1]
    } else {
      headersObject[keyValue[0]] = keyValue[1]
    }
  }
  return headersObject
}
goog.net.XhrIo.prototype.getStreamingResponseHeader = function (key) {
  return this.xhr_ ? this.xhr_.getResponseHeader(key) : null
}
goog.net.XhrIo.prototype.getAllStreamingResponseHeaders = function () {
  return this.xhr_ ? this.xhr_.getAllResponseHeaders() : ''
}
goog.net.XhrIo.prototype.getLastErrorCode = function () {
  return this.lastErrorCode_
}
goog.net.XhrIo.prototype.getLastError = function () {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_)
}
goog.net.XhrIo.prototype.formatMsg_ = function (msg) {
  return msg + ' [' + this.lastMethod_ + ' ' + this.lastUri_ + ' ' + this.getStatus() + ']'
}
goog.debug.entryPointRegistry.register(function (transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
})
goog.provide('goog.crypt')
goog.require('goog.array')
goog.require('goog.asserts')
goog.crypt.stringToByteArray = function (str) {
  var output = [], p = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    if (c > 255) {
      output[p++] = c & 255
      c >>= 8
    }
    output[p++] = c
  }
  return output
}
goog.crypt.byteArrayToString = function (bytes) {
  var CHUNK_SIZE = 8192
  if (bytes.length <= CHUNK_SIZE) {
    return String.fromCharCode.apply(null, bytes)
  }
  var str = ''
  for (var i = 0; i < bytes.length; i += CHUNK_SIZE) {
    var chunk = goog.array.slice(bytes, i, i + CHUNK_SIZE)
    str += String.fromCharCode.apply(null, chunk)
  }
  return str
}
goog.crypt.byteArrayToHex = function (array) {
  return goog.array.map(array, function (numByte) {
    var hexByte = numByte.toString(16)
    return hexByte.length > 1 ? hexByte : '0' + hexByte
  }).join('')
}
goog.crypt.hexToByteArray = function (hexString) {
  goog.asserts.assert(hexString.length % 2 == 0, 'Key string length must be multiple of 2')
  var arr = []
  for (var i = 0; i < hexString.length; i += 2) {
    arr.push(parseInt(hexString.substring(i, i + 2), 16))
  }
  return arr
}
goog.crypt.stringToUtf8ByteArray = function (str) {
  var out = [], p = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    if (c < 128) {
      out[p++] = c
    } else {
      if (c < 2048) {
        out[p++] = c >> 6 | 192
        out[p++] = c & 63 | 128
      } else {
        if ((c & 64512) == 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) == 56320) {
          c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023)
          out[p++] = c >> 18 | 240
          out[p++] = c >> 12 & 63 | 128
          out[p++] = c >> 6 & 63 | 128
          out[p++] = c & 63 | 128
        } else {
          out[p++] = c >> 12 | 224
          out[p++] = c >> 6 & 63 | 128
          out[p++] = c & 63 | 128
        }
      }
    }
  }
  return out
}
goog.crypt.utf8ByteArrayToString = function (bytes) {
  var out = [], pos = 0, c = 0
  while (pos < bytes.length) {
    var c1 = bytes[pos++]
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1)
    } else {
      if (c1 > 191 && c1 < 224) {
        var c2 = bytes[pos++]
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63)
      } else {
        if (c1 > 239 && c1 < 365) {
          var c2 = bytes[pos++]
          var c3 = bytes[pos++]
          var c4 = bytes[pos++]
          var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536
          out[c++] = String.fromCharCode(55296 + (u >> 10))
          out[c++] = String.fromCharCode(56320 + (u & 1023))
        } else {
          var c2 = bytes[pos++]
          var c3 = bytes[pos++]
          out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
        }
      }
    }
  }
  return out.join('')
}
goog.crypt.xorByteArray = function (bytes1, bytes2) {
  goog.asserts.assert(bytes1.length == bytes2.length, 'XOR array lengths must match')
  var result = []
  for (var i = 0; i < bytes1.length; i++) {
    result.push(bytes1[i] ^ bytes2[i])
  }
  return result
}
goog.provide('goog.userAgent.product')
goog.require('goog.labs.userAgent.browser')
goog.require('goog.labs.userAgent.platform')
goog.require('goog.userAgent')
goog.define('goog.userAgent.product.ASSUME_FIREFOX', false)
goog.define('goog.userAgent.product.ASSUME_IPHONE', false)
goog.define('goog.userAgent.product.ASSUME_IPAD', false)
goog.define('goog.userAgent.product.ASSUME_ANDROID', false)
goog.define('goog.userAgent.product.ASSUME_CHROME', false)
goog.define('goog.userAgent.product.ASSUME_SAFARI', false)
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI
goog.userAgent.product.OPERA = goog.userAgent.OPERA
goog.userAgent.product.IE = goog.userAgent.IE
goog.userAgent.product.EDGE = goog.userAgent.EDGE
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox()
goog.userAgent.product.isIphoneOrIpod_ = function () {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod()
}
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_()
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad()
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser()
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome()
goog.userAgent.product.isSafariDesktop_ = function () {
  return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos()
}
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_()
goog.provide('goog.crypt.base64')
goog.require('goog.asserts')
goog.require('goog.crypt')
goog.require('goog.string')
goog.require('goog.userAgent')
goog.require('goog.userAgent.product')
goog.crypt.base64.byteToCharMap_ = null
goog.crypt.base64.charToByteMap_ = null
goog.crypt.base64.byteToCharMapWebSafe_ = null
goog.crypt.base64.ENCODED_VALS_BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'
goog.crypt.base64.ENCODED_VALS = goog.crypt.base64.ENCODED_VALS_BASE + '+/='
goog.crypt.base64.ENCODED_VALS_WEBSAFE = goog.crypt.base64.ENCODED_VALS_BASE + '-_.'
goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ = goog.userAgent.GECKO || goog.userAgent.WEBKIT && !goog.userAgent.product.SAFARI || goog.userAgent.OPERA
goog.crypt.base64.HAS_NATIVE_ENCODE_ = goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ || typeof goog.global.btoa === 'function'
goog.crypt.base64.HAS_NATIVE_DECODE_ = goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ || !goog.userAgent.product.SAFARI && !goog.userAgent.IE && typeof goog.global.atob === 'function'
goog.crypt.base64.encodeByteArray = function (input, opt_webSafe) {
  goog.asserts.assert(goog.isArrayLike(input), 'encodeByteArray takes an array as a parameter')
  goog.crypt.base64.init_()
  var byteToCharMap = opt_webSafe ? goog.crypt.base64.byteToCharMapWebSafe_ : goog.crypt.base64.byteToCharMap_
  var output = []
  for (var i = 0; i < input.length; i += 3) {
    var byte1 = input[i]
    var haveByte2 = i + 1 < input.length
    var byte2 = haveByte2 ? input[i + 1] : 0
    var haveByte3 = i + 2 < input.length
    var byte3 = haveByte3 ? input[i + 2] : 0
    var outByte1 = byte1 >> 2
    var outByte2 = (byte1 & 3) << 4 | byte2 >> 4
    var outByte3 = (byte2 & 15) << 2 | byte3 >> 6
    var outByte4 = byte3 & 63
    if (!haveByte3) {
      outByte4 = 64
      if (!haveByte2) {
        outByte3 = 64
      }
    }
    output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4])
  }
  return output.join('')
}
goog.crypt.base64.encodeString = function (input, opt_webSafe) {
  if (goog.crypt.base64.HAS_NATIVE_ENCODE_ && !opt_webSafe) {
    return goog.global.btoa(input)
  }
  return goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(input), opt_webSafe)
}
goog.crypt.base64.decodeString = function (input, opt_webSafe) {
  if (goog.crypt.base64.HAS_NATIVE_DECODE_ && !opt_webSafe) {
    return goog.global.atob(input)
  }
  var output = ''
  function pushByte (b) {
    output += String.fromCharCode(b)
  }
  goog.crypt.base64.decodeStringInternal_(input, pushByte)
  return output
}
goog.crypt.base64.decodeStringToByteArray = function (input, opt_ignored) {
  var output = []
  function pushByte (b) {
    output.push(b)
  }
  goog.crypt.base64.decodeStringInternal_(input, pushByte)
  return output
}
goog.crypt.base64.decodeStringToUint8Array = function (input) {
  goog.asserts.assert(!goog.userAgent.IE || goog.userAgent.isVersionOrHigher('10'), 'Browser does not support typed arrays')
  var len = input.length
  var placeholders = 0
  if (input[len - 2] === '=') {
    placeholders = 2
  } else {
    if (input[len - 1] === '=') {
      placeholders = 1
    }
  }
  var output = new Uint8Array(Math.ceil(len * 3 / 4) - placeholders)
  var outLen = 0
  function pushByte (b) {
    output[outLen++] = b
  }
  goog.crypt.base64.decodeStringInternal_(input, pushByte)
  return output.subarray(0, outLen)
}
goog.crypt.base64.decodeStringInternal_ = function (input, pushByte) {
  goog.crypt.base64.init_()
  var nextCharIndex = 0
  function getByte (default_val) {
    while (nextCharIndex < input.length) {
      var ch = input.charAt(nextCharIndex++)
      var b = goog.crypt.base64.charToByteMap_[ch]
      if (b != null) {
        return b
      }
      if (!goog.string.isEmptyOrWhitespace(ch)) {
        throw new Error('Unknown base64 encoding at char: ' + ch)
      }
    }
    return default_val
  }
  while (true) {
    var byte1 = getByte(-1)
    var byte2 = getByte(0)
    var byte3 = getByte(64)
    var byte4 = getByte(64)
    if (byte4 === 64) {
      if (byte1 === -1) {
        return
      }
    }
    var outByte1 = byte1 << 2 | byte2 >> 4
    pushByte(outByte1)
    if (byte3 != 64) {
      var outByte2 = byte2 << 4 & 240 | byte3 >> 2
      pushByte(outByte2)
      if (byte4 != 64) {
        var outByte3 = byte3 << 6 & 192 | byte4
        pushByte(outByte3)
      }
    }
  }
}
goog.crypt.base64.init_ = function () {
  if (!goog.crypt.base64.byteToCharMap_) {
    goog.crypt.base64.byteToCharMap_ = {}
    goog.crypt.base64.charToByteMap_ = {}
    goog.crypt.base64.byteToCharMapWebSafe_ = {}
    for (var i = 0; i < goog.crypt.base64.ENCODED_VALS.length; i++) {
      goog.crypt.base64.byteToCharMap_[i] = goog.crypt.base64.ENCODED_VALS.charAt(i)
      goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[i]] = i
      goog.crypt.base64.byteToCharMapWebSafe_[i] = goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i)
      if (i >= goog.crypt.base64.ENCODED_VALS_BASE.length) {
        goog.crypt.base64.charToByteMap_[goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i)] = i
      }
    }
  }
}
goog.provide('goog.net.streams.NodeReadableStream')
goog.net.streams.NodeReadableStream = function () {
}
goog.net.streams.NodeReadableStream.EventType = {READABLE: 'readable', DATA: 'data', END: 'end', CLOSE: 'close', ERROR: 'error'}
goog.net.streams.NodeReadableStream.prototype.on = goog.abstractMethod
goog.net.streams.NodeReadableStream.prototype.addListener = goog.abstractMethod
goog.net.streams.NodeReadableStream.prototype.removeListener = goog.abstractMethod
goog.net.streams.NodeReadableStream.prototype.once = goog.abstractMethod
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.GenericTransportInterface')
  goog.module.declareLegacyNamespace()
  var NodeReadableStream = goog.require('goog.net.streams.NodeReadableStream')
  var XhrIo = goog.require('goog.net.XhrIo')
  exports.GenericTransportInterface
  return exports
})
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.GrpcWebClientReadableStream')
  goog.module.declareLegacyNamespace()
  var ClientReadableStream = goog.require('grpc.web.ClientReadableStream')
  var EventType = goog.require('goog.net.EventType')
  var GrpcWebStreamParser = goog.require('grpc.web.GrpcWebStreamParser')
  var StatusCode = goog.require('grpc.web.StatusCode')
  var XhrIo = goog.require('goog.net.XhrIo')
  var XmlHttp = goog.require('goog.net.XmlHttp')
  var events = goog.require('goog.events')
  var googCrypt = goog.require('goog.crypt.base64')
  var $jscomp$destructuring$var0 = goog.require('grpc.web.GenericTransportInterface')
  var GenericTransportInterface = $jscomp$destructuring$var0.GenericTransportInterface
  var GRPC_STATUS = 'grpc-status'
  var GRPC_STATUS_MESSAGE = 'grpc-message'
  var GrpcWebClientReadableStream = function (genericTransportInterface) {
    this.xhr_ = genericTransportInterface.xhr
    this.responseDeserializeFn_ = null
    this.onDataCallback_ = null
    this.onStatusCallback_ = null
    this.onEndCallback_ = null
    this.pos_ = 0
    this.parser_ = new GrpcWebStreamParser()
    var self = this
    events.listen(this.xhr_, EventType.READY_STATE_CHANGE, function (e) {
      var FrameType = GrpcWebStreamParser.FrameType
      var responseText = self.xhr_.getResponseText()
      var newPos = responseText.length - responseText.length % 4
      var newData = responseText.substr(self.pos_, newPos - self.pos_)
      if (newData.length == 0) {
        return
      }
      self.pos_ = newPos
      var byteSource = googCrypt.decodeStringToUint8Array(newData)
      var messages = self.parser_.parse([].slice.call(byteSource))
      if (!messages) {
        return
      }
      for (var i = 0; i < messages.length; i++) {
        if (FrameType.DATA in messages[i]) {
          var data = messages[i][FrameType.DATA]
          if (data) {
            var response = self.responseDeserializeFn_(data)
            if (response) {
              self.onDataCallback_(response)
            }
          }
        }
        if (FrameType.TRAILER in messages[i]) {
          if (messages[i][FrameType.TRAILER].length > 0) {
            var trailerString = ''
            for (var pos = 0; pos < messages[i][FrameType.TRAILER].length; pos++) {
              trailerString += String.fromCharCode(messages[i][FrameType.TRAILER][pos])
            }
            var trailers = self.parseHttp1Headers_(trailerString)
            var grpcStatusCode = StatusCode.OK
            var grpcStatusMessage = ''
            if (GRPC_STATUS in trailers) {
              grpcStatusCode = trailers[GRPC_STATUS]
            }
            if (GRPC_STATUS_MESSAGE in trailers) {
              grpcStatusMessage = trailers[GRPC_STATUS_MESSAGE]
            }
            if (self.onStatusCallback_) {
              self.onStatusCallback_({code: Number(grpcStatusCode), details: grpcStatusMessage, metadata: trailers})
            }
          }
        }
      }
      var readyState = self.xhr_.getReadyState()
      if (readyState == XmlHttp.ReadyState.COMPLETE) {
        if (self.onEndCallback_) {
          self.onEndCallback_()
        }
      }
    })
  }
  GrpcWebClientReadableStream.prototype.on = function (eventType, callback) {
    if (eventType == 'data') {
      this.onDataCallback_ = callback
    } else {
      if (eventType == 'status') {
        this.onStatusCallback_ = callback
      } else {
        if (eventType == 'end') {
          this.onEndCallback_ = callback
        }
      }
    }
    return this
  }
  GrpcWebClientReadableStream.prototype.setResponseDeserializeFn = function (responseDeserializeFn) {
    this.responseDeserializeFn_ = responseDeserializeFn
  }
  GrpcWebClientReadableStream.prototype.cancel = function () {
    this.xhr_.abort()
  }
  GrpcWebClientReadableStream.prototype.parseHttp1Headers_ = function (str) {
    var chunks = str.trim().split('\r\n')
    var headers = {}
    for (var i = 0; i < chunks.length; i++) {
      var pos = chunks[i].indexOf(':')
      headers[chunks[i].substring(0, pos).trim()] = chunks[i].substring(pos + 1).trim()
    }
    return headers
  }
  exports = GrpcWebClientReadableStream
  return exports
})
goog.loadModule(function (exports) {
  'use strict'
  goog.module('grpc.web.GrpcWebClientBase')
  goog.module.declareLegacyNamespace()
  var AbstractClientBase = goog.require('grpc.web.AbstractClientBase')
  var GrpcWebClientReadableStream = goog.require('grpc.web.GrpcWebClientReadableStream')
  var StatusCode = goog.require('grpc.web.StatusCode')
  var XhrIo = goog.require('goog.net.XhrIo')
  var googCrypt = goog.require('goog.crypt.base64')
  var GrpcWebClientBase = function (opt_options) {
  }
  GrpcWebClientBase.prototype.rpcCall = function (method, request, metadata, methodInfo, callback) {
    var xhr = this.newXhr_()
    var serialized = methodInfo.requestSerializeFn(request)
    xhr.headers.addAll(metadata)
    var genericTransportInterface = {xhr: xhr}
    var stream = new GrpcWebClientReadableStream(genericTransportInterface)
    stream.setResponseDeserializeFn(methodInfo.responseDeserializeFn)
    stream.on('data', function (response) {
      callback(null, response)
    })
    stream.on('status', function (status) {
      if (status.code != StatusCode.OK) {
        callback({'code': status.code, 'message': status.details}, null)
      }
    })
    xhr.headers.set('Content-Type', 'application/grpc-web-text')
    xhr.headers.set('X-User-Agent', 'grpc-web-javascript/0.1')
    xhr.headers.set('Accept', 'application/grpc-web-text')
    var payload = this.encodeRequest_(serialized)
    payload = googCrypt.encodeByteArray(payload)
    xhr.send(method, 'POST', payload)
  }
  GrpcWebClientBase.prototype.serverStreaming = function (method, request, metadata, methodInfo) {
    var xhr = this.newXhr_()
    var serialized = methodInfo.requestSerializeFn(request)
    xhr.headers.addAll(metadata)
    var genericTransportInterface = {xhr: xhr}
    var stream = new GrpcWebClientReadableStream(genericTransportInterface)
    stream.setResponseDeserializeFn(methodInfo.responseDeserializeFn)
    xhr.headers.set('Content-Type', 'application/grpc-web-text')
    xhr.headers.set('X-User-Agent', 'grpc-web-javascript/0.1')
    xhr.headers.set('Accept', 'application/grpc-web-text')
    var payload = this.encodeRequest_(serialized)
    payload = googCrypt.encodeByteArray(payload)
    xhr.send(method, 'POST', payload)
    return stream
  }
  GrpcWebClientBase.prototype.newXhr_ = function () {
    return new XhrIo()
  }
  GrpcWebClientBase.prototype.encodeRequest_ = function (serialized) {
    var len = serialized.length
    var bytesArray = [0, 0, 0, 0]
    var payload = new Uint8Array(5 + len)
    for (var i = 3; i >= 0; i--) {
      bytesArray[i] = len % 256
      len = len >>> 8
    }
    payload.set(new Uint8Array(bytesArray), 1)
    payload.set(serialized, 5)
    return payload
  }
  exports = GrpcWebClientBase
  return exports
})
goog.provide('jspb.AnyFieldType')
goog.provide('jspb.BinaryConstants')
goog.provide('jspb.BinaryMessage')
goog.provide('jspb.BuilderFunction')
goog.provide('jspb.ByteSource')
goog.provide('jspb.ClonerFunction')
goog.provide('jspb.ComparerFunction')
goog.provide('jspb.ConstBinaryMessage')
goog.provide('jspb.PrunerFunction')
goog.provide('jspb.ReaderFunction')
goog.provide('jspb.RecyclerFunction')
goog.provide('jspb.RepeatedFieldType')
goog.provide('jspb.ScalarFieldType')
goog.provide('jspb.WriterFunction')
goog.forwardDeclare('jspb.BinaryMessage')
goog.forwardDeclare('jspb.BinaryReader')
goog.forwardDeclare('jspb.BinaryWriter')
goog.forwardDeclare('jspb.Message')
goog.forwardDeclare('jsproto.BinaryExtension')
jspb.ConstBinaryMessage = function () {
}
jspb.BinaryMessage = function () {
}
jspb.ByteSource
jspb.ScalarFieldType
jspb.RepeatedFieldType
jspb.AnyFieldType
jspb.BuilderFunction
jspb.ClonerFunction
jspb.RecyclerFunction
jspb.ReaderFunction
jspb.WriterFunction
jspb.PrunerFunction
jspb.ComparerFunction
jspb.BinaryConstants.FieldType = {INVALID: -1, DOUBLE: 1, FLOAT: 2, INT64: 3, UINT64: 4, INT32: 5, FIXED64: 6, FIXED32: 7, BOOL: 8, STRING: 9, GROUP: 10, MESSAGE: 11, BYTES: 12, UINT32: 13, ENUM: 14, SFIXED32: 15, SFIXED64: 16, SINT32: 17, SINT64: 18, FHASH64: 30, VHASH64: 31}
jspb.BinaryConstants.WireType = {INVALID: -1, VARINT: 0, FIXED64: 1, DELIMITED: 2, START_GROUP: 3, END_GROUP: 4, FIXED32: 5}
jspb.BinaryConstants.FieldTypeToWireType = function (fieldType) {
  var fieldTypes = jspb.BinaryConstants.FieldType
  var wireTypes = jspb.BinaryConstants.WireType
  switch (fieldType) {
    case fieldTypes.INT32:
    case fieldTypes.INT64:
    case fieldTypes.UINT32:
    case fieldTypes.UINT64:
    case fieldTypes.SINT32:
    case fieldTypes.SINT64:
    case fieldTypes.BOOL:
    case fieldTypes.ENUM:
    case fieldTypes.VHASH64:
      return wireTypes.VARINT
    case fieldTypes.DOUBLE:
    case fieldTypes.FIXED64:
    case fieldTypes.SFIXED64:
    case fieldTypes.FHASH64:
      return wireTypes.FIXED64
    case fieldTypes.STRING:
    case fieldTypes.MESSAGE:
    case fieldTypes.BYTES:
      return wireTypes.DELIMITED
    case fieldTypes.FLOAT:
    case fieldTypes.FIXED32:
    case fieldTypes.SFIXED32:
      return wireTypes.FIXED32
    case fieldTypes.INVALID:
    case fieldTypes.GROUP:
    default:
      return wireTypes.INVALID
  }
}
jspb.BinaryConstants.INVALID_FIELD_NUMBER = -1
jspb.BinaryConstants.FLOAT32_EPS = 1.401298464324817e-45
jspb.BinaryConstants.FLOAT32_MIN = 1.1754943508222875e-38
jspb.BinaryConstants.FLOAT32_MAX = 3.4028234663852886e+38
jspb.BinaryConstants.FLOAT64_EPS = 5e-324
jspb.BinaryConstants.FLOAT64_MIN = 2.2250738585072014e-308
jspb.BinaryConstants.FLOAT64_MAX = 1.7976931348623157e+308
jspb.BinaryConstants.TWO_TO_20 = 1048576
jspb.BinaryConstants.TWO_TO_23 = 8388608
jspb.BinaryConstants.TWO_TO_31 = 2147483648
jspb.BinaryConstants.TWO_TO_32 = 4294967296
jspb.BinaryConstants.TWO_TO_52 = 4503599627370496
jspb.BinaryConstants.TWO_TO_63 = 9223372036854775808
jspb.BinaryConstants.TWO_TO_64 = 18446744073709551616
jspb.BinaryConstants.ZERO_HASH = '\x00\x00\x00\x00\x00\x00\x00\x00'
goog.provide('jspb.utils')
goog.require('goog.asserts')
goog.require('goog.crypt')
goog.require('goog.crypt.base64')
goog.require('goog.string')
goog.require('jspb.BinaryConstants')
jspb.utils.split64Low = 0
jspb.utils.split64High = 0
jspb.utils.splitUint64 = function (value) {
  var lowBits = value >>> 0
  var highBits = Math.floor((value - lowBits) / jspb.BinaryConstants.TWO_TO_32) >>> 0
  jspb.utils.split64Low = lowBits
  jspb.utils.split64High = highBits
}
jspb.utils.splitInt64 = function (value) {
  var sign = value < 0
  value = Math.abs(value)
  var lowBits = value >>> 0
  var highBits = Math.floor((value - lowBits) / jspb.BinaryConstants.TWO_TO_32)
  highBits = highBits >>> 0
  if (sign) {
    highBits = ~highBits >>> 0
    lowBits = ~lowBits >>> 0
    lowBits += 1
    if (lowBits > 4294967295) {
      lowBits = 0
      highBits++
      if (highBits > 4294967295) {
        highBits = 0
      }
    }
  }
  jspb.utils.split64Low = lowBits
  jspb.utils.split64High = highBits
}
jspb.utils.splitZigzag64 = function (value) {
  var sign = value < 0
  value = Math.abs(value) * 2
  jspb.utils.splitUint64(value)
  var lowBits = jspb.utils.split64Low
  var highBits = jspb.utils.split64High
  if (sign) {
    if (lowBits == 0) {
      if (highBits == 0) {
        lowBits = 4294967295
        highBits = 4294967295
      } else {
        highBits--
        lowBits = 4294967295
      }
    } else {
      lowBits--
    }
  }
  jspb.utils.split64Low = lowBits
  jspb.utils.split64High = highBits
}
jspb.utils.splitFloat32 = function (value) {
  var sign = value < 0 ? 1 : 0
  value = sign ? -value : value
  var exp
  var mant
  if (value === 0) {
    if (1 / value > 0) {
      jspb.utils.split64High = 0
      jspb.utils.split64Low = 0
    } else {
      jspb.utils.split64High = 0
      jspb.utils.split64Low = 2147483648
    }
    return
  }
  if (isNaN(value)) {
    jspb.utils.split64High = 0
    jspb.utils.split64Low = 2147483647
    return
  }
  if (value > jspb.BinaryConstants.FLOAT32_MAX) {
    jspb.utils.split64High = 0
    jspb.utils.split64Low = (sign << 31 | 2139095040) >>> 0
    return
  }
  if (value < jspb.BinaryConstants.FLOAT32_MIN) {
    mant = Math.round(value / Math.pow(2, -149))
    jspb.utils.split64High = 0
    jspb.utils.split64Low = (sign << 31 | mant) >>> 0
    return
  }
  exp = Math.floor(Math.log(value) / Math.LN2)
  mant = value * Math.pow(2, -exp)
  mant = Math.round(mant * jspb.BinaryConstants.TWO_TO_23) & 8388607
  jspb.utils.split64High = 0
  jspb.utils.split64Low = (sign << 31 | exp + 127 << 23 | mant) >>> 0
}
jspb.utils.splitFloat64 = function (value) {
  var sign = value < 0 ? 1 : 0
  value = sign ? -value : value
  if (value === 0) {
    if (1 / value > 0) {
      jspb.utils.split64High = 0
      jspb.utils.split64Low = 0
    } else {
      jspb.utils.split64High = 2147483648
      jspb.utils.split64Low = 0
    }
    return
  }
  if (isNaN(value)) {
    jspb.utils.split64High = 2147483647
    jspb.utils.split64Low = 4294967295
    return
  }
  if (value > jspb.BinaryConstants.FLOAT64_MAX) {
    jspb.utils.split64High = (sign << 31 | 2146435072) >>> 0
    jspb.utils.split64Low = 0
    return
  }
  if (value < jspb.BinaryConstants.FLOAT64_MIN) {
    var mant = value / Math.pow(2, -1074)
    var mantHigh = mant / jspb.BinaryConstants.TWO_TO_32
    jspb.utils.split64High = (sign << 31 | mantHigh) >>> 0
    jspb.utils.split64Low = mant >>> 0
    return
  }
  var exp = Math.floor(Math.log(value) / Math.LN2)
  if (exp == 1024) {
    exp = 1023
  }
  var mant = value * Math.pow(2, -exp)
  var mantHigh = mant * jspb.BinaryConstants.TWO_TO_20 & 1048575
  var mantLow = mant * jspb.BinaryConstants.TWO_TO_52 >>> 0
  jspb.utils.split64High = (sign << 31 | exp + 1023 << 20 | mantHigh) >>> 0
  jspb.utils.split64Low = mantLow
}
jspb.utils.splitHash64 = function (hash) {
  var a = hash.charCodeAt(0)
  var b = hash.charCodeAt(1)
  var c = hash.charCodeAt(2)
  var d = hash.charCodeAt(3)
  var e = hash.charCodeAt(4)
  var f = hash.charCodeAt(5)
  var g = hash.charCodeAt(6)
  var h = hash.charCodeAt(7)
  jspb.utils.split64Low = a + (b << 8) + (c << 16) + (d << 24) >>> 0
  jspb.utils.split64High = e + (f << 8) + (g << 16) + (h << 24) >>> 0
}
jspb.utils.joinUint64 = function (bitsLow, bitsHigh) {
  return bitsHigh * jspb.BinaryConstants.TWO_TO_32 + bitsLow
}
jspb.utils.joinInt64 = function (bitsLow, bitsHigh) {
  var sign = bitsHigh & 2147483648
  if (sign) {
    bitsLow = ~bitsLow + 1 >>> 0
    bitsHigh = ~bitsHigh >>> 0
    if (bitsLow == 0) {
      bitsHigh = bitsHigh + 1 >>> 0
    }
  }
  var result = jspb.utils.joinUint64(bitsLow, bitsHigh)
  return sign ? -result : result
}
jspb.utils.joinZigzag64 = function (bitsLow, bitsHigh) {
  var sign = bitsLow & 1
  bitsLow = (bitsLow >>> 1 | bitsHigh << 31) >>> 0
  bitsHigh = bitsHigh >>> 1
  if (sign) {
    bitsLow = bitsLow + 1 >>> 0
    if (bitsLow == 0) {
      bitsHigh = bitsHigh + 1 >>> 0
    }
  }
  var result = jspb.utils.joinUint64(bitsLow, bitsHigh)
  return sign ? -result : result
}
jspb.utils.joinFloat32 = function (bitsLow, bitsHigh) {
  var sign = (bitsLow >> 31) * 2 + 1
  var exp = bitsLow >>> 23 & 255
  var mant = bitsLow & 8388607
  if (exp == 255) {
    if (mant) {
      return NaN
    } else {
      return sign * Infinity
    }
  }
  if (exp == 0) {
    return sign * Math.pow(2, -149) * mant
  } else {
    return sign * Math.pow(2, exp - 150) * (mant + Math.pow(2, 23))
  }
}
jspb.utils.joinFloat64 = function (bitsLow, bitsHigh) {
  var sign = (bitsHigh >> 31) * 2 + 1
  var exp = bitsHigh >>> 20 & 2047
  var mant = jspb.BinaryConstants.TWO_TO_32 * (bitsHigh & 1048575) + bitsLow
  if (exp == 2047) {
    if (mant) {
      return NaN
    } else {
      return sign * Infinity
    }
  }
  if (exp == 0) {
    return sign * Math.pow(2, -1074) * mant
  } else {
    return sign * Math.pow(2, exp - 1075) * (mant + jspb.BinaryConstants.TWO_TO_52)
  }
}
jspb.utils.joinHash64 = function (bitsLow, bitsHigh) {
  var a = bitsLow >>> 0 & 255
  var b = bitsLow >>> 8 & 255
  var c = bitsLow >>> 16 & 255
  var d = bitsLow >>> 24 & 255
  var e = bitsHigh >>> 0 & 255
  var f = bitsHigh >>> 8 & 255
  var g = bitsHigh >>> 16 & 255
  var h = bitsHigh >>> 24 & 255
  return String.fromCharCode(a, b, c, d, e, f, g, h)
}
jspb.utils.DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
jspb.utils.joinUnsignedDecimalString = function (bitsLow, bitsHigh) {
  if (bitsHigh <= 2097151) {
    return '' + (jspb.BinaryConstants.TWO_TO_32 * bitsHigh + bitsLow)
  }
  var low = bitsLow & 16777215
  var mid = (bitsLow >>> 24 | bitsHigh << 8) >>> 0 & 16777215
  var high = bitsHigh >> 16 & 65535
  var digitA = low + mid * 6777216 + high * 6710656
  var digitB = mid + high * 8147497
  var digitC = high * 2
  var base = 10000000
  if (digitA >= base) {
    digitB += Math.floor(digitA / base)
    digitA %= base
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base)
    digitB %= base
  }
  var table = jspb.utils.DIGITS
  var start = false
  var result = ''
  function emit (digit) {
    var temp = base
    for (var i = 0; i < 7; i++) {
      temp /= 10
      var decimalDigit = digit / temp % 10 >>> 0
      if (decimalDigit == 0 && !start) {
        continue
      }
      start = true
      result += table[decimalDigit]
    }
  }
  if (digitC || start) {
    emit(digitC)
  }
  if (digitB || start) {
    emit(digitB)
  }
  if (digitA || start) {
    emit(digitA)
  }
  return result
}
jspb.utils.joinSignedDecimalString = function (bitsLow, bitsHigh) {
  var negative = bitsHigh & 2147483648
  if (negative) {
    bitsLow = ~bitsLow + 1 >>> 0
    var carry = bitsLow == 0 ? 1 : 0
    bitsHigh = ~bitsHigh + carry >>> 0
  }
  var result = jspb.utils.joinUnsignedDecimalString(bitsLow, bitsHigh)
  return negative ? '-' + result : result
}
jspb.utils.hash64ToDecimalString = function (hash, signed) {
  jspb.utils.splitHash64(hash)
  var bitsLow = jspb.utils.split64Low
  var bitsHigh = jspb.utils.split64High
  return signed ? jspb.utils.joinSignedDecimalString(bitsLow, bitsHigh) : jspb.utils.joinUnsignedDecimalString(bitsLow, bitsHigh)
}
jspb.utils.hash64ArrayToDecimalStrings = function (hashes, signed) {
  var result = new Array(hashes.length)
  for (var i = 0; i < hashes.length; i++) {
    result[i] = jspb.utils.hash64ToDecimalString(hashes[i], signed)
  }
  return result
}
jspb.utils.decimalStringToHash64 = function (dec) {
  goog.asserts.assert(dec.length > 0)
  var minus = false
  if (dec[0] === '-') {
    minus = true
    dec = dec.slice(1)
  }
  var resultBytes = [0, 0, 0, 0, 0, 0, 0, 0]
  function muladd (m, c) {
    for (var i = 0; i < 8 && (m !== 1 || c > 0); i++) {
      var r = m * resultBytes[i] + c
      resultBytes[i] = r & 255
      c = r >>> 8
    }
  }
  function neg () {
    for (var i = 0; i < 8; i++) {
      resultBytes[i] = ~resultBytes[i] & 255
    }
  }
  for (var i = 0; i < dec.length; i++) {
    muladd(10, jspb.utils.DIGITS.indexOf(dec[i]))
  }
  if (minus) {
    neg()
    muladd(1, 1)
  }
  return goog.crypt.byteArrayToString(resultBytes)
}
jspb.utils.splitDecimalString = function (value) {
  jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(value))
}
jspb.utils.hash64ToHexString = function (hash) {
  var temp = new Array(18)
  temp[0] = '0'
  temp[1] = 'x'
  for (var i = 0; i < 8; i++) {
    var c = hash.charCodeAt(7 - i)
    temp[i * 2 + 2] = jspb.utils.DIGITS[c >> 4]
    temp[i * 2 + 3] = jspb.utils.DIGITS[c & 15]
  }
  var result = temp.join('')
  return result
}
jspb.utils.hexStringToHash64 = function (hex) {
  hex = hex.toLowerCase()
  goog.asserts.assert(hex.length == 18)
  goog.asserts.assert(hex[0] == '0')
  goog.asserts.assert(hex[1] == 'x')
  var result = ''
  for (var i = 0; i < 8; i++) {
    var hi = jspb.utils.DIGITS.indexOf(hex[i * 2 + 2])
    var lo = jspb.utils.DIGITS.indexOf(hex[i * 2 + 3])
    result = String.fromCharCode(hi * 16 + lo) + result
  }
  return result
}
jspb.utils.hash64ToNumber = function (hash, signed) {
  jspb.utils.splitHash64(hash)
  var bitsLow = jspb.utils.split64Low
  var bitsHigh = jspb.utils.split64High
  return signed ? jspb.utils.joinInt64(bitsLow, bitsHigh) : jspb.utils.joinUint64(bitsLow, bitsHigh)
}
jspb.utils.numberToHash64 = function (value) {
  jspb.utils.splitInt64(value)
  return jspb.utils.joinHash64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.utils.countVarints = function (buffer, start, end) {
  var count = 0
  for (var i = start; i < end; i++) {
    count += buffer[i] >> 7
  }
  return end - start - count
}
jspb.utils.countVarintFields = function (buffer, start, end, field) {
  var count = 0
  var cursor = start
  var tag = field * 8 + jspb.BinaryConstants.WireType.VARINT
  if (tag < 128) {
    while (cursor < end) {
      if (buffer[cursor++] != tag) {
        return count
      }
      count++
      while (1) {
        var x = buffer[cursor++]
        if ((x & 128) == 0) {
          break
        }
      }
    }
  } else {
    while (cursor < end) {
      var temp = tag
      while (temp > 128) {
        if (buffer[cursor] != (temp & 127 | 128)) {
          return count
        }
        cursor++
        temp >>= 7
      }
      if (buffer[cursor++] != temp) {
        return count
      }
      count++
      while (1) {
        var x = buffer[cursor++]
        if ((x & 128) == 0) {
          break
        }
      }
    }
  }
  return count
}
jspb.utils.countFixedFields_ = function (buffer, start, end, tag, stride) {
  var count = 0
  var cursor = start
  if (tag < 128) {
    while (cursor < end) {
      if (buffer[cursor++] != tag) {
        return count
      }
      count++
      cursor += stride
    }
  } else {
    while (cursor < end) {
      var temp = tag
      while (temp > 128) {
        if (buffer[cursor++] != (temp & 127 | 128)) {
          return count
        }
        temp >>= 7
      }
      if (buffer[cursor++] != temp) {
        return count
      }
      count++
      cursor += stride
    }
  }
  return count
}
jspb.utils.countFixed32Fields = function (buffer, start, end, field) {
  var tag = field * 8 + jspb.BinaryConstants.WireType.FIXED32
  return jspb.utils.countFixedFields_(buffer, start, end, tag, 4)
}
jspb.utils.countFixed64Fields = function (buffer, start, end, field) {
  var tag = field * 8 + jspb.BinaryConstants.WireType.FIXED64
  return jspb.utils.countFixedFields_(buffer, start, end, tag, 8)
}
jspb.utils.countDelimitedFields = function (buffer, start, end, field) {
  var count = 0
  var cursor = start
  var tag = field * 8 + jspb.BinaryConstants.WireType.DELIMITED
  while (cursor < end) {
    var temp = tag
    while (temp > 128) {
      if (buffer[cursor++] != (temp & 127 | 128)) {
        return count
      }
      temp >>= 7
    }
    if (buffer[cursor++] != temp) {
      return count
    }
    count++
    var length = 0
    var shift = 1
    while (1) {
      temp = buffer[cursor++]
      length += (temp & 127) * shift
      shift *= 128
      if ((temp & 128) == 0) {
        break
      }
    }
    cursor += length
  }
  return count
}
jspb.utils.debugBytesToTextFormat = function (byteSource) {
  var s = '"'
  if (byteSource) {
    var bytes = jspb.utils.byteSourceToUint8Array(byteSource)
    for (var i = 0; i < bytes.length; i++) {
      s += '\\x'
      if (bytes[i] < 16) {
        s += '0'
      }
      s += bytes[i].toString(16)
    }
  }
  return s + '"'
}
jspb.utils.debugScalarToTextFormat = function (scalar) {
  if (goog.isString(scalar)) {
    return goog.string.quote(scalar)
  } else {
    return scalar.toString()
  }
}
jspb.utils.stringToByteArray = function (str) {
  var arr = new Uint8Array(str.length)
  for (var i = 0; i < str.length; i++) {
    var codepoint = str.charCodeAt(i)
    if (codepoint > 255) {
      throw new Error('Conversion error: string contains codepoint ' + 'outside of byte range')
    }
    arr[i] = codepoint
  }
  return arr
}
jspb.utils.byteSourceToUint8Array = function (data) {
  if (data.constructor === Uint8Array) {
    return data
  }
  if (data.constructor === ArrayBuffer) {
    data = data
    return new Uint8Array(data)
  }
  if (data.constructor === Array) {
    data = data
    return new Uint8Array(data)
  }
  if (data.constructor === String) {
    data = data
    return goog.crypt.base64.decodeStringToUint8Array(data)
  }
  goog.asserts.fail('Type not convertible to Uint8Array.')
  return new Uint8Array(0)
}
goog.provide('jspb.BinaryDecoder')
goog.provide('jspb.BinaryIterator')
goog.require('goog.asserts')
goog.require('goog.crypt')
goog.require('jspb.utils')
jspb.BinaryIterator = function (opt_decoder, opt_next, opt_elements) {
  this.decoder_ = null
  this.nextMethod_ = null
  this.elements_ = null
  this.cursor_ = 0
  this.nextValue_ = null
  this.atEnd_ = true
  this.init_(opt_decoder, opt_next, opt_elements)
}
jspb.BinaryIterator.prototype.init_ = function (opt_decoder, opt_next, opt_elements) {
  if (opt_decoder && opt_next) {
    this.decoder_ = opt_decoder
    this.nextMethod_ = opt_next
  }
  this.elements_ = opt_elements || null
  this.cursor_ = 0
  this.nextValue_ = null
  this.atEnd_ = !this.decoder_ && !this.elements_
  this.next()
}
jspb.BinaryIterator.instanceCache_ = []
jspb.BinaryIterator.alloc = function (opt_decoder, opt_next, opt_elements) {
  if (jspb.BinaryIterator.instanceCache_.length) {
    var iterator = jspb.BinaryIterator.instanceCache_.pop()
    iterator.init_(opt_decoder, opt_next, opt_elements)
    return iterator
  } else {
    return new jspb.BinaryIterator(opt_decoder, opt_next, opt_elements)
  }
}
jspb.BinaryIterator.prototype.free = function () {
  this.clear()
  if (jspb.BinaryIterator.instanceCache_.length < 100) {
    jspb.BinaryIterator.instanceCache_.push(this)
  }
}
jspb.BinaryIterator.prototype.clear = function () {
  if (this.decoder_) {
    this.decoder_.free()
  }
  this.decoder_ = null
  this.nextMethod_ = null
  this.elements_ = null
  this.cursor_ = 0
  this.nextValue_ = null
  this.atEnd_ = true
}
jspb.BinaryIterator.prototype.get = function () {
  return this.nextValue_
}
jspb.BinaryIterator.prototype.atEnd = function () {
  return this.atEnd_
}
jspb.BinaryIterator.prototype.next = function () {
  var lastValue = this.nextValue_
  if (this.decoder_) {
    if (this.decoder_.atEnd()) {
      this.nextValue_ = null
      this.atEnd_ = true
    } else {
      this.nextValue_ = this.nextMethod_.call(this.decoder_)
    }
  } else {
    if (this.elements_) {
      if (this.cursor_ == this.elements_.length) {
        this.nextValue_ = null
        this.atEnd_ = true
      } else {
        this.nextValue_ = this.elements_[this.cursor_++]
      }
    }
  }
  return lastValue
}
jspb.BinaryDecoder = function (opt_bytes, opt_start, opt_length) {
  this.bytes_ = null
  this.start_ = 0
  this.end_ = 0
  this.cursor_ = 0
  this.tempLow_ = 0
  this.tempHigh_ = 0
  this.error_ = false
  if (opt_bytes) {
    this.setBlock(opt_bytes, opt_start, opt_length)
  }
}
jspb.BinaryDecoder.instanceCache_ = []
jspb.BinaryDecoder.alloc = function (opt_bytes, opt_start, opt_length) {
  if (jspb.BinaryDecoder.instanceCache_.length) {
    var newDecoder = jspb.BinaryDecoder.instanceCache_.pop()
    if (opt_bytes) {
      newDecoder.setBlock(opt_bytes, opt_start, opt_length)
    }
    return newDecoder
  } else {
    return new jspb.BinaryDecoder(opt_bytes, opt_start, opt_length)
  }
}
jspb.BinaryDecoder.prototype.free = function () {
  this.clear()
  if (jspb.BinaryDecoder.instanceCache_.length < 100) {
    jspb.BinaryDecoder.instanceCache_.push(this)
  }
}
jspb.BinaryDecoder.prototype.clone = function () {
  return jspb.BinaryDecoder.alloc(this.bytes_, this.start_, this.end_ - this.start_)
}
jspb.BinaryDecoder.prototype.clear = function () {
  this.bytes_ = null
  this.start_ = 0
  this.end_ = 0
  this.cursor_ = 0
  this.error_ = false
}
jspb.BinaryDecoder.prototype.getBuffer = function () {
  return this.bytes_
}
jspb.BinaryDecoder.prototype.setBlock = function (data, opt_start, opt_length) {
  this.bytes_ = jspb.utils.byteSourceToUint8Array(data)
  this.start_ = goog.isDef(opt_start) ? opt_start : 0
  this.end_ = goog.isDef(opt_length) ? this.start_ + opt_length : this.bytes_.length
  this.cursor_ = this.start_
}
jspb.BinaryDecoder.prototype.getEnd = function () {
  return this.end_
}
jspb.BinaryDecoder.prototype.setEnd = function (end) {
  this.end_ = end
}
jspb.BinaryDecoder.prototype.reset = function () {
  this.cursor_ = this.start_
}
jspb.BinaryDecoder.prototype.getCursor = function () {
  return this.cursor_
}
jspb.BinaryDecoder.prototype.setCursor = function (cursor) {
  this.cursor_ = cursor
}
jspb.BinaryDecoder.prototype.advance = function (count) {
  this.cursor_ += count
  goog.asserts.assert(this.cursor_ <= this.end_)
}
jspb.BinaryDecoder.prototype.atEnd = function () {
  return this.cursor_ == this.end_
}
jspb.BinaryDecoder.prototype.pastEnd = function () {
  return this.cursor_ > this.end_
}
jspb.BinaryDecoder.prototype.getError = function () {
  return this.error_ || this.cursor_ < 0 || this.cursor_ > this.end_
}
jspb.BinaryDecoder.prototype.readSplitVarint64_ = function () {
  var temp
  var lowBits = 0
  var highBits = 0
  for (var i = 0; i < 4; i++) {
    temp = this.bytes_[this.cursor_++]
    lowBits |= (temp & 127) << i * 7
    if (temp < 128) {
      this.tempLow_ = lowBits >>> 0
      this.tempHigh_ = 0
      return
    }
  }
  temp = this.bytes_[this.cursor_++]
  lowBits |= (temp & 127) << 28
  highBits |= (temp & 127) >> 4
  if (temp < 128) {
    this.tempLow_ = lowBits >>> 0
    this.tempHigh_ = highBits >>> 0
    return
  }
  for (var i = 0; i < 5; i++) {
    temp = this.bytes_[this.cursor_++]
    highBits |= (temp & 127) << i * 7 + 3
    if (temp < 128) {
      this.tempLow_ = lowBits >>> 0
      this.tempHigh_ = highBits >>> 0
      return
    }
  }
  goog.asserts.fail('Failed to read varint, encoding is invalid.')
  this.error_ = true
}
jspb.BinaryDecoder.prototype.skipVarint = function () {
  while (this.bytes_[this.cursor_] & 128) {
    this.cursor_++
  }
  this.cursor_++
}
jspb.BinaryDecoder.prototype.unskipVarint = function (value) {
  while (value > 128) {
    this.cursor_--
    value = value >>> 7
  }
  this.cursor_--
}
jspb.BinaryDecoder.prototype.readUnsignedVarint32 = function () {
  var temp
  var bytes = this.bytes_
  temp = bytes[this.cursor_ + 0]
  var x = temp & 127
  if (temp < 128) {
    this.cursor_ += 1
    goog.asserts.assert(this.cursor_ <= this.end_)
    return x
  }
  temp = bytes[this.cursor_ + 1]
  x |= (temp & 127) << 7
  if (temp < 128) {
    this.cursor_ += 2
    goog.asserts.assert(this.cursor_ <= this.end_)
    return x
  }
  temp = bytes[this.cursor_ + 2]
  x |= (temp & 127) << 14
  if (temp < 128) {
    this.cursor_ += 3
    goog.asserts.assert(this.cursor_ <= this.end_)
    return x
  }
  temp = bytes[this.cursor_ + 3]
  x |= (temp & 127) << 21
  if (temp < 128) {
    this.cursor_ += 4
    goog.asserts.assert(this.cursor_ <= this.end_)
    return x
  }
  temp = bytes[this.cursor_ + 4]
  x |= (temp & 15) << 28
  if (temp < 128) {
    this.cursor_ += 5
    goog.asserts.assert(this.cursor_ <= this.end_)
    return x >>> 0
  }
  this.cursor_ += 5
  if (bytes[this.cursor_++] >= 128 && bytes[this.cursor_++] >= 128 && bytes[this.cursor_++] >= 128 && bytes[this.cursor_++] >= 128 && bytes[this.cursor_++] >= 128) {
    goog.asserts.assert(false)
  }
  goog.asserts.assert(this.cursor_ <= this.end_)
  return x
}
jspb.BinaryDecoder.prototype.readSignedVarint32 = jspb.BinaryDecoder.prototype.readUnsignedVarint32
jspb.BinaryDecoder.prototype.readUnsignedVarint32String = function () {
  var value = this.readUnsignedVarint32()
  return value.toString()
}
jspb.BinaryDecoder.prototype.readSignedVarint32String = function () {
  var value = this.readSignedVarint32()
  return value.toString()
}
jspb.BinaryDecoder.prototype.readZigzagVarint32 = function () {
  var result = this.readUnsignedVarint32()
  return result >>> 1 ^ -(result & 1)
}
jspb.BinaryDecoder.prototype.readUnsignedVarint64 = function () {
  this.readSplitVarint64_()
  return jspb.utils.joinUint64(this.tempLow_, this.tempHigh_)
}
jspb.BinaryDecoder.prototype.readUnsignedVarint64String = function () {
  this.readSplitVarint64_()
  return jspb.utils.joinUnsignedDecimalString(this.tempLow_, this.tempHigh_)
}
jspb.BinaryDecoder.prototype.readSignedVarint64 = function () {
  this.readSplitVarint64_()
  return jspb.utils.joinInt64(this.tempLow_, this.tempHigh_)
}
jspb.BinaryDecoder.prototype.readSignedVarint64String = function () {
  this.readSplitVarint64_()
  return jspb.utils.joinSignedDecimalString(this.tempLow_, this.tempHigh_)
}
jspb.BinaryDecoder.prototype.readZigzagVarint64 = function () {
  this.readSplitVarint64_()
  return jspb.utils.joinZigzag64(this.tempLow_, this.tempHigh_)
}
jspb.BinaryDecoder.prototype.readZigzagVarint64String = function () {
  var value = this.readZigzagVarint64()
  return value.toString()
}
jspb.BinaryDecoder.prototype.readUint8 = function () {
  var a = this.bytes_[this.cursor_ + 0]
  this.cursor_ += 1
  goog.asserts.assert(this.cursor_ <= this.end_)
  return a
}
jspb.BinaryDecoder.prototype.readUint16 = function () {
  var a = this.bytes_[this.cursor_ + 0]
  var b = this.bytes_[this.cursor_ + 1]
  this.cursor_ += 2
  goog.asserts.assert(this.cursor_ <= this.end_)
  return a << 0 | b << 8
}
jspb.BinaryDecoder.prototype.readUint32 = function () {
  var a = this.bytes_[this.cursor_ + 0]
  var b = this.bytes_[this.cursor_ + 1]
  var c = this.bytes_[this.cursor_ + 2]
  var d = this.bytes_[this.cursor_ + 3]
  this.cursor_ += 4
  goog.asserts.assert(this.cursor_ <= this.end_)
  return (a << 0 | b << 8 | c << 16 | d << 24) >>> 0
}
jspb.BinaryDecoder.prototype.readUint64 = function () {
  var bitsLow = this.readUint32()
  var bitsHigh = this.readUint32()
  return jspb.utils.joinUint64(bitsLow, bitsHigh)
}
jspb.BinaryDecoder.prototype.readUint64String = function () {
  var bitsLow = this.readUint32()
  var bitsHigh = this.readUint32()
  return jspb.utils.joinUnsignedDecimalString(bitsLow, bitsHigh)
}
jspb.BinaryDecoder.prototype.readInt8 = function () {
  var a = this.bytes_[this.cursor_ + 0]
  this.cursor_ += 1
  goog.asserts.assert(this.cursor_ <= this.end_)
  return a << 24 >> 24
}
jspb.BinaryDecoder.prototype.readInt16 = function () {
  var a = this.bytes_[this.cursor_ + 0]
  var b = this.bytes_[this.cursor_ + 1]
  this.cursor_ += 2
  goog.asserts.assert(this.cursor_ <= this.end_)
  return (a << 0 | b << 8) << 16 >> 16
}
jspb.BinaryDecoder.prototype.readInt32 = function () {
  var a = this.bytes_[this.cursor_ + 0]
  var b = this.bytes_[this.cursor_ + 1]
  var c = this.bytes_[this.cursor_ + 2]
  var d = this.bytes_[this.cursor_ + 3]
  this.cursor_ += 4
  goog.asserts.assert(this.cursor_ <= this.end_)
  return a << 0 | b << 8 | c << 16 | d << 24
}
jspb.BinaryDecoder.prototype.readInt64 = function () {
  var bitsLow = this.readUint32()
  var bitsHigh = this.readUint32()
  return jspb.utils.joinInt64(bitsLow, bitsHigh)
}
jspb.BinaryDecoder.prototype.readInt64String = function () {
  var bitsLow = this.readUint32()
  var bitsHigh = this.readUint32()
  return jspb.utils.joinSignedDecimalString(bitsLow, bitsHigh)
}
jspb.BinaryDecoder.prototype.readFloat = function () {
  var bitsLow = this.readUint32()
  var bitsHigh = 0
  return jspb.utils.joinFloat32(bitsLow, bitsHigh)
}
jspb.BinaryDecoder.prototype.readDouble = function () {
  var bitsLow = this.readUint32()
  var bitsHigh = this.readUint32()
  return jspb.utils.joinFloat64(bitsLow, bitsHigh)
}
jspb.BinaryDecoder.prototype.readBool = function () {
  return !!this.bytes_[this.cursor_++]
}
jspb.BinaryDecoder.prototype.readEnum = function () {
  return this.readSignedVarint32()
}
jspb.BinaryDecoder.prototype.readString = function (length) {
  var bytes = this.bytes_
  var cursor = this.cursor_
  var end = cursor + length
  var codeUnits = []
  var result = ''
  while (cursor < end) {
    var c = bytes[cursor++]
    if (c < 128) {
      codeUnits.push(c)
    } else {
      if (c < 192) {
        continue
      } else {
        if (c < 224) {
          var c2 = bytes[cursor++]
          codeUnits.push((c & 31) << 6 | c2 & 63)
        } else {
          if (c < 240) {
            var c2 = bytes[cursor++]
            var c3 = bytes[cursor++]
            codeUnits.push((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
          } else {
            if (c < 248) {
              var c2 = bytes[cursor++]
              var c3 = bytes[cursor++]
              var c4 = bytes[cursor++]
              var codepoint = (c & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63
              codepoint -= 65536
              var low = (codepoint & 1023) + 56320
              var high = (codepoint >> 10 & 1023) + 55296
              codeUnits.push(high, low)
            }
          }
        }
      }
    }
    if (codeUnits.length >= 8192) {
      result += String.fromCharCode.apply(null, codeUnits)
      codeUnits.length = 0
    }
  }
  result += goog.crypt.byteArrayToString(codeUnits)
  this.cursor_ = cursor
  return result
}
jspb.BinaryDecoder.prototype.readStringWithLength = function () {
  var length = this.readUnsignedVarint32()
  return this.readString(length)
}
jspb.BinaryDecoder.prototype.readBytes = function (length) {
  if (length < 0 || this.cursor_ + length > this.bytes_.length) {
    this.error_ = true
    goog.asserts.fail('Invalid byte length!')
    return new Uint8Array(0)
  }
  var result = this.bytes_.subarray(this.cursor_, this.cursor_ + length)
  this.cursor_ += length
  goog.asserts.assert(this.cursor_ <= this.end_)
  return result
}
jspb.BinaryDecoder.prototype.readVarintHash64 = function () {
  this.readSplitVarint64_()
  return jspb.utils.joinHash64(this.tempLow_, this.tempHigh_)
}
jspb.BinaryDecoder.prototype.readFixedHash64 = function () {
  var bytes = this.bytes_
  var cursor = this.cursor_
  var a = bytes[cursor + 0]
  var b = bytes[cursor + 1]
  var c = bytes[cursor + 2]
  var d = bytes[cursor + 3]
  var e = bytes[cursor + 4]
  var f = bytes[cursor + 5]
  var g = bytes[cursor + 6]
  var h = bytes[cursor + 7]
  this.cursor_ += 8
  return String.fromCharCode(a, b, c, d, e, f, g, h)
}
goog.provide('jspb.BinaryReader')
goog.require('goog.asserts')
goog.require('jspb.BinaryConstants')
goog.require('jspb.BinaryDecoder')
jspb.BinaryReader = function (opt_bytes, opt_start, opt_length) {
  this.decoder_ = jspb.BinaryDecoder.alloc(opt_bytes, opt_start, opt_length)
  this.fieldCursor_ = this.decoder_.getCursor()
  this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER
  this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID
  this.error_ = false
  this.readCallbacks_ = null
}
jspb.BinaryReader.instanceCache_ = []
jspb.BinaryReader.alloc = function (opt_bytes, opt_start, opt_length) {
  if (jspb.BinaryReader.instanceCache_.length) {
    var newReader = jspb.BinaryReader.instanceCache_.pop()
    if (opt_bytes) {
      newReader.decoder_.setBlock(opt_bytes, opt_start, opt_length)
    }
    return newReader
  } else {
    return new jspb.BinaryReader(opt_bytes, opt_start, opt_length)
  }
}
jspb.BinaryReader.prototype.alloc = jspb.BinaryReader.alloc
jspb.BinaryReader.prototype.free = function () {
  this.decoder_.clear()
  this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER
  this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID
  this.error_ = false
  this.readCallbacks_ = null
  if (jspb.BinaryReader.instanceCache_.length < 100) {
    jspb.BinaryReader.instanceCache_.push(this)
  }
}
jspb.BinaryReader.prototype.getFieldCursor = function () {
  return this.fieldCursor_
}
jspb.BinaryReader.prototype.getCursor = function () {
  return this.decoder_.getCursor()
}
jspb.BinaryReader.prototype.getBuffer = function () {
  return this.decoder_.getBuffer()
}
jspb.BinaryReader.prototype.getFieldNumber = function () {
  return this.nextField_
}
jspb.BinaryReader.prototype.getWireType = function () {
  return this.nextWireType_
}
jspb.BinaryReader.prototype.isEndGroup = function () {
  return this.nextWireType_ == jspb.BinaryConstants.WireType.END_GROUP
}
jspb.BinaryReader.prototype.getError = function () {
  return this.error_ || this.decoder_.getError()
}
jspb.BinaryReader.prototype.setBlock = function (bytes, start, length) {
  this.decoder_.setBlock(bytes, start, length)
  this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER
  this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID
}
jspb.BinaryReader.prototype.reset = function () {
  this.decoder_.reset()
  this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER
  this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID
}
jspb.BinaryReader.prototype.advance = function (count) {
  this.decoder_.advance(count)
}
jspb.BinaryReader.prototype.nextField = function () {
  if (this.decoder_.atEnd()) {
    return false
  }
  if (this.getError()) {
    goog.asserts.fail('Decoder hit an error')
    return false
  }
  this.fieldCursor_ = this.decoder_.getCursor()
  var header = this.decoder_.readUnsignedVarint32()
  var nextField = header >>> 3
  var nextWireType = header & 7
  if (nextWireType != jspb.BinaryConstants.WireType.VARINT && nextWireType != jspb.BinaryConstants.WireType.FIXED32 && nextWireType != jspb.BinaryConstants.WireType.FIXED64 && nextWireType != jspb.BinaryConstants.WireType.DELIMITED && nextWireType != jspb.BinaryConstants.WireType.START_GROUP && nextWireType != jspb.BinaryConstants.WireType.END_GROUP) {
    goog.asserts.fail('Invalid wire type')
    this.error_ = true
    return false
  }
  this.nextField_ = nextField
  this.nextWireType_ = nextWireType
  return true
}
jspb.BinaryReader.prototype.unskipHeader = function () {
  this.decoder_.unskipVarint(this.nextField_ << 3 | this.nextWireType_)
}
jspb.BinaryReader.prototype.skipMatchingFields = function () {
  var field = this.nextField_
  this.unskipHeader()
  while (this.nextField() && this.getFieldNumber() == field) {
    this.skipField()
  }
  if (!this.decoder_.atEnd()) {
    this.unskipHeader()
  }
}
jspb.BinaryReader.prototype.skipVarintField = function () {
  if (this.nextWireType_ != jspb.BinaryConstants.WireType.VARINT) {
    goog.asserts.fail('Invalid wire type for skipVarintField')
    this.skipField()
    return
  }
  this.decoder_.skipVarint()
}
jspb.BinaryReader.prototype.skipDelimitedField = function () {
  if (this.nextWireType_ != jspb.BinaryConstants.WireType.DELIMITED) {
    goog.asserts.fail('Invalid wire type for skipDelimitedField')
    this.skipField()
    return
  }
  var length = this.decoder_.readUnsignedVarint32()
  this.decoder_.advance(length)
}
jspb.BinaryReader.prototype.skipFixed32Field = function () {
  if (this.nextWireType_ != jspb.BinaryConstants.WireType.FIXED32) {
    goog.asserts.fail('Invalid wire type for skipFixed32Field')
    this.skipField()
    return
  }
  this.decoder_.advance(4)
}
jspb.BinaryReader.prototype.skipFixed64Field = function () {
  if (this.nextWireType_ != jspb.BinaryConstants.WireType.FIXED64) {
    goog.asserts.fail('Invalid wire type for skipFixed64Field')
    this.skipField()
    return
  }
  this.decoder_.advance(8)
}
jspb.BinaryReader.prototype.skipGroup = function () {
  var nestedGroups = [this.nextField_]
  do {
    if (!this.nextField()) {
      goog.asserts.fail('Unmatched start-group tag: stream EOF')
      this.error_ = true
      return
    }
    if (this.nextWireType_ == jspb.BinaryConstants.WireType.START_GROUP) {
      nestedGroups.push(this.nextField_)
    } else {
      if (this.nextWireType_ == jspb.BinaryConstants.WireType.END_GROUP) {
        if (this.nextField_ != nestedGroups.pop()) {
          goog.asserts.fail('Unmatched end-group tag')
          this.error_ = true
          return
        }
      }
    }
  } while (nestedGroups.length > 0)
}
jspb.BinaryReader.prototype.skipField = function () {
  switch (this.nextWireType_) {
    case jspb.BinaryConstants.WireType.VARINT:
      this.skipVarintField()
      break
    case jspb.BinaryConstants.WireType.FIXED64:
      this.skipFixed64Field()
      break
    case jspb.BinaryConstants.WireType.DELIMITED:
      this.skipDelimitedField()
      break
    case jspb.BinaryConstants.WireType.FIXED32:
      this.skipFixed32Field()
      break
    case jspb.BinaryConstants.WireType.START_GROUP:
      this.skipGroup()
      break
    default:
      goog.asserts.fail('Invalid wire encoding for field.')
  }
}
jspb.BinaryReader.prototype.registerReadCallback = function (callbackName, callback) {
  if (goog.isNull(this.readCallbacks_)) {
    this.readCallbacks_ = {}
  }
  goog.asserts.assert(!this.readCallbacks_[callbackName])
  this.readCallbacks_[callbackName] = callback
}
jspb.BinaryReader.prototype.runReadCallback = function (callbackName) {
  goog.asserts.assert(!goog.isNull(this.readCallbacks_))
  var callback = this.readCallbacks_[callbackName]
  goog.asserts.assert(callback)
  return callback(this)
}
jspb.BinaryReader.prototype.readAny = function (fieldType) {
  this.nextWireType_ = jspb.BinaryConstants.FieldTypeToWireType(fieldType)
  var fieldTypes = jspb.BinaryConstants.FieldType
  switch (fieldType) {
    case fieldTypes.DOUBLE:
      return this.readDouble()
    case fieldTypes.FLOAT:
      return this.readFloat()
    case fieldTypes.INT64:
      return this.readInt64()
    case fieldTypes.UINT64:
      return this.readUint64()
    case fieldTypes.INT32:
      return this.readInt32()
    case fieldTypes.FIXED64:
      return this.readFixed64()
    case fieldTypes.FIXED32:
      return this.readFixed32()
    case fieldTypes.BOOL:
      return this.readBool()
    case fieldTypes.STRING:
      return this.readString()
    case fieldTypes.GROUP:
      goog.asserts.fail('Group field type not supported in readAny()')
    case fieldTypes.MESSAGE:
      goog.asserts.fail('Message field type not supported in readAny()')
    case fieldTypes.BYTES:
      return this.readBytes()
    case fieldTypes.UINT32:
      return this.readUint32()
    case fieldTypes.ENUM:
      return this.readEnum()
    case fieldTypes.SFIXED32:
      return this.readSfixed32()
    case fieldTypes.SFIXED64:
      return this.readSfixed64()
    case fieldTypes.SINT32:
      return this.readSint32()
    case fieldTypes.SINT64:
      return this.readSint64()
    case fieldTypes.FHASH64:
      return this.readFixedHash64()
    case fieldTypes.VHASH64:
      return this.readVarintHash64()
    default:
      goog.asserts.fail('Invalid field type in readAny()')
  }
  return 0
}
jspb.BinaryReader.prototype.readMessage = function (message, reader) {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED)
  var oldEnd = this.decoder_.getEnd()
  var length = this.decoder_.readUnsignedVarint32()
  var newEnd = this.decoder_.getCursor() + length
  this.decoder_.setEnd(newEnd)
  reader(message, this)
  this.decoder_.setCursor(newEnd)
  this.decoder_.setEnd(oldEnd)
}
jspb.BinaryReader.prototype.readGroup = function (field, message, reader) {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.START_GROUP)
  goog.asserts.assert(this.nextField_ == field)
  reader(message, this)
  if (!this.error_ && this.nextWireType_ != jspb.BinaryConstants.WireType.END_GROUP) {
    goog.asserts.fail('Group submessage did not end with an END_GROUP tag')
    this.error_ = true
  }
}
jspb.BinaryReader.prototype.getFieldDecoder = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED)
  var length = this.decoder_.readUnsignedVarint32()
  var start = this.decoder_.getCursor()
  var end = start + length
  var innerDecoder = jspb.BinaryDecoder.alloc(this.decoder_.getBuffer(), start, length)
  this.decoder_.setCursor(end)
  return innerDecoder
}
jspb.BinaryReader.prototype.readInt32 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readSignedVarint32()
}
jspb.BinaryReader.prototype.readInt32String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readSignedVarint32String()
}
jspb.BinaryReader.prototype.readInt64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readSignedVarint64()
}
jspb.BinaryReader.prototype.readInt64String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readSignedVarint64String()
}
jspb.BinaryReader.prototype.readUint32 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readUnsignedVarint32()
}
jspb.BinaryReader.prototype.readUint32String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readUnsignedVarint32String()
}
jspb.BinaryReader.prototype.readUint64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readUnsignedVarint64()
}
jspb.BinaryReader.prototype.readUint64String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readUnsignedVarint64String()
}
jspb.BinaryReader.prototype.readSint32 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readZigzagVarint32()
}
jspb.BinaryReader.prototype.readSint64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readZigzagVarint64()
}
jspb.BinaryReader.prototype.readSint64String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readZigzagVarint64String()
}
jspb.BinaryReader.prototype.readFixed32 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32)
  return this.decoder_.readUint32()
}
jspb.BinaryReader.prototype.readFixed64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64)
  return this.decoder_.readUint64()
}
jspb.BinaryReader.prototype.readFixed64String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64)
  return this.decoder_.readUint64String()
}
jspb.BinaryReader.prototype.readSfixed32 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32)
  return this.decoder_.readInt32()
}
jspb.BinaryReader.prototype.readSfixed32String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32)
  return this.decoder_.readInt32().toString()
}
jspb.BinaryReader.prototype.readSfixed64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64)
  return this.decoder_.readInt64()
}
jspb.BinaryReader.prototype.readSfixed64String = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64)
  return this.decoder_.readInt64String()
}
jspb.BinaryReader.prototype.readFloat = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32)
  return this.decoder_.readFloat()
}
jspb.BinaryReader.prototype.readDouble = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64)
  return this.decoder_.readDouble()
}
jspb.BinaryReader.prototype.readBool = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return !!this.decoder_.readUnsignedVarint32()
}
jspb.BinaryReader.prototype.readEnum = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readSignedVarint64()
}
jspb.BinaryReader.prototype.readString = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED)
  var length = this.decoder_.readUnsignedVarint32()
  return this.decoder_.readString(length)
}
jspb.BinaryReader.prototype.readBytes = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED)
  var length = this.decoder_.readUnsignedVarint32()
  return this.decoder_.readBytes(length)
}
jspb.BinaryReader.prototype.readVarintHash64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT)
  return this.decoder_.readVarintHash64()
}
jspb.BinaryReader.prototype.readFixedHash64 = function () {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64)
  return this.decoder_.readFixedHash64()
}
jspb.BinaryReader.prototype.readPackedField_ = function (decodeMethod) {
  goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED)
  var length = this.decoder_.readUnsignedVarint32()
  var end = this.decoder_.getCursor() + length
  var result = []
  while (this.decoder_.getCursor() < end) {
    result.push(decodeMethod.call(this.decoder_))
  }
  return result
}
jspb.BinaryReader.prototype.readPackedInt32 = function () {
  return this.readPackedField_(this.decoder_.readSignedVarint32)
}
jspb.BinaryReader.prototype.readPackedInt32String = function () {
  return this.readPackedField_(this.decoder_.readSignedVarint32String)
}
jspb.BinaryReader.prototype.readPackedInt64 = function () {
  return this.readPackedField_(this.decoder_.readSignedVarint64)
}
jspb.BinaryReader.prototype.readPackedInt64String = function () {
  return this.readPackedField_(this.decoder_.readSignedVarint64String)
}
jspb.BinaryReader.prototype.readPackedUint32 = function () {
  return this.readPackedField_(this.decoder_.readUnsignedVarint32)
}
jspb.BinaryReader.prototype.readPackedUint32String = function () {
  return this.readPackedField_(this.decoder_.readUnsignedVarint32String)
}
jspb.BinaryReader.prototype.readPackedUint64 = function () {
  return this.readPackedField_(this.decoder_.readUnsignedVarint64)
}
jspb.BinaryReader.prototype.readPackedUint64String = function () {
  return this.readPackedField_(this.decoder_.readUnsignedVarint64String)
}
jspb.BinaryReader.prototype.readPackedSint32 = function () {
  return this.readPackedField_(this.decoder_.readZigzagVarint32)
}
jspb.BinaryReader.prototype.readPackedSint64 = function () {
  return this.readPackedField_(this.decoder_.readZigzagVarint64)
}
jspb.BinaryReader.prototype.readPackedSint64String = function () {
  return this.readPackedField_(this.decoder_.readZigzagVarint64String)
}
jspb.BinaryReader.prototype.readPackedFixed32 = function () {
  return this.readPackedField_(this.decoder_.readUint32)
}
jspb.BinaryReader.prototype.readPackedFixed64 = function () {
  return this.readPackedField_(this.decoder_.readUint64)
}
jspb.BinaryReader.prototype.readPackedFixed64String = function () {
  return this.readPackedField_(this.decoder_.readUint64String)
}
jspb.BinaryReader.prototype.readPackedSfixed32 = function () {
  return this.readPackedField_(this.decoder_.readInt32)
}
jspb.BinaryReader.prototype.readPackedSfixed64 = function () {
  return this.readPackedField_(this.decoder_.readInt64)
}
jspb.BinaryReader.prototype.readPackedSfixed64String = function () {
  return this.readPackedField_(this.decoder_.readInt64String)
}
jspb.BinaryReader.prototype.readPackedFloat = function () {
  return this.readPackedField_(this.decoder_.readFloat)
}
jspb.BinaryReader.prototype.readPackedDouble = function () {
  return this.readPackedField_(this.decoder_.readDouble)
}
jspb.BinaryReader.prototype.readPackedBool = function () {
  return this.readPackedField_(this.decoder_.readBool)
}
jspb.BinaryReader.prototype.readPackedEnum = function () {
  return this.readPackedField_(this.decoder_.readEnum)
}
jspb.BinaryReader.prototype.readPackedVarintHash64 = function () {
  return this.readPackedField_(this.decoder_.readVarintHash64)
}
jspb.BinaryReader.prototype.readPackedFixedHash64 = function () {
  return this.readPackedField_(this.decoder_.readFixedHash64)
}
goog.provide('jspb.BinaryEncoder')
goog.require('goog.asserts')
goog.require('jspb.BinaryConstants')
goog.require('jspb.utils')
jspb.BinaryEncoder = function () {
  this.buffer_ = []
}
jspb.BinaryEncoder.prototype.length = function () {
  return this.buffer_.length
}
jspb.BinaryEncoder.prototype.end = function () {
  var buffer = this.buffer_
  this.buffer_ = []
  return buffer
}
jspb.BinaryEncoder.prototype.writeSplitVarint64 = function (lowBits, highBits) {
  goog.asserts.assert(lowBits == Math.floor(lowBits))
  goog.asserts.assert(highBits == Math.floor(highBits))
  goog.asserts.assert(lowBits >= 0 && lowBits < jspb.BinaryConstants.TWO_TO_32)
  goog.asserts.assert(highBits >= 0 && highBits < jspb.BinaryConstants.TWO_TO_32)
  while (highBits > 0 || lowBits > 127) {
    this.buffer_.push(lowBits & 127 | 128)
    lowBits = (lowBits >>> 7 | highBits << 25) >>> 0
    highBits = highBits >>> 7
  }
  this.buffer_.push(lowBits)
}
jspb.BinaryEncoder.prototype.writeSplitFixed64 = function (lowBits, highBits) {
  goog.asserts.assert(lowBits == Math.floor(lowBits))
  goog.asserts.assert(highBits == Math.floor(highBits))
  goog.asserts.assert(lowBits >= 0 && lowBits < jspb.BinaryConstants.TWO_TO_32)
  goog.asserts.assert(highBits >= 0 && highBits < jspb.BinaryConstants.TWO_TO_32)
  this.writeUint32(lowBits)
  this.writeUint32(highBits)
}
jspb.BinaryEncoder.prototype.writeUnsignedVarint32 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_32)
  while (value > 127) {
    this.buffer_.push(value & 127 | 128)
    value = value >>> 7
  }
  this.buffer_.push(value)
}
jspb.BinaryEncoder.prototype.writeSignedVarint32 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  if (value >= 0) {
    this.writeUnsignedVarint32(value)
    return
  }
  for (var i = 0; i < 9; i++) {
    this.buffer_.push(value & 127 | 128)
    value = value >> 7
  }
  this.buffer_.push(1)
}
jspb.BinaryEncoder.prototype.writeUnsignedVarint64 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_64)
  jspb.utils.splitInt64(value)
  this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeSignedVarint64 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_63 && value < jspb.BinaryConstants.TWO_TO_63)
  jspb.utils.splitInt64(value)
  this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeZigzagVarint32 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.writeUnsignedVarint32((value << 1 ^ value >> 31) >>> 0)
}
jspb.BinaryEncoder.prototype.writeZigzagVarint64 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_63 && value < jspb.BinaryConstants.TWO_TO_63)
  jspb.utils.splitZigzag64(value)
  this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeZigzagVarint64String = function (value) {
  this.writeZigzagVarint64(parseInt(value, 10))
}
jspb.BinaryEncoder.prototype.writeUint8 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= 0 && value < 256)
  this.buffer_.push(value >>> 0 & 255)
}
jspb.BinaryEncoder.prototype.writeUint16 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= 0 && value < 65536)
  this.buffer_.push(value >>> 0 & 255)
  this.buffer_.push(value >>> 8 & 255)
}
jspb.BinaryEncoder.prototype.writeUint32 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_32)
  this.buffer_.push(value >>> 0 & 255)
  this.buffer_.push(value >>> 8 & 255)
  this.buffer_.push(value >>> 16 & 255)
  this.buffer_.push(value >>> 24 & 255)
}
jspb.BinaryEncoder.prototype.writeUint64 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_64)
  jspb.utils.splitUint64(value)
  this.writeUint32(jspb.utils.split64Low)
  this.writeUint32(jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeInt8 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -128 && value < 128)
  this.buffer_.push(value >>> 0 & 255)
}
jspb.BinaryEncoder.prototype.writeInt16 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -32768 && value < 32768)
  this.buffer_.push(value >>> 0 & 255)
  this.buffer_.push(value >>> 8 & 255)
}
jspb.BinaryEncoder.prototype.writeInt32 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.buffer_.push(value >>> 0 & 255)
  this.buffer_.push(value >>> 8 & 255)
  this.buffer_.push(value >>> 16 & 255)
  this.buffer_.push(value >>> 24 & 255)
}
jspb.BinaryEncoder.prototype.writeInt64 = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_63 && value < jspb.BinaryConstants.TWO_TO_63)
  jspb.utils.splitInt64(value)
  this.writeSplitFixed64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeInt64String = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(+value >= -jspb.BinaryConstants.TWO_TO_63 && +value < jspb.BinaryConstants.TWO_TO_63)
  jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(value))
  this.writeSplitFixed64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeFloat = function (value) {
  goog.asserts.assert(value >= -jspb.BinaryConstants.FLOAT32_MAX && value <= jspb.BinaryConstants.FLOAT32_MAX)
  jspb.utils.splitFloat32(value)
  this.writeUint32(jspb.utils.split64Low)
}
jspb.BinaryEncoder.prototype.writeDouble = function (value) {
  goog.asserts.assert(value >= -jspb.BinaryConstants.FLOAT64_MAX && value <= jspb.BinaryConstants.FLOAT64_MAX)
  jspb.utils.splitFloat64(value)
  this.writeUint32(jspb.utils.split64Low)
  this.writeUint32(jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeBool = function (value) {
  goog.asserts.assert(goog.isBoolean(value) || goog.isNumber(value))
  this.buffer_.push(value ? 1 : 0)
}
jspb.BinaryEncoder.prototype.writeEnum = function (value) {
  goog.asserts.assert(value == Math.floor(value))
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.writeSignedVarint32(value)
}
jspb.BinaryEncoder.prototype.writeBytes = function (bytes) {
  this.buffer_.push.apply(this.buffer_, bytes)
}
jspb.BinaryEncoder.prototype.writeVarintHash64 = function (hash) {
  jspb.utils.splitHash64(hash)
  this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeFixedHash64 = function (hash) {
  jspb.utils.splitHash64(hash)
  this.writeUint32(jspb.utils.split64Low)
  this.writeUint32(jspb.utils.split64High)
}
jspb.BinaryEncoder.prototype.writeString = function (value) {
  var oldLength = this.buffer_.length
  for (var i = 0; i < value.length; i++) {
    var c = value.charCodeAt(i)
    if (c < 128) {
      this.buffer_.push(c)
    } else {
      if (c < 2048) {
        this.buffer_.push(c >> 6 | 192)
        this.buffer_.push(c & 63 | 128)
      } else {
        if (c < 65536) {
          if (c >= 55296 && c <= 56319 && i + 1 < value.length) {
            var second = value.charCodeAt(i + 1)
            if (second >= 56320 && second <= 57343) {
              c = (c - 55296) * 1024 + second - 56320 + 65536
              this.buffer_.push(c >> 18 | 240)
              this.buffer_.push(c >> 12 & 63 | 128)
              this.buffer_.push(c >> 6 & 63 | 128)
              this.buffer_.push(c & 63 | 128)
              i++
            }
          } else {
            this.buffer_.push(c >> 12 | 224)
            this.buffer_.push(c >> 6 & 63 | 128)
            this.buffer_.push(c & 63 | 128)
          }
        }
      }
    }
  }
  var length = this.buffer_.length - oldLength
  return length
}
goog.provide('jspb.arith.Int64')
goog.provide('jspb.arith.UInt64')
jspb.arith.UInt64 = function (lo, hi) {
  this.lo = lo
  this.hi = hi
}
jspb.arith.UInt64.prototype.cmp = function (other) {
  if (this.hi < other.hi || this.hi == other.hi && this.lo < other.lo) {
    return -1
  } else {
    if (this.hi == other.hi && this.lo == other.lo) {
      return 0
    } else {
      return 1
    }
  }
}
jspb.arith.UInt64.prototype.rightShift = function () {
  var hi = this.hi >>> 1
  var lo = this.lo >>> 1 | (this.hi & 1) << 31
  return new jspb.arith.UInt64(lo >>> 0, hi >>> 0)
}
jspb.arith.UInt64.prototype.leftShift = function () {
  var lo = this.lo << 1
  var hi = this.hi << 1 | this.lo >>> 31
  return new jspb.arith.UInt64(lo >>> 0, hi >>> 0)
}
jspb.arith.UInt64.prototype.msb = function () {
  return !!(this.hi & 2147483648)
}
jspb.arith.UInt64.prototype.lsb = function () {
  return !!(this.lo & 1)
}
jspb.arith.UInt64.prototype.zero = function () {
  return this.lo == 0 && this.hi == 0
}
jspb.arith.UInt64.prototype.add = function (other) {
  var lo = (this.lo + other.lo & 4294967295) >>> 0
  var hi = ((this.hi + other.hi & 4294967295) >>> 0) + (this.lo + other.lo >= 4294967296 ? 1 : 0)
  return new jspb.arith.UInt64(lo >>> 0, hi >>> 0)
}
jspb.arith.UInt64.prototype.sub = function (other) {
  var lo = (this.lo - other.lo & 4294967295) >>> 0
  var hi = ((this.hi - other.hi & 4294967295) >>> 0) - (this.lo - other.lo < 0 ? 1 : 0)
  return new jspb.arith.UInt64(lo >>> 0, hi >>> 0)
}
jspb.arith.UInt64.mul32x32 = function (a, b) {
  var aLow = a & 65535
  var aHigh = a >>> 16
  var bLow = b & 65535
  var bHigh = b >>> 16
  var productLow = aLow * bLow + (aLow * bHigh & 65535) * 65536 + (aHigh * bLow & 65535) * 65536
  var productHigh = aHigh * bHigh + (aLow * bHigh >>> 16) + (aHigh * bLow >>> 16)
  while (productLow >= 4294967296) {
    productLow -= 4294967296
    productHigh += 1
  }
  return new jspb.arith.UInt64(productLow >>> 0, productHigh >>> 0)
}
jspb.arith.UInt64.prototype.mul = function (a) {
  var lo = jspb.arith.UInt64.mul32x32(this.lo, a)
  var hi = jspb.arith.UInt64.mul32x32(this.hi, a)
  hi.hi = hi.lo
  hi.lo = 0
  return lo.add(hi)
}
jspb.arith.UInt64.prototype.div = function (_divisor) {
  if (_divisor == 0) {
    return []
  }
  var quotient = new jspb.arith.UInt64(0, 0)
  var remainder = new jspb.arith.UInt64(this.lo, this.hi)
  var divisor = new jspb.arith.UInt64(_divisor, 0)
  var unit = new jspb.arith.UInt64(1, 0)
  while (!divisor.msb()) {
    divisor = divisor.leftShift()
    unit = unit.leftShift()
  }
  while (!unit.zero()) {
    if (divisor.cmp(remainder) <= 0) {
      quotient = quotient.add(unit)
      remainder = remainder.sub(divisor)
    }
    divisor = divisor.rightShift()
    unit = unit.rightShift()
  }
  return [quotient, remainder]
}
jspb.arith.UInt64.prototype.toString = function () {
  var result = ''
  var num = this
  while (!num.zero()) {
    var divResult = num.div(10)
    var quotient = divResult[0], remainder = divResult[1]
    result = remainder.lo + result
    num = quotient
  }
  if (result == '') {
    result = '0'
  }
  return result
}
jspb.arith.UInt64.fromString = function (s) {
  var result = new jspb.arith.UInt64(0, 0)
  var digit64 = new jspb.arith.UInt64(0, 0)
  for (var i = 0; i < s.length; i++) {
    if (s[i] < '0' || s[i] > '9') {
      return null
    }
    var digit = parseInt(s[i], 10)
    digit64.lo = digit
    result = result.mul(10).add(digit64)
  }
  return result
}
jspb.arith.UInt64.prototype.clone = function () {
  return new jspb.arith.UInt64(this.lo, this.hi)
}
jspb.arith.Int64 = function (lo, hi) {
  this.lo = lo
  this.hi = hi
}
jspb.arith.Int64.prototype.add = function (other) {
  var lo = (this.lo + other.lo & 4294967295) >>> 0
  var hi = ((this.hi + other.hi & 4294967295) >>> 0) + (this.lo + other.lo >= 4294967296 ? 1 : 0)
  return new jspb.arith.Int64(lo >>> 0, hi >>> 0)
}
jspb.arith.Int64.prototype.sub = function (other) {
  var lo = (this.lo - other.lo & 4294967295) >>> 0
  var hi = ((this.hi - other.hi & 4294967295) >>> 0) - (this.lo - other.lo < 0 ? 1 : 0)
  return new jspb.arith.Int64(lo >>> 0, hi >>> 0)
}
jspb.arith.Int64.prototype.clone = function () {
  return new jspb.arith.Int64(this.lo, this.hi)
}
jspb.arith.Int64.prototype.toString = function () {
  var sign = (this.hi & 2147483648) != 0
  var num = new jspb.arith.UInt64(this.lo, this.hi)
  if (sign) {
    num = (new jspb.arith.UInt64(0, 0)).sub(num)
  }
  return (sign ? '-' : '') + num.toString()
}
jspb.arith.Int64.fromString = function (s) {
  var hasNegative = s.length > 0 && s[0] == '-'
  if (hasNegative) {
    s = s.substring(1)
  }
  var num = jspb.arith.UInt64.fromString(s)
  if (num === null) {
    return null
  }
  if (hasNegative) {
    num = (new jspb.arith.UInt64(0, 0)).sub(num)
  }
  return new jspb.arith.Int64(num.lo, num.hi)
}
goog.provide('jspb.BinaryWriter')
goog.require('goog.asserts')
goog.require('goog.crypt.base64')
goog.require('jspb.BinaryConstants')
goog.require('jspb.BinaryEncoder')
goog.require('jspb.arith.Int64')
goog.require('jspb.arith.UInt64')
goog.require('jspb.utils')
jspb.BinaryWriter = function () {
  this.blocks_ = []
  this.totalLength_ = 0
  this.encoder_ = new jspb.BinaryEncoder()
  this.bookmarks_ = []
}
jspb.BinaryWriter.prototype.appendUint8Array_ = function (arr) {
  var temp = this.encoder_.end()
  this.blocks_.push(temp)
  this.blocks_.push(arr)
  this.totalLength_ += temp.length + arr.length
}
jspb.BinaryWriter.prototype.beginDelimited_ = function (field) {
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  var bookmark = this.encoder_.end()
  this.blocks_.push(bookmark)
  this.totalLength_ += bookmark.length
  bookmark.push(this.totalLength_)
  return bookmark
}
jspb.BinaryWriter.prototype.endDelimited_ = function (bookmark) {
  var oldLength = bookmark.pop()
  var messageLength = this.totalLength_ + this.encoder_.length() - oldLength
  goog.asserts.assert(messageLength >= 0)
  while (messageLength > 127) {
    bookmark.push(messageLength & 127 | 128)
    messageLength = messageLength >>> 7
    this.totalLength_++
  }
  bookmark.push(messageLength)
  this.totalLength_++
}
jspb.BinaryWriter.prototype.writeSerializedMessage = function (bytes, start, end) {
  this.appendUint8Array_(bytes.subarray(start, end))
}
jspb.BinaryWriter.prototype.maybeWriteSerializedMessage = function (bytes, start, end) {
  if (bytes != null && start != null && end != null) {
    this.writeSerializedMessage(bytes, start, end)
  }
}
jspb.BinaryWriter.prototype.reset = function () {
  this.blocks_ = []
  this.encoder_.end()
  this.totalLength_ = 0
  this.bookmarks_ = []
}
jspb.BinaryWriter.prototype.getResultBuffer = function () {
  goog.asserts.assert(this.bookmarks_.length == 0)
  var flat = new Uint8Array(this.totalLength_ + this.encoder_.length())
  var blocks = this.blocks_
  var blockCount = blocks.length
  var offset = 0
  for (var i = 0; i < blockCount; i++) {
    var block = blocks[i]
    flat.set(block, offset)
    offset += block.length
  }
  var tail = this.encoder_.end()
  flat.set(tail, offset)
  offset += tail.length
  goog.asserts.assert(offset == flat.length)
  this.blocks_ = [flat]
  return flat
}
jspb.BinaryWriter.prototype.getResultBase64String = function () {
  return goog.crypt.base64.encodeByteArray(this.getResultBuffer())
}
jspb.BinaryWriter.prototype.beginSubMessage = function (field) {
  this.bookmarks_.push(this.beginDelimited_(field))
}
jspb.BinaryWriter.prototype.endSubMessage = function () {
  goog.asserts.assert(this.bookmarks_.length >= 0)
  this.endDelimited_(this.bookmarks_.pop())
}
jspb.BinaryWriter.prototype.writeFieldHeader_ = function (field, wireType) {
  goog.asserts.assert(field >= 1 && field == Math.floor(field))
  var x = field * 8 + wireType
  this.encoder_.writeUnsignedVarint32(x)
}
jspb.BinaryWriter.prototype.writeAny = function (fieldType, field, value) {
  var fieldTypes = jspb.BinaryConstants.FieldType
  switch (fieldType) {
    case fieldTypes.DOUBLE:
      this.writeDouble(field, value)
      return
    case fieldTypes.FLOAT:
      this.writeFloat(field, value)
      return
    case fieldTypes.INT64:
      this.writeInt64(field, value)
      return
    case fieldTypes.UINT64:
      this.writeUint64(field, value)
      return
    case fieldTypes.INT32:
      this.writeInt32(field, value)
      return
    case fieldTypes.FIXED64:
      this.writeFixed64(field, value)
      return
    case fieldTypes.FIXED32:
      this.writeFixed32(field, value)
      return
    case fieldTypes.BOOL:
      this.writeBool(field, value)
      return
    case fieldTypes.STRING:
      this.writeString(field, value)
      return
    case fieldTypes.GROUP:
      goog.asserts.fail('Group field type not supported in writeAny()')
      return
    case fieldTypes.MESSAGE:
      goog.asserts.fail('Message field type not supported in writeAny()')
      return
    case fieldTypes.BYTES:
      this.writeBytes(field, value)
      return
    case fieldTypes.UINT32:
      this.writeUint32(field, value)
      return
    case fieldTypes.ENUM:
      this.writeEnum(field, value)
      return
    case fieldTypes.SFIXED32:
      this.writeSfixed32(field, value)
      return
    case fieldTypes.SFIXED64:
      this.writeSfixed64(field, value)
      return
    case fieldTypes.SINT32:
      this.writeSint32(field, value)
      return
    case fieldTypes.SINT64:
      this.writeSint64(field, value)
      return
    case fieldTypes.FHASH64:
      this.writeFixedHash64(field, value)
      return
    case fieldTypes.VHASH64:
      this.writeVarintHash64(field, value)
      return
    default:
      goog.asserts.fail('Invalid field type in writeAny()')
  }
}
jspb.BinaryWriter.prototype.writeUnsignedVarint32_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeUnsignedVarint32(value)
}
jspb.BinaryWriter.prototype.writeSignedVarint32_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeSignedVarint32(value)
}
jspb.BinaryWriter.prototype.writeUnsignedVarint64_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeUnsignedVarint64(value)
}
jspb.BinaryWriter.prototype.writeSignedVarint64_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeSignedVarint64(value)
}
jspb.BinaryWriter.prototype.writeZigzagVarint32_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeZigzagVarint32(value)
}
jspb.BinaryWriter.prototype.writeZigzagVarint64_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeZigzagVarint64(value)
}
jspb.BinaryWriter.prototype.writeZigzagVarint64String_ = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeZigzagVarint64String(value)
}
jspb.BinaryWriter.prototype.writeInt32 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.writeSignedVarint32_(field, value)
}
jspb.BinaryWriter.prototype.writeInt32String = function (field, value) {
  if (value == null) {
    return
  }
  var intValue = parseInt(value, 10)
  goog.asserts.assert(intValue >= -jspb.BinaryConstants.TWO_TO_31 && intValue < jspb.BinaryConstants.TWO_TO_31)
  this.writeSignedVarint32_(field, intValue)
}
jspb.BinaryWriter.prototype.writeInt64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_63 && value < jspb.BinaryConstants.TWO_TO_63)
  this.writeSignedVarint64_(field, value)
}
jspb.BinaryWriter.prototype.writeInt64String = function (field, value) {
  if (value == null) {
    return
  }
  var num = jspb.arith.Int64.fromString(value)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeSplitVarint64(num.lo, num.hi)
}
jspb.BinaryWriter.prototype.writeUint32 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_32)
  this.writeUnsignedVarint32_(field, value)
}
jspb.BinaryWriter.prototype.writeUint32String = function (field, value) {
  if (value == null) {
    return
  }
  var intValue = parseInt(value, 10)
  goog.asserts.assert(intValue >= 0 && intValue < jspb.BinaryConstants.TWO_TO_32)
  this.writeUnsignedVarint32_(field, intValue)
}
jspb.BinaryWriter.prototype.writeUint64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_64)
  this.writeUnsignedVarint64_(field, value)
}
jspb.BinaryWriter.prototype.writeUint64String = function (field, value) {
  if (value == null) {
    return
  }
  var num = jspb.arith.UInt64.fromString(value)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeSplitVarint64(num.lo, num.hi)
}
jspb.BinaryWriter.prototype.writeSint32 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.writeZigzagVarint32_(field, value)
}
jspb.BinaryWriter.prototype.writeSint64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_63 && value < jspb.BinaryConstants.TWO_TO_63)
  this.writeZigzagVarint64_(field, value)
}
jspb.BinaryWriter.prototype.writeSint64String = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(+value >= -jspb.BinaryConstants.TWO_TO_63 && +value < jspb.BinaryConstants.TWO_TO_63)
  this.writeZigzagVarint64String_(field, value)
}
jspb.BinaryWriter.prototype.writeFixed32 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_32)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED32)
  this.encoder_.writeUint32(value)
}
jspb.BinaryWriter.prototype.writeFixed64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= 0 && value < jspb.BinaryConstants.TWO_TO_64)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED64)
  this.encoder_.writeUint64(value)
}
jspb.BinaryWriter.prototype.writeFixed64String = function (field, value) {
  if (value == null) {
    return
  }
  var num = jspb.arith.UInt64.fromString(value)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED64)
  this.encoder_.writeSplitFixed64(num.lo, num.hi)
}
jspb.BinaryWriter.prototype.writeSfixed32 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED32)
  this.encoder_.writeInt32(value)
}
jspb.BinaryWriter.prototype.writeSfixed64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_63 && value < jspb.BinaryConstants.TWO_TO_63)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED64)
  this.encoder_.writeInt64(value)
}
jspb.BinaryWriter.prototype.writeSfixed64String = function (field, value) {
  if (value == null) {
    return
  }
  var num = jspb.arith.Int64.fromString(value)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED64)
  this.encoder_.writeSplitFixed64(num.lo, num.hi)
}
jspb.BinaryWriter.prototype.writeFloat = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED32)
  this.encoder_.writeFloat(value)
}
jspb.BinaryWriter.prototype.writeDouble = function (field, value) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED64)
  this.encoder_.writeDouble(value)
}
jspb.BinaryWriter.prototype.writeBool = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(goog.isBoolean(value) || goog.isNumber(value))
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeBool(value)
}
jspb.BinaryWriter.prototype.writeEnum = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value >= -jspb.BinaryConstants.TWO_TO_31 && value < jspb.BinaryConstants.TWO_TO_31)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeSignedVarint32(value)
}
jspb.BinaryWriter.prototype.writeString = function (field, value) {
  if (value == null) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  this.encoder_.writeString(value)
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writeBytes = function (field, value) {
  if (value == null) {
    return
  }
  var bytes = jspb.utils.byteSourceToUint8Array(value)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(bytes.length)
  this.appendUint8Array_(bytes)
}
jspb.BinaryWriter.prototype.writeMessage = function (field, value, writerCallback) {
  if (value == null) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  writerCallback(value, this)
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writeGroup = function (field, value, writerCallback) {
  if (value == null) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.START_GROUP)
  writerCallback(value, this)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.END_GROUP)
}
jspb.BinaryWriter.prototype.writeFixedHash64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value.length == 8)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.FIXED64)
  this.encoder_.writeFixedHash64(value)
}
jspb.BinaryWriter.prototype.writeVarintHash64 = function (field, value) {
  if (value == null) {
    return
  }
  goog.asserts.assert(value.length == 8)
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.VARINT)
  this.encoder_.writeVarintHash64(value)
}
jspb.BinaryWriter.prototype.writeRepeatedInt32 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeSignedVarint32_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedInt32String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeInt32String(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedInt64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeSignedVarint64_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedInt64String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeInt64String(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedUint32 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeUnsignedVarint32_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedUint32String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeUint32String(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedUint64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeUnsignedVarint64_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedUint64String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeUint64String(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedSint32 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeZigzagVarint32_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedSint64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeZigzagVarint64_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedSint64String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeZigzagVarint64String_(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedFixed32 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeFixed32(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedFixed64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeFixed64(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedFixed64String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeFixed64String(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedSfixed32 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeSfixed32(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedSfixed64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeSfixed64(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedSfixed64String = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeSfixed64String(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedFloat = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeFloat(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedDouble = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeDouble(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedBool = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeBool(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedEnum = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeEnum(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedString = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeString(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedBytes = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeBytes(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedMessage = function (field, value, writerCallback) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    var bookmark = this.beginDelimited_(field)
    writerCallback(value[i], this)
    this.endDelimited_(bookmark)
  }
}
jspb.BinaryWriter.prototype.writeRepeatedGroup = function (field, value, writerCallback) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.START_GROUP)
    writerCallback(value[i], this)
    this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.END_GROUP)
  }
}
jspb.BinaryWriter.prototype.writeRepeatedFixedHash64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeFixedHash64(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writeRepeatedVarintHash64 = function (field, value) {
  if (value == null) {
    return
  }
  for (var i = 0; i < value.length; i++) {
    this.writeVarintHash64(field, value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedInt32 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeSignedVarint32(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedInt32String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeSignedVarint32(parseInt(value[i], 10))
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedInt64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeSignedVarint64(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedInt64String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    var num = jspb.arith.Int64.fromString(value[i])
    this.encoder_.writeSplitVarint64(num.lo, num.hi)
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedUint32 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeUnsignedVarint32(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedUint32String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeUnsignedVarint32(parseInt(value[i], 10))
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedUint64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeUnsignedVarint64(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedUint64String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    var num = jspb.arith.UInt64.fromString(value[i])
    this.encoder_.writeSplitVarint64(num.lo, num.hi)
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedSint32 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeZigzagVarint32(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedSint64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeZigzagVarint64(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedSint64String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeZigzagVarint64(parseInt(value[i], 10))
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedFixed32 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 4)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeUint32(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedFixed64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 8)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeUint64(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedFixed64String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 8)
  for (var i = 0; i < value.length; i++) {
    var num = jspb.arith.UInt64.fromString(value[i])
    this.encoder_.writeSplitFixed64(num.lo, num.hi)
  }
}
jspb.BinaryWriter.prototype.writePackedSfixed32 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 4)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeInt32(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedSfixed64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 8)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeInt64(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedSfixed64String = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 8)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeInt64String(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedFloat = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 4)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeFloat(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedDouble = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 8)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeDouble(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedBool = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeBool(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedEnum = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeEnum(value[i])
  }
  this.endDelimited_(bookmark)
}
jspb.BinaryWriter.prototype.writePackedFixedHash64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  this.writeFieldHeader_(field, jspb.BinaryConstants.WireType.DELIMITED)
  this.encoder_.writeUnsignedVarint32(value.length * 8)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeFixedHash64(value[i])
  }
}
jspb.BinaryWriter.prototype.writePackedVarintHash64 = function (field, value) {
  if (value == null || !value.length) {
    return
  }
  var bookmark = this.beginDelimited_(field)
  for (var i = 0; i < value.length; i++) {
    this.encoder_.writeVarintHash64(value[i])
  }
  this.endDelimited_(bookmark)
}
goog.provide('jspb.Map')
goog.require('goog.asserts')
goog.forwardDeclare('jspb.BinaryReader')
goog.forwardDeclare('jspb.BinaryWriter')
jspb.Map = function (arr, opt_valueCtor) {
  this.arr_ = arr
  this.valueCtor_ = opt_valueCtor
  this.map_ = {}
  this.arrClean = true
  if (this.arr_.length > 0) {
    this.loadFromArray_()
  }
}
jspb.Map.prototype.loadFromArray_ = function () {
  for (var i = 0; i < this.arr_.length; i++) {
    var record = this.arr_[i]
    var key = record[0]
    var value = record[1]
    this.map_[key.toString()] = new jspb.Map.Entry_(key, value)
  }
  this.arrClean = true
}
jspb.Map.prototype.toArray = function () {
  if (this.arrClean) {
    if (this.valueCtor_) {
      var m = this.map_
      for (var p in m) {
        if (Object.prototype.hasOwnProperty.call(m, p)) {
          var valueWrapper = m[p].valueWrapper
          if (valueWrapper) {
            valueWrapper.toArray()
          }
        }
      }
    }
  } else {
    this.arr_.length = 0
    var strKeys = this.stringKeys_()
    strKeys.sort()
    for (var i = 0; i < strKeys.length; i++) {
      var entry = this.map_[strKeys[i]]
      var valueWrapper = entry.valueWrapper
      if (valueWrapper) {
        valueWrapper.toArray()
      }
      this.arr_.push([entry.key, entry.value])
    }
    this.arrClean = true
  }
  return this.arr_
}
jspb.Map.prototype.toObject = function (includeInstance, valueToObject) {
  var rawArray = this.toArray()
  var entries = []
  for (var i = 0; i < rawArray.length; i++) {
    var entry = this.map_[rawArray[i][0].toString()]
    this.wrapEntry_(entry)
    var valueWrapper = entry.valueWrapper
    if (valueWrapper) {
      goog.asserts.assert(valueToObject)
      entries.push([entry.key, valueToObject(includeInstance, valueWrapper)])
    } else {
      entries.push([entry.key, entry.value])
    }
  }
  return entries
}
jspb.Map.fromObject = function (entries, valueCtor, valueFromObject) {
  var result = new jspb.Map([], valueCtor)
  for (var i = 0; i < entries.length; i++) {
    var key = entries[i][0]
    var value = valueFromObject(entries[i][1])
    result.set(key, value)
  }
  return result
}
jspb.Map.ArrayIteratorIterable_ = function (arr) {
  this.idx_ = 0
  this.arr_ = arr
}
jspb.Map.ArrayIteratorIterable_.prototype.next = function () {
  if (this.idx_ < this.arr_.length) {
    return {done: false, value: this.arr_[this.idx_++]}
  } else {
    return {done: true, value: undefined}
  }
}
if (typeof Symbol !== 'undefined') {
  jspb.Map.ArrayIteratorIterable_.prototype[Symbol.iterator] = function () {
    return this
  }
}
jspb.Map.prototype.getLength = function () {
  return this.stringKeys_().length
}
jspb.Map.prototype.clear = function () {
  this.map_ = {}
  this.arrClean = false
}
jspb.Map.prototype.del = function (key) {
  var keyValue = key.toString()
  var hadKey = this.map_.hasOwnProperty(keyValue)
  delete this.map_[keyValue]
  this.arrClean = false
  return hadKey
}
jspb.Map.prototype.getEntryList = function () {
  var entries = []
  var strKeys = this.stringKeys_()
  strKeys.sort()
  for (var i = 0; i < strKeys.length; i++) {
    var entry = this.map_[strKeys[i]]
    entries.push([entry.key, entry.value])
  }
  return entries
}
jspb.Map.prototype.entries = function () {
  var entries = []
  var strKeys = this.stringKeys_()
  strKeys.sort()
  for (var i = 0; i < strKeys.length; i++) {
    var entry = this.map_[strKeys[i]]
    entries.push([entry.key, this.wrapEntry_(entry)])
  }
  return new jspb.Map.ArrayIteratorIterable_(entries)
}
jspb.Map.prototype.keys = function () {
  var keys = []
  var strKeys = this.stringKeys_()
  strKeys.sort()
  for (var i = 0; i < strKeys.length; i++) {
    var entry = this.map_[strKeys[i]]
    keys.push(entry.key)
  }
  return new jspb.Map.ArrayIteratorIterable_(keys)
}
jspb.Map.prototype.values = function () {
  var values = []
  var strKeys = this.stringKeys_()
  strKeys.sort()
  for (var i = 0; i < strKeys.length; i++) {
    var entry = this.map_[strKeys[i]]
    values.push(this.wrapEntry_(entry))
  }
  return new jspb.Map.ArrayIteratorIterable_(values)
}
jspb.Map.prototype.forEach = function (cb, opt_thisArg) {
  var strKeys = this.stringKeys_()
  strKeys.sort()
  for (var i = 0; i < strKeys.length; i++) {
    var entry = this.map_[strKeys[i]]
    cb.call(opt_thisArg, this.wrapEntry_(entry), entry.key, this)
  }
}
jspb.Map.prototype.set = function (key, value) {
  var entry = new jspb.Map.Entry_(key)
  if (this.valueCtor_) {
    entry.valueWrapper = value
    entry.value = value.toArray()
  } else {
    entry.value = value
  }
  this.map_[key.toString()] = entry
  this.arrClean = false
  return this
}
jspb.Map.prototype.wrapEntry_ = function (entry) {
  if (this.valueCtor_) {
    if (!entry.valueWrapper) {
      entry.valueWrapper = new this.valueCtor_(entry.value)
    }
    return entry.valueWrapper
  } else {
    return entry.value
  }
}
jspb.Map.prototype.get = function (key) {
  var keyValue = key.toString()
  var entry = this.map_[keyValue]
  if (entry) {
    return this.wrapEntry_(entry)
  } else {
    return undefined
  }
}
jspb.Map.prototype.has = function (key) {
  var keyValue = key.toString()
  return keyValue in this.map_
}
jspb.Map.prototype.serializeBinary = function (fieldNumber, writer, keyWriterFn, valueWriterFn, opt_valueWriterCallback) {
  var strKeys = this.stringKeys_()
  strKeys.sort()
  for (var i = 0; i < strKeys.length; i++) {
    var entry = this.map_[strKeys[i]]
    writer.beginSubMessage(fieldNumber)
    keyWriterFn.call(writer, 1, entry.key)
    if (this.valueCtor_) {
      valueWriterFn.call(writer, 2, this.wrapEntry_(entry), opt_valueWriterCallback)
    } else {
      valueWriterFn.call(writer, 2, entry.value)
    }
    writer.endSubMessage()
  }
}
jspb.Map.deserializeBinary = function (map, reader, keyReaderFn, valueReaderFn, opt_valueReaderCallback) {
  var key = undefined
  var value = undefined
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    if (field == 1) {
      key = keyReaderFn.call(reader)
    } else {
      if (field == 2) {
        if (map.valueCtor_) {
          value = new map.valueCtor_()
          valueReaderFn.call(reader, value, opt_valueReaderCallback)
        } else {
          value = valueReaderFn.call(reader)
        }
      }
    }
  }
  goog.asserts.assert(key != undefined)
  goog.asserts.assert(value != undefined)
  map.set(key, value)
}
jspb.Map.prototype.stringKeys_ = function () {
  var m = this.map_
  var ret = []
  for (var p in m) {
    if (Object.prototype.hasOwnProperty.call(m, p)) {
      ret.push(p)
    }
  }
  return ret
}
jspb.Map.Entry_ = function (key, opt_value) {
  this.key = key
  this.value = opt_value
  this.valueWrapper = undefined
}
goog.provide('jspb.ExtensionFieldBinaryInfo')
goog.provide('jspb.ExtensionFieldInfo')
goog.provide('jspb.Message')
goog.require('goog.array')
goog.require('goog.asserts')
goog.require('goog.crypt.base64')
goog.require('jspb.Map')
goog.forwardDeclare('xid.String')
jspb.ExtensionFieldInfo = function (fieldNumber, fieldName, ctor, toObjectFn, isRepeated) {
  this.fieldIndex = fieldNumber
  this.fieldName = fieldName
  this.ctor = ctor
  this.toObjectFn = toObjectFn
  this.isRepeated = isRepeated
}
jspb.ExtensionFieldBinaryInfo = function (fieldInfo, binaryReaderFn, binaryWriterFn, opt_binaryMessageSerializeFn, opt_binaryMessageDeserializeFn, opt_isPacked) {
  this.fieldInfo = fieldInfo
  this.binaryReaderFn = binaryReaderFn
  this.binaryWriterFn = binaryWriterFn
  this.binaryMessageSerializeFn = opt_binaryMessageSerializeFn
  this.binaryMessageDeserializeFn = opt_binaryMessageDeserializeFn
  this.isPacked = opt_isPacked
}
jspb.ExtensionFieldInfo.prototype.isMessageType = function () {
  return !!this.ctor
}
jspb.Message = function () {
}
goog.define('jspb.Message.GENERATE_TO_OBJECT', true)
goog.define('jspb.Message.GENERATE_FROM_OBJECT', !goog.DISALLOW_TEST_ONLY_CODE)
goog.define('jspb.Message.GENERATE_TO_STRING', true)
goog.define('jspb.Message.ASSUME_LOCAL_ARRAYS', false)
goog.define('jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS', COMPILED)
jspb.Message.SUPPORTS_UINT8ARRAY_ = typeof Uint8Array === 'function'
jspb.Message.prototype.array
jspb.Message.prototype.wrappers_
jspb.Message.prototype.extensionObject_
jspb.Message.prototype.pivot_
jspb.Message.prototype.messageId_
jspb.Message.prototype.convertedFloatingPointFields_
jspb.Message.prototype.messageXid
jspb.Message.prototype.getJsPbMessageId = function () {
  return this.messageId_
}
jspb.Message.prototype.arrayIndexOffset_
jspb.Message.getIndex_ = function (msg, fieldNumber) {
  return fieldNumber + msg.arrayIndexOffset_
}
jspb.Message.initialize = function (msg, data, messageId, suggestedPivot, repeatedFields, opt_oneofFields) {
  msg.wrappers_ = jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS ? null : {}
  if (!data) {
    data = messageId ? [messageId] : []
  }
  msg.messageId_ = messageId ? String(messageId) : undefined
  msg.arrayIndexOffset_ = messageId === 0 ? -1 : 0
  msg.array = data
  jspb.Message.initPivotAndExtensionObject_(msg, suggestedPivot)
  msg.convertedFloatingPointFields_ = {}
  if (repeatedFields) {
    for (var i = 0; i < repeatedFields.length; i++) {
      var fieldNumber = repeatedFields[i]
      if (fieldNumber < msg.pivot_) {
        var index = jspb.Message.getIndex_(msg, fieldNumber)
        msg.array[index] = msg.array[index] || (jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS ? jspb.Message.EMPTY_LIST_SENTINEL_ : [])
      } else {
        jspb.Message.maybeInitEmptyExtensionObject_(msg)
        msg.extensionObject_[fieldNumber] = msg.extensionObject_[fieldNumber] || (jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS ? jspb.Message.EMPTY_LIST_SENTINEL_ : [])
      }
    }
  }
  if (opt_oneofFields && opt_oneofFields.length) {
    goog.array.forEach(opt_oneofFields, goog.partial(jspb.Message.computeOneofCase, msg))
  }
}
jspb.Message.EMPTY_LIST_SENTINEL_ = goog.DEBUG && Object.freeze ? Object.freeze([]) : []
jspb.Message.isArray_ = function (o) {
  return jspb.Message.ASSUME_LOCAL_ARRAYS ? o instanceof Array : goog.isArray(o)
}
jspb.Message.initPivotAndExtensionObject_ = function (msg, suggestedPivot) {
  if (msg.array.length) {
    var foundIndex = msg.array.length - 1
    var obj = msg.array[foundIndex]
    if (obj && typeof obj === 'object' && !jspb.Message.isArray_(obj) && !(jspb.Message.SUPPORTS_UINT8ARRAY_ && obj instanceof Uint8Array)) {
      msg.pivot_ = foundIndex - msg.arrayIndexOffset_
      msg.extensionObject_ = obj
      return
    }
  }
  if (suggestedPivot > -1) {
    msg.pivot_ = suggestedPivot
    msg.extensionObject_ = null
  } else {
    msg.pivot_ = Number.MAX_VALUE
  }
}
jspb.Message.maybeInitEmptyExtensionObject_ = function (msg) {
  var pivotIndex = jspb.Message.getIndex_(msg, msg.pivot_)
  if (!msg.array[pivotIndex]) {
    msg.extensionObject_ = msg.array[pivotIndex] = {}
  }
}
jspb.Message.toObjectList = function (field, toObjectFn, opt_includeInstance) {
  var result = []
  for (var i = 0; i < field.length; i++) {
    result[i] = toObjectFn.call(field[i], opt_includeInstance, field[i])
  }
  return result
}
jspb.Message.toObjectExtension = function (proto, obj, extensions, getExtensionFn, opt_includeInstance) {
  for (var fieldNumber in extensions) {
    var fieldInfo = extensions[fieldNumber]
    var value = getExtensionFn.call(proto, fieldInfo)
    if (value != null) {
      for (var name in fieldInfo.fieldName) {
        if (fieldInfo.fieldName.hasOwnProperty(name)) {
          break
        }
      }
      if (!fieldInfo.toObjectFn) {
        obj[name] = value
      } else {
        if (fieldInfo.isRepeated) {
          obj[name] = jspb.Message.toObjectList(value, fieldInfo.toObjectFn, opt_includeInstance)
        } else {
          obj[name] = fieldInfo.toObjectFn(opt_includeInstance, value)
        }
      }
    }
  }
}
jspb.Message.serializeBinaryExtensions = function (proto, writer, extensions, getExtensionFn) {
  for (var fieldNumber in extensions) {
    var binaryFieldInfo = extensions[fieldNumber]
    var fieldInfo = binaryFieldInfo.fieldInfo
    if (!binaryFieldInfo.binaryWriterFn) {
      throw new Error('Message extension present that was generated ' + 'without binary serialization support')
    }
    var value = getExtensionFn.call(proto, fieldInfo)
    if (value != null) {
      if (fieldInfo.isMessageType()) {
        if (binaryFieldInfo.binaryMessageSerializeFn) {
          binaryFieldInfo.binaryWriterFn.call(writer, fieldInfo.fieldIndex, value, binaryFieldInfo.binaryMessageSerializeFn)
        } else {
          throw new Error('Message extension present holding submessage ' + 'without binary support enabled, and message is ' + 'being serialized to binary format')
        }
      } else {
        binaryFieldInfo.binaryWriterFn.call(writer, fieldInfo.fieldIndex, value)
      }
    }
  }
}
jspb.Message.readBinaryExtension = function (msg, reader, extensions, getExtensionFn, setExtensionFn) {
  var binaryFieldInfo = extensions[reader.getFieldNumber()]
  if (!binaryFieldInfo) {
    reader.skipField()
    return
  }
  var fieldInfo = binaryFieldInfo.fieldInfo
  if (!binaryFieldInfo.binaryReaderFn) {
    throw new Error('Deserializing extension whose generated code does not ' + 'support binary format')
  }
  var value
  if (fieldInfo.isMessageType()) {
    value = new fieldInfo.ctor()
    binaryFieldInfo.binaryReaderFn.call(reader, value, binaryFieldInfo.binaryMessageDeserializeFn)
  } else {
    value = binaryFieldInfo.binaryReaderFn.call(reader)
  }
  if (fieldInfo.isRepeated && !binaryFieldInfo.isPacked) {
    var currentList = getExtensionFn.call(msg, fieldInfo)
    if (!currentList) {
      setExtensionFn.call(msg, fieldInfo, [value])
    } else {
      currentList.push(value)
    }
  } else {
    setExtensionFn.call(msg, fieldInfo, value)
  }
}
jspb.Message.getField = function (msg, fieldNumber) {
  if (fieldNumber < msg.pivot_) {
    var index = jspb.Message.getIndex_(msg, fieldNumber)
    var val = msg.array[index]
    if (val === jspb.Message.EMPTY_LIST_SENTINEL_) {
      return msg.array[index] = []
    }
    return val
  } else {
    if (!msg.extensionObject_) {
      return undefined
    }
    var val = msg.extensionObject_[fieldNumber]
    if (val === jspb.Message.EMPTY_LIST_SENTINEL_) {
      return msg.extensionObject_[fieldNumber] = []
    }
    return val
  }
}
jspb.Message.getRepeatedField = function (msg, fieldNumber) {
  if (fieldNumber < msg.pivot_) {
    var index = jspb.Message.getIndex_(msg, fieldNumber)
    var val = msg.array[index]
    if (val === jspb.Message.EMPTY_LIST_SENTINEL_) {
      return msg.array[index] = []
    }
    return val
  }
  var val = msg.extensionObject_[fieldNumber]
  if (val === jspb.Message.EMPTY_LIST_SENTINEL_) {
    return msg.extensionObject_[fieldNumber] = []
  }
  return val
}
jspb.Message.getOptionalFloatingPointField = function (msg, fieldNumber) {
  var value = jspb.Message.getField(msg, fieldNumber)
  return value == null ? value : +value
}
jspb.Message.getRepeatedFloatingPointField = function (msg, fieldNumber) {
  var values = jspb.Message.getRepeatedField(msg, fieldNumber)
  if (!msg.convertedFloatingPointFields_) {
    msg.convertedFloatingPointFields_ = {}
  }
  if (!msg.convertedFloatingPointFields_[fieldNumber]) {
    for (var i = 0; i < values.length; i++) {
      values[i] = +values[i]
    }
    msg.convertedFloatingPointFields_[fieldNumber] = true
  }
  return values
}
jspb.Message.bytesAsB64 = function (value) {
  if (value == null || goog.isString(value)) {
    return value
  }
  if (jspb.Message.SUPPORTS_UINT8ARRAY_ && value instanceof Uint8Array) {
    return goog.crypt.base64.encodeByteArray(value)
  }
  goog.asserts.fail('Cannot coerce to b64 string: ' + goog.typeOf(value))
  return null
}
jspb.Message.bytesAsU8 = function (value) {
  if (value == null || value instanceof Uint8Array) {
    return value
  }
  if (goog.isString(value)) {
    return goog.crypt.base64.decodeStringToUint8Array(value)
  }
  goog.asserts.fail('Cannot coerce to Uint8Array: ' + goog.typeOf(value))
  return null
}
jspb.Message.bytesListAsB64 = function (value) {
  jspb.Message.assertConsistentTypes_(value)
  if (!value.length || goog.isString(value[0])) {
    return value
  }
  return goog.array.map(value, jspb.Message.bytesAsB64)
}
jspb.Message.bytesListAsU8 = function (value) {
  jspb.Message.assertConsistentTypes_(value)
  if (!value.length || value[0] instanceof Uint8Array) {
    return value
  }
  return goog.array.map(value, jspb.Message.bytesAsU8)
}
jspb.Message.assertConsistentTypes_ = function (array) {
  if (goog.DEBUG && array && array.length > 1) {
    var expected = goog.typeOf(array[0])
    goog.array.forEach(array, function (e) {
      if (goog.typeOf(e) != expected) {
        goog.asserts.fail('Inconsistent type in JSPB repeated field array. ' + 'Got ' + goog.typeOf(e) + ' expected ' + expected)
      }
    })
  }
}
jspb.Message.getFieldWithDefault = function (msg, fieldNumber, defaultValue) {
  var value = jspb.Message.getField(msg, fieldNumber)
  if (value == null) {
    return defaultValue
  } else {
    return value
  }
}
jspb.Message.getFieldProto3 = jspb.Message.getFieldWithDefault
jspb.Message.getMapField = function (msg, fieldNumber, noLazyCreate, opt_valueCtor) {
  if (!msg.wrappers_) {
    msg.wrappers_ = {}
  }
  if (fieldNumber in msg.wrappers_) {
    return msg.wrappers_[fieldNumber]
  } else {
    if (noLazyCreate) {
      return undefined
    } else {
      var arr = jspb.Message.getField(msg, fieldNumber)
      if (!arr) {
        arr = []
        jspb.Message.setField(msg, fieldNumber, arr)
      }
      return msg.wrappers_[fieldNumber] = new jspb.Map(arr, opt_valueCtor)
    }
  }
}
jspb.Message.setField = function (msg, fieldNumber, value) {
  if (fieldNumber < msg.pivot_) {
    msg.array[jspb.Message.getIndex_(msg, fieldNumber)] = value
  } else {
    jspb.Message.maybeInitEmptyExtensionObject_(msg)
    msg.extensionObject_[fieldNumber] = value
  }
}
jspb.Message.setProto3IntField = function (msg, fieldNumber, value) {
  jspb.Message.setFieldIgnoringDefault_(msg, fieldNumber, value, 0)
}
jspb.Message.setProto3FloatField = function (msg, fieldNumber, value) {
  jspb.Message.setFieldIgnoringDefault_(msg, fieldNumber, value, 0.0)
}
jspb.Message.setProto3BooleanField = function (msg, fieldNumber, value) {
  jspb.Message.setFieldIgnoringDefault_(msg, fieldNumber, value, false)
}
jspb.Message.setProto3StringField = function (msg, fieldNumber, value) {
  jspb.Message.setFieldIgnoringDefault_(msg, fieldNumber, value, '')
}
jspb.Message.setProto3BytesField = function (msg, fieldNumber, value) {
  jspb.Message.setFieldIgnoringDefault_(msg, fieldNumber, value, '')
}
jspb.Message.setProto3EnumField = function (msg, fieldNumber, value) {
  jspb.Message.setFieldIgnoringDefault_(msg, fieldNumber, value, 0)
}
jspb.Message.setFieldIgnoringDefault_ = function (msg, fieldNumber, value, defaultValue) {
  if (value != defaultValue) {
    jspb.Message.setField(msg, fieldNumber, value)
  } else {
    msg.array[jspb.Message.getIndex_(msg, fieldNumber)] = null
  }
}
jspb.Message.addToRepeatedField = function (msg, fieldNumber, value, opt_index) {
  var arr = jspb.Message.getRepeatedField(msg, fieldNumber)
  if (opt_index != undefined) {
    arr.splice(opt_index, 0, value)
  } else {
    arr.push(value)
  }
}
jspb.Message.setOneofField = function (msg, fieldNumber, oneof, value) {
  var currentCase = jspb.Message.computeOneofCase(msg, oneof)
  if (currentCase && currentCase !== fieldNumber && value !== undefined) {
    if (msg.wrappers_ && currentCase in msg.wrappers_) {
      msg.wrappers_[currentCase] = undefined
    }
    jspb.Message.setField(msg, currentCase, undefined)
  }
  jspb.Message.setField(msg, fieldNumber, value)
}
jspb.Message.computeOneofCase = function (msg, oneof) {
  var oneofField
  var oneofValue
  goog.array.forEach(oneof, function (fieldNumber) {
    var value = jspb.Message.getField(msg, fieldNumber)
    if (goog.isDefAndNotNull(value)) {
      oneofField = fieldNumber
      oneofValue = value
      jspb.Message.setField(msg, fieldNumber, undefined)
    }
  })
  if (oneofField) {
    jspb.Message.setField(msg, oneofField, oneofValue)
    return oneofField
  }
  return 0
}
jspb.Message.getWrapperField = function (msg, ctor, fieldNumber, opt_required) {
  if (!msg.wrappers_) {
    msg.wrappers_ = {}
  }
  if (!msg.wrappers_[fieldNumber]) {
    var data = jspb.Message.getField(msg, fieldNumber)
    if (opt_required || data) {
      msg.wrappers_[fieldNumber] = new ctor(data)
    }
  }
  return msg.wrappers_[fieldNumber]
}
jspb.Message.getRepeatedWrapperField = function (msg, ctor, fieldNumber) {
  jspb.Message.wrapRepeatedField_(msg, ctor, fieldNumber)
  var val = msg.wrappers_[fieldNumber]
  if (val == jspb.Message.EMPTY_LIST_SENTINEL_) {
    val = msg.wrappers_[fieldNumber] = []
  }
  return val
}
jspb.Message.wrapRepeatedField_ = function (msg, ctor, fieldNumber) {
  if (!msg.wrappers_) {
    msg.wrappers_ = {}
  }
  if (!msg.wrappers_[fieldNumber]) {
    var data = jspb.Message.getRepeatedField(msg, fieldNumber)
    for (var wrappers = [], i = 0; i < data.length; i++) {
      wrappers[i] = new ctor(data[i])
    }
    msg.wrappers_[fieldNumber] = wrappers
  }
}
jspb.Message.setWrapperField = function (msg, fieldNumber, value) {
  if (!msg.wrappers_) {
    msg.wrappers_ = {}
  }
  var data = value ? value.toArray() : value
  msg.wrappers_[fieldNumber] = value
  jspb.Message.setField(msg, fieldNumber, data)
}
jspb.Message.setOneofWrapperField = function (msg, fieldNumber, oneof, value) {
  if (!msg.wrappers_) {
    msg.wrappers_ = {}
  }
  var data = value ? value.toArray() : value
  msg.wrappers_[fieldNumber] = value
  jspb.Message.setOneofField(msg, fieldNumber, oneof, data)
}
jspb.Message.setRepeatedWrapperField = function (msg, fieldNumber, value) {
  if (!msg.wrappers_) {
    msg.wrappers_ = {}
  }
  value = value || []
  for (var data = [], i = 0; i < value.length; i++) {
    data[i] = value[i].toArray()
  }
  msg.wrappers_[fieldNumber] = value
  jspb.Message.setField(msg, fieldNumber, data)
}
jspb.Message.addToRepeatedWrapperField = function (msg, fieldNumber, value, ctor, index) {
  jspb.Message.wrapRepeatedField_(msg, ctor, fieldNumber)
  var wrapperArray = msg.wrappers_[fieldNumber]
  if (!wrapperArray) {
    wrapperArray = msg.wrappers_[fieldNumber] = []
  }
  var insertedValue = value || new ctor()
  var array = jspb.Message.getRepeatedField(msg, fieldNumber)
  if (index != undefined) {
    wrapperArray.splice(index, 0, insertedValue)
    array.splice(index, 0, insertedValue.toArray())
  } else {
    wrapperArray.push(insertedValue)
    array.push(insertedValue.toArray())
  }
  return insertedValue
}
jspb.Message.toMap = function (field, mapKeyGetterFn, opt_toObjectFn, opt_includeInstance) {
  var result = {}
  for (var i = 0; i < field.length; i++) {
    result[mapKeyGetterFn.call(field[i])] = opt_toObjectFn ? opt_toObjectFn.call(field[i], opt_includeInstance, field[i]) : field[i]
  }
  return result
}
jspb.Message.prototype.syncMapFields_ = function () {
  if (this.wrappers_) {
    for (var fieldNumber in this.wrappers_) {
      var val = this.wrappers_[fieldNumber]
      if (goog.isArray(val)) {
        for (var i = 0; i < val.length; i++) {
          if (val[i]) {
            val[i].toArray()
          }
        }
      } else {
        if (val) {
          val.toArray()
        }
      }
    }
  }
}
jspb.Message.prototype.toArray = function () {
  this.syncMapFields_()
  return this.array
}
if (jspb.Message.GENERATE_TO_STRING) {
  jspb.Message.prototype.toString = function () {
    this.syncMapFields_()
    return this.array.toString()
  }
}
jspb.Message.prototype.getExtension = function (fieldInfo) {
  if (!this.extensionObject_) {
    return undefined
  }
  if (!this.wrappers_) {
    this.wrappers_ = {}
  }
  var fieldNumber = fieldInfo.fieldIndex
  if (fieldInfo.isRepeated) {
    if (fieldInfo.isMessageType()) {
      if (!this.wrappers_[fieldNumber]) {
        this.wrappers_[fieldNumber] = goog.array.map(this.extensionObject_[fieldNumber] || [], function (arr) {
          return new fieldInfo.ctor(arr)
        })
      }
      return this.wrappers_[fieldNumber]
    } else {
      return this.extensionObject_[fieldNumber]
    }
  } else {
    if (fieldInfo.isMessageType()) {
      if (!this.wrappers_[fieldNumber] && this.extensionObject_[fieldNumber]) {
        this.wrappers_[fieldNumber] = new fieldInfo.ctor(this.extensionObject_[fieldNumber])
      }
      return this.wrappers_[fieldNumber]
    } else {
      return this.extensionObject_[fieldNumber]
    }
  }
}
jspb.Message.prototype.setExtension = function (fieldInfo, value) {
  var self = this
  if (!self.wrappers_) {
    self.wrappers_ = {}
  }
  jspb.Message.maybeInitEmptyExtensionObject_(self)
  var fieldNumber = fieldInfo.fieldIndex
  if (fieldInfo.isRepeated) {
    value = value || []
    if (fieldInfo.isMessageType()) {
      self.wrappers_[fieldNumber] = value
      self.extensionObject_[fieldNumber] = goog.array.map(value, function (msg) {
        return msg.toArray()
      })
    } else {
      self.extensionObject_[fieldNumber] = value
    }
  } else {
    if (fieldInfo.isMessageType()) {
      self.wrappers_[fieldNumber] = value
      self.extensionObject_[fieldNumber] = value ? value.toArray() : value
    } else {
      self.extensionObject_[fieldNumber] = value
    }
  }
  return self
}
jspb.Message.difference = function (m1, m2) {
  if (!(m1 instanceof m2.constructor)) {
    throw new Error('Messages have different types.')
  }
  var arr1 = m1.toArray()
  var arr2 = m2.toArray()
  var res = []
  var start = 0
  var length = arr1.length > arr2.length ? arr1.length : arr2.length
  if (m1.getJsPbMessageId()) {
    res[0] = m1.getJsPbMessageId()
    start = 1
  }
  for (var i = start; i < length; i++) {
    if (!jspb.Message.compareFields(arr1[i], arr2[i])) {
      res[i] = arr2[i]
    }
  }
  return new m1.constructor(res)
}
jspb.Message.equals = function (m1, m2) {
  return m1 == m2 || !!(m1 && m2) && m1 instanceof m2.constructor && jspb.Message.compareFields(m1.toArray(), m2.toArray())
}
jspb.Message.compareExtensions = function (extension1, extension2) {
  extension1 = extension1 || {}
  extension2 = extension2 || {}
  var keys = {}
  for (var name in extension1) {
    keys[name] = 0
  }
  for (var name in extension2) {
    keys[name] = 0
  }
  for (name in keys) {
    if (!jspb.Message.compareFields(extension1[name], extension2[name])) {
      return false
    }
  }
  return true
}
jspb.Message.compareFields = function (field1, field2) {
  if (field1 == field2) {
    return true
  }
  if (!goog.isObject(field1) || !goog.isObject(field2)) {
    return false
  }
  field1 = field1
  field2 = field2
  if (field1.constructor != field2.constructor) {
    return false
  }
  if (jspb.Message.SUPPORTS_UINT8ARRAY_ && field1.constructor === Uint8Array) {
    var bytes1 = field1
    var bytes2 = field2
    if (bytes1.length != bytes2.length) {
      return false
    }
    for (var i = 0; i < bytes1.length; i++) {
      if (bytes1[i] != bytes2[i]) {
        return false
      }
    }
    return true
  }
  if (field1.constructor === Array) {
    var extension1 = undefined
    var extension2 = undefined
    var length = Math.max(field1.length, field2.length)
    for (var i = 0; i < length; i++) {
      var val1 = field1[i]
      var val2 = field2[i]
      if (val1 && val1.constructor == Object) {
        goog.asserts.assert(extension1 === undefined)
        goog.asserts.assert(i === field1.length - 1)
        extension1 = val1
        val1 = undefined
      }
      if (val2 && val2.constructor == Object) {
        goog.asserts.assert(extension2 === undefined)
        goog.asserts.assert(i === field2.length - 1)
        extension2 = val2
        val2 = undefined
      }
      if (!jspb.Message.compareFields(val1, val2)) {
        return false
      }
    }
    if (extension1 || extension2) {
      extension1 = extension1 || {}
      extension2 = extension2 || {}
      return jspb.Message.compareExtensions(extension1, extension2)
    }
    return true
  }
  if (field1.constructor === Object) {
    return jspb.Message.compareExtensions(field1, field2)
  }
  throw new Error('Invalid type in JSPB array')
}
jspb.Message.prototype.cloneMessage = function () {
  return jspb.Message.cloneMessage(this)
}
jspb.Message.prototype.clone = function () {
  return jspb.Message.cloneMessage(this)
}
jspb.Message.clone = function (msg) {
  return jspb.Message.cloneMessage(msg)
}
jspb.Message.cloneMessage = function (msg) {
  return new msg.constructor(jspb.Message.clone_(msg.toArray()))
}
jspb.Message.copyInto = function (fromMessage, toMessage) {
  goog.asserts.assertInstanceof(fromMessage, jspb.Message)
  goog.asserts.assertInstanceof(toMessage, jspb.Message)
  goog.asserts.assert(fromMessage.constructor == toMessage.constructor, 'Copy source and target message should have the same type.')
  var copyOfFrom = jspb.Message.clone(fromMessage)
  var to = toMessage.toArray()
  var from = copyOfFrom.toArray()
  to.length = 0
  for (var i = 0; i < from.length; i++) {
    to[i] = from[i]
  }
  toMessage.wrappers_ = copyOfFrom.wrappers_
  toMessage.extensionObject_ = copyOfFrom.extensionObject_
}
jspb.Message.clone_ = function (obj) {
  var o
  if (goog.isArray(obj)) {
    var clonedArray = new Array(obj.length)
    for (var i = 0; i < obj.length; i++) {
      if ((o = obj[i]) != null) {
        clonedArray[i] = typeof o === 'object' ? jspb.Message.clone_(o) : o
      }
    }
    return clonedArray
  }
  if (jspb.Message.SUPPORTS_UINT8ARRAY_ && obj instanceof Uint8Array) {
    return new Uint8Array(obj)
  }
  var clone = {}
  for (var key in obj) {
    if ((o = obj[key]) != null) {
      clone[key] = typeof o === 'object' ? jspb.Message.clone_(o) : o
    }
  }
  return clone
}
jspb.Message.registerMessageType = function (id, constructor) {
  jspb.Message.registry_[id] = constructor
  constructor.messageId = id
}
jspb.Message.registry_ = {}
jspb.Message.messageSetExtensions = {}
jspb.Message.messageSetExtensionsBinary = {}
goog.provide('proto.google.protobuf.Empty')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.google.protobuf.Empty = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.google.protobuf.Empty, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.google.protobuf.Empty.displayName = 'proto.google.protobuf.Empty'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.google.protobuf.Empty.prototype.toObject = function (opt_includeInstance) {
    return proto.google.protobuf.Empty.toObject(opt_includeInstance, this)
  }
  proto.google.protobuf.Empty.toObject = function (includeInstance, msg) {
    var f, obj = {}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.google.protobuf.Empty.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.google.protobuf.Empty()
  return proto.google.protobuf.Empty.deserializeBinaryFromReader(msg, reader)
}
proto.google.protobuf.Empty.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.google.protobuf.Empty.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.google.protobuf.Empty.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.google.protobuf.Empty.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}
goog.provide('proto.iroha.protocol.BlockErrorResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.BlockErrorResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.BlockErrorResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.BlockErrorResponse.displayName = 'proto.iroha.protocol.BlockErrorResponse'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.BlockErrorResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.BlockErrorResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.BlockErrorResponse.toObject = function (includeInstance, msg) {
    var f, obj = {message: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.BlockErrorResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.BlockErrorResponse()
  return proto.iroha.protocol.BlockErrorResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.BlockErrorResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setMessage(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.BlockErrorResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.BlockErrorResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.BlockErrorResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMessage()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.BlockErrorResponse.prototype.getMessage = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.BlockErrorResponse.prototype.setMessage = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.Signature')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.Signature = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.Signature, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Signature.displayName = 'proto.iroha.protocol.Signature'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Signature.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Signature.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Signature.toObject = function (includeInstance, msg) {
    var f, obj = {pubkey: msg.getPubkey_asB64(), signature: msg.getSignature_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Signature.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Signature()
  return proto.iroha.protocol.Signature.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Signature.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readBytes()
        msg.setPubkey(value)
        break
      case 2:
        var value = reader.readBytes()
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Signature.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Signature.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Signature.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}
proto.iroha.protocol.Signature.prototype.getPubkey = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.Signature.prototype.getPubkey_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getPubkey())
}
proto.iroha.protocol.Signature.prototype.getPubkey_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getPubkey())
}
proto.iroha.protocol.Signature.prototype.setPubkey = function (value) {
  jspb.Message.setProto3BytesField(this, 1, value)
}
proto.iroha.protocol.Signature.prototype.getSignature = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.Signature.prototype.getSignature_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getSignature())
}
proto.iroha.protocol.Signature.prototype.getSignature_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getSignature())
}
proto.iroha.protocol.Signature.prototype.setSignature = function (value) {
  jspb.Message.setProto3BytesField(this, 2, value)
}
goog.provide('proto.iroha.protocol.uint256')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.uint256 = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.uint256, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.uint256.displayName = 'proto.iroha.protocol.uint256'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.uint256.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.uint256.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.uint256.toObject = function (includeInstance, msg) {
    var f, obj = {first: jspb.Message.getFieldWithDefault(msg, 1, 0), second: jspb.Message.getFieldWithDefault(msg, 2, 0), third: jspb.Message.getFieldWithDefault(msg, 3, 0), fourth: jspb.Message.getFieldWithDefault(msg, 4, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.uint256.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.uint256()
  return proto.iroha.protocol.uint256.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.uint256.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readUint64()
        msg.setFirst(value)
        break
      case 2:
        var value = reader.readUint64()
        msg.setSecond(value)
        break
      case 3:
        var value = reader.readUint64()
        msg.setThird(value)
        break
      case 4:
        var value = reader.readUint64()
        msg.setFourth(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.uint256.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.uint256.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.uint256.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFirst()
  if (f !== 0) {
    writer.writeUint64(1, f)
  }
  f = message.getSecond()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
  f = message.getThird()
  if (f !== 0) {
    writer.writeUint64(3, f)
  }
  f = message.getFourth()
  if (f !== 0) {
    writer.writeUint64(4, f)
  }
}
proto.iroha.protocol.uint256.prototype.getFirst = function () {
  return jspb.Message.getFieldWithDefault(this, 1, 0)
}
proto.iroha.protocol.uint256.prototype.setFirst = function (value) {
  jspb.Message.setProto3IntField(this, 1, value)
}
proto.iroha.protocol.uint256.prototype.getSecond = function () {
  return jspb.Message.getFieldWithDefault(this, 2, 0)
}
proto.iroha.protocol.uint256.prototype.setSecond = function (value) {
  jspb.Message.setProto3IntField(this, 2, value)
}
proto.iroha.protocol.uint256.prototype.getThird = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.uint256.prototype.setThird = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
proto.iroha.protocol.uint256.prototype.getFourth = function () {
  return jspb.Message.getFieldWithDefault(this, 4, 0)
}
proto.iroha.protocol.uint256.prototype.setFourth = function (value) {
  jspb.Message.setProto3IntField(this, 4, value)
}
goog.provide('proto.iroha.protocol.Amount')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.uint256')
proto.iroha.protocol.Amount = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.Amount, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Amount.displayName = 'proto.iroha.protocol.Amount'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Amount.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Amount.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Amount.toObject = function (includeInstance, msg) {
    var f, obj = {value: (f = msg.getValue()) && proto.iroha.protocol.uint256.toObject(includeInstance, f), precision: jspb.Message.getFieldWithDefault(msg, 2, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Amount.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Amount()
  return proto.iroha.protocol.Amount.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Amount.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.uint256()
        reader.readMessage(value, proto.iroha.protocol.uint256.deserializeBinaryFromReader)
        msg.setValue(value)
        break
      case 2:
        var value = reader.readUint32()
        msg.setPrecision(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Amount.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Amount.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Amount.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getValue()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.uint256.serializeBinaryToWriter)
  }
  f = message.getPrecision()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
}
proto.iroha.protocol.Amount.prototype.getValue = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.uint256, 1)
}
proto.iroha.protocol.Amount.prototype.setValue = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.Amount.prototype.clearValue = function () {
  this.setValue(undefined)
}
proto.iroha.protocol.Amount.prototype.hasValue = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.Amount.prototype.getPrecision = function () {
  return jspb.Message.getFieldWithDefault(this, 2, 0)
}
proto.iroha.protocol.Amount.prototype.setPrecision = function (value) {
  jspb.Message.setProto3IntField(this, 2, value)
}
goog.provide('proto.iroha.protocol.AddAssetQuantity')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Amount')
proto.iroha.protocol.AddAssetQuantity = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AddAssetQuantity, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AddAssetQuantity.displayName = 'proto.iroha.protocol.AddAssetQuantity'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AddAssetQuantity.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AddAssetQuantity.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AddAssetQuantity.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), assetId: jspb.Message.getFieldWithDefault(msg, 2, ''), amount: (f = msg.getAmount()) && proto.iroha.protocol.Amount.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AddAssetQuantity.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AddAssetQuantity()
  return proto.iroha.protocol.AddAssetQuantity.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AddAssetQuantity.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      case 3:
        var value = new proto.iroha.protocol.Amount()
        reader.readMessage(value, proto.iroha.protocol.Amount.deserializeBinaryFromReader)
        msg.setAmount(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AddAssetQuantity.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AddAssetQuantity.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AddAssetQuantity.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getAmount()
  if (f != null) {
    writer.writeMessage(3, f, proto.iroha.protocol.Amount.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.AddAssetQuantity.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.AddAssetQuantity.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.AddAssetQuantity.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.AddAssetQuantity.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.AddAssetQuantity.prototype.getAmount = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Amount, 3)
}
proto.iroha.protocol.AddAssetQuantity.prototype.setAmount = function (value) {
  jspb.Message.setWrapperField(this, 3, value)
}
proto.iroha.protocol.AddAssetQuantity.prototype.clearAmount = function () {
  this.setAmount(undefined)
}
proto.iroha.protocol.AddAssetQuantity.prototype.hasAmount = function () {
  return jspb.Message.getField(this, 3) != null
}
goog.provide('proto.iroha.protocol.Peer')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.Peer = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.Peer, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Peer.displayName = 'proto.iroha.protocol.Peer'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Peer.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Peer.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Peer.toObject = function (includeInstance, msg) {
    var f, obj = {address: jspb.Message.getFieldWithDefault(msg, 1, ''), peerKey: msg.getPeerKey_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Peer.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Peer()
  return proto.iroha.protocol.Peer.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Peer.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAddress(value)
        break
      case 2:
        var value = reader.readBytes()
        msg.setPeerKey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Peer.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Peer.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Peer.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAddress()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getPeerKey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}
proto.iroha.protocol.Peer.prototype.getAddress = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.Peer.prototype.setAddress = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.Peer.prototype.getPeerKey = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.Peer.prototype.getPeerKey_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getPeerKey())
}
proto.iroha.protocol.Peer.prototype.getPeerKey_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getPeerKey())
}
proto.iroha.protocol.Peer.prototype.setPeerKey = function (value) {
  jspb.Message.setProto3BytesField(this, 2, value)
}
goog.provide('proto.iroha.protocol.AddPeer')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Peer')
proto.iroha.protocol.AddPeer = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AddPeer, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AddPeer.displayName = 'proto.iroha.protocol.AddPeer'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AddPeer.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AddPeer.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AddPeer.toObject = function (includeInstance, msg) {
    var f, obj = {peer: (f = msg.getPeer()) && proto.iroha.protocol.Peer.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AddPeer.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AddPeer()
  return proto.iroha.protocol.AddPeer.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AddPeer.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Peer()
        reader.readMessage(value, proto.iroha.protocol.Peer.deserializeBinaryFromReader)
        msg.setPeer(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AddPeer.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AddPeer.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AddPeer.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeer()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Peer.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.AddPeer.prototype.getPeer = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Peer, 1)
}
proto.iroha.protocol.AddPeer.prototype.setPeer = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.AddPeer.prototype.clearPeer = function () {
  this.setPeer(undefined)
}
proto.iroha.protocol.AddPeer.prototype.hasPeer = function () {
  return jspb.Message.getField(this, 1) != null
}
goog.provide('proto.iroha.protocol.AddSignatory')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.AddSignatory = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AddSignatory, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AddSignatory.displayName = 'proto.iroha.protocol.AddSignatory'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AddSignatory.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AddSignatory.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AddSignatory.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), publicKey: msg.getPublicKey_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AddSignatory.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AddSignatory()
  return proto.iroha.protocol.AddSignatory.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AddSignatory.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readBytes()
        msg.setPublicKey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AddSignatory.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AddSignatory.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AddSignatory.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getPublicKey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}
proto.iroha.protocol.AddSignatory.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.AddSignatory.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.AddSignatory.prototype.getPublicKey = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.AddSignatory.prototype.getPublicKey_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getPublicKey())
}
proto.iroha.protocol.AddSignatory.prototype.getPublicKey_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getPublicKey())
}
proto.iroha.protocol.AddSignatory.prototype.setPublicKey = function (value) {
  jspb.Message.setProto3BytesField(this, 2, value)
}
goog.provide('proto.iroha.protocol.AppendRole')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.AppendRole = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AppendRole, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AppendRole.displayName = 'proto.iroha.protocol.AppendRole'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AppendRole.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AppendRole.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AppendRole.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), roleName: jspb.Message.getFieldWithDefault(msg, 2, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AppendRole.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AppendRole()
  return proto.iroha.protocol.AppendRole.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AppendRole.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setRoleName(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AppendRole.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AppendRole.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AppendRole.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getRoleName()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
}
proto.iroha.protocol.AppendRole.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.AppendRole.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.AppendRole.prototype.getRoleName = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.AppendRole.prototype.setRoleName = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
goog.provide('proto.iroha.protocol.CreateAccount')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.CreateAccount = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.CreateAccount, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.CreateAccount.displayName = 'proto.iroha.protocol.CreateAccount'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.CreateAccount.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.CreateAccount.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.CreateAccount.toObject = function (includeInstance, msg) {
    var f, obj = {accountName: jspb.Message.getFieldWithDefault(msg, 1, ''), domainId: jspb.Message.getFieldWithDefault(msg, 2, ''), mainPubkey: msg.getMainPubkey_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.CreateAccount.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.CreateAccount()
  return proto.iroha.protocol.CreateAccount.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.CreateAccount.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountName(value)
        break
      case 2:
        var value = reader.readString()
        msg.setDomainId(value)
        break
      case 3:
        var value = reader.readBytes()
        msg.setMainPubkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.CreateAccount.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.CreateAccount.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.CreateAccount.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountName()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getDomainId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getMainPubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}
proto.iroha.protocol.CreateAccount.prototype.getAccountName = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.CreateAccount.prototype.setAccountName = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.CreateAccount.prototype.getDomainId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.CreateAccount.prototype.setDomainId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.CreateAccount.prototype.getMainPubkey = function () {
  return jspb.Message.getFieldWithDefault(this, 3, '')
}
proto.iroha.protocol.CreateAccount.prototype.getMainPubkey_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getMainPubkey())
}
proto.iroha.protocol.CreateAccount.prototype.getMainPubkey_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getMainPubkey())
}
proto.iroha.protocol.CreateAccount.prototype.setMainPubkey = function (value) {
  jspb.Message.setProto3BytesField(this, 3, value)
}
goog.provide('proto.iroha.protocol.CreateAsset')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.CreateAsset = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.CreateAsset, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.CreateAsset.displayName = 'proto.iroha.protocol.CreateAsset'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.CreateAsset.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.CreateAsset.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.CreateAsset.toObject = function (includeInstance, msg) {
    var f, obj = {assetName: jspb.Message.getFieldWithDefault(msg, 1, ''), domainId: jspb.Message.getFieldWithDefault(msg, 2, ''), precision: jspb.Message.getFieldWithDefault(msg, 3, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.CreateAsset.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.CreateAsset()
  return proto.iroha.protocol.CreateAsset.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.CreateAsset.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAssetName(value)
        break
      case 2:
        var value = reader.readString()
        msg.setDomainId(value)
        break
      case 3:
        var value = reader.readUint32()
        msg.setPrecision(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.CreateAsset.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.CreateAsset.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.CreateAsset.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAssetName()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getDomainId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getPrecision()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
}
proto.iroha.protocol.CreateAsset.prototype.getAssetName = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.CreateAsset.prototype.setAssetName = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.CreateAsset.prototype.getDomainId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.CreateAsset.prototype.setDomainId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.CreateAsset.prototype.getPrecision = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.CreateAsset.prototype.setPrecision = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
goog.provide('proto.iroha.protocol.CreateDomain')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.CreateDomain = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.CreateDomain, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.CreateDomain.displayName = 'proto.iroha.protocol.CreateDomain'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.CreateDomain.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.CreateDomain.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.CreateDomain.toObject = function (includeInstance, msg) {
    var f, obj = {domainId: jspb.Message.getFieldWithDefault(msg, 1, ''), defaultRole: jspb.Message.getFieldWithDefault(msg, 2, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.CreateDomain.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.CreateDomain()
  return proto.iroha.protocol.CreateDomain.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.CreateDomain.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setDomainId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setDefaultRole(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.CreateDomain.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.CreateDomain.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.CreateDomain.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getDomainId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getDefaultRole()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
}
proto.iroha.protocol.CreateDomain.prototype.getDomainId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.CreateDomain.prototype.setDomainId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.CreateDomain.prototype.getDefaultRole = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.CreateDomain.prototype.setDefaultRole = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
goog.provide('proto.iroha.protocol.CreateRole')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.forwardDeclare('proto.iroha.protocol.RolePermission')
proto.iroha.protocol.CreateRole = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.CreateRole.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.CreateRole, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.CreateRole.displayName = 'proto.iroha.protocol.CreateRole'
}
proto.iroha.protocol.CreateRole.repeatedFields_ = [2]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.CreateRole.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.CreateRole.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.CreateRole.toObject = function (includeInstance, msg) {
    var f, obj = {roleName: jspb.Message.getFieldWithDefault(msg, 1, ''), permissionsList: jspb.Message.getRepeatedField(msg, 2)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.CreateRole.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.CreateRole()
  return proto.iroha.protocol.CreateRole.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.CreateRole.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setRoleName(value)
        break
      case 2:
        var value = reader.readPackedEnum()
        msg.setPermissionsList(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.CreateRole.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.CreateRole.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.CreateRole.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getRoleName()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getPermissionsList()
  if (f.length > 0) {
    writer.writePackedEnum(2, f)
  }
}
proto.iroha.protocol.CreateRole.prototype.getRoleName = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.CreateRole.prototype.setRoleName = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.CreateRole.prototype.getPermissionsList = function () {
  return jspb.Message.getRepeatedField(this, 2)
}
proto.iroha.protocol.CreateRole.prototype.setPermissionsList = function (value) {
  jspb.Message.setField(this, 2, value || [])
}
proto.iroha.protocol.CreateRole.prototype.addPermissions = function (value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index)
}
proto.iroha.protocol.CreateRole.prototype.clearPermissionsList = function () {
  this.setPermissionsList([])
}
goog.provide('proto.iroha.protocol.DetachRole')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.DetachRole = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.DetachRole, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.DetachRole.displayName = 'proto.iroha.protocol.DetachRole'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.DetachRole.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.DetachRole.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.DetachRole.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), roleName: jspb.Message.getFieldWithDefault(msg, 2, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.DetachRole.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.DetachRole()
  return proto.iroha.protocol.DetachRole.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.DetachRole.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setRoleName(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.DetachRole.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.DetachRole.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.DetachRole.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getRoleName()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
}
proto.iroha.protocol.DetachRole.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.DetachRole.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.DetachRole.prototype.getRoleName = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.DetachRole.prototype.setRoleName = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
goog.provide('proto.iroha.protocol.GrantPermission')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.forwardDeclare('proto.iroha.protocol.GrantablePermission')
proto.iroha.protocol.GrantPermission = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GrantPermission, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GrantPermission.displayName = 'proto.iroha.protocol.GrantPermission'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GrantPermission.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GrantPermission.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GrantPermission.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), permission: jspb.Message.getFieldWithDefault(msg, 2, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GrantPermission.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GrantPermission()
  return proto.iroha.protocol.GrantPermission.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GrantPermission.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readEnum()
        msg.setPermission(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GrantPermission.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GrantPermission.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GrantPermission.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getPermission()
  if (f !== 0.0) {
    writer.writeEnum(2, f)
  }
}
proto.iroha.protocol.GrantPermission.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GrantPermission.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.GrantPermission.prototype.getPermission = function () {
  return jspb.Message.getFieldWithDefault(this, 2, 0)
}
proto.iroha.protocol.GrantPermission.prototype.setPermission = function (value) {
  jspb.Message.setProto3EnumField(this, 2, value)
}
goog.provide('proto.iroha.protocol.RemoveSignatory')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.RemoveSignatory = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.RemoveSignatory, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.RemoveSignatory.displayName = 'proto.iroha.protocol.RemoveSignatory'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.RemoveSignatory.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.RemoveSignatory.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.RemoveSignatory.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), publicKey: msg.getPublicKey_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.RemoveSignatory.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.RemoveSignatory()
  return proto.iroha.protocol.RemoveSignatory.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.RemoveSignatory.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readBytes()
        msg.setPublicKey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.RemoveSignatory.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.RemoveSignatory.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.RemoveSignatory.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getPublicKey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}
proto.iroha.protocol.RemoveSignatory.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.RemoveSignatory.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.RemoveSignatory.prototype.getPublicKey = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.RemoveSignatory.prototype.getPublicKey_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getPublicKey())
}
proto.iroha.protocol.RemoveSignatory.prototype.getPublicKey_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getPublicKey())
}
proto.iroha.protocol.RemoveSignatory.prototype.setPublicKey = function (value) {
  jspb.Message.setProto3BytesField(this, 2, value)
}
goog.provide('proto.iroha.protocol.RevokePermission')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.forwardDeclare('proto.iroha.protocol.GrantablePermission')
proto.iroha.protocol.RevokePermission = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.RevokePermission, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.RevokePermission.displayName = 'proto.iroha.protocol.RevokePermission'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.RevokePermission.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.RevokePermission.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.RevokePermission.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), permission: jspb.Message.getFieldWithDefault(msg, 2, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.RevokePermission.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.RevokePermission()
  return proto.iroha.protocol.RevokePermission.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.RevokePermission.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readEnum()
        msg.setPermission(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.RevokePermission.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.RevokePermission.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.RevokePermission.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getPermission()
  if (f !== 0.0) {
    writer.writeEnum(2, f)
  }
}
proto.iroha.protocol.RevokePermission.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.RevokePermission.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.RevokePermission.prototype.getPermission = function () {
  return jspb.Message.getFieldWithDefault(this, 2, 0)
}
proto.iroha.protocol.RevokePermission.prototype.setPermission = function (value) {
  jspb.Message.setProto3EnumField(this, 2, value)
}
goog.provide('proto.iroha.protocol.SetAccountDetail')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.SetAccountDetail = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.SetAccountDetail, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.SetAccountDetail.displayName = 'proto.iroha.protocol.SetAccountDetail'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.SetAccountDetail.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.SetAccountDetail.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.SetAccountDetail.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), key: jspb.Message.getFieldWithDefault(msg, 2, ''), value: jspb.Message.getFieldWithDefault(msg, 3, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.SetAccountDetail.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.SetAccountDetail()
  return proto.iroha.protocol.SetAccountDetail.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.SetAccountDetail.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setKey(value)
        break
      case 3:
        var value = reader.readString()
        msg.setValue(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.SetAccountDetail.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.SetAccountDetail.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.SetAccountDetail.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getKey()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getValue()
  if (f.length > 0) {
    writer.writeString(3, f)
  }
}
proto.iroha.protocol.SetAccountDetail.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.SetAccountDetail.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.SetAccountDetail.prototype.getKey = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.SetAccountDetail.prototype.setKey = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.SetAccountDetail.prototype.getValue = function () {
  return jspb.Message.getFieldWithDefault(this, 3, '')
}
proto.iroha.protocol.SetAccountDetail.prototype.setValue = function (value) {
  jspb.Message.setProto3StringField(this, 3, value)
}
goog.provide('proto.iroha.protocol.SetAccountQuorum')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.SetAccountQuorum = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.SetAccountQuorum, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.SetAccountQuorum.displayName = 'proto.iroha.protocol.SetAccountQuorum'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.SetAccountQuorum.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.SetAccountQuorum.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.SetAccountQuorum.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), quorum: jspb.Message.getFieldWithDefault(msg, 2, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.SetAccountQuorum.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.SetAccountQuorum()
  return proto.iroha.protocol.SetAccountQuorum.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.SetAccountQuorum.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readUint32()
        msg.setQuorum(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.SetAccountQuorum.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.SetAccountQuorum.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.SetAccountQuorum.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getQuorum()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
}
proto.iroha.protocol.SetAccountQuorum.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.SetAccountQuorum.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.SetAccountQuorum.prototype.getQuorum = function () {
  return jspb.Message.getFieldWithDefault(this, 2, 0)
}
proto.iroha.protocol.SetAccountQuorum.prototype.setQuorum = function (value) {
  jspb.Message.setProto3IntField(this, 2, value)
}
goog.provide('proto.iroha.protocol.SubtractAssetQuantity')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Amount')
proto.iroha.protocol.SubtractAssetQuantity = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.SubtractAssetQuantity, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.SubtractAssetQuantity.displayName = 'proto.iroha.protocol.SubtractAssetQuantity'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.SubtractAssetQuantity.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.SubtractAssetQuantity.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.SubtractAssetQuantity.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), assetId: jspb.Message.getFieldWithDefault(msg, 2, ''), amount: (f = msg.getAmount()) && proto.iroha.protocol.Amount.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.SubtractAssetQuantity.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.SubtractAssetQuantity()
  return proto.iroha.protocol.SubtractAssetQuantity.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.SubtractAssetQuantity.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      case 3:
        var value = new proto.iroha.protocol.Amount()
        reader.readMessage(value, proto.iroha.protocol.Amount.deserializeBinaryFromReader)
        msg.setAmount(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.SubtractAssetQuantity.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.SubtractAssetQuantity.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getAmount()
  if (f != null) {
    writer.writeMessage(3, f, proto.iroha.protocol.Amount.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.getAmount = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Amount, 3)
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.setAmount = function (value) {
  jspb.Message.setWrapperField(this, 3, value)
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.clearAmount = function () {
  this.setAmount(undefined)
}
proto.iroha.protocol.SubtractAssetQuantity.prototype.hasAmount = function () {
  return jspb.Message.getField(this, 3) != null
}
goog.provide('proto.iroha.protocol.TransferAsset')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Amount')
proto.iroha.protocol.TransferAsset = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.TransferAsset, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.TransferAsset.displayName = 'proto.iroha.protocol.TransferAsset'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.TransferAsset.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.TransferAsset.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.TransferAsset.toObject = function (includeInstance, msg) {
    var f, obj = {srcAccountId: jspb.Message.getFieldWithDefault(msg, 1, ''), destAccountId: jspb.Message.getFieldWithDefault(msg, 2, ''), assetId: jspb.Message.getFieldWithDefault(msg, 3, ''), description: jspb.Message.getFieldWithDefault(msg, 4, ''), amount: (f = msg.getAmount()) && proto.iroha.protocol.Amount.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.TransferAsset.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.TransferAsset()
  return proto.iroha.protocol.TransferAsset.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.TransferAsset.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setSrcAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setDestAccountId(value)
        break
      case 3:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      case 4:
        var value = reader.readString()
        msg.setDescription(value)
        break
      case 5:
        var value = new proto.iroha.protocol.Amount()
        reader.readMessage(value, proto.iroha.protocol.Amount.deserializeBinaryFromReader)
        msg.setAmount(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.TransferAsset.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.TransferAsset.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.TransferAsset.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSrcAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getDestAccountId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(3, f)
  }
  f = message.getDescription()
  if (f.length > 0) {
    writer.writeString(4, f)
  }
  f = message.getAmount()
  if (f != null) {
    writer.writeMessage(5, f, proto.iroha.protocol.Amount.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.TransferAsset.prototype.getSrcAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.TransferAsset.prototype.setSrcAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.TransferAsset.prototype.getDestAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.TransferAsset.prototype.setDestAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.TransferAsset.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 3, '')
}
proto.iroha.protocol.TransferAsset.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 3, value)
}
proto.iroha.protocol.TransferAsset.prototype.getDescription = function () {
  return jspb.Message.getFieldWithDefault(this, 4, '')
}
proto.iroha.protocol.TransferAsset.prototype.setDescription = function (value) {
  jspb.Message.setProto3StringField(this, 4, value)
}
proto.iroha.protocol.TransferAsset.prototype.getAmount = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Amount, 5)
}
proto.iroha.protocol.TransferAsset.prototype.setAmount = function (value) {
  jspb.Message.setWrapperField(this, 5, value)
}
proto.iroha.protocol.TransferAsset.prototype.clearAmount = function () {
  this.setAmount(undefined)
}
proto.iroha.protocol.TransferAsset.prototype.hasAmount = function () {
  return jspb.Message.getField(this, 5) != null
}
goog.provide('proto.iroha.protocol.Command')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.AddAssetQuantity')
goog.require('proto.iroha.protocol.AddPeer')
goog.require('proto.iroha.protocol.AddSignatory')
goog.require('proto.iroha.protocol.AppendRole')
goog.require('proto.iroha.protocol.CreateAccount')
goog.require('proto.iroha.protocol.CreateAsset')
goog.require('proto.iroha.protocol.CreateDomain')
goog.require('proto.iroha.protocol.CreateRole')
goog.require('proto.iroha.protocol.DetachRole')
goog.require('proto.iroha.protocol.GrantPermission')
goog.require('proto.iroha.protocol.RemoveSignatory')
goog.require('proto.iroha.protocol.RevokePermission')
goog.require('proto.iroha.protocol.SetAccountDetail')
goog.require('proto.iroha.protocol.SetAccountQuorum')
goog.require('proto.iroha.protocol.SubtractAssetQuantity')
goog.require('proto.iroha.protocol.TransferAsset')
proto.iroha.protocol.Command = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.iroha.protocol.Command.oneofGroups_)
}
goog.inherits(proto.iroha.protocol.Command, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Command.displayName = 'proto.iroha.protocol.Command'
}
proto.iroha.protocol.Command.oneofGroups_ = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]]
proto.iroha.protocol.Command.CommandCase = {COMMAND_NOT_SET: 0, ADD_ASSET_QUANTITY: 1, ADD_PEER: 2, ADD_SIGNATORY: 3, APPEND_ROLE: 4, CREATE_ACCOUNT: 5, CREATE_ASSET: 6, CREATE_DOMAIN: 7, CREATE_ROLE: 8, DETACH_ROLE: 9, GRANT_PERMISSION: 10, REMOVE_SIGN: 11, REVOKE_PERMISSION: 12, SET_ACCOUNT_DETAIL: 13, SET_QUORUM: 14, SUBTRACT_ASSET_QUANTITY: 15, TRANSFER_ASSET: 16}
proto.iroha.protocol.Command.prototype.getCommandCase = function () {
  return jspb.Message.computeOneofCase(this, proto.iroha.protocol.Command.oneofGroups_[0])
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Command.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Command.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Command.toObject = function (includeInstance, msg) {
    var f, obj = {addAssetQuantity: (f = msg.getAddAssetQuantity()) && proto.iroha.protocol.AddAssetQuantity.toObject(includeInstance, f),
      addPeer: (f = msg.getAddPeer()) && proto.iroha.protocol.AddPeer.toObject(includeInstance, f),
      addSignatory: (f = msg.getAddSignatory()) && proto.iroha.protocol.AddSignatory.toObject(includeInstance, f),
      appendRole: (f = msg.getAppendRole()) && proto.iroha.protocol.AppendRole.toObject(includeInstance, f),
      createAccount: (f = msg.getCreateAccount()) && proto.iroha.protocol.CreateAccount.toObject(includeInstance,
        f),
      createAsset: (f = msg.getCreateAsset()) && proto.iroha.protocol.CreateAsset.toObject(includeInstance, f),
      createDomain: (f = msg.getCreateDomain()) && proto.iroha.protocol.CreateDomain.toObject(includeInstance, f),
      createRole: (f = msg.getCreateRole()) && proto.iroha.protocol.CreateRole.toObject(includeInstance, f),
      detachRole: (f = msg.getDetachRole()) && proto.iroha.protocol.DetachRole.toObject(includeInstance, f),
      grantPermission: (f = msg.getGrantPermission()) && proto.iroha.protocol.GrantPermission.toObject(includeInstance,
        f),
      removeSign: (f = msg.getRemoveSign()) && proto.iroha.protocol.RemoveSignatory.toObject(includeInstance, f),
      revokePermission: (f = msg.getRevokePermission()) && proto.iroha.protocol.RevokePermission.toObject(includeInstance, f),
      setAccountDetail: (f = msg.getSetAccountDetail()) && proto.iroha.protocol.SetAccountDetail.toObject(includeInstance, f),
      setQuorum: (f = msg.getSetQuorum()) && proto.iroha.protocol.SetAccountQuorum.toObject(includeInstance, f),
      subtractAssetQuantity: (f = msg.getSubtractAssetQuantity()) &&
    proto.iroha.protocol.SubtractAssetQuantity.toObject(includeInstance, f),
      transferAsset: (f = msg.getTransferAsset()) && proto.iroha.protocol.TransferAsset.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Command.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Command()
  return proto.iroha.protocol.Command.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Command.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.AddAssetQuantity()
        reader.readMessage(value, proto.iroha.protocol.AddAssetQuantity.deserializeBinaryFromReader)
        msg.setAddAssetQuantity(value)
        break
      case 2:
        var value = new proto.iroha.protocol.AddPeer()
        reader.readMessage(value, proto.iroha.protocol.AddPeer.deserializeBinaryFromReader)
        msg.setAddPeer(value)
        break
      case 3:
        var value = new proto.iroha.protocol.AddSignatory()
        reader.readMessage(value, proto.iroha.protocol.AddSignatory.deserializeBinaryFromReader)
        msg.setAddSignatory(value)
        break
      case 4:
        var value = new proto.iroha.protocol.AppendRole()
        reader.readMessage(value, proto.iroha.protocol.AppendRole.deserializeBinaryFromReader)
        msg.setAppendRole(value)
        break
      case 5:
        var value = new proto.iroha.protocol.CreateAccount()
        reader.readMessage(value, proto.iroha.protocol.CreateAccount.deserializeBinaryFromReader)
        msg.setCreateAccount(value)
        break
      case 6:
        var value = new proto.iroha.protocol.CreateAsset()
        reader.readMessage(value, proto.iroha.protocol.CreateAsset.deserializeBinaryFromReader)
        msg.setCreateAsset(value)
        break
      case 7:
        var value = new proto.iroha.protocol.CreateDomain()
        reader.readMessage(value, proto.iroha.protocol.CreateDomain.deserializeBinaryFromReader)
        msg.setCreateDomain(value)
        break
      case 8:
        var value = new proto.iroha.protocol.CreateRole()
        reader.readMessage(value, proto.iroha.protocol.CreateRole.deserializeBinaryFromReader)
        msg.setCreateRole(value)
        break
      case 9:
        var value = new proto.iroha.protocol.DetachRole()
        reader.readMessage(value, proto.iroha.protocol.DetachRole.deserializeBinaryFromReader)
        msg.setDetachRole(value)
        break
      case 10:
        var value = new proto.iroha.protocol.GrantPermission()
        reader.readMessage(value, proto.iroha.protocol.GrantPermission.deserializeBinaryFromReader)
        msg.setGrantPermission(value)
        break
      case 11:
        var value = new proto.iroha.protocol.RemoveSignatory()
        reader.readMessage(value, proto.iroha.protocol.RemoveSignatory.deserializeBinaryFromReader)
        msg.setRemoveSign(value)
        break
      case 12:
        var value = new proto.iroha.protocol.RevokePermission()
        reader.readMessage(value, proto.iroha.protocol.RevokePermission.deserializeBinaryFromReader)
        msg.setRevokePermission(value)
        break
      case 13:
        var value = new proto.iroha.protocol.SetAccountDetail()
        reader.readMessage(value, proto.iroha.protocol.SetAccountDetail.deserializeBinaryFromReader)
        msg.setSetAccountDetail(value)
        break
      case 14:
        var value = new proto.iroha.protocol.SetAccountQuorum()
        reader.readMessage(value, proto.iroha.protocol.SetAccountQuorum.deserializeBinaryFromReader)
        msg.setSetQuorum(value)
        break
      case 15:
        var value = new proto.iroha.protocol.SubtractAssetQuantity()
        reader.readMessage(value, proto.iroha.protocol.SubtractAssetQuantity.deserializeBinaryFromReader)
        msg.setSubtractAssetQuantity(value)
        break
      case 16:
        var value = new proto.iroha.protocol.TransferAsset()
        reader.readMessage(value, proto.iroha.protocol.TransferAsset.deserializeBinaryFromReader)
        msg.setTransferAsset(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Command.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Command.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Command.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAddAssetQuantity()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.AddAssetQuantity.serializeBinaryToWriter)
  }
  f = message.getAddPeer()
  if (f != null) {
    writer.writeMessage(2, f, proto.iroha.protocol.AddPeer.serializeBinaryToWriter)
  }
  f = message.getAddSignatory()
  if (f != null) {
    writer.writeMessage(3, f, proto.iroha.protocol.AddSignatory.serializeBinaryToWriter)
  }
  f = message.getAppendRole()
  if (f != null) {
    writer.writeMessage(4, f, proto.iroha.protocol.AppendRole.serializeBinaryToWriter)
  }
  f = message.getCreateAccount()
  if (f != null) {
    writer.writeMessage(5, f, proto.iroha.protocol.CreateAccount.serializeBinaryToWriter)
  }
  f = message.getCreateAsset()
  if (f != null) {
    writer.writeMessage(6, f, proto.iroha.protocol.CreateAsset.serializeBinaryToWriter)
  }
  f = message.getCreateDomain()
  if (f != null) {
    writer.writeMessage(7, f, proto.iroha.protocol.CreateDomain.serializeBinaryToWriter)
  }
  f = message.getCreateRole()
  if (f != null) {
    writer.writeMessage(8, f, proto.iroha.protocol.CreateRole.serializeBinaryToWriter)
  }
  f = message.getDetachRole()
  if (f != null) {
    writer.writeMessage(9, f, proto.iroha.protocol.DetachRole.serializeBinaryToWriter)
  }
  f = message.getGrantPermission()
  if (f != null) {
    writer.writeMessage(10, f, proto.iroha.protocol.GrantPermission.serializeBinaryToWriter)
  }
  f = message.getRemoveSign()
  if (f != null) {
    writer.writeMessage(11, f, proto.iroha.protocol.RemoveSignatory.serializeBinaryToWriter)
  }
  f = message.getRevokePermission()
  if (f != null) {
    writer.writeMessage(12, f, proto.iroha.protocol.RevokePermission.serializeBinaryToWriter)
  }
  f = message.getSetAccountDetail()
  if (f != null) {
    writer.writeMessage(13, f, proto.iroha.protocol.SetAccountDetail.serializeBinaryToWriter)
  }
  f = message.getSetQuorum()
  if (f != null) {
    writer.writeMessage(14, f, proto.iroha.protocol.SetAccountQuorum.serializeBinaryToWriter)
  }
  f = message.getSubtractAssetQuantity()
  if (f != null) {
    writer.writeMessage(15, f, proto.iroha.protocol.SubtractAssetQuantity.serializeBinaryToWriter)
  }
  f = message.getTransferAsset()
  if (f != null) {
    writer.writeMessage(16, f, proto.iroha.protocol.TransferAsset.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.Command.prototype.getAddAssetQuantity = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AddAssetQuantity, 1)
}
proto.iroha.protocol.Command.prototype.setAddAssetQuantity = function (value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearAddAssetQuantity = function () {
  this.setAddAssetQuantity(undefined)
}
proto.iroha.protocol.Command.prototype.hasAddAssetQuantity = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.Command.prototype.getAddPeer = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AddPeer, 2)
}
proto.iroha.protocol.Command.prototype.setAddPeer = function (value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearAddPeer = function () {
  this.setAddPeer(undefined)
}
proto.iroha.protocol.Command.prototype.hasAddPeer = function () {
  return jspb.Message.getField(this, 2) != null
}
proto.iroha.protocol.Command.prototype.getAddSignatory = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AddSignatory, 3)
}
proto.iroha.protocol.Command.prototype.setAddSignatory = function (value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearAddSignatory = function () {
  this.setAddSignatory(undefined)
}
proto.iroha.protocol.Command.prototype.hasAddSignatory = function () {
  return jspb.Message.getField(this, 3) != null
}
proto.iroha.protocol.Command.prototype.getAppendRole = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AppendRole, 4)
}
proto.iroha.protocol.Command.prototype.setAppendRole = function (value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearAppendRole = function () {
  this.setAppendRole(undefined)
}
proto.iroha.protocol.Command.prototype.hasAppendRole = function () {
  return jspb.Message.getField(this, 4) != null
}
proto.iroha.protocol.Command.prototype.getCreateAccount = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.CreateAccount, 5)
}
proto.iroha.protocol.Command.prototype.setCreateAccount = function (value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearCreateAccount = function () {
  this.setCreateAccount(undefined)
}
proto.iroha.protocol.Command.prototype.hasCreateAccount = function () {
  return jspb.Message.getField(this, 5) != null
}
proto.iroha.protocol.Command.prototype.getCreateAsset = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.CreateAsset, 6)
}
proto.iroha.protocol.Command.prototype.setCreateAsset = function (value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearCreateAsset = function () {
  this.setCreateAsset(undefined)
}
proto.iroha.protocol.Command.prototype.hasCreateAsset = function () {
  return jspb.Message.getField(this, 6) != null
}
proto.iroha.protocol.Command.prototype.getCreateDomain = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.CreateDomain, 7)
}
proto.iroha.protocol.Command.prototype.setCreateDomain = function (value) {
  jspb.Message.setOneofWrapperField(this, 7, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearCreateDomain = function () {
  this.setCreateDomain(undefined)
}
proto.iroha.protocol.Command.prototype.hasCreateDomain = function () {
  return jspb.Message.getField(this, 7) != null
}
proto.iroha.protocol.Command.prototype.getCreateRole = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.CreateRole, 8)
}
proto.iroha.protocol.Command.prototype.setCreateRole = function (value) {
  jspb.Message.setOneofWrapperField(this, 8, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearCreateRole = function () {
  this.setCreateRole(undefined)
}
proto.iroha.protocol.Command.prototype.hasCreateRole = function () {
  return jspb.Message.getField(this, 8) != null
}
proto.iroha.protocol.Command.prototype.getDetachRole = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.DetachRole, 9)
}
proto.iroha.protocol.Command.prototype.setDetachRole = function (value) {
  jspb.Message.setOneofWrapperField(this, 9, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearDetachRole = function () {
  this.setDetachRole(undefined)
}
proto.iroha.protocol.Command.prototype.hasDetachRole = function () {
  return jspb.Message.getField(this, 9) != null
}
proto.iroha.protocol.Command.prototype.getGrantPermission = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GrantPermission, 10)
}
proto.iroha.protocol.Command.prototype.setGrantPermission = function (value) {
  jspb.Message.setOneofWrapperField(this, 10, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearGrantPermission = function () {
  this.setGrantPermission(undefined)
}
proto.iroha.protocol.Command.prototype.hasGrantPermission = function () {
  return jspb.Message.getField(this, 10) != null
}
proto.iroha.protocol.Command.prototype.getRemoveSign = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.RemoveSignatory, 11)
}
proto.iroha.protocol.Command.prototype.setRemoveSign = function (value) {
  jspb.Message.setOneofWrapperField(this, 11, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearRemoveSign = function () {
  this.setRemoveSign(undefined)
}
proto.iroha.protocol.Command.prototype.hasRemoveSign = function () {
  return jspb.Message.getField(this, 11) != null
}
proto.iroha.protocol.Command.prototype.getRevokePermission = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.RevokePermission, 12)
}
proto.iroha.protocol.Command.prototype.setRevokePermission = function (value) {
  jspb.Message.setOneofWrapperField(this, 12, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearRevokePermission = function () {
  this.setRevokePermission(undefined)
}
proto.iroha.protocol.Command.prototype.hasRevokePermission = function () {
  return jspb.Message.getField(this, 12) != null
}
proto.iroha.protocol.Command.prototype.getSetAccountDetail = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.SetAccountDetail, 13)
}
proto.iroha.protocol.Command.prototype.setSetAccountDetail = function (value) {
  jspb.Message.setOneofWrapperField(this, 13, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearSetAccountDetail = function () {
  this.setSetAccountDetail(undefined)
}
proto.iroha.protocol.Command.prototype.hasSetAccountDetail = function () {
  return jspb.Message.getField(this, 13) != null
}
proto.iroha.protocol.Command.prototype.getSetQuorum = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.SetAccountQuorum, 14)
}
proto.iroha.protocol.Command.prototype.setSetQuorum = function (value) {
  jspb.Message.setOneofWrapperField(this, 14, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearSetQuorum = function () {
  this.setSetQuorum(undefined)
}
proto.iroha.protocol.Command.prototype.hasSetQuorum = function () {
  return jspb.Message.getField(this, 14) != null
}
proto.iroha.protocol.Command.prototype.getSubtractAssetQuantity = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.SubtractAssetQuantity, 15)
}
proto.iroha.protocol.Command.prototype.setSubtractAssetQuantity = function (value) {
  jspb.Message.setOneofWrapperField(this, 15, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearSubtractAssetQuantity = function () {
  this.setSubtractAssetQuantity(undefined)
}
proto.iroha.protocol.Command.prototype.hasSubtractAssetQuantity = function () {
  return jspb.Message.getField(this, 15) != null
}
proto.iroha.protocol.Command.prototype.getTransferAsset = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.TransferAsset, 16)
}
proto.iroha.protocol.Command.prototype.setTransferAsset = function (value) {
  jspb.Message.setOneofWrapperField(this, 16, proto.iroha.protocol.Command.oneofGroups_[0], value)
}
proto.iroha.protocol.Command.prototype.clearTransferAsset = function () {
  this.setTransferAsset(undefined)
}
proto.iroha.protocol.Command.prototype.hasTransferAsset = function () {
  return jspb.Message.getField(this, 16) != null
}
goog.provide('proto.iroha.protocol.Transaction')
goog.provide('proto.iroha.protocol.Transaction.Payload')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Command')
goog.require('proto.iroha.protocol.Signature')
proto.iroha.protocol.Transaction = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.Transaction.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.Transaction, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Transaction.displayName = 'proto.iroha.protocol.Transaction'
}
proto.iroha.protocol.Transaction.repeatedFields_ = [2]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Transaction.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Transaction.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Transaction.toObject = function (includeInstance, msg) {
    var f, obj = {payload: (f = msg.getPayload()) && proto.iroha.protocol.Transaction.Payload.toObject(includeInstance, f), signaturesList: jspb.Message.toObjectList(msg.getSignaturesList(), proto.iroha.protocol.Signature.toObject, includeInstance)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Transaction.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Transaction()
  return proto.iroha.protocol.Transaction.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Transaction.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Transaction.Payload()
        reader.readMessage(value, proto.iroha.protocol.Transaction.Payload.deserializeBinaryFromReader)
        msg.setPayload(value)
        break
      case 2:
        var value = new proto.iroha.protocol.Signature()
        reader.readMessage(value, proto.iroha.protocol.Signature.deserializeBinaryFromReader)
        msg.addSignatures(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Transaction.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Transaction.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Transaction.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPayload()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Transaction.Payload.serializeBinaryToWriter)
  }
  f = message.getSignaturesList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(2, f, proto.iroha.protocol.Signature.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.Transaction.Payload = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.Transaction.Payload.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.Transaction.Payload, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Transaction.Payload.displayName = 'proto.iroha.protocol.Transaction.Payload'
}
proto.iroha.protocol.Transaction.Payload.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Transaction.Payload.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Transaction.Payload.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Transaction.Payload.toObject = function (includeInstance, msg) {
    var f, obj = {commandsList: jspb.Message.toObjectList(msg.getCommandsList(), proto.iroha.protocol.Command.toObject, includeInstance), creatorAccountId: jspb.Message.getFieldWithDefault(msg, 2, ''), createdTime: jspb.Message.getFieldWithDefault(msg, 3, 0), quorum: jspb.Message.getFieldWithDefault(msg, 4, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Transaction.Payload.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Transaction.Payload()
  return proto.iroha.protocol.Transaction.Payload.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Transaction.Payload.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Command()
        reader.readMessage(value, proto.iroha.protocol.Command.deserializeBinaryFromReader)
        msg.addCommands(value)
        break
      case 2:
        var value = reader.readString()
        msg.setCreatorAccountId(value)
        break
      case 3:
        var value = reader.readUint64()
        msg.setCreatedTime(value)
        break
      case 4:
        var value = reader.readUint32()
        msg.setQuorum(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Transaction.Payload.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Transaction.Payload.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Transaction.Payload.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCommandsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.iroha.protocol.Command.serializeBinaryToWriter)
  }
  f = message.getCreatorAccountId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getCreatedTime()
  if (f !== 0) {
    writer.writeUint64(3, f)
  }
  f = message.getQuorum()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
}
proto.iroha.protocol.Transaction.Payload.prototype.getCommandsList = function () {
  return jspb.Message.getRepeatedWrapperField(this, proto.iroha.protocol.Command, 1)
}
proto.iroha.protocol.Transaction.Payload.prototype.setCommandsList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value)
}
proto.iroha.protocol.Transaction.Payload.prototype.addCommands = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.iroha.protocol.Command, opt_index)
}
proto.iroha.protocol.Transaction.Payload.prototype.clearCommandsList = function () {
  this.setCommandsList([])
}
proto.iroha.protocol.Transaction.Payload.prototype.getCreatorAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.Transaction.Payload.prototype.setCreatorAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.Transaction.Payload.prototype.getCreatedTime = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.Transaction.Payload.prototype.setCreatedTime = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
proto.iroha.protocol.Transaction.Payload.prototype.getQuorum = function () {
  return jspb.Message.getFieldWithDefault(this, 4, 0)
}
proto.iroha.protocol.Transaction.Payload.prototype.setQuorum = function (value) {
  jspb.Message.setProto3IntField(this, 4, value)
}
proto.iroha.protocol.Transaction.prototype.getPayload = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Transaction.Payload, 1)
}
proto.iroha.protocol.Transaction.prototype.setPayload = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.Transaction.prototype.clearPayload = function () {
  this.setPayload(undefined)
}
proto.iroha.protocol.Transaction.prototype.hasPayload = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.Transaction.prototype.getSignaturesList = function () {
  return jspb.Message.getRepeatedWrapperField(this, proto.iroha.protocol.Signature, 2)
}
proto.iroha.protocol.Transaction.prototype.setSignaturesList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value)
}
proto.iroha.protocol.Transaction.prototype.addSignatures = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.iroha.protocol.Signature, opt_index)
}
proto.iroha.protocol.Transaction.prototype.clearSignaturesList = function () {
  this.setSignaturesList([])
}
goog.provide('proto.iroha.protocol.Block')
goog.provide('proto.iroha.protocol.Block.Payload')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Signature')
goog.require('proto.iroha.protocol.Transaction')
proto.iroha.protocol.Block = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.Block.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.Block, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Block.displayName = 'proto.iroha.protocol.Block'
}
proto.iroha.protocol.Block.repeatedFields_ = [2]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Block.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Block.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Block.toObject = function (includeInstance, msg) {
    var f, obj = {payload: (f = msg.getPayload()) && proto.iroha.protocol.Block.Payload.toObject(includeInstance, f), signaturesList: jspb.Message.toObjectList(msg.getSignaturesList(), proto.iroha.protocol.Signature.toObject, includeInstance)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Block.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Block()
  return proto.iroha.protocol.Block.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Block.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Block.Payload()
        reader.readMessage(value, proto.iroha.protocol.Block.Payload.deserializeBinaryFromReader)
        msg.setPayload(value)
        break
      case 2:
        var value = new proto.iroha.protocol.Signature()
        reader.readMessage(value, proto.iroha.protocol.Signature.deserializeBinaryFromReader)
        msg.addSignatures(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Block.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Block.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Block.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPayload()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Block.Payload.serializeBinaryToWriter)
  }
  f = message.getSignaturesList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(2, f, proto.iroha.protocol.Signature.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.Block.Payload = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.Block.Payload.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.Block.Payload, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Block.Payload.displayName = 'proto.iroha.protocol.Block.Payload'
}
proto.iroha.protocol.Block.Payload.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Block.Payload.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Block.Payload.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Block.Payload.toObject = function (includeInstance, msg) {
    var f, obj = {transactionsList: jspb.Message.toObjectList(msg.getTransactionsList(), proto.iroha.protocol.Transaction.toObject, includeInstance), txNumber: jspb.Message.getFieldWithDefault(msg, 2, 0), height: jspb.Message.getFieldWithDefault(msg, 3, 0), prevBlockHash: msg.getPrevBlockHash_asB64(), createdTime: jspb.Message.getFieldWithDefault(msg, 6, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Block.Payload.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Block.Payload()
  return proto.iroha.protocol.Block.Payload.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Block.Payload.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Transaction()
        reader.readMessage(value, proto.iroha.protocol.Transaction.deserializeBinaryFromReader)
        msg.addTransactions(value)
        break
      case 2:
        var value = reader.readUint32()
        msg.setTxNumber(value)
        break
      case 3:
        var value = reader.readUint64()
        msg.setHeight(value)
        break
      case 5:
        var value = reader.readBytes()
        msg.setPrevBlockHash(value)
        break
      case 6:
        var value = reader.readUint64()
        msg.setCreatedTime(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Block.Payload.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Block.Payload.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Block.Payload.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTransactionsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.iroha.protocol.Transaction.serializeBinaryToWriter)
  }
  f = message.getTxNumber()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getHeight()
  if (f !== 0) {
    writer.writeUint64(3, f)
  }
  f = message.getPrevBlockHash_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
  f = message.getCreatedTime()
  if (f !== 0) {
    writer.writeUint64(6, f)
  }
}
proto.iroha.protocol.Block.Payload.prototype.getTransactionsList = function () {
  return jspb.Message.getRepeatedWrapperField(this, proto.iroha.protocol.Transaction, 1)
}
proto.iroha.protocol.Block.Payload.prototype.setTransactionsList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value)
}
proto.iroha.protocol.Block.Payload.prototype.addTransactions = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.iroha.protocol.Transaction, opt_index)
}
proto.iroha.protocol.Block.Payload.prototype.clearTransactionsList = function () {
  this.setTransactionsList([])
}
proto.iroha.protocol.Block.Payload.prototype.getTxNumber = function () {
  return jspb.Message.getFieldWithDefault(this, 2, 0)
}
proto.iroha.protocol.Block.Payload.prototype.setTxNumber = function (value) {
  jspb.Message.setProto3IntField(this, 2, value)
}
proto.iroha.protocol.Block.Payload.prototype.getHeight = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.Block.Payload.prototype.setHeight = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
proto.iroha.protocol.Block.Payload.prototype.getPrevBlockHash = function () {
  return jspb.Message.getFieldWithDefault(this, 5, '')
}
proto.iroha.protocol.Block.Payload.prototype.getPrevBlockHash_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getPrevBlockHash())
}
proto.iroha.protocol.Block.Payload.prototype.getPrevBlockHash_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getPrevBlockHash())
}
proto.iroha.protocol.Block.Payload.prototype.setPrevBlockHash = function (value) {
  jspb.Message.setProto3BytesField(this, 5, value)
}
proto.iroha.protocol.Block.Payload.prototype.getCreatedTime = function () {
  return jspb.Message.getFieldWithDefault(this, 6, 0)
}
proto.iroha.protocol.Block.Payload.prototype.setCreatedTime = function (value) {
  jspb.Message.setProto3IntField(this, 6, value)
}
proto.iroha.protocol.Block.prototype.getPayload = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Block.Payload, 1)
}
proto.iroha.protocol.Block.prototype.setPayload = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.Block.prototype.clearPayload = function () {
  this.setPayload(undefined)
}
proto.iroha.protocol.Block.prototype.hasPayload = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.Block.prototype.getSignaturesList = function () {
  return jspb.Message.getRepeatedWrapperField(this, proto.iroha.protocol.Signature, 2)
}
proto.iroha.protocol.Block.prototype.setSignaturesList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value)
}
proto.iroha.protocol.Block.prototype.addSignatures = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.iroha.protocol.Signature, opt_index)
}
proto.iroha.protocol.Block.prototype.clearSignaturesList = function () {
  this.setSignaturesList([])
}
goog.provide('proto.iroha.protocol.BlockResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Block')
proto.iroha.protocol.BlockResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.BlockResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.BlockResponse.displayName = 'proto.iroha.protocol.BlockResponse'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.BlockResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.BlockResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.BlockResponse.toObject = function (includeInstance, msg) {
    var f, obj = {block: (f = msg.getBlock()) && proto.iroha.protocol.Block.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.BlockResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.BlockResponse()
  return proto.iroha.protocol.BlockResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.BlockResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Block()
        reader.readMessage(value, proto.iroha.protocol.Block.deserializeBinaryFromReader)
        msg.setBlock(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.BlockResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.BlockResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.BlockResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getBlock()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Block.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.BlockResponse.prototype.getBlock = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Block, 1)
}
proto.iroha.protocol.BlockResponse.prototype.setBlock = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.BlockResponse.prototype.clearBlock = function () {
  this.setBlock(undefined)
}
proto.iroha.protocol.BlockResponse.prototype.hasBlock = function () {
  return jspb.Message.getField(this, 1) != null
}
goog.provide('proto.iroha.protocol.BlockQueryResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.BlockErrorResponse')
goog.require('proto.iroha.protocol.BlockResponse')
proto.iroha.protocol.BlockQueryResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.iroha.protocol.BlockQueryResponse.oneofGroups_)
}
goog.inherits(proto.iroha.protocol.BlockQueryResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.BlockQueryResponse.displayName = 'proto.iroha.protocol.BlockQueryResponse'
}
proto.iroha.protocol.BlockQueryResponse.oneofGroups_ = [[1, 2]]
proto.iroha.protocol.BlockQueryResponse.ResponseCase = {RESPONSE_NOT_SET: 0, BLOCK_RESPONSE: 1, ERROR_RESPONSE: 2}
proto.iroha.protocol.BlockQueryResponse.prototype.getResponseCase = function () {
  return jspb.Message.computeOneofCase(this, proto.iroha.protocol.BlockQueryResponse.oneofGroups_[0])
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.BlockQueryResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.BlockQueryResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.BlockQueryResponse.toObject = function (includeInstance, msg) {
    var f, obj = {blockResponse: (f = msg.getBlockResponse()) && proto.iroha.protocol.BlockResponse.toObject(includeInstance, f), errorResponse: (f = msg.getErrorResponse()) && proto.iroha.protocol.BlockErrorResponse.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.BlockQueryResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.BlockQueryResponse()
  return proto.iroha.protocol.BlockQueryResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.BlockQueryResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.BlockResponse()
        reader.readMessage(value, proto.iroha.protocol.BlockResponse.deserializeBinaryFromReader)
        msg.setBlockResponse(value)
        break
      case 2:
        var value = new proto.iroha.protocol.BlockErrorResponse()
        reader.readMessage(value, proto.iroha.protocol.BlockErrorResponse.deserializeBinaryFromReader)
        msg.setErrorResponse(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.BlockQueryResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.BlockQueryResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.BlockQueryResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getBlockResponse()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.BlockResponse.serializeBinaryToWriter)
  }
  f = message.getErrorResponse()
  if (f != null) {
    writer.writeMessage(2, f, proto.iroha.protocol.BlockErrorResponse.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.BlockQueryResponse.prototype.getBlockResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.BlockResponse, 1)
}
proto.iroha.protocol.BlockQueryResponse.prototype.setBlockResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.iroha.protocol.BlockQueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.BlockQueryResponse.prototype.clearBlockResponse = function () {
  this.setBlockResponse(undefined)
}
proto.iroha.protocol.BlockQueryResponse.prototype.hasBlockResponse = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.BlockQueryResponse.prototype.getErrorResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.BlockErrorResponse, 2)
}
proto.iroha.protocol.BlockQueryResponse.prototype.setErrorResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.iroha.protocol.BlockQueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.BlockQueryResponse.prototype.clearErrorResponse = function () {
  this.setErrorResponse(undefined)
}
proto.iroha.protocol.BlockQueryResponse.prototype.hasErrorResponse = function () {
  return jspb.Message.getField(this, 2) != null
}
goog.provide('proto.iroha.protocol.QueryPayloadMeta')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.QueryPayloadMeta = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.QueryPayloadMeta, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.QueryPayloadMeta.displayName = 'proto.iroha.protocol.QueryPayloadMeta'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.QueryPayloadMeta.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.QueryPayloadMeta.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.QueryPayloadMeta.toObject = function (includeInstance, msg) {
    var f, obj = {createdTime: jspb.Message.getFieldWithDefault(msg, 1, 0), creatorAccountId: jspb.Message.getFieldWithDefault(msg, 2, ''), queryCounter: jspb.Message.getFieldWithDefault(msg, 3, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.QueryPayloadMeta.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.QueryPayloadMeta()
  return proto.iroha.protocol.QueryPayloadMeta.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.QueryPayloadMeta.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readUint64()
        msg.setCreatedTime(value)
        break
      case 2:
        var value = reader.readString()
        msg.setCreatorAccountId(value)
        break
      case 3:
        var value = reader.readUint64()
        msg.setQueryCounter(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.QueryPayloadMeta.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.QueryPayloadMeta.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.QueryPayloadMeta.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCreatedTime()
  if (f !== 0) {
    writer.writeUint64(1, f)
  }
  f = message.getCreatorAccountId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getQueryCounter()
  if (f !== 0) {
    writer.writeUint64(3, f)
  }
}
proto.iroha.protocol.QueryPayloadMeta.prototype.getCreatedTime = function () {
  return jspb.Message.getFieldWithDefault(this, 1, 0)
}
proto.iroha.protocol.QueryPayloadMeta.prototype.setCreatedTime = function (value) {
  jspb.Message.setProto3IntField(this, 1, value)
}
proto.iroha.protocol.QueryPayloadMeta.prototype.getCreatorAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.QueryPayloadMeta.prototype.setCreatorAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.QueryPayloadMeta.prototype.getQueryCounter = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.QueryPayloadMeta.prototype.setQueryCounter = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
goog.provide('proto.iroha.protocol.BlocksQuery')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.QueryPayloadMeta')
goog.require('proto.iroha.protocol.Signature')
proto.iroha.protocol.BlocksQuery = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.BlocksQuery, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.BlocksQuery.displayName = 'proto.iroha.protocol.BlocksQuery'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.BlocksQuery.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.BlocksQuery.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.BlocksQuery.toObject = function (includeInstance, msg) {
    var f, obj = {meta: (f = msg.getMeta()) && proto.iroha.protocol.QueryPayloadMeta.toObject(includeInstance, f), signature: (f = msg.getSignature()) && proto.iroha.protocol.Signature.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.BlocksQuery.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.BlocksQuery()
  return proto.iroha.protocol.BlocksQuery.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.BlocksQuery.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.QueryPayloadMeta()
        reader.readMessage(value, proto.iroha.protocol.QueryPayloadMeta.deserializeBinaryFromReader)
        msg.setMeta(value)
        break
      case 2:
        var value = new proto.iroha.protocol.Signature()
        reader.readMessage(value, proto.iroha.protocol.Signature.deserializeBinaryFromReader)
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.BlocksQuery.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.BlocksQuery.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.BlocksQuery.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMeta()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.QueryPayloadMeta.serializeBinaryToWriter)
  }
  f = message.getSignature()
  if (f != null) {
    writer.writeMessage(2, f, proto.iroha.protocol.Signature.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.BlocksQuery.prototype.getMeta = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.QueryPayloadMeta, 1)
}
proto.iroha.protocol.BlocksQuery.prototype.setMeta = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.BlocksQuery.prototype.clearMeta = function () {
  this.setMeta(undefined)
}
proto.iroha.protocol.BlocksQuery.prototype.hasMeta = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.BlocksQuery.prototype.getSignature = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Signature, 2)
}
proto.iroha.protocol.BlocksQuery.prototype.setSignature = function (value) {
  jspb.Message.setWrapperField(this, 2, value)
}
proto.iroha.protocol.BlocksQuery.prototype.clearSignature = function () {
  this.setSignature(undefined)
}
proto.iroha.protocol.BlocksQuery.prototype.hasSignature = function () {
  return jspb.Message.getField(this, 2) != null
}
goog.provide('proto.iroha.protocol.GetAccount')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetAccount = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetAccount, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetAccount.displayName = 'proto.iroha.protocol.GetAccount'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetAccount.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetAccount.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetAccount.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetAccount.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetAccount()
  return proto.iroha.protocol.GetAccount.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetAccount.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetAccount.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetAccount.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetAccount.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetAccount.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetAccount.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetAccountAssetTransactions')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetAccountAssetTransactions = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetAccountAssetTransactions, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetAccountAssetTransactions.displayName = 'proto.iroha.protocol.GetAccountAssetTransactions'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetAccountAssetTransactions.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetAccountAssetTransactions.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetAccountAssetTransactions.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), assetId: jspb.Message.getFieldWithDefault(msg, 2, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetAccountAssetTransactions.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetAccountAssetTransactions()
  return proto.iroha.protocol.GetAccountAssetTransactions.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetAccountAssetTransactions.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetAccountAssetTransactions.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetAccountAssetTransactions.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetAccountAssetTransactions.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
}
proto.iroha.protocol.GetAccountAssetTransactions.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetAccountAssetTransactions.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.GetAccountAssetTransactions.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.GetAccountAssetTransactions.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
goog.provide('proto.iroha.protocol.GetAccountAssets')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetAccountAssets = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetAccountAssets, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetAccountAssets.displayName = 'proto.iroha.protocol.GetAccountAssets'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetAccountAssets.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetAccountAssets.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetAccountAssets.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetAccountAssets.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetAccountAssets()
  return proto.iroha.protocol.GetAccountAssets.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetAccountAssets.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetAccountAssets.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetAccountAssets.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetAccountAssets.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetAccountAssets.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetAccountAssets.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetAccountDetail')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetAccountDetail = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetAccountDetail, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetAccountDetail.displayName = 'proto.iroha.protocol.GetAccountDetail'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetAccountDetail.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetAccountDetail.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetAccountDetail.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetAccountDetail.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetAccountDetail()
  return proto.iroha.protocol.GetAccountDetail.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetAccountDetail.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetAccountDetail.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetAccountDetail.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetAccountDetail.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetAccountDetail.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetAccountDetail.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetAccountTransactions')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetAccountTransactions = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetAccountTransactions, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetAccountTransactions.displayName = 'proto.iroha.protocol.GetAccountTransactions'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetAccountTransactions.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetAccountTransactions.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetAccountTransactions.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetAccountTransactions.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetAccountTransactions()
  return proto.iroha.protocol.GetAccountTransactions.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetAccountTransactions.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetAccountTransactions.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetAccountTransactions.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetAccountTransactions.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetAccountTransactions.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetAccountTransactions.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetAssetInfo')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetAssetInfo = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetAssetInfo, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetAssetInfo.displayName = 'proto.iroha.protocol.GetAssetInfo'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetAssetInfo.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetAssetInfo.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetAssetInfo.toObject = function (includeInstance, msg) {
    var f, obj = {assetId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetAssetInfo.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetAssetInfo()
  return proto.iroha.protocol.GetAssetInfo.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetAssetInfo.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetAssetInfo.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetAssetInfo.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetAssetInfo.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetAssetInfo.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetAssetInfo.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetRolePermissions')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetRolePermissions = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetRolePermissions, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetRolePermissions.displayName = 'proto.iroha.protocol.GetRolePermissions'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetRolePermissions.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetRolePermissions.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetRolePermissions.toObject = function (includeInstance, msg) {
    var f, obj = {roleId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetRolePermissions.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetRolePermissions()
  return proto.iroha.protocol.GetRolePermissions.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetRolePermissions.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setRoleId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetRolePermissions.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetRolePermissions.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetRolePermissions.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getRoleId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetRolePermissions.prototype.getRoleId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetRolePermissions.prototype.setRoleId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetRoles')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetRoles = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetRoles, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetRoles.displayName = 'proto.iroha.protocol.GetRoles'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetRoles.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetRoles.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetRoles.toObject = function (includeInstance, msg) {
    var f, obj = {}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetRoles.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetRoles()
  return proto.iroha.protocol.GetRoles.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetRoles.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetRoles.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetRoles.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetRoles.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}
goog.provide('proto.iroha.protocol.GetSignatories')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetSignatories = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.GetSignatories, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetSignatories.displayName = 'proto.iroha.protocol.GetSignatories'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetSignatories.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetSignatories.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetSignatories.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetSignatories.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetSignatories()
  return proto.iroha.protocol.GetSignatories.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetSignatories.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetSignatories.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetSignatories.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetSignatories.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.GetSignatories.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.GetSignatories.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.GetTransactions')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.GetTransactions = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.GetTransactions.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.GetTransactions, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.GetTransactions.displayName = 'proto.iroha.protocol.GetTransactions'
}
proto.iroha.protocol.GetTransactions.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.GetTransactions.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.GetTransactions.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.GetTransactions.toObject = function (includeInstance, msg) {
    var f, obj = {txHashesList: msg.getTxHashesList_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.GetTransactions.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.GetTransactions()
  return proto.iroha.protocol.GetTransactions.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.GetTransactions.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readBytes()
        msg.addTxHashes(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.GetTransactions.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.GetTransactions.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.GetTransactions.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTxHashesList_asU8()
  if (f.length > 0) {
    writer.writeRepeatedBytes(1, f)
  }
}
proto.iroha.protocol.GetTransactions.prototype.getTxHashesList = function () {
  return jspb.Message.getRepeatedField(this, 1)
}
proto.iroha.protocol.GetTransactions.prototype.getTxHashesList_asB64 = function () {
  return jspb.Message.bytesListAsB64(this.getTxHashesList())
}
proto.iroha.protocol.GetTransactions.prototype.getTxHashesList_asU8 = function () {
  return jspb.Message.bytesListAsU8(this.getTxHashesList())
}
proto.iroha.protocol.GetTransactions.prototype.setTxHashesList = function (value) {
  jspb.Message.setField(this, 1, value || [])
}
proto.iroha.protocol.GetTransactions.prototype.addTxHashes = function (value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}
proto.iroha.protocol.GetTransactions.prototype.clearTxHashesList = function () {
  this.setTxHashesList([])
}
goog.provide('proto.iroha.protocol.Query')
goog.provide('proto.iroha.protocol.Query.Payload')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.GetAccount')
goog.require('proto.iroha.protocol.GetAccountAssetTransactions')
goog.require('proto.iroha.protocol.GetAccountAssets')
goog.require('proto.iroha.protocol.GetAccountDetail')
goog.require('proto.iroha.protocol.GetAccountTransactions')
goog.require('proto.iroha.protocol.GetAssetInfo')
goog.require('proto.iroha.protocol.GetRolePermissions')
goog.require('proto.iroha.protocol.GetRoles')
goog.require('proto.iroha.protocol.GetSignatories')
goog.require('proto.iroha.protocol.GetTransactions')
goog.require('proto.iroha.protocol.QueryPayloadMeta')
goog.require('proto.iroha.protocol.Signature')
proto.iroha.protocol.Query = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.Query, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Query.displayName = 'proto.iroha.protocol.Query'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Query.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Query.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Query.toObject = function (includeInstance, msg) {
    var f, obj = {payload: (f = msg.getPayload()) && proto.iroha.protocol.Query.Payload.toObject(includeInstance, f), signature: (f = msg.getSignature()) && proto.iroha.protocol.Signature.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Query.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Query()
  return proto.iroha.protocol.Query.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Query.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Query.Payload()
        reader.readMessage(value, proto.iroha.protocol.Query.Payload.deserializeBinaryFromReader)
        msg.setPayload(value)
        break
      case 2:
        var value = new proto.iroha.protocol.Signature()
        reader.readMessage(value, proto.iroha.protocol.Signature.deserializeBinaryFromReader)
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Query.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Query.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Query.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPayload()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Query.Payload.serializeBinaryToWriter)
  }
  f = message.getSignature()
  if (f != null) {
    writer.writeMessage(2, f, proto.iroha.protocol.Signature.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.Query.Payload = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.iroha.protocol.Query.Payload.oneofGroups_)
}
goog.inherits(proto.iroha.protocol.Query.Payload, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Query.Payload.displayName = 'proto.iroha.protocol.Query.Payload'
}
proto.iroha.protocol.Query.Payload.oneofGroups_ = [[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
proto.iroha.protocol.Query.Payload.QueryCase = {QUERY_NOT_SET: 0, GET_ACCOUNT: 3, GET_ACCOUNT_SIGNATORIES: 4, GET_ACCOUNT_TRANSACTIONS: 5, GET_ACCOUNT_ASSET_TRANSACTIONS: 6, GET_TRANSACTIONS: 7, GET_ACCOUNT_ASSETS: 8, GET_ACCOUNT_DETAIL: 9, GET_ROLES: 10, GET_ROLE_PERMISSIONS: 11, GET_ASSET_INFO: 12}
proto.iroha.protocol.Query.Payload.prototype.getQueryCase = function () {
  return jspb.Message.computeOneofCase(this, proto.iroha.protocol.Query.Payload.oneofGroups_[0])
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Query.Payload.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Query.Payload.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Query.Payload.toObject = function (includeInstance, msg) {
    var f, obj = {meta: (f = msg.getMeta()) && proto.iroha.protocol.QueryPayloadMeta.toObject(includeInstance, f),
      getAccount: (f = msg.getGetAccount()) && proto.iroha.protocol.GetAccount.toObject(includeInstance, f),
      getAccountSignatories: (f = msg.getGetAccountSignatories()) && proto.iroha.protocol.GetSignatories.toObject(includeInstance, f),
      getAccountTransactions: (f = msg.getGetAccountTransactions()) && proto.iroha.protocol.GetAccountTransactions.toObject(includeInstance, f),
      getAccountAssetTransactions: (f =
    msg.getGetAccountAssetTransactions()) && proto.iroha.protocol.GetAccountAssetTransactions.toObject(includeInstance, f),
      getTransactions: (f = msg.getGetTransactions()) && proto.iroha.protocol.GetTransactions.toObject(includeInstance, f),
      getAccountAssets: (f = msg.getGetAccountAssets()) && proto.iroha.protocol.GetAccountAssets.toObject(includeInstance, f),
      getAccountDetail: (f = msg.getGetAccountDetail()) && proto.iroha.protocol.GetAccountDetail.toObject(includeInstance, f),
      getRoles: (f = msg.getGetRoles()) &&
    proto.iroha.protocol.GetRoles.toObject(includeInstance, f),
      getRolePermissions: (f = msg.getGetRolePermissions()) && proto.iroha.protocol.GetRolePermissions.toObject(includeInstance, f),
      getAssetInfo: (f = msg.getGetAssetInfo()) && proto.iroha.protocol.GetAssetInfo.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Query.Payload.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Query.Payload()
  return proto.iroha.protocol.Query.Payload.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Query.Payload.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.QueryPayloadMeta()
        reader.readMessage(value, proto.iroha.protocol.QueryPayloadMeta.deserializeBinaryFromReader)
        msg.setMeta(value)
        break
      case 3:
        var value = new proto.iroha.protocol.GetAccount()
        reader.readMessage(value, proto.iroha.protocol.GetAccount.deserializeBinaryFromReader)
        msg.setGetAccount(value)
        break
      case 4:
        var value = new proto.iroha.protocol.GetSignatories()
        reader.readMessage(value, proto.iroha.protocol.GetSignatories.deserializeBinaryFromReader)
        msg.setGetAccountSignatories(value)
        break
      case 5:
        var value = new proto.iroha.protocol.GetAccountTransactions()
        reader.readMessage(value, proto.iroha.protocol.GetAccountTransactions.deserializeBinaryFromReader)
        msg.setGetAccountTransactions(value)
        break
      case 6:
        var value = new proto.iroha.protocol.GetAccountAssetTransactions()
        reader.readMessage(value, proto.iroha.protocol.GetAccountAssetTransactions.deserializeBinaryFromReader)
        msg.setGetAccountAssetTransactions(value)
        break
      case 7:
        var value = new proto.iroha.protocol.GetTransactions()
        reader.readMessage(value, proto.iroha.protocol.GetTransactions.deserializeBinaryFromReader)
        msg.setGetTransactions(value)
        break
      case 8:
        var value = new proto.iroha.protocol.GetAccountAssets()
        reader.readMessage(value, proto.iroha.protocol.GetAccountAssets.deserializeBinaryFromReader)
        msg.setGetAccountAssets(value)
        break
      case 9:
        var value = new proto.iroha.protocol.GetAccountDetail()
        reader.readMessage(value, proto.iroha.protocol.GetAccountDetail.deserializeBinaryFromReader)
        msg.setGetAccountDetail(value)
        break
      case 10:
        var value = new proto.iroha.protocol.GetRoles()
        reader.readMessage(value, proto.iroha.protocol.GetRoles.deserializeBinaryFromReader)
        msg.setGetRoles(value)
        break
      case 11:
        var value = new proto.iroha.protocol.GetRolePermissions()
        reader.readMessage(value, proto.iroha.protocol.GetRolePermissions.deserializeBinaryFromReader)
        msg.setGetRolePermissions(value)
        break
      case 12:
        var value = new proto.iroha.protocol.GetAssetInfo()
        reader.readMessage(value, proto.iroha.protocol.GetAssetInfo.deserializeBinaryFromReader)
        msg.setGetAssetInfo(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Query.Payload.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Query.Payload.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Query.Payload.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMeta()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.QueryPayloadMeta.serializeBinaryToWriter)
  }
  f = message.getGetAccount()
  if (f != null) {
    writer.writeMessage(3, f, proto.iroha.protocol.GetAccount.serializeBinaryToWriter)
  }
  f = message.getGetAccountSignatories()
  if (f != null) {
    writer.writeMessage(4, f, proto.iroha.protocol.GetSignatories.serializeBinaryToWriter)
  }
  f = message.getGetAccountTransactions()
  if (f != null) {
    writer.writeMessage(5, f, proto.iroha.protocol.GetAccountTransactions.serializeBinaryToWriter)
  }
  f = message.getGetAccountAssetTransactions()
  if (f != null) {
    writer.writeMessage(6, f, proto.iroha.protocol.GetAccountAssetTransactions.serializeBinaryToWriter)
  }
  f = message.getGetTransactions()
  if (f != null) {
    writer.writeMessage(7, f, proto.iroha.protocol.GetTransactions.serializeBinaryToWriter)
  }
  f = message.getGetAccountAssets()
  if (f != null) {
    writer.writeMessage(8, f, proto.iroha.protocol.GetAccountAssets.serializeBinaryToWriter)
  }
  f = message.getGetAccountDetail()
  if (f != null) {
    writer.writeMessage(9, f, proto.iroha.protocol.GetAccountDetail.serializeBinaryToWriter)
  }
  f = message.getGetRoles()
  if (f != null) {
    writer.writeMessage(10, f, proto.iroha.protocol.GetRoles.serializeBinaryToWriter)
  }
  f = message.getGetRolePermissions()
  if (f != null) {
    writer.writeMessage(11, f, proto.iroha.protocol.GetRolePermissions.serializeBinaryToWriter)
  }
  f = message.getGetAssetInfo()
  if (f != null) {
    writer.writeMessage(12, f, proto.iroha.protocol.GetAssetInfo.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.Query.Payload.prototype.getMeta = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.QueryPayloadMeta, 1)
}
proto.iroha.protocol.Query.Payload.prototype.setMeta = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.Query.Payload.prototype.clearMeta = function () {
  this.setMeta(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasMeta = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAccount = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetAccount, 3)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAccount = function (value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAccount = function () {
  this.setGetAccount(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAccount = function () {
  return jspb.Message.getField(this, 3) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAccountSignatories = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetSignatories, 4)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAccountSignatories = function (value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAccountSignatories = function () {
  this.setGetAccountSignatories(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAccountSignatories = function () {
  return jspb.Message.getField(this, 4) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAccountTransactions = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetAccountTransactions, 5)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAccountTransactions = function (value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAccountTransactions = function () {
  this.setGetAccountTransactions(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAccountTransactions = function () {
  return jspb.Message.getField(this, 5) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAccountAssetTransactions = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetAccountAssetTransactions, 6)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAccountAssetTransactions = function (value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAccountAssetTransactions = function () {
  this.setGetAccountAssetTransactions(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAccountAssetTransactions = function () {
  return jspb.Message.getField(this, 6) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetTransactions = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetTransactions, 7)
}
proto.iroha.protocol.Query.Payload.prototype.setGetTransactions = function (value) {
  jspb.Message.setOneofWrapperField(this, 7, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetTransactions = function () {
  this.setGetTransactions(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetTransactions = function () {
  return jspb.Message.getField(this, 7) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAccountAssets = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetAccountAssets, 8)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAccountAssets = function (value) {
  jspb.Message.setOneofWrapperField(this, 8, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAccountAssets = function () {
  this.setGetAccountAssets(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAccountAssets = function () {
  return jspb.Message.getField(this, 8) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAccountDetail = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetAccountDetail, 9)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAccountDetail = function (value) {
  jspb.Message.setOneofWrapperField(this, 9, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAccountDetail = function () {
  this.setGetAccountDetail(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAccountDetail = function () {
  return jspb.Message.getField(this, 9) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetRoles = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetRoles, 10)
}
proto.iroha.protocol.Query.Payload.prototype.setGetRoles = function (value) {
  jspb.Message.setOneofWrapperField(this, 10, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetRoles = function () {
  this.setGetRoles(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetRoles = function () {
  return jspb.Message.getField(this, 10) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetRolePermissions = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetRolePermissions, 11)
}
proto.iroha.protocol.Query.Payload.prototype.setGetRolePermissions = function (value) {
  jspb.Message.setOneofWrapperField(this, 11, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetRolePermissions = function () {
  this.setGetRolePermissions(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetRolePermissions = function () {
  return jspb.Message.getField(this, 11) != null
}
proto.iroha.protocol.Query.Payload.prototype.getGetAssetInfo = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.GetAssetInfo, 12)
}
proto.iroha.protocol.Query.Payload.prototype.setGetAssetInfo = function (value) {
  jspb.Message.setOneofWrapperField(this, 12, proto.iroha.protocol.Query.Payload.oneofGroups_[0], value)
}
proto.iroha.protocol.Query.Payload.prototype.clearGetAssetInfo = function () {
  this.setGetAssetInfo(undefined)
}
proto.iroha.protocol.Query.Payload.prototype.hasGetAssetInfo = function () {
  return jspb.Message.getField(this, 12) != null
}
proto.iroha.protocol.Query.prototype.getPayload = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Query.Payload, 1)
}
proto.iroha.protocol.Query.prototype.setPayload = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.Query.prototype.clearPayload = function () {
  this.setPayload(undefined)
}
proto.iroha.protocol.Query.prototype.hasPayload = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.Query.prototype.getSignature = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Signature, 2)
}
proto.iroha.protocol.Query.prototype.setSignature = function (value) {
  jspb.Message.setWrapperField(this, 2, value)
}
proto.iroha.protocol.Query.prototype.clearSignature = function () {
  this.setSignature(undefined)
}
proto.iroha.protocol.Query.prototype.hasSignature = function () {
  return jspb.Message.getField(this, 2) != null
}
goog.provide('proto.iroha.protocol.AccountAsset')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Amount')
proto.iroha.protocol.AccountAsset = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AccountAsset, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AccountAsset.displayName = 'proto.iroha.protocol.AccountAsset'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AccountAsset.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AccountAsset.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AccountAsset.toObject = function (includeInstance, msg) {
    var f, obj = {assetId: jspb.Message.getFieldWithDefault(msg, 1, ''), accountId: jspb.Message.getFieldWithDefault(msg, 2, ''), balance: (f = msg.getBalance()) && proto.iroha.protocol.Amount.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AccountAsset.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AccountAsset()
  return proto.iroha.protocol.AccountAsset.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AccountAsset.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 3:
        var value = new proto.iroha.protocol.Amount()
        reader.readMessage(value, proto.iroha.protocol.Amount.deserializeBinaryFromReader)
        msg.setBalance(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AccountAsset.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AccountAsset.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AccountAsset.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getBalance()
  if (f != null) {
    writer.writeMessage(3, f, proto.iroha.protocol.Amount.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.AccountAsset.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.AccountAsset.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.AccountAsset.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.AccountAsset.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.AccountAsset.prototype.getBalance = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Amount, 3)
}
proto.iroha.protocol.AccountAsset.prototype.setBalance = function (value) {
  jspb.Message.setWrapperField(this, 3, value)
}
proto.iroha.protocol.AccountAsset.prototype.clearBalance = function () {
  this.setBalance(undefined)
}
proto.iroha.protocol.AccountAsset.prototype.hasBalance = function () {
  return jspb.Message.getField(this, 3) != null
}
goog.provide('proto.iroha.protocol.AccountAssetResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.AccountAsset')
proto.iroha.protocol.AccountAssetResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.AccountAssetResponse.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.AccountAssetResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AccountAssetResponse.displayName = 'proto.iroha.protocol.AccountAssetResponse'
}
proto.iroha.protocol.AccountAssetResponse.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AccountAssetResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AccountAssetResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AccountAssetResponse.toObject = function (includeInstance, msg) {
    var f, obj = {accountAssetsList: jspb.Message.toObjectList(msg.getAccountAssetsList(), proto.iroha.protocol.AccountAsset.toObject, includeInstance)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AccountAssetResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AccountAssetResponse()
  return proto.iroha.protocol.AccountAssetResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AccountAssetResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.AccountAsset()
        reader.readMessage(value, proto.iroha.protocol.AccountAsset.deserializeBinaryFromReader)
        msg.addAccountAssets(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AccountAssetResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AccountAssetResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AccountAssetResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountAssetsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.iroha.protocol.AccountAsset.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.AccountAssetResponse.prototype.getAccountAssetsList = function () {
  return jspb.Message.getRepeatedWrapperField(this, proto.iroha.protocol.AccountAsset, 1)
}
proto.iroha.protocol.AccountAssetResponse.prototype.setAccountAssetsList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value)
}
proto.iroha.protocol.AccountAssetResponse.prototype.addAccountAssets = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.iroha.protocol.AccountAsset, opt_index)
}
proto.iroha.protocol.AccountAssetResponse.prototype.clearAccountAssetsList = function () {
  this.setAccountAssetsList([])
}
goog.provide('proto.iroha.protocol.AccountDetailResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.AccountDetailResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AccountDetailResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AccountDetailResponse.displayName = 'proto.iroha.protocol.AccountDetailResponse'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AccountDetailResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AccountDetailResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AccountDetailResponse.toObject = function (includeInstance, msg) {
    var f, obj = {detail: jspb.Message.getFieldWithDefault(msg, 1, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AccountDetailResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AccountDetailResponse()
  return proto.iroha.protocol.AccountDetailResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AccountDetailResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setDetail(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AccountDetailResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AccountDetailResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AccountDetailResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getDetail()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}
proto.iroha.protocol.AccountDetailResponse.prototype.getDetail = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.AccountDetailResponse.prototype.setDetail = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
goog.provide('proto.iroha.protocol.Account')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.Account = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.Account, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Account.displayName = 'proto.iroha.protocol.Account'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Account.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Account.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Account.toObject = function (includeInstance, msg) {
    var f, obj = {accountId: jspb.Message.getFieldWithDefault(msg, 1, ''), domainId: jspb.Message.getFieldWithDefault(msg, 2, ''), quorum: jspb.Message.getFieldWithDefault(msg, 3, 0), jsonData: jspb.Message.getFieldWithDefault(msg, 4, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Account.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Account()
  return proto.iroha.protocol.Account.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Account.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAccountId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setDomainId(value)
        break
      case 3:
        var value = reader.readUint32()
        msg.setQuorum(value)
        break
      case 4:
        var value = reader.readString()
        msg.setJsonData(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Account.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Account.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Account.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getDomainId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getQuorum()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getJsonData()
  if (f.length > 0) {
    writer.writeString(4, f)
  }
}
proto.iroha.protocol.Account.prototype.getAccountId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.Account.prototype.setAccountId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.Account.prototype.getDomainId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.Account.prototype.setDomainId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.Account.prototype.getQuorum = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.Account.prototype.setQuorum = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
proto.iroha.protocol.Account.prototype.getJsonData = function () {
  return jspb.Message.getFieldWithDefault(this, 4, '')
}
proto.iroha.protocol.Account.prototype.setJsonData = function (value) {
  jspb.Message.setProto3StringField(this, 4, value)
}
goog.provide('proto.iroha.protocol.AccountResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Account')
proto.iroha.protocol.AccountResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.AccountResponse.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.AccountResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AccountResponse.displayName = 'proto.iroha.protocol.AccountResponse'
}
proto.iroha.protocol.AccountResponse.repeatedFields_ = [2]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AccountResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AccountResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AccountResponse.toObject = function (includeInstance, msg) {
    var f, obj = {account: (f = msg.getAccount()) && proto.iroha.protocol.Account.toObject(includeInstance, f), accountRolesList: jspb.Message.getRepeatedField(msg, 2)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AccountResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AccountResponse()
  return proto.iroha.protocol.AccountResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AccountResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Account()
        reader.readMessage(value, proto.iroha.protocol.Account.deserializeBinaryFromReader)
        msg.setAccount(value)
        break
      case 2:
        var value = reader.readString()
        msg.addAccountRoles(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AccountResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AccountResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AccountResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccount()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Account.serializeBinaryToWriter)
  }
  f = message.getAccountRolesList()
  if (f.length > 0) {
    writer.writeRepeatedString(2, f)
  }
}
proto.iroha.protocol.AccountResponse.prototype.getAccount = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Account, 1)
}
proto.iroha.protocol.AccountResponse.prototype.setAccount = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.AccountResponse.prototype.clearAccount = function () {
  this.setAccount(undefined)
}
proto.iroha.protocol.AccountResponse.prototype.hasAccount = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.AccountResponse.prototype.getAccountRolesList = function () {
  return jspb.Message.getRepeatedField(this, 2)
}
proto.iroha.protocol.AccountResponse.prototype.setAccountRolesList = function (value) {
  jspb.Message.setField(this, 2, value || [])
}
proto.iroha.protocol.AccountResponse.prototype.addAccountRoles = function (value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index)
}
proto.iroha.protocol.AccountResponse.prototype.clearAccountRolesList = function () {
  this.setAccountRolesList([])
}
goog.provide('proto.iroha.protocol.Asset')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.Asset = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.Asset, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.Asset.displayName = 'proto.iroha.protocol.Asset'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.Asset.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.Asset.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.Asset.toObject = function (includeInstance, msg) {
    var f, obj = {assetId: jspb.Message.getFieldWithDefault(msg, 1, ''), domainId: jspb.Message.getFieldWithDefault(msg, 2, ''), precision: jspb.Message.getFieldWithDefault(msg, 3, 0)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.Asset.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.Asset()
  return proto.iroha.protocol.Asset.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.Asset.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.setAssetId(value)
        break
      case 2:
        var value = reader.readString()
        msg.setDomainId(value)
        break
      case 3:
        var value = reader.readUint32()
        msg.setPrecision(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.Asset.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.Asset.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.Asset.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAssetId()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
  f = message.getDomainId()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getPrecision()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
}
proto.iroha.protocol.Asset.prototype.getAssetId = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.Asset.prototype.setAssetId = function (value) {
  jspb.Message.setProto3StringField(this, 1, value)
}
proto.iroha.protocol.Asset.prototype.getDomainId = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.Asset.prototype.setDomainId = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
proto.iroha.protocol.Asset.prototype.getPrecision = function () {
  return jspb.Message.getFieldWithDefault(this, 3, 0)
}
proto.iroha.protocol.Asset.prototype.setPrecision = function (value) {
  jspb.Message.setProto3IntField(this, 3, value)
}
goog.provide('proto.iroha.protocol.AssetResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Asset')
proto.iroha.protocol.AssetResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.AssetResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.AssetResponse.displayName = 'proto.iroha.protocol.AssetResponse'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.AssetResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.AssetResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.AssetResponse.toObject = function (includeInstance, msg) {
    var f, obj = {asset: (f = msg.getAsset()) && proto.iroha.protocol.Asset.toObject(includeInstance, f)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.AssetResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.AssetResponse()
  return proto.iroha.protocol.AssetResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.AssetResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Asset()
        reader.readMessage(value, proto.iroha.protocol.Asset.deserializeBinaryFromReader)
        msg.setAsset(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.AssetResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.AssetResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.AssetResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAsset()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.Asset.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.AssetResponse.prototype.getAsset = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.Asset, 1)
}
proto.iroha.protocol.AssetResponse.prototype.setAsset = function (value) {
  jspb.Message.setWrapperField(this, 1, value)
}
proto.iroha.protocol.AssetResponse.prototype.clearAsset = function () {
  this.setAsset(undefined)
}
proto.iroha.protocol.AssetResponse.prototype.hasAsset = function () {
  return jspb.Message.getField(this, 1) != null
}
goog.provide('proto.iroha.protocol.ErrorResponse')
goog.provide('proto.iroha.protocol.ErrorResponse.Reason')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.ErrorResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.ErrorResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.ErrorResponse.displayName = 'proto.iroha.protocol.ErrorResponse'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.ErrorResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.ErrorResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.ErrorResponse.toObject = function (includeInstance, msg) {
    var f, obj = {reason: jspb.Message.getFieldWithDefault(msg, 1, 0), message: jspb.Message.getFieldWithDefault(msg, 2, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.ErrorResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.ErrorResponse()
  return proto.iroha.protocol.ErrorResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.ErrorResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readEnum()
        msg.setReason(value)
        break
      case 2:
        var value = reader.readString()
        msg.setMessage(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.ErrorResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.ErrorResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.ErrorResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getReason()
  if (f !== 0.0) {
    writer.writeEnum(1, f)
  }
  f = message.getMessage()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
}
proto.iroha.protocol.ErrorResponse.Reason = {STATELESS_INVALID: 0, STATEFUL_INVALID: 1, NO_ACCOUNT: 2, NO_ACCOUNT_ASSETS: 3, NO_ACCOUNT_DETAIL: 4, NO_SIGNATORIES: 5, NOT_SUPPORTED: 6, NO_ASSET: 7, NO_ROLES: 8}
proto.iroha.protocol.ErrorResponse.prototype.getReason = function () {
  return jspb.Message.getFieldWithDefault(this, 1, 0)
}
proto.iroha.protocol.ErrorResponse.prototype.setReason = function (value) {
  jspb.Message.setProto3EnumField(this, 1, value)
}
proto.iroha.protocol.ErrorResponse.prototype.getMessage = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.ErrorResponse.prototype.setMessage = function (value) {
  jspb.Message.setProto3StringField(this, 2, value)
}
goog.provide('proto.iroha.protocol.RolePermissionsResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.forwardDeclare('proto.iroha.protocol.RolePermission')
proto.iroha.protocol.RolePermissionsResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.RolePermissionsResponse.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.RolePermissionsResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.RolePermissionsResponse.displayName = 'proto.iroha.protocol.RolePermissionsResponse'
}
proto.iroha.protocol.RolePermissionsResponse.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.RolePermissionsResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.RolePermissionsResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.RolePermissionsResponse.toObject = function (includeInstance, msg) {
    var f, obj = {permissionsList: jspb.Message.getRepeatedField(msg, 1)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.RolePermissionsResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.RolePermissionsResponse()
  return proto.iroha.protocol.RolePermissionsResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.RolePermissionsResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readPackedEnum()
        msg.setPermissionsList(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.RolePermissionsResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.RolePermissionsResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.RolePermissionsResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPermissionsList()
  if (f.length > 0) {
    writer.writePackedEnum(1, f)
  }
}
proto.iroha.protocol.RolePermissionsResponse.prototype.getPermissionsList = function () {
  return jspb.Message.getRepeatedField(this, 1)
}
proto.iroha.protocol.RolePermissionsResponse.prototype.setPermissionsList = function (value) {
  jspb.Message.setField(this, 1, value || [])
}
proto.iroha.protocol.RolePermissionsResponse.prototype.addPermissions = function (value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}
proto.iroha.protocol.RolePermissionsResponse.prototype.clearPermissionsList = function () {
  this.setPermissionsList([])
}
goog.provide('proto.iroha.protocol.RolesResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.RolesResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.RolesResponse.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.RolesResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.RolesResponse.displayName = 'proto.iroha.protocol.RolesResponse'
}
proto.iroha.protocol.RolesResponse.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.RolesResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.RolesResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.RolesResponse.toObject = function (includeInstance, msg) {
    var f, obj = {rolesList: jspb.Message.getRepeatedField(msg, 1)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.RolesResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.RolesResponse()
  return proto.iroha.protocol.RolesResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.RolesResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readString()
        msg.addRoles(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.RolesResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.RolesResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.RolesResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getRolesList()
  if (f.length > 0) {
    writer.writeRepeatedString(1, f)
  }
}
proto.iroha.protocol.RolesResponse.prototype.getRolesList = function () {
  return jspb.Message.getRepeatedField(this, 1)
}
proto.iroha.protocol.RolesResponse.prototype.setRolesList = function (value) {
  jspb.Message.setField(this, 1, value || [])
}
proto.iroha.protocol.RolesResponse.prototype.addRoles = function (value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}
proto.iroha.protocol.RolesResponse.prototype.clearRolesList = function () {
  this.setRolesList([])
}
goog.provide('proto.iroha.protocol.SignatoriesResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.SignatoriesResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.SignatoriesResponse.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.SignatoriesResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.SignatoriesResponse.displayName = 'proto.iroha.protocol.SignatoriesResponse'
}
proto.iroha.protocol.SignatoriesResponse.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.SignatoriesResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.SignatoriesResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.SignatoriesResponse.toObject = function (includeInstance, msg) {
    var f, obj = {keysList: msg.getKeysList_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.SignatoriesResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.SignatoriesResponse()
  return proto.iroha.protocol.SignatoriesResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.SignatoriesResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readBytes()
        msg.addKeys(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.SignatoriesResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.SignatoriesResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.SignatoriesResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getKeysList_asU8()
  if (f.length > 0) {
    writer.writeRepeatedBytes(1, f)
  }
}
proto.iroha.protocol.SignatoriesResponse.prototype.getKeysList = function () {
  return jspb.Message.getRepeatedField(this, 1)
}
proto.iroha.protocol.SignatoriesResponse.prototype.getKeysList_asB64 = function () {
  return jspb.Message.bytesListAsB64(this.getKeysList())
}
proto.iroha.protocol.SignatoriesResponse.prototype.getKeysList_asU8 = function () {
  return jspb.Message.bytesListAsU8(this.getKeysList())
}
proto.iroha.protocol.SignatoriesResponse.prototype.setKeysList = function (value) {
  jspb.Message.setField(this, 1, value || [])
}
proto.iroha.protocol.SignatoriesResponse.prototype.addKeys = function (value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}
proto.iroha.protocol.SignatoriesResponse.prototype.clearKeysList = function () {
  this.setKeysList([])
}
goog.provide('proto.iroha.protocol.TransactionsResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.Transaction')
proto.iroha.protocol.TransactionsResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.iroha.protocol.TransactionsResponse.repeatedFields_, null)
}
goog.inherits(proto.iroha.protocol.TransactionsResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.TransactionsResponse.displayName = 'proto.iroha.protocol.TransactionsResponse'
}
proto.iroha.protocol.TransactionsResponse.repeatedFields_ = [1]
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.TransactionsResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.TransactionsResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.TransactionsResponse.toObject = function (includeInstance, msg) {
    var f, obj = {transactionsList: jspb.Message.toObjectList(msg.getTransactionsList(), proto.iroha.protocol.Transaction.toObject, includeInstance)}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.TransactionsResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.TransactionsResponse()
  return proto.iroha.protocol.TransactionsResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.TransactionsResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.Transaction()
        reader.readMessage(value, proto.iroha.protocol.Transaction.deserializeBinaryFromReader)
        msg.addTransactions(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.TransactionsResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.TransactionsResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.TransactionsResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTransactionsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.iroha.protocol.Transaction.serializeBinaryToWriter)
  }
}
proto.iroha.protocol.TransactionsResponse.prototype.getTransactionsList = function () {
  return jspb.Message.getRepeatedWrapperField(this, proto.iroha.protocol.Transaction, 1)
}
proto.iroha.protocol.TransactionsResponse.prototype.setTransactionsList = function (value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value)
}
proto.iroha.protocol.TransactionsResponse.prototype.addTransactions = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.iroha.protocol.Transaction, opt_index)
}
proto.iroha.protocol.TransactionsResponse.prototype.clearTransactionsList = function () {
  this.setTransactionsList([])
}
goog.provide('proto.iroha.protocol.QueryResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.require('proto.iroha.protocol.AccountAssetResponse')
goog.require('proto.iroha.protocol.AccountDetailResponse')
goog.require('proto.iroha.protocol.AccountResponse')
goog.require('proto.iroha.protocol.AssetResponse')
goog.require('proto.iroha.protocol.ErrorResponse')
goog.require('proto.iroha.protocol.RolePermissionsResponse')
goog.require('proto.iroha.protocol.RolesResponse')
goog.require('proto.iroha.protocol.SignatoriesResponse')
goog.require('proto.iroha.protocol.TransactionsResponse')
proto.iroha.protocol.QueryResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.iroha.protocol.QueryResponse.oneofGroups_)
}
goog.inherits(proto.iroha.protocol.QueryResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.QueryResponse.displayName = 'proto.iroha.protocol.QueryResponse'
}
proto.iroha.protocol.QueryResponse.oneofGroups_ = [[1, 2, 3, 4, 5, 6, 7, 8, 9]]
proto.iroha.protocol.QueryResponse.ResponseCase = {RESPONSE_NOT_SET: 0, ACCOUNT_ASSETS_RESPONSE: 1, ACCOUNT_DETAIL_RESPONSE: 2, ACCOUNT_RESPONSE: 3, ERROR_RESPONSE: 4, SIGNATORIES_RESPONSE: 5, TRANSACTIONS_RESPONSE: 6, ASSET_RESPONSE: 7, ROLES_RESPONSE: 8, ROLE_PERMISSIONS_RESPONSE: 9}
proto.iroha.protocol.QueryResponse.prototype.getResponseCase = function () {
  return jspb.Message.computeOneofCase(this, proto.iroha.protocol.QueryResponse.oneofGroups_[0])
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.QueryResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.QueryResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.QueryResponse.toObject = function (includeInstance, msg) {
    var f, obj = {accountAssetsResponse: (f = msg.getAccountAssetsResponse()) && proto.iroha.protocol.AccountAssetResponse.toObject(includeInstance, f),
      accountDetailResponse: (f = msg.getAccountDetailResponse()) && proto.iroha.protocol.AccountDetailResponse.toObject(includeInstance, f),
      accountResponse: (f = msg.getAccountResponse()) && proto.iroha.protocol.AccountResponse.toObject(includeInstance, f),
      errorResponse: (f = msg.getErrorResponse()) && proto.iroha.protocol.ErrorResponse.toObject(includeInstance,
        f),
      signatoriesResponse: (f = msg.getSignatoriesResponse()) && proto.iroha.protocol.SignatoriesResponse.toObject(includeInstance, f),
      transactionsResponse: (f = msg.getTransactionsResponse()) && proto.iroha.protocol.TransactionsResponse.toObject(includeInstance, f),
      assetResponse: (f = msg.getAssetResponse()) && proto.iroha.protocol.AssetResponse.toObject(includeInstance, f),
      rolesResponse: (f = msg.getRolesResponse()) && proto.iroha.protocol.RolesResponse.toObject(includeInstance, f),
      rolePermissionsResponse: (f =
    msg.getRolePermissionsResponse()) && proto.iroha.protocol.RolePermissionsResponse.toObject(includeInstance, f),
      queryHash: jspb.Message.getFieldWithDefault(msg, 10, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.QueryResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.QueryResponse()
  return proto.iroha.protocol.QueryResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.QueryResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.iroha.protocol.AccountAssetResponse()
        reader.readMessage(value, proto.iroha.protocol.AccountAssetResponse.deserializeBinaryFromReader)
        msg.setAccountAssetsResponse(value)
        break
      case 2:
        var value = new proto.iroha.protocol.AccountDetailResponse()
        reader.readMessage(value, proto.iroha.protocol.AccountDetailResponse.deserializeBinaryFromReader)
        msg.setAccountDetailResponse(value)
        break
      case 3:
        var value = new proto.iroha.protocol.AccountResponse()
        reader.readMessage(value, proto.iroha.protocol.AccountResponse.deserializeBinaryFromReader)
        msg.setAccountResponse(value)
        break
      case 4:
        var value = new proto.iroha.protocol.ErrorResponse()
        reader.readMessage(value, proto.iroha.protocol.ErrorResponse.deserializeBinaryFromReader)
        msg.setErrorResponse(value)
        break
      case 5:
        var value = new proto.iroha.protocol.SignatoriesResponse()
        reader.readMessage(value, proto.iroha.protocol.SignatoriesResponse.deserializeBinaryFromReader)
        msg.setSignatoriesResponse(value)
        break
      case 6:
        var value = new proto.iroha.protocol.TransactionsResponse()
        reader.readMessage(value, proto.iroha.protocol.TransactionsResponse.deserializeBinaryFromReader)
        msg.setTransactionsResponse(value)
        break
      case 7:
        var value = new proto.iroha.protocol.AssetResponse()
        reader.readMessage(value, proto.iroha.protocol.AssetResponse.deserializeBinaryFromReader)
        msg.setAssetResponse(value)
        break
      case 8:
        var value = new proto.iroha.protocol.RolesResponse()
        reader.readMessage(value, proto.iroha.protocol.RolesResponse.deserializeBinaryFromReader)
        msg.setRolesResponse(value)
        break
      case 9:
        var value = new proto.iroha.protocol.RolePermissionsResponse()
        reader.readMessage(value, proto.iroha.protocol.RolePermissionsResponse.deserializeBinaryFromReader)
        msg.setRolePermissionsResponse(value)
        break
      case 10:
        var value = reader.readString()
        msg.setQueryHash(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.QueryResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.QueryResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.QueryResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountAssetsResponse()
  if (f != null) {
    writer.writeMessage(1, f, proto.iroha.protocol.AccountAssetResponse.serializeBinaryToWriter)
  }
  f = message.getAccountDetailResponse()
  if (f != null) {
    writer.writeMessage(2, f, proto.iroha.protocol.AccountDetailResponse.serializeBinaryToWriter)
  }
  f = message.getAccountResponse()
  if (f != null) {
    writer.writeMessage(3, f, proto.iroha.protocol.AccountResponse.serializeBinaryToWriter)
  }
  f = message.getErrorResponse()
  if (f != null) {
    writer.writeMessage(4, f, proto.iroha.protocol.ErrorResponse.serializeBinaryToWriter)
  }
  f = message.getSignatoriesResponse()
  if (f != null) {
    writer.writeMessage(5, f, proto.iroha.protocol.SignatoriesResponse.serializeBinaryToWriter)
  }
  f = message.getTransactionsResponse()
  if (f != null) {
    writer.writeMessage(6, f, proto.iroha.protocol.TransactionsResponse.serializeBinaryToWriter)
  }
  f = message.getAssetResponse()
  if (f != null) {
    writer.writeMessage(7, f, proto.iroha.protocol.AssetResponse.serializeBinaryToWriter)
  }
  f = message.getRolesResponse()
  if (f != null) {
    writer.writeMessage(8, f, proto.iroha.protocol.RolesResponse.serializeBinaryToWriter)
  }
  f = message.getRolePermissionsResponse()
  if (f != null) {
    writer.writeMessage(9, f, proto.iroha.protocol.RolePermissionsResponse.serializeBinaryToWriter)
  }
  f = message.getQueryHash()
  if (f.length > 0) {
    writer.writeString(10, f)
  }
}
proto.iroha.protocol.QueryResponse.prototype.getAccountAssetsResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AccountAssetResponse, 1)
}
proto.iroha.protocol.QueryResponse.prototype.setAccountAssetsResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearAccountAssetsResponse = function () {
  this.setAccountAssetsResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasAccountAssetsResponse = function () {
  return jspb.Message.getField(this, 1) != null
}
proto.iroha.protocol.QueryResponse.prototype.getAccountDetailResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AccountDetailResponse, 2)
}
proto.iroha.protocol.QueryResponse.prototype.setAccountDetailResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearAccountDetailResponse = function () {
  this.setAccountDetailResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasAccountDetailResponse = function () {
  return jspb.Message.getField(this, 2) != null
}
proto.iroha.protocol.QueryResponse.prototype.getAccountResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AccountResponse, 3)
}
proto.iroha.protocol.QueryResponse.prototype.setAccountResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearAccountResponse = function () {
  this.setAccountResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasAccountResponse = function () {
  return jspb.Message.getField(this, 3) != null
}
proto.iroha.protocol.QueryResponse.prototype.getErrorResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.ErrorResponse, 4)
}
proto.iroha.protocol.QueryResponse.prototype.setErrorResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearErrorResponse = function () {
  this.setErrorResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasErrorResponse = function () {
  return jspb.Message.getField(this, 4) != null
}
proto.iroha.protocol.QueryResponse.prototype.getSignatoriesResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.SignatoriesResponse, 5)
}
proto.iroha.protocol.QueryResponse.prototype.setSignatoriesResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearSignatoriesResponse = function () {
  this.setSignatoriesResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasSignatoriesResponse = function () {
  return jspb.Message.getField(this, 5) != null
}
proto.iroha.protocol.QueryResponse.prototype.getTransactionsResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.TransactionsResponse, 6)
}
proto.iroha.protocol.QueryResponse.prototype.setTransactionsResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearTransactionsResponse = function () {
  this.setTransactionsResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasTransactionsResponse = function () {
  return jspb.Message.getField(this, 6) != null
}
proto.iroha.protocol.QueryResponse.prototype.getAssetResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.AssetResponse, 7)
}
proto.iroha.protocol.QueryResponse.prototype.setAssetResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 7, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearAssetResponse = function () {
  this.setAssetResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasAssetResponse = function () {
  return jspb.Message.getField(this, 7) != null
}
proto.iroha.protocol.QueryResponse.prototype.getRolesResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.RolesResponse, 8)
}
proto.iroha.protocol.QueryResponse.prototype.setRolesResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 8, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearRolesResponse = function () {
  this.setRolesResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasRolesResponse = function () {
  return jspb.Message.getField(this, 8) != null
}
proto.iroha.protocol.QueryResponse.prototype.getRolePermissionsResponse = function () {
  return jspb.Message.getWrapperField(this, proto.iroha.protocol.RolePermissionsResponse, 9)
}
proto.iroha.protocol.QueryResponse.prototype.setRolePermissionsResponse = function (value) {
  jspb.Message.setOneofWrapperField(this, 9, proto.iroha.protocol.QueryResponse.oneofGroups_[0], value)
}
proto.iroha.protocol.QueryResponse.prototype.clearRolePermissionsResponse = function () {
  this.setRolePermissionsResponse(undefined)
}
proto.iroha.protocol.QueryResponse.prototype.hasRolePermissionsResponse = function () {
  return jspb.Message.getField(this, 9) != null
}
proto.iroha.protocol.QueryResponse.prototype.getQueryHash = function () {
  return jspb.Message.getFieldWithDefault(this, 10, '')
}
proto.iroha.protocol.QueryResponse.prototype.setQueryHash = function (value) {
  jspb.Message.setProto3StringField(this, 10, value)
}
goog.provide('proto.iroha.protocol.ToriiResponse')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
goog.forwardDeclare('proto.iroha.protocol.TxStatus')
proto.iroha.protocol.ToriiResponse = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.ToriiResponse, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.ToriiResponse.displayName = 'proto.iroha.protocol.ToriiResponse'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.ToriiResponse.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.ToriiResponse.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.ToriiResponse.toObject = function (includeInstance, msg) {
    var f, obj = {txStatus: jspb.Message.getFieldWithDefault(msg, 1, 0), txHash: msg.getTxHash_asB64(), errorMessage: jspb.Message.getFieldWithDefault(msg, 3, '')}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.ToriiResponse.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.ToriiResponse()
  return proto.iroha.protocol.ToriiResponse.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.ToriiResponse.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readEnum()
        msg.setTxStatus(value)
        break
      case 2:
        var value = reader.readBytes()
        msg.setTxHash(value)
        break
      case 3:
        var value = reader.readString()
        msg.setErrorMessage(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.ToriiResponse.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.ToriiResponse.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.ToriiResponse.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTxStatus()
  if (f !== 0.0) {
    writer.writeEnum(1, f)
  }
  f = message.getTxHash_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getErrorMessage()
  if (f.length > 0) {
    writer.writeString(3, f)
  }
}
proto.iroha.protocol.ToriiResponse.prototype.getTxStatus = function () {
  return jspb.Message.getFieldWithDefault(this, 1, 0)
}
proto.iroha.protocol.ToriiResponse.prototype.setTxStatus = function (value) {
  jspb.Message.setProto3EnumField(this, 1, value)
}
proto.iroha.protocol.ToriiResponse.prototype.getTxHash = function () {
  return jspb.Message.getFieldWithDefault(this, 2, '')
}
proto.iroha.protocol.ToriiResponse.prototype.getTxHash_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getTxHash())
}
proto.iroha.protocol.ToriiResponse.prototype.getTxHash_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getTxHash())
}
proto.iroha.protocol.ToriiResponse.prototype.setTxHash = function (value) {
  jspb.Message.setProto3BytesField(this, 2, value)
}
proto.iroha.protocol.ToriiResponse.prototype.getErrorMessage = function () {
  return jspb.Message.getFieldWithDefault(this, 3, '')
}
proto.iroha.protocol.ToriiResponse.prototype.setErrorMessage = function (value) {
  jspb.Message.setProto3StringField(this, 3, value)
}
goog.provide('proto.iroha.protocol.TxStatusRequest')
goog.require('jspb.BinaryReader')
goog.require('jspb.BinaryWriter')
goog.require('jspb.Message')
proto.iroha.protocol.TxStatusRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.iroha.protocol.TxStatusRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  proto.iroha.protocol.TxStatusRequest.displayName = 'proto.iroha.protocol.TxStatusRequest'
}
if (jspb.Message.GENERATE_TO_OBJECT) {
  proto.iroha.protocol.TxStatusRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.iroha.protocol.TxStatusRequest.toObject(opt_includeInstance, this)
  }
  proto.iroha.protocol.TxStatusRequest.toObject = function (includeInstance, msg) {
    var f, obj = {txHash: msg.getTxHash_asB64()}
    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}
proto.iroha.protocol.TxStatusRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.iroha.protocol.TxStatusRequest()
  return proto.iroha.protocol.TxStatusRequest.deserializeBinaryFromReader(msg, reader)
}
proto.iroha.protocol.TxStatusRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = reader.readBytes()
        msg.setTxHash(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}
proto.iroha.protocol.TxStatusRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.iroha.protocol.TxStatusRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}
proto.iroha.protocol.TxStatusRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTxHash_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}
proto.iroha.protocol.TxStatusRequest.prototype.getTxHash = function () {
  return jspb.Message.getFieldWithDefault(this, 1, '')
}
proto.iroha.protocol.TxStatusRequest.prototype.getTxHash_asB64 = function () {
  return jspb.Message.bytesAsB64(this.getTxHash())
}
proto.iroha.protocol.TxStatusRequest.prototype.getTxHash_asU8 = function () {
  return jspb.Message.bytesAsU8(this.getTxHash())
}
proto.iroha.protocol.TxStatusRequest.prototype.setTxHash = function (value) {
  jspb.Message.setProto3BytesField(this, 1, value)
}
goog.provide('proto.iroha.protocol.CommandServiceClient')
goog.provide('proto.iroha.protocol.QueryServiceClient')
goog.require('grpc.web.GrpcWebClientBase')
goog.require('grpc.web.AbstractClientBase')
goog.require('grpc.web.ClientReadableStream')
goog.require('grpc.web.Error')
goog.require('proto.google.protobuf.Empty')
goog.require('proto.iroha.protocol.BlockQueryResponse')
goog.require('proto.iroha.protocol.BlocksQuery')
goog.require('proto.iroha.protocol.Query')
goog.require('proto.iroha.protocol.QueryResponse')
goog.require('proto.iroha.protocol.ToriiResponse')
goog.require('proto.iroha.protocol.Transaction')
goog.require('proto.iroha.protocol.TxStatusRequest')
goog.scope(function () {
  proto.iroha.protocol.CommandServiceClient = function (hostname, credentials, options) {
    this.client_ = new grpc.web.GrpcWebClientBase(options)
    this.hostname_ = hostname
    this.credentials_ = credentials
    this.options_ = options
  }
  var methodInfo_Torii = new grpc.web.AbstractClientBase.MethodInfo(proto.google.protobuf.Empty, function (request) {
    return request.serializeBinary()
  }, proto.google.protobuf.Empty.deserializeBinary)
  proto.iroha.protocol.CommandServiceClient.prototype.torii = function (request, metadata, callback) {
    return this.client_.rpcCall(this.hostname_ + '/iroha.protocol.CommandService/Torii', request, metadata, methodInfo_Torii, callback)
  }
  var methodInfo_Status = new grpc.web.AbstractClientBase.MethodInfo(proto.iroha.protocol.ToriiResponse, function (request) {
    return request.serializeBinary()
  }, proto.iroha.protocol.ToriiResponse.deserializeBinary)
  proto.iroha.protocol.CommandServiceClient.prototype.status = function (request, metadata, callback) {
    return this.client_.rpcCall(this.hostname_ + '/iroha.protocol.CommandService/Status', request, metadata, methodInfo_Status, callback)
  }
  var methodInfo_StatusStream = new grpc.web.AbstractClientBase.MethodInfo(proto.iroha.protocol.ToriiResponse, function (request) {
    return request.serializeBinary()
  }, proto.iroha.protocol.ToriiResponse.deserializeBinary)
  proto.iroha.protocol.CommandServiceClient.prototype.statusStream = function (request, metadata) {
    return this.client_.serverStreaming(this.hostname_ + '/iroha.protocol.CommandService/StatusStream', request, metadata, methodInfo_StatusStream)
  }
  proto.iroha.protocol.QueryServiceClient = function (hostname, credentials, options) {
    this.client_ = new grpc.web.GrpcWebClientBase(options)
    this.hostname_ = hostname
    this.credentials_ = credentials
    this.options_ = options
  }
  var methodInfo_Find = new grpc.web.AbstractClientBase.MethodInfo(proto.iroha.protocol.QueryResponse, function (request) {
    return request.serializeBinary()
  }, proto.iroha.protocol.QueryResponse.deserializeBinary)
  proto.iroha.protocol.QueryServiceClient.prototype.find = function (request, metadata, callback) {
    return this.client_.rpcCall(this.hostname_ + '/iroha.protocol.QueryService/Find', request, metadata, methodInfo_Find, callback)
  }
  var methodInfo_FetchCommits = new grpc.web.AbstractClientBase.MethodInfo(proto.iroha.protocol.BlockQueryResponse, function (request) {
    return request.serializeBinary()
  }, proto.iroha.protocol.BlockQueryResponse.deserializeBinary)
  proto.iroha.protocol.QueryServiceClient.prototype.fetchCommits = function (request, metadata) {
    return this.client_.serverStreaming(this.hostname_ + '/iroha.protocol.QueryService/FetchCommits', request, metadata, methodInfo_FetchCommits)
  }
})
