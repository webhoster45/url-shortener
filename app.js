const express=require('express');
const path=require('path');
const PORT=process.env.PORT||5000;
const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fs=require('fs').promises;

const app=express()
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('/public'));

function generatelogic(){
    let string='';
    for(let i=0;i<6;i++){
    randomize=Math.floor(Math.random()*characters.length);
    string+=characters[randomize];

    }
    return string;
}

// console.log(generatelogic())

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

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'));

})

app.post('/shorten',async (req,res)=>{
    console.log(req.body.url);
    const store={
        original_url:req.body.url,
        shortcode:generatelogic(),
        created_at:Date.now(),
        click_count:0
    }
    const shortendb=await readJSON('/db/shortendb.JSON');
    shortendb.push(store);
    await writeJSON('/db/shortendb.JSON',shortendb);
        res.json({message:'Uploaded',newlink:store.shortcode});
});

app.get('/:shortcode',async (req,res)=>{

})

app.listen(PORT,()=>{
    console.log(`Listening for requests on PORT:${PORT}`)
})
