(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
var $author$project$Main$UrlRequested = function (a) {
	return {$: 'UrlRequested', a: a};
};
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Route$Login = {$: 'Login'};
var $author$project$Main$LoginPage = function (a) {
	return {$: 'LoginPage', a: a};
};
var $author$project$Main$RegisterPage = function (a) {
	return {$: 'RegisterPage', a: a};
};
var $author$project$Route$NotFound = {$: 'NotFound'};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Route$Game = function (a) {
	return {$: 'Game', a: a};
};
var $author$project$Route$Lobby = {$: 'Lobby'};
var $author$project$Route$Opponents = {$: 'Opponents'};
var $author$project$Route$Register = {$: 'Register'};
var $author$project$Route$Waiting = {$: 'Waiting'};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return $elm$url$Url$Parser$Parser(
			function (_v0) {
				var visited = _v0.visited;
				var unvisited = _v0.unvisited;
				var params = _v0.params;
				var frag = _v0.frag;
				var value = _v0.value;
				if (!unvisited.b) {
					return _List_Nil;
				} else {
					var next = unvisited.a;
					var rest = unvisited.b;
					var _v2 = stringToSomething(next);
					if (_v2.$ === 'Just') {
						var nextValue = _v2.a;
						return _List_fromArray(
							[
								A5(
								$elm$url$Url$Parser$State,
								A2($elm$core$List$cons, next, visited),
								rest,
								params,
								frag,
								value(nextValue))
							]);
					} else {
						return _List_Nil;
					}
				}
			});
	});
var $elm$url$Url$Parser$int = A2($elm$url$Url$Parser$custom, 'NUMBER', $elm$core$String$toInt);
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0.a;
		var parseAfter = _v1.a;
		return $elm$url$Url$Parser$Parser(
			function (state) {
				return A2(
					$elm$core$List$concatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Route$parser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Login,
			$elm$url$Url$Parser$s('login')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Register,
			$elm$url$Url$Parser$s('register')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Lobby,
			$elm$url$Url$Parser$s('lobby')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Opponents,
			$elm$url$Url$Parser$s('opponents')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Game,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('game'),
				$elm$url$Url$Parser$int)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Waiting,
			$elm$url$Url$Parser$s('waiting')),
			A2($elm$url$Url$Parser$map, $author$project$Route$Lobby, $elm$url$Url$Parser$top)
		]));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Route$fromUrl = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Route$NotFound,
		A2($elm$url$Url$Parser$parse, $author$project$Route$parser, url));
};
var $author$project$Page$Login$init = {error: $elm$core$Maybe$Nothing, password: '', pseudo: ''};
var $author$project$Page$Register$init = {email: '', error: $elm$core$Maybe$Nothing, password: '', pseudo: ''};
var $author$project$Main$GameMsg = function (a) {
	return {$: 'GameMsg', a: a};
};
var $author$project$Main$GamePage = function (a) {
	return {$: 'GamePage', a: a};
};
var $author$project$Main$LobbyMsg = function (a) {
	return {$: 'LobbyMsg', a: a};
};
var $author$project$Main$LobbyPage = function (a) {
	return {$: 'LobbyPage', a: a};
};
var $author$project$Main$OpponentsMsg = function (a) {
	return {$: 'OpponentsMsg', a: a};
};
var $author$project$Main$OpponentsPage = function (a) {
	return {$: 'OpponentsPage', a: a};
};
var $author$project$Main$WaitingMsg = function (a) {
	return {$: 'WaitingMsg', a: a};
};
var $author$project$Main$WaitingPage = function (a) {
	return {$: 'WaitingPage', a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$View$Board$defaultViewport = {offsetX: 0, offsetY: 0, scale: 1.0};
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $author$project$Page$Game$GotGameState = function (a) {
	return {$: 'GotGameState', a: a};
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 'Header', a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $author$project$Api$Http$authGet = F5(
	function (baseUrl, token, path, decoder, toMsg) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($elm$http$Http$expectJson, toMsg, decoder),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: _Utils_ap(baseUrl, path)
			});
	});
var $author$project$Types$Game$GameState = F4(
	function (id, board, players, bagCount) {
		return {bagCount: bagCount, board: board, id: id, players: players};
	});
var $author$project$Types$Tile$BoardTile = F2(
	function (face, coordinate) {
		return {coordinate: coordinate, face: face};
	});
var $author$project$Types$Tile$Coordinate = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Types$Tile$coordinateDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Tile$Coordinate,
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$int));
var $author$project$Types$Tile$TileFace = F2(
	function (color, shape) {
		return {color: color, shape: shape};
	});
var $author$project$Types$Color$Blue = {$: 'Blue'};
var $author$project$Types$Color$Green = {$: 'Green'};
var $author$project$Types$Color$Orange = {$: 'Orange'};
var $author$project$Types$Color$Purple = {$: 'Purple'};
var $author$project$Types$Color$Red = {$: 'Red'};
var $author$project$Types$Color$Yellow = {$: 'Yellow'};
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Types$Color$colorDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$andThen,
			function (s) {
				switch (s) {
					case 'Green':
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Green);
					case 'Blue':
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Blue);
					case 'Purple':
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Purple);
					case 'Red':
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Red);
					case 'Orange':
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Orange);
					case 'Yellow':
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Yellow);
					default:
						return $elm$json$Json$Decode$fail('Unknown color: ' + s);
				}
			},
			$elm$json$Json$Decode$string),
			A2(
			$elm$json$Json$Decode$andThen,
			function (n) {
				switch (n) {
					case 1:
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Green);
					case 2:
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Blue);
					case 3:
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Purple);
					case 4:
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Red);
					case 5:
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Orange);
					case 6:
						return $elm$json$Json$Decode$succeed($author$project$Types$Color$Yellow);
					default:
						return $elm$json$Json$Decode$fail(
							'Unknown color: ' + $elm$core$String$fromInt(n));
				}
			},
			$elm$json$Json$Decode$int)
		]));
var $author$project$Types$Shape$Circle = {$: 'Circle'};
var $author$project$Types$Shape$Clover = {$: 'Clover'};
var $author$project$Types$Shape$Diamond = {$: 'Diamond'};
var $author$project$Types$Shape$EightPointStar = {$: 'EightPointStar'};
var $author$project$Types$Shape$FourPointStar = {$: 'FourPointStar'};
var $author$project$Types$Shape$Square = {$: 'Square'};
var $author$project$Types$Shape$shapeDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$andThen,
			function (s) {
				switch (s) {
					case 'Circle':
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Circle);
					case 'Square':
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Square);
					case 'Diamond':
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Diamond);
					case 'Clover':
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Clover);
					case 'FourPointStar':
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$FourPointStar);
					case 'EightPointStar':
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$EightPointStar);
					default:
						return $elm$json$Json$Decode$fail('Unknown shape: ' + s);
				}
			},
			$elm$json$Json$Decode$string),
			A2(
			$elm$json$Json$Decode$andThen,
			function (n) {
				switch (n) {
					case 1:
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Circle);
					case 2:
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Square);
					case 3:
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Diamond);
					case 4:
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$Clover);
					case 5:
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$FourPointStar);
					case 6:
						return $elm$json$Json$Decode$succeed($author$project$Types$Shape$EightPointStar);
					default:
						return $elm$json$Json$Decode$fail(
							'Unknown shape: ' + $elm$core$String$fromInt(n));
				}
			},
			$elm$json$Json$Decode$int)
		]));
var $author$project$Types$Tile$tileFaceDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Tile$TileFace,
	A2($elm$json$Json$Decode$field, 'color', $author$project$Types$Color$colorDecoder),
	A2($elm$json$Json$Decode$field, 'shape', $author$project$Types$Shape$shapeDecoder));
var $author$project$Types$Tile$boardTileDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Tile$BoardTile,
	A2($elm$json$Json$Decode$field, 'face', $author$project$Types$Tile$tileFaceDecoder),
	A2($elm$json$Json$Decode$field, 'coordinate', $author$project$Types$Tile$coordinateDecoder));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Types$Player$Player = F7(
	function (id, pseudo, gamePosition, points, lastTurnPoints, rack, isTurn) {
		return {gamePosition: gamePosition, id: id, isTurn: isTurn, lastTurnPoints: lastTurnPoints, points: points, pseudo: pseudo, rack: rack};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map7 = _Json_map7;
var $author$project$Types$Tile$RackTile = F2(
	function (face, rackPosition) {
		return {face: face, rackPosition: rackPosition};
	});
var $author$project$Types$Tile$rackTileDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Tile$RackTile,
	A2($elm$json$Json$Decode$field, 'face', $author$project$Types$Tile$tileFaceDecoder),
	A2($elm$json$Json$Decode$field, 'rack_position', $elm$json$Json$Decode$int));
var $author$project$Types$Player$playerDecoder = A8(
	$elm$json$Json$Decode$map7,
	$author$project$Types$Player$Player,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'pseudo', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'game_position', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'points', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'last_turn_points', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'rack',
		$elm$json$Json$Decode$list($author$project$Types$Tile$rackTileDecoder)),
	A2($elm$json$Json$Decode$field, 'is_turn', $elm$json$Json$Decode$bool));
var $author$project$Types$Game$gameStateDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$Game$GameState,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'board',
		$elm$json$Json$Decode$list($author$project$Types$Tile$boardTileDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'players',
		$elm$json$Json$Decode$list($author$project$Types$Player$playerDecoder)),
	A2($elm$json$Json$Decode$field, 'bag_count', $elm$json$Json$Decode$int));
var $author$project$Page$Game$fetchGame = F3(
	function (baseUrl, token, gameId) {
		return A5(
			$author$project$Api$Http$authGet,
			baseUrl,
			token,
			'/api/games/' + $elm$core$String$fromInt(gameId),
			$author$project$Types$Game$gameStateDecoder,
			$author$project$Page$Game$GotGameState);
	});
var $author$project$Page$Game$init = F4(
	function (baseUrl, token, pseudo, gameId) {
		return _Utils_Tuple2(
			{
				bagCount: 0,
				baseUrl: baseUrl,
				board: _List_Nil,
				currentTurnPseudo: '',
				error: $elm$core$Maybe$Nothing,
				gameId: gameId,
				is3DView: false,
				isPanning: false,
				lastPlayedCoords: $elm$core$Set$empty,
				loading: true,
				myPseudo: pseudo,
				panStart: {x: 0, y: 0},
				pendingPlacements: _List_Nil,
				players: _List_Nil,
				rack: _List_Nil,
				selectedRackIndex: $elm$core$Maybe$Nothing,
				simulationCode: $elm$core$Maybe$Nothing,
				simulationScore: $elm$core$Maybe$Nothing,
				swapMode: false,
				swapSelected: _List_Nil,
				token: token,
				viewport: $author$project$View$Board$defaultViewport,
				winner: $elm$core$Maybe$Nothing
			},
			A3($author$project$Page$Game$fetchGame, baseUrl, token, gameId));
	});
var $author$project$Page$Lobby$GotGameIds = function (a) {
	return {$: 'GotGameIds', a: a};
};
var $author$project$Page$Lobby$fetchGameIds = F2(
	function (baseUrl, token) {
		return A5(
			$author$project$Api$Http$authGet,
			baseUrl,
			token,
			'/api/games',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
			$author$project$Page$Lobby$GotGameIds);
	});
var $author$project$Page$Lobby$init = F2(
	function (baseUrl, token) {
		return _Utils_Tuple2(
			{baseUrl: baseUrl, error: $elm$core$Maybe$Nothing, gameIds: _List_Nil, gamePreviews: _List_Nil, loading: true, token: token},
			A2($author$project$Page$Lobby$fetchGameIds, baseUrl, token));
	});
var $author$project$Page$Opponents$GotFavorites = function (a) {
	return {$: 'GotFavorites', a: a};
};
var $author$project$Api$UserPrefs$fetchBookmarked = F3(
	function (baseUrl, token, toMsg) {
		return A5(
			$author$project$Api$Http$authGet,
			baseUrl,
			token,
			'/api/user/bookmarked-opponents',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
			toMsg);
	});
var $author$project$Page$Opponents$init = F2(
	function (baseUrl, token) {
		return _Utils_Tuple2(
			{favorites: _List_Nil, loading: true, opponent1: '', opponent2: '', opponent3: ''},
			A3($author$project$Api$UserPrefs$fetchBookmarked, baseUrl, token, $author$project$Page$Opponents$GotFavorites));
	});
var $author$project$Page$Waiting$GotInstantGame = function (a) {
	return {$: 'GotInstantGame', a: a};
};
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Api$Http$authPost = F6(
	function (baseUrl, token, path, body, decoder, toMsg) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$jsonBody(body),
				expect: A2($elm$http$Http$expectJson, toMsg, decoder),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token)
					]),
				method: 'POST',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: _Utils_ap(baseUrl, path)
			});
	});
