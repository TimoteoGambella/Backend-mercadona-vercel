function getweek(curr) {

    if (curr instanceof Date){
        curr.setDate(curr.getDate()-1);
        var week=[];
        
        for(var i = 0; i<7; i++) {   
            week.push({[i]:[getday(new Date( curr.setDate(curr.getDate() + 1)))]});            
            }
        return week;
    } else {
    return("Debe enviar una fecha valida")}
}
  
function getday(date){
    
    var months = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Juio", "Agosto","Septiembre","Octubre", "Noviembre", "Diciembre");
    var days = new Array("Dom","Lun","Mar","Mie","Jue","Vie","Sab");
    var curr_date = ("0" + date.getDate()).slice(-2);
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();
    var day = days[date.getDay()];

    return(JSON.stringify({dayname: day , daynumber:curr_date, monthname : months[curr_month], year: curr_year}));
}

module.exports=getweek