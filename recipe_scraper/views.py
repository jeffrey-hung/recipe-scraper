from django.shortcuts import render
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from django.http import HttpResponse, HttpResponseRedirect, QueryDict
from django.shortcuts import render, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from rest_framework import viewsets
from .serializers import IngredientSerializer, RecipeSerializer, RecipeIngredientsSerializer
from .models import Ingredient, Recipe, RecipeIngredient, UserIngredient, FavouriteRecipe, Tag, RecipeTag
from .forms import RecipeForm, IngredientForm, RecipeIngredientForm
from django.core.mail import send_mail
from django.conf import settings
from django.views.generic import CreateView
import json
import random
import string

class recipe_scraper_view(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer
    queryset = Ingredient.objects.all()

# #based on http://kevindias.com/writing/django-class-based-views-multiple-inline-formsets/
class RecipeCreateView(APIView):
    model = Recipe
    form_class = RecipeForm
    recipe_ingredient_form_class = RecipeIngredientForm

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests, instantiating a form instance and its inline
        formsets with the passed POST variables and then checking them for
        validity.
        """

        self.object = None
        form = self.form_class(request.data)
        if (form.is_valid()):
            ingredients = request.data['ingredients']
            ingredients = json.loads(ingredients)
            tags = request.data['tags']
            tags = json.loads(tags)
            print(tags)
            new_recipe = Recipe()
            new_recipe.name = request.data['name']
            new_recipe.description = request.data['description']
            new_recipe.image = request.data['image']
            new_recipe.save()
            for ingredient in ingredients:
                print(ingredient)
                recipeIngredient = RecipeIngredient()
                recipeIngredient.recipe = new_recipe
                recipeIngredient.ingredient = Ingredient(name= ingredient["ingredient"])
                recipeIngredient.quantity = ingredient["quantity"]
                recipeIngredient.save()
            for tag in tags:
                recipeTag = RecipeTag(recipe=new_recipe, tag=Tag(tag["name"]))
                recipeTag.save()

            return Response(status=status.HTTP_200_OK)
        else:
            return self.form_invalid()

    def form_valid(self, form, ingredients):
        for ingredient in ingredients:
            ingredient['recipe'] = self.object.pk
            recipeIngredientForm = self.recipe_ingredient_form_class(ingredient)
            recipeIngredientForm.save()
        return Response(status=status.HTTP_200_OK)

    def form_invalid(self):
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_add_ingredient(request):
    if request.method == "POST":
        ingredient = request.data['ingredients']
        print(ingredient)
        if Ingredient.objects.filter(name=ingredient).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:            
            Ingredient.objects.create(name=ingredient)
            return Response(status=status.HTTP_200_OK)

        

@api_view(['GET'])
def ingredient_list(request):
    if request.method == 'GET':
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients,context={'request':request},many = True)
        return Response({'data': serializer.data,})

@api_view(['GET', 'POST'])
def recipe_list(request):
    if request.method == 'GET':
        data = []
        nextPage = 1
        prevPage = 1
        recipes = Recipe.objects.all()
        page = request.GET.get('page',1)
        paginator = Paginator(recipes,10)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)
        serializer = RecipeSerializer(data,context={'request':request},many = True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            prevPage = data.previous_page_number()
        print(serializer.data)
        return Response({'data': serializer.data, 'count':paginator.count, 'numpages': paginator.num_pages, 'nextlink': '/api/recipe/?page='+str(nextPage), 'prevlink': '/api/recipe/?page=' + str(prevPage)})


@api_view(['POST'])
def api_login(request):
    if request.method == 'POST':
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_authenticated:
                print(user)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_register(request):
    if request.method == 'POST':
        print(request.data)
        email = request.data['email']
        username = request.data['username']
        password = request.data['password']
        if User.objects.filter(username=username).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        User.objects.create_user(email=email, username=username, password=password)
        user = authenticate(request, username=username, password=password, email=email)
        login(request, user)
        return Response(status=status.HTTP_201_CREATED)

@api_view(['POST'])
def logout_view(request):
    if request.user.is_authenticated():
        logout(request)


@api_view(['POST'])
def api_password_reset(request):
    if request.method == 'POST':
        email = request.data['email']
        password = randomStringDigits(8)
        message = "This is your new password: " + password
        user = User.objects.filter(email__exact=email).first()
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]
        if user is not None:
            user.set_password(password)
            print(password)
            user.save()
            send_mail('New Password', message, email_from, recipient_list, fail_silently=False)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


def randomStringDigits(stringLength=8):
    """Generate a random string of letters and digits """
    lettersAndDigits = string.ascii_letters + string.digits
    return ''.join(random.choice(lettersAndDigits) for i in range(stringLength))

@api_view(['POST'])
def api_change_password(request):
    if request.method == 'POST':
        user = request.data['user']
        password = request.data['password']
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            userObject.set_password(password)
            userObject.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_change_email(request):
    if request.method == 'POST':
        user = request.data['user']
        email = request.data['email']
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            userObject.email = email
            userObject.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def api_ingredient_search(request):
    if request.method == "POST":
        ingredients = request.data['ingredients']
        recipedict = {}
        listofrecipes = []
        recipes = Recipe.objects.all().values_list("name")
        for recipe in recipes:
            print(recipe)
            ingredientsInRecipe = RecipeIngredient.objects.filter(recipe=Recipe(name=recipe)).values_list('ingredient', flat=True)
            intersection = set(ingredients).intersection(ingredientsInRecipe)
            if (len(ingredientsInRecipe) == 0):
                recipedict[recipe] = 1
            else:
                recipedict[recipe] = len(intersection)/len(ingredientsInRecipe)
        for key, value in sorted(recipedict.items(), key=lambda x:x[1], reverse=True):
            listofrecipes.append(key)
        return Response(status=status.HTTP_200_OK, data={"recipes": listofrecipes})


@api_view(['POST'])
def api_user_ingredient(request):
    if request.method == "POST":
        user = request.data['user']
        print(user)
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            ingredients = UserIngredient.objects.filter(user=userObject).values('ingredient')
            ingredientList = []
            for ingredient in ingredients:
                ingredientList.append(ingredient['ingredient'])
            return Response(status=status.HTTP_200_OK, data={'ingredients':ingredientList})
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def api_ingredient_save(request):
    if request.method == "POST":
        print("check")
        ingredients = request.data['ingredients']
        user = request.data['user']
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            # Deletes all useringredients for the user
            # Commenting it out just adds any new user ingredients
            UserIngredient.objects.filter(user=userObject).delete()
            for ingredient in ingredients:
                try:
                    ingredientObject = Ingredient.objects.get(name=ingredient)
                except Ingredient.DoesNotExist:
                    ingredientObject = Ingredient.objects.create(name=ingredient)
                try:
                    test = UserIngredient.objects.get(user=userObject, ingredient=ingredientObject)
                except UserIngredient.DoesNotExist:
                    UserIngredient.objects.create(user=userObject, ingredient=ingredientObject)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET', 'POST'])
def api_favourite_recipe(request):
    if request.method == "POST":
        user = request.data['user']
        recipe = request.data['recipe']
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            if Recipe.objects.filter(name=recipe).exists():
                recipeObject = Recipe.objects.get(name=recipe)
                try:
                    test = FavouriteRecipe.objects.get(user=userObject, recipe=recipeObject)
                except FavouriteRecipe.DoesNotExist:
                    FavouriteRecipe.objects.create(user=userObject, recipe=recipeObject)
                return Response(status.HTTP_200_OK) 
        else:
            return Response(status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_favourite_list(request):
    if request.method == "POST":
        user = request.data['user']
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            data = FavouriteRecipe.objects.filter(user=userObject).values('recipe')
            recipeList = []
            for recipe in data:
                actual_recipe = Recipe.objects.filter(pk=recipe['recipe'])
                recipeList.append(actual_recipe.first())
            serializer = RecipeSerializer(recipeList,context={'request':request},many = True)
            return Response(data={'recipes':serializer.data})
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def api_unfavourite_recipe(request):
    if request.method == "POST":
        user = request.data['user']
        recipe = request.data['recipe']
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            if Recipe.objects.filter(name=recipe).exists():
                recipeObject = Recipe.objects.get(name=recipe)
                FavouriteRecipe.objects.filter(user=userObject, recipe=recipeObject).delete()
                return Response(status.HTTP_200_OK) 
        else:
            return Response(status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_tag_search(request):
    if request.method == "POST":
        tags = request.data['tags']
        recipe_list = []
        recipe_dict = {}
        for tag in tags:
            recipes = RecipeTag.objects.filter(tag=tag).values('recipe')
            for key in recipes.values():
                recipe = Recipe.objects.get(pk=key['recipe_id'])
                if recipe.name not in recipe_dict:
                    recipe_dict[recipe.name] = 1
                else:
                    recipe_dict[recipe.name] += 1
        for key, value in sorted(recipe_dict.items(), key=lambda x:x[1], reverse=True):
            recipe_list.append(key)
        return Response(status=status.HTTP_200_OK, data={"recipes": recipe_list})


@api_view(['GET'])
def api_tag_list(request):
    if request.method == "GET":
        tag_list = Tag.objects.all().values_list('name', flat=True)
        i = 0
        tag_data = []
        for tag in tag_list:
            tag_dict = {"id":i, "name":tag}
            tag_data.append(tag_dict)
            i += 1
        return Response(data={'tags':tag_data})


@api_view(['POST'])
def api_generate_shopping_list(request):
    if request.method == "POST":
        recipe = request.data['recipe']
        user = request.data['user']
        message = "This is your shopping list for " + recipe + ":\n"
        if User.objects.filter(username=user).exists():
            userObject = User.objects.get(username=user)
            email = userObject.email
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [email]
            if Recipe.objects.filter(name=recipe).exists():
                recipeObject = Recipe.objects.get(name=recipe)
                shoppingList = []
                listofingredients = RecipeIngredient.objects.filter(recipe=recipeObject).values('ingredient')
                ingredientsonhand = UserIngredient.objects.filter(user=userObject).values('ingredient')
                for ingredient in listofingredients:
                    if ingredient not in ingredientsonhand:
                        shoppingList.append(ingredient['ingredient'])
                for item in shoppingList:
                    message += "* " + item + "\n"
                send_mail('New Password', message, email_from, recipient_list, fail_silently=False)
                return Response(status=status.HTTP_200_OK, data={"recipe": shoppingList})
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def api_ingredient_suggestion(request):
    if request.method == "POST":
        user = request.data['user']
        if User.objects.filter(username=user).exists():
            userObject=User.objects.get(username=user)
            temp = UserIngredient.objects.filter(user=userObject).values_list('ingredient', flat=True)
            recipedict = {}
            listofrecipes = []
            recipes = Recipe.objects.all()
            for recipe in recipes:
                ingredientsInRecipe = RecipeIngredient.objects.filter(recipe=recipe).values_list('ingredient', flat=True)
                intersection = temp.intersection(ingredientsInRecipe)
                if (len(ingredientsInRecipe) == 0):
                    recipedict[recipe] = 1
                else:
                    recipedict[recipe] = len(intersection)/len(ingredientsInRecipe)
            for key, value in sorted(recipedict.items(), key=lambda x:x[1], reverse=True):
                listofrecipes.append(key)
            data = []
            nextPage = 1
            prevPage = 1
            recipes = listofrecipes
            page = request.POST.get('page',1)
            paginator = Paginator(recipes,3)
            try:
                data = paginator.page(page)
            except PageNotAnInteger:
                data = paginator.page(1)
            except EmptyPage:
                data = paginator.page(paginator.num_pages)
            serializer = RecipeSerializer(data,context={'request':request},many = True)
            if data.has_next():
                nextPage = data.next_page_number()
            if data.has_previous():
                prevPage = data.previous_page_number()
            return Response({'data': serializer.data, 'count':paginator.count, 'numpages': paginator.num_pages, 'nextlink': '/api/recipe/?page='+str(nextPage), 'prevlink': '/api/recipe/?page=' + str(prevPage)})

@api_view(['POST'])
def api_recipe_suggestion(request):
    if request.method == "POST":
        user = request.data['user']
        if User.objects.filter(username=user).exists():
            userObject=User.objects.get(username=user)
            temp = FavouriteRecipe.objects.filter(user=userObject).values_list('recipe', flat=True)
            tag_list = []
            for recipe in temp:
                tags = RecipeTag.objects.filter(recipe=recipe).values_list('tag', flat=True)
                tag_list.extend(tags)
            recipedict = {}
            listofrecipes = []
            recipes = Recipe.objects.exclude(id__in=temp)
            for recipe in recipes:
                tagsInRecipe = RecipeTag.objects.filter(recipe=recipe).values_list('tag', flat=True)
                intersection = set(tag_list).intersection(tagsInRecipe)
                recipedict[recipe] = len(intersection)
            for key, value in sorted(recipedict.items(), key=lambda x:x[1], reverse=True):
                listofrecipes.append(key)
            data = []
            nextPage = 1
            prevPage = 1
            recipes = listofrecipes
            page = request.POST.get('page',1)
            paginator = Paginator(recipes,3)
            try:
                data = paginator.page(page)
            except PageNotAnInteger:
                data = paginator.page(1)
            except EmptyPage:
                data = paginator.page(paginator.num_pages)
            serializer = RecipeSerializer(data,context={'request':request},many = True)
            if data.has_next():
                nextPage = data.next_page_number()
            if data.has_previous():
                prevPage = data.previous_page_number()
            return Response({'data': serializer.data, 'count':paginator.count, 'numpages': paginator.num_pages, 'nextlink': '/api/recipe/?page='+str(nextPage), 'prevlink': '/api/recipe/?page=' + str(prevPage)})

@api_view(['GET','POST'])
def recipe_ingredient(request):
    if request.method == "POST":
        recipe = Recipe.objects.filter(name = request.data['recipe'])
        s = 0
        for r in recipe:
            s = RecipeSerializer(r)
            ingredients = RecipeIngredient.objects.filter(recipe = r)
            serializer = RecipeIngredientsSerializer(ingredients,context={'request':request},many=True)
        return Response({'ingredients': serializer.data, 'recipe':s.data})
