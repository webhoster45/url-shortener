const express=require('express');
const multer = require('multer');
const path =require('path');
const fs=require('fs').promises;
const upload=multer({dest:'./public/uploads'});
const PORT=process.env.PORT||3000;
const app=express();

const getPath = (file) => path.join(__dirname, file);

async function readJSON(file) {
  try {
    const data = await fs.readFile(getPath(file), 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(getPath(file), '[]');
      return [];
    }
    throw err;
  }
}

async function writeJSON(file, data) {
  await fs.writeFile(getPath(file), JSON.stringify(data, null, 2));
}

app.use(express.json())
app.use(express.static(path.join(__dirname,'/public')));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
})

app.post('/upload',upload.array('files'),async (req,res)=>{
    const files=req.files;
    const filedata=await readJSON('filedata.json')
    files.forEach(file => {
      let newbox={
      savedas:file.filename,
      originalname:file.originalname,
      destination:file.destination,
      downloadurl:`/uploads/${file.filename}`
    }
    filedata.push(newbox)
    });
    await writeJSON('filedata.json',filedata)
    res.json({message:'done'})
})

app.get('/getallfiles',async (req,res)=>{
  const filedata=await readJSON('filedata.json')
  // console.log(filedata.length)
  res.json(filedata)
  // for(file of filedata){
// console.log(file[])
    // let paths=file.path
    //     console.log(paths)
    // res.json({paths})
  // }
})

app.listen(PORT,()=>{
    console.log(`App running at PORT:${PORT}`)
})