const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const xml2js = require('xml2js');

 const file_path = '../Car/car.csv';
// const file_path = '../Car/car.xml'; 
// const file_path = '../Car/car.yml';
// const file_path = '../Car/car.txt';
// const file_path = '../Car/car.json';

// const file_path = '../Library/library.csv';
// const file_path = '../Library/library.xml';
// const file_path = '../Library/library.yml';
// const file_path = '../Library/library.txt';
// const file_path = '../Library/library.json';

function getFileType(filePath) {
    return path.extname(filePath).toLowerCase();
}

file_type = getFileType(file_path);

console.log(file_type);

if(file_type == ".json") {
    const data = JSON.parse(fs.readFileSync(file_path, 'utf-8'));
    console.log(data);
}
else if(file_type === ".xml") {
    const parser = new xml2js.Parser({
        explicitArray: false,  
        mergeAttrs: true       
    });

    const data = fs.readFileSync(file_path, 'utf-8');
    
    parser.parseString(data, (err, result) => {
        if (err) {
            console.log('Error parsing XML:', err);
            return;
        }

        
        if (typeof result === 'object') {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log('Parsed data is not in expected object format:', result);
        }
    });
}
else if(file_type == ".yml" || file_type == ".yaml") {
    const data = yaml.load(fs.readFileSync(file_path, 'utf-8'));
    console.log(data);
}
else if(file_type == ".txt") {
    const data = fs.readFileSync(file_path, 'utf-8');
    console.log(data);
}
else if(file_type == ".csv") {
    const data = fs.readFileSync(file_path, 'utf-8');
    console.log(data);
}