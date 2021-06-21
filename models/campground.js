const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

// https://res.cloudinary.com/dppjuascu/image/upload/w_300/v1620014297/YelpCamp/ybvksyexayyxyyaijl8n.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_150')
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
}, opts)

CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 50)}...</p>
  <img src="${this.images[0].url}" style="width: 200px" />
  `
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
