var express = require('express');
var render = require("helpers/render");
var methodOverride = require('method-override')

module.exports = function(selfie_client) {
  var auth = require('helpers/middleware')(selfie_client);
  var router = express.Router();

  router.use(auth.check_logged_in);
  router.use(auth.check_admin_logged_in);
  router.use(methodOverride('_method'));

  router.get('/', function(req, res) {
    render(res, 'admin/index')
  });

  router.get('/users', function(req, res) {
    selfie_client.users.list(function(err, users) {
      if (err) {
        abort(500)
      } else {
        render(res, 'admin/users/index', {users: users.data})
      }
    })
  });

  router.get('/questions', function(req, res) {
    selfie_client.questions.list(function(err, questions) {
      if (err) {
        abort(500)
      } else {
        render(res, 'admin/questions/index', {questions: questions.data})
      }
    })
  });

  router.get('/questions/new', function(req, res) {
    render(res, 'admin/questions/new', {question: req.query.question})
  });

  router.post('/questions', function(req, res) {
    selfie_client.questions.new({question:req.body.question}, function(err) {
      if (err) {
        res.flash("danger", err)
        res.redirect("/admin/questions/new?question="+req.body.question)
      } else {
        res.redirect("/admin/questions")
      }
    })
  });

  router.get('/questions/:id', function(req, res) {
    selfie_client.questions.show(req.params.id, function(err, question) {
      if (err) {
        abort(500)
      } else {
        render(res, 'admin/questions/edit', {question: question})
      }
    })
  });

  router.post('/questions/:id', function(req, res) {
    console.log("update")
    var id = req.params.id
    var question = req.body.question
    selfie_client.questions.update(id, {question:question}, function(err) {
      if (err) {
        res.flash("danger", err)
      }
      res.redirect("/admin/questions/" + id)
    })
  });

  router.delete('/questions/:id', function(req, res) {
    console.log("delete")
    selfie_client.questions.delete(req.params.id, function(err) {
      if (err) {
        res.flash("danger", err)
      } else {
        res.redirect("/admin/questions")
      }
    })
  });

  return router;
};
