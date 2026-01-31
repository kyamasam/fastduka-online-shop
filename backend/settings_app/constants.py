"""
Constants for site settings.

Menu Structure Documentation:
-----------------------------
The menu_structure field stores navigation menus as a JSON array.
Each menu item has the following properties:

{
    "name": str,        # Display text for the menu item
    "icon": str,        # Lucide icon name (e.g., "home", "shopping-bag")
    "link": str,        # URL path (internal like "/shop" or external like "https://...")
    "is_external": bool,# If true, link opens in new tab
    "order": int,       # Position in the menu (0-indexed)
    "children": []      # Nested array of submenu items (same structure)
}

Example:
--------
[
    {
        "name": "Home",
        "icon": "home",
        "link": "/",
        "is_external": false,
        "order": 0,
        "children": []
    },
    {
        "name": "Shop",
        "icon": "shopping-bag",
        "link": "/shop",
        "is_external": false,
        "order": 1,
        "children": [
            {
                "name": "All Products",
                "icon": "package",
                "link": "/shop",
                "is_external": false,
                "order": 0,
                "children": []
            }
        ]
    }
]
"""

DEFAULT_MENU_STRUCTURE = [
    {
        "name": "Home",
        "icon": "home",
        "link": "/",
        "is_external": False,
        "order": 0,
        "children": []
    },
    {
        "name": "Shop",
        "icon": "shopping-bag",
        "link": "/shop",
        "is_external": False,
        "order": 1,
        "children": [
            {
                "name": "All Products",
                "icon": "package",
                "link": "/shop",
                "is_external": False,
                "order": 0,
                "children": []
            },
            {
                "name": "Categories",
                "icon": "grid-3x3",
                "link": "/shop/categories",
                "is_external": False,
                "order": 1,
                "children": []
            },
            {
                "name": "On Sale",
                "icon": "percent",
                "link": "/shop?on_sale=true",
                "is_external": False,
                "order": 2,
                "children": []
            }
        ]
    },
    {
        "name": "Blog",
        "icon": "newspaper",
        "link": "/blogs",
        "is_external": False,
        "order": 2,
        "children": []
    },
    {
        "name": "Cart",
        "icon": "shopping-cart",
        "link": "/cart",
        "is_external": False,
        "order": 3,
        "children": []
    },
    {
        "name": "Orders",
        "icon": "clipboard-list",
        "link": "/orders",
        "is_external": False,
        "order": 4,
        "children": []
    }
]