var $author$project$Api$InstantGame$InstantGameResponse = F2(
	function (status, gameId) {
		return {gameId: gameId, status: status};
	});
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Api$InstantGame$instantGameResponseDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Api$InstantGame$InstantGameResponse,
	A2($elm$json$Json$Decode$field, 'status', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'game_id', $elm$json$Json$Decode$int)));
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Api$InstantGame$join = F4(
	function (baseUrl, token, playersNumber, toMsg) {
		return A6(
			$author$project$Api$Http$authPost,
			baseUrl,
			token,
			'/api/instant-game/join/' + $elm$core$String$fromInt(playersNumber),
			$elm$json$Json$Encode$object(_List_Nil),
			$author$project$Api$InstantGame$instantGameResponseDecoder,
			toMsg);
	});
var $author$project$Page$Waiting$init = F3(
	function (baseUrl, token, playersNumber) {
		return _Utils_Tuple2(
			{gameId: $elm$core$Maybe$Nothing, playersNumber: playersNumber, waitingPlayers: _List_Nil},
			A4($author$project$Api$InstantGame$join, baseUrl, token, playersNumber, $author$project$Page$Waiting$GotInstantGame));
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Port$sseConnect = _Platform_outgoingPort('sseConnect', $elm$json$Json$Encode$string);
var $author$project$Route$toPath = function (route) {
	switch (route.$) {
		case 'Login':
			return '/login';
		case 'Register':
			return '/register';
		case 'Lobby':
			return '/lobby';
		case 'Opponents':
			return '/opponents';
		case 'Game':
			var id = route.a;
			return '/game/' + $elm$core$String$fromInt(id);
		case 'Waiting':
			return '/waiting';
		default:
			return '/login';
	}
};
var $author$project$Main$navigateTo = F2(
	function (model, route) {
		switch (route.$) {
			case 'Login':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							page: $author$project$Main$LoginPage($author$project$Page$Login$init),
							route: route
						}),
					$elm$core$Platform$Cmd$none);
			case 'Register':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							page: $author$project$Main$RegisterPage($author$project$Page$Register$init),
							route: route
						}),
					$elm$core$Platform$Cmd$none);
			case 'Lobby':
				var _v1 = model.token;
				if (_v1.$ === 'Just') {
					var token = _v1.a;
					var _v2 = A2($author$project$Page$Lobby$init, model.baseUrl, token);
					var lobbyModel = _v2.a;
					var lobbyCmd = _v2.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								page: $author$project$Main$LobbyPage(lobbyModel),
								route: route
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$LobbyMsg, lobbyCmd));
				} else {
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$author$project$Route$toPath($author$project$Route$Login)));
				}
			case 'Opponents':
				var _v3 = model.token;
				if (_v3.$ === 'Just') {
					var token = _v3.a;
					var _v4 = A2($author$project$Page$Opponents$init, model.baseUrl, token);
					var oppModel = _v4.a;
					var oppCmd = _v4.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								page: $author$project$Main$OpponentsPage(oppModel),
								route: route
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$OpponentsMsg, oppCmd));
				} else {
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$author$project$Route$toPath($author$project$Route$Login)));
				}
			case 'Game':
				var gameId = route.a;
				var _v5 = model.token;
				if (_v5.$ === 'Just') {
					var token = _v5.a;
					var _v6 = A4($author$project$Page$Game$init, model.baseUrl, token, model.pseudo, gameId);
					var gameModel = _v6.a;
					var gameCmd = _v6.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								page: $author$project$Main$GamePage(gameModel),
								route: route
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($elm$core$Platform$Cmd$map, $author$project$Main$GameMsg, gameCmd),
									$author$project$Port$sseConnect(
									model.baseUrl + ('/api/games/' + ($elm$core$String$fromInt(gameId) + '/events')))
								])));
				} else {
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$author$project$Route$toPath($author$project$Route$Login)));
				}
			case 'Waiting':
				var _v7 = model.token;
				if (_v7.$ === 'Just') {
					var token = _v7.a;
					var _v8 = A3($author$project$Page$Waiting$init, model.baseUrl, token, model.pendingInstantPlayers);
					var waitModel = _v8.a;
					var waitCmd = _v8.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								page: $author$project$Main$WaitingPage(waitModel),
								route: route
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$WaitingMsg, waitCmd));
				} else {
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$author$project$Route$toPath($author$project$Route$Login)));
				}
			default:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$browser$Browser$Navigation$pushUrl,
						model.key,
						$author$project$Route$toPath($author$project$Route$Login)));
		}
	});
var $author$project$Main$portString = function (url) {
	var _v0 = url.port_;
	if (_v0.$ === 'Just') {
		var p = _v0.a;
		return ':' + $elm$core$String$fromInt(p);
	} else {
		return '';
	}
};
var $author$project$Main$protocolToString = function (protocol) {
	if (protocol.$ === 'Http') {
		return 'http';
	} else {
		return 'https';
	}
};
var $author$project$Main$init = F3(
	function (flags, url, key) {
		var route = $author$project$Route$fromUrl(url);
		var apiUrl = $author$project$Main$protocolToString(url.protocol) + ('://' + (url.host + $author$project$Main$portString(url)));
		var model = {
			baseUrl: apiUrl,
			key: key,
			page: $author$project$Main$LoginPage($author$project$Page$Login$init),
			pendingInstantPlayers: 2,
			pseudo: '',
			route: route,
			token: flags.token
		};
		var _v0 = flags.token;
		if (_v0.$ === 'Just') {
			return A2($author$project$Main$navigateTo, model, route);
		} else {
			switch (route.$) {
				case 'Login':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								page: $author$project$Main$LoginPage($author$project$Page$Login$init)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Register':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								page: $author$project$Main$RegisterPage($author$project$Page$Register$init)
							}),
						$elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							key,
							$author$project$Route$toPath($author$project$Route$Login)));
			}
		}
	});
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $author$project$Main$SseEvent = function (a) {
	return {$: 'SseEvent', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Port$sseReceived = _Platform_incomingPort('sseReceived', $elm$json$Json$Decode$string);
var $author$project$Page$Game$From3DBoardClick = function (a) {
	return {$: 'From3DBoardClick', a: a};
};
var $author$project$Page$Game$From3DPendingClick = function (a) {
	return {$: 'From3DPendingClick', a: a};
};
var $author$project$Page$Game$From3DRackClick = function (a) {
	return {$: 'From3DRackClick', a: a};
};
var $author$project$Page$Game$RefreshGame = {$: 'RefreshGame'};
var $author$project$Page$Game$coordDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Tile$Coordinate,
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Port$onBoardCellClicked = _Platform_incomingPort('onBoardCellClicked', $elm$json$Json$Decode$value);
var $author$project$Port$onPendingTileClicked = _Platform_incomingPort('onPendingTileClicked', $elm$json$Json$Decode$value);
var $author$project$Port$onRackTileClicked = _Platform_incomingPort('onRackTileClicked', $elm$json$Json$Decode$int);
var $author$project$Page$Game$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Port$onBoardCellClicked(
				function (val) {
					var _v1 = A2($elm$json$Json$Decode$decodeValue, $author$project$Page$Game$coordDecoder, val);
					if (_v1.$ === 'Ok') {
						var coord = _v1.a;
						return $author$project$Page$Game$From3DBoardClick(coord);
					} else {
						return $author$project$Page$Game$RefreshGame;
					}
				}),
				$author$project$Port$onRackTileClicked($author$project$Page$Game$From3DRackClick),
				$author$project$Port$onPendingTileClicked(
				function (val) {
					var _v2 = A2($elm$json$Json$Decode$decodeValue, $author$project$Page$Game$coordDecoder, val);
					if (_v2.$ === 'Ok') {
						var coord = _v2.a;
						return $author$project$Page$Game$From3DPendingClick(coord);
					} else {
						return $author$project$Page$Game$RefreshGame;
					}
				})
			]));
};
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Port$sseReceived($author$project$Main$SseEvent),
				function () {
				var _v0 = model.page;
				if (_v0.$ === 'GamePage') {
					var gameModel = _v0.a;
					return A2(
						$elm$core$Platform$Sub$map,
						$author$project$Main$GameMsg,
						$author$project$Page$Game$subscriptions(gameModel));
				} else {
					return $elm$core$Platform$Sub$none;
				}
			}()
			]));
};
var $author$project$Main$LoginMsg = function (a) {
	return {$: 'LoginMsg', a: a};
};
var $author$project$Main$RegisterMsg = function (a) {
	return {$: 'RegisterMsg', a: a};
};
var $author$project$Page$Game$SseGameOver = function (a) {
	return {$: 'SseGameOver', a: a};
};
var $author$project$Page$Game$SseTilesPlayed = function (a) {
	return {$: 'SseTilesPlayed', a: a};
};
var $author$project$Page$Game$SseTilesSwapped = function (a) {
	return {$: 'SseTilesSwapped', a: a};
};
var $author$project$Page$Game$SseTurnChanged = function (a) {
	return {$: 'SseTurnChanged', a: a};
};
var $author$project$Main$GotCreateGame = function (a) {
	return {$: 'GotCreateGame', a: a};
};
var $author$project$Api$Game$CreateGameResponse = function (gameId) {
	return {gameId: gameId};
};
var $author$project$Api$Game$createGameResponseDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Api$Game$CreateGameResponse,
	A2($elm$json$Json$Decode$field, 'game_id', $elm$json$Json$Decode$int));
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Api$Game$createGame = F4(
	function (baseUrl, token, opponents, toMsg) {
		return A6(
			$author$project$Api$Http$authPost,
			baseUrl,
			token,
			'/api/games',
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'opponents',
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, opponents))
					])),
			$author$project$Api$Game$createGameResponseDecoder,
			toMsg);
	});
