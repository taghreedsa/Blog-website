const express = require('express');
const router = express.Router()
const Article = require('./../models/article')





// =====================
// Check Authorized User
// =====================
function checkSignIn(req , res , next){
    if(req.session.userId){
      next();
    }else{
      const err = new Error("You are not logged in !")
    next(err);
  
    }
   };




// ==================
// Main Index
// ==================
router.get("/" ,
  checkSignIn,
( req , res)=>{
    let id = req.session.userId
    Article.find({user : id}).sort({ createdAt: 'desc' })
    .then(article => {
        res.render("articles/index" , {article})
    })
    .catch(err => console.log(err))
    
  
})








// ==================
// Create new Article
// ==================
router.get('/new',
  checkSignIn,
 (req, res) => {
   
    res.render('articles/new')

})

  router.post('/', (req, res,) => {
    let id = req.session.userId
    console.log(id)
    let newArticle = {
      title: req.body.title,
      description: req.body.description,
      markdown : req.body.markdown,
      user : id
  };
  Article.create(newArticle)
      .then(article => {
          console.log('Article hasbeen created', article)
          res.redirect(`/articles/${article.id}`);
      })
      .catch(err => console.log(err))

  })

// ================
// Show one Article 
// =================
router.get('/:id' ,
checkSignIn,
 (req , res) =>{
    let id = req.params.id

    Article.findById(id)
    .then(article =>{

        res.render('articles/show' , {article})

    })
    .catch(err => console.log(err))
})


// ======================
// Edit & Update Article
// ======================

router.get("/:id/edit",
checkSignIn,
 (req, res) => {
  const id = req.params.id;
  Article.findById(id)
      .then(article => {
          res.render("articles/edit", { article: article });
      }).catch(err => console.log(err))
});


// Update Articale

router.put("/:id",
checkSignIn,
 (req, res) => {
    const id = req.params.id;
    let updateArticle = {
        title: req.body.title,
        description: req.body.description,
        markdown : req.body.markdown,
       
    };
    console.log(updateArticle)
    Article.findByIdAndUpdate(id, updateArticle)
        .then(article => {
            res.redirect(`/articles/${article.id}`);
        }).catch(err => console.log(err))


});


// ==================
// Delete Artical
// ==================
router.delete('/:id' , 
checkSignIn,
(req , res)=>{
    let id = req.params.id;
    Article.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/articles/')
    })
    .catch(err=> console.log(err))
    
    })


module.exports = router