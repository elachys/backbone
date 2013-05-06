$(function(){

    var Todo = Backbone.Model.extend({
        defaults: function(){
            return {
                title: 'empty todo...',
                order: Todos.nextOrder(),
                done: false
            };
        },
        toggle: function(){
            this.save({done: !this.get('done')});
        }
    });

    var TodoList = Backbone.Collection.extend({
        model: Todo,
        localStorage: new Backbone.LocalStorage("todos-backbone"),

        done: function(){
            return this.where({done: true});
        },

        remaining: function(){
            return this.without.apply(this, this.done());
        },

        nextOrder: function(){
            if(!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: 'order'
    });

    var Todos = new TodoList;

    var TodoView = Backbone.View.extend({
        tagName: "li",
        template: _.template($('#item-template').html()),

        events: {
            'click .toggle' : 'toggleDone',
            'dblclick .view' : 'edit',
            'click a.destroy' : 'clear',
            'keypress .edit' : 'updateOnEnter',
            'blur .edit'    : 'close'
        },

        initialize: function(){
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            $this.el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        toggleDone: function(){
            this.model.toggle();
        },

        edit: function(){
            this.$el.addClass('editing');
            this.input.focus();
        },

        close: function(){
            var value = this.input.val();
            if(!val){
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass('editing');
            }
        },

        updateOnEnter: function(e){
            if(e.keyCode == 13) this.close();
        },

        clear: function(){
            this.model.destroy();
        }

    });


});