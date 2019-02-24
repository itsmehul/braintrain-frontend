export function getDaysLeft(date){
    const oneDay = 24*60*60*1000;
    const firstDate = new Date(date)
    const secondDate = new Date()

return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

export function formatDate(date){
var mydate = new Date(new Date(date));
var month = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"][mydate.getMonth()];
var str = month + ' ' + mydate.getFullYear();
console.log(str)
return str
}