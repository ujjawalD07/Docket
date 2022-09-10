const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB',{useNewUrlParser:true});
const itemschema={                 //Item schema
  name:String
}

const Item= mongoose.model("Item",itemschema)     //Item model

const item1=({
  name: "Welcome to the todo-list!"
})

const item2=({
  name:"Hit + to add an item"
})

const item3=({
  name:"<-- Press this to delete an item"
})

defaultitems=[item1,item2,item3]

app.get("/", function(req, res) {
  
  Item.find({},function(err,founditems)
  {
    if(founditems.length==0)
    {
      Item.insertMany(defaultitems,function(err)
      {
        if(err)
          console.log(err)
        else
          console.log("Successful")
      })
      res.redirect("/")
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: founditems});
    }
  })


});

app.post("/", function(req, res)
{
 const itemName = req.body.newItem;

  const item= new Item({
    name:itemName
  })

  item.save()
  res.redirect("/") 
});


app.post("/delete",function(req,res)
{
  const checkItemId= req.body.checkbox

  Item.findByIdAndRemove(checkItemId, function(err)
  {
    if(!err)
    {
      console.log("Successfully deleted")
      res.redirect("/")
    }
  })
})

const ListSchema={
  name:String,
  items:[itemschema]
}

const List=mongoose.model("List",ListSchema)

app.get("/:customListName",function(req,res)
{
  const customListName=req.params.customListName
 

  List.findOne({name:customListName},function(err,foundList)
  {
    if(!err)
    {
      if(foundList)
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      else
      {
        //create a new list
        const list= new List({
          name: customListName,
          items:defaultitems
        })
        list.save()
        res.redirect("/")
      }
    }
  })

})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
