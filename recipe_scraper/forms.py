from django import forms
from django.forms import ModelForm
from django.forms.models import inlineformset_factory
from .models import Ingredient, Recipe, RecipeIngredient, UserIngredient, Tag, RecipeTag, FavouriteRecipe

# https://docs.djangoproject.com/en/2.2/topics/forms/
# https://docs.djangoproject.com/en/2.2/topics/forms/modelforms/


class RecipeForm(ModelForm):
    class Meta:
        model = Recipe
        fields = ['name', 'description', 'image']

class IngredientForm(ModelForm):
    class Meta:
        model = Ingredient
        fields = ['name']

class RecipeIngredientForm(ModelForm):
    class Meta:
        model = RecipeIngredient
        fields = ['recipe', 'ingredient', 'quantity']

class UserIngredientForm(ModelForm):
    class Meta:
        model = UserIngredient
        fields = ['user', 'ingredient']

class TagForm(ModelForm):
    class Meta:
        model = Tag
        fields = ['name']

class RecipeTagForm(ModelForm):
    class Meta:
        model = RecipeTag
        fields = ['recipe', 'tag']

class FavouriteRecipeForm(ModelForm):
    class Meta:
        model = FavouriteRecipe
        fields = ['user', 'recipe']
    
        
RecipeIngredientFormSet = inlineformset_factory(Recipe, RecipeIngredient, form=RecipeIngredientForm, fields=['ingredient', 'quantity'], extra=1, can_delete=True)
RecipeTagFormSet = inlineformset_factory(Recipe, RecipeTag, form=RecipeTagForm, fields=['tag'], extra=1, can_delete=True)