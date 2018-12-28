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
  if (Array.isArray(obj)) {
    return stringifyArray(obj);
  } else if (objType === "object") {
    return stringifyObject(obj);
  } else if (objType === "string") {
    return `"${obj}"`;
  } else if (objType === "number") {
    return stringifyNumber(obj);
  } else if (objType === "boolean") {
    return obj.toString();
  } else if (obj === undefined || ["function", "symbol"].includes(objType)) {
    return context === contexts.topLevel ? "undefined" : "null";
  }
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
  return Number.isFinite(obj) ? obj.toString() : "null";
}