var $author$project$Main$createGameCmd = F2(
	function (model, opponents) {
		var _v0 = model.token;
		if (_v0.$ === 'Just') {
			var token = _v0.a;
			return A4($author$project$Api$Game$createGame, model.baseUrl, token, opponents, $author$project$Main$GotCreateGame);
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Sse$UnknownEvent = function (a) {
	return {$: 'UnknownEvent', a: a};
};
var $author$project$Sse$GameOver = function (a) {
	return {$: 'GameOver', a: a};
};
var $author$project$Sse$gameOverDecoder = A2(
	$elm$json$Json$Decode$map,
	function (ids) {
		return $author$project$Sse$GameOver(
			{winnerIds: ids});
	},
	A2(
		$elm$json$Json$Decode$field,
		'winner_ids',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int)));
var $author$project$Sse$InstantGameStarted = function (a) {
	return {$: 'InstantGameStarted', a: a};
};
var $author$project$Sse$instantGameStartedDecoder = A2(
	$elm$json$Json$Decode$map,
	function (gid) {
		return $author$project$Sse$InstantGameStarted(
			{gameId: gid});
	},
	A2($elm$json$Json$Decode$field, 'game_id', $elm$json$Json$Decode$int));
var $author$project$Sse$PlayerJoined = function (a) {
	return {$: 'PlayerJoined', a: a};
};
var $author$project$Sse$playerJoinedDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (pid, pseudo) {
			return $author$project$Sse$PlayerJoined(
				{playerId: pid, pseudo: pseudo});
		}),
	A2($elm$json$Json$Decode$field, 'player_id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'pseudo', $elm$json$Json$Decode$string));
var $author$project$Sse$TilesPlayed = function (a) {
	return {$: 'TilesPlayed', a: a};
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Sse$tilesPlayedDecoder = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (pid, pts, tiles) {
			return $author$project$Sse$TilesPlayed(
				{playerId: pid, points: pts, tiles: tiles});
		}),
	A2($elm$json$Json$Decode$field, 'player_id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'points', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'tiles',
		$elm$json$Json$Decode$list($author$project$Types$Tile$boardTileDecoder)));
var $author$project$Sse$TilesSwapped = function (a) {
	return {$: 'TilesSwapped', a: a};
};
var $author$project$Sse$tilesSwappedDecoder = A2(
	$elm$json$Json$Decode$map,
	function (pid) {
		return $author$project$Sse$TilesSwapped(
			{playerId: pid});
	},
	A2($elm$json$Json$Decode$field, 'player_id', $elm$json$Json$Decode$int));
var $author$project$Sse$TurnChanged = function (a) {
	return {$: 'TurnChanged', a: a};
};
var $author$project$Sse$turnChangedDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (pid, pseudo) {
			return $author$project$Sse$TurnChanged(
				{playerId: pid, pseudo: pseudo});
		}),
	A2($elm$json$Json$Decode$field, 'player_id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'pseudo', $elm$json$Json$Decode$string));
var $author$project$Sse$sseEventByType = function (eventType) {
	switch (eventType) {
		case 'tiles_played':
			return A2($elm$json$Json$Decode$field, 'data', $author$project$Sse$tilesPlayedDecoder);
		case 'tiles_swapped':
			return A2($elm$json$Json$Decode$field, 'data', $author$project$Sse$tilesSwappedDecoder);
		case 'turn_changed':
			return A2($elm$json$Json$Decode$field, 'data', $author$project$Sse$turnChangedDecoder);
		case 'game_over':
			return A2($elm$json$Json$Decode$field, 'data', $author$project$Sse$gameOverDecoder);
		case 'player_joined':
			return A2($elm$json$Json$Decode$field, 'data', $author$project$Sse$playerJoinedDecoder);
		case 'instant_game_started':
			return A2($elm$json$Json$Decode$field, 'data', $author$project$Sse$instantGameStartedDecoder);
		default:
			var other = eventType;
			return $elm$json$Json$Decode$succeed(
				$author$project$Sse$UnknownEvent(other));
	}
};
var $author$project$Sse$sseEventDecoder = A2(
	$elm$json$Json$Decode$andThen,
	$author$project$Sse$sseEventByType,
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Sse$decodeSseEvent = function (json) {
	var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Sse$sseEventDecoder, json);
	if (_v0.$ === 'Ok') {
		var event = _v0.a;
		return event;
	} else {
		return $author$project$Sse$UnknownEvent(json);
	}
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Port$sseDisconnect = _Platform_outgoingPort(
	'sseDisconnect',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Port$storeToken = _Platform_outgoingPort('storeToken', $elm$json$Json$Encode$string);
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Page$Game$ClickBoardCell = function (a) {
	return {$: 'ClickBoardCell', a: a};
};
var $author$project$Page$Game$GotPlayResult = function (a) {
	return {$: 'GotPlayResult', a: a};
};
var $author$project$Page$Game$GotSkipResult = function (a) {
	return {$: 'GotSkipResult', a: a};
};
var $author$project$Page$Game$GotSwapResult = function (a) {
	return {$: 'GotSwapResult', a: a};
};
var $author$project$Page$Game$RemovePending = function (a) {
	return {$: 'RemovePending', a: a};
};
var $author$project$Page$Game$SelectRackTile = function (a) {
	return {$: 'SelectRackTile', a: a};
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Types$Player$displayName = function (pseudo) {
	switch (pseudo) {
		case 'bot1':
			return '🤖 Greedy';
		case 'bot2':
			return '🧠 Neural';
		case 'bot3':
			return '🤖 Bot 3';
		default:
			var other = pseudo;
			return other;
	}
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Types$Color$colorToString = function (color) {
	switch (color.$) {
		case 'Green':
			return 'Green';
		case 'Blue':
			return 'Blue';
		case 'Purple':
			return 'Purple';
		case 'Red':
			return 'Red';
		case 'Orange':
			return 'Orange';
		default:
			return 'Yellow';
	}
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Types$Shape$shapeToString = function (shape) {
	switch (shape.$) {
		case 'Circle':
			return 'Circle';
		case 'Square':
			return 'Square';
		case 'Diamond':
			return 'Diamond';
		case 'Clover':
			return 'Clover';
		case 'FourPointStar':
			return 'FourPointStar';
		default:
			return 'EightPointStar';
	}
};
var $author$project$Page$Game$encodeBoardTile = function (bt) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$int(bt.coordinate.x)),
				_Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$int(bt.coordinate.y)),
				_Utils_Tuple2(
				'color',
				$elm$json$Json$Encode$string(
					$author$project$Types$Color$colorToString(bt.face.color))),
				_Utils_Tuple2(
				'shape',
				$elm$json$Json$Encode$string(
					$author$project$Types$Shape$shapeToString(bt.face.shape)))
			]));
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Page$Game$encodeSceneState = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'board',
				A2($elm$json$Json$Encode$list, $author$project$Page$Game$encodeBoardTile, model.board)),
				_Utils_Tuple2(
				'pending',
				A2($elm$json$Json$Encode$list, $author$project$Page$Game$encodeBoardTile, model.pendingPlacements)),
				_Utils_Tuple2(
				'lastPlayed',
				A2(
					$elm$json$Json$Encode$list,
					function (_v0) {
						var x = _v0.a;
						var y = _v0.b;
						return A2(
							$elm$json$Json$Encode$list,
							$elm$json$Json$Encode$int,
							_List_fromArray(
								[x, y]));
					},
					$elm$core$Set$toList(model.lastPlayedCoords))),
				_Utils_Tuple2(
				'rack',
				A2(
					$elm$json$Json$Encode$list,
					function (_v1) {
						var idx = _v1.a;
						var rt = _v1.b;
						return $elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'index',
									$elm$json$Json$Encode$int(idx)),
									_Utils_Tuple2(
									'color',
									$elm$json$Json$Encode$string(
										$author$project$Types$Color$colorToString(rt.face.color))),
									_Utils_Tuple2(
									'shape',
									$elm$json$Json$Encode$string(
										$author$project$Types$Shape$shapeToString(rt.face.shape))),
									_Utils_Tuple2(
									'selected',
									$elm$json$Json$Encode$bool(
										_Utils_eq(
											model.selectedRackIndex,
											$elm$core$Maybe$Just(idx))))
								]));
					},
					A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, model.rack))),
				_Utils_Tuple2(
				'selectedRackIndex',
				function () {
					var _v2 = model.selectedRackIndex;
					if (_v2.$ === 'Just') {
						var idx = _v2.a;
						return $elm$json$Json$Encode$int(idx);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}())
			]));
};
var $author$project$Port$sendSceneState = _Platform_outgoingPort('sendSceneState', $elm$core$Basics$identity);
var $author$project$Page$Game$emitSceneState = function (model) {
	return model.is3DView ? $author$project$Port$sendSceneState(
		$author$project$Page$Game$encodeSceneState(model)) : $elm$core$Platform$Cmd$none;
};
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Types$Player$isBot = function (pseudo) {
	return A2($elm$core$String$startsWith, 'bot', pseudo);
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Page$Game$listGet = F2(
	function (idx, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, idx, list));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Page$Game$listRemoveAt = F2(
	function (idx, list) {
		return _Utils_ap(
			A2($elm$core$List$take, idx, list),
			A2($elm$core$List$drop, idx + 1, list));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $author$project$Types$Tile$coordinateEncoder = function (coord) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$int(coord.x)),
				_Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$int(coord.y))
			]));
};
var $author$project$Types$Color$colorEncoder = function (color) {
	return $elm$json$Json$Encode$string(
		$author$project$Types$Color$colorToString(color));
};
var $author$project$Types$Shape$shapeEncoder = function (shape) {
	return $elm$json$Json$Encode$string(
		$author$project$Types$Shape$shapeToString(shape));
};
var $author$project$Types$Tile$tileFaceEncoder = function (face) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'color',
				$author$project$Types$Color$colorEncoder(face.color)),
				_Utils_Tuple2(
				'shape',
				$author$project$Types$Shape$shapeEncoder(face.shape))
			]));
};
var $author$project$Api$Action$encodePlacement = function (p) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'tile',
				$author$project$Types$Tile$tileFaceEncoder(p.face)),
				_Utils_Tuple2(
				'coordinate',
				$author$project$Types$Tile$coordinateEncoder(p.coordinate))
			]));
};
var $author$project$Api$Action$PlayResult = F3(
	function (code, points, newRack) {
		return {code: code, newRack: newRack, points: points};
	});
var $author$project$Api$Action$playResultDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Api$Action$PlayResult,
	A2($elm$json$Json$Decode$field, 'code', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'points', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'new_rack',
		$elm$json$Json$Decode$list($author$project$Types$Tile$rackTileDecoder)));
var $author$project$Api$Action$playTiles = F5(
	function (baseUrl, token, gameId, placements, toMsg) {
		return A6(
			$author$project$Api$Http$authPost,
			baseUrl,
			token,
			'/api/games/' + ($elm$core$String$fromInt(gameId) + '/play'),
			A2($elm$json$Json$Encode$list, $author$project$Api$Action$encodePlacement, placements),
			$author$project$Api$Action$playResultDecoder,
			toMsg);
	});
var $author$project$Port$set3DViewEnabled = _Platform_outgoingPort('set3DViewEnabled', $elm$json$Json$Encode$bool);
var $author$project$Page$Game$GotSimulation = function (a) {
	return {$: 'GotSimulation', a: a};
};
var $author$project$Api$Action$SimulationResult = F2(
	function (code, points) {
		return {code: code, points: points};
	});
var $author$project$Api$Action$simulationResultDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Api$Action$SimulationResult,
	A2($elm$json$Json$Decode$field, 'code', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'points', $elm$json$Json$Decode$int));
var $author$project$Api$Action$simulatePlay = F5(
	function (baseUrl, token, gameId, placements, toMsg) {
		return A6(
			$author$project$Api$Http$authPost,
			baseUrl,
			token,
			'/api/games/' + ($elm$core$String$fromInt(gameId) + '/simulate'),
			A2($elm$json$Json$Encode$list, $author$project$Api$Action$encodePlacement, placements),
			$author$project$Api$Action$simulationResultDecoder,
			toMsg);
	});
var $author$project$Page$Game$simulatePlay = F2(
	function (model, placements) {
		var mapped = A2(
			$elm$core$List$map,
			function (bt) {
				return {coordinate: bt.coordinate, face: bt.face};
			},
			placements);
		return A5($author$project$Api$Action$simulatePlay, model.baseUrl, model.token, model.gameId, mapped, $author$project$Page$Game$GotSimulation);
	});
var $elm$http$Http$expectBytesResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'arraybuffer',
			_Http_toDataView,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$expectWhatever = function (toMsg) {
	return A2(
		$elm$http$Http$expectBytesResponse,
		toMsg,
		$elm$http$Http$resolve(
			function (_v0) {
				return $elm$core$Result$Ok(_Utils_Tuple0);
			}));
};
var $author$project$Api$Http$authPostEmpty = F4(
	function (baseUrl, token, path, toMsg) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: $elm$http$Http$expectWhatever(toMsg),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token)
					]),
				method: 'POST',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: _Utils_ap(baseUrl, path)
			});
	});
var $author$project$Api$Action$skipTurn = F4(
	function (baseUrl, token, gameId, toMsg) {
		return A4(
			$author$project$Api$Http$authPostEmpty,
			baseUrl,
			token,
			'/api/games/' + ($elm$core$String$fromInt(gameId) + '/skip'),
			toMsg);
	});
var $author$project$Api$Action$SwapResult = function (newRack) {
	return {newRack: newRack};
};
var $author$project$Api$Action$swapResultDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Api$Action$SwapResult,
	A2(
		$elm$json$Json$Decode$field,
		'new_rack',
		$elm$json$Json$Decode$list($author$project$Types$Tile$rackTileDecoder)));
var $author$project$Api$Action$swapTiles = F5(
	function (baseUrl, token, gameId, faces, toMsg) {
		return A6(
			$author$project$Api$Http$authPost,
			baseUrl,
			token,
			'/api/games/' + ($elm$core$String$fromInt(gameId) + '/swap'),
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'tiles',
						A2($elm$json$Json$Encode$list, $author$project$Types$Tile$tileFaceEncoder, faces))
					])),
			$author$project$Api$Action$swapResultDecoder,
			toMsg);
	});
