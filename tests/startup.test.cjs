const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup() {
  let definition, callback, cleared = 0, events = 0, delay;
  vm.runInNewContext(fs.readFileSync('components/startup-motion/index.js', 'utf8'), {
    Component(value) { definition = value; },
    setTimeout(fn, ms) { callback = fn; delay = ms; return 1; },
    clearTimeout() { cleared++; },
  });
  const instance = { triggerEvent(name) { assert.equal(name, 'done'); events++; } };
  Object.assign(instance, definition.methods);
  return { definition, instance, ready() { definition.lifetimes.ready.call(instance); }, fire() { callback(); }, events: () => events, cleared: () => cleared, delay: () => delay };
}
test('startup automatically finishes after 1400ms from ready', () => {
  const s = setup(); s.ready(); assert.equal(s.delay(), 1400); assert.equal(s.events(), 0); s.fire(); assert.equal(s.events(), 1);
});
test('tap skips startup and completion cannot fire twice', () => {
  const s = setup(); s.ready(); s.instance.finish(); s.fire(); s.instance.finish(); assert.equal(s.events(), 1); assert.ok(s.cleared());
});
test('detaching startup clears its pending timer', () => {
  const s = setup(); s.ready(); s.definition.lifetimes.detached.call(s.instance); assert.equal(s.cleared(), 1); assert.equal(s.events(), 0);
});
