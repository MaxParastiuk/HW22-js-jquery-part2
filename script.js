const ul$ = $('#list');
const input$ = $('#task');
const create$ = $('#add-btn');
const urlLink = "http://localhost:3000/todos"


class TodoList {
    constructor(el) {

    }

    addTodo(todo) {
        $.ajax({
            type: "POST",
            url: urlLink,
            data: JSON.stringify({
                task: todo,
                complited: false
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
    }

    removeTodo(id) {
        $.ajax({
            type: "DELETE",
            url: `${urlLink}/${id}`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: null
        })
    }

    getTodos() {
        return $.ajax({
            url: urlLink,
            dataType: "json",
            success: function (data) {
                console.log("success" + data)
            }
        })
    }

    async showTodos() {
        try {
            let data = await this.getTodos()
            this.render(data)
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    render(data) {
        let lis = '';
        for (let el of data) {
            if (!el) {
                return;
            }
            let doneOrNot = el.complited ? "done" : "not-done";
            lis += `<li class="${doneOrNot}" data-id="${el.id}">${el.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
        }
        ul$.html(lis);
    }


    async changeStatus(id) {
        try {
            let data = await this.getTodos()
            for (let el of data) {
                if (el.id == id) {
                    el.complited = !el.complited;

                    $.ajax({
                        type: "PATCH",
                        url: `${urlLink}/${id}`,
                        data: JSON.stringify({
                            complited: el.complited
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                }
            }
            location.reload();

        } catch (error) {
            console.error('Ошибка:', error);
        }


    }

}


let todo1 = new TodoList();
todo1.showTodos();


create$.on('click', function (event) {
    todo1.addTodo(input$.val());
});


ul$.on('click', (event) => {
    let dataId = event.target.closest('[data-id]').dataset.id;
    if (event.target.className === 'set-status') {
        todo1.changeStatus(dataId);


    }
    if (event.target.className === 'delete-task') {
        todo1.removeTodo(dataId)
        location.reload();
    }
})