var $author$project$Page$Game$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 'GotGameState':
					if (msg.a.$ === 'Ok') {
						var state = msg.a.a;
						var myPlayer = function () {
							var _v1 = $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (p) {
										return _Utils_eq(p.pseudo, model.myPseudo);
									},
									state.players));
							if (_v1.$ === 'Just') {
								var p = _v1.a;
								return $elm$core$Maybe$Just(p);
							} else {
								return $elm$core$List$head(
									A2(
										$elm$core$List$filter,
										function (p) {
											return !$author$project$Types$Player$isBot(p.pseudo);
										},
										state.players));
							}
						}();
						var currentPlayer = $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function ($) {
									return $.isTurn;
								},
								state.players));
						var newModel = _Utils_update(
							model,
							{
								bagCount: state.bagCount,
								board: state.board,
								currentTurnPseudo: A2(
									$elm$core$Maybe$withDefault,
									'',
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.pseudo;
										},
										currentPlayer)),
								error: $elm$core$Maybe$Nothing,
								loading: false,
								players: state.players,
								rack: A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.rack;
										},
										myPlayer))
							});
						return _Utils_Tuple2(
							newModel,
							$author$project$Page$Game$emitSceneState(newModel));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just('Failed to load game'),
									loading: false
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'SelectRackTile':
					var idx = msg.a;
					if (model.swapMode) {
						var newSelected = A2($elm$core$List$member, idx, model.swapSelected) ? A2(
							$elm$core$List$filter,
							function (i) {
								return !_Utils_eq(i, idx);
							},
							model.swapSelected) : A2($elm$core$List$cons, idx, model.swapSelected);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{swapSelected: newSelected}),
							$elm$core$Platform$Cmd$none);
					} else {
						var newModel = _Utils_update(
							model,
							{
								selectedRackIndex: _Utils_eq(
									model.selectedRackIndex,
									$elm$core$Maybe$Just(idx)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(idx)
							});
						return _Utils_Tuple2(
							newModel,
							$author$project$Page$Game$emitSceneState(newModel));
					}
				case 'ClickBoardCell':
					var coord = msg.a;
					var _v2 = model.selectedRackIndex;
					if (_v2.$ === 'Just') {
						var idx = _v2.a;
						var _v3 = A2($author$project$Page$Game$listGet, idx, model.rack);
						if (_v3.$ === 'Just') {
							var rackTile = _v3.a;
							var placement = {coordinate: coord, face: rackTile.face};
							var newRack = A2($author$project$Page$Game$listRemoveAt, idx, model.rack);
							var newPending = _Utils_ap(
								model.pendingPlacements,
								_List_fromArray(
									[placement]));
							var newModel = _Utils_update(
								model,
								{pendingPlacements: newPending, rack: newRack, selectedRackIndex: $elm$core$Maybe$Nothing, simulationCode: $elm$core$Maybe$Nothing, simulationScore: $elm$core$Maybe$Nothing});
							return _Utils_Tuple2(
								newModel,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											A2($author$project$Page$Game$simulatePlay, model, newPending),
											$author$project$Page$Game$emitSceneState(newModel)
										])));
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'RemovePending':
					var coord = msg.a;
					var _v4 = A2(
						$elm$core$List$partition,
						function (bt) {
							return _Utils_eq(bt.coordinate, coord);
						},
						model.pendingPlacements);
					var removed = _v4.a;
					var kept = _v4.b;
					var restoredRack = _Utils_ap(
						model.rack,
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, bt) {
									return {
										face: bt.face,
										rackPosition: $elm$core$List$length(model.rack) + i
									};
								}),
							removed));
					var newModel = _Utils_update(
						model,
						{pendingPlacements: kept, rack: restoredRack, simulationCode: $elm$core$Maybe$Nothing, simulationScore: $elm$core$Maybe$Nothing});
					return _Utils_Tuple2(
						newModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									(!$elm$core$List$isEmpty(kept)) ? A2($author$project$Page$Game$simulatePlay, model, kept) : $elm$core$Platform$Cmd$none,
									$author$project$Page$Game$emitSceneState(newModel)
								])));
				case 'GotSimulation':
					if (msg.a.$ === 'Ok') {
						var result = msg.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									simulationCode: (result.code !== 'ok') ? $elm$core$Maybe$Just(result.code) : $elm$core$Maybe$Nothing,
									simulationScore: (result.code === 'ok') ? $elm$core$Maybe$Just(result.points) : $elm$core$Maybe$Nothing
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									simulationCode: $elm$core$Maybe$Just('Server error')
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'ValidatePlay':
					if ($elm$core$List$isEmpty(model.pendingPlacements)) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var placements = A2(
							$elm$core$List$map,
							function (bt) {
								return {coordinate: bt.coordinate, face: bt.face};
							},
							model.pendingPlacements);
						return _Utils_Tuple2(
							model,
							A5($author$project$Api$Action$playTiles, model.baseUrl, model.token, model.gameId, placements, $author$project$Page$Game$GotPlayResult));
					}
				case 'GotPlayResult':
					if (msg.a.$ === 'Ok') {
						var result = msg.a.a;
						if (result.code === 'ok') {
							var newModel = _Utils_update(
								model,
								{pendingPlacements: _List_Nil, rack: result.newRack, selectedRackIndex: $elm$core$Maybe$Nothing, simulationCode: $elm$core$Maybe$Nothing, simulationScore: $elm$core$Maybe$Nothing});
							return _Utils_Tuple2(
								newModel,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											A3($author$project$Page$Game$fetchGame, model.baseUrl, model.token, model.gameId),
											$author$project$Page$Game$emitSceneState(newModel)
										])));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										simulationCode: $elm$core$Maybe$Just(result.code)
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just('Play failed')
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'EnterSwapMode':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{selectedRackIndex: $elm$core$Maybe$Nothing, swapMode: true, swapSelected: _List_Nil}),
						$elm$core$Platform$Cmd$none);
				case 'CancelSwap':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{swapMode: false, swapSelected: _List_Nil}),
						$elm$core$Platform$Cmd$none);
				case 'ConfirmSwap':
					var faces = A2(
						$elm$core$List$map,
						function ($) {
							return $.face;
						},
						A2(
							$elm$core$List$filterMap,
							function (idx) {
								return A2($author$project$Page$Game$listGet, idx, model.rack);
							},
							model.swapSelected));
					return $elm$core$List$isEmpty(faces) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						model,
						A5($author$project$Api$Action$swapTiles, model.baseUrl, model.token, model.gameId, faces, $author$project$Page$Game$GotSwapResult));
				case 'GotSwapResult':
					if (msg.a.$ === 'Ok') {
						var result = msg.a.a;
						var newModel = _Utils_update(
							model,
							{rack: result.newRack, swapMode: false, swapSelected: _List_Nil});
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A3($author$project$Page$Game$fetchGame, model.baseUrl, model.token, model.gameId),
										$author$project$Page$Game$emitSceneState(newModel)
									])));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just('Swap failed')
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'SkipTurn':
					return _Utils_Tuple2(
						model,
						A4($author$project$Api$Action$skipTurn, model.baseUrl, model.token, model.gameId, $author$project$Page$Game$GotSkipResult));
				case 'GotSkipResult':
					if (msg.a.$ === 'Ok') {
						return _Utils_Tuple2(
							model,
							A3($author$project$Page$Game$fetchGame, model.baseUrl, model.token, model.gameId));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									error: $elm$core$Maybe$Just('Skip failed')
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'UndoAllPlacements':
					var restoredRack = _Utils_ap(
						model.rack,
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, bt) {
									return {
										face: bt.face,
										rackPosition: $elm$core$List$length(model.rack) + i
									};
								}),
							model.pendingPlacements));
					var newModel = _Utils_update(
						model,
						{pendingPlacements: _List_Nil, rack: restoredRack, selectedRackIndex: $elm$core$Maybe$Nothing, simulationCode: $elm$core$Maybe$Nothing, simulationScore: $elm$core$Maybe$Nothing});
					return _Utils_Tuple2(
						newModel,
						$author$project$Page$Game$emitSceneState(newModel));
				case 'SseTilesPlayed':
					var data = msg.a;
					var newBoard = _Utils_ap(model.board, data.tiles);
					var lastCoords = $elm$core$Set$fromList(
						A2(
							$elm$core$List$map,
							function (t) {
								return _Utils_Tuple2(t.coordinate.x, t.coordinate.y);
							},
							data.tiles));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{board: newBoard, lastPlayedCoords: lastCoords}),
						A3($author$project$Page$Game$fetchGame, model.baseUrl, model.token, model.gameId));
				case 'SseTilesSwapped':
					return _Utils_Tuple2(
						model,
						A3($author$project$Page$Game$fetchGame, model.baseUrl, model.token, model.gameId));
				case 'SseTurnChanged':
					var data = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{currentTurnPseudo: data.pseudo}),
						$elm$core$Platform$Cmd$none);
				case 'SseGameOver':
					var data = msg.a;
					var winnerName = A2(
						$elm$core$Maybe$withDefault,
						'Unknown',
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.pseudo;
								},
								$author$project$Types$Player$displayName),
							$elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (p) {
										return A2($elm$core$List$member, p.id, data.winnerIds);
									},
									model.players))));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								winner: $elm$core$Maybe$Just(winnerName)
							}),
						$elm$core$Platform$Cmd$none);
				case 'ZoomBoard':
					var delta = msg.a;
					var vp = model.viewport;
					var newScale = A3($elm$core$Basics$clamp, 0.3, 3.0, vp.scale + (delta * 0.001));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								viewport: _Utils_update(
									vp,
									{scale: newScale})
							}),
						$elm$core$Platform$Cmd$none);
				case 'PanBoard':
					var dx = msg.a;
					var dy = msg.b;
					var vp = model.viewport;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								viewport: _Utils_update(
									vp,
									{offsetX: vp.offsetX + dx, offsetY: vp.offsetY + dy})
							}),
						$elm$core$Platform$Cmd$none);
				case 'StartPan':
					var x = msg.a;
					var y = msg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								isPanning: true,
								panStart: {x: x, y: y}
							}),
						$elm$core$Platform$Cmd$none);
				case 'MovePan':
					var x = msg.a;
					var y = msg.b;
					if (model.isPanning) {
						var vp = model.viewport;
						var dy = y - model.panStart.y;
						var dx = x - model.panStart.x;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									panStart: {x: x, y: y},
									viewport: _Utils_update(
										vp,
										{offsetX: vp.offsetX + dx, offsetY: vp.offsetY + dy})
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'StopPan':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{isPanning: false}),
						$elm$core$Platform$Cmd$none);
				case 'RefreshGame':
					return _Utils_Tuple2(
						model,
						A3($author$project$Page$Game$fetchGame, model.baseUrl, model.token, model.gameId));
				case 'GoToLobby':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'Toggle3DView':
					var newIs3D = !model.is3DView;
					var newModel = _Utils_update(
						model,
						{is3DView: newIs3D});
					return _Utils_Tuple2(
						newModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Port$set3DViewEnabled(newIs3D),
									newIs3D ? $author$project$Page$Game$emitSceneState(newModel) : $elm$core$Platform$Cmd$none
								])));
				case 'From3DBoardClick':
					var coord = msg.a;
					var $temp$msg = $author$project$Page$Game$ClickBoardCell(coord),
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				case 'From3DRackClick':
					var idx = msg.a;
					var $temp$msg = $author$project$Page$Game$SelectRackTile(idx),
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				default:
					var coord = msg.a;
					var $temp$msg = $author$project$Page$Game$RemovePending(coord),
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
			}
		}
	});
var $author$project$Page$Lobby$GotDeleteGame = F2(
	function (a, b) {
		return {$: 'GotDeleteGame', a: a, b: b};
	});
var $author$project$Api$Http$authDelete = F4(
	function (baseUrl, token, path, toMsg) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: $elm$http$Http$expectWhatever(toMsg),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + token)
					]),
				method: 'DELETE',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: _Utils_ap(baseUrl, path)
			});
	});
var $author$project$Page$Lobby$deleteGame = F3(
	function (baseUrl, token, gameId) {
		return A4(
			$author$project$Api$Http$authDelete,
			baseUrl,
			token,
			'/api/games/' + $elm$core$String$fromInt(gameId),
			$author$project$Page$Lobby$GotDeleteGame(gameId));
	});
var $author$project$Page$Lobby$GotGamePreview = F2(
	function (a, b) {
		return {$: 'GotGamePreview', a: a, b: b};
	});
var $author$project$Page$Lobby$fetchGamePreview = F3(
	function (baseUrl, token, gameId) {
		return A5(
			$author$project$Api$Http$authGet,
			baseUrl,
			token,
			'/api/games/' + $elm$core$String$fromInt(gameId),
			$author$project$Types$Game$gameStateDecoder,
			$author$project$Page$Lobby$GotGamePreview(gameId));
	});
var $author$project$Page$Lobby$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GotGameIds':
				if (msg.a.$ === 'Ok') {
					var ids = msg.a.a;
					var previewIds = A2($elm$core$List$take, 12, ids);
					var cmds = A2(
						$elm$core$List$map,
						A2($author$project$Page$Lobby$fetchGamePreview, model.baseUrl, model.token),
						previewIds);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{gameIds: ids, loading: false}),
						$elm$core$Platform$Cmd$batch(cmds));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just('Failed to load games'),
								loading: false
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'GotGamePreview':
				if (msg.b.$ === 'Ok') {
					var gameId = msg.a;
					var state = msg.b.a;
					var preview = {
						id: gameId,
						players: state.players,
						status: function () {
							if (A2(
								$elm$core$List$any,
								function ($) {
									return $.isTurn;
								},
								state.players)) {
								var currentPlayer = $elm$core$List$head(
									A2(
										$elm$core$List$filter,
										function ($) {
											return $.isTurn;
										},
										state.players));
								if (currentPlayer.$ === 'Just') {
									var p = currentPlayer.a;
									return $author$project$Types$Player$displayName(p.pseudo) + '\'s turn';
								} else {
									return 'In progress';
								}
							} else {
								return 'Finished';
							}
						}(),
						tileCount: $elm$core$List$length(state.board)
					};
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								gamePreviews: _Utils_ap(
									model.gamePreviews,
									_List_fromArray(
										[preview]))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'DeleteGame':
				var gameId = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Page$Lobby$deleteGame, model.baseUrl, model.token, gameId));
			case 'GotDeleteGame':
				if (msg.b.$ === 'Ok') {
					var gameId = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								gameIds: A2(
									$elm$core$List$filter,
									function (id) {
										return !_Utils_eq(id, gameId);
									},
									model.gameIds),
								gamePreviews: A2(
									$elm$core$List$filter,
									function (p) {
										return !_Utils_eq(p.id, gameId);
									},
									model.gamePreviews)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								error: $elm$core$Maybe$Just('Failed to delete game')
							}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Login$GotAuth = function (a) {
	return {$: 'GotAuth', a: a};
};
var $author$project$Api$Auth$AuthResponse = F2(
	function (token, pseudo) {
		return {pseudo: pseudo, token: token};
	});
var $author$project$Api$Auth$authResponseDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Api$Auth$AuthResponse,
	A2($elm$json$Json$Decode$field, 'token', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'pseudo', $elm$json$Json$Decode$string));
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{body: r.body, expect: r.expect, headers: _List_Nil, method: 'POST', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Api$Auth$login = F3(
	function (baseUrl, creds, toMsg) {
		return $elm$http$Http$post(
			{
				body: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'pseudo',
								$elm$json$Json$Encode$string(creds.pseudo)),
								_Utils_Tuple2(
								'password',
								$elm$json$Json$Encode$string(creds.password))
							]))),
				expect: A2($elm$http$Http$expectJson, toMsg, $author$project$Api$Auth$authResponseDecoder),
				url: baseUrl + '/api/auth/login'
			});
	});
