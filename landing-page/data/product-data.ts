const product_data = [
  {
    id: "6421258288fba3e101965dc3",
    sku: "FAB7SDVX44",
    img: "https://i.ibb.co/gg9yCwX/clothing-1.png",
    title: "Whitetails Women's Dress",
    slug: "whitetails-women's-dress",
    unit: "10pcs",
    imageURLs: [
      {
        color: {
          name: "Wine Berry",
          clrCode: "#642832",
        },
        img: "https://i.ibb.co/gg9yCwX/clothing-1.png",
      },
      {
        color: {
          name: "Wine Berry",
          clrCode: "#642832",
        },
        img: "https://i.ibb.co/tZFbTWQ/clothing-2.png",
      },
      {
        color: {
          name: "Dirty Blue",
          clrCode: "#307FA8",
        },
        img: "https://i.ibb.co/1JqwRnb/clothing-3.png",
      },
      {
        color: {
          name: "Dirty Blue",
          clrCode: "#307FA8",
        },
        img: "https://i.ibb.co/ngwgSt2/clothing-4.png",
      },
    ],
    parent: "Clothing",
    children: "Women's",
    price: 80,
    discount: 5,
    quantity: 10,
    brand: {
      name: "Legendary Whitetails",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "fashion",
    description:
      "PLENTY OF STORAGE: There are two chest pockets on this women's hooded flannel, making it easy to bring all your favorite things with you. VERSATILE: The Lumber Jane Hooded Flannel is a heavyweight shirt that you can wear open or snapped, depending on your mood. With it's jersey lined hood, it's as warm and comfortable as your favorite hoodie! RELAXED FIT: The women's hooded flannel was made with a relaxed fit for the days you want some room for layering or just want that extra bit of comfort. 100% SATISFACTION GUARANTEE: Designed in the USA, Legendary Whitetails is an American small business. We take pride in all our products. Love it or send it back!",
    additionalInformation: [
      {
        key: "GREAT FOR LAYERING",
        value: "Mini waffle fabric construction",
      },
      {
        key: "Colors",
        value: "Wine Berry , Dirty Blue",
      },
      {
        key: "LEGENDARY STYLING",
        value: "Cute keyhole notch neck with custom",
      },
      {
        key: "CUFF DETAILS",
        value: "Velvet details with lace trim on the cuffs",
      },
      {
        key: "FEMIMINE HEMLINE",
        value: "Fashionable curved hem",
      },
      {
        key: "Graphics Coprocessor",
        value: "Exynos 9611, Octa Core (4x2.3GHz + 4x1.7GHz)",
      },
      {
        key: "Wireless Type",
        value: "802.11a/b/g/n/ac, Bluetooth",
      },
    ],
    featured: false,
    sellCount: 1,
    tags: ["whitetails", "Clothing", "Women's"],
    sizes: [],
  },
  {
    id: "product1",
    sku: "RIBEYE10",
    img: "https://images.pexels.com/photos/2098110/pexels-photo-2098110.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Grass-Fed Ribeye Steak (10oz)",
    unit: "10oz",
    imageURLs: [
      {
        color: null,
        img: "https://www.pexels.com/photo/red-meat-with-chili-pepper-and-green-spies-65175/",
      },
    ],
    parent: "Meat",
    children: "Steaks",
    price: 80,
    discount: 5,
    quantity: 10,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Marbled to Perfection: This grass-fed ribeye steak boasts exceptional marbling for a juicy and flavorful dining experience. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Responsibly raised, grass-fed beef",
      },
      {
        key: "CUT",
        value: "Thick-cut ribeye for optimal grilling",
      },
      {
        key: "COOKING",
        value: "Perfect for grilling, pan-searing, or roasting",
      },
    ],
    featured: false,
    sellCount: 1,
    tags: ["grass-fed", "beef", "steak"],
    sizes: [],
  },
  {
    id: "product2",
    sku: "GROUNDBEEF1LB",
    img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Organic Ground Beef (1lb)",
    unit: "1lb",
    imageURLs: [
      {
        color: null,
        img: "https://www.pexels.com/photo/red-meat-with-chili-pepper-and-green-spies-65175/",
      },
    ],
    parent: "Meat",
    children: "Ground Meat",
    price: 65,
    discount: 10,
    quantity: 20,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Lean and Versatile: Our organic ground beef is perfect for burgers, meatballs, and chili. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Organic, grass-fed beef",
      },
      {
        key: "USE",
        value: "Ideal for burgers, meatballs, chili, and stir-fries",
      },
    ],
    featured: false,
    sellCount: 2,
    tags: ["organic", "beef", "ground meat"],
    sizes: [],
  },
  {
    id: "product3",
    sku: "CHKBREAST5",
    img: "https://images.pexels.com/photos/1860205/pexels-photo-1860205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Boneless Chicken Breast (5pc)",
    unit: "5 pieces",
    imageURLs: [
      {
        color: null,
        img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ],
    parent: "Poultry",
    children: "Chicken",
    price: 35,
    discount: 8,
    quantity: 30,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Lean and Versatile: Our boneless chicken breasts are perfect for grilling, baking, or sautéing. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Raised without antibiotics or hormones",
      },
      {
        key: "USE",
        value: "Ideal for grilling, baking, or sautéing",
      },
    ],
    featured: false,
    sellCount: 5,
    tags: ["chicken", "boneless", "breast"],
    sizes: [],
  },
  {
    id: "product4",
    sku: "PORKTENDERLOIN1LB",
    img: "https://images.pexels.com/photos/53148/shish-kebab-meat-skewer-vegetable-skewer-meat-products-53148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Pork Tenderloin (1lb)",
    unit: "1lb",
    imageURLs: [
      {
        color: null,
        img: "https://images.pexels.com/photos/53148/shish-kebab-meat-skewer-vegetable-skewer-meat-products-53148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ],
    parent: "Pork",
    children: "Pork Cuts",
    price: 45,
    discount: 7,
    quantity: 25,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Tender and Flavorful: Our pork tenderloin is perfect for grilling, roasting, or pan-searing. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Humanely raised pork",
      },
      {
        key: "USE",
        value: "Ideal for grilling, roasting, or pan-searing",
      },
    ],
    featured: false,
    sellCount: 3,
    tags: ["pork", "tenderloin", "cut"],
    sizes: [],
  },
  {
    id: "product5",
    sku: "LAMBCCHOPS4",
    img: "https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Lamb Chops (4pc)",
    unit: "4 pieces",
    imageURLs: [
      {
        color: null,
        img: "https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    parent: "Lamb",
    children: "Lamb Cuts",
    price: 60,
    discount: 12,
    quantity: 15,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Flavorful and Tender: Our lamb chops are perfect for grilling or pan-searing. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Grass-fed lamb",
      },
      {
        key: "USE",
        value: "Ideal for grilling or pan-searing",
      },
    ],
    featured: false,
    sellCount: 4,
    tags: ["lamb", "chops", "cut"],
    sizes: [],
  },
  {
    id: "product3",
    sku: "CHKBREAST5",
    img: "https://images.pexels.com/photos/1860205/pexels-photo-1860205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Boneless Chicken Breast (5pc)",
    unit: "5 pieces",
    imageURLs: [
      {
        color: null,
        img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ],
    parent: "Poultry",
    children: "Chicken",
    price: 35,
    discount: 8,
    quantity: 30,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Lean and Versatile: Our boneless chicken breasts are perfect for grilling, baking, or sautéing. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Raised without antibiotics or hormones",
      },
      {
        key: "USE",
        value: "Ideal for grilling, baking, or sautéing",
      },
    ],
    featured: false,
    sellCount: 5,
    tags: ["chicken", "boneless", "breast"],
    sizes: [],
  },
  {
    id: "product4",
    sku: "PORKTENDERLOIN1LB",
    img: "https://images.pexels.com/photos/53148/shish-kebab-meat-skewer-vegetable-skewer-meat-products-53148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Pork Tenderloin (1lb)",
    unit: "1lb",
    imageURLs: [
      {
        color: null,
        img: "https://images.pexels.com/photos/53148/shish-kebab-meat-skewer-vegetable-skewer-meat-products-53148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ],
    parent: "Pork",
    children: "Pork Cuts",
    price: 45,
    discount: 7,
    quantity: 25,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Tender and Flavorful: Our pork tenderloin is perfect for grilling, roasting, or pan-searing. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Humanely raised pork",
      },
      {
        key: "USE",
        value: "Ideal for grilling, roasting, or pan-searing",
      },
    ],
    featured: true,
    sellCount: 3,
    tags: ["pork", "tenderloin", "cut"],
    sizes: [],
  },
  {
    id: "product5",
    sku: "LAMBCCHOPS4",
    img: "https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Lamb Chops (4pc)",
    unit: "4 pieces",
    imageURLs: [
      {
        color: null,
        img: "https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    parent: "Lamb",
    children: "Lamb Cuts",
    price: 60,
    discount: 12,
    quantity: 15,
    brand: {
      name: "Your Ranch Name",
    },
    category: {
      name: "Meat",
    },
    status: "in-stock",
    reviews: [],
    productType: "meat",
    description:
      "Flavorful and Tender: Our lamb chops are perfect for grilling or pan-searing. 100% Satisfaction Guarantee: We stand behind the quality of our meat. Love it or get your money back!",
    additionalInformation: [
      {
        key: "SOURCED",
        value: "Grass-fed lamb",
      },
      {
        key: "USE",
        value: "Ideal for grilling or pan-searing",
      },
    ],
    featured: true,
    sellCount: 4,
    tags: ["lamb", "chops", "cut"],
    sizes: [],
  },
];

export default product_data;
