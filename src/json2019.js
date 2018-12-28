module.exports = {
  parse: parse,
  stringify: stringify
};

const contexts = {
  array: "array",
  object: "object",
  topLevel: "topLevel"
};

function parse(string) {
  const result = null;
  return result;
}

function stringify(obj, context = contexts.topLevel) {
  const objType = typeof obj;

  return [
    [() => Array.isArray(obj), stringifyArray],
    [() => obj instanceof Date, obj => stringifyString(obj.toISOString())],
    [() => obj instanceof String, stringifyString],
    [() => obj instanceof Number, stringifyNumber],
    [() => obj instanceof Boolean, stringifyBoolean],
    [() => objType === "string", stringifyString],
    [() => objType === "object", stringifyObject],
    [() => objType === "number", stringifyNumber],
    [() => objType === "boolean", stringifyBoolean],
    [
      () => obj === undefined || ["function", "symbol"].includes(objType),
      (_, context) => (context === contexts.topLevel ? "undefined" : "null")
    ]
  ].find(([condition]) => condition())[1](obj, context);
}

function stringifyObject(obj) {
  if (obj === null) {
    return "null";
  } else {
    return `{${Object.keys(obj)
      .map(key => `"${key}":${stringify(obj[key], contexts.object)}`)
      .join(",")}}`;
  }
}

function stringifyArray(obj) {
  return `[${obj.map(o => stringify(o, contexts.array)).join(",")}]`;
}

function stringifyNumber(obj) {
  return Number.isFinite(obj.valueOf()) ? obj.toString() : "null";
}

function stringifyString(str) {
  return `"${str.toString()}"`;
}

function stringifyBoolean(bool) {
  return bool.toString();
}
