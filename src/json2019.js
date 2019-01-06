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
      () => ["function", "symbol", "undefined"].includes(objType),
      stringifyEmptyValue
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
      .map(key => ({ key, value: stringify(obj[key], contexts.object, key) }))
      .filter(({ value }) => Boolean(value))
      .map(({ key, value }) => `"${key}":${value}`)
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

const stringReplacements = {
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t"
};

function stringifyString(str) {
  const replaced = Object.keys(stringReplacements).reduce(
    (acc, replacer) => acc.replace(replacer, stringReplacements[replacer]),
    str.toString()
  );

  return `"${replaced}"`;
}

function stringifyBoolean(bool) {
  return bool.toString();
}

function stringifyEmptyValue(_, context) {
  return [contexts.topLevel, contexts.object].includes(context)
    ? undefined
    : "null";
}
