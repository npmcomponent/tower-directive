
var content = require('tower-content');
var document = 'undefined' !== typeof window && document;

if ('undefined' === typeof window) {
  var directive = require('..');
  var assert = require('assert');
  var jsdom = require('jsdom').jsdom;
  var fs = require('fs');
  var path = require('path');
  document = jsdom(fs.readFileSync(path.join(__dirname, 'index.html')));
} else {
  var directive = require('tower-directive');
  var assert = require('timoxley-assert'); 
}

describe('directive', function(){
  beforeEach(directive.clear);

  it('should define', function(done){
    directive.on('define', function(instance){
      assert('property' === instance.name);
      done();
    });

    directive('property');
  });

  it('#has', function(){
    assert(false === directive.has('property'));
    directive('property');
    assert(true === directive.has('property'));
  });

  it('should execute (and return a content)', function(done){
    var el = document.querySelector('#mocha');
    var scope = content.root();

    directive('data-title', function(passedScope, passedEl){
      assert(scope === passedScope);
      assert(el === passedEl);
      done();
    });

    var fn = directive('data-title').compile(el);
    fn(scope, el);
  });
  
  it('should print "directive(name)" on instance.toString()', function(){
    assert('directive("data-text")' === directive('data-text').toString());
  });

  it('should print "directive" on exports.toString()', function(){
    assert('directive' === directive.toString());
  });

  it('should support custom elements', function(done){
    var el = document.querySelector('background');

    directive('background', function(scope, el, exp, nodeFn, attrs){
      assert('<background src="url"></background>' === el.outerHTML);
      done();
    }).types({ element: true });

    var scope = content('random').init({ url: '/foo.jpg' });
    var fn = directive('background').compile(el);
    fn(scope, el);
  });

  it('should support comments', function(){
    var el = document.querySelector('#precompiled-list');

    directive('data-each', function(scope, el, exp){
      // XXX
    }).types({ comment: true });

    var posts = [
      { title: 'One' },
      { title: 'Two' },
      { title: 'Three' }
    ];

    var scope = content('random').init({ posts: posts });
    var fn = directive('data-each').compile(el);
    fn(scope, el);
  });

  it('should return a custom content', function(){
    var el = document.querySelector('#mocha');
    var scope = content('custom').init();

    directive('data-title', function(passedScope, passedEl){
      return scope;
    });

    var fn = directive('data-title').compile(el);
    assert(scope === fn(scope, el));
  });
});