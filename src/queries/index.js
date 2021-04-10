export const FETCH_CART_QUERY = `
  query {
    cart {
      id
      quantity
      user
      productByProduct{
        id
        price
      }
    }
  }
`;

export const ADD_TO_CART_QUERY = `
  mutation createCartItem($product: Int!, $store: Int!, $user: String!, $quantity: Int!, $new_amount_in_cart: Int!) {
    insert_cart_one(object: {
      product: $product, store: $store, user: $user, quantity: $quantity
    }) {
      id
    }
    stock_status_update: update_inventory(where:
      {product: {_eq: $product}, store:{_eq: $store}}, _set: {added_to_cart: $new_amount_in_cart}
    ) {
      affected_rows
    }
  }
`;