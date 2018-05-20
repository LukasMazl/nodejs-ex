module.exports = {

    /*
    * Pokud neni v session userId uživatel je přesměrován na přihlašovací formulář
    */
    formateDate: function (date) {
        if(date) {
            var year = date.getDate();
            console.log(year);
            return "---";
        } else {
            return "---";
        }
    }
}