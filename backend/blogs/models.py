from django.db import models
from users.models import UtilColumnsModel, User
from django_tiptap.fields import TipTapTextField
from django.utils.text import slugify

class BlogCategory(UtilColumnsModel):
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}"



class Blog(UtilColumnsModel):
    title = models.CharField(max_length=500)
    slug = models.SlugField(max_length=500, unique=True, blank=True) 
    cover_photo = models.ImageField(null=True)
    content = TipTapTextField()
    author = models.ForeignKey(User,on_delete=models.CASCADE , related_name='blogs')
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name='blogs')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

