from django.core.management.base import BaseCommand
from products.models import Category


class Command(BaseCommand):
    help = 'Generate slugs for categories that do not have one'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Regenerate slugs for all categories (even those that already have slugs)',
        )

    def handle(self, *args, **options):
        regenerate_all = options.get('all', False)

        if regenerate_all:
            categories = Category.objects.all()
            self.stdout.write(self.style.WARNING('Regenerating slugs for all categories...'))
        else:
            from django.db.models import Q
            categories = Category.objects.filter(Q(slug='') | Q(slug__isnull=True))
            self.stdout.write(self.style.WARNING('Generating slugs for categories without slugs...'))

        updated_count = 0
        for category in categories:
            old_slug = category.slug
            category.slug = category.generate_unique_slug()
            category.save()
            updated_count += 1

            if old_slug:
                self.stdout.write(
                    self.style.SUCCESS(f'Updated: "{category.name}" - Slug changed from "{old_slug}" to "{category.slug}"')
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'Created: "{category.name}" - Slug: "{category.slug}"')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully processed {updated_count} category(ies)')
        )
