const expect = require("chai").expect;

const json2019 = require("../src/json2019");

describe("json2019", () => {
  describe("#stringify()", () => {
    const arrayOfPrimitiveBooleans = [true, false];

    const arrayOfPrimitiveStrings = ["", "a", "10", "true", "{}"];

    const arrayOfPrimitiveNumbers = [-10, 0, 3.3, 10];

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
        expectValuesMatch(null);
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
        expectValuesMatch(new Date(2006, 0, 2, 15, 4, 5));
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
        expectValuesMatch([]);
      });

      it("should handle array containing null", () => {
        expectValuesMatch([null]);
      });

      it("should handle arrays made of primitive values correctly", () => {
        expectValuesMatch(arrayOfPrimitives);
      });

      it("should handle arrays of primitive wrappers correctly", () => {
        expectValuesMatch(arrayOfPrimitiveWrappers);
      });

      it("should censor empty value (undefined, Function or Symbol) to null", () => {
        expectValuesMatch(arrayOfEmptyValues);
      });

      it("should replace infinite numbers with null", () => {
        expectValuesMatch(arrayOfNonFiniteNumbers);
      });

      it("should handle structural data types (Map, Set, WeakMap, WeakSet) correctly", () => {
        expectValuesMatch(arrayOfStructuralDataTypes);
      });

      it("should handle typed arrays", () => {
        expectValuesMatch(arrayOfTypedArrays);
      });

      it("should filter-off string -keyed array elements", () => {
        let a = ["foo", "bar"];
        a["baz"] = "quux";
        expectValuesMatch(a);
      });
    });

    describe("object values", () => {
      it("should handle empty object correctly", () => {
        expectValuesMatch({});
      });

      it("should handle object with primitive values correctly", () => {
        expectValuesMatch(makeObject(arrayOfPrimitives));
      });

      it("should omit empty values", () => {
        expectValuesMatch(makeObject(arrayOfEmptyValues));
      });

      it("should handle structural data as values", () => {
        expectValuesMatch(
          makeObject(arrayOfPrimitives, arrayOfPrimitiveWrappers, {}, [])
        );
      });

      it("should use toJSON() prop to serialize data if provided", () => {
        expectValuesMatch({
          x: 5,
          y: 6,
          toJSON() {
            return this.x + this.y;
          }
        });
      });
    });

    function checkArray(array) {
      array.forEach(expectValuesMatch);
    }

    function expectValuesMatch(value) {
      const json2019StringifyResult = json2019.stringify(value);
      const jsonStringifyResult = JSON.stringify(value);
      // console.debug("input", value);
      // console.debug("json2019.stringify() result:", json2019StringifyResult);
      // console.debug("JSON.stringify() result:", jsonStringifyResult);
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
