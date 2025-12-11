const NodeCache = require("node-cache");
const cache = new NodeCache();
const getOrSetCache = (id, value) => {
  try {
    let result;
    if (value) {
      result = cache.set(id, value);
      return result;
    }
    result = cache.get(id);
    return result;
  } catch (error) {
  }
};
module.exports = getOrSetCache;
