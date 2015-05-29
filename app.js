var express = require('express'),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

mongoose.connect('INSERT LINK');

var Blog = mongoose.model('Blog', {
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set the templating to jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set the static files
app.use(express.static(__dirname + '/public'));
// Use morgan for our routing
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// INDEX
app.get('/', function(request, response){
  Blog.find(function(error, blogs){
    if(error){
      response.send(error);
    }
    response.render('blogs/index', {title: 'Blogs', blogs: blogs});
  });
});

// NEW
app.get('/blogs/new', function(request, response){
  response.render('blogs/new', {
    title: 'New blog'
  });
});

// CREATE
app.post('/blogs', function(request, response){
  var blog = new Blog();
  blog.title = request.body.title;
  blog.content = request.body.content;

  blog.save(function(error){
    if(error){
      response.send(error);
    }
    response.redirect('/');
  });
});

// SHOW
app.get('/blogs/:id', function(request, response){
  Blog.findOne({_id: request.params.id}, function(error, blog){
    if(error){
      response.send(error);
    }
    response.render('blogs/show', {title: blog.title, blog: blog});
  });
});

// EDIT
app.get('/blogs/:id/edit', function(request, response){
  Blog.findOne({_id: request.params.id}, function(error, blog){
    if(error){
      response.send(error);
    }
    response.render('blogs/edit', {title: blog.title, blog: blog});
  });
});

// UPDATE
app.put('/blogs/:id', function(request, response){
  Blog.update({_id: request.params.id}, {
    title: request.body.title,
    content: request.body.content
  }, function(error, blog){
    if(error){
      response.send(error);
    }
    response.redirect('/');
  });
});

// DESTROY
app.delete('/blogs/:id', function(request, response){
  Blog.findByIdAndRemove(request.params.id, function(error){
    if(error){
      response.send(error);
    }

    response.redirect('/');
  });
});


// Listen on 3000
app.listen(3000);
console.log("App listening on port 3000");
