var express = require('express');
var router = express.Router();
var axios = require('axios')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ data: 'WEATHER' });
});

async function getCoordinates(city){
  try {
    const token =  process.env.MAPBOX_TOKEN
    console.log("check token: ",token)
    const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${token}`)
    console.log(res.data)
    if(res.data.features.lenght !== 0){
      return res.data.features[0]
    }
    return null
  }catch(err){
    console.log(err)
    return null
  }
  
}

async function getWeather([lng, lat]) {
  try {
    const token= process.env.OPENWEATHER_TOKEN
    console.log("check token openweather", token)
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${token}&units=metric`)
    return res.data

  }catch(err){
    console.log(err)
    return null
  }
  
}


router.get('/weather', async function(req, res, next) {
  try {
        console.log(req.query)
        const {city} = req.query

        if (!city){
        return res.status(400).json({error: "City querry is required"})
          }
        // call api from mapbox
       const coordinates= await getCoordinates(city)
       if(!coordinates){
        return res.status(400).json({error: "Place not found"}) 
       }
       console.log(coordinates)
      //  call api from opeweather app
      const result = await getWeather(coordinates.geometry.coordinates)
      console.log("check result trong try: ", result)   //geometry following the documentation
       if (!result){
        return res.status(400).json({error: "Can not find weather forcast at your place"}) 
       }
       res.json({data:result})

  }catch(err){
    console.log(err)
    return res.send("ok")
  }
  
  
});




module.exports = router;