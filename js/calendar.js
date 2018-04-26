/** @module calendar */

/**
 * @description Объект для отображения календаря
 * @constructor
 * @name Calendar
 * @param {object} settings - Настройки календаря: 
 * @class 
 * 
 */
function Calendar(settings) {
    /** @private */
    this.settings=settings;

    this.settings.date=settings.date===null? new Date():settings.date;
   //id, showMonth, allowChangeMonth, allowAdd, allowRemove, date
   // let date = !settins.date ? currentDateForMainCalendar : settins.date;
    this.show();
}

/**
 * @description Выводит на страницу объект Calendar согласно настройкам settings.
 * @name show
 *
 * @this   {Calendar}
 * 
 */
Calendar.prototype.show = function() {
    let parent=document.getElementById(this.settings.el); //зачем решетка? Уьбрать решетку, если не сработает
    parent.innerHTML=`<div>`+
        `<div class="monthDiv">`+
        `<div class="monthButtonLeft" id="monthButtonLeft_`+this.settings.el+`">`
            +(this.settings.allowChangeMonth?`<img src="https://raw.githubusercontent.com/greenCMETAHA/js_calendar_widget/master/images/left.png"/>`:``)
        +`</div>`+
        `<div class="monthCenter">`+(this.settings.showMonth?getCurrentMonth(this.settings.date):``)+`</div>`+
        `<div class="monthButtonRight" id="monthButtonRight_`+this.settings.el+`">`
        +(this.settings.allowChangeMonth?`<img src="https://raw.githubusercontent.com/greenCMETAHA/js_calendar_widget/master/images/right.png"/>`:``)
            +`</div></div>`+this.getTable(this.settings)+
        `</div>`;

    let divButtonLeft= document.getElementById("monthButtonLeft_"+this.settings.el);
    if (this.settings.allowChangeMonth && divButtonLeft){
        divButtonLeft.addEventListener("click", el => {
            this.changeMonth(-1);
        });
    }

    let divButtonRight= document.getElementById("monthButtonRight_"+this.settings.el);
    if (this.settings.allowChangeMonth && divButtonRight){
        divButtonRight.addEventListener("click", el => {
            this.changeMonth( 1);
        });
    }

    let table= document.getElementById(this.settings.el+"Table");
    table.addEventListener("click", el =>{
        this.onClickTd(el.target);

    });
}


/**
 * @description Обрабатывает нажатие на день календаря.
 * @name onClickTd
 *
 * @this   {Calendar}
 * @param {object} target - ссылка на нажатый элемент формы, день календаря 
 * 
 */
Calendar.prototype.onClickTd = function(target) {
    const LIST_MODE=1, ADD_MODE=2, REMOVE_MODE=3;
    let mode=LIST_MODE;
    let key=target.id;
    if (key.indexOf("_Add_")>=0){
        mode=ADD_MODE;
    }else if (key.indexOf("_Remove_")>=0){
        mode=REMOVE_MODE;
    }
    let tag=target;
    while (tag.tagName != "TD"){
        tag=tag.parentElement;
    }
    key=tag.id.replace(this.settings.el+"-","");
    let list={};
    switch (mode) {
        case LIST_MODE:
            list=getTasks(this.settings.el, this.settings.date);
            this.createModalWindowForList(this.settings.el, tasksPerDay(list, key), key);
            break;
        case ADD_MODE:
            this.createModalWindowForAdd(this.settings.el, key);
            break;
        case REMOVE_MODE:
            list=getTasks(this.settings.el, this.settings.date);
            this.createModalWindowForList(this.settings.el,tasksPerDay(list, key), key);
            break;                
        default:
            break;
    }

    console.log(target);
    
}

/**
 * @description Выводит на экран модальное окно для списка
 * @name createModalWindowForList
 *
 * @this   {Calendar}
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {object} list - список задач на день, полученный из БД: 
 * @param {string} key - идентификатор дня в календаре 
 * 
 */
Calendar.prototype.createModalWindowForList = function(id, list, key) {
    let modalDiv=document.getElementById("modalWindowForCalendar");
    if (!modalDiv){
        modalDiv=document.createElement("div");
        modalDiv.setAttribute("id", "modalWindowForCalendar");
        modalDiv.setAttribute("class", "modal");
        document.body.appendChild(modalDiv);
    }else{
        modalDiv.setAttribute("class", "modal");
    }
    let result=`<div id="list">`;
        for (const key in list) {
            if (list.hasOwnProperty(key)) {
                const element = list[key];
                result+=`<div>&nbsp;&nbsp; `+element+
                    ` `+(this.settings.allowRemove?`<img src="https://raw.githubusercontent.com/greenCMETAHA/js_calendar_widget/master/images/remove.png"`+
                    ` class="addRemoveImage" id="`+key+`"/>`:``)+`</div>`;
                
            }
        }

        result+=`</div><br /><div id="buttons">`+
        `<input type="button" id="buttonAdd" value="Добавить" />`+
        `<input type="button" id="buttonClose" value="Закрыть" /></div>`;
    
    modalDiv.innerHTML=result;
    modalDiv.style.display="block";

    document.getElementById("buttonAdd").addEventListener("click", el=>{
        this.openPromptForAddTask(id,key);
    });

    document.getElementById("buttonClose").addEventListener("click", el=>{
        this.closeModal();
    });
    
    document.getElementById("list").addEventListener("click", el=>{
        el.target.id;
        this.removeTask(id, el.target.id);
    });     
    
}

