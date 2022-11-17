const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// new page
router.get('/new', (req, res) => {
  res.render('new')
})
// create data
router.post('/', (req, res) => {
  const userId = req.user.id
  const name = req.body.name
  return Todo.create({name, UserId: userId})
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})
// detail page
router.get('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.error(error))
})
// edit page
router.get('/:id/edit', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.error(error))
})
//edit data
router.put('/:id', (req, res) => {
  const userId = req.user
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => {
      todo.toJSON().name = req.body.name
      todo.toJSON().isDone = req.body.isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.error(error))
})
// delete data
router.delete('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router