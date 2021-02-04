console.log("Sanity Check: JS is working!");

let domain = "localhost";
let port = 8000;

let backendRoute = new URL("http://"+domain+":"+port+"/api");

// test case for single level array of objects
// !!! value cannot have comma
let jsonResult = [
    {item:'tea', price:10, quantity:2, shippingcost:0, deliverydays:14, ordernumber:00000000000000001, address:'726 Jackson PI NW Washington DC 20506', tax:0.085},
    {item:'coffee', price:15, quantity:1, shippingcost:0, deliverydays:7, ordernumber:00000000000000002, address:'726 Jackson PI NW Washington DC 20506', tax:0.085},
    {item:'dumbbell', price:100, quantity:2, shippingcost:10, deliverydays:14, ordernumber:00000000000000003, address:'726 Jackson PI NW Washington DC 20506', tax:0.085},
    {item:'The How Not to Die Cookbook: 100+ Recipes to Help Prevent and Reverse Disease Kindle', price:14.99, quantity:1, shippingcost:0, deliverydays:0, ordernumber:00000000000000004, address:'726 Jackson PI NW Washington DC 20506', tax:0.085}
];

// display JSON result in pre
const displayResult = (jsonResult) => {
    let pre = document.getElementById('preresult');
    pre.innerHTML = JSON.stringify(jsonResult, null, 4);
}

// copy JSON result to clipboard, I use "textarea" to maintain text format
// "input" will be string
const copyToClipboard = () => {
    var textToCopy = document.getElementById("preresult").innerText;
    var tempInputElem = document.createElement("textarea"); // textarea save text format too
    tempInputElem.type = "text";
    tempInputElem.value = textToCopy;
    document.body.appendChild(tempInputElem);
    tempInputElem.select(); // select only work for input or textarea
    tempInputElem.setSelectionRange(0, 99999)   // for mobile phone
    document.execCommand("Copy");
    document.body.removeChild(tempInputElem);
}

////////////////////////////////// PDF //////////////////////////////////
// make PDF with jspdf and jspdf-autotable
// Default export is a4 paper, portrait, using millimeters for units
const convertAndDownloadPDF = (jsonResult) => {
    let header = Object.keys(jsonResult[0]);
    let data = jsonResult.map(e=>Object.values(e));
    // var doc = new jsPDF({ orientation: "landscape" })
    var doc = new jsPDF()
    doc.autoTable({
        head: [header],
        body: [...data],
    })
    // download with the name test.pdf
    doc.save('test.pdf')
};
////////////////////////////////// PDF //////////////////////////////////

////////////////////////////////// CSV //////////////////////////////////
// html attribute download file
const download = (filename, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

// converter JSON to CSV return string, than download
const convertAndDownloadCSV = (jsonResult) => {
    // incase of result is not an array of object, convert to json string than, to json object
    // usually "array" is same as given "jsonResult"
    var objArray = JSON.stringify(jsonResult);
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = Object.keys(array[0]).join()+'\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line != '') {
                line += ',';
            }
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    download('test.csv', str);
};
////////////////////////////////// CSV //////////////////////////////////

// submit button clicked, pass form data into scrape function and invoke it
$(function(){
    // display JSON result in pre
    displayResult(jsonResult);

    // need start with static element for event binding on dynamically created elements
    $(".container").on("click", "#btnpdf", function(){
        convertAndDownloadPDF(jsonResult);
    });
    // onclick convert JSON to CSV and download it
    $(".container").on("click", "#btncsv", function(){
        convertAndDownloadCSV(jsonResult);
    });

    // onclick copy result inside pre to clipboard
    $(".container").on("click", "#btncopy", function(){
        copyToClipboard();
    });
});
