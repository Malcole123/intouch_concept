if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const axios = require('axios').default
var restpack = require("@restpack/client").default;

const _temp_Directory = 'views/resume/_templates';
const fs = require('fs');

const pdfApiKey = process.env.CLOUDLAYER_API_KEY
const pdfApiURL = process.env.CLOUDLAYER_API_BASE

var templateFiles = [];

fs.readdir(_temp_Directory, (err, files) => {
  files.forEach(file => {
      templateFiles.push(file)
  });
});

const templateSorter = (index)=>{
    return{
        ok:true,
        path: templateFiles[index-1]
        }
}

var html2pdf = restpack.html2pdf("DuuLYVBlkJNY4HXbg3QFFhEBAIvPOxfkybZrwcR9HkRBC99F");

const pdfGenerator = async (html)=>{
    const response = html2pdf.convertHTML(html, {
        pdf_height: "1026px",
        pdf_width:'816px' /* , other options */,
      }).then(res=>{ 
          return res
        })
      return response
}
module.exports = {
    tSorter:templateSorter,
    pdfGen:pdfGenerator,
}