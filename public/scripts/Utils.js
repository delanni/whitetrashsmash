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

(function(){
    var e = PIXI;
    e.GrayFilter = function() {
        e.AbstractFilter.call(this),
        this.passes = [this],
        this.uniforms = {
            gray: {
                type: "1f",
                value: 1
            }
        },
        this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "uniform float gray;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);", "}"]
    }
    ,
    e.GrayFilter.prototype = Object.create(e.AbstractFilter.prototype),
    e.GrayFilter.prototype.constructor = e.GrayFilter,
    Object.defineProperty(e.GrayFilter.prototype, "gray", {
        get: function() {
            return this.uniforms.gray.value
        },
        set: function(a) {
            this.uniforms.gray.value = a
        }
    });
    window.grayFilter = new PIXI.GrayFilter();
    window.grayFilter.gray = 0.8;
})();