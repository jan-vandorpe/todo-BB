/* 
 hèt eigenlijke programma: todo.js
 */

define([
    'jquery', 
    'underscore',
    'backbone',
    'localstorage'
], function($, _, Backbone){
    return {
        start: function(){
            
            //Model Class
            var Todo = Backbone.Model.extend({
                //Default attributen voor een todo item.
                        defaults: function() {
                          return {
                            title: "leeg..",
                            order: Todos.nextOrder(),
                            done: false
                          };
                        },
                //Toggle the done state of this todo item.
                toggle: function() {
                  this.save({done: !this.get("done")});
                },
                initialize: function(){
	  		console.log("todo model werd geinitialiseerd");
	  	}
            });
            //Collection Class
            var TodoList = Backbone.Collection.extend({
                        //Refereer naar het Model
                        model: Todo,
                        //Save alle todo items onder de "todos-backbone" namespace met localStorage
                        localStorage: new Backbone.LocalStorage("todos-backbone"),
                        //Filter de lijst op alle afgewerkte todo items
                        done: function() {
                              return this.where({done: true}); //collection
                            },
                        //Filter de lijst op alle niet afgewerkte todo items
                        remaining: function() {
                          return this.where({done: false});
                        },
                        //We keep the Todos in sequential order, despite being saved by unordered GUID in the database. This generates the next order number for new items.
                        nextOrder: function() {
                          if (!this.length) return 1;
                          return this.last().get('order') + 1;
                        },
                        //Todos worden gesorteerd op het attrib 'order'
                        comparator: 'order'
                      });
            //Instantieer een Collection
            //vrije var in module
            var Todos = new TodoList;
            
            //View Class voor het Model
            var TodoView = Backbone.View.extend({
                        // de view wordt een list
                        tagName:  "li",
                        //Cache the template function for a single item.
                        template: _.template($('#item-template').html()),
                        // DOM events voor een item.
                        events: {
                          "click .toggle"   : "toggleDone",
                          "dblclick .view"  : "edit",
                          "click a.destroy" : "clear",
                          "keypress .edit"  : "updateOnEnter",
                          "blur .edit"      : "close"
                        },
                        //De TodoView luistert naar veranderingen in zijn model, en hertekent zichzelf
                        //Omdat er een een-op-een relatie is ts een Todo en een TodoView in deze app, zetten we een directe referentie op het model voor gemak
                        initialize: function() {
                          this.listenTo(this.model, 'change', this.render);
                          this.listenTo(this.model, 'destroy', this.remove);
                        },
                        //herteken de  titles van het todo item.
                        render: function() {
                          this.$el.html(this.template(this.model.toJSON()));
                          this.$el.toggleClass('done', this.model.get('done'));
                          this.input = this.$('.edit');
                          return this; //chaining
                        },
                        //Toggle de "done" state van het model.
                        toggleDone: function() {
                          this.model.toggle();
                        },
                        //zet deze view in "editing" mode, toon een input veld
                        edit: function() {
                          this.$el.addClass("editing");
                          this.input.focus();
                        },
                        //Close the "editing" mode, saving changes to the todo.
                        close: function() {
                          var value = this.input.val();
                          if (!value) {
                            this.clear();
                          } else {
                            this.model.save({title: value});
                            this.$el.removeClass("editing");
                          }
                        },
                        //als je enter drukt, is editing klaar
                        updateOnEnter: function(e) {
                          if (e.keyCode == 13) this.close();
                        },
                        //verwijder het item en vernietig zijn model
                        clear: function() {
                          this.model.destroy();
                        }
                });
             
                //Totale App View
                var AppView = Backbone.View.extend({
                        //In de plaats van een nieuw element aan te maken, binden we aan een bestaand element
                        el: $("#todoapp"),
                        //het template voor de statistieken onderaan
                        statsTemplate: _.template($('#stats-template').html()),
                        // event handlers voor DOM events
                        events: {
                          "keypress #new-todo":  "createOnEnter",
                          "click #clear-completed": "clearCompleted",
                          "click #toggle-all": "toggleAllComplete"
                        },
                        //bij de initialisatie binden we de relevante events aan de Todos collection, als items toegevoegd of verwijderd worden
                        //start door enige bestaande todos in localStorage te laden
                        initialize: function() {

                          this.input = this.$("#new-todo");
                          this.allCheckbox = this.$("#toggle-all")[0];

                          this.listenTo(Todos, 'add', this.addOne);
                          this.listenTo(Todos, 'reset', this.addAll);
                          this.listenTo(Todos, 'all', this.render);

                          this.footer = this.$('footer');
                          this.main = $('#main');

                          Todos.fetch();
                        },
                        //de App View hertekenen beteken enkel de statistieken opfrissen  de rest veranderd niet
                        render: function() {
                          var done = Todos.done().length;
                          var remaining = Todos.remaining().length;

                          if (Todos.length) {
                            this.main.show();
                            this.footer.show();
                            this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
                          } else {
                            this.main.hide();
                            this.footer.hide();
                          }

                          this.allCheckbox.checked = !remaining;
                        },
                        //Voeg 1 todo item toe door een view ervoor aan te maken, en voeg het toe aan de <ul>.
                        addOne: function(todo) {
                          var view = new TodoView({model: todo});
                          this.$("#todo-list").append(view.render().el);
                        },
                        //Voeg alle items toe aan de Todos collection
                        addAll: function() {
                          Todos.each(this.addOne, this);
                        },
                        //Als je Enter drukt in het input veld, maak een nieuw Todo model en sla het op in localStorage
                        createOnEnter: function(e) {
                          if (e.keyCode != 13) return;
                          if (!this.input.val()) return;

                          Todos.create({title: this.input.val()});
                          this.input.val('');
                        },
                        //verwijder alle afgewerkte todo items en vernietig hun model
                        clearCompleted: function() {
                          _.invoke(Todos.done(), 'destroy');
                          return false;
                        },
                        toggleAllComplete: function () {
                          var done = this.allCheckbox.checked;
                          Todos.each(function (todo) { todo.save({'done': done}); });
                        }
              });
              
            //maak de App
              var App = new AppView;
              
        }//einde start fucntie
    };//einde ano fucntie
});//einde define