var $author$project$Api$Auth$registerGuest = F2(
	function (baseUrl, toMsg) {
		return $elm$http$Http$post(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($elm$http$Http$expectJson, toMsg, $author$project$Api$Auth$authResponseDecoder),
				url: baseUrl + '/api/auth/guest'
			});
	});
var $author$project$Page$Login$update = F3(
	function (baseUrl, msg, model) {
		switch (msg.$) {
			case 'SetPseudo':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pseudo: s}),
					$elm$core$Platform$Cmd$none);
			case 'SetPassword':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{password: s}),
					$elm$core$Platform$Cmd$none);
			case 'SubmitLogin':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{error: $elm$core$Maybe$Nothing}),
					A3(
						$author$project$Api$Auth$login,
						baseUrl,
						{password: model.password, pseudo: model.pseudo},
						$author$project$Page$Login$GotAuth));
			case 'SubmitGuest':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{error: $elm$core$Maybe$Nothing}),
					A2($author$project$Api$Auth$registerGuest, baseUrl, $author$project$Page$Login$GotAuth));
			case 'GotAuth':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Opponents$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetOpponent1':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{opponent1: s}),
					$elm$core$Platform$Cmd$none);
			case 'SetOpponent2':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{opponent2: s}),
					$elm$core$Platform$Cmd$none);
			case 'SetOpponent3':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{opponent3: s}),
					$elm$core$Platform$Cmd$none);
			case 'SetSlotBot':
				var slot = msg.a;
				var bot = msg.b;
				switch (slot) {
					case 1:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{opponent1: bot}),
							$elm$core$Platform$Cmd$none);
					case 2:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{opponent2: bot}),
							$elm$core$Platform$Cmd$none);
					case 3:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{opponent3: bot}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'SelectFavorite':
				var slot = msg.a;
				var name = msg.b;
				switch (slot) {
					case 1:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{opponent1: name}),
							$elm$core$Platform$Cmd$none);
					case 2:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{opponent2: name}),
							$elm$core$Platform$Cmd$none);
					case 3:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{opponent3: name}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotFavorites':
				if (msg.a.$ === 'Ok') {
					var names = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{favorites: names, loading: false}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{loading: false}),
						$elm$core$Platform$Cmd$none);
				}
			case 'CreateGame':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Register$GotAuth = function (a) {
	return {$: 'GotAuth', a: a};
};
var $author$project$Api$Auth$register = F3(
	function (baseUrl, reg, toMsg) {
		return $elm$http$Http$post(
			{
				body: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'pseudo',
								$elm$json$Json$Encode$string(reg.pseudo)),
								_Utils_Tuple2(
								'email',
								$elm$json$Json$Encode$string(reg.email)),
								_Utils_Tuple2(
								'password',
								$elm$json$Json$Encode$string(reg.password))
							]))),
				expect: A2($elm$http$Http$expectJson, toMsg, $author$project$Api$Auth$authResponseDecoder),
				url: baseUrl + '/api/auth/register'
			});
	});
var $author$project$Page$Register$update = F3(
	function (baseUrl, msg, model) {
		switch (msg.$) {
			case 'SetPseudo':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pseudo: s}),
					$elm$core$Platform$Cmd$none);
			case 'SetEmail':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{email: s}),
					$elm$core$Platform$Cmd$none);
			case 'SetPassword':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{password: s}),
					$elm$core$Platform$Cmd$none);
			case 'SubmitRegister':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{error: $elm$core$Maybe$Nothing}),
					A3(
						$author$project$Api$Auth$register,
						baseUrl,
						{email: model.email, password: model.password, pseudo: model.pseudo},
						$author$project$Page$Register$GotAuth));
			case 'GotAuth':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Waiting$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GotInstantGame':
				if (msg.a.$ === 'Ok') {
					var resp = msg.a.a;
					var _v1 = resp.gameId;
					if (_v1.$ === 'Just') {
						var gid = _v1.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									gameId: $elm$core$Maybe$Just(gid)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GameStarted':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Api$Game$createSpectateGame = F4(
	function (baseUrl, token, bots, toMsg) {
		return A6(
			$author$project$Api$Http$authPost,
			baseUrl,
			token,
			'/api/games/spectate',
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'bots',
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, bots))
					])),
			$author$project$Api$Game$createGameResponseDecoder,
			toMsg);
	});
var $author$project$Main$watchBotsCmd = F2(
	function (model, bots) {
		var _v0 = model.token;
		if (_v0.$ === 'Just') {
			var token = _v0.a;
			return A4($author$project$Api$Game$createSpectateGame, model.baseUrl, token, bots, $author$project$Main$GotCreateGame);
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.page);
		_v0$12:
		while (true) {
			switch (_v0.a.$) {
				case 'UrlChanged':
					var url = _v0.a.a;
					return A2(
						$author$project$Main$navigateTo,
						model,
						$author$project$Route$fromUrl(url));
				case 'UrlRequested':
					var request = _v0.a.a;
					if (request.$ === 'Internal') {
						var url = request.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								model.key,
								$elm$url$Url$toString(url)));
					} else {
						var href = request.a;
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(href));
					}
				case 'LoginMsg':
					if (_v0.b.$ === 'LoginPage') {
						var loginMsg = _v0.a.a;
						var loginModel = _v0.b.a;
						switch (loginMsg.$) {
							case 'GotAuth':
								if (loginMsg.a.$ === 'Ok') {
									var auth = loginMsg.a.a;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												pseudo: auth.pseudo,
												token: $elm$core$Maybe$Just(auth.token)
											}),
										$elm$core$Platform$Cmd$batch(
											_List_fromArray(
												[
													$author$project$Port$storeToken(auth.token),
													A2(
													$elm$browser$Browser$Navigation$pushUrl,
													model.key,
													$author$project$Route$toPath($author$project$Route$Lobby))
												])));
								} else {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												page: $author$project$Main$LoginPage(
													_Utils_update(
														loginModel,
														{
															error: $elm$core$Maybe$Just('Login failed')
														}))
											}),
										$elm$core$Platform$Cmd$none);
								}
							case 'GoToRegister':
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath($author$project$Route$Register)));
							default:
								var _v3 = A3($author$project$Page$Login$update, model.baseUrl, loginMsg, loginModel);
								var newLogin = _v3.a;
								var loginCmd = _v3.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											page: $author$project$Main$LoginPage(newLogin)
										}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$LoginMsg, loginCmd));
						}
					} else {
						break _v0$12;
					}
				case 'RegisterMsg':
					if (_v0.b.$ === 'RegisterPage') {
						var registerMsg = _v0.a.a;
						var registerModel = _v0.b.a;
						switch (registerMsg.$) {
							case 'GotAuth':
								if (registerMsg.a.$ === 'Ok') {
									var auth = registerMsg.a.a;
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												pseudo: auth.pseudo,
												token: $elm$core$Maybe$Just(auth.token)
											}),
										$elm$core$Platform$Cmd$batch(
											_List_fromArray(
												[
													$author$project$Port$storeToken(auth.token),
													A2(
													$elm$browser$Browser$Navigation$pushUrl,
													model.key,
													$author$project$Route$toPath($author$project$Route$Lobby))
												])));
								} else {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												page: $author$project$Main$RegisterPage(
													_Utils_update(
														registerModel,
														{
															error: $elm$core$Maybe$Just('Registration failed')
														}))
											}),
										$elm$core$Platform$Cmd$none);
								}
							case 'GoToLogin':
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath($author$project$Route$Login)));
							default:
								var _v5 = A3($author$project$Page$Register$update, model.baseUrl, registerMsg, registerModel);
								var newReg = _v5.a;
								var regCmd = _v5.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											page: $author$project$Main$RegisterPage(newReg)
										}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$RegisterMsg, regCmd));
						}
					} else {
						break _v0$12;
					}
				case 'LobbyMsg':
					if (_v0.b.$ === 'LobbyPage') {
						var lobbyMsg = _v0.a.a;
						var lobbyModel = _v0.b.a;
						switch (lobbyMsg.$) {
							case 'SelectGame':
								var gid = lobbyMsg.a;
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath(
											$author$project$Route$Game(gid))));
							case 'GoToOpponents':
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath($author$project$Route$Opponents)));
							case 'Logout':
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{pseudo: '', token: $elm$core$Maybe$Nothing}),
									$elm$core$Platform$Cmd$batch(
										_List_fromArray(
											[
												$author$project$Port$storeToken(''),
												A2(
												$elm$browser$Browser$Navigation$pushUrl,
												model.key,
												$author$project$Route$toPath($author$project$Route$Login))
											])));
							case 'NewGameVsBot':
								return _Utils_Tuple2(
									model,
									A2(
										$author$project$Main$createGameCmd,
										model,
										_List_fromArray(
											['bot1'])));
							case 'NewGameVsMctsBot':
								return _Utils_Tuple2(
									model,
									A2(
										$author$project$Main$createGameCmd,
										model,
										_List_fromArray(
											['bot2'])));
							case 'WatchBotsBattle':
								return _Utils_Tuple2(
									model,
									A2(
										$author$project$Main$watchBotsCmd,
										model,
										_List_fromArray(
											['bot1', 'bot2'])));
							case 'InstantGame':
								var n = lobbyMsg.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{pendingInstantPlayers: n}),
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath($author$project$Route$Waiting)));
							default:
								var _v7 = A2($author$project$Page$Lobby$update, lobbyMsg, lobbyModel);
								var newLobby = _v7.a;
								var lobbyCmd = _v7.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											page: $author$project$Main$LobbyPage(newLobby)
										}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$LobbyMsg, lobbyCmd));
						}
					} else {
						break _v0$12;
					}
				case 'OpponentsMsg':
					if (_v0.b.$ === 'OpponentsPage') {
						var opponentsMsg = _v0.a.a;
						var opponentsModel = _v0.b.a;
						switch (opponentsMsg.$) {
							case 'CreateGame':
								var opponents = A2(
									$elm$core$List$filter,
									function (s) {
										return s !== '';
									},
									_List_fromArray(
										[opponentsModel.opponent1, opponentsModel.opponent2, opponentsModel.opponent3]));
								return _Utils_Tuple2(
									model,
									A2($author$project$Main$createGameCmd, model, opponents));
							case 'GoBack':
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath($author$project$Route$Lobby)));
							default:
								var _v9 = A2($author$project$Page$Opponents$update, opponentsMsg, opponentsModel);
								var newOpp = _v9.a;
								var oppCmd = _v9.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											page: $author$project$Main$OpponentsPage(newOpp)
										}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$OpponentsMsg, oppCmd));
						}
					} else {
						break _v0$12;
					}
				case 'GotCreateGame':
					if (_v0.a.a.$ === 'Ok') {
						var resp = _v0.a.a.a;
						return _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								model.key,
								$author$project$Route$toPath(
									$author$project$Route$Game(resp.gameId))));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'GameMsg':
					if (_v0.b.$ === 'GamePage') {
						var gameMsg = _v0.a.a;
						var gameModel = _v0.b.a;
						if (gameMsg.$ === 'GoToLobby') {
							return _Utils_Tuple2(
								model,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Port$sseDisconnect(_Utils_Tuple0),
											A2(
											$elm$browser$Browser$Navigation$pushUrl,
											model.key,
											$author$project$Route$toPath($author$project$Route$Lobby))
										])));
						} else {
							var _v11 = A2($author$project$Page$Game$update, gameMsg, gameModel);
							var newGame = _v11.a;
							var gameCmd = _v11.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										page: $author$project$Main$GamePage(newGame)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Main$GameMsg, gameCmd));
						}
					} else {
						break _v0$12;
					}
				case 'WaitingMsg':
					if (_v0.b.$ === 'WaitingPage') {
						var waitingMsg = _v0.a.a;
						var waitingModel = _v0.b.a;
						_v12$2:
						while (true) {
							switch (waitingMsg.$) {
								case 'GoBack':
									return _Utils_Tuple2(
										model,
										A2(
											$elm$browser$Browser$Navigation$pushUrl,
											model.key,
											$author$project$Route$toPath($author$project$Route$Lobby)));
								case 'GotInstantGame':
									if (waitingMsg.a.$ === 'Ok') {
										var resp = waitingMsg.a.a;
										var _v13 = resp.gameId;
										if (_v13.$ === 'Just') {
											var gid = _v13.a;
											return _Utils_Tuple2(
												model,
												A2(
													$elm$browser$Browser$Navigation$pushUrl,
													model.key,
													$author$project$Route$toPath(
														$author$project$Route$Game(gid))));
										} else {
											var _v14 = A2($author$project$Page$Waiting$update, waitingMsg, waitingModel);
											var newWait = _v14.a;
											var waitCmd = _v14.b;
											return _Utils_Tuple2(
												_Utils_update(
													model,
													{
														page: $author$project$Main$WaitingPage(newWait)
													}),
												A2($elm$core$Platform$Cmd$map, $author$project$Main$WaitingMsg, waitCmd));
										}
									} else {
										break _v12$2;
									}
								default:
									break _v12$2;
							}
						}
						var _v15 = A2($author$project$Page$Waiting$update, waitingMsg, waitingModel);
						var newWait = _v15.a;
						var waitCmd = _v15.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									page: $author$project$Main$WaitingPage(newWait)
								}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$WaitingMsg, waitCmd));
					} else {
						break _v0$12;
					}
				case 'SseEvent':
					switch (_v0.b.$) {
						case 'GamePage':
							var rawJson = _v0.a.a;
							var gameModel = _v0.b.a;
							var event = $author$project$Sse$decodeSseEvent(rawJson);
							var gameMsg = function () {
								switch (event.$) {
									case 'TilesPlayed':
										var data = event.a;
										return $author$project$Page$Game$SseTilesPlayed(data);
									case 'TilesSwapped':
										var data = event.a;
										return $author$project$Page$Game$SseTilesSwapped(data);
									case 'TurnChanged':
										var data = event.a;
										return $author$project$Page$Game$SseTurnChanged(data);
									case 'GameOver':
										var data = event.a;
										return $author$project$Page$Game$SseGameOver(data);
									default:
										return $author$project$Page$Game$RefreshGame;
								}
							}();
							var _v16 = A2($author$project$Page$Game$update, gameMsg, gameModel);
							var newGame = _v16.a;
							var gameCmd = _v16.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										page: $author$project$Main$GamePage(newGame)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Main$GameMsg, gameCmd));
						case 'WaitingPage':
							var rawJson = _v0.a.a;
							var waitingModel = _v0.b.a;
							var _v18 = $author$project$Sse$decodeSseEvent(rawJson);
							if (_v18.$ === 'InstantGameStarted') {
								var data = _v18.a;
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.key,
										$author$project$Route$toPath(
											$author$project$Route$Game(data.gameId))));
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						default:
							break _v0$12;
					}
				default:
					break _v0$12;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Page$Game$EnterSwapMode = {$: 'EnterSwapMode'};
