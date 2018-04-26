/** @module db */

/** @constant
    @type {string}
    @default
*/
const LOCAL_STORAGE_NAME="localStorage_calendar_";

/** @constant
    @type {string}
    @default
*/
const SETTINGS_NAME="localStorage_settings_Vasilchenko";

/** @constant
    @type {string}
    @default
*/
const WIDGET_NAME = 'localStorage_baseWidget_Vasilchenko';

/** @constant
    @type {number}
    @default
*/
const DB_LOCALSTORAGE = 0;

/** @constant
    @type {number}
    @default
*/
var dbMode = DB_LOCALSTORAGE;

/**
 * Получаем текст для виджета, если он уже до этого создавался пользователем 
 *
 * @name getWidgetTextFromDB
 * 
 * @callback 
 * 
 * @return {string}  текст для виджета
 * 
 */
function getWidgetTextFromDB () {
    let result = '';
    if (dbMode === DB_LOCALSTORAGE) {
        result = localStorage.getItem(WIDGET_NAME);
    }

    
    return result;
}


/**
 * Сохраняем текст виджета в localStorage
 *
 * @name saveWidgetTextToDB
 * @callback 
 * @param {string} value - текст виджета
 * 
 */
function saveWidgetTextToDB(value) {
    localStorage.setItem(WIDGET_NAME,value);
    
}

/**
 * Получаем настройки виджета, если он уже до этого создавался пользователем 
 *
 * @name getSettingsJSONFromDB
 * 
 * @callback 
 * 
 * @return {object}  настройки виджета (хэш)
 * 
 */
function getSettingsJSONFromDB() {
    let result = '';
    if (dbMode === DB_LOCALSTORAGE) {
        result = localStorage.getItem(SETTINGS_NAME);
    }

    if (!result || result === '') {   
        result={
            "showMonth" : true,
            "allowChangeMonth" : true,
            "allowAdd" : true,
            "allowRemove" : true,
            "showMonth": true,
            "date" : null
        }


    }else{
        result=JSON.parse(result);
    }

    return result;
}

/**
 * Сохраняем настройки виджета в localStorage
 *
 * @name saveSettingsToDB
 * @callback 
 * @param {object} value - настройки виджета
 * 
 */
function saveSettingsToDB(value) {
    localStorage.setItem(SETTINGS_NAME,JSON.stringify(value));
}

/**
 * Получаем список задач за месяц
 *
 * @name getTasksPerMonthFromDB
 * 
 * @callback 
 * 
 * @param {string} id - идентификатор БД
 * @param {date} currentDate - день в месяце, за который нужно взять выборку 
 * 
 * @return {object}  список задач за месяц (хэш)
 * 
 */

function getTasksPerMonthFromDB(id, currentDate){
    let result={};
    let obj=localStorage.getItem(LOCAL_STORAGE_NAME+id);
    if (obj && obj !== '' ) {   
        result=JSON.parse(obj);
        let beginData=new Date(currentDate.getFullYear(), currentDate.getMonth(),1,0,0,0,0).getTime();
        let endData=new Date(currentDate.getFullYear(), currentDate.getMonth()+1,1,0,0,0,0).getTime()-1;
        for (const key in result) {
            let keyData=key.substring(0,key.indexOf("_"));
            let arr= keyData.split('-');
            let currentDate=new Date (arr[0],arr[1], arr[2]).getTime();
            if (result.hasOwnProperty(key)) {
                if (currentDate<beginData || currentDate>endData){
                    delete result[key];
                }
            }
        }
    }

    return result;

}

/**
 * Добавить задачу в БД
 *
 * @name addTaskToDB
 * 
 * @callback 
 * 
 * @param {string} id - идентификатор БД
 * @param {string} key - идентификатор дня в календаре
 * @param {string} task - собственно, задача, которую надо баписать в БД
 * 
 * @return {string}  идентификатор созданной задачи
 * 
 */
function addTaskToDB(id, key, task){
    let result={};
    let obj=localStorage.getItem(LOCAL_STORAGE_NAME+id);
    if (obj && obj !== '' ) {
        result=JSON.parse(obj);
    }
    let dbKey=key+"_"+new Date().getTime();
    result[dbKey]=task;
    localStorage.setItem(LOCAL_STORAGE_NAME+id,JSON.stringify(result));

    return dbKey;
}

/**
 * Удалить задачу из БД
 *
 * @name removeTaskFromDB
 * 
 * @callback 
 * 
 * @param {string} id - идентификатор БД
 * @param {string} dbKey - идентификатор задачи в БД
  * 
 * @return {boolean}  успешно ли прошла операция удаления
 * 
 */

function removeTaskFromDB(id, dbKey){
    let result=false;
    let obj=localStorage.getItem(LOCAL_STORAGE_NAME+id);
    if (obj && obj !== '' ) {  
        obj=JSON.parse(obj);
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && key===dbKey) {
                delete obj[key];
                break;
            }
        }
        localStorage.setItem(LOCAL_STORAGE_NAME+id,JSON.stringify(obj));
        result=true;
    }else {
        console.log("wrong key: "+ key);
    }
    

    return result;
}