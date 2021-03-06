/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var nodeunit = require('../nodeunit'),
    sys = require('sys'),
    path = require('path');

/**
 * Run all tests within each module, reporting the results to the command-line.
 *
 * @param {Array} files
 * @api public
 */

exports.run = function (files, options) {

    var error = function (str) {
        return options.error_prefix + str + options.error_suffix;
    };
    var ok    = function (str) {
        return options.ok_prefix + str + options.ok_suffix;
    };
    var bold  = function (str) {
        return options.bold_prefix + str + options.bold_suffix;
    };
    var assertion_message = function (str) {
        return options.assertion_prefix + str + options.assertion_suffix;
    };

    var start = new Date().getTime();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });

    nodeunit.runFiles(paths, {
        moduleStart: function (name) {
            sys.puts('\n' + bold(name));
        },
        testDone: function (name, assertions) {
            if (assertions.failures) {
                sys.puts(error('✖ ' + name) + '\n');
                assertions.forEach(function (assertion) {
                    if (assertion.failed()) {
                        if (assertion.message) {
                            sys.puts(
                                'Assertion Message: ' + assertion_message(assertion.message)
                            );
                        }
                        sys.puts(assertion.error.stack + '\n');
                    }
                });
            }
        },
        moduleDone: function (name, assertions) {
            if (!assertions.failures) {
                sys.puts('✔ all tests passed');
            }
            else {
                sys.puts(error('✖ some tests failed'));
            }
        },
        done: function (assertions) {
            var end = new Date().getTime();
            var duration = end - start;
            if (assertions.failures) {
                sys.puts(
                    '\n' + bold(error('FAILURES: ')) + assertions.failures +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)'
                );
            }
            else {
                sys.puts(
                    '\n' + bold(ok('OK: ')) + assertions.length +
                    ' assertions (' + assertions.duration + 'ms)'
                );
            }
            process.reallyExit(assertions.failures);
        }
    });
};