var $author$project$Page$Game$SkipTurn = {$: 'SkipTurn'};
var $author$project$Page$Game$ValidatePlay = {$: 'ValidatePlay'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Page$Game$isSpectator = function (model) {
	return (!$elm$core$List$isEmpty(model.players)) && A2(
		$elm$core$List$all,
		function (p) {
			return $author$project$Types$Player$isBot(p.pseudo);
		},
		model.players);
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Page$Game$viewActions = function (model) {
	return $author$project$Page$Game$isSpectator(model) ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game-actions')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('spectator-label')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('👁 Spectating')
					]))
			])) : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game-actions')
			]),
		_List_fromArray(
			[
				(!$elm$core$List$isEmpty(model.pendingPlacements)) ? A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Page$Game$ValidatePlay),
						$elm$html$Html$Attributes$class('btn btn-primary'),
						$elm$html$Html$Attributes$disabled(
						_Utils_eq(model.simulationScore, $elm$core$Maybe$Nothing))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						function () {
							var _v0 = model.simulationScore;
							if (_v0.$ === 'Just') {
								var s = _v0.a;
								return 'Play (' + ($elm$core$String$fromInt(s) + ' pts)');
							} else {
								return 'Play';
							}
						}())
					])) : $elm$html$Html$text(''),
				((!model.swapMode) && $elm$core$List$isEmpty(model.pendingPlacements)) ? A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Page$Game$EnterSwapMode),
						$elm$html$Html$Attributes$class('btn btn-secondary')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Swap tiles')
					])) : $elm$html$Html$text(''),
				((!model.swapMode) && $elm$core$List$isEmpty(model.pendingPlacements)) ? A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Page$Game$SkipTurn),
						$elm$html$Html$Attributes$class('btn btn-secondary')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Skip turn')
					])) : $elm$html$Html$text('')
			]));
};
var $author$project$Page$Game$MovePan = F2(
	function (a, b) {
		return {$: 'MovePan', a: a, b: b};
	});
var $author$project$Page$Game$StartPan = F2(
	function (a, b) {
		return {$: 'StartPan', a: a, b: b};
	});
var $author$project$Page$Game$StopPan = {$: 'StopPan'};
var $author$project$Page$Game$ZoomBoard = function (a) {
	return {$: 'ZoomBoard', a: a};
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Page$Game$onMouseDown = function (toMsg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		A3(
			$elm$json$Json$Decode$map2,
			toMsg,
			A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float)));
};
var $author$project$Page$Game$onMouseMove = function (toMsg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousemove',
		A3(
			$elm$json$Json$Decode$map2,
			toMsg,
			A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float)));
};
var $author$project$Page$Game$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Page$Game$onWheel = function (toMsg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'wheel',
		A2(
			$elm$json$Json$Decode$map,
			function (dy) {
				return _Utils_Tuple2(
					toMsg(dy),
					true);
			},
			A2($elm$json$Json$Decode$field, 'deltaY', $elm$json$Json$Decode$float)));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$View$Board$boardBounds = function (tiles) {
	if (!tiles.b) {
		return {maxX: 2, maxY: 2, minX: -2, minY: -2};
	} else {
		var first = tiles.a;
		var rest = tiles.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (t, b) {
					return {
						maxX: A2($elm$core$Basics$max, b.maxX, t.coordinate.x),
						maxY: A2($elm$core$Basics$max, b.maxY, t.coordinate.y),
						minX: A2($elm$core$Basics$min, b.minX, t.coordinate.x),
						minY: A2($elm$core$Basics$min, b.minY, t.coordinate.y)
					};
				}),
			{maxX: first.coordinate.x, maxY: first.coordinate.y, minX: first.coordinate.x, minY: first.coordinate.y},
			rest);
	}
};
var $author$project$View$Board$cellSize = 92;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$cursor = _VirtualDom_attribute('cursor');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$dx = _VirtualDom_attribute('dx');
var $elm$svg$Svg$Attributes$dy = _VirtualDom_attribute('dy');
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$svg$Svg$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $author$project$View$Board$feDropShadow = $elm$svg$Svg$node('feDropShadow');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$filter = $elm$svg$Svg$trustedNode('filter');
var $elm$svg$Svg$Attributes$floodColor = _VirtualDom_attribute('flood-color');
var $elm$svg$Svg$Attributes$floodOpacity = _VirtualDom_attribute('flood-opacity');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$View$Board$isAdjacentToOccupied = F3(
	function (gx, gy, occupied) {
		return $elm$core$Set$isEmpty(occupied) ? ((!gx) && (!gy)) : (A2(
			$elm$core$Set$member,
			_Utils_Tuple2(gx + 1, gy),
			occupied) || (A2(
			$elm$core$Set$member,
			_Utils_Tuple2(gx - 1, gy),
			occupied) || (A2(
			$elm$core$Set$member,
			_Utils_Tuple2(gx, gy + 1),
			occupied) || A2(
			$elm$core$Set$member,
			_Utils_Tuple2(gx, gy - 1),
			occupied))));
	});
var $elm$svg$Svg$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$Attributes$preserveAspectRatio = _VirtualDom_attribute('preserveAspectRatio');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$stdDeviation = _VirtualDom_attribute('stdDeviation');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Types$Color$colorToCss = function (color) {
	switch (color.$) {
		case 'Green':
			return '#2ecc71';
		case 'Blue':
			return '#3498db';
		case 'Purple':
			return '#9b59b6';
		case 'Red':
			return '#e74c3c';
		case 'Orange':
			return '#e67e22';
		default:
			return '#f1c40f';
	}
};
var $elm$svg$Svg$Attributes$filter = _VirtualDom_attribute('filter');
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$View$Tile$viewShape = F2(
	function (shape, fill) {
		switch (shape.$) {
			case 'Circle':
				return A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx('45'),
							$elm$svg$Svg$Attributes$cy('45'),
							$elm$svg$Svg$Attributes$r('28'),
							$elm$svg$Svg$Attributes$fill(fill),
							$elm$svg$Svg$Attributes$filter('url(#bevel)')
						]),
					_List_Nil);
			case 'Square':
				return A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('17'),
							$elm$svg$Svg$Attributes$y('17'),
							$elm$svg$Svg$Attributes$width('56'),
							$elm$svg$Svg$Attributes$height('56'),
							$elm$svg$Svg$Attributes$rx('3'),
							$elm$svg$Svg$Attributes$fill(fill),
							$elm$svg$Svg$Attributes$filter('url(#bevel)')
						]),
					_List_Nil);
			case 'Diamond':
				return A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points('45,12 78,45 45,78 12,45'),
							$elm$svg$Svg$Attributes$fill(fill),
							$elm$svg$Svg$Attributes$filter('url(#bevel)')
						]),
					_List_Nil);
			case 'Clover':
				return A2(
					$elm$svg$Svg$g,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx('45'),
									$elm$svg$Svg$Attributes$cy('25'),
									$elm$svg$Svg$Attributes$r('14'),
									$elm$svg$Svg$Attributes$fill(fill)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx('25'),
									$elm$svg$Svg$Attributes$cy('50'),
									$elm$svg$Svg$Attributes$r('14'),
									$elm$svg$Svg$Attributes$fill(fill)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx('65'),
									$elm$svg$Svg$Attributes$cy('50'),
									$elm$svg$Svg$Attributes$r('14'),
									$elm$svg$Svg$Attributes$fill(fill)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$cx('45'),
									$elm$svg$Svg$Attributes$cy('60'),
									$elm$svg$Svg$Attributes$r('14'),
									$elm$svg$Svg$Attributes$fill(fill)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('35'),
									$elm$svg$Svg$Attributes$y('25'),
									$elm$svg$Svg$Attributes$width('20'),
									$elm$svg$Svg$Attributes$height('40'),
									$elm$svg$Svg$Attributes$fill(fill)
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x('25'),
									$elm$svg$Svg$Attributes$y('40'),
									$elm$svg$Svg$Attributes$width('40'),
									$elm$svg$Svg$Attributes$height('20'),
									$elm$svg$Svg$Attributes$fill(fill)
								]),
							_List_Nil)
						]));
			case 'FourPointStar':
				return A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points('45,8 55,35 82,35 60,52 68,82 45,65 22,82 30,52 8,35 35,35'),
							$elm$svg$Svg$Attributes$fill(fill),
							$elm$svg$Svg$Attributes$filter('url(#bevel)')
						]),
					_List_Nil);
			default:
				return A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points('45,6 53,28 70,12 60,33 84,28 65,43 88,45 65,50 84,62 60,57 70,78 53,62 45,84 37,62 20,78 30,57 6,62 25,50 2,45 25,43 6,28 30,33 20,12 37,28'),
							$elm$svg$Svg$Attributes$fill(fill),
							$elm$svg$Svg$Attributes$filter('url(#bevel)')
						]),
					_List_Nil);
		}
	});
var $author$project$View$Tile$viewTile = F3(
	function (face, isLastPlayed, isDragging) {
		var opacity_ = isDragging ? '0.6' : '1';
		var glowFilter = isLastPlayed ? 'url(#glow)' : '';
		var fill = $author$project$Types$Color$colorToCss(face.color);
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$opacity(opacity_)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('2'),
							$elm$svg$Svg$Attributes$y('2'),
							$elm$svg$Svg$Attributes$width('86'),
							$elm$svg$Svg$Attributes$height('86'),
							$elm$svg$Svg$Attributes$rx('8'),
							$elm$svg$Svg$Attributes$ry('8'),
							$elm$svg$Svg$Attributes$fill('#1e2a47'),
							$elm$svg$Svg$Attributes$stroke('#2a3550'),
							$elm$svg$Svg$Attributes$strokeWidth('1.5'),
							$elm$svg$Svg$Attributes$filter(glowFilter)
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('5'),
							$elm$svg$Svg$Attributes$y('5'),
							$elm$svg$Svg$Attributes$width('80'),
							$elm$svg$Svg$Attributes$height('80'),
							$elm$svg$Svg$Attributes$rx('6'),
							$elm$svg$Svg$Attributes$ry('6'),
							$elm$svg$Svg$Attributes$fill('#16213e'),
							$elm$svg$Svg$Attributes$stroke('#2a3550'),
							$elm$svg$Svg$Attributes$strokeWidth('0.5')
						]),
					_List_Nil),
					A2($author$project$View$Tile$viewShape, face.shape, fill)
				]));
	});
var $author$project$View$Tile$viewTileAt = F5(
	function (tileX, tileY, face, isLastPlayed, isDragging) {
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					'translate(' + ($elm$core$String$fromInt(tileX * 92) + (',' + ($elm$core$String$fromInt(tileY * 92) + ')'))))
				]),
			_List_fromArray(
				[
					A3($author$project$View$Tile$viewTile, face, isLastPlayed, isDragging)
				]));
	});
