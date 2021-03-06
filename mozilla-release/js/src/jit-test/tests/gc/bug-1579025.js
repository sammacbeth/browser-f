// Test that a zone GC collects the selected zones.

gczeal(0);
gc();

let z1 = this;
let z2 = newGlobal({newCompartment: true});

// Initially nothing is being collected.

assertEq(gcstate(), "NotActive");
assertEq(gcstate(z1), "NoGC");
assertEq(gcstate(z2), "NoGC");

// No zones selected => full GC.

startgc(1);
assertEq(gcstate(), "Mark");
assertEq(gcstate(z1), "MarkBlackOnly");
assertEq(gcstate(z2), "MarkBlackOnly");
finishgc();

// Use of schedulezone() => zone GC.

schedulezone(z1);
startgc(1);
assertEq(gcstate(), "Mark");
assertEq(gcstate(z1), "MarkBlackOnly");
assertEq(gcstate(z2), "NoGC");
finishgc();

schedulezone(z2);
startgc(1);
assertEq(gcstate(), "Mark");
assertEq(gcstate(z1), "NoGC");
assertEq(gcstate(z2), "MarkBlackOnly");
finishgc();

schedulezone(z1);
schedulezone(z2);
startgc(1);
assertEq(gcstate(), "Mark");
assertEq(gcstate(z1), "MarkBlackOnly");
assertEq(gcstate(z2), "MarkBlackOnly");
finishgc();
