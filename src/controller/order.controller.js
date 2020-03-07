const Order = require('../models/order').Order;
const Product = require('../models/product');
const Address = require('../models/address.model');
const OrderItem = require('../models/order-item.model');

exports.getOrders = function (req, res, next) {
  let userId = req.resources.userData._id;
    return Promise.all([
        Order.find({user:})
            .limit(Number(req.pageSize))
            .skip(Number((req.page - 1) * req.pageSize))
            .sort({createdAt: 'desc'})
            .populate('address')
            2(),
        Order.count({user: req.user}).exec(),
    ]).then(function (results) {
        const orders = results[0];
        const ordersCount = results[1];

        return res.json(OrderDto.buildPagedList(orders, req.page, req.pageSize, ordersCount, req.baseUrl, false, true));
    }).catch(err => {
        return res.json(AppResponseDto.buildWithErrorMessages(err));
    });
};

function createOrderWithAddress(res, cartItems, address, user) {
    const promises = [];

    if (user != null) {
        user.orders.push(order);
    }

    const order = new Order({
        user: user,
        address: address
    });



    Product
    .find()
    .where('_id')
    .in(cartItems.map(cartItem => cartItem.id))
    .then(products => {

        if (products.length !== cartItems.length) {
            return res.json({
                message : "Make sure the products are still available."
            })
        }


        products.forEach((product, index) => {
            let orderItem = new OrderItem({
                name: product.name,
                slug: product.slug,
                price: product.price,
                user: user,
                quantity: cartItems[index].quantity,
                order: order
            });
            promises.push(orderItem.save());
            order.orderItems.push(orderItem);
        });

        promises.push(address.save());
        if (user != null)
            promises.push(user.save());
        promises.push(order.save());

        Promise.all(promises).then(async results => {
            const order = results.pop();
            return res.json({
                success: true,
                data: order
            });
        }).catch(err => {
            res.json({
                success: false,
                message: "Sorry we could not process the order" + err
            })
        });
    });
}

exports.createOrder = async function (req, res, next) {
    const addressId = req.resources.userAddress
    if (req.resources.userData != null && addressId != null) {
        Address.findById(addressId).populate('user', '_id')
            .then(address => {
                // if address does not exist, or address exist but it was from a guest user, or exists and belongs to another user
                if (!address || !address.user || address.user.id !== req.user.id)
                    return res.status(401).json({
                        success: false,
                        message: "You don't own that address"
                    });
                else {
                    return createOrderWithAddress(res, req.body.cart_items, address, req.user);
                }
            }).catch(err => {
                throw err;
            });
    } else if (addressId == null) {

        const country = req.body.country;
        const city = req.body.city;
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const address = req.body.address;

        const addr = new Address({
            country, city, firstName, lastName, address
        });
        if (req.resources.userData != null) {
            addr.user = req.resources.userData._id;
        }
        return createOrderWithAddress(res, req.body.cart_items, addr, req.user);
    }

};

exports.getOrderDetails = function (req, res, next) {

    return Promise.all([
        // populate address, and his user(even though the users' address info is not output in this response
        req.resources.order.populate({
            path: 'address',
            populate: {
                path: 'user',
                model: 'User'
            },
        }).exec(),
        // Load order items
        OrderItem.find({order: req.resources.order._id})
    ]).then(results => {
        const order = results[0];
        order.orderItems = results[1];
        return res.json({
            success: true,
            order-details: order
        });
    }).catch(err => {
        return res.json({
            success: false,
            message: "Sorry we could not process your request."
        })
    });
};
