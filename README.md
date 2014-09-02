# Angular on Rails - w/ tutorial

Angular on Rails - is an implementation of the popular [Todo MVC](http://www.todomvc.com) using Angular and Ruby on Rails. You can clone this project for the finished product or you can follow this tutorial to build your own.

## Part 1 - Installing Bower
Managing our front-end assets in rails can be cumbersome.  Luckily Bower does a superb job at this, and with the bower-rails gem we can utilize it in rails.

Including the following in your gemfile:
```
gem 'bower-rails'
```
and now run Bundler
``` 
bundle install
```

To do things the bower way, we will initialize with json
```
rails g bower_rails:initialize json
```

This creates a bower.json file in the root of our project. To install the dependencies that we will need for our Angular project we will want our bower.json file to look like this
```
{
  "lib": {
    "name": "bower-rails generated lib assets",
    "dependencies": {
      "angular": "latest",
      "angular-route": "latest",
      "angular-resource": "latest",
      "todomvc-common": "latest"
    }
  },
  "vendor": {
    "name": "bower-rails generated vendor assets",
    "dependencies": {
    }
  }
}
```

Now that we have our dependencies defined we can run:
```
rake bower:install
```

Now that bower has downloaded our packages into our lib directory.  We will need to include the js files in **application.js**
```
//= require angular
//= require angular-resource
//= require angular-route
```
And include the following in **application.css**
```
*= require todomvc-common/base.css
```


## Part 2 - Prepping Rails for our Front-End App

Let’s head over to the **routes.rb** file and add the route that will compose our Angular App.
```
root “application#index”
```

Now we need to add the index action to our Application Controller
```
  def index
  end
```
To make this tutorial shorter I will link to the code you need to copy.  Copy the following files:

- [/app/views/application/index.html.erb](https://github.com/bakoruby/angular-on-rails/blob/master/app/views/application/index.html.erb)
- [/app/controllers/api/v1/todos_controller.rb](https://github.com/bakoruby/angular-on-rails/blob/master/app/controllers/api/v1/todos_controller.rb)
- [/config/routes.rb](https://github.com/bakoruby/angular-on-rails/blob/master/config/routes.rb)



## Part 3 - Implementing Angular
To bind our Angular app to the page we will add a custom directive to the body tag on our **application.html.erb**
```html
    <body ng-app=“todo-app”>
```

Let’s organize our code for the Angular app under a new folder
    app/assets/angular-todo-app

The file to initialize our app will be
    app/assets/angular-todo-app/app.js

Inside of **app.js** we will define our app and load the two dependencies that we installed using bower.
    angular
      .module('todo-app', ['ngRoute', 'ngResource'])

Now let’s add in the config for our Route Provider into **app.js**. 
```javascript 
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      controller: 'HomeCtrl'
    }).when('/:status', {
      controller: 'HomeCtrl',
    }).otherwise({
      redirectTo: '/'
    });
  }]);
```

You can read more about the routeProvider here: [https://docs.angularjs.org/api/ngRoute/provider/$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)

Basically were passing every route off to the HomeCtrl and any route that ends with /:status will be embedded as a param that we can filter by the status of a todo.

To separate concerns inside of Angular we are going to create two new directories

- angular-todo-app/models
- angular-todo-app/controllers

We are going to use an Angular Factory to define our model, to learn more about the other two model objects visit [http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/](http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/).

```javascript
    // angular-todo-app/models/todo.js
     angular
       .module('todo-app')
       .factory('Todo', function($resource) {

         var Todo = $resource('http://localhost:3000/api/v1/todos/:id.json', {id: '@id'}, {
           update: {
             method: 'PUT'
           }
         });

         return Todo;
       });
```

We will name the controller MainCtrl and pass in the Todo model we created and call .query(); on the model, which is included by the ngResource library.
```javascript
    // angular-todo-app/controllers/main.js
     angular
       .module('todo-app')
       .controller('MainCtrl', ['Todo', '$scope', function(Todo, $scope){
         $scope.todos = Todo.query();
       }]);
```
----

## Notes
With those simple steps you have the basics you need to get started with your own Angular on Rails app.  Download the rest of the javascript code from this project to see the app fully functional.
