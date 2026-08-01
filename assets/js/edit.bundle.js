(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/qrcode/lib/can-promise.js
  var require_can_promise = __commonJS({
    "node_modules/qrcode/lib/can-promise.js"(exports, module) {
      module.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
      };
    }
  });

  // node_modules/qrcode/lib/core/utils.js
  var require_utils = __commonJS({
    "node_modules/qrcode/lib/core/utils.js"(exports) {
      var toSJISFunction;
      var CODEWORDS_COUNT = [
        0,
        // Not used
        26,
        44,
        70,
        100,
        134,
        172,
        196,
        242,
        292,
        346,
        404,
        466,
        532,
        581,
        655,
        733,
        815,
        901,
        991,
        1085,
        1156,
        1258,
        1364,
        1474,
        1588,
        1706,
        1828,
        1921,
        2051,
        2185,
        2323,
        2465,
        2611,
        2761,
        2876,
        3034,
        3196,
        3362,
        3532,
        3706
      ];
      exports.getSymbolSize = function getSymbolSize(version) {
        if (!version) throw new Error('"version" cannot be null or undefined');
        if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
        return version * 4 + 17;
      };
      exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
        return CODEWORDS_COUNT[version];
      };
      exports.getBCHDigit = function(data) {
        let digit = 0;
        while (data !== 0) {
          digit++;
          data >>>= 1;
        }
        return digit;
      };
      exports.setToSJISFunction = function setToSJISFunction(f) {
        if (typeof f !== "function") {
          throw new Error('"toSJISFunc" is not a valid function.');
        }
        toSJISFunction = f;
      };
      exports.isKanjiModeEnabled = function() {
        return typeof toSJISFunction !== "undefined";
      };
      exports.toSJIS = function toSJIS(kanji) {
        return toSJISFunction(kanji);
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-level.js
  var require_error_correction_level = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
      exports.L = { bit: 1 };
      exports.M = { bit: 0 };
      exports.Q = { bit: 3 };
      exports.H = { bit: 2 };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "l":
          case "low":
            return exports.L;
          case "m":
          case "medium":
            return exports.M;
          case "q":
          case "quartile":
            return exports.Q;
          case "h":
          case "high":
            return exports.H;
          default:
            throw new Error("Unknown EC Level: " + string);
        }
      }
      exports.isValid = function isValid(level) {
        return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
      };
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/bit-buffer.js
  var require_bit_buffer = __commonJS({
    "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
      function BitBuffer() {
        this.buffer = [];
        this.length = 0;
      }
      BitBuffer.prototype = {
        get: function(index) {
          const bufIndex = Math.floor(index / 8);
          return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
        },
        put: function(num, length) {
          for (let i = 0; i < length; i++) {
            this.putBit((num >>> length - i - 1 & 1) === 1);
          }
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(bit) {
          const bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) {
            this.buffer.push(0);
          }
          if (bit) {
            this.buffer[bufIndex] |= 128 >>> this.length % 8;
          }
          this.length++;
        }
      };
      module.exports = BitBuffer;
    }
  });

  // node_modules/qrcode/lib/core/bit-matrix.js
  var require_bit_matrix = __commonJS({
    "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
      function BitMatrix(size) {
        if (!size || size < 1) {
          throw new Error("BitMatrix size must be defined and greater than 0");
        }
        this.size = size;
        this.data = new Uint8Array(size * size);
        this.reservedBit = new Uint8Array(size * size);
      }
      BitMatrix.prototype.set = function(row, col, value, reserved) {
        const index = row * this.size + col;
        this.data[index] = value;
        if (reserved) this.reservedBit[index] = true;
      };
      BitMatrix.prototype.get = function(row, col) {
        return this.data[row * this.size + col];
      };
      BitMatrix.prototype.xor = function(row, col, value) {
        this.data[row * this.size + col] ^= value;
      };
      BitMatrix.prototype.isReserved = function(row, col) {
        return this.reservedBit[row * this.size + col];
      };
      module.exports = BitMatrix;
    }
  });

  // node_modules/qrcode/lib/core/alignment-pattern.js
  var require_alignment_pattern = __commonJS({
    "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      exports.getRowColCoords = function getRowColCoords(version) {
        if (version === 1) return [];
        const posCount = Math.floor(version / 7) + 2;
        const size = getSymbolSize(version);
        const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
        const positions = [size - 7];
        for (let i = 1; i < posCount - 1; i++) {
          positions[i] = positions[i - 1] - intervals;
        }
        positions.push(6);
        return positions.reverse();
      };
      exports.getPositions = function getPositions(version) {
        const coords = [];
        const pos = exports.getRowColCoords(version);
        const posLength = pos.length;
        for (let i = 0; i < posLength; i++) {
          for (let j = 0; j < posLength; j++) {
            if (i === 0 && j === 0 || // top-left
            i === 0 && j === posLength - 1 || // bottom-left
            i === posLength - 1 && j === 0) {
              continue;
            }
            coords.push([pos[i], pos[j]]);
          }
        }
        return coords;
      };
    }
  });

  // node_modules/qrcode/lib/core/finder-pattern.js
  var require_finder_pattern = __commonJS({
    "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      var FINDER_PATTERN_SIZE = 7;
      exports.getPositions = function getPositions(version) {
        const size = getSymbolSize(version);
        return [
          // top-left
          [0, 0],
          // top-right
          [size - FINDER_PATTERN_SIZE, 0],
          // bottom-left
          [0, size - FINDER_PATTERN_SIZE]
        ];
      };
    }
  });

  // node_modules/qrcode/lib/core/mask-pattern.js
  var require_mask_pattern = __commonJS({
    "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
      exports.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var PenaltyScores = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
      };
      exports.isValid = function isValid(mask) {
        return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
      };
      exports.from = function from(value) {
        return exports.isValid(value) ? parseInt(value, 10) : void 0;
      };
      exports.getPenaltyN1 = function getPenaltyN1(data) {
        const size = data.size;
        let points = 0;
        let sameCountCol = 0;
        let sameCountRow = 0;
        let lastCol = null;
        let lastRow = null;
        for (let row = 0; row < size; row++) {
          sameCountCol = sameCountRow = 0;
          lastCol = lastRow = null;
          for (let col = 0; col < size; col++) {
            let module2 = data.get(row, col);
            if (module2 === lastCol) {
              sameCountCol++;
            } else {
              if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
              lastCol = module2;
              sameCountCol = 1;
            }
            module2 = data.get(col, row);
            if (module2 === lastRow) {
              sameCountRow++;
            } else {
              if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
              lastRow = module2;
              sameCountRow = 1;
            }
          }
          if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
          if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        }
        return points;
      };
      exports.getPenaltyN2 = function getPenaltyN2(data) {
        const size = data.size;
        let points = 0;
        for (let row = 0; row < size - 1; row++) {
          for (let col = 0; col < size - 1; col++) {
            const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
            if (last === 4 || last === 0) points++;
          }
        }
        return points * PenaltyScores.N2;
      };
      exports.getPenaltyN3 = function getPenaltyN3(data) {
        const size = data.size;
        let points = 0;
        let bitsCol = 0;
        let bitsRow = 0;
        for (let row = 0; row < size; row++) {
          bitsCol = bitsRow = 0;
          for (let col = 0; col < size; col++) {
            bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
            if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
            bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
            if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
          }
        }
        return points * PenaltyScores.N3;
      };
      exports.getPenaltyN4 = function getPenaltyN4(data) {
        let darkCount = 0;
        const modulesCount = data.data.length;
        for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
        const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
        return k * PenaltyScores.N4;
      };
      function getMaskAt(maskPattern, i, j) {
        switch (maskPattern) {
          case exports.Patterns.PATTERN000:
            return (i + j) % 2 === 0;
          case exports.Patterns.PATTERN001:
            return i % 2 === 0;
          case exports.Patterns.PATTERN010:
            return j % 3 === 0;
          case exports.Patterns.PATTERN011:
            return (i + j) % 3 === 0;
          case exports.Patterns.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case exports.Patterns.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case exports.Patterns.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case exports.Patterns.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      }
      exports.applyMask = function applyMask(pattern, data) {
        const size = data.size;
        for (let col = 0; col < size; col++) {
          for (let row = 0; row < size; row++) {
            if (data.isReserved(row, col)) continue;
            data.xor(row, col, getMaskAt(pattern, row, col));
          }
        }
      };
      exports.getBestMask = function getBestMask(data, setupFormatFunc) {
        const numPatterns = Object.keys(exports.Patterns).length;
        let bestPattern = 0;
        let lowerPenalty = Infinity;
        for (let p = 0; p < numPatterns; p++) {
          setupFormatFunc(p);
          exports.applyMask(p, data);
          const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
          exports.applyMask(p, data);
          if (penalty < lowerPenalty) {
            lowerPenalty = penalty;
            bestPattern = p;
          }
        }
        return bestPattern;
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-code.js
  var require_error_correction_code = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
      var ECLevel = require_error_correction_level();
      var EC_BLOCKS_TABLE = [
        // L  M  Q  H
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        2,
        2,
        4,
        1,
        2,
        4,
        4,
        2,
        4,
        4,
        4,
        2,
        4,
        6,
        5,
        2,
        4,
        6,
        6,
        2,
        5,
        8,
        8,
        4,
        5,
        8,
        8,
        4,
        5,
        8,
        11,
        4,
        8,
        10,
        11,
        4,
        9,
        12,
        16,
        4,
        9,
        16,
        16,
        6,
        10,
        12,
        18,
        6,
        10,
        17,
        16,
        6,
        11,
        16,
        19,
        6,
        13,
        18,
        21,
        7,
        14,
        21,
        25,
        8,
        16,
        20,
        25,
        8,
        17,
        23,
        25,
        9,
        17,
        23,
        34,
        9,
        18,
        25,
        30,
        10,
        20,
        27,
        32,
        12,
        21,
        29,
        35,
        12,
        23,
        34,
        37,
        12,
        25,
        34,
        40,
        13,
        26,
        35,
        42,
        14,
        28,
        38,
        45,
        15,
        29,
        40,
        48,
        16,
        31,
        43,
        51,
        17,
        33,
        45,
        54,
        18,
        35,
        48,
        57,
        19,
        37,
        51,
        60,
        19,
        38,
        53,
        63,
        20,
        40,
        56,
        66,
        21,
        43,
        59,
        70,
        22,
        45,
        62,
        74,
        24,
        47,
        65,
        77,
        25,
        49,
        68,
        81
      ];
      var EC_CODEWORDS_TABLE = [
        // L  M  Q  H
        7,
        10,
        13,
        17,
        10,
        16,
        22,
        28,
        15,
        26,
        36,
        44,
        20,
        36,
        52,
        64,
        26,
        48,
        72,
        88,
        36,
        64,
        96,
        112,
        40,
        72,
        108,
        130,
        48,
        88,
        132,
        156,
        60,
        110,
        160,
        192,
        72,
        130,
        192,
        224,
        80,
        150,
        224,
        264,
        96,
        176,
        260,
        308,
        104,
        198,
        288,
        352,
        120,
        216,
        320,
        384,
        132,
        240,
        360,
        432,
        144,
        280,
        408,
        480,
        168,
        308,
        448,
        532,
        180,
        338,
        504,
        588,
        196,
        364,
        546,
        650,
        224,
        416,
        600,
        700,
        224,
        442,
        644,
        750,
        252,
        476,
        690,
        816,
        270,
        504,
        750,
        900,
        300,
        560,
        810,
        960,
        312,
        588,
        870,
        1050,
        336,
        644,
        952,
        1110,
        360,
        700,
        1020,
        1200,
        390,
        728,
        1050,
        1260,
        420,
        784,
        1140,
        1350,
        450,
        812,
        1200,
        1440,
        480,
        868,
        1290,
        1530,
        510,
        924,
        1350,
        1620,
        540,
        980,
        1440,
        1710,
        570,
        1036,
        1530,
        1800,
        570,
        1064,
        1590,
        1890,
        600,
        1120,
        1680,
        1980,
        630,
        1204,
        1770,
        2100,
        660,
        1260,
        1860,
        2220,
        720,
        1316,
        1950,
        2310,
        750,
        1372,
        2040,
        2430
      ];
      exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/galois-field.js
  var require_galois_field = __commonJS({
    "node_modules/qrcode/lib/core/galois-field.js"(exports) {
      var EXP_TABLE = new Uint8Array(512);
      var LOG_TABLE = new Uint8Array(256);
      (function initTables() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
          EXP_TABLE[i] = x;
          LOG_TABLE[x] = i;
          x <<= 1;
          if (x & 256) {
            x ^= 285;
          }
        }
        for (let i = 255; i < 512; i++) {
          EXP_TABLE[i] = EXP_TABLE[i - 255];
        }
      })();
      exports.log = function log(n) {
        if (n < 1) throw new Error("log(" + n + ")");
        return LOG_TABLE[n];
      };
      exports.exp = function exp(n) {
        return EXP_TABLE[n];
      };
      exports.mul = function mul(x, y) {
        if (x === 0 || y === 0) return 0;
        return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
      };
    }
  });

  // node_modules/qrcode/lib/core/polynomial.js
  var require_polynomial = __commonJS({
    "node_modules/qrcode/lib/core/polynomial.js"(exports) {
      var GF = require_galois_field();
      exports.mul = function mul(p1, p2) {
        const coeff = new Uint8Array(p1.length + p2.length - 1);
        for (let i = 0; i < p1.length; i++) {
          for (let j = 0; j < p2.length; j++) {
            coeff[i + j] ^= GF.mul(p1[i], p2[j]);
          }
        }
        return coeff;
      };
      exports.mod = function mod(divident, divisor) {
        let result = new Uint8Array(divident);
        while (result.length - divisor.length >= 0) {
          const coeff = result[0];
          for (let i = 0; i < divisor.length; i++) {
            result[i] ^= GF.mul(divisor[i], coeff);
          }
          let offset = 0;
          while (offset < result.length && result[offset] === 0) offset++;
          result = result.slice(offset);
        }
        return result;
      };
      exports.generateECPolynomial = function generateECPolynomial(degree) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < degree; i++) {
          poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
        }
        return poly;
      };
    }
  });

  // node_modules/qrcode/lib/core/reed-solomon-encoder.js
  var require_reed_solomon_encoder = __commonJS({
    "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
      var Polynomial = require_polynomial();
      function ReedSolomonEncoder(degree) {
        this.genPoly = void 0;
        this.degree = degree;
        if (this.degree) this.initialize(this.degree);
      }
      ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
        this.degree = degree;
        this.genPoly = Polynomial.generateECPolynomial(this.degree);
      };
      ReedSolomonEncoder.prototype.encode = function encode(data) {
        if (!this.genPoly) {
          throw new Error("Encoder not initialized");
        }
        const paddedData = new Uint8Array(data.length + this.degree);
        paddedData.set(data);
        const remainder = Polynomial.mod(paddedData, this.genPoly);
        const start = this.degree - remainder.length;
        if (start > 0) {
          const buff = new Uint8Array(this.degree);
          buff.set(remainder, start);
          return buff;
        }
        return remainder;
      };
      module.exports = ReedSolomonEncoder;
    }
  });

  // node_modules/qrcode/lib/core/version-check.js
  var require_version_check = __commonJS({
    "node_modules/qrcode/lib/core/version-check.js"(exports) {
      exports.isValid = function isValid(version) {
        return !isNaN(version) && version >= 1 && version <= 40;
      };
    }
  });

  // node_modules/qrcode/lib/core/regex.js
  var require_regex = __commonJS({
    "node_modules/qrcode/lib/core/regex.js"(exports) {
      var numeric = "[0-9]+";
      var alphanumeric = "[A-Z $%*+\\-./:]+";
      var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
      kanji = kanji.replace(/u/g, "\\u");
      var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
      exports.KANJI = new RegExp(kanji, "g");
      exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
      exports.BYTE = new RegExp(byte, "g");
      exports.NUMERIC = new RegExp(numeric, "g");
      exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
      var TEST_KANJI = new RegExp("^" + kanji + "$");
      var TEST_NUMERIC = new RegExp("^" + numeric + "$");
      var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
      exports.testKanji = function testKanji(str) {
        return TEST_KANJI.test(str);
      };
      exports.testNumeric = function testNumeric(str) {
        return TEST_NUMERIC.test(str);
      };
      exports.testAlphanumeric = function testAlphanumeric(str) {
        return TEST_ALPHANUMERIC.test(str);
      };
    }
  });

  // node_modules/qrcode/lib/core/mode.js
  var require_mode = __commonJS({
    "node_modules/qrcode/lib/core/mode.js"(exports) {
      var VersionCheck = require_version_check();
      var Regex = require_regex();
      exports.NUMERIC = {
        id: "Numeric",
        bit: 1 << 0,
        ccBits: [10, 12, 14]
      };
      exports.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 1 << 1,
        ccBits: [9, 11, 13]
      };
      exports.BYTE = {
        id: "Byte",
        bit: 1 << 2,
        ccBits: [8, 16, 16]
      };
      exports.KANJI = {
        id: "Kanji",
        bit: 1 << 3,
        ccBits: [8, 10, 12]
      };
      exports.MIXED = {
        bit: -1
      };
      exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
        if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid version: " + version);
        }
        if (version >= 1 && version < 10) return mode.ccBits[0];
        else if (version < 27) return mode.ccBits[1];
        return mode.ccBits[2];
      };
      exports.getBestModeForData = function getBestModeForData(dataStr) {
        if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
        else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
        else if (Regex.testKanji(dataStr)) return exports.KANJI;
        else return exports.BYTE;
      };
      exports.toString = function toString(mode) {
        if (mode && mode.id) return mode.id;
        throw new Error("Invalid mode");
      };
      exports.isValid = function isValid(mode) {
        return mode && mode.bit && mode.ccBits;
      };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "numeric":
            return exports.NUMERIC;
          case "alphanumeric":
            return exports.ALPHANUMERIC;
          case "kanji":
            return exports.KANJI;
          case "byte":
            return exports.BYTE;
          default:
            throw new Error("Unknown mode: " + string);
        }
      }
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/version.js
  var require_version = __commonJS({
    "node_modules/qrcode/lib/core/version.js"(exports) {
      var Utils = require_utils();
      var ECCode = require_error_correction_code();
      var ECLevel = require_error_correction_level();
      var Mode = require_mode();
      var VersionCheck = require_version_check();
      var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      var G18_BCH = Utils.getBCHDigit(G18);
      function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      function getReservedBitsCount(mode, version) {
        return Mode.getCharCountIndicator(mode, version) + 4;
      }
      function getTotalBitsFromDataArray(segments, version) {
        let totalBits = 0;
        segments.forEach(function(data) {
          const reservedBits = getReservedBitsCount(data.mode, version);
          totalBits += reservedBits + data.getBitsLength();
        });
        return totalBits;
      }
      function getBestVersionForMixedData(segments, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          const length = getTotalBitsFromDataArray(segments, currentVersion);
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      exports.from = function from(value, defaultValue) {
        if (VersionCheck.isValid(value)) {
          return parseInt(value, 10);
        }
        return defaultValue;
      };
      exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid QR Code version");
        }
        if (typeof mode === "undefined") mode = Mode.BYTE;
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (mode === Mode.MIXED) return dataTotalCodewordsBits;
        const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
        switch (mode) {
          case Mode.NUMERIC:
            return Math.floor(usableBits / 10 * 3);
          case Mode.ALPHANUMERIC:
            return Math.floor(usableBits / 11 * 2);
          case Mode.KANJI:
            return Math.floor(usableBits / 13);
          case Mode.BYTE:
          default:
            return Math.floor(usableBits / 8);
        }
      };
      exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
        let seg;
        const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
        if (Array.isArray(data)) {
          if (data.length > 1) {
            return getBestVersionForMixedData(data, ecl);
          }
          if (data.length === 0) {
            return 1;
          }
          seg = data[0];
        } else {
          seg = data;
        }
        return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
      };
      exports.getEncodedBits = function getEncodedBits(version) {
        if (!VersionCheck.isValid(version) || version < 7) {
          throw new Error("Invalid QR Code version");
        }
        let d = version << 12;
        while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
          d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
        }
        return version << 12 | d;
      };
    }
  });

  // node_modules/qrcode/lib/core/format-info.js
  var require_format_info = __commonJS({
    "node_modules/qrcode/lib/core/format-info.js"(exports) {
      var Utils = require_utils();
      var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      var G15_BCH = Utils.getBCHDigit(G15);
      exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
        const data = errorCorrectionLevel.bit << 3 | mask;
        let d = data << 10;
        while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
          d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
        }
        return (data << 10 | d) ^ G15_MASK;
      };
    }
  });

  // node_modules/qrcode/lib/core/numeric-data.js
  var require_numeric_data = __commonJS({
    "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
      var Mode = require_mode();
      function NumericData(data) {
        this.mode = Mode.NUMERIC;
        this.data = data.toString();
      }
      NumericData.getBitsLength = function getBitsLength(length) {
        return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
      };
      NumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      NumericData.prototype.getBitsLength = function getBitsLength() {
        return NumericData.getBitsLength(this.data.length);
      };
      NumericData.prototype.write = function write(bitBuffer) {
        let i, group, value;
        for (i = 0; i + 3 <= this.data.length; i += 3) {
          group = this.data.substr(i, 3);
          value = parseInt(group, 10);
          bitBuffer.put(value, 10);
        }
        const remainingNum = this.data.length - i;
        if (remainingNum > 0) {
          group = this.data.substr(i);
          value = parseInt(group, 10);
          bitBuffer.put(value, remainingNum * 3 + 1);
        }
      };
      module.exports = NumericData;
    }
  });

  // node_modules/qrcode/lib/core/alphanumeric-data.js
  var require_alphanumeric_data = __commonJS({
    "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
      var Mode = require_mode();
      var ALPHA_NUM_CHARS = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        " ",
        "$",
        "%",
        "*",
        "+",
        "-",
        ".",
        "/",
        ":"
      ];
      function AlphanumericData(data) {
        this.mode = Mode.ALPHANUMERIC;
        this.data = data;
      }
      AlphanumericData.getBitsLength = function getBitsLength(length) {
        return 11 * Math.floor(length / 2) + 6 * (length % 2);
      };
      AlphanumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      AlphanumericData.prototype.getBitsLength = function getBitsLength() {
        return AlphanumericData.getBitsLength(this.data.length);
      };
      AlphanumericData.prototype.write = function write(bitBuffer) {
        let i;
        for (i = 0; i + 2 <= this.data.length; i += 2) {
          let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
          value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
          bitBuffer.put(value, 11);
        }
        if (this.data.length % 2) {
          bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
        }
      };
      module.exports = AlphanumericData;
    }
  });

  // node_modules/qrcode/lib/core/byte-data.js
  var require_byte_data = __commonJS({
    "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
      var Mode = require_mode();
      function ByteData(data) {
        this.mode = Mode.BYTE;
        if (typeof data === "string") {
          this.data = new TextEncoder().encode(data);
        } else {
          this.data = new Uint8Array(data);
        }
      }
      ByteData.getBitsLength = function getBitsLength(length) {
        return length * 8;
      };
      ByteData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      ByteData.prototype.getBitsLength = function getBitsLength() {
        return ByteData.getBitsLength(this.data.length);
      };
      ByteData.prototype.write = function(bitBuffer) {
        for (let i = 0, l = this.data.length; i < l; i++) {
          bitBuffer.put(this.data[i], 8);
        }
      };
      module.exports = ByteData;
    }
  });

  // node_modules/qrcode/lib/core/kanji-data.js
  var require_kanji_data = __commonJS({
    "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
      var Mode = require_mode();
      var Utils = require_utils();
      function KanjiData(data) {
        this.mode = Mode.KANJI;
        this.data = data;
      }
      KanjiData.getBitsLength = function getBitsLength(length) {
        return length * 13;
      };
      KanjiData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      KanjiData.prototype.getBitsLength = function getBitsLength() {
        return KanjiData.getBitsLength(this.data.length);
      };
      KanjiData.prototype.write = function(bitBuffer) {
        let i;
        for (i = 0; i < this.data.length; i++) {
          let value = Utils.toSJIS(this.data[i]);
          if (value >= 33088 && value <= 40956) {
            value -= 33088;
          } else if (value >= 57408 && value <= 60351) {
            value -= 49472;
          } else {
            throw new Error(
              "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
            );
          }
          value = (value >>> 8 & 255) * 192 + (value & 255);
          bitBuffer.put(value, 13);
        }
      };
      module.exports = KanjiData;
    }
  });

  // node_modules/dijkstrajs/dijkstra.js
  var require_dijkstra = __commonJS({
    "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
      "use strict";
      var dijkstra = {
        single_source_shortest_paths: function(graph, s, d) {
          var predecessors = {};
          var costs = {};
          costs[s] = 0;
          var open = dijkstra.PriorityQueue.make();
          open.push(s, 0);
          var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
          while (!open.empty()) {
            closest = open.pop();
            u = closest.value;
            cost_of_s_to_u = closest.cost;
            adjacent_nodes = graph[u] || {};
            for (v in adjacent_nodes) {
              if (adjacent_nodes.hasOwnProperty(v)) {
                cost_of_e = adjacent_nodes[v];
                cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
                cost_of_s_to_v = costs[v];
                first_visit = typeof costs[v] === "undefined";
                if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                  costs[v] = cost_of_s_to_u_plus_cost_of_e;
                  open.push(v, cost_of_s_to_u_plus_cost_of_e);
                  predecessors[v] = u;
                }
              }
            }
          }
          if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
            var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
            throw new Error(msg);
          }
          return predecessors;
        },
        extract_shortest_path_from_predecessor_list: function(predecessors, d) {
          var nodes = [];
          var u = d;
          var predecessor;
          while (u) {
            nodes.push(u);
            predecessor = predecessors[u];
            u = predecessors[u];
          }
          nodes.reverse();
          return nodes;
        },
        find_path: function(graph, s, d) {
          var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
          return dijkstra.extract_shortest_path_from_predecessor_list(
            predecessors,
            d
          );
        },
        /**
         * A very naive priority queue implementation.
         */
        PriorityQueue: {
          make: function(opts) {
            var T = dijkstra.PriorityQueue, t = {}, key;
            opts = opts || {};
            for (key in T) {
              if (T.hasOwnProperty(key)) {
                t[key] = T[key];
              }
            }
            t.queue = [];
            t.sorter = opts.sorter || T.default_sorter;
            return t;
          },
          default_sorter: function(a, b) {
            return a.cost - b.cost;
          },
          /**
           * Add a new item to the queue and ensure the highest priority element
           * is at the front of the queue.
           */
          push: function(value, cost) {
            var item = { value, cost };
            this.queue.push(item);
            this.queue.sort(this.sorter);
          },
          /**
           * Return the highest priority element in the queue.
           */
          pop: function() {
            return this.queue.shift();
          },
          empty: function() {
            return this.queue.length === 0;
          }
        }
      };
      if (typeof module !== "undefined") {
        module.exports = dijkstra;
      }
    }
  });

  // node_modules/qrcode/lib/core/segments.js
  var require_segments = __commonJS({
    "node_modules/qrcode/lib/core/segments.js"(exports) {
      var Mode = require_mode();
      var NumericData = require_numeric_data();
      var AlphanumericData = require_alphanumeric_data();
      var ByteData = require_byte_data();
      var KanjiData = require_kanji_data();
      var Regex = require_regex();
      var Utils = require_utils();
      var dijkstra = require_dijkstra();
      function getStringByteLength(str) {
        return unescape(encodeURIComponent(str)).length;
      }
      function getSegments(regex, mode, str) {
        const segments = [];
        let result;
        while ((result = regex.exec(str)) !== null) {
          segments.push({
            data: result[0],
            index: result.index,
            mode,
            length: result[0].length
          });
        }
        return segments;
      }
      function getSegmentsFromString(dataStr) {
        const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
        const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
        let byteSegs;
        let kanjiSegs;
        if (Utils.isKanjiModeEnabled()) {
          byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
          kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
        } else {
          byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
          kanjiSegs = [];
        }
        const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
        return segs.sort(function(s1, s2) {
          return s1.index - s2.index;
        }).map(function(obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          };
        });
      }
      function getSegmentBitsLength(length, mode) {
        switch (mode) {
          case Mode.NUMERIC:
            return NumericData.getBitsLength(length);
          case Mode.ALPHANUMERIC:
            return AlphanumericData.getBitsLength(length);
          case Mode.KANJI:
            return KanjiData.getBitsLength(length);
          case Mode.BYTE:
            return ByteData.getBitsLength(length);
        }
      }
      function mergeSegments(segs) {
        return segs.reduce(function(acc, curr) {
          const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
          if (prevSeg && prevSeg.mode === curr.mode) {
            acc[acc.length - 1].data += curr.data;
            return acc;
          }
          acc.push(curr);
          return acc;
        }, []);
      }
      function buildNodes(segs) {
        const nodes = [];
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          switch (seg.mode) {
            case Mode.NUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.ALPHANUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.KANJI:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
              break;
            case Mode.BYTE:
              nodes.push([
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
          }
        }
        return nodes;
      }
      function buildGraph(nodes, version) {
        const table = {};
        const graph = { start: {} };
        let prevNodeIds = ["start"];
        for (let i = 0; i < nodes.length; i++) {
          const nodeGroup = nodes[i];
          const currentNodeIds = [];
          for (let j = 0; j < nodeGroup.length; j++) {
            const node = nodeGroup[j];
            const key = "" + i + j;
            currentNodeIds.push(key);
            table[key] = { node, lastCount: 0 };
            graph[key] = {};
            for (let n = 0; n < prevNodeIds.length; n++) {
              const prevNodeId = prevNodeIds[n];
              if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
                graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
                table[prevNodeId].lastCount += node.length;
              } else {
                if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
                graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
              }
            }
          }
          prevNodeIds = currentNodeIds;
        }
        for (let n = 0; n < prevNodeIds.length; n++) {
          graph[prevNodeIds[n]].end = 0;
        }
        return { map: graph, table };
      }
      function buildSingleSegment(data, modesHint) {
        let mode;
        const bestMode = Mode.getBestModeForData(data);
        mode = Mode.from(modesHint, bestMode);
        if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
          throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
        }
        if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
          mode = Mode.BYTE;
        }
        switch (mode) {
          case Mode.NUMERIC:
            return new NumericData(data);
          case Mode.ALPHANUMERIC:
            return new AlphanumericData(data);
          case Mode.KANJI:
            return new KanjiData(data);
          case Mode.BYTE:
            return new ByteData(data);
        }
      }
      exports.fromArray = function fromArray(array) {
        return array.reduce(function(acc, seg) {
          if (typeof seg === "string") {
            acc.push(buildSingleSegment(seg, null));
          } else if (seg.data) {
            acc.push(buildSingleSegment(seg.data, seg.mode));
          }
          return acc;
        }, []);
      };
      exports.fromString = function fromString(data, version) {
        const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
        const nodes = buildNodes(segs);
        const graph = buildGraph(nodes, version);
        const path = dijkstra.find_path(graph.map, "start", "end");
        const optimizedSegs = [];
        for (let i = 1; i < path.length - 1; i++) {
          optimizedSegs.push(graph.table[path[i]].node);
        }
        return exports.fromArray(mergeSegments(optimizedSegs));
      };
      exports.rawSplit = function rawSplit(data) {
        return exports.fromArray(
          getSegmentsFromString(data, Utils.isKanjiModeEnabled())
        );
      };
    }
  });

  // node_modules/qrcode/lib/core/qrcode.js
  var require_qrcode = __commonJS({
    "node_modules/qrcode/lib/core/qrcode.js"(exports) {
      var Utils = require_utils();
      var ECLevel = require_error_correction_level();
      var BitBuffer = require_bit_buffer();
      var BitMatrix = require_bit_matrix();
      var AlignmentPattern = require_alignment_pattern();
      var FinderPattern = require_finder_pattern();
      var MaskPattern = require_mask_pattern();
      var ECCode = require_error_correction_code();
      var ReedSolomonEncoder = require_reed_solomon_encoder();
      var Version = require_version();
      var FormatInfo = require_format_info();
      var Mode = require_mode();
      var Segments = require_segments();
      function setupFinderPattern(matrix, version) {
        const size = matrix.size;
        const pos = FinderPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -1; r <= 7; r++) {
            if (row + r <= -1 || size <= row + r) continue;
            for (let c = -1; c <= 7; c++) {
              if (col + c <= -1 || size <= col + c) continue;
              if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupTimingPattern(matrix) {
        const size = matrix.size;
        for (let r = 8; r < size - 8; r++) {
          const value = r % 2 === 0;
          matrix.set(r, 6, value, true);
          matrix.set(6, r, value, true);
        }
      }
      function setupAlignmentPattern(matrix, version) {
        const pos = AlignmentPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupVersionInfo(matrix, version) {
        const size = matrix.size;
        const bits = Version.getEncodedBits(version);
        let row, col, mod;
        for (let i = 0; i < 18; i++) {
          row = Math.floor(i / 3);
          col = i % 3 + size - 8 - 3;
          mod = (bits >> i & 1) === 1;
          matrix.set(row, col, mod, true);
          matrix.set(col, row, mod, true);
        }
      }
      function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
        const size = matrix.size;
        const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
        let i, mod;
        for (i = 0; i < 15; i++) {
          mod = (bits >> i & 1) === 1;
          if (i < 6) {
            matrix.set(i, 8, mod, true);
          } else if (i < 8) {
            matrix.set(i + 1, 8, mod, true);
          } else {
            matrix.set(size - 15 + i, 8, mod, true);
          }
          if (i < 8) {
            matrix.set(8, size - i - 1, mod, true);
          } else if (i < 9) {
            matrix.set(8, 15 - i - 1 + 1, mod, true);
          } else {
            matrix.set(8, 15 - i - 1, mod, true);
          }
        }
        matrix.set(size - 8, 8, 1, true);
      }
      function setupData(matrix, data) {
        const size = matrix.size;
        let inc = -1;
        let row = size - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = size - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (!matrix.isReserved(row, col - c)) {
                let dark = false;
                if (byteIndex < data.length) {
                  dark = (data[byteIndex] >>> bitIndex & 1) === 1;
                }
                matrix.set(row, col - c, dark);
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || size <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
      function createData(version, errorCorrectionLevel, segments) {
        const buffer = new BitBuffer();
        segments.forEach(function(data) {
          buffer.put(data.mode.bit, 4);
          buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
          data.write(buffer);
        });
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 !== 0) {
          buffer.putBit(0);
        }
        const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
        for (let i = 0; i < remainingByte; i++) {
          buffer.put(i % 2 ? 17 : 236, 8);
        }
        return createCodewords(buffer, version, errorCorrectionLevel);
      }
      function createCodewords(bitBuffer, version, errorCorrectionLevel) {
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewords = totalCodewords - ecTotalCodewords;
        const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
        const blocksInGroup2 = totalCodewords % ecTotalBlocks;
        const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
        const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
        const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
        const rs = new ReedSolomonEncoder(ecCount);
        let offset = 0;
        const dcData = new Array(ecTotalBlocks);
        const ecData = new Array(ecTotalBlocks);
        let maxDataSize = 0;
        const buffer = new Uint8Array(bitBuffer.buffer);
        for (let b = 0; b < ecTotalBlocks; b++) {
          const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
          dcData[b] = buffer.slice(offset, offset + dataSize);
          ecData[b] = rs.encode(dcData[b]);
          offset += dataSize;
          maxDataSize = Math.max(maxDataSize, dataSize);
        }
        const data = new Uint8Array(totalCodewords);
        let index = 0;
        let i, r;
        for (i = 0; i < maxDataSize; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            if (i < dcData[r].length) {
              data[index++] = dcData[r][i];
            }
          }
        }
        for (i = 0; i < ecCount; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            data[index++] = ecData[r][i];
          }
        }
        return data;
      }
      function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
        let segments;
        if (Array.isArray(data)) {
          segments = Segments.fromArray(data);
        } else if (typeof data === "string") {
          let estimatedVersion = version;
          if (!estimatedVersion) {
            const rawSegments = Segments.rawSplit(data);
            estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
          }
          segments = Segments.fromString(data, estimatedVersion || 40);
        } else {
          throw new Error("Invalid data");
        }
        const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
        if (!bestVersion) {
          throw new Error("The amount of data is too big to be stored in a QR Code");
        }
        if (!version) {
          version = bestVersion;
        } else if (version < bestVersion) {
          throw new Error(
            "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
          );
        }
        const dataBits = createData(version, errorCorrectionLevel, segments);
        const moduleCount = Utils.getSymbolSize(version);
        const modules = new BitMatrix(moduleCount);
        setupFinderPattern(modules, version);
        setupTimingPattern(modules);
        setupAlignmentPattern(modules, version);
        setupFormatInfo(modules, errorCorrectionLevel, 0);
        if (version >= 7) {
          setupVersionInfo(modules, version);
        }
        setupData(modules, dataBits);
        if (isNaN(maskPattern)) {
          maskPattern = MaskPattern.getBestMask(
            modules,
            setupFormatInfo.bind(null, modules, errorCorrectionLevel)
          );
        }
        MaskPattern.applyMask(maskPattern, modules);
        setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
        return {
          modules,
          version,
          errorCorrectionLevel,
          maskPattern,
          segments
        };
      }
      exports.create = function create(data, options) {
        if (typeof data === "undefined" || data === "") {
          throw new Error("No input text");
        }
        let errorCorrectionLevel = ECLevel.M;
        let version;
        let mask;
        if (typeof options !== "undefined") {
          errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
          version = Version.from(options.version);
          mask = MaskPattern.from(options.maskPattern);
          if (options.toSJISFunc) {
            Utils.setToSJISFunction(options.toSJISFunc);
          }
        }
        return createSymbol(data, version, errorCorrectionLevel, mask);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/utils.js
  var require_utils2 = __commonJS({
    "node_modules/qrcode/lib/renderer/utils.js"(exports) {
      function hex2rgba(hex) {
        if (typeof hex === "number") {
          hex = hex.toString();
        }
        if (typeof hex !== "string") {
          throw new Error("Color should be defined as hex string");
        }
        let hexCode = hex.slice().replace("#", "").split("");
        if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
          throw new Error("Invalid hex color: " + hex);
        }
        if (hexCode.length === 3 || hexCode.length === 4) {
          hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
            return [c, c];
          }));
        }
        if (hexCode.length === 6) hexCode.push("F", "F");
        const hexValue = parseInt(hexCode.join(""), 16);
        return {
          r: hexValue >> 24 & 255,
          g: hexValue >> 16 & 255,
          b: hexValue >> 8 & 255,
          a: hexValue & 255,
          hex: "#" + hexCode.slice(0, 6).join("")
        };
      }
      exports.getOptions = function getOptions(options) {
        if (!options) options = {};
        if (!options.color) options.color = {};
        const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
        const width = options.width && options.width >= 21 ? options.width : void 0;
        const scale = options.scale || 4;
        return {
          width,
          scale: width ? 4 : scale,
          margin,
          color: {
            dark: hex2rgba(options.color.dark || "#000000ff"),
            light: hex2rgba(options.color.light || "#ffffffff")
          },
          type: options.type,
          rendererOpts: options.rendererOpts || {}
        };
      };
      exports.getScale = function getScale(qrSize, opts) {
        return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
      };
      exports.getImageWidth = function getImageWidth(qrSize, opts) {
        const scale = exports.getScale(qrSize, opts);
        return Math.floor((qrSize + opts.margin * 2) * scale);
      };
      exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
        const size = qr.modules.size;
        const data = qr.modules.data;
        const scale = exports.getScale(size, opts);
        const symbolSize = Math.floor((size + opts.margin * 2) * scale);
        const scaledMargin = opts.margin * scale;
        const palette = [opts.color.light, opts.color.dark];
        for (let i = 0; i < symbolSize; i++) {
          for (let j = 0; j < symbolSize; j++) {
            let posDst = (i * symbolSize + j) * 4;
            let pxColor = opts.color.light;
            if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
              const iSrc = Math.floor((i - scaledMargin) / scale);
              const jSrc = Math.floor((j - scaledMargin) / scale);
              pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
            }
            imgData[posDst++] = pxColor.r;
            imgData[posDst++] = pxColor.g;
            imgData[posDst++] = pxColor.b;
            imgData[posDst] = pxColor.a;
          }
        }
      };
    }
  });

  // node_modules/qrcode/lib/renderer/canvas.js
  var require_canvas = __commonJS({
    "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
      var Utils = require_utils2();
      function clearCanvas(ctx, canvas, size) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!canvas.style) canvas.style = {};
        canvas.height = size;
        canvas.width = size;
        canvas.style.height = size + "px";
        canvas.style.width = size + "px";
      }
      function getCanvasElement() {
        try {
          return document.createElement("canvas");
        } catch (e) {
          throw new Error("You need to specify a canvas element");
        }
      }
      exports.render = function render(qrData, canvas, options) {
        let opts = options;
        let canvasEl = canvas;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!canvas) {
          canvasEl = getCanvasElement();
        }
        opts = Utils.getOptions(opts);
        const size = Utils.getImageWidth(qrData.modules.size, opts);
        const ctx = canvasEl.getContext("2d");
        const image = ctx.createImageData(size, size);
        Utils.qrToImageData(image.data, qrData, opts);
        clearCanvas(ctx, canvasEl, size);
        ctx.putImageData(image, 0, 0);
        return canvasEl;
      };
      exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
        let opts = options;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!opts) opts = {};
        const canvasEl = exports.render(qrData, canvas, opts);
        const type = opts.type || "image/png";
        const rendererOpts = opts.rendererOpts || {};
        return canvasEl.toDataURL(type, rendererOpts.quality);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/svg-tag.js
  var require_svg_tag = __commonJS({
    "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
      var Utils = require_utils2();
      function getColorAttrib(color, attrib) {
        const alpha = color.a / 255;
        const str = attrib + '="' + color.hex + '"';
        return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
      }
      function svgCmd(cmd, x, y) {
        let str = cmd + x;
        if (typeof y !== "undefined") str += " " + y;
        return str;
      }
      function qrToPath(data, size, margin) {
        let path = "";
        let moveBy = 0;
        let newRow = false;
        let lineLength = 0;
        for (let i = 0; i < data.length; i++) {
          const col = Math.floor(i % size);
          const row = Math.floor(i / size);
          if (!col && !newRow) newRow = true;
          if (data[i]) {
            lineLength++;
            if (!(i > 0 && col > 0 && data[i - 1])) {
              path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
              moveBy = 0;
              newRow = false;
            }
            if (!(col + 1 < size && data[i + 1])) {
              path += svgCmd("h", lineLength);
              lineLength = 0;
            }
          } else {
            moveBy++;
          }
        }
        return path;
      }
      exports.render = function render(qrData, options, cb) {
        const opts = Utils.getOptions(options);
        const size = qrData.modules.size;
        const data = qrData.modules.data;
        const qrcodesize = size + opts.margin * 2;
        const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
        const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
        const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
        const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
        const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
        if (typeof cb === "function") {
          cb(null, svgTag);
        }
        return svgTag;
      };
    }
  });

  // node_modules/qrcode/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/qrcode/lib/browser.js"(exports) {
      var canPromise = require_can_promise();
      var QRCode2 = require_qrcode();
      var CanvasRenderer = require_canvas();
      var SvgRenderer = require_svg_tag();
      function renderCanvas(renderFunc, canvas, text, opts, cb) {
        const args = [].slice.call(arguments, 1);
        const argsNum = args.length;
        const isLastArgCb = typeof args[argsNum - 1] === "function";
        if (!isLastArgCb && !canPromise()) {
          throw new Error("Callback required as last argument");
        }
        if (isLastArgCb) {
          if (argsNum < 2) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 2) {
            cb = text;
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 3) {
            if (canvas.getContext && typeof cb === "undefined") {
              cb = opts;
              opts = void 0;
            } else {
              cb = opts;
              opts = text;
              text = canvas;
              canvas = void 0;
            }
          }
        } else {
          if (argsNum < 1) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 1) {
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 2 && !canvas.getContext) {
            opts = text;
            text = canvas;
            canvas = void 0;
          }
          return new Promise(function(resolve, reject) {
            try {
              const data = QRCode2.create(text, opts);
              resolve(renderFunc(data, canvas, opts));
            } catch (e) {
              reject(e);
            }
          });
        }
        try {
          const data = QRCode2.create(text, opts);
          cb(null, renderFunc(data, canvas, opts));
        } catch (e) {
          cb(e);
        }
      }
      exports.create = QRCode2.create;
      exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
      exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
      exports.toString = renderCanvas.bind(null, function(data, _, opts) {
        return SvgRenderer.render(data, opts);
      });
    }
  });

  // assets/js/storage.js
  var STORAGE_KEY = "linkpage_settings_v8";
  var DEFAULT_SETTINGS = {
    brand: {
      name: "Kady",
      description: "\u0645\u062A\u062C\u0631 \u0628\u064A\u0639 \u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A \u062A\u062C\u0645\u064A\u0644 \u0648\u0627\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A\n\u0645\u062A\u062C\u0631 \u0628\u064A\u0639 \u0628\u0627\u0644\u062A\u062C\u0632\u0626\u0629 \u0648\u0627\u0644\u062C\u0645\u0644\u0629",
      website: ""
    },
    logo: {
      url: "",
      // No default logo
      badgeText: "\u0646\u0634\u0637"
    },
    profile: {
      avatar: "",
      // No default photo
      badge: "\u0646\u0634\u0637",
      verified: true
    },
    theme: {
      mode: "light",
      // 'light', 'dark', 'custom', 'auto'
      preset: "clean-minimalism",
      glassmorphism: true,
      glassBlur: "16px"
    },
    colors: {
      primary: "#4f46e5",
      secondary: "#6366f1",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#0f172a",
      textSecondary: "#64748b",
      buttonBg: "#ffffff",
      buttonText: "#0f172a",
      buttonBorder: "#e2e8f0",
      buttonHover: "#f8fafc",
      accent: "#818cf8"
    },
    typography: {
      fontFamily: "Cairo",
      fontSize: "medium",
      fontWeight: "500",
      rtl: true
    },
    auth: {
      username: "admin",
      password: "admin123",
      enabled: true
    },
    links: [
      {
        id: "l1",
        platform: "WhatsApp",
        label: "\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628",
        url: "https://iwtsp.com/201005019951",
        enabled: true,
        featured: true,
        badge: "\u0645\u0628\u0627\u0634\u0631"
      },
      {
        id: "l2",
        platform: "Facebook",
        label: "\u0635\u0641\u062D\u062A\u0646\u0627 \u0639\u0644\u0649 \u0641\u064A\u0633\u0628\u0648\u0643",
        url: "https://www.facebook.com/share/1BU8LP7iX8/",
        enabled: true,
        featured: false,
        badge: ""
      },
      {
        id: "l3",
        platform: "TikTok",
        label: "\u062D\u0633\u0627\u0628\u0646\u0627 \u0639\u0644\u0649 \u062A\u064A\u0643 \u062A\u0648\u0643",
        url: "https://www.tiktok.com/@user5079433482615?_r=1&_t=ZS-98WAJ3ILOaO",
        enabled: true,
        featured: false,
        badge: ""
      },
      {
        id: "l4",
        platform: "Instagram",
        label: "\u062D\u0633\u0627\u0628\u0646\u0627 \u0639\u0644\u0649 \u0625\u0646\u0633\u062A\u063A\u0631\u0627\u0645",
        url: "https://www.instagram.com/kdy.kady?igsh=cmM1dHBvaXp1ZGpv",
        enabled: true,
        featured: false,
        badge: ""
      }
    ],
    seo: {
      metaTitle: "Kady | \u0645\u062A\u062C\u0631 \u0628\u064A\u0639 \u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A \u062A\u062C\u0645\u064A\u0644 \u0648\u0627\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A",
      metaDescription: "\u0645\u062A\u062C\u0631 \u0628\u064A\u0639 \u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A \u062A\u062C\u0645\u064A\u0644 \u0648\u0627\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A - \u0645\u062A\u062C\u0631 \u0628\u064A\u0639 \u0628\u0627\u0644\u062A\u062C\u0632\u0626\u0629 \u0648\u0627\u0644\u062C\u0645\u0644\u0629",
      keywords: "Kady, \u0645\u0633\u062A\u062D\u0636\u0631\u0627\u062A \u062A\u062C\u0645\u064A\u0644, \u0627\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A, \u0628\u064A\u0639 \u0628\u0627\u0644\u062A\u062C\u0632\u0626\u0629, \u0628\u064A\u0639 \u0628\u0627\u0644\u062C\u0645\u0644\u0629, \u0643\u0627\u062F\u064A"
    }
  };
  var inMemorySettings = null;
  function mergeWithDefaults(parsed) {
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_SETTINGS };
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      brand: { ...DEFAULT_SETTINGS.brand, ...parsed.brand || {} },
      logo: { ...DEFAULT_SETTINGS.logo, ...parsed.logo || {} },
      profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile || {} },
      theme: { ...DEFAULT_SETTINGS.theme, ...parsed.theme || {} },
      colors: { ...DEFAULT_SETTINGS.colors, ...parsed.colors || {} },
      typography: { ...DEFAULT_SETTINGS.typography, ...parsed.typography || {} },
      seo: { ...DEFAULT_SETTINGS.seo, ...parsed.seo || {} },
      auth: { ...DEFAULT_SETTINGS.auth, ...parsed.auth || {} },
      links: Array.isArray(parsed.links) ? parsed.links : DEFAULT_SETTINGS.links
    };
  }
  function loadSettings() {
    let loadedRaw = null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) loadedRaw = data;
    } catch (e) {
      console.warn("LocalStorage read restricted:", e);
    }
    if (!loadedRaw) {
      try {
        const data = sessionStorage.getItem(STORAGE_KEY);
        if (data) loadedRaw = data;
      } catch (e) {
        console.warn("SessionStorage read restricted:", e);
      }
    }
    if (!loadedRaw) {
      try {
        if (window.name && window.name.startsWith("linkpage_data:")) {
          loadedRaw = window.name.substring("linkpage_data:".length);
        }
      } catch (e) {
        console.warn("window.name read restricted:", e);
      }
    }
    if (loadedRaw) {
      try {
        const parsed = JSON.parse(loadedRaw);
        const merged = mergeWithDefaults(parsed);
        inMemorySettings = merged;
        return merged;
      } catch (e) {
        console.error("Error parsing stored settings:", e);
      }
    }
    return inMemorySettings ? { ...inMemorySettings } : { ...DEFAULT_SETTINGS };
  }
  function saveSettings(settings2) {
    inMemorySettings = { ...settings2 };
    const jsonStr = JSON.stringify(settings2);
    try {
      localStorage.setItem(STORAGE_KEY, jsonStr);
    } catch (e) {
      console.warn("LocalStorage save restricted:", e);
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, jsonStr);
    } catch (e) {
      console.warn("SessionStorage save restricted:", e);
    }
    try {
      window.name = "linkpage_data:" + jsonStr;
    } catch (e) {
      console.warn("window.name save restricted:", e);
    }
    try {
      window.dispatchEvent(new CustomEvent("linkpage:settingsUpdated", { detail: settings2 }));
    } catch (e) {
    }
    return true;
  }
  function resetSettings() {
    inMemorySettings = { ...DEFAULT_SETTINGS };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
    }
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
    }
    try {
      if (window.name && window.name.startsWith("linkpage_data:")) {
        window.name = "";
      }
    } catch (e) {
    }
    window.dispatchEvent(new CustomEvent("linkpage:settingsUpdated", { detail: DEFAULT_SETTINGS }));
    return DEFAULT_SETTINGS;
  }
  function exportSettings(settings2) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings2, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `linkpage-config-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
  function importSettings(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid JSON structure");
      }
      const merged = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        brand: { ...DEFAULT_SETTINGS.brand, ...parsed.brand || {} },
        logo: { ...DEFAULT_SETTINGS.logo, ...parsed.logo || {} },
        profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile || {} },
        theme: { ...DEFAULT_SETTINGS.theme, ...parsed.theme || {} },
        colors: { ...DEFAULT_SETTINGS.colors, ...parsed.colors || {} },
        typography: { ...DEFAULT_SETTINGS.typography, ...parsed.typography || {} },
        seo: { ...DEFAULT_SETTINGS.seo, ...parsed.seo || {} },
        links: Array.isArray(parsed.links) ? parsed.links : DEFAULT_SETTINGS.links
      };
      saveSettings(merged);
      return { success: true, settings: merged };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  var memoryAuthSession = false;
  var AUTH_SESSION_KEY = "linkpage_editor_auth_session";
  function isEditorAuthenticated() {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === "true" || memoryAuthSession;
    } catch (e) {
      return memoryAuthSession;
    }
  }
  function verifyCredentials(inputUsername, inputPassword) {
    const settings2 = loadSettings();
    const validUsername = (settings2.auth?.username || DEFAULT_SETTINGS.auth.username).trim();
    const validPassword = (settings2.auth?.password || DEFAULT_SETTINGS.auth.password).trim();
    return (inputUsername || "").trim() === validUsername && (inputPassword || "").trim() === validPassword;
  }
  function loginEditorSession() {
    memoryAuthSession = true;
    try {
      sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    } catch (e) {
      console.warn("sessionStorage restricted:", e);
    }
  }
  function logoutEditorSession() {
    memoryAuthSession = false;
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch (e) {
      console.warn("sessionStorage restricted:", e);
    }
  }

  // assets/js/icons.js
  var SOCIAL_PLATFORMS = {
    Instagram: {
      name: "Instagram",
      placeholder: "https://instagram.com/username",
      defaultLabel: "Follow on Instagram",
      color: "#e1306c",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
    },
    Facebook: {
      name: "Facebook",
      placeholder: "https://facebook.com/username",
      defaultLabel: "Connect on Facebook",
      color: "#1877f2",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`
    },
    WhatsApp: {
      name: "WhatsApp",
      placeholder: "https://wa.me/1234567890",
      defaultLabel: "Message on WhatsApp",
      color: "#25d366",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`
    },
    TikTok: {
      name: "TikTok",
      placeholder: "https://tiktok.com/@username",
      defaultLabel: "Watch on TikTok",
      color: "#000000",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.38V9.07a6.34 6.34 0 0 0-1 .08A6.33 6.33 0 1 0 15.82 15V8.36a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.21z"/></svg>`
    },
    Telegram: {
      name: "Telegram",
      placeholder: "https://t.me/username",
      defaultLabel: "Join Telegram Channel",
      color: "#0088cc",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`
    },
    Threads: {
      name: "Threads",
      placeholder: "https://threads.net/@username",
      defaultLabel: "Follow on Threads",
      color: "#000000",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M15.5 12c0 2-1 3.5-3.5 3.5S8.5 14 8.5 12"/></svg>`
    },
    Pinterest: {
      name: "Pinterest",
      placeholder: "https://pinterest.com/username",
      defaultLabel: "Pins on Pinterest",
      color: "#e60023",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="12" x2="12" y2="21"/><path d="M8 12a4 4 0 1 1 8 0c0 3-2 5.5-4.5 5.5S8 15 8 12z"/><path d="M12 3a9 9 0 0 0-9 9c0 3.8 2.4 7 5.7 8.3"/></svg>`
    },
    YouTube: {
      name: "YouTube",
      placeholder: "https://youtube.com/@channel",
      defaultLabel: "Subscribe on YouTube",
      color: "#ff0000",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>`
    },
    LinkedIn: {
      name: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
      defaultLabel: "Connect on LinkedIn",
      color: "#0a66c2",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`
    },
    Snapchat: {
      name: "Snapchat",
      placeholder: "https://snapchat.com/add/username",
      defaultLabel: "Add on Snapchat",
      color: "#fffc00",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a6 6 0 0 0-6 6c0 1.5.5 3 1.5 4.1C6.5 12.8 5 14 5 15.5c0 1 1 1.5 2 1.5.5 0 1-.2 1.5-.5.8.8 2.2 1.5 3.5 1.5s2.7-.7 3.5-1.5c.5.3 1 .5 1.5.5 1 0 2-.5 2-1.5 0-1.5-1.5-2.7-2.5-3.4 1-1.1 1.5-2.6 1.5-4.1a6 6 0 0 0-6-6z"/></svg>`
    },
    GitHub: {
      name: "GitHub",
      placeholder: "https://github.com/username",
      defaultLabel: "Star on GitHub",
      color: "#333333",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`
    },
    Behance: {
      name: "Behance",
      placeholder: "https://behance.net/username",
      defaultLabel: "Projects on Behance",
      color: "#1769ff",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h5a2.5 2.5 0 0 1 0 5H3V8zm0 5h6a2.5 2.5 0 0 1 0 5H3v-5z"/><path d="M14 13h7a3.5 3.5 0 1 0-7 0v2a3.5 3.5 0 0 0 7 0"/><line x1="15" y1="8" x2="20" y2="8"/></svg>`
    },
    Dribbble: {
      name: "Dribbble",
      placeholder: "https://dribbble.com/username",
      defaultLabel: "View Dribbble Shots",
      color: "#ea4c89",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 18.25"/></svg>`
    },
    Website: {
      name: "Website",
      placeholder: "https://yourwebsite.com",
      defaultLabel: "Visit Official Website",
      color: "#6366f1",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
    },
    Phone: {
      name: "Phone",
      placeholder: "tel:+1234567890",
      defaultLabel: "Call Directly",
      color: "#10b981",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
    },
    Email: {
      name: "Email",
      placeholder: "mailto:hello@example.com",
      defaultLabel: "Send an Email",
      color: "#f59e0b",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
    },
    "Google Maps": {
      name: "Google Maps",
      placeholder: "https://maps.google.com/?q=...",
      defaultLabel: "View Location on Maps",
      color: "#ea4335",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    },
    "Custom Link": {
      name: "Custom Link",
      placeholder: "https://example.com",
      defaultLabel: "Custom Web Link",
      color: "#8b5cf6",
      svg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
    }
  };
  var UI_ICONS = {
    edit: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    copyCheck: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    share: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    qr: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="18" y1="7" x2="18.01" y2="7"/><line x1="7" y1="18" x2="7.01" y2="18"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    grip: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    externalLink: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    verified: `<svg viewBox="0 0 24 24" width="18" height="18" fill="#38bdf8" stroke="none"><path d="M12 2L15.09 3.26L18.36 2.76L19.88 5.74L23 7L22.5 10.33L24 13.26L21.82 15.82L21.32 19.09L18.05 19.59L16.53 22.57L13.41 21.31L10.48 22.83L8.3 20.27L5.03 19.77L4.53 16.5L1.45 15.24L1.95 11.91L0.43 8.98L2.61 6.42L3.11 3.15L6.38 2.65L7.9 0.33L11.02 1.59L12 2Z"/><path d="M9.5 12L11 13.5L15 9.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    duplicate: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    sparkler: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`
  };
  function getPlatformIcon(platformName) {
    const plat = SOCIAL_PLATFORMS[platformName];
    if (plat) return plat.svg;
    return SOCIAL_PLATFORMS["Custom Link"].svg;
  }

  // assets/js/utils.js
  var import_qrcode = __toESM(require_browser(), 1);
  function showToast(message, type = "info", duration = 3e3) {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;
    const iconMap = {
      success: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    };
    toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;
    toastContainer.appendChild(toast);
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => removeToast(toast));
    setTimeout(() => removeToast(toast), duration);
  }
  function removeToast(toast) {
    if (!toast || toast.classList.contains("toast-hiding")) return;
    toast.classList.add("toast-hiding");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }
  function showModal({ title, content, confirmText = "Confirm", cancelText = "Cancel", type = "info", onConfirm, onCancel }) {
    const existingModal = document.getElementById("app-modal");
    if (existingModal) existingModal.remove();
    const backdrop = document.createElement("div");
    backdrop.id = "app-modal";
    backdrop.className = "modal-backdrop animate-fade-in";
    backdrop.innerHTML = `
    <div class="modal-card modal-${type} animate-scale-up" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <h3 id="modal-title" class="modal-title">${escapeHtml(title)}</h3>
        <button class="modal-close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${cancelText ? `<button class="btn btn-secondary modal-cancel-btn">${escapeHtml(cancelText)}</button>` : ""}
        ${confirmText ? `<button class="btn btn-primary modal-confirm-btn">${escapeHtml(confirmText)}</button>` : ""}
      </div>
    </div>
  `;
    document.body.appendChild(backdrop);
    const close = () => {
      backdrop.classList.add("modal-closing");
      backdrop.addEventListener("animationend", () => backdrop.remove());
    };
    backdrop.querySelector(".modal-close")?.addEventListener("click", () => {
      close();
      if (onCancel) onCancel();
    });
    backdrop.querySelector(".modal-cancel-btn")?.addEventListener("click", () => {
      close();
      if (onCancel) onCancel();
    });
    backdrop.querySelector(".modal-confirm-btn")?.addEventListener("click", async () => {
      if (onConfirm) {
        const res = await onConfirm();
        if (res !== false) close();
      } else {
        close();
      }
    });
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        close();
        if (onCancel) onCancel();
      }
    });
    return { close };
  }
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function compressImage(file, maxWidth = 500, maxHeight = 500, quality = 0.85) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("\u0644\u0645 \u064A\u062A\u0645 \u0625\u0631\u0641\u0627\u0642 \u0623\u064A \u0645\u0644\u0641"));
      }
      const fileName = (file.name || "").toLowerCase();
      const isImageExt = /\.(png|jpe?g|webp|gif|svg|bmp|ico)$/i.test(fileName);
      const isImageType = Boolean(file.type && file.type.startsWith("image/"));
      if (!isImageType && !isImageExt) {
        return reject(new Error("\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u062E\u062A\u0627\u0631 \u0644\u064A\u0633 \u0635\u0648\u0631\u0629 \u0635\u0627\u0644\u062D\u0629"));
      }
      const reader = new FileReader();
      reader.onerror = (err) => reject(err);
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        if (file.type === "image/svg+xml" || fileName.endsWith(".svg")) {
          return resolve(rawDataUrl);
        }
        const img = new Image();
        img.onload = () => {
          try {
            let width = img.width || maxWidth;
            let height = img.height || maxHeight;
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                if (width > maxWidth) {
                  height = Math.round(height * maxWidth / width);
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width = Math.round(width * maxHeight / height);
                  height = maxHeight;
                }
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width || 100;
            canvas.height = height || 100;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const isPng = file.type === "image/png" || fileName.endsWith(".png");
            const outputType = isPng ? "image/png" : "image/jpeg";
            const dataUrl = canvas.toDataURL(outputType, quality);
            resolve(dataUrl || rawDataUrl);
          } catch (err) {
            console.warn("Canvas compression error, using raw Data URL", err);
            resolve(rawDataUrl);
          }
        };
        img.onerror = (err) => {
          console.warn("Image load error, using raw Data URL", err);
          resolve(rawDataUrl);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  // assets/js/preview.js
  function renderPreview(settings2, containerElement) {
    if (!containerElement || !settings2) return;
    applyThemeStyles(settings2, containerElement);
    const { brand, profile, links, typography } = settings2;
    const activeLinks = (links || []).filter((l) => l.enabled);
    let linksHtml = "";
    if (activeLinks.length === 0) {
      linksHtml = `
      <div class="empty-state">
        <div class="empty-state-icon">${UI_ICONS.sparkler}</div>
        <p>No active links available yet. Add links in the editor!</p>
      </div>
    `;
    } else {
      linksHtml = activeLinks.map((link, idx) => {
        const isFeatured = link.featured;
        let platformIcon = getPlatformIcon(link.platform);
        const staggerClass = `stagger-${idx % 7 + 1}`;
        return `
        <a href="${escapeHtml(link.url)}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="link-card ${isFeatured ? "link-card-featured" : ""} has-ripple animate-slide-up ${staggerClass}"
           data-link-id="${link.id}">
          <div class="link-card-icon">
            ${platformIcon}
          </div>
          <div class="link-card-content">
            <span class="link-card-label">${escapeHtml(link.label || link.platform)}</span>
            ${link.badge ? `<span class="link-card-badge">${escapeHtml(link.badge)}</span>` : ""}
          </div>
          <span class="link-card-arrow">${UI_ICONS.externalLink}</span>
        </a>
      `;
      }).join("");
    }
    containerElement.innerHTML = `
    <div class="profile-hero">
      <div class="profile-identity">
        <div class="brand-title-row">
          <h1 class="profile-name">${escapeHtml(brand.name || "Your Name")}</h1>
          ${profile.verified ? `<span class="verified-badge" title="Verified Profile">${UI_ICONS.verified}</span>` : ""}
        </div>
        
        ${brand.description ? `<p class="profile-bio">${escapeHtml(brand.description)}</p>` : ""}
        
        ${brand.website ? `
          <a href="${escapeHtml(brand.website)}" target="_blank" rel="noopener noreferrer" class="website-pill-btn">
            ${getPlatformIcon("Website")}
            <span>${escapeHtml(brand.website.replace(/^https?:\/\//, ""))}</span>
            <span style="opacity: 0.7;">${UI_ICONS.externalLink}</span>
          </a>
        ` : ""}

        ${profile.badge ? `
          <div class="profile-status-pill">
            <span class="status-dot"></span>
            <span>${escapeHtml(profile.badge)}</span>
          </div>
        ` : ""}
      </div>
    </div>

    <div class="links-list">
      ${linksHtml}
    </div>
  `;
    containerElement.querySelectorAll(".has-ripple").forEach((btn) => {
      btn.addEventListener("click", function(e) {
        const circle = document.createElement("span");
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add("ripple-circle");
        const ripple = btn.getElementsByClassName("ripple-circle")[0];
        if (ripple) ripple.remove();
        btn.appendChild(circle);
      });
    });
  }
  function applyThemeStyles(settings2, containerElement) {
    const root = document.documentElement;
    const { theme, colors, typography } = settings2;
    let activeMode = theme.mode;
    if (activeMode === "auto") {
      activeMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", activeMode);
    if (theme.preset && theme.preset !== "custom") {
      root.setAttribute("data-theme-preset", theme.preset);
    } else {
      root.removeAttribute("data-theme-preset");
    }
    if (typography.rtl) {
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("dir", "ltr");
    }
    if (colors) {
      if (colors.primary) root.style.setProperty("--color-primary", colors.primary);
      if (colors.secondary) root.style.setProperty("--color-secondary", colors.secondary);
      if (colors.background) {
        root.style.setProperty("--color-bg", colors.background);
        if (theme.preset === "custom") {
          root.style.setProperty("--color-bg-gradient", colors.background);
        }
      }
      if (colors.text) root.style.setProperty("--color-text", colors.text);
      if (colors.buttonBg) root.style.setProperty("--btn-bg", colors.buttonBg);
      if (colors.buttonText) root.style.setProperty("--btn-text", colors.buttonText);
    }
    if (typography.fontFamily) {
      root.style.setProperty("--font-family-base", `'${typography.fontFamily}', sans-serif`);
      loadGoogleFont(typography.fontFamily);
    }
    if (typography.fontSize === "small") {
      root.style.setProperty("--font-size-base", "14px");
    } else if (typography.fontSize === "large") {
      root.style.setProperty("--font-size-base", "18px");
    } else {
      root.style.setProperty("--font-size-base", "16px");
    }
  }
  function loadGoogleFont(fontName) {
    if (!fontName) return;
    const fontId = "google-font-" + fontName.toLowerCase().replace(/\s+/g, "-");
    if (document.getElementById(fontId)) return;
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }

  // assets/js/edit.js
  var settings = null;
  var livePreviewFrame = null;
  document.addEventListener("DOMContentLoaded", () => {
    initEditPage();
  });
  function initEditPage() {
    settings = loadSettings();
    livePreviewFrame = document.getElementById("device-preview-content");
    setupEditorAuth();
    updateLivePreview();
    populateFormFields();
    renderEditableLinksList();
    bindFormChangeEvents();
    bindNavbarActions();
    window.addEventListener("beforeunload", () => {
      if (settings) {
        saveSettings(settings);
      }
    });
    document.querySelectorAll('a[href="index.html"]').forEach((link) => {
      link.addEventListener("click", () => {
        if (settings) {
          saveSettings(settings);
        }
      });
    });
  }
  function updateLivePreview() {
    if (livePreviewFrame) {
      renderPreview(settings, livePreviewFrame);
    }
    if (settings) {
      saveSettings(settings);
    }
  }
  function populateFormFields() {
    setInputValue("brand-name", settings.brand.name);
    setInputValue("brand-description", settings.brand.description);
    setInputValue("brand-website", settings.brand.website);
    setInputValue("profile-avatar-path", settings.profile.avatar || "");
    setInputValue("profile-badge", settings.profile.badge || "");
    setCheckboxValue("profile-verified", settings.profile.verified);
    setInputValue("logo-url-path", settings.logo.url || "");
    setInputValue("logo-badge-text", settings.logo.badgeText || "");
    setSelectValue("theme-mode", settings.theme.mode || "light");
    setSelectValue("theme-preset", settings.theme.preset || "clean-minimalism");
    setInputValue("color-primary", settings.colors.primary || "#4f46e5");
    setInputValue("color-secondary", settings.colors.secondary || "#6366f1");
    setInputValue("color-bg", settings.colors.background || "#f8fafc");
    setInputValue("color-text", settings.colors.text || "#0f172a");
    setInputValue("color-btn-bg", settings.colors.buttonBg || "#ffffff");
    setSelectValue("typography-font", settings.typography.fontFamily || "Plus Jakarta Sans");
    setSelectValue("typography-size", settings.typography.fontSize || "medium");
    setCheckboxValue("typography-rtl", settings.typography.rtl || false);
    setInputValue("seo-title", settings.seo?.metaTitle || "");
    setInputValue("seo-description", settings.seo?.metaDescription || "");
    setInputValue("seo-keywords", settings.seo?.keywords || "");
    setInputValue("auth-username", settings.auth?.username || "admin");
    setInputValue("auth-password", settings.auth?.password || "admin123");
    updateImagePreviewElements();
  }
  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val !== void 0 ? val : "";
  }
  function setSelectValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  function setCheckboxValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(val);
  }
  function updateImagePreviewElements() {
    const avatarPathInput = document.getElementById("profile-avatar-path");
    if (avatarPathInput && avatarPathInput !== document.activeElement) {
      avatarPathInput.value = settings.profile.avatar || "";
    }
    const avatarImg = document.getElementById("avatar-preview-img");
    if (avatarImg) {
      avatarImg.src = settings.profile.avatar || "assets/images/el doctor logo-01.png";
    }
    const logoPathInput = document.getElementById("logo-url-path");
    if (logoPathInput && logoPathInput !== document.activeElement) {
      logoPathInput.value = settings.logo.url || "";
    }
    const logoImg = document.getElementById("logo-preview-img");
    if (logoImg) {
      if (settings.logo.url) {
        logoImg.src = settings.logo.url;
        logoImg.style.display = "block";
      } else {
        logoImg.style.display = "none";
      }
    }
  }
  function bindFormChangeEvents() {
    bindRealtimeInput("brand-name", (val) => {
      settings.brand.name = val;
    });
    bindRealtimeInput("brand-description", (val) => {
      settings.brand.description = val;
    });
    bindRealtimeInput("brand-website", (val) => {
      settings.brand.website = val;
    });
    bindRealtimeInput("profile-avatar-path", (val) => {
      settings.profile.avatar = val.trim();
      updateImagePreviewElements();
    });
    bindRealtimeInput("logo-url-path", (val) => {
      settings.logo.url = val.trim();
      updateImagePreviewElements();
    });
    bindRealtimeInput("profile-badge", (val) => {
      settings.profile.badge = val;
    });
    bindRealtimeCheckbox("profile-verified", (val) => {
      settings.profile.verified = val;
    });
    bindRealtimeInput("logo-badge-text", (val) => {
      settings.logo.badgeText = val;
    });
    const avatarUploadInput = document.getElementById("avatar-file-input");
    if (avatarUploadInput) {
      avatarUploadInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const compressed = await compressImage(file, 500, 500, 0.9);
            settings.profile.avatar = compressed;
            updateImagePreviewElements();
            updateLivePreview();
            showToast("\u062A\u0645 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A \u0628\u0646\u062C\u0627\u062D!", "success");
          } catch (err) {
            console.error("Avatar upload error:", err);
            showToast("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631\u0629: " + (err.message || "\u0641\u0634\u0644 \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629"), "error");
          } finally {
            e.target.value = "";
          }
        }
      });
    }
    const removeAvatarBtn = document.getElementById("btn-remove-avatar");
    if (removeAvatarBtn) {
      removeAvatarBtn.addEventListener("click", () => {
        settings.profile.avatar = "assets/images/el doctor logo-01.png";
        updateImagePreviewElements();
        updateLivePreview();
        showToast("\u062A\u0645\u062A \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u062F\u0643\u062A\u0648\u0631 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629 PNG", "info");
      });
    }
    const logoUploadInput = document.getElementById("logo-file-input");
    if (logoUploadInput) {
      logoUploadInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const compressed = await compressImage(file, 400, 400, 0.9);
            settings.logo.url = compressed;
            updateImagePreviewElements();
            updateLivePreview();
            showToast("\u062A\u0645 \u0631\u0641\u0639 \u0634\u0639\u0627\u0631 \u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629 \u0628\u0646\u062C\u0627\u062D!", "success");
          } catch (err) {
            console.error("Logo upload error:", err);
            showToast("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0631\u0641\u0639 \u0627\u0644\u0634\u0639\u0627\u0631: " + (err.message || "\u0641\u0634\u0644 \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629"), "error");
          } finally {
            e.target.value = "";
          }
        }
      });
    }
    const removeLogoBtn = document.getElementById("btn-remove-logo");
    if (removeLogoBtn) {
      removeLogoBtn.addEventListener("click", () => {
        settings.logo.url = "";
        updateImagePreviewElements();
        updateLivePreview();
        showToast("\u062A\u0645 \u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0634\u0639\u0627\u0631 \u0627\u0644\u0641\u0631\u0639\u064A", "info");
      });
    }
    bindRealtimeSelect("theme-mode", (val) => {
      settings.theme.mode = val;
    });
    bindRealtimeSelect("theme-preset", (val) => {
      settings.theme.preset = val;
      if (val === "clean-minimalism") {
        settings.theme.mode = "light";
        settings.colors.background = "#f8fafc";
        settings.colors.primary = "#4f46e5";
        settings.colors.secondary = "#6366f1";
        settings.colors.text = "#0f172a";
        settings.colors.buttonBg = "#ffffff";
      } else if (val === "dark-luxury") {
        settings.colors.background = "#0f172a";
        settings.colors.primary = "#6366f1";
        settings.colors.secondary = "#8b5cf6";
        settings.colors.text = "#f8fafc";
      } else if (val === "clean-paper") {
        settings.colors.background = "#fafafa";
        settings.colors.primary = "#18181b";
        settings.colors.text = "#18181b";
        settings.colors.buttonBg = "#ffffff";
      } else if (val === "ocean-breeze") {
        settings.colors.background = "#0f172a";
        settings.colors.primary = "#0284c7";
        settings.colors.text = "#f8fafc";
      } else if (val === "sunset-glow") {
        settings.colors.background = "#18181b";
        settings.colors.primary = "#f43f5e";
        settings.colors.text = "#f9fafb";
      }
      populateFormFields();
    });
    bindRealtimeInput("color-primary", (val) => {
      settings.colors.primary = val;
    });
    bindRealtimeInput("color-secondary", (val) => {
      settings.colors.secondary = val;
    });
    bindRealtimeInput("color-bg", (val) => {
      settings.colors.background = val;
      settings.theme.preset = "custom";
    });
    bindRealtimeInput("color-text", (val) => {
      settings.colors.text = val;
    });
    bindRealtimeInput("color-btn-bg", (val) => {
      settings.colors.buttonBg = val;
    });
    bindRealtimeSelect("typography-font", (val) => {
      settings.typography.fontFamily = val;
    });
    bindRealtimeSelect("typography-size", (val) => {
      settings.typography.fontSize = val;
    });
    bindRealtimeCheckbox("typography-rtl", (val) => {
      settings.typography.rtl = val;
    });
    bindRealtimeInput("seo-title", (val) => {
      if (!settings.seo) settings.seo = {};
      settings.seo.metaTitle = val;
    });
    bindRealtimeInput("seo-description", (val) => {
      if (!settings.seo) settings.seo = {};
      settings.seo.metaDescription = val;
    });
    bindRealtimeInput("seo-keywords", (val) => {
      if (!settings.seo) settings.seo = {};
      settings.seo.keywords = val;
    });
    bindRealtimeInput("auth-username", (val) => {
      if (!settings.auth) settings.auth = {};
      settings.auth.username = val || "admin";
    });
    bindRealtimeInput("auth-password", (val) => {
      if (!settings.auth) settings.auth = {};
      settings.auth.password = val || "admin123";
    });
  }
  function setupEditorAuth() {
    const loginOverlay = document.getElementById("login-modal-overlay");
    const loginForm = document.getElementById("editor-login-form");
    const errorAlert = document.getElementById("login-error-alert");
    const logoutBtn = document.getElementById("btn-logout-editor");
    if (!loginOverlay || !loginForm) return;
    if (isEditorAuthenticated()) {
      loginOverlay.classList.add("hidden");
      loginOverlay.style.display = "none";
    } else {
      loginOverlay.classList.remove("hidden");
      loginOverlay.style.display = "flex";
    }
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById("login-username-input");
      const passwordInput = document.getElementById("login-password-input");
      const username = usernameInput ? usernameInput.value : "";
      const password = passwordInput ? passwordInput.value : "";
      if (verifyCredentials(username, password)) {
        loginEditorSession();
        loginOverlay.classList.add("hidden");
        loginOverlay.style.display = "none";
        if (errorAlert) errorAlert.style.display = "none";
        showToast("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D! \u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u0639\u062F\u064A\u0644", "success");
      } else {
        if (errorAlert) {
          errorAlert.textContent = "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629!";
          errorAlert.style.display = "block";
        }
        showToast("\u062E\u0637\u0623 \u0641\u064A \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631", "error");
      }
    });
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logoutEditorSession();
        loginOverlay.classList.remove("hidden");
        loginOverlay.style.display = "flex";
        const usernameInput = document.getElementById("login-username-input");
        const passwordInput = document.getElementById("login-password-input");
        if (usernameInput) usernameInput.value = "";
        if (passwordInput) passwordInput.value = "";
        if (errorAlert) errorAlert.style.display = "none";
        showToast("\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0645\u0646 \u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0639\u062F\u064A\u0644", "info");
      });
    }
  }
  function bindRealtimeInput(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      const handler = (e) => {
        callback(e.target.value);
        updateLivePreview();
      };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    }
  }
  function bindRealtimeSelect(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      const handler = (e) => {
        callback(e.target.value);
        updateLivePreview();
      };
      el.addEventListener("change", handler);
      el.addEventListener("input", handler);
    }
  }
  function bindRealtimeCheckbox(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      const handler = (e) => {
        callback(e.target.checked);
        updateLivePreview();
      };
      el.addEventListener("change", handler);
    }
  }
  function renderEditableLinksList() {
    const listContainer = document.getElementById("editable-links-list");
    if (!listContainer) return;
    if (settings.links.length === 0) {
      listContainer.innerHTML = `
      <div class="empty-state" style="padding: 24px;">
        <p>No links added yet. Click "Add New Link" below!</p>
      </div>
    `;
      return;
    }
    const platformsOptions = Object.keys(SOCIAL_PLATFORMS).map((plat) => `<option value="${plat}">${plat}</option>`).join("");
    listContainer.innerHTML = settings.links.map((link, index) => {
      return `
      <div class="editable-link-card animate-fade-in" data-id="${link.id}" data-index="${index}" draggable="true">
        <div class="link-card-top">
          <span class="drag-handle" title="Drag to reorder">${UI_ICONS.grip}</span>
          
          <select class="form-select link-platform-select" data-action="platform" data-id="${link.id}">
            ${Object.keys(SOCIAL_PLATFORMS).map((p) => `<option value="${p}" ${p === link.platform ? "selected" : ""}>${p}</option>`).join("")}
          </select>

          <div class="link-actions-group">
            <label class="toggle-switch" title="Enable or Disable Link">
              <input type="checkbox" data-action="toggle-enable" data-id="${link.id}" ${link.enabled ? "checked" : ""} />
              <span class="toggle-slider"></span>
            </label>
            
            <button class="btn btn-secondary btn-sm btn-icon" data-action="duplicate" data-id="${link.id}" title="Duplicate link">
              ${UI_ICONS.duplicate}
            </button>
            
            <button class="btn btn-danger btn-sm btn-icon" data-action="delete" data-id="${link.id}" title="Delete link">
              ${UI_ICONS.trash}
            </button>
          </div>
        </div>

        <div class="link-inputs-grid">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Title / Label</label>
            <input type="text" class="form-input" data-action="label" data-id="${link.id}" value="${escapeHtml(link.label)}" placeholder="Link Title" />
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">URL / Endpoint</label>
            <input type="text" class="form-input" data-action="url" data-id="${link.id}" value="${escapeHtml(link.url)}" placeholder="https://" />
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; margin-top: 4px;">
          <div class="form-group" style="margin-bottom:0; flex:1;">
            <input type="text" class="form-input" data-action="badge" data-id="${link.id}" value="${escapeHtml(link.badge || "")}" placeholder="Badge tag (e.g. NEW, 50% OFF)" style="font-size:0.8rem; padding: 6px 10px;" />
          </div>
          
          <label style="display:flex; align-items:center; gap:6px; font-size:0.8rem; cursor:pointer; color: var(--color-text-secondary);">
            <input type="checkbox" data-action="featured" data-id="${link.id}" ${link.featured ? "checked" : ""} />
            Highlight Card
          </label>
        </div>
      </div>
    `;
    }).join("");
    bindLinkItemEvents(listContainer);
    bindDragAndDrop(listContainer);
  }
  function bindLinkItemEvents(listContainer) {
    listContainer.querySelectorAll("[data-action]").forEach((element) => {
      const action = element.getAttribute("data-action");
      const id = element.getAttribute("data-id");
      if (action === "platform") {
        element.addEventListener("change", (e) => {
          const platformName = e.target.value;
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            link.platform = platformName;
            const config = SOCIAL_PLATFORMS[platformName];
            if (config) {
              link.label = config.defaultLabel;
              link.url = config.placeholder;
            }
            renderEditableLinksList();
            updateLivePreview();
          }
        });
      } else if (action === "label") {
        element.addEventListener("input", (e) => {
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            link.label = e.target.value;
            updateLivePreview();
          }
        });
      } else if (action === "url") {
        element.addEventListener("input", (e) => {
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            link.url = e.target.value;
            updateLivePreview();
          }
        });
      } else if (action === "badge") {
        element.addEventListener("input", (e) => {
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            link.badge = e.target.value;
            updateLivePreview();
          }
        });
      } else if (action === "toggle-enable") {
        element.addEventListener("change", (e) => {
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            link.enabled = e.target.checked;
            updateLivePreview();
          }
        });
      } else if (action === "featured") {
        element.addEventListener("change", (e) => {
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            link.featured = e.target.checked;
            updateLivePreview();
          }
        });
      } else if (action === "delete") {
        element.addEventListener("click", () => {
          settings.links = settings.links.filter((l) => l.id !== id);
          renderEditableLinksList();
          updateLivePreview();
          showToast("Link removed", "info");
        });
      } else if (action === "duplicate") {
        element.addEventListener("click", () => {
          const link = settings.links.find((l) => l.id === id);
          if (link) {
            const dup = {
              ...link,
              id: "l_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
              label: link.label + " (Copy)"
            };
            settings.links.push(dup);
            renderEditableLinksList();
            updateLivePreview();
            showToast("Link duplicated", "success");
          }
        });
      }
    });
  }
  function bindDragAndDrop(container) {
    let draggedCard = null;
    container.querySelectorAll(".editable-link-card").forEach((card) => {
      card.addEventListener("dragstart", (e) => {
        draggedCard = card;
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });
      card.addEventListener("dragend", () => {
        if (draggedCard) {
          draggedCard.classList.remove("dragging");
          draggedCard = null;
        }
        reorderLinksFromDOM(container);
      });
      card.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
          container.appendChild(draggedCard);
        } else {
          container.insertBefore(draggedCard, afterElement);
        }
      });
    });
  }
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".editable-link-card:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  function reorderLinksFromDOM(container) {
    const newOrderedIds = [...container.querySelectorAll(".editable-link-card")].map((card) => card.getAttribute("data-id"));
    const reordered = [];
    newOrderedIds.forEach((id) => {
      const found = settings.links.find((l) => l.id === id);
      if (found) reordered.push(found);
    });
    settings.links = reordered;
    updateLivePreview();
  }
  function bindNavbarActions() {
    const saveBtn = document.getElementById("btn-save-settings");
    const saveBtnBottom = document.getElementById("btn-save-settings-bottom");
    const resetBtn = document.getElementById("btn-reset-settings");
    const exportBtn = document.getElementById("btn-export-settings");
    const importInput = document.getElementById("import-file-input");
    const previewBtn = document.getElementById("btn-view-public");
    const handleSave = () => {
      const saved = saveSettings(settings);
      if (saved) {
        showToast("\u062A\u0645 \u062D\u0641\u0638 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0628\u0646\u062C\u0627\u062D! \u{1F389}", "success");
        updateLivePreview();
      } else {
        showToast("\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A", "error");
      }
    };
    if (saveBtn) saveBtn.addEventListener("click", handleSave);
    if (saveBtnBottom) saveBtnBottom.addEventListener("click", handleSave);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        showModal({
          title: "Reset to Defaults?",
          content: "<p>Are you sure you want to reset all customizations and links back to the original default layout? Unsaved changes will be lost.</p>",
          confirmText: "Reset Everything",
          cancelText: "Cancel",
          type: "danger",
          onConfirm: () => {
            settings = resetSettings();
            populateFormFields();
            renderEditableLinksList();
            updateLivePreview();
            showToast("Settings reset to defaults", "info");
          }
        });
      });
    }
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        exportSettings(settings);
        showToast("Settings configuration exported to JSON file", "success");
      });
    }
    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = importSettings(event.target.result);
            if (res.success) {
              settings = res.settings;
              populateFormFields();
              renderEditableLinksList();
              updateLivePreview();
              showToast("Settings imported successfully!", "success");
            } else {
              showToast("Import failed: " + res.error, "error");
            }
          };
          reader.readAsText(file);
        }
      });
    }
    if (previewBtn) {
      previewBtn.addEventListener("click", () => {
        saveSettings(settings);
        const newWin = window.open("index.html", "_blank");
        if (newWin) {
          try {
            newWin.name = "linkpage_data:" + JSON.stringify(settings);
          } catch (e) {
          }
        }
      });
    }
  }
})();
