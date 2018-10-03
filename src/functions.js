import contains from './contains';
import {BigNumber} from 'bignumber.js';

export function add(a, b) {
  return new BigNumber(a).plus(b).toNumber();
}

export function sub(a, b) {
  return new BigNumber(a).minus(b).toNumber();
}

export function mul(a, b) {
  return new BigNumber(a).times(b).toNumber();
}

export function div(a, b) {
  return new BigNumber(a).div(b).toNumber();
}

export function mod(a, b) {
  return new BigNumber(a).mod(b).toNumber();
}

export function concat(a, b) {
  return '' + a + b;
}

export function equal(a, b) {
  return a === b;
}

export function notEqual(a, b) {
  return a !== b;
}

export function greaterThan(a, b) {
  return new BigNumber(a).isGreaterThan(b);
}

export function lessThan(a, b) {
  return new BigNumber(a).isLessThan(b);
}

export function greaterThanEqual(a, b) {
  return new BigNumber(a).isGreaterThanOrEqualTo(b);
}

export function lessThanEqual(a, b) {
  return new BigNumber(a).isLessThanOrEqualTo(b);
}

export function andOperator(a, b) {
  return Boolean(a && b);
}

export function orOperator(a, b) {
  return Boolean(a || b);
}

export function inOperator(a, b) {
  return contains(b, a);
}

export function sinh(a) {
  return BigNumber(BigNumber(Math.exp(a)).minus(Math.exp(-a))).div(2).toNumber();
}

export function cosh(a) {
  return (BigNumber(BigNumber(Math.exp(a)).plus(Math.exp(-a))).div(2)).toNumber();
}

export function tanh(a) {
  if (a === Infinity) return 1;
  if (a === -Infinity) return -1;
  return BigNumber(BigNumber(Math.exp(a)).minus(Math.exp(-a))).div(BigNumber(Math.exp(a)).plus(Math.exp(-a))).toNumber();
}

export function asinh(a) {
  if (a === -Infinity) return a;
  return Math.log(BigNumber(a).plus(BigNumber(a).times(a).plus(1)).sqrt().toNumber());
}

export function acosh(a) {
  return Math.log(BigNumber(a).plus(BigNumber(a).times(a).minus(1).sqrt()).toNumber());
}

export function atanh(a) {
  return (Math.log(BigNumber(BigNumber(1).plus(a)).div(BigNumber(1).minus(a)).div(2).toNumber()));
}

export function log10(a) {
  return BigNumber(Math.log(a)).times(Math.LOG10E).toNumber();
}

export function neg(a) {
  return BigNumber(a).negated().toNumber();
}

export function not(a) {
  return !a;
}

export function trunc(a) {
  return a < 0 ? Math.ceil(a) : Math.floor(a);
}

export function random(a) {
  return Math.random() * (a || 1);
}

export function factorial(a) { // a!
  return gamma(a + 1);
}

function isInteger(value) {
  return isFinite(value) && (value === Math.round(value));
}

var GAMMA_G = 4.7421875;
var GAMMA_P = [
  0.99999999999999709182,
  57.156235665862923517, -59.597960355475491248,
  14.136097974741747174, -0.49191381609762019978,
  0.33994649984811888699e-4,
  0.46523628927048575665e-4, -0.98374475304879564677e-4,
  0.15808870322491248884e-3, -0.21026444172410488319e-3,
  0.21743961811521264320e-3, -0.16431810653676389022e-3,
  0.84418223983852743293e-4, -0.26190838401581408670e-4,
  0.36899182659531622704e-5
];

// Gamma function from math.js
export function gamma(n) {
  var t, x;

  if (isInteger(n)) {
    if (n <= 0) {
      return isFinite(n) ? Infinity : NaN;
    }

    if (n > 171) {
      return Infinity; // Will overflow
    }

    var value = n - 2;
    var res = n - 1;
    while (value > 1) {
      res *= value;
      value--;
    }

    if (res === 0) {
      res = 1; // 0! is per definition 1
    }

    return res;
  }

  if (n < 0.5) {
    return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
  }

  if (n >= 171.35) {
    return Infinity; // will overflow
  }

  if (n > 85.0) { // Extended Stirling Approx
    var twoN = n * n;
    var threeN = twoN * n;
    var fourN = threeN * n;
    var fiveN = fourN * n;
    return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
      (1 + (1 / (12 * n)) + (1 / (288 * twoN)) - (139 / (51840 * threeN)) -
        (571 / (2488320 * fourN)) + (163879 / (209018880 * fiveN)) +
        (5246819 / (75246796800 * fiveN * n)));
  }

  --n;
  x = GAMMA_P[0];
  for (var i = 1; i < GAMMA_P.length; ++i) {
    x += GAMMA_P[i] / (n + i);
  }

  t = n + GAMMA_G + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

export function stringLength(s) {
  return String(s).length;
}

export function hypot() {
  var sum = 0;
  var larg = 0;
  for (var i = 0; i < arguments.length; i++) {
    var arg = Math.abs(arguments[i]);
    var div;
    if (larg < arg) {
      div = larg / arg;
      sum = (sum * div * div) + 1;
      larg = arg;
    } else if (arg > 0) {
      div = arg / larg;
      sum += div * div;
    } else {
      sum += arg;
    }
  }
  return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
}

export function condition(cond, yep, nope) {
  return cond ? yep : nope;
}

/**
 * Decimal adjustment of a number.
 * From @escopecz.
 *
 * @param {Number} value The number.
 * @param {Integer} exp  The exponent (the 10 logarithm of the adjustment base).
 * @return {Number} The adjusted value.
 */
export function roundTo(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }
  value = +value;
  exp = -(+exp);
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
