const NodeCache = require("node-cache");
const cache = new NodeCache();
const getOrSetCache = (id, value) => {
  try {
    let result;
    if (value) {
      // console.log("🚀 ~ getOrSetCache ~ id:", id, value, cache.set(id, value));
      result = cache.set(id, value);
      // console.log("🚀 ~ getOrSetCache ~ resultset:", result);
      return result;
    }
    result = cache.get(id);
    // console.log("🚀 ~ getOrSetCache ~ resultget:", result, "with id ", id);
    return result;
  } catch (error) {
    // console.log("🚀 ~ getOrSetCache ~ error:", error);
  }
};
module.exports = getOrSetCache;
