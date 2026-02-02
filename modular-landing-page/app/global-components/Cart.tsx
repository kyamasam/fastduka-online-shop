// Base cart component - theme-agnostic
export default function Cart() {
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {/* Cart items will be mapped here */}
      </div>
      <div className="cart-total">
        <span>Total:</span>
        <span>$0.00</span>
      </div>
      <button>Checkout</button>
    </div>
  );
}
