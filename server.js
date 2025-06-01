const express = require('express');

const app = express();

app.get('/',(req,res)=>console.log('Working'))



const PORT = process.env.PORT || 4000;

app.listen(PORT,()=> console.log(`Server started on ${PORT}`));

