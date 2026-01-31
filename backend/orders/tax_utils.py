"""
Tax calculation utilities for orders.
Handles tax calculations for products with different tax configurations.
"""
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List
from products.models import Product


def calculate_item_tax(
    product: Product,
    quantity: int,
    purchase_price: Decimal = None
) -> Dict[str, Decimal]:
    """
    Calculate tax for a single order item.

    Args:
        product: Product instance
        quantity: Quantity of the product
        purchase_price: Optional custom price (for POS). If not provided, uses product selling_price

    Returns:
        Dictionary containing:
            - price_per_unit: Price per unit used for calculation
            - price_includes_tax: Whether the price includes tax
            - tax_rate: Tax rate applied
            - tax_amount: Total tax amount for the item
            - total_before_tax: Total before tax
            - total_after_tax: Total after tax
            - tax_percent: Tax percentage (for display)
    """
    # Use custom purchase_price if provided, otherwise use product selling_price
    price_per_unit = purchase_price if purchase_price is not None else Decimal(str(product.selling_price))

    # Convert to Decimal for precise calculations
    quantity_decimal = Decimal(str(quantity))
    tax_rate = product.tax_rate if product.is_taxable else Decimal('0')

    # Scenario 1: Product is not taxable
    if not product.is_taxable:
        total_before_tax = (price_per_unit * quantity_decimal).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        return {
            'price_per_unit': price_per_unit,
            'price_includes_tax': False,
            'tax_rate': Decimal('0'),
            'tax_amount': Decimal('0.00'),
            'total_before_tax': total_before_tax,
            'total_after_tax': total_before_tax,
            'tax_percent': 0.0
        }

    # Scenario 2: Product is taxable and price includes tax
    if product.price_includes_tax:
        # Extract the pre-tax price from the tax-inclusive price
        price_before_tax_per_unit = (price_per_unit / (Decimal('1') + tax_rate)).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        tax_amount_per_unit = price_per_unit - price_before_tax_per_unit

        total_before_tax = (price_before_tax_per_unit * quantity_decimal).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        total_after_tax = (price_per_unit * quantity_decimal).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        tax_amount = (tax_amount_per_unit * quantity_decimal).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )

    # Scenario 3: Product is taxable and price excludes tax
    else:
        price_before_tax_per_unit = price_per_unit
        tax_amount_per_unit = (price_before_tax_per_unit * tax_rate).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )

        total_before_tax = (price_before_tax_per_unit * quantity_decimal).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        tax_amount = (tax_amount_per_unit * quantity_decimal).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        total_after_tax = total_before_tax + tax_amount

    return {
        'price_per_unit': price_per_unit,
        'price_includes_tax': product.price_includes_tax,
        'tax_rate': tax_rate,
        'tax_amount': tax_amount,
        'total_before_tax': total_before_tax,
        'total_after_tax': total_after_tax,
        'tax_percent': float(tax_rate * 100)
    }


def calculate_order_tax(items: List[Dict]) -> Dict[str, Decimal]:
    """
    Calculate tax for multiple order items.

    Args:
        items: List of dictionaries, each containing:
            - product: Product instance
            - quantity: int
            - purchase_price: Decimal (optional)

    Returns:
        Dictionary containing:
            - items: List of item tax calculations
            - tax_total: Total tax for all items
            - total_before_tax: Total before tax for all items
            - total_after_tax: Total after tax for all items
    """
    item_calculations = []
    tax_total = Decimal('0.00')
    total_before_tax = Decimal('0.00')
    total_after_tax = Decimal('0.00')

    for item in items:
        product = item['product']
        quantity = item['quantity']
        purchase_price = item.get('purchase_price')

        # Calculate tax for this item
        item_tax = calculate_item_tax(product, quantity, purchase_price)

        # Add product details to the result
        item_tax['product_id'] = product.id
        item_tax['product_name'] = product.name
        item_tax['quantity'] = quantity

        item_calculations.append(item_tax)

        # Accumulate totals
        tax_total += item_tax['tax_amount']
        total_before_tax += item_tax['total_before_tax']
        total_after_tax += item_tax['total_after_tax']

    return {
        'items': item_calculations,
        'tax_total': tax_total.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
        'total_before_tax': total_before_tax.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
        'total_after_tax': total_after_tax.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    }


def validate_purchase_price(product: Product, purchase_price: Decimal) -> None:
    """
    Validate that purchase_price is not less than (selling_price - allowable_discount).

    Args:
        product: Product instance
        purchase_price: The price to validate

    Raises:
        ValueError: If purchase_price is below the minimum allowed price
    """
    selling_price = Decimal(str(product.selling_price))
    allowable_discount = Decimal(str(product.allowable_discount)) if product.allowable_discount else Decimal('0')

    minimum_price = selling_price - allowable_discount

    if purchase_price < minimum_price:
        raise ValueError(
            f"Purchase price {purchase_price} is below minimum allowed price {minimum_price} "
            f"(selling price: {selling_price}, allowable discount: {allowable_discount})"
        )
