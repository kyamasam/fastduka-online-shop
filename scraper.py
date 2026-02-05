
import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urlparse

def scrape_and_add_products(num_products_to_add=6):
    # Scrape the website
    url = "https://www.neemalivestock.co.ke/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Find the "BEEF" product section
    beef_section_h3 = soup.find("h3", string=lambda text: text and "BEEF" in text)
    if not beef_section_h3:
        print("BEEF section not found on the page.")
        return

    beef_product_card = beef_section_h3.find_parent("div", class_="col-md-4")
    if not beef_product_card:
        print("BEEF product card not found.")
        return

    product_list_ul = beef_product_card.find("ul")
    if not product_list_ul:
        print("Product list (ul) not found in BEEF section.")
        return

    product_image_tag = beef_product_card.find("img")
    base_image_url = product_image_tag["src"] if product_image_tag else None

    if not base_image_url:
        print("No base image found for BEEF products.")
        return

    products_added_count = 0
    for i, product_item_li in enumerate(product_list_ul.find_all("li")):
        if products_added_count >= num_products_to_add:
            break

        product_name = product_item_li.text.strip()
        product_description = product_name  # Use name as description

        print(f"Processing product: {product_name}")

        # Generate a unique SKU
        sku = f"BEEF-{i+1:03d}"

        # Download the image
        # Using the base image URL for all products in this category for simplicity
        image_response = requests.get(base_image_url)
        parsed_url = urlparse(base_image_url)
        image_name = os.path.basename(parsed_url.path)
        
        # Add a unique identifier to the image name to avoid overwriting if downloaded multiple times
        unique_image_name = f"{os.path.splitext(image_name)[0]}_{i}{os.path.splitext(image_name)[1]}"

        with open(unique_image_name, "wb") as f:
            f.write(image_response.content)
        print(f"Downloaded image: {unique_image_name}")

        # Prepare data for API call
        api_url = "http://localhost:8000/api/product/"
        headers = {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwMTE1MzY5LCJpYXQiOjE3NzAxMDA5NjksImp0aSI6ImNjMDQwZjVmMjQzNzQ0YjRiMTk2Y2EzMWVjNDgwYzE2IiwidXNlcl9pZCI6MX0.n6qtRuIaVcIA8kzfi5OmvOlsNv0XKhIr1-yjmlhWuCc"
        }
        data = {
            "name": product_name,
            "sku": sku,
            "description": product_description,
            "selling_price": "1000", # Placeholder price
            "buying_price": "500", # Placeholder price
            "category_id": "1", # Assuming category ID 1 is appropriate for meat products
            "is_taxable": "true",
            "price_includes_tax": "true",
            "tax_rate": "0.1600",
            "product_type_id": "1" # Assuming product type ID 1 is appropriate for food/beverages
        }
        files = {
            "primary_photo": (unique_image_name, open(unique_image_name, "rb"), "image/jpeg")
        }

        # Make the API call
        try:
            api_response = requests.post(api_url, headers=headers, data=data, files=files)
            print(f"API Response Status Code for '{product_name}': {api_response.status_code}")
            print(f"API Response for '{product_name}': {api_response.json()}")
            if api_response.status_code == 201:
                products_added_count += 1
        except requests.exceptions.RequestException as e:
            print(f"Error making API call for '{product_name}': {e}")

        # Clean up the downloaded image
        os.remove(unique_image_name)

    print(f"Finished. Added {products_added_count} new products.")

if __name__ == "__main__":
    scrape_and_add_products(num_products_to_add=6) # Add 6 more products
