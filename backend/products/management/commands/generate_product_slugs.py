from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = 'Generate slugs for products that do not have one'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Regenerate slugs for all products (even those that already have slugs)',
        )

    def handle(self, *args, **options):
        regenerate_all = options.get('all', False)

        if regenerate_all:
            products = Product.objects.all()
            self.stdout.write(self.style.WARNING('Regenerating slugs for all products...'))
        else:
            products = Product.objects.filter(slug='')
            self.stdout.write(self.style.WARNING('Generating slugs for products without slugs...'))

        updated_count = 0
        for product in products:
            old_slug = product.slug
            product.slug = product.generate_unique_slug()
            product.save()
            updated_count += 1

            if old_slug:
                self.stdout.write(
                    self.style.SUCCESS(f'Updated: "{product.name}" - Slug changed from "{old_slug}" to "{product.slug}"')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'Created: "{product.name}" - Slug: "{product.slug}"')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully processed {updated_count} product(s)')
        )
