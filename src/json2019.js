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
    return context === contexts.topLevel ? obj : `'${obj}'`;
  } else if (["boolean", "number"].includes(objType)) {
    return obj.toString();
  } else if (obj === undefined || ["function", "symbol"].includes(objType)) {
    return context === contexts.topLevel ? "undefined" : "null";
  }
}

function stringifyObject(obj) {
  if (Object.keys(obj).length === 0) {
    return "{}";
  }
}

function stringifyArray(obj, level) {
  return `[${obj.map(o => stringify(o, level + 1)).join(",")}]`;
}
