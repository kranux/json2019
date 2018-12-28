module.exports = {
  parse: parse,
  stringify: stringify
};

function parse(string) {
  const result = null;
  return result;
}

function stringify(obj, level = 0) {
  if (Array.isArray(obj)) {
    return stringifyArray(obj);
  } else if (typeof obj === "object") {
    return stringifyObject(obj);
  } else if (typeof obj === "string") {
    return level === 0 ? obj : `'${obj}'`;
  } else if (["boolean", "number"].includes(typeof obj)) {
    return obj.toString();
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
