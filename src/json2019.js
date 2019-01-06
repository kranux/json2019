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

function stringify(
  obj,
  replacer,
  spacer,
  context = contexts.topLevel,
  key = "",
  depth = 1
) {
  const objType = typeof obj;

  return [
    [() => Array.isArray(obj), stringifyArray],
    [() => obj instanceof Date, obj => stringifyString(obj.toISOString())],
    [() => obj instanceof String || objType === "string", stringifyString],
    [() => obj instanceof Number || objType === "number", stringifyNumber],
    [() => obj instanceof Boolean || objType === "boolean", stringifyBoolean],
    [() => objType === "object", stringifyObject],
    [
      () => ["function", "symbol", "undefined"].includes(objType),
      stringifyEmptyValue
    ]
  ].find(([condition]) => condition())[1](
    obj,
    replacer,
    spacer,
    context,
    key,
    depth
  );
}

function stringifyObject(obj, replacer, spacer, context, key, depth) {
  if (obj === null) {
    return "null";
  } else if (isCallable(obj.toJSON)) {
    const param = context === contexts.topLevel ? "" : key;
    return stringify(obj.toJSON.call(obj, param, key));
  } else {
    return stringifyEntries(obj);
  }

  function getSpacer(depth) {
    return " ".repeat(depth * spacer);
  }

  function wrapString(str) {
    return spacer ? `{${str}\n${getSpacer(depth - 1)}}` : `{${str}}`;
  }

  function formatEntry({ key, value }) {
    return spacer
      ? `\n${getSpacer(depth)}"${key}": ${value}`
      : `"${key}":${value}`;
  }

  function stringifyEntries(object) {
    return wrapString(
      Object.keys(object)
        .map(key => ({
          key,
          value: stringifyEntry({
            context: contexts.object,
            key,
            object,
            replacer,
            spacer,
            depth,
            value: object[key]
          })
        }))
        .filter(({ value }) => Boolean(value))
        .map(formatEntry)
        .join(",")
    );
  }
}

function stringifyEntry({
  object,
  key,
  value,
  replacer,
  context,
  spacer,
  depth
}) {
  const replaced = getReplacerFunction(replacer).call(object, key, value);
  return stringify(replaced, replacer, spacer, context, key, (depth += 1));
}

function getReplacerFunction(replacer) {
  if (isCallable(replacer)) {
    return replacer;
  } else if (Array.isArray(replacer)) {
    return (key, value) => (replacer.includes(key) ? value : undefined);
  }
  return (_, value) => value;
}

function stringifyArray(object, replacer, spacer) {
  return `[${object
    .map((obj, key) =>
      stringifyEntry({
        context: contexts.array,
        key,
        object,
        replacer,
        spacer,
        value: obj
      })
    )
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
  return `"${Object.keys(stringReplacements).reduce(
    (acc, replacer) => acc.replace(replacer, stringReplacements[replacer]),
    str.toString()
  )}"`;
}

function stringifyBoolean(bool) {
  return bool.toString();
}

function stringifyEmptyValue(_, _, _, context) {
  return [contexts.topLevel, contexts.object].includes(context)
    ? undefined
    : "null";
}

function isCallable(f) {
  return typeof f === "function";
}
