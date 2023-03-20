var jsonData = pm.response.json();
var firstTask = {
    "id": 1,
    "title": "The FIRST task",
    "body": "This is my first task",
	"status": "New",
    "ownerId": 1
}
pm.test("Check first task Data", function () {    
    //assume that the first task won't change
    pm.expect(jsonData[0]).to.eql(firstBlogPost);
});

pm.test("Check that each task has required fields", function () {
    var x;
    for (x in jsonData) {
        utils.check_task_keys(jsonData[x]);
    } 
});