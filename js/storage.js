var currentDateForMainCalendar=new Date();
var currentDateForSettingsCalendar=new Date();

function getWidgetText() {
    let result = getWidgetTextFromDB();


    if (!result || result === '' || result === 'undefined') {
        result = '<script scr="..."></script>\n' +
            '<script>\n' +
            '  (function() {\n' +
            '      var id = "calendar" +  Math.random() ;\n' +
            '      document.write(`<div id="` + id + `"></div>`);\n' +
            '      new Calendar({\n' +
            '          el: `#` + id,\n' +
            '          showMonth: true,\n' +
            '          allowChangeMonth: true,\n' +            
            '          allowAdd: true,\n' +
            '          allowRemove: true,\n' +
            '          date: null\n'  +
            '      })\n' +
            '  })();\n' +
            '</script>\n';

    }

    return result;
        
}

function getSettings() {

    return getSettingsJSONFromDB();
}

function setPropertyForSettings(elementName, obj,field) {
    let el=document.getElementById(elementName);
    if (el){
        obj[field]=el.checked;
    }else{
        console.log("No field "+elementName);
    }     
}

function saveSettings() {
    result={
        "showMonth" : true,
        "allowChangeMonth" : true,
        "allowAdd" : true,
        "allowRemove" : true,
        "date" : null
    }
    setPropertyForSettings("bShowMonth", result,"showMonth");
    setPropertyForSettings("bAllowChangeMonth", result,"allowChangeMonth");
    setPropertyForSettings("bAllowAdd", result,"allowAdd");
    setPropertyForSettings("bAllowRemove", result,"allowRemove");

    saveSettingsToDB(result);
}

function saveWidgetText() {
    let value="";
    //let el=document.getElementById("widgetTestTextarea");
    //if (el){
        //let value=el.text;
        let settings=getSettings();
        value = '<script scr="..."></script>\n' +
        '<script>\n' +
        '  (function() {\n' +
        '      var id = "calendar" +  Math.random() ;\n' +
        '      document.write(`<div id="` + id + `"></div>`);\n' +
        '      new Calendar({\n' +
        '          el: `#` + id,\n' +
        '          showMonth: '+settings.showMonth+',\n' +
        '          allowChangeMonth: '+settings.allowChangeMonth+',\n' +          
        '          allowAdd: '+settings.allowAdd+',\n' +
        '          allowRemove: '+settings.allowRemove+',\n' +
        '          date: null\n'  +
        '      })\n' +
        '  })();\n' +
        '</script>\n';


        saveWidgetTextToDB(value);
    //}


    return value;
}

function getTasks( id, currentDate) {
    return getTasksPerMonthFromDB(id, currentDate);
    

}


function addTask(id, key, task) {
    return addTaskToDB(id, key, task);
}

function removeTask(id, key) {
    return removeTaskFromDB(id, key);
}