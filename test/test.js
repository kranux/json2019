const expect = require("chai").expect;

const json2019 = require("../src/json2019");

describe("json2019", () => {
  describe("#stringify()", () => {
    const arrayOfPrimitiveBooleans = [true, false];

    const arrayOfPrimitiveStrings = [
      " ",
      "",
      "{}",
      "\b",
      "\f",
      "\n",
      "\r",
      "\t",
      "👍",
      "10",
      "a",
      "true"
    ];

    const arrayOfPrimitiveNumbers = [
      Number.MIN_VALUE,
      Number.MIN_SAFE_INTEGER,
      -10,
      0,
      3.3,
      10,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_VALUE
    ];

    const arrayOfPrimitives = [
      ...arrayOfPrimitiveBooleans,
      ...arrayOfPrimitiveNumbers,
      ...arrayOfPrimitiveStrings
    ];

    const arrayOfPrimitiveWrappers = [
      new Number(3),
      new String("false"),
      new Boolean(false)
    ];

    const arrayOfStructuralDataTypes = [
      new Set([1]),
      new Map([[1, 2]]),
      new WeakSet([{ a: 1 }]),
      new WeakMap([[{ a: 1 }, 2]])
    ];

    const arrayOfTypedArrays = [
      new Int8Array([1]),
      new Int16Array([1]),
      new Int32Array([1]),
      new Uint8Array([1]),
      new Uint8ClampedArray([1]),
      new Uint16Array([1]),
      new Uint32Array([1]),
      new Float32Array([1]),
      new Float64Array([1])
    ];

    const arrayOfEmptyValues = [undefined, Symbol.for("symbol"), function() {}];

    const arrayOfNonFiniteNumbers = [-Infinity, NaN, Infinity];

    describe("pure values", () => {
      it("should handle null", () => {
        expectResultsMatch(null);
      });

      it("should handle boolean correctly", () => {
        checkArray(arrayOfPrimitiveBooleans);
      });

      it("should handle string correctly", () => {
        checkArray(arrayOfPrimitiveStrings);
      });

      it("should handle finite numbers correctly", () => {
        checkArray(arrayOfPrimitiveNumbers);
      });

      it("should handle primitive wrappers correctly", () => {
        checkArray(arrayOfPrimitiveWrappers);
      });

      it("should handle infinite numbers correctly", () => {
        checkArray(arrayOfNonFiniteNumbers);
      });

      it("should return undefined in case of empty value(undefined, Symbol or Function) was passed", () => {
        checkArray(arrayOfEmptyValues);
      });

      it("should handle date correctly", () => {
        expectResultsMatch(new Date(2006, 0, 2, 15, 4, 5));
      });

      it("should handle structural data types (Map, Set, WeakMap, WeakSet) correctly", () => {
        checkArray(arrayOfStructuralDataTypes);
      });

      it("should handle typed arrays correctly", () => {
        checkArray(arrayOfTypedArrays);
      });
    });

    describe("array values", () => {
      it("should handle empty arrays", () => {
        expectResultsMatch([]);
      });

      it("should handle array containing null", () => {
        expectResultsMatch([null]);
      });

      it("should handle arrays made of primitive values correctly", () => {
        expectResultsMatch(arrayOfPrimitives);
      });

      it("should handle arrays of primitive wrappers correctly", () => {
        expectResultsMatch(arrayOfPrimitiveWrappers);
      });

      it("should censor empty value (undefined, Function or Symbol) to null", () => {
        expectResultsMatch(arrayOfEmptyValues);
      });

      it("should replace infinite numbers with null", () => {
        expectResultsMatch(arrayOfNonFiniteNumbers);
      });

      it("should handle structural data types (Map, Set, WeakMap, WeakSet) correctly", () => {
        expectResultsMatch(arrayOfStructuralDataTypes);
      });

      it("should handle typed arrays", () => {
        expectResultsMatch(arrayOfTypedArrays);
      });

      it("should filter-off string -keyed array elements", () => {
        let a = ["foo", "bar"];
        a["baz"] = "quux";
        expectResultsMatch(a);
      });
    });

    describe("object values", () => {
      it("should handle empty object correctly", () => {
        expectResultsMatch({});
      });

      it("should handle object with primitive values correctly", () => {
        expectResultsMatch(makeObject(arrayOfPrimitives));
      });

      it("should omit empty values", () => {
        expectResultsMatch(makeObject(arrayOfEmptyValues));
      });

      it("should handle object containing non-finite numbers", () => {
        expectResultsMatch(makeObject(arrayOfNonFiniteNumbers));
      });

      it("should handle structural data as values", () => {
        expectResultsMatch(
          makeObject(arrayOfPrimitives, arrayOfPrimitiveWrappers, {}, [])
        );
      });

      it("should use toJSON() prop to serialize data if provided", () => {
        expectResultsMatch({
          x: 5,
          y: 6,
          toJSON() {
            return this.x + this.y;
          }
        });
      });

      it("should skip non-enumerable values", () => {
        expectResultsMatch(
          Object.create(null, {
            x: { value: "x", enumerable: false },
            y: { value: "y", enumerable: true }
          })
        );
      });
    });

    describe("with replacer param as a function", () => {
      it("should work for object", () => {
        function replacer(key, value) {
          // Filtering out properties
          if (typeof value === "string") {
            return undefined;
          }
          return value;
        }

        expectResultsMatch(
          {
            foundation: "Mozilla",
            model: "box",
            week: 45,
            transport: "car",
            month: 7
          },
          replacer
        );
      });

      it("should work for array", () => {
        function replacer(key, value) {
          return key % 2 === 0 ? value : undefined;
        }

        expectResultsMatch(["alfa", "bravo", "charlie", "delta"], replacer);
      });
    });

    function checkArray(array) {
      array.forEach(e => {
        expectResultsMatch(e);
      });
    }

    function expectResultsMatch(...args) {
      const json2019StringifyResult = json2019.stringify.apply(json2019, args);
      const jsonStringifyResult = JSON.stringify.apply(JSON, args);
      //console.debug("input",...args);
      //console.debug("json2019.stringify() result:", json2019StringifyResult);
      //console.debug("JSON.stringify() result:", jsonStringifyResult);
      expect(json2019StringifyResult).to.equal(jsonStringifyResult);
    }

    function makeObject(arrayOfValues) {
      return arrayOfValues.reduce(
        (acc, curr, i) => ({ ...acc, [`key-${i}`]: curr }),
        {}
      );
    }
  });
});
