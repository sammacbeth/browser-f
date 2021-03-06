// Debugger.Frame.prototype.constructing on a generator.

load(libdir + "asserts.js");

const g = newGlobal({ newCompartment: true });
const dbg = Debugger(g);

g.eval(`
function* f() {}
`);

let frame;
dbg.onEnterFrame = function(f) {
  frame = f;
  assertEq(frame.constructing, false);
};

const it = g.f();

assertEq(frame.constructing, false);
frame = null;

it.next();

assertEq(!!frame, true);
// Throws because the frame has terminated.
assertThrowsInstanceOf(() => frame.constructing, Error);
