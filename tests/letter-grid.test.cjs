const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
test('native keyboard follows active cell, including a wrapped row; stale measurements are ignored', () => {
  let definition;
  const callbacks = [];
  vm.runInNewContext(fs.readFileSync('components/letter-grid/index.js', 'utf8'), {
    Component(value) { definition = value; }, wx: { nextTick(fn) { fn(); } },
  });
  const instance = {
    data: {}, setData(value) { Object.assign(this.data, value); },
    createSelectorQuery() {
      return { select() { return this; }, boundingClientRect() { return this; }, exec(fn) { callbacks.push(fn); } };
    },
  };
  Object.assign(instance, definition.methods);
  instance.positionKeyboard(); instance.positionKeyboard();
  callbacks[1]([{left:20,top:200}, {left:80,top:320,width:20,height:40}]);
  assert.equal(instance.data.keyboardStyle, 'left:70px;top:120px;height:40px;');
  callbacks[0]([{left:20,top:200}, {left:20,top:220,width:20,height:40}]);
  assert.equal(instance.data.keyboardStyle, 'left:70px;top:120px;height:40px;');
});
