
/**
 * Module dependencies.
 */

var event = require('event'); // XXX: this file should be moved to separate module.

/**
 * Expose `directives`.
 */

module.exports = directives;

/**
 * Attributes supported.
 */

var attrs = [
  'id',
  'src',
  'rel',
  'cols',
  'rows',
  'name',
  'href',
  'title',
  'style',
  'width',
  'value',
  'height',
  'tabindex',
  'placeholder'
];

/**
 * Events supported.
 */

var events = [
  'change',
  'click',
  'mousedown',
  'mouseup',
  'blur',
  'focus',
  'input',
  'keydown',
  'keypress',
  'keyup'
];

/**
 * Define base directives.
 */

function directives(directive) {
  
  // creates a new scope

  directive('data-scope', function(scope, element, attr){
    // XXX: somehow add new scope to above `scope` as child.
  });

  directive('data-text', function(scope, element, attr){
    element.textContent = scope[attr.value];
  });

  // attr directives

  for (var i = 0, n = attrs.length; i < n; i++) {
    attrDirective(attrs[i]);
  }

  // event directives

  for (var i = 0, n = events.length; i < n; i++) {
    eventDirective(events[i]);
  }

  function attrDirective(name) {
    directive('data-' + name, function(scope, element, attr){
      element.setAttribute(name, scope[attr.value]);
    });
  }

  function eventDirective(name) {
    directive('on-' + name, function(scope, element, attr){
      event.bind(element, name, function(evt){
        evt.preventDefault();
        // XXX: some way of passing parameters (shouldn't pass `evt`).
        scope[attr.value](evt);
      });
    });
  }
}