module.exports = () => {
    var coupon = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0987654321";

    for(var i = 0; i < 7; i++) {
        coupon += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return coupon;
}