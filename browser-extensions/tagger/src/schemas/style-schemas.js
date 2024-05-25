"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightSchema = exports.HighlightShorthand = exports.HighlightGranular = exports.TextDecorationStyleSchema = exports.HighlightCommon = exports.TextDecorationLineSchema = void 0;
var zod_1 = require("zod");
exports.TextDecorationLineSchema = zod_1.z.optional(zod_1.z.array(zod_1.z.literal('none')).or(zod_1.z
    .array(zod_1.z
    .literal('underline')
    .or(zod_1.z.literal('overline'))
    .or(zod_1.z.literal('line-through')))
    .refine(function (items) { return new Set(items).size === items.length; }, {
    message: 'must be an array of unique strings',
})));
exports.HighlightCommon = zod_1.z.object({
    color: zod_1.z.string().optional(),
    backgroundColor: zod_1.z.literal('red'),
    textShadow: zod_1.z.string().optional(),
});
exports.TextDecorationStyleSchema = zod_1.z
    .literal('solid')
    .or(zod_1.z.literal('double'))
    .or(zod_1.z.literal('dotted'))
    .or(zod_1.z.literal('dashed'))
    .or(zod_1.z.literal('wavy'))
    .optional();
exports.HighlightGranular = exports.HighlightCommon.extend({
    textDecorationColor: zod_1.z.string().optional(),
    textDecorationLine: exports.TextDecorationLineSchema,
    textDecorationStyle: exports.TextDecorationStyleSchema,
    textDecorationThickness: zod_1.z.string().optional(),
});
exports.HighlightShorthand = exports.HighlightCommon.merge(zod_1.z.object({
    textDecoration: zod_1.z.string().optional(),
}));
exports.HighlightSchema = exports.HighlightGranular.or(exports.HighlightShorthand).or(exports.HighlightCommon);
