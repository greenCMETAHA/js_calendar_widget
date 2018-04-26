/** @module storage */

var currentDateForMainCalendar=new Date();
var currentDateForSettingsCalendar=new Date();

/**
 * Получаем текст для виджета из БД
 *
 * @name getWidgetText
 * @description Получаем текст для виджета из БД. Если такого пока нет, создаём по шаблону
 * 
 * @return {string}  текст для виджета
 * 
 */
function getWidgetText() {
    let result = getWidgetTextFromDB();


    if (!result || result === '' || result === 'undefined') {
        result = '<script scr="https://rawgit.com/greenCMETAHA/js_calendar_widget/master/js/db.js"></script>\n' +
            '<script scr="https://rawgit.com/greenCMETAHA/js_calendar_widget/master/js/calendar.js"></script>\n' +
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

/**
 * Получаем настройки для виджета из БД
 *
 * @name getWidgetText
 * @callback getSettingsJSONFromDB
 * @description Получаем текст для виджета из БД. Если такого пока нет, создаём по шаблону
 * 
 * @return {object}  набор настроек для виджета (хэш)
 * 
 */
function getSettings() {

    return getSettingsJSONFromDB();
}

/**
 * Устанавливаем одну из настроек для виджета
 *
 * @name setPropertyForSettings
 * @param {string} elementName Имя настройки
 * @param {object} obj объект настроек (хэш)
 * @param {string} field имя поля настройки в объекте
 * 
 */
function setPropertyForSettings(elementName, obj, field) {
    let el=document.getElementById(elementName);
    if (el){
        obj[field]=el.checked;
    }else{
        console.log("No field "+elementName);
    }     
}

/**
 * Создаём настройки по умолчанию и сохраняем их в БД
 *
 * @name saveSettings
 */
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


/**
 * Сохраняем текст виджета
 *
 * @name saveWidgetText

 * @return {string} текст виджета
 * 
 */
function saveWidgetText() {
    let value="";
    //let el=document.getElementById("widgetTestTextarea");
    //if (el){
        //let value=el.text;
        let settings=getSettings();
        value = '<script scr="https://rawgit.com/greenCMETAHA/js_calendar_widget/master/js/db.js"></script>\n' +
            '<script scr="https://rawgit.com/greenCMETAHA/js_calendar_widget/master/js/calendar.js"></script>\n' +
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
