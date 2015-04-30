(function () {
  "use strict";

  self.console = {
    log: function () {
      postMessage({
        type    : "console"
        , value : Array.prototype.slice.call(arguments)
      });
    }
  };
  self.prompt = function () {
    return 'Input not supported in demo';
  };
  
  importScripts('python.js');

  var output           = ""
    , flushesPerSecond = 10
    , flushDelay       = 1000/flushesPerSecond
    , handlers         = {
        evaluate : function(value) {
          console.log('evaluating...');
          output    = "";
          startTime = Date.now();
          
          var result = Python.eval(value);

          if (output) {
            postMessage({
                type  : "output"
              , value : output
            });
          }

          if (result !== undefined) {
            postMessage({
                type  : "result"
              , value : result
            });
          }
          else {
            postMessage({
              type : "error"
            });
          }
        }
      } 
    , outputAndError = function(chr) {
        var value;

        if (chr === null) return;

        output += String.fromCharCode(chr);

        now = Date.now()

        if (now - startTime >= flushDelay) {
          startTime = now;
          value     = output;
          output    = "";
          postMessage({
              type  : "output"
            , value : value
          });
        }
      }
    , now, startTime;

  addEventListener('message', function (e) {
    if (e && e.data && e.data.type && handlers[e.data.type]) {
      handlers[e.data.type](e.data.value);
    }
  }, false);

  Python.initialize(null, outputAndError, outputAndError);

  postMessage({
    type : 'ready'
  });
})();
