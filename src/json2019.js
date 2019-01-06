module.exports = {
  parse: parse,
  stringify: stringify
};

const contexts = {
  array: "array",
  object: "object",
  topLevel: "topLevel"
};

const maxPadChars = 10;

function parse(string) {
  const result = null;
  return result;
}

function stringify(object, replacer, spacer) {
  return stringifyHandler({ object, replacer, spacer });
}

function stringifyHandler({
  context = contexts.topLevel,
  depth = 1,
  key = "",
  object,
  replacer,
  spacer
}) {
  const objType = typeof object;

  return [
    [() => Array.isArray(object), stringifyArray],
    [
      () => object instanceof Date,
      () => stringifyString({ object: object.toISOString() })
    ],
    [() => object instanceof String || objType === "string", stringifyString],
    [() => object instanceof Number || objType === "number", stringifyNumber],
    [
      () => object instanceof Boolean || objType === "boolean",
      stringifyBoolean
    ],
    [() => objType === "object", stringifyObject],
    [
      () => ["function", "symbol", "undefined"].includes(objType),
      stringifyEmptyValue
    ]
  ].find(([condition]) => condition())[1]({
    context,
    depth,
    key,
    object,
    replacer,
    spacer
  });
}

function stringifyObject({ object, replacer, spacer, context, key, depth }) {
  if (object === null) {
    return "null";
  } else if (isCallable(object.toJSON)) {
    const param = context === contexts.topLevel ? "" : key;
    return stringifyHandler({ object: object.toJSON.call(object, param, key) });
  } else {
    return stringifyEntries(object);
  }

  function getSpacer(depth) {
    return " ".repeat(depth * Math.min(maxPadChars, spacer));
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
            depth,
            key,
            object,
            replacer,
            spacer,
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
  context,
  depth,
  key,
  object,
  replacer,
  spacer,
  value
}) {
  const replaced = getReplacerFunction(replacer).call(object, key, value);
  return stringifyHandler({
    object: replaced,
    replacer,
    spacer,
    context,
    key,
    depth: (depth += 1)
  });
}

function getReplacerFunction(replacer) {
  if (isCallable(replacer)) {
    return replacer;
  } else if (Array.isArray(replacer)) {
    return (key, value) => (replacer.includes(key) ? value : undefined);
  }
  return (_, value) => value;
}

function stringifyArray({ object, replacer, spacer }) {
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

function stringifyNumber({ object }) {
  return Number.isFinite(object.valueOf()) ? object.toString() : "null";
}

const stringReplacements = {
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t"
};

function stringifyString({ object }) {
  return `"${Object.keys(stringReplacements).reduce(
    (acc, replacer) => acc.replace(replacer, stringReplacements[replacer]),
    object.toString()
  )}"`;
}

function stringifyBoolean({ object }) {
  return object.toString();
}

function stringifyEmptyValue({ context }) {
  return [contexts.topLevel, contexts.object].includes(context)
    ? undefined
    : "null";
}

function isCallable(f) {
  return typeof f === "function";
}
