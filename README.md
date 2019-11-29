# Recipe_Scraper
For python dependencies to set up in virtual environment look at requirements.txt

using:
postgres 11.5
node v12.13.0

run this command to make a superuser in django

```
python manage.py createsuperuser
```
superuser details for django:

admin

password

test@hotmail.com

and then to look at the admin page go to localhost:8000/admin

and to look at the user functionality go to localhost:3000

## Running Server
after you've followed setup instructions for node package manager (npm), postgres and python virtual environment as outlined below.  

from base directory whist in virtualenv
```
source venv/bin/activate #depending on the name of the virtualenv you've set up
python3 manage.py runserver

```
and then in another terminal tab after activating virtualenv cd into frontend and run
```
npm start
```

## Postgres details
database is called datbase
user details as specified in src/settings.py
setup a local database with those settings

after starting a postgres terminal
```
CREATE USER admin WITH PASSWORD 'password';
CREATE DATABASE datbase WITH OWNER admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
```
exit postgres and execute these in base directory of project in virtualenv

```
python3 manage.py makemigrations
python3 manage.py migrate
```



## resources:

https://docs.djangoproject.com/en/2.2/intro/tutorial01/

https://medium.com/agatha-codes/painless-postgresql-django-d4f03364989

https://hackernoon.com/creating-websites-using-react-and-django-rest-framework-b14c066087c7

http://kevindias.com/writing/django-class-based-views-multiple-inline-formsets/

## Virtualenv 
for python development you need to look at requirements.txt and install those packages


## React setup
install npm 

on ubuntu: 

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
on Windows:
After installing npm you want to install nodejs. There's an installer on their website
https://nodejs.org/en/download/
You also need to change into the frontend folder and run
```
npm install --save react-router-dom
npm install --save axios
npm install
```
