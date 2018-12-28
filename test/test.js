const expect = require("chai").expect;

const json2019 = require("../src/json2019");

describe("json2019", () => {
  describe("#stringify()", () => {
    const stringify = json2019.stringify.bind(json2019);
    const jsonStringify = JSON.stringify.bind(JSON);
    describe("pure values", () => {
      it("should handle boolean correctly", () => {
        checkArray([true, false]);
      });

      it("should handle string correctly", () => {
        checkArray(["", "a", "10", "true", "{}"]);
      });

      it("should handle numbers correctly", () => {
        checkArray([-10, 0, 3.3, 10]);
      });

      it("should return undefined in case undefined, Symbol or Function was passed", () => {
        checkArray([undefined, Symbol.for(""), function() {}]);
      });
    });
    it("should handle empty object correctly", function() {
      expect(json2019.stringify({})).to.equal("{}");
    });

    function checkArray(array) {
      array.forEach(expectValuesMatch);
    }

    function expectValuesMatch(value) {
      expect(stringify(value)).to.equal(jsonStringify(value));
    }

    it("should handle empty arrays", function() {
      expect(json2019.stringify([])).to.equal("[]");
    });

    it("should handle non-empty arrays", function() {
      expect(json2019.stringify(["aaa", false, true, 1, 1.3, {}])).to.equal(
        '["aaa",false,true,1,1.3,{}]'
      );
    });

    it("should handle undefined, a Function, or a Symbol in array correctly: by censoring to null", function() {
      expect(
        json2019.stringify([undefined, function() {}, Symbol.for("aaa")])
      ).to.equal("[null,null,null]");
    });

    it("should handle The numbers Infinity and NaN, as well as the value null correctly: by returning null ", function() {
      expect(json2019.stringify(null)).to.equal("null");
      expect(json2019.stringify(NaN)).to.equal("null");
      expect(json2019.stringify(Infinity)).to.equal("null");
      expect(json2019.stringify([null, NaN, Infinity])).to.equals(
        "[null,null,null]"
      );
    });

    it("should handle non empty objects correctly: convert enumerable props to string", function() {
      expect(json2019.stringify({ a: "a", b: 10, c: true })).to.equal(
        '{"a":"a","b":10,"c":true}'
      );
    });

    it("should handle date correctly: same as string", function() {
      const date = new Date(2006, 0, 2, 15, 4, 5);
      expect(json2019.stringify(date)).to.equal(JSON.stringify(date));
    });

    it("should handle Map, Set, WeakMap, WeakSet", function() {
      expect(
        json2019.stringify([
          new Set([1]),
          new Map([[1, 2]]),
          new WeakSet([{ a: 1 }]),
          new WeakMap([[{ a: 1 }, 2]])
        ])
      ).to.equal("[{},{},{},{}]");
    });

    it("should handle primitive wrappers correctly", function() {
      expect(
        json2019.stringify([
          new Number(3),
          new String("false"),
          new Boolean(false)
        ])
      ).to.equal('[3,"false",false]');
    });

    it("should filter-off string -keyed array elements", function() {
      let a = ["foo", "bar"];
      a["baz"] = "quux";
      expect(json2019.stringify(a)).to.equal('["foo","bar"]');
    });

    it("should handle arrays as object values", function() {
      expect(
        json2019.stringify({ x: [10, undefined, function() {}, Symbol("")] })
      ).to.equal('{"x":[10,null,null,null]}');
    });

    it("should handle typed arrays", function() {
      expect(
        json2019.stringify([
          new Int8Array([1]),
          new Int16Array([1]),
          new Int32Array([1])
        ])
      ).to.equal('[{"0":1},{"0":1},{"0":1}]');

      expect(
        json2019.stringify([
          new Uint8Array([1]),
          new Uint8ClampedArray([1]),
          new Uint16Array([1]),
          new Uint32Array([1])
        ])
      ).to.equal('[{"0":1},{"0":1},{"0":1},{"0":1}]');

      expect(
        json2019.stringify([new Float32Array([1]), new Float64Array([1])])
      ).to.equal('[{"0":1},{"0":1}]');
    });

    it("should use toJSON() prop to serialize data if provided", function() {
      expect(
        json2019.stringify({
          x: 5,
          y: 6,
          toJSON() {
            return this.x + this.y;
          }
        })
      ).to.equal("11");
    });
  });
});
