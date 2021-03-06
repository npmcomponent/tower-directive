
/**
 * Module dependencies.
 */

// commented out by npm-component: var Emitter = require('tower-emitter');
// commented out by npm-component: var compile = require('tower-directive-expression');
// commented out by npm-component: var content = require('tower-content');
var statics = require('./lib/statics');
var proto = require('./lib/proto');

/**
 * Global document (for client and server).
 */

var document = 'undefined' === typeof document
  ? undefined // tower/server-dom
  : window.document;

/**
 * Expose `directive`.
 */

exports = module.exports = directive;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Get/set directive function.
 * 
 * @param {String} name The directive's name.
 * @param {Function} fn Function called on directive definition.
 * @return {Directive} A `Directive` object.
 * @api public
 */

function directive(name, fn, manualCompile) {
  if (undefined === fn && exports.collection[name])
    return exports.collection[name];

  /**
   * Class representing the extensions to HTML.
   *
   * @class
   *
   * @param {String} name The directive's name.
   * @param {Function} The directive function to be executed.
   * @api private
   */

  function Directive(el, attrs) {
    this.name = name;
    this.attrs = attrs;
    this.document = document;

    // attribute, text, element, comment
    if (1 === el.nodeType) {
      if (this.element) {
        // XXX: compile attributes for element?
      } else if (this.attribute) {
        var val = el.getAttribute(this.name);
        if (val) {
          attrs[this.name] = exports.expression(Directive._expression, val);
        }
      }
    }
  }

  Directive.id = name;
  Directive.expressions = {};
  Directive.prototype.attribute = true;
  Directive.prototype.processChildren = true;

  if (fn) {
    if (manualCompile || 1 === fn.length) {
      Directive._compile = fn;
    } else {
      Directive._exec = fn;
    }
  }

  for (var key in statics) Directive[key] = statics[key];
  for (var key in proto) Directive.prototype[key] = proto[key];

  exports.collection[name] = Directive;
  exports.collection.push(Directive);
  exports.emit('define', Directive);
  return Directive;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Get/compile directive expression.
 */

exports.expression = function(name, val, opts, fn){
  var Directive = exports(name);
  return Directive.expressions[val]
    = Directive.expressions[val]
    || compile.apply(null, arguments);
};

/**
 * Check if a directive is defined.
 *
 * @param {String} name A directive name.
 * @return {Boolean} true if the `Directive` has been defined, but false otherwise
 * @api public
 */

exports.defined = function(name){
  return exports.collection.hasOwnProperty(name);
};

/**
 * Clear all directives.
 *
 * @chainable
 * @return {Function} exports The main `directive` function.
 * @api public
 */

exports.clear = function(){
  exports.off();
  exports.collection = [];
  return exports;
};