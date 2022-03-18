function sanitizeEval(eq) {
  return eq.replaceAll(/[^-()\d\/*+.x^]/g, "").replaceAll("^", "**");
}

function trueEval(eq, x = 0) {
  return new Function(`return ${eq.replaceAll(/x/g, x)}`)();
}

function evaluate(eq, x = 0) {
  const func = sanitizeEval(eq);
  return trueEval(func, x);
}
