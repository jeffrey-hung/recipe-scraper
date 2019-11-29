from django.contrib import admin

# from .models import Question
from .models import Ingredient, Recipe, RecipeIngredient, UserIngredient, FavouriteRecipe, Tag, RecipeTag

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    fk_name = "recipe"

class RecipeTagInline(admin.TabularInline):
    model = RecipeTag
    fk_name = "recipe"

class RecipeAdmin(admin.ModelAdmin):
    inlines = [
        RecipeIngredientInline,
        RecipeTagInline
    ]
admin.site.register(Ingredient)
admin.site.register(Recipe,RecipeAdmin)
admin.site.register(UserIngredient)
admin.site.register(RecipeIngredient)
admin.site.register(FavouriteRecipe)
admin.site.register(Tag)
admin.site.register(RecipeTag)
# Register your models here.