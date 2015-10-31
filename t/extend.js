;(function (global) {
	(typeof define !== 'undefined' && define.amd && !define(function () { return extend; })) ||
	(typeof module !== 'undefined' && (module.exports = extend)) ||
	(global.extend = extend);

	var toString = Object.prototype.toString;
	var pSlice = Array.prototype.slice;

	function isObject(obj, isPlain) {
		return obj == null ? false :
			typeof obj !== 'object' ? false :
			!isPlain ? true : toString.call(obj) === '[object Object]' &&
				obj.constructor === Object;
	}

	function isPlainObject(obj) {
		return isObject(obj, true) &&
			obj.nodeType === void 0 &&
			obj.window === void 0;
	}

	function extend() {
		var target;
		var deep = arguments[0] === true;
		var index = 1;
		var targetIsArray;

		target = typeof arguments[0] === 'boolean'
			? ++index && arguments[1]
			: arguments[0];
		!(isObject(target) || typeof target === 'function') && (target = {});
		arguments.length <= 1 && !(index = 0) && (target = this);

		targetIsArray = Array.isArray(target);

		return arguments.length === 0 ? target :
			pSlice.call(arguments, index).reduce(function (target, obj) {
				if (obj == null || !isObject(obj) || !(isPlainObject(obj) || Array.isArray(obj))) {
					return target;
				}

				Object.keys(obj).reduce(function (target, key) {
					var value = obj[key];
					if (value === void 0 || value === target) {
						return target;
					}

					if (!deep || !isObject(value)) {
						if (targetIsArray) {
							target.push(value);
						} else {
							target[key] = value;
						}
					} else {
						var	data =
							Array.isArray(value) ?
								Array.isArray(target[key]) ? target[key] : [] :
							isPlainObject(value) ?
								isPlainObject(target[key]) ? target[key] : {} :
							{};
						target[key] = extend(true, data, value);
					}

					return target;
				}, target);

				return target;
			}, target);
	}

})(this);