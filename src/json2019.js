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

function stringify(obj, context = contexts.topLevel, key = "") {
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
  ].find(([condition]) => condition())[1](obj, context, key);
}

function stringifyObject(obj, context, key) {
  if (obj === null) {
    return "null";
  } else if (typeof obj.toJSON === "function") {
    const param = context === contexts.topLevel ? "" : key;
    return stringify(obj.toJSON.call(obj, param, key));
  } else {
    return `{${Object.keys(obj)
      .map(key => `"${key}":${stringify(obj[key], contexts.object, key)}`)
      .join(",")}}`;
  }
}

function stringifyArray(obj) {
  return `[${obj
    .map((obj, key) => stringify(obj, contexts.array, key))
    .join(",")}]`;
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
