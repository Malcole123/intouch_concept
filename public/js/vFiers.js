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


  
const imageEncode = async (inputID)=>{
    let base64String = "";
    var file = document.querySelector(`#${inputID}`)['files'][0];
    var str = ""
    var reader = new FileReader();      
    reader.onload = ()=>{
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        str = base64String;
    }
    reader.readAsDataURL(file);
}

var relativeDate = (function(undefined){

  var SECOND = 1000,
      MINUTE = 60 * SECOND,
      HOUR = 60 * MINUTE,
      DAY = 24 * HOUR,
      WEEK = 7 * DAY,
      YEAR = DAY * 365,
      MONTH = YEAR / 12;

  var formats = [
    [ 0.7 * MINUTE, 'just now' ],
    [ 1.5 * MINUTE, 'a minute ago' ],
    [ 60 * MINUTE, 'minutes ago', MINUTE ],
    [ 1.5 * HOUR, 'an hour ago' ],
    [ DAY, 'hours ago', HOUR ],
    [ 2 * DAY, 'yesterday' ],
    [ 7 * DAY, 'days ago', DAY ],
    [ 1.5 * WEEK, 'a week ago'],
    [ MONTH, 'weeks ago', WEEK ],
    [ 1.5 * MONTH, 'a month ago' ],
    [ YEAR, 'months ago', MONTH ],
    [ 1.5 * YEAR, 'a year ago' ],
    [ Number.MAX_VALUE, 'years ago', YEAR ]
  ];

  function relativeDate(input,reference){
    !reference && ( reference = (new Date).getTime() );
    reference instanceof Date && ( reference = reference.getTime() );
    input instanceof Date && ( input = input.getTime() );
    
    var delta = reference - input,
        format, i, len;

    for(i = -1, len=formats.length; ++i < len; ){
      format = formats[i];
      if(delta < format[0]){
        return format[2] == undefined ? format[1] : Math.round(delta/format[2]) + ' ' + format[1];
      }
    };
  }

  return relativeDate;

})();


export { validEmailCheck, phoneFormatter, dateFormatter, imageEncode , relativeDate};
