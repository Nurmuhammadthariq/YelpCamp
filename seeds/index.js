const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '6087876c7710281af4b83d69',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid id et debitis in, quae provident facilis nobis minus numquam quasi ea expedita, molestias aperiam cum odio, quaerat architecto rerum veritatis!',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dppjuascu/image/upload/v1619934096/YelpCamp/oktgwfyuw6idheolrdvq.jpg',
          filename: 'YelpCamp/oktgwfyuw6idheolrdvq',
        },
        {
          url: 'https://res.cloudinary.com/dppjuascu/image/upload/v1619934096/YelpCamp/da1kwmqdaoldr2ktn3qr.jpg',
          filename: 'YelpCamp/da1kwmqdaoldr2ktn3qr',
        },
      ],
    })
    await camp.save()
  }
}

seedDb().then(() => {
  mongoose.connection.close()
})
