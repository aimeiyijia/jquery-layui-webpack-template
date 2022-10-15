var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var utils = require('loader-utils');

module.exports = function() {
  // ...
};

module.exports.pitch = function(request) {
  var query = utils.parseQuery(this.query);
  var compiler = createCompiler(this, request, {
    filename: query.name
  });
  runCompiler(compiler, this.async());
};

function runCompiler(compiler, callback) {
  compiler.runAsChild(function(error, entries) {
    if (error) {
      callback(error);
    } else if (entries[0]){
      var url = entries[0].files[0];
      callback(null, getSource(url));;
    } else {
      callback(null, null);
    }
  });
}

function createCompiler(loader, request, options) {
  var compiler = getCompilation(loader).createChildCompiler('iframe', options);
  var plugin = new SingleEntryPlugin(loader.context, '!!' + request, 'main')
  compiler.apply(plugin);
  var subCache = 'subcache ' + __dirname + ' ' + request;
  compiler.plugin('compilation', function(compilation) {
    if (!compilation.cache) {
      return;
    }
    if (!compilation.cache[subCache]) {
      compilation.cache[subCache] = {};
    }
    compilation.cache = compilation.cache[subCache];
  });
  return compiler;
}

function getSource(url) {
  return '' +
    'var iframe = document.createElement(\'iframe\');\n' +
    'iframe.style.visibility = \'hidden\';\n' +
    'iframe.style.width = 0;\n' +
    'iframe.style.height = 0;\n' +
    'iframe.style.position = \'fixed\';\n' +
    'function injectScript() {\n' +
    '  var childDocument = iframe.contentWindow.document;\n' +
    '  var script = childDocument.createElement(\'script\');\n' +
    '  script.src = ' + JSON.stringify(url) + ';\n' +
    '  script.type = \'text/javascript\';\n' +
    '  childDocument.body.appendChild(script);\n' +
    '}\n' +
    'if (iframe.attachEvent) {\n' +
    '  iframe.attachEvent(\'onload\', injectScript);\n' +
    '} else {\n' +
    '  iframe.addEventListener(\'load\', injectScript);\n' +
    '}\n' +
    'document.body.appendChild(iframe);\n' +
    'module.exports = iframe;';
}

function getCompilation(loader) {
  return loader._compilation;
}