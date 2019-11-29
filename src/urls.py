"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from recipe_scraper import views
from django.conf.urls import url, static
from . import settings

urlpatterns = [
    path('recipe_scraper/', include('recipe_scraper.urls')),
    path(r'admin/', admin.site.urls),
    url(r'^api/ingredient/$', views.ingredient_list),
    url(r'^api/recipe/$', views.recipe_list),
    url(r'^api/login/$', views.api_login),
    url(r'^api/register/$', views.api_register),
    url(r'^api/password_reset/$', views.api_password_reset),
    url(r'^api/search_ingredients/$', views.api_ingredient_search),
    url(r'^api/add_ingredient/$', views.api_add_ingredient),
    url(r'^api/ingredient_save/$', views.api_ingredient_save),
    url(r'^api/ingredient_suggestion/$', views.api_ingredient_suggestion),
    url(r'^api/recipe_suggestion/$', views.api_recipe_suggestion),
    url(r'^api/user_ingredient/$', views.api_user_ingredient),
    url(r'^api/shopping_list/$', views.api_generate_shopping_list),
    url(r'^api/favourite_recipe/$', views.api_favourite_recipe),
    url(r'^api/favourite_list/$', views.api_favourite_list),
    url(r'^api/unfavourite_recipe/$', views.api_unfavourite_recipe),
    url(r'^api/change_password/$', views.api_change_password),
    url(r'^api/change_email/$', views.api_change_email),
    url(r'^api/tag_list/$', views.api_tag_list),
    url(r'^api/tag_search/$', views.api_tag_search),
    # url(r'^api/create_recipe/$', views.create_recipe),
    url(r'^api/create_recipe/$', views.RecipeCreateView.as_view()),
    url(r'^api/recipe_ingredient/$', views.recipe_ingredient),
    
]
urlpatterns += static.static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
