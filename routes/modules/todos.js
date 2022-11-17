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
  const UserId = req.user.id
  const name = req.body.name
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})
// detail page
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.error(error))
})
// edit page
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.error(error))
})
//edit data
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.error(error))
})
// delete data
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router