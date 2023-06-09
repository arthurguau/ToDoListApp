const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('local_db.json')
const middlewares = jsonServer.defaults()

function compareArrays(arr1,arr2){
  if (arr1.length != arr2.length)
    return false;

  for (var i = 0, l=arr1.length; i < l; i++) {
    // Check if we have nested arrays
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!arr1[i].equals(arr2[i]))
        return false;       
    }           
    else if (arr1[i] != arr2[i]) { 
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;   
    }           
  }       
  return true;
}

function checkForRequiredFields(requiredFields, req) {
  //check without id
  if (compareArrays(Object.keys(req.body),requiredFields)){
    return true;
  }
  //check with id
  requiredFields.unshift('id')
  if (compareArrays(Object.keys(req.body),requiredFields)){
    return true;
  }
  return false;
}

function allRequiredFieldsPresent(req){
  if (get_base_resource_from_url(req.url) == 'avatars'){
    var requiredFieldsAvatar = ['description','url','ownerId','taskId','commentId']
    return checkForRequiredFields (requiredFieldsAvatar, req);
  }
  if (get_base_resource_from_url(req.url) == 'comments') {
    var requiredFieldsComments = ['body','taskId','ownerId']
    return checkForRequiredFields (requiredFieldsComments, req);
  }
  return true;
}

function get_base_resource_from_url(url){
  return url.split('/')[1]
}

function get_expand_type_from_url(url){
  return url.split('=')[1]
}

function get_missing_fields(req){
  var requiredFieldsAvatar = ['description','url','ownerId','taskId','commentId']
  var missing_fields = [];
  for (var i=0; i <requiredFieldsAvatar.length; i++){
    var body_keys = Object.keys(req.body)
    if (body_keys.indexOf(requiredFieldsAvatar[i]) < 0 ){
      missing_fields.push(requiredFieldsAvatar[i]);
    }
  }
  return missing_fields
}
server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use((req, res, next) => {
  if (req.method === 'POST') {
    if (allRequiredFieldsPresent(req)){
      next()
    }else{
      
      res.status(400).jsonp({
        error: "Incorrect parameters given."
      })
      res.end();
    }
  }
  else if (req.method === 'PUT'){
    if (allRequiredFieldsPresent(req)){
      next()
    } else{
      var missing_fields = get_missing_fields(req)
      for(var i=0; i <missing_fields.length; i++){
        var new_field = missing_fields[i]
        req.body[new_field] = null
      }
      next()
    }  
  }
  else {
    var allowed_expandMap = {
      'avatars':['owner','task','comment'],
      'comments':['task','owner'],
      'tasks':['owner'],
      'owners':[]
    }
    if (req.url.includes('_expand')){
      var base_resource = get_base_resource_from_url(req.url)
      var expand_type = get_expand_type_from_url(req.url)
      var allowed_expand_types = allowed_expandMap[base_resource]
      if (allowed_expand_types.indexOf(expand_type)>=0){
        next();
      }else{
        res.status(400).jsonp({
          error: base_resource + " does not have a parent " + expand_type
        })
        res.end();
      }      
    }else{
      next();
    }
  }
})
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running. Requests can be accessed at http://localhost:3000/')
})