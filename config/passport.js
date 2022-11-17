const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  //LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))
  //FacebookStrategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        return User.create({
          name,
          email,
          password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10))
        })
          .then((user) => done(null, user))
          .catch((err) => done(err, false))
      })
  }))
  //序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  //反序列化
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}