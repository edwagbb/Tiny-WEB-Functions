const cloud = require('@sys/cloud');

exports.default = async function (ctx) {
    return await require("@/a").default(ctx)
}