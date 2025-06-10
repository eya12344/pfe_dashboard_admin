// Ajout du schéma de localisation
const userSchema = new mongoose.Schema({
  // Champs existants
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  // Nouveaux champs de localisation
  location: {
    latitude: Number,
    longitude: Number,
    country: String,
    city: String
  },
  // Autres champs existants
  isAdmin: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });