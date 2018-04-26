/** @module main */

const MAIN_CALENDAR_PAGE=0, SETTINGS_PAGE=1, ABOUT_PAGE=2;
var currentLink=MAIN_CALENDAR_PAGE;

var divLinks=document.getElementById("links");
var divMain=document.getElementById("main");

refreshPage();


divLinks.addEventListener("click",ev => {
    selectPage(ev.target.name);
});

function refreshPage() {
    selectPage("calendar");  //заглушка. Сделать через пути
}


/**
 * Выводим нужную страницу нашего SPA
 *
 * @name selectPage
 * @param {string} linkName Идентификатор страницы
 * 
 */
function selectPage(linkName){
    switch (linkName) {
        case "calendar":
            showMainCalendar();
            break;
        case "widget":
            showSettingsCalendar();
            break;
        case "about":
            showAboutCalendar();
            break;                        
    
        default:
            break;
    }

    return linkName; //for unit-tests
}

/**
 * Показать первую страницу, основной календарь с полными настройками 
 *
 * @name showMainCalendar
 * 
 */
function showMainCalendar() {
    let result='';
 
    result=`<div id='mainCalendar'>s</div>`; 

   divMain.innerHTML=result;
    var scriptElement = document.createElement('SCRIPT');
    scriptElement.onload=getCalendar({
        el: "mainCalendar",
        showMonth: true,
        allowChangeMonth: true,
        allowAdd: true,
        allowRemove: true,
        date: currentDateForMainCalendar
    });

    document.getElementById("mainCalendar").appendChild(scriptElement);
 /*   new Calendar(
        {
            el : "MainCalendar_00", 
            showMonth : true,
            allowChangeMonth : true,
            allowAdd : true, 
            allowRemove : true,
            date: null
        }
    );
    */
    
    return result;     
}

/**
 * Показать первую страницу, основной календарь с полными настройками 
 *
 * @name getCalendar
 * @param {object} settings настройки календаря (хэш): {
            el : "MainCalendar_00", 
            showMonth : true,
            allowChangeMonth : true,
            allowAdd : true, 
            allowRemove : true,
            date: null
        }
 * @return {Celendar} Возвращает объект Calendar, созанный с указанными настройками
 * 
 */
function getCalendar(settings) {
    new Calendar(settings);
};



/**
 * Созадаём календарь по стройкам виджета
 *
 * @name showSettingsCalendar
 * @return {string} HTML-код календаря
 * 
 */
function showSettingsCalendar() {
    console.log("refresh!");
    let result='';

    let settings=getSettings();
    let str=`<input id="bShowMonth" type="checkbox" `+(settings.showMonth?"checked":"")+` onclick="changeSettings()"> Показывать месяц и год <br />`+
            `<input id="bAllowChangeMonth" type="checkbox" `+(settings.allowChangeMonth?"checked":"")+` onclick="changeSettings()"> Разрешить изменять месяц <br />`+
            `<input id="bAllowAdd" type="checkbox" `+(settings.allowAdd?"checked":"")+` onclick="changeSettings()"> Разрешить добавлять событие <br />`+
            `<input id="bAllowRemove" type="checkbox" `+(settings.allowRemove?"checked":"")+` onclick="changeSettings()"> Разрешить удалять событие <br />`;
    
 
    result=`<div id="settings">`+str+`</div>`
        +` <div id="widgetTest"><div id="widget"></div> <div id="testCalendar"></div> </div>`; 

    divMain.innerHTML=result;

    showWidgetText();
    showTestCalendar();
    
    return result;    
}


/**
 * Показать текст виджета
 *
 * @name showWidgetText
 * 
 */
function showWidgetText() {
    let element=document.getElementById("widget");
    if (element){
        element.innerHTML=`<textarea id="widgetTestTextarea">`+getWidgetText()+`</textarea>`;

    }else{
        console.log("not found widget");
    }
    
}


/**
 * Вывести на страницу календарь по стройкам виджета
 *
 * @name showTestCalendar
 * 
 */
function showTestCalendar() {
    let element=document.getElementById("testCalendar");
    if (element){
        let settings=getSettings();
        settings.el="testCalendar";
        settings.date=currentDateForSettingsCalendar;
        new Calendar(settings);

    }else{
        console.log("not found testCalendar");
    }  
}


/**
 * Вывести на страницу информацию о разработчике
 *
 * @name showAboutCalendar
 * 
 * @return {string} HTML-код календаря
 * 
 */

function showAboutCalendar() {
    let result='';
 
    result="<img src='../images/avatar.jpg' height='194' width='256' />  <br/> Приложение разработал Васильченко Глеб, ака greenCMETAHA <br /> Все права не защищены, всё равно проект учебный";

    divMain.innerHTML=result;
    
    return result; 
}


/**
 * Сохраняем все настройки на странице виджета
 *
 * @name changeSettings
 * 
 */
function changeSettings() {
    saveSettings();
    saveWidgetText();
    showWidgetText();
    showTestCalendar();
}



