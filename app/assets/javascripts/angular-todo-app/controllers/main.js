angular
  .module('todo-app')
  .controller('MainCtrl', ['Todo', '$scope', '$routeParams',
    function(Todo, $scope, $routeParams) {

    $scope.todos = Todo.query(function(){
      updateRemainingTodoCount();
    });

    $scope.$on('$routeChangeSuccess', function () {
      var status = $scope.status = $routeParams.status || '';

      $scope.statusFilter = (status === 'active') ?
      { completed: false } : (status === 'completed') ?
      { completed: true } : null;
    });
    
    $scope.activeTodo = new Todo();

    $scope.checked = false;

    $scope.edit = function(todo) {
      $scope.activeTodo = todo;
    };

    $scope.checkAll = function(checked) {
      $scope.todos.map( function(todo){
        $scope.checkAndSave(todo, checked);
      });
    };

    $scope.checkAndSave = function(todo, checked) {
      todo.completed = checked || !(todo.completed);
      $scope.save(todo);
    };

    $scope.save = function(todo) {
      if ($scope.todos.indexOf(todo) < 0) {
        $scope.todos.push(todo);
        todo.$save();
      } else {
        Todo.update(todo);
      }
      updateRemainingTodoCount();
      $scope.activeTodo = new Todo();
    };

    $scope.remove = function(todo) {
      Todo.delete(todo);
      array = $scope.todos
      index = array.indexOf(todo);
      if (index > -1) {
        array.splice(index, 1);
      }
      updateRemainingTodoCount();
    };

    function updateRemainingTodoCount() {
      var uncompletedTodos = 0;
      $scope.todos.map( function(todo) {
        if( !!(!todo.completed) ){
          uncompletedTodos += 1;
        }
      });
      $scope.remainingCount = uncompletedTodos;
      console.log(uncompletedTodos);
    }

  }]);
