
const fetch = require('node-fetch');
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTER_WAVE_PUBLIC_KEY, process.env.FLUUTER_WAVE_SECRET_KEY);

const { FETCH_CART_QUERY, PLACE_ORDER_MUTATION } = require('../queries');

class PaymentController {

  payWithMobileMoney = async (req, res) => {
    const { currency, addressDetails } = req.body.input;
    const session_variables = req.body.session_variables;

    const getUserCart = await fetch('https://bloombar.hasura.app/v1/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: FETCH_CART_QUERY }),
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
      }
    });

    const userCart = await getUserCart.json();
    let cartTotalPrice = 0;
    userCart.data.cart.forEach(product => cartTotalPrice += product.productByProduct.price * item.quantity);
    const user = session_variables['x-hasura-user-id'];

    const cartProducts = userCart.data.cart.map(product => ({
      product: product.productByProduct.id,
      price: product.productByProduct.price,
      quantity: product.quantity,
      user: product.user
    }));

    const orderObject = {
      ...addressDetails,
      order_items: {
        data: cartProducts
      },
      user,
      currency
    };

    const createOrder = await fetch('https://bloombar.hasura.app/v1/graphql', {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({ query: PLACE_ORDER_MUTATION, variables: { object: orderObject } })
    });

    const order = await createOrder.json();

    try {
      const payload = {
        "tx_ref": "MC-1585230950508",
        "amount": "1500",
        "email": "stuartdambi@gmail.com",
        "phone_number": "0783826364",
        "currency": "UGX",
        "fullname": "Stuart Dambi",
        "redirect_url": "https://rave-webhook.herokuapp.com/receivepayment",
        "network": "MTN"
      };
      const response = await flw.MobileMoney.uganda(payload);
      return res.status(200).json({
        status: res.statusCode,
        paymentData: response,
        order: order
      })
    } catch (error) {
      return res.status(500).json({
        status: res.statusCode,
        error
      });
    }

  };

}

module.exports = PaymentController;
