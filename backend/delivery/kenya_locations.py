from decimal import Decimal


# Counties are presented as cities in the checkout. The number is Kenya's
# official county code and doubles as a stable display order.
KENYA_COUNTIES = (
    (1, 'Mombasa'), (2, 'Kwale'), (3, 'Kilifi'), (4, 'Tana River'),
    (5, 'Lamu'), (6, 'Taita-Taveta'), (7, 'Garissa'), (8, 'Wajir'),
    (9, 'Mandera'), (10, 'Marsabit'), (11, 'Isiolo'), (12, 'Meru'),
    (13, 'Tharaka-Nithi'), (14, 'Embu'), (15, 'Kitui'), (16, 'Machakos'),
    (17, 'Makueni'), (18, 'Nyandarua'), (19, 'Nyeri'), (20, 'Kirinyaga'),
    (21, "Murang'a"), (22, 'Kiambu'), (23, 'Turkana'), (24, 'West Pokot'),
    (25, 'Samburu'), (26, 'Trans Nzoia'), (27, 'Uasin Gishu'),
    (28, 'Elgeyo-Marakwet'), (29, 'Nandi'), (30, 'Baringo'),
    (31, 'Laikipia'), (32, 'Nakuru'), (33, 'Narok'), (34, 'Kajiado'),
    (35, 'Kericho'), (36, 'Bomet'), (37, 'Kakamega'), (38, 'Vihiga'),
    (39, 'Bungoma'), (40, 'Busia'), (41, 'Siaya'), (42, 'Kisumu'),
    (43, 'Homa Bay'), (44, 'Migori'), (45, 'Kisii'), (46, 'Nyamira'),
    (47, 'Nairobi'),
)

NAIROBI_SUB_COUNTIES = (
    ('Dagoretti North', '300.00'), ('Dagoretti South', '300.00'),
    ('Embakasi Central', '300.00'), ('Embakasi East', '350.00'),
    ('Embakasi North', '350.00'), ('Embakasi South', '300.00'),
    ('Embakasi West', '300.00'), ('Kamukunji', '250.00'),
    ('Kasarani', '350.00'), ('Kibra', '250.00'),
    ("Lang'ata", '300.00'), ('Makadara', '250.00'),
    ('Mathare', '250.00'), ('Roysambu', '350.00'),
    ('Ruaraka', '300.00'), ('Starehe', '200.00'),
    ('Westlands', '250.00'),
)

MOMBASA_SUB_COUNTIES = (
    ('Changamwe', '300.00'), ('Jomvu', '350.00'), ('Kisauni', '300.00'),
    ('Likoni', '350.00'), ('Mvita', '200.00'), ('Nyali', '250.00'),
)


def locations_for_county(county_name):
    """Return (location name, fee) pairs for a seeded county."""
    if county_name == 'Nairobi':
        return tuple((name, Decimal(fee)) for name, fee in NAIROBI_SUB_COUNTIES)
    if county_name == 'Mombasa':
        return tuple((name, Decimal(fee)) for name, fee in MOMBASA_SUB_COUNTIES)
    return ((county_name, Decimal('300.00')),)