/**
 * @description Удаляет задачу из БД и обновляет страницу
 * @name removeTask
 *
 * @this   {Calendar}
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {string} key - идентификатор задачи в БД: 
 * 
 */
Calendar.prototype.removeTask = function(id, key) {
    removeTask(id, key);
    this.closeModal();
    this.show(id, key); 
}


/**
 * @description Выводит на экран модальное окно добавления задачи
 * @name openPromptForAddTask
 *
 * @this   {Calendar}
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {string} key - идентификатор дня в календаре: 
 * 
 */

Calendar.prototype.openPromptForAddTask = function(id, key) {
    this.createModalWindowForAdd(id, key);
}

/**
 * @description Закрывает модальное окно (для вывода списка, или для добавления задачи)
 * @name closeModal
 *
 * @this   {Calendar}
 * 
 */
Calendar.prototype.closeModal = function() {
    let modalDiv=document.getElementById("modalWindowForCalendar");   
    if (modalDiv){
        modalDiv.style.display="none";
    }
}

/**
 * @description Создаёт модальное окно для добавления новой задачи
 * @name createModalWindowForAdd
 *
 * @this   {Calendar}
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {string} key - идентификатор дня в календаре: 
 * 
 */
Calendar.prototype.createModalWindowForAdd = function(id, key) {
    let modalDiv=document.getElementById("modalWindowForCalendar");
    if (!modalDiv){
        modalDiv=document.createElement("div");
        modalDiv.setAttribute("id", "modalWindowForCalendar");
        modalDiv.setAttribute("class", "add");
        document.body.appendChild(modalDiv);
    }else{
        modalDiv.setAttribute("class", "add");
    }
    let result=`<p><input id="newTask"><br /><div id="buttons">`+
    `<input type="button" id="buttonSaveNewTask" value="Сохранить" />`+
    `<input type="button" id="buttonClose" value="Закрыть" /></div>`;
    
    modalDiv.innerHTML=result;
    modalDiv.style.display="block";

    document.getElementById("buttonSaveNewTask").addEventListener("click", el=>{
        this.saveNewTask(id,key);
    });

    document.getElementById("buttonClose").addEventListener("click", el=>{
        this.closeModal();
    });        
    
}

/**
 * @description Сохраняет новую задачу в БД
 * @name saveNewTask
 *
 * @this   {Calendar}
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {string} key - идентификатор дня в календаре: 
 * 
 */
Calendar.prototype.saveNewTask = function(id, key) {
    let el=document.getElementById("newTask");
    addTask(id, key, el.value);
    this.closeModal();
    this.show();
}

/**
 * @description Изменяет текущий месяц в кадендаре на странице
 * @name changeMonth
 *
 * @this   {Calendar}
 * @param {number} value - смещение месяца: 1 - на месяц вперед, -1 - на месяц назад 
 * 
 */
Calendar.prototype.changeMonth = function(value) {
    let date=this.settings.date;
    if (value === 1){
        if (date.getMonth===11){
            this.settings.date = new Date(date.getFullYear()+1,0,date.getDate());
        } else {
            this.settings.date = new Date(date.getFullYear(),date.getMonth()+1,date.getDate());
        }
    }else {
        if (date.getMonth===0){
            this.settings.date = new Date(date.getFullYear()-1,11,date.getDate())
        } else {
            this.settings.date = new Date(date.getFullYear(),date.getMonth()-1,date.getDate());
        }       
    }
    this.show();


    
}

/**
 * @description Возвращает наименование месяца на русском 
 * @name getCurrentMonth
 *
 * @param {date} date - дата в месяце, который будем выводить на экран 
 * @return {string} Наименование месяца на русском.
 */
function getCurrentMonth(date) {
    let result="< / >";
    if (date){
        let month=date.getMonth();
        switch (month) {
            case 0:
                month="Январь";
                break;
            case 1:
                month="Февраль";
                break;
            case 2:
                month="Март";
                break;
            case 3:
                month="Апрель";                
                break;
            case 4:
                month="Май";   
                break;
            case 5:
                month="Июнь";  
                break;
            case 6:
                month="Июль";
                break;
            case 7:
                month="Август";  
                break;
            case 8:
                month="Сентябрь";
                break;
            case 9:
                month="Октябрь";
                break;
            case 10:
                month="Ноябрь";
                break;
            case 11:
                month="Декабрь";
                break;                                                                                                                                                                        
            default:
                break;
        } 
        result=month+` `+date.getFullYear()+` г.`;
    }
    
    return result;
}

/**
 * Создаёт таблицу дней месяца по неделям для вывода на страницу
 * @description Создаёт таблицу дней месяца по неделям для вывода на страницу
 * @name getTable
 *
 * @this   {Calendar}
 * @return {string} html-код таблицы дней за месяц
  * 
 */
Calendar.prototype.getTable = function() {
    let result=`<table id="`+this.settings.el+`Table">`+
        `<tr><th>Пн.</th><th>Вт.</th><th>Ср.</th><th>Чт.</th><th>Пт.</th><th>Сб.</th><th>Вс.</th></tr>`+
        `<tr>`;
    
    let date=this.settings.date;
    let currentDate=date.getDate();
    let currentWeekDay=date.getDay();
    let firstMonthDay=new Date(date.getFullYear(),date.getMonth(),1).getDay();
    firstMonthDay=firstMonthDay===0?7:firstMonthDay;  //воскресенье === 0
    let i=0;
    for (i = 1; i < firstMonthDay; i++) { //empty
        result+=`<td> </td>`;  //empty
        //debugger;
    }

    let tasks=getTasks(this.settings.el, date);
    
    let daysInMonth=date.daysInMonth();
    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
        let key=""+date.getFullYear()+"-"+date.getMonth()+"-"+dayNumber;
        result+=`<td id="`+this.settings.el+`-`+date.getFullYear()+`-`+date.getMonth()+`-`+dayNumber+`" `
            +(dayNumber===currentDate && date.getMonth()===new Date().getMonth()?` class="td_current"`:``)+`> `+
            `<div><b>`+dayNumber+`</b><div><div>`+tasksPerDay(tasks, key, true)+`</div>`+
            `<div class="addRemoveButtons">`+(this.settings.allowAdd?`<img src="https://raw.githubusercontent.com/greenCMETAHA/js_calendar_widget/master/images/add.png" id="`
            +this.settings.el+`_Add_`+key+`" class="addRemoveImage"/>`:``)+
            (this.settings.allowRemove?`<img src="https://raw.githubusercontent.com/greenCMETAHA/js_calendar_widget/master/images/remove.png"  id="`
                +this.settings.el+`_Remove_`+key+`"  class="addRemoveImage"/>`:``)+`</div> </td>`;
        
        if (i>=7){
            result+=`</tr>`; 
            i=1;
        }else{
            i++;
        }
        
    }
    if (i>1){
        for (let j = i;j <=7; j++) { //empty
            result+=`<td> </td>`;   //empty
        }
    }

    result+=`</tr></table>`;

    return result;
}

/**
 * @description Возвращает список задач за день, либо их количество
 * @name tasksPerDay
 *
 * @param {object} list - список задач за месяц, полученный из БД 
 * @param {string} keyForDay - идентификатор дня в месяце в формате "год-месяц-день" 
 * @param {boolean} bNumberOfTasks - формат вывода: true - выводим количество задач, false - возвращаем список задач (для list)
 * 
 * @returns {(string|object)} либо строку с количеством задач за день, либо список задач (хэш)
 * 
 */
function tasksPerDay(list, keyForDay, bNumberOfTasks=false){
    let result={};

    for (key in list) {
        let keyData=key.substring(0,key.indexOf("_"));
        if (keyData===keyForDay){
            result[key]=list[key];
        }
    }    

    let resultLength= Object.keys(result).length;
    return bNumberOfTasks? (resultLength===0?"&nbsp;&nbsp;&nbsp;&nbsp; ": "Задач:"+ resultLength): result;
}

/**
 * @description Функция для получения дней в месяце
 * @name daysInMonth
 * 
 * @return {number}  количество дней в месяце
 * 
 */

Date.prototype.daysInMonth = function() {
    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};


/**
 * @description Возвращает список задач за месяц
 * @name getTasks
 *
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {date} currentDate - дата в месяце, за который хотим получить выборку 
  * 
 * @return {object}  список задач за месяц (хэш)
 * 
 */
function getTasks( id, currentDate) {
    return getTasksPerMonthFromDB(id, currentDate);
}


/**
 * @description Добавляем задачу в БД
 * @name addTask
 *
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {string} key - идентификатор дня, в который будет записана задача 
 * @param {string} task - собственно, описание задачи
 * 
 * @return {string}  идентификатор задачи в БД
 * 
 */

function addTask(id, key, task) {
    return addTaskToDB(id, key, task);
}

/**
 * @description Удаляем задачу из БД
 * @name removeTask
 *
 * @param {string} id - идентификатор базы, с которой работает календарь: 
 * @param {string} key - идентификатор задачи 
 * @param {string} task - собственно, описание задачи
 * 
 * @return {boolean}  была ли найдена и удалена задача
 * 
 */
function removeTask(id, key) {
    return removeTaskFromDB(id, key);
}