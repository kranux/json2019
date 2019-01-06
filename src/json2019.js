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

function stringify(obj, replacer, context = contexts.topLevel, key = "") {
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
  ].find(([condition]) => condition())[1](obj, replacer, context, key);
}

function stringifyObject(obj, replacer, context, key) {
  if (obj === null) {
    return "null";
  } else if (typeof obj.toJSON === "function") {
    const param = context === contexts.topLevel ? "" : key;
    return stringify(obj.toJSON.call(obj, param, key));
  } else {
    return `{${Object.keys(obj)
      .map(key => ({
        key,
        value: stringifyEntry(key, obj[key])
      }))
      .filter(({ value }) => Boolean(value))
      .map(({ key, value }) => `"${key}":${value}`)
      .join(",")}}`;
  }

  function stringifyEntry(key, value) {
    if (typeof replacer === "function") {
      return replacer.call(obj, key, value);
    }
    return stringify(value, replacer, contexts.object, key);
  }
}

function stringifyArray(obj, replacer) {
  return `[${obj
    .map((obj, key) => stringify(obj, replacer, contexts.array, key))
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

function stringifyEmptyValue(_, replacer, context) {
  return [contexts.topLevel, contexts.object].includes(context)
    ? undefined
    : "null";
}