var $author$project$View$Board$viewBoard = F6(
	function (viewport, boardTiles, pendingTiles, lastPlayedSet, onCellClick, onPendingClick) {
		var pad = 2;
		var allTiles = _Utils_ap(boardTiles, pendingTiles);
		var bounds = $author$project$View$Board$boardBounds(allTiles);
		var contentH = (((bounds.maxY - bounds.minY) + 1) + (pad * 2)) * $author$project$View$Board$cellSize;
		var vbH = contentH / viewport.scale;
		var contentMinX = (bounds.minX - pad) * $author$project$View$Board$cellSize;
		var contentMinY = (bounds.minY - pad) * $author$project$View$Board$cellSize;
		var vbY = (contentMinY + ((contentH - vbH) / 2)) - viewport.offsetY;
		var contentW = (((bounds.maxX - bounds.minX) + 1) + (pad * 2)) * $author$project$View$Board$cellSize;
		var vbW = contentW / viewport.scale;
		var vbX = (contentMinX + ((contentW - vbW) / 2)) - viewport.offsetX;
		var viewBoxStr = $elm$core$String$fromFloat(vbX) + (' ' + ($elm$core$String$fromFloat(vbY) + (' ' + ($elm$core$String$fromFloat(vbW) + (' ' + $elm$core$String$fromFloat(vbH))))));
		var rangeMaxX = bounds.maxX + pad;
		var rangeMaxY = bounds.maxY + pad;
		var rangeMinX = bounds.minX - pad;
		var rangeMinY = bounds.minY - pad;
		var occupiedSet = $elm$core$Set$fromList(
			A2(
				$elm$core$List$map,
				function (t) {
					return _Utils_Tuple2(t.coordinate.x, t.coordinate.y);
				},
				allTiles));
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox(viewBoxStr),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid meet')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$defs,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$filter,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('bevel')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$View$Board$feDropShadow,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$dx('1'),
											$elm$svg$Svg$Attributes$dy('1'),
											$elm$svg$Svg$Attributes$stdDeviation('1'),
											$elm$svg$Svg$Attributes$floodColor('#000'),
											$elm$svg$Svg$Attributes$floodOpacity('0.4')
										]),
									_List_Nil)
								])),
							A2(
							$elm$svg$Svg$filter,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('glow')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$View$Board$feDropShadow,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$dx('0'),
											$elm$svg$Svg$Attributes$dy('0'),
											$elm$svg$Svg$Attributes$stdDeviation('4'),
											$elm$svg$Svg$Attributes$floodColor('#e2a03f'),
											$elm$svg$Svg$Attributes$floodOpacity('0.8')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('empty-cells')
						]),
					A2(
						$elm$core$List$concatMap,
						function (gx) {
							return A2(
								$elm$core$List$filterMap,
								function (gy) {
									return ((!A2(
										$elm$core$Set$member,
										_Utils_Tuple2(gx, gy),
										occupiedSet)) && A3($author$project$View$Board$isAdjacentToOccupied, gx, gy, occupiedSet)) ? $elm$core$Maybe$Just(
										A2(
											$elm$svg$Svg$rect,
											_List_fromArray(
												[
													$elm$svg$Svg$Attributes$x(
													$elm$core$String$fromInt((gx * $author$project$View$Board$cellSize) + 2)),
													$elm$svg$Svg$Attributes$y(
													$elm$core$String$fromInt((gy * $author$project$View$Board$cellSize) + 2)),
													$elm$svg$Svg$Attributes$width('86'),
													$elm$svg$Svg$Attributes$height('86'),
													$elm$svg$Svg$Attributes$rx('8'),
													$elm$svg$Svg$Attributes$fill('rgba(226,160,63,0.05)'),
													$elm$svg$Svg$Attributes$stroke('rgba(226,160,63,0.3)'),
													$elm$svg$Svg$Attributes$strokeWidth('1.5'),
													$elm$svg$Svg$Attributes$strokeDasharray('6,4'),
													$elm$svg$Svg$Attributes$class('drop-target'),
													$elm$svg$Svg$Attributes$cursor('pointer'),
													$elm$svg$Svg$Events$onClick(
													onCellClick(
														{x: gx, y: gy}))
												]),
											_List_Nil)) : $elm$core$Maybe$Nothing;
								},
								A2($elm$core$List$range, rangeMinY, rangeMaxY));
						},
						A2($elm$core$List$range, rangeMinX, rangeMaxX))),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('board-tiles')
						]),
					A2(
						$elm$core$List$map,
						function (bt) {
							return A5(
								$author$project$View$Tile$viewTileAt,
								bt.coordinate.x,
								bt.coordinate.y,
								bt.face,
								A2(
									$elm$core$Set$member,
									_Utils_Tuple2(bt.coordinate.x, bt.coordinate.y),
									lastPlayedSet),
								false);
						},
						boardTiles)),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('pending-tiles')
						]),
					A2(
						$elm$core$List$map,
						function (bt) {
							return A2(
								$elm$svg$Svg$g,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$cursor('pointer'),
										$elm$svg$Svg$Events$onClick(
										onPendingClick(bt.coordinate))
									]),
								_List_fromArray(
									[
										A5($author$project$View$Tile$viewTileAt, bt.coordinate.x, bt.coordinate.y, bt.face, false, true)
									]));
						},
						pendingTiles))
				]));
	});
var $author$project$Page$Game$viewBoardArea = function (model) {
	return model.is3DView ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game-board game-board-3d'),
				$elm$html$Html$Attributes$id('three-canvas-container')
			]),
		_List_Nil) : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game-board'),
				$author$project$Page$Game$onWheel(
				function (dy) {
					return $author$project$Page$Game$ZoomBoard(-dy);
				}),
				$author$project$Page$Game$onMouseDown($author$project$Page$Game$StartPan),
				$author$project$Page$Game$onMouseMove($author$project$Page$Game$MovePan),
				$author$project$Page$Game$onMouseUp($author$project$Page$Game$StopPan),
				A2(
				$elm$html$Html$Events$on,
				'mouseleave',
				$elm$json$Json$Decode$succeed($author$project$Page$Game$StopPan))
			]),
		_List_fromArray(
			[
				model.loading ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('loading')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('spinner')
							]),
						_List_Nil)
					])) : A6($author$project$View$Board$viewBoard, model.viewport, model.board, model.pendingPlacements, model.lastPlayedCoords, $author$project$Page$Game$ClickBoardCell, $author$project$Page$Game$RemovePending)
			]));
};
var $author$project$Page$Game$viewErrorToast = function (model) {
	var _v0 = model.error;
	if (_v0.$ === 'Just') {
		var err = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('error-toast')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(err)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Page$Game$GoToLobby = {$: 'GoToLobby'};
var $author$project$Page$Game$Toggle3DView = {$: 'Toggle3DView'};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Page$Game$viewHeader = F2(
	function (pseudo, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('game-header')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('logo-small')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('QWIRKLE')
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('game-id')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'#' + $elm$core$String$fromInt(model.gameId))
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('turn-info')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							_Utils_eq(model.currentTurnPseudo, pseudo) ? 'Your turn!' : ($author$project$Types$Player$displayName(model.currentTurnPseudo) + '\'s turn'))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Page$Game$Toggle3DView),
							$elm$html$Html$Attributes$class('btn btn-small btn-3d-toggle')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							model.is3DView ? '2D' : '3D')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Page$Game$RefreshGame),
							$elm$html$Html$Attributes$class('btn btn-small')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Refresh')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Page$Game$GoToLobby),
							$elm$html$Html$Attributes$class('btn btn-small')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Lobby')
						]))
				]));
	});
var $author$project$Page$Game$CancelSwap = {$: 'CancelSwap'};
var $author$project$Page$Game$ConfirmSwap = {$: 'ConfirmSwap'};
var $author$project$Page$Game$UndoAllPlacements = {$: 'UndoAllPlacements'};
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$View$Rack$viewRack = F3(
	function (tiles, selectedIndices, onTileClick) {
		var tileCount = $elm$core$List$length(tiles);
		var cellW = 96;
		var svgWidth = A2($elm$core$Basics$max, 200, (tileCount * cellW) + 8);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox(
					'0 0 ' + ($elm$core$String$fromInt(svgWidth) + ' 100')),
					A2($elm$html$Html$Attributes$style, 'height', '60px'),
					A2(
					$elm$html$Html$Attributes$style,
					'width',
					$elm$core$String$fromInt((tileCount * 64) + 8) + 'px'),
					A2($elm$html$Html$Attributes$style, 'max-width', '100%'),
					A2($elm$html$Html$Attributes$style, 'flex-shrink', '1')
				]),
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (idx, rt) {
						var xPos = (idx * cellW) + 4;
						var isSelected = A2($elm$core$List$member, idx, selectedIndices);
						return A2(
							$elm$svg$Svg$g,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$transform(
									'translate(' + ($elm$core$String$fromInt(xPos) + ', 4)')),
									$elm$svg$Svg$Attributes$cursor('pointer'),
									$elm$svg$Svg$Events$onClick(
									onTileClick(idx))
								]),
							_List_fromArray(
								[
									isSelected ? A2(
									$elm$svg$Svg$rect,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$x('-2'),
											$elm$svg$Svg$Attributes$y('-2'),
											$elm$svg$Svg$Attributes$width('94'),
											$elm$svg$Svg$Attributes$height('94'),
											$elm$svg$Svg$Attributes$rx('10'),
											$elm$svg$Svg$Attributes$fill('none'),
											$elm$svg$Svg$Attributes$stroke('#e2a03f'),
											$elm$svg$Svg$Attributes$strokeWidth('4')
										]),
									_List_Nil) : $elm$svg$Svg$text(''),
									A3($author$project$View$Tile$viewTile, rt.face, false, false)
								]));
					}),
				tiles));
	});
var $author$project$Page$Game$viewRackArea = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game-rack')
			]),
		_List_fromArray(
			[
				model.swapMode ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('swap-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Select tiles to swap')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Game$ConfirmSwap),
								$elm$html$Html$Attributes$class('btn btn-primary btn-small')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Swap')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Game$CancelSwap),
								$elm$html$Html$Attributes$class('btn btn-secondary btn-small')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Cancel')
							]))
					])) : ((!$elm$core$List$isEmpty(model.pendingPlacements)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('placement-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('pending-count')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(
									$elm$core$List$length(model.pendingPlacements)) + ' tile(s) placed')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Game$UndoAllPlacements),
								$elm$html$Html$Attributes$class('btn btn-secondary btn-small')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Undo all')
							]))
					])) : $elm$html$Html$text('')),
				(!model.is3DView) ? A3(
				$author$project$View$Rack$viewRack,
				model.rack,
				function () {
					if (model.swapMode) {
						return model.swapSelected;
					} else {
						var _v0 = model.selectedRackIndex;
						if (_v0.$ === 'Just') {
							var idx = _v0.a;
							return _List_fromArray(
								[idx]);
						} else {
							return _List_Nil;
						}
					}
				}(),
				$author$project$Page$Game$SelectRackTile) : $elm$html$Html$text('')
			]));
};
var $author$project$View$Scoreboard$viewPlayerScore = F2(
	function (currentPseudo, player) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'player-score' + ((player.isTurn ? ' active' : '') + (_Utils_eq(player.pseudo, currentPseudo) ? ' is-me' : '')))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('player-score-main')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('player-name')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$author$project$Types$Player$displayName(player.pseudo)),
									_Utils_eq(player.pseudo, currentPseudo) ? A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('me-badge')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('(you)')
										])) : $elm$html$Html$text('')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('player-points')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(player.points))
								]))
						])),
					(player.lastTurnPoints > 0) ? A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('last-turn-points')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'+' + $elm$core$String$fromInt(player.lastTurnPoints))
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$View$Scoreboard$viewScoreboard = F2(
	function (players, currentPseudo) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('scoreboard')
				]),
			A2(
				$elm$core$List$map,
				$author$project$View$Scoreboard$viewPlayerScore(currentPseudo),
				players));
	});
var $author$project$Page$Game$viewSidebar = F2(
	function (pseudo, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('game-sidebar')
				]),
			_List_fromArray(
				[
					A2($author$project$View$Scoreboard$viewScoreboard, model.players, pseudo),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('bag-info')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('bag-icon')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('🎒')
								])),
							$elm$html$Html$text(
							' ' + ($elm$core$String$fromInt(model.bagCount) + ' tiles in bag'))
						])),
					function () {
					var _v0 = model.simulationScore;
					if (_v0.$ === 'Just') {
						var score = _v0.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('simulation-score')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Score: '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('score-value-big')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(score))
										]))
								]));
					} else {
						var _v1 = model.simulationCode;
						if (_v1.$ === 'Just') {
							var code = _v1.a;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('simulation-error')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(code)
									]));
						} else {
							return $elm$html$Html$text('');
						}
					}
				}()
				]));
	});
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Page$Game$viewWinnerOverlay = function (model) {
	var _v0 = model.winner;
	if (_v0.$ === 'Just') {
		var w = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('winner-overlay')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('winner-card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h2,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Game Over!')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(w + ' wins!')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$Page$Game$GoToLobby),
									$elm$html$Html$Attributes$class('btn btn-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Back to Lobby')
								]))
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Page$Game$view = F2(
	function (pseudo, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('page game-page')
				]),
			_List_fromArray(
				[
					A2($author$project$Page$Game$viewHeader, pseudo, model),
					$author$project$Page$Game$viewBoardArea(model),
					A2($author$project$Page$Game$viewSidebar, pseudo, model),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('game-footer')
						]),
					_List_fromArray(
						[
							$author$project$Page$Game$viewRackArea(model),
							$author$project$Page$Game$viewActions(model)
						])),
					$author$project$Page$Game$viewWinnerOverlay(model),
					$author$project$Page$Game$viewErrorToast(model)
				]));
	});
