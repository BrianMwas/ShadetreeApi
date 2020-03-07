module.exports.createSlug = createSlug;

function createSlug(value) {
    return value
        .toLowerCase()
        .replace(/[^\w\s]+/g, '')
        .trim()
        .replace(/[\s]+/g, '-');
}