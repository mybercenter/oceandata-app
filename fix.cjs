const fs=require('fs');
const path=require('path');
const dir='c:/Users/ASUS/Documents/PROJECT/oceandata/app/src/stores';
const files=fs.readdirSync(dir);
files.forEach(f=>{
  if(f.endsWith('.store.ts')){
    let code=fs.readFileSync(path.join(dir,f),'utf-8');
    code=code.replace(/useToast\(\)\.addToast\('Error',\s*(.+?),\s*'error'\)/g,"useToast().error('Error', $1)");
    code=code.replace(/useToast\(\)\.addToast\('Success',\s*(.+?),\s*'success'\)/g,"useToast().success('Success', $1)");
    fs.writeFileSync(path.join(dir,f),code);
  }
});