var $author$project$Page$Lobby$GoToOpponents = {$: 'GoToOpponents'};
var $author$project$Page$Lobby$InstantGame = function (a) {
	return {$: 'InstantGame', a: a};
};
var $author$project$Page$Lobby$Logout = {$: 'Logout'};
var $author$project$Page$Lobby$NewGameVsBot = {$: 'NewGameVsBot'};
var $author$project$Page$Lobby$NewGameVsMctsBot = {$: 'NewGameVsMctsBot'};
var $author$project$Page$Lobby$WatchBotsBattle = {$: 'WatchBotsBattle'};
var $author$project$Page$Lobby$DeleteGame = function (a) {
	return {$: 'DeleteGame', a: a};
};
var $author$project$Page$Lobby$SelectGame = function (a) {
	return {$: 'SelectGame', a: a};
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Page$Lobby$viewPlayerBadge = function (player) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				'player-badge' + (player.isTurn ? ' active-turn' : ''))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				$author$project$Types$Player$displayName(player.pseudo))
			]));
};
var $author$project$Page$Lobby$viewGamePreview = function (preview) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game-card'),
				$elm$html$Html$Events$onClick(
				$author$project$Page$Lobby$SelectGame(preview.id))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-card-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('game-card-id')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'#' + $elm$core$String$fromInt(preview.id))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('game-card-status')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(preview.status)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn-delete'),
								A2(
								$elm$html$Html$Events$stopPropagationOn,
								'click',
								$elm$json$Json$Decode$succeed(
									_Utils_Tuple2(
										$author$project$Page$Lobby$DeleteGame(preview.id),
										true))),
								$elm$html$Html$Attributes$title('Delete game')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('\u00D7')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-card-players')
					]),
				A2($elm$core$List$map, $author$project$Page$Lobby$viewPlayerBadge, preview.players)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-card-info')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tile-count')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(preview.tileCount) + ' tiles on board')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('game-card-scores')
					]),
				A2(
					$elm$core$List$map,
					function (p) {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mini-score')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Player$displayName(p.pseudo))
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('score-value')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(p.points))
										]))
								]));
					},
					preview.players))
			]));
};
var $author$project$Page$Lobby$view = F2(
	function (pseudo, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('page lobby-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('lobby-header')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('logo')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('QWIRKLE')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('user-info')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('pseudo')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(pseudo)
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Page$Lobby$Logout),
											$elm$html$Html$Attributes$class('btn btn-small')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Logout')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('lobby-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$Page$Lobby$NewGameVsBot),
									$elm$html$Html$Attributes$class('btn btn-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('vs Greedy bot')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$Page$Lobby$NewGameVsMctsBot),
									$elm$html$Html$Attributes$class('btn btn-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('vs Neural bot')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$Page$Lobby$WatchBotsBattle),
									$elm$html$Html$Attributes$class('btn btn-accent')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Watch: Greedy vs Neural')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$Page$Lobby$GoToOpponents),
									$elm$html$Html$Attributes$class('btn btn-secondary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('New Game')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('instant-games')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('instant-label')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Quick match')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Page$Lobby$InstantGame(2)),
											$elm$html$Html$Attributes$class('btn btn-accent btn-small')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('2P')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Page$Lobby$InstantGame(3)),
											$elm$html$Html$Attributes$class('btn btn-accent btn-small')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('3P')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Page$Lobby$InstantGame(4)),
											$elm$html$Html$Attributes$class('btn btn-accent btn-small')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('4P')
										]))
								]))
						])),
					function () {
					var _v0 = model.error;
					if (_v0.$ === 'Just') {
						var err = _v0.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('error-banner')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(err)
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}(),
					model.loading ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('loading')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('spinner')
								]),
							_List_Nil)
						])) : (($elm$core$List$isEmpty(model.gamePreviews) && $elm$core$List$isEmpty(model.gameIds)) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('empty-state')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h2,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('No games yet')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Start a new game to begin playing!')
								]))
						])) : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('games-grid')
						]),
					A2($elm$core$List$map, $author$project$Page$Lobby$viewGamePreview, model.gamePreviews)))
				]));
	});
var $author$project$Page$Login$GoToRegister = {$: 'GoToRegister'};
var $author$project$Page$Login$SetPassword = function (a) {
	return {$: 'SetPassword', a: a};
};
var $author$project$Page$Login$SetPseudo = function (a) {
	return {$: 'SetPseudo', a: a};
};
var $author$project$Page$Login$SubmitGuest = {$: 'SubmitGuest'};
var $author$project$Page$Login$SubmitLogin = {$: 'SubmitLogin'};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Page$Login$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page login-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('login-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('logo')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('QWIRKLE')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('subtitle')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Tile strategy game')
							])),
						function () {
						var _v0 = model.error;
						if (_v0.$ === 'Just') {
							var err = _v0.a;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('error-msg')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(err)
									]));
						} else {
							return $elm$html$Html$text('');
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Pseudo'),
										$elm$html$Html$Attributes$value(model.pseudo),
										$elm$html$Html$Events$onInput($author$project$Page$Login$SetPseudo),
										$elm$html$Html$Attributes$class('input-field')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('password'),
										$elm$html$Html$Attributes$placeholder('Password'),
										$elm$html$Html$Attributes$value(model.password),
										$elm$html$Html$Events$onInput($author$project$Page$Login$SetPassword),
										$elm$html$Html$Attributes$class('input-field')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Login$SubmitLogin),
								$elm$html$Html$Attributes$class('btn btn-primary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Login')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Login$SubmitGuest),
								$elm$html$Html$Attributes$class('btn btn-secondary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Play as Guest')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('link'),
								$elm$html$Html$Events$onClick($author$project$Page$Login$GoToRegister)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create an account')
							]))
					]))
			]));
};
var $author$project$Page$Opponents$CreateGame = {$: 'CreateGame'};
var $author$project$Page$Opponents$GoBack = {$: 'GoBack'};
var $author$project$Page$Opponents$SelectFavorite = F2(
	function (a, b) {
		return {$: 'SelectFavorite', a: a, b: b};
	});
var $author$project$Page$Opponents$SetOpponent1 = function (a) {
	return {$: 'SetOpponent1', a: a};
};
var $author$project$Page$Opponents$SetOpponent2 = function (a) {
	return {$: 'SetOpponent2', a: a};
};
var $author$project$Page$Opponents$SetOpponent3 = function (a) {
	return {$: 'SetOpponent3', a: a};
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Page$Opponents$nextEmptySlot = function (model) {
	return (model.opponent1 === '') ? 1 : ((model.opponent2 === '') ? 2 : ((model.opponent3 === '') ? 3 : 1));
};
var $author$project$Page$Opponents$SetSlotBot = F2(
	function (a, b) {
		return {$: 'SetSlotBot', a: a, b: b};
	});
var $elm$html$Html$datalist = _VirtualDom_node('datalist');
var $elm$html$Html$Attributes$list = _VirtualDom_attribute('list');
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$Page$Opponents$viewOpponentSlot = F5(
	function (slot, placeholder_, value_, onInputMsg, favorites) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('opponent-row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('opponent-input-wrap')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder(placeholder_),
									$elm$html$Html$Attributes$value(value_),
									$elm$html$Html$Events$onInput(onInputMsg),
									$elm$html$Html$Attributes$class('input-field'),
									$elm$html$Html$Attributes$list(
									'favorites-' + $elm$core$String$fromInt(slot))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$datalist,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id(
									'favorites-' + $elm$core$String$fromInt(slot))
								]),
							A2(
								$elm$core$List$map,
								function (n) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(n)
											]),
										_List_Nil);
								},
								favorites))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							A2($author$project$Page$Opponents$SetSlotBot, slot, 'bot1')),
							$elm$html$Html$Attributes$class('btn btn-small btn-bot'),
							$elm$html$Html$Attributes$title('Greedy bot (fast, rule-based)')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Greedy')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							A2($author$project$Page$Opponents$SetSlotBot, slot, 'bot2')),
							$elm$html$Html$Attributes$class('btn btn-small btn-bot btn-bot-neural'),
							$elm$html$Html$Attributes$title('Neural bot (Graph Transformer + MCTS)')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Neural')
						]))
				]));
	});
var $author$project$Page$Opponents$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page opponents-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('login-card opponents-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('New Game')
							])),
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Choose opponents')
							])),
						A5($author$project$Page$Opponents$viewOpponentSlot, 1, 'Opponent 1', model.opponent1, $author$project$Page$Opponents$SetOpponent1, model.favorites),
						A5($author$project$Page$Opponents$viewOpponentSlot, 2, 'Opponent 2 (optional)', model.opponent2, $author$project$Page$Opponents$SetOpponent2, model.favorites),
						A5($author$project$Page$Opponents$viewOpponentSlot, 3, 'Opponent 3 (optional)', model.opponent3, $author$project$Page$Opponents$SetOpponent3, model.favorites),
						(!$elm$core$List$isEmpty(model.favorites)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('favorites-section')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Favorites')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('favorites-chips')
									]),
								A2(
									$elm$core$List$map,
									function (name) {
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('chip'),
													$elm$html$Html$Events$onClick(
													A2(
														$author$project$Page$Opponents$SelectFavorite,
														$author$project$Page$Opponents$nextEmptySlot(model),
														name))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(name)
												]));
									},
									model.favorites))
							])) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('opponents-actions')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Page$Opponents$CreateGame),
										$elm$html$Html$Attributes$class('btn btn-primary')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Start Game')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Page$Opponents$GoBack),
										$elm$html$Html$Attributes$class('btn btn-secondary')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Back')
									]))
							]))
					]))
			]));
};
var $author$project$Page$Register$GoToLogin = {$: 'GoToLogin'};
var $author$project$Page$Register$SetEmail = function (a) {
	return {$: 'SetEmail', a: a};
};
var $author$project$Page$Register$SetPassword = function (a) {
	return {$: 'SetPassword', a: a};
};
var $author$project$Page$Register$SetPseudo = function (a) {
	return {$: 'SetPseudo', a: a};
};
var $author$project$Page$Register$SubmitRegister = {$: 'SubmitRegister'};
var $author$project$Page$Register$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page register-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('login-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('logo')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('QWIRKLE')
							])),
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Create Account')
							])),
						function () {
						var _v0 = model.error;
						if (_v0.$ === 'Just') {
							var err = _v0.a;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('error-msg')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(err)
									]));
						} else {
							return $elm$html$Html$text('');
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Pseudo'),
										$elm$html$Html$Attributes$value(model.pseudo),
										$elm$html$Html$Events$onInput($author$project$Page$Register$SetPseudo),
										$elm$html$Html$Attributes$class('input-field')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('email'),
										$elm$html$Html$Attributes$placeholder('Email'),
										$elm$html$Html$Attributes$value(model.email),
										$elm$html$Html$Events$onInput($author$project$Page$Register$SetEmail),
										$elm$html$Html$Attributes$class('input-field')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('password'),
										$elm$html$Html$Attributes$placeholder('Password'),
										$elm$html$Html$Attributes$value(model.password),
										$elm$html$Html$Events$onInput($author$project$Page$Register$SetPassword),
										$elm$html$Html$Attributes$class('input-field')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Register$SubmitRegister),
								$elm$html$Html$Attributes$class('btn btn-primary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Register')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('link'),
								$elm$html$Html$Events$onClick($author$project$Page$Register$GoToLogin)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Already have an account?')
							]))
					]))
			]));
};
var $author$project$Page$Waiting$GoBack = {$: 'GoBack'};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Page$Waiting$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page waiting-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('login-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Finding players...')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('waiting-info')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Looking for a ' + ($elm$core$String$fromInt(model.playersNumber) + '-player game'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('spinner')
							]),
						_List_Nil),
						(!$elm$core$List$isEmpty(model.waitingPlayers)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('waiting-players')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Players waiting')
									])),
								A2(
								$elm$html$Html$ul,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (name) {
										return A2(
											$elm$html$Html$li,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('waiting-player')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(name)
												]));
									},
									model.waitingPlayers))
							])) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$Waiting$GoBack),
								$elm$html$Html$Attributes$class('btn btn-secondary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Cancel')
							]))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	return {
		body: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('app')
					]),
				_List_fromArray(
					[
						function () {
						var _v0 = model.page;
						switch (_v0.$) {
							case 'LoginPage':
								var pageModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Main$LoginMsg,
									$author$project$Page$Login$view(pageModel));
							case 'RegisterPage':
								var pageModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Main$RegisterMsg,
									$author$project$Page$Register$view(pageModel));
							case 'LobbyPage':
								var pageModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Main$LobbyMsg,
									A2($author$project$Page$Lobby$view, model.pseudo, pageModel));
							case 'OpponentsPage':
								var pageModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Main$OpponentsMsg,
									$author$project$Page$Opponents$view(pageModel));
							case 'GamePage':
								var pageModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Main$GameMsg,
									A2($author$project$Page$Game$view, model.pseudo, pageModel));
							default:
								var pageModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Main$WaitingMsg,
									$author$project$Page$Waiting$view(pageModel));
						}
					}()
					]))
			]),
		title: 'Qwirkle'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$UrlRequested, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (token) {
			return $elm$json$Json$Decode$succeed(
				{token: token});
		},
		A2(
			$elm$json$Json$Decode$field,
			'token',
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
						A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
					])))))(0)}});}(this));