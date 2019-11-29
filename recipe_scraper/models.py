from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

class Ingredient(models.Model): 
    name = models.CharField(
        max_length=200, 
        primary_key=True,
    )

    def __str__(self):
        return self.name
    
      
class Recipe(models.Model): 
    name = models.CharField(
        max_length=300,
    )
    description = models.TextField()
    image = models.ImageField(
        upload_to = "recipe_images",
        default=None,
        blank=True,
        null=True,
    )
    def __str__(self):
        return self.name
    

class RecipeIngredient(models.Model): 
    recipe = models.ForeignKey(
        'Recipe',
        on_delete=models.CASCADE,
    )
    ingredient = models.ForeignKey(
        'Ingredient',
        on_delete=models.CASCADE,
    )
    quantity = models.CharField(max_length=50)

class UserIngredient(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    ingredient = models.ForeignKey(
        'Ingredient',
        on_delete=models.CASCADE,
    )
  
class FavouriteRecipe(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE
    )
    recipe = models.ForeignKey(
        'Recipe',
        on_delete=models.CASCADE
    )

class Tag(models.Model):
    name = models.CharField(
        max_length=60,
        primary_key=True,
    )
    
    def __str__(self):
        return self.name

class RecipeTag(models.Model):
    recipe = models.ForeignKey(
        'Recipe',
        on_delete=models.CASCADE,
    )
    tag = models.ForeignKey(
        'Tag',
        on_delete=models.CASCADE
    )