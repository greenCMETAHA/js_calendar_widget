
function Calendar(settings) {
    this.settings=settings;
    this.settings.date=settings.date===null? new Date():settings.date;
   //id, showMonth, allowChangeMonth, allowAdd, allowRemove, date
   // let date = !settins.date ? currentDateForMainCalendar : settins.date;
    this.show();
}

Calendar.prototype.show = function() {
    let parent=document.getElementById(this.settings.el); //зачем решетка? Уьбрать решетку, если не сработает
    parent.innerHTML="YES!!! "+this.settings.el+"<hr />";
    parent.innerHTML=`<div>`+
        `<div class="monthDiv">`+
        `<div class="monthButtonLeft" id="monthButtonLeft_`+this.settings.el+`">`
            +(this.settings.allowChangeMonth?`<img src="../images/left.png"/>`:``)+`</div>`+
        `<div class="monthCenter">`+(this.settings.showMonth?getCurrentMonth(this.settings.date):``)+`</div>`+
        `<div class="monthButtonRight" id="monthButtonRight_`+this.settings.el+`">`
        +(this.settings.allowChangeMonth?`<img src="../images/right.png"/>`:``)+`</div></div>`+this.getTable(this.settings)+
        `</div>`;
    console.log(this.settings.el);
   // document.write('<div id=' + settins.el + '>'+settins.el+'</div>');    

    //debugger;

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
                    ` `+(this.settings.allowRemove?`<img src="../images/remove.png" class="addRemoveImage" id="`+key+`"/>`:``)+`</div>`;
                
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

Calendar.prototype.removeTask = function(id, key) {
    removeTask(id, key);
    this.closeModal();
    this.show(id, key); 
}


Calendar.prototype.openPromptForAddTask = function(id, key) {
    this.createModalWindowForAdd(id, key);
}

Calendar.prototype.closeModal = function() {
    let modalDiv=document.getElementById("modalWindowForCalendar");   
    if (modalDiv){
        modalDiv.style.display="none";
    }
}

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

Calendar.prototype.saveNewTask = function(id, key) {
    let el=document.getElementById("newTask");
    addTask(id, key, el.value);
    this.closeModal();
    this.show();
}


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
            `<div class="addRemoveButtons">`+(this.settings.allowAdd?`<img src="../images/add.png" id="`+this.settings.el+`_Add_`+key+`" class="addRemoveImage"/>`:``)+
            (this.settings.allowRemove?`<img src="../images/remove.png"  id="`+this.settings.el+`_Remove_`+key+`"  class="addRemoveImage"/>`:``)+`</div> </td>`;
        
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

Date.prototype.daysInMonth = function() {
    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};


function getTasks( id, currentDate) {
    return getTasksPerMonthFromDB(id, currentDate);
}

function addTask(id, key, task) {
    return addTaskToDB(id, key, task);
}

function removeTask(id, key) {
    return removeTaskFromDB(id, key);
}