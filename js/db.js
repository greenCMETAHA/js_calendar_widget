const LOCAL_STORAGE_NAME="localStorage_calendar_";
const SETTINGS_NAME="localStorage_settings_Vasilchenko";
const WIDGET_NAME = 'localStorage_baseWidget_Vasilchenko';

const DB_LOCALSTORAGE = 0;
var dbMode = DB_LOCALSTORAGE;

function getWidgetTextFromDB () {
    let result = '';
    if (dbMode === DB_LOCALSTORAGE) {
        result = localStorage.getItem(WIDGET_NAME);
    }

    
    return result;
}


function saveWidgetTextToDB(value) {
    localStorage.setItem(WIDGET_NAME,value);
    
}

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

function saveSettingsToDB(value) {
    localStorage.setItem(SETTINGS_NAME,JSON.stringify(value));
}

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