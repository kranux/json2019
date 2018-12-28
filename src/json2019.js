module.exports = {
  parse: parse,
  stringify: stringify
};

function parse(string) {
  const result = null;
  return result;
}

function stringify(obj) {
  let result = "";
  if (typeof obj === "object") {
    result = stringifyObject(obj);
  } else if (["boolean", "string", "number"].includes(typeof obj)) {
    result = obj.toString();
  }

  return result;
}

function stringifyObject(obj) {
  if (Object.keys(obj).length === 0) {
    return "{}";
  }
}