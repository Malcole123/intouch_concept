const validEmailCheck = (email) => {
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  if (regex.test(email)) {
    return {
      email: email,
      ok: true,
    };
  } else {
    return {
      email: email,
      ok: false,
    };
  }
};

const phoneFormatter = async (number) => {
  const formatter = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6, 10)}`;
    }
  };
  var result = await formatter(number);
  return result

};


const dateFormatter = async (_date, _format, _splitter)=>{
  const toString = (month , day )=>{
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var days = ['Sun', 'Mon', 'Tue','Wed','Thur','Fri','Sat'];
    return { 
      dayStr: days[day],
      monthStr:months[month]
    }
  }
var today_date = new Date();
var curr_unix = today_date.valueOf(); //Reference for future or past

  if(_format.includes('unix')){
    var formattedDate = new Date(_date);
    var myd = await toString(formattedDate.getMonth(),formattedDate.getDay());
    if(curr_unix > _date){
      return{
        date:formattedDate.getDate(),
        day:formattedDate.getDay(),
        month:formattedDate.getMonth(),
        year:formattedDate.getFullYear(),
        m_y_d_str:myd, 
        future:false 
      }
    }else{
      return{
        date:formattedDate.getDate(),
        day:formattedDate.getDay(),
        month:formattedDate.getMonth(),
        year:formattedDate.getFullYear(),
        m_y_d_str:myd,
        future:true 
      }
    }
    
  }else{
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formattedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    var sentUnix = formattedDate.valueOf();
    if(sentUnix > curr_unix  ){
      return{
        day:formattedDate.getDay(),
        month:formattedDate.getMonth(),
        year:formattedDate.getFullYear(),
        m_y_d_str:await toString(formattedDate.getMonth(), formattedDate.getDay()),
        future:true
      }
    }else{
      return{
        day:formattedDate.getDay(),
        month:formattedDate.getMonth(),
        year:formattedDate.getFullYear(),
        m_y_d_str:await toString(formattedDate.getMonth(), formattedDate.getDay()),
        future:false
      }
    }
  
  }


}


export { validEmailCheck, phoneFormatter, dateFormatter};
