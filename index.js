// Generated by CoffeeScript 1.10.0
(function() {
  var namespace, postcss;

  postcss = require('postcss');

  namespace = postcss.plugin('postcss-namespace', function(opts) {
    if (opts == null) {
      opts = {
        token: '-'
      };
    }
    return function(css) {
      var atNamespace, name1, namespaceGroup;
      atNamespace = (function() {
        var current, data, get, next, reset;
        current = 0;
        data = [];
        reset = function() {
          current = 0;
          return this;
        };
        next = function() {
          current++;
          return this;
        };
        get = function() {
          var target;
          target = data[current];
          if (current != null) {
            next = data[current + 1];
            return {
              name: target.name,
              line: target.line,
              nextLine: next != null ? next.line : void 0
            };
          } else {
            return null;
          }
        };
        return {
          reset: reset,
          next: next,
          get: get,
          data: data
        };
      })();
      namespaceGroup = {};
      css.walkAtRules('namespace', function(rule) {
        var line, name;
        name = rule.params;
        line = rule.source.start.line;
        atNamespace.data.push({
          name: name,
          line: line
        });
        return rule.remove();
      });
      if (atNamespace.data.length === 0) {
        return;
      }
      namespace = atNamespace.get();
      namespaceGroup[name1 = namespace.name] || (namespaceGroup[name1] = []);
      css.walkRules(function(rule) {
        var currentLine, first, name2;
        currentLine = rule.source.start.line;
        if (currentLine < namespace.line) {
          return rule;
        }
        if ((namespace.nextLine != null) && currentLine > namespace.nextLine) {
          while ((namespace != null) && currentLine > namespace.nextLine) {
            namespace = atNamespace.next().get();
            namespaceGroup[name2 = namespace.name] || (namespaceGroup[name2] = []);
          }
        }
        if (currentLine > namespace.line) {
          if (!/\s*(?:\.|#)/.test(rule.selector)) {
            return rule;
          }
          first = rule.selector.split(/\s/)[0];
          namespaceGroup[namespace.name];
          if (!new RegExp(first).test(namespaceGroup[namespace.name].join(','))) {
            return namespaceGroup[namespace.name].push(first);
          }
        }
      });
      namespace = atNamespace.reset().get();
      return css.walkRules(function(rule) {
        var currentLine, matched, re, result, selector;
        currentLine = rule.source.start.line;
        if (currentLine < namespace.line) {
          return rule;
        }
        result = '';
        if ((namespace.nextLine != null) && currentLine > namespace.nextLine) {
          while ((namespace != null) && currentLine > namespace.nextLine) {
            namespace = atNamespace.next().get();
          }
        }
        if (currentLine > namespace.line) {
          re = /\s*(?:>|\+|~)?\s*(\.|#)[^\s]+/g;
          while ((matched = re.exec(rule.selector)) != null) {
            matched = matched[0];
            selector = matched.match(/[^\s]+$/)[0];
            if (new RegExp(selector).test(namespaceGroup[namespace.name].join(','))) {
              if (namespace.name) {
                result += matched.replace(/(\.|#)/, function(selectorToken) {
                  return selectorToken + namespace.name + opts.token;
                });
              } else {
                result += matched;
              }
            } else {
              result += matched;
            }
          }
        }
        rule.selector = result;
        return rule;
      });
    };
  });

  module.exports = namespace;

}).call(this);
