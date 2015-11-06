/**
 * Merges the 'what' object to the 'where' object, if variable arguments are present, then any further 'what' objects will be merged in one after another
 * @param   {Object} [where={}] The target for merging
 * @param   {Object} [what={}]  The object with the attributes to merge
 * @returns {Object} The modified target object
 */
var __merge = function (where, what) {
    where = where || {};
    what = what || {};

    Object.keys(what).forEach(function (k) {
        if (typeof what[k] !== 'undefined') {
            if (what[k].clone) {
                where[k] = what[k].clone();
            } else if (what[k].slice) {
                where[k] = what[k].slice();
            } else {
                where[k] = what[k];
            }
        }
    });
    if (arguments.length > 2) {
        var args = [].slice.call(arguments, 0);
        var base = args.shift();
        var consumed = args.shift();
        return __merge.apply(null, [base].concat(args));
    }
    return where;
};