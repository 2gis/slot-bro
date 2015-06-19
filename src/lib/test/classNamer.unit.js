import { assert } from 'chai';
import * as classNamer from '../classNamer';
import _ from 'lodash';

describe('lib/classNamer', function() {
    it('should make proper modifier classes', function() {
        var src = {
            'mod1': true,
            'mod2': false,
            'mod3': 254,
            'mod4': 'ololo'
        };

        var expected = {
            'mod1': '_mod1',
            'mod2': '',
            'mod3': '_mod3_254',
            'mod4': '_mod4_ololo'
        };

        _.each(src, function(value, key) {
            assert.equal(classNamer.modificatorClass(key, value), expected[key]);
        });
    });

    it('should properly parse modifiers string', function() {
        var src = [
            'module__element _mod1',
            'module__element _mod1_value',
            'module__element _mod1_value _mod2_val2',
            'module__element _mod1_123'
        ];

        var expected = [
            {'mod1': true},
            {'mod1': 'value'},
            {'mod1': 'value', 'mod2': 'val2'},
            {'mod1': 123}
        ];

        _.each(src, function(value, key) {
            assert.deepEqual(classNamer.parseMods(value), expected[key]);
        });
    });

    it('should properly stringify modifiers object', function() {
        var src = [
            {'mod1': true, 'mod2': false},
            {'mod1': 'value'},
            {'mod1': 'value', 'mod2': 'val2'},
            {'mod1': 123, 'mod2': true}
        ];

        var expected = [
            ['_mod1'],
            ['_mod1_value'],
            ['_mod1_value', '_mod2_val2'],
            ['_mod1_123', '_mod2']
        ];

        _.each(src, function(value, key) {
            assert.deepEqual(classNamer.stringifyMods(value), expected[key]);
        });
    });
});
