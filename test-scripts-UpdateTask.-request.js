var jsonData = pm.response.json()
pm.test("Check that each task has required fields", function () {
        utils.check_task_keys(jsonData);
});

//reset the post back to it's original state
var base_url = pm.environment.get("base_url");
var task_id = pm.environment.get("task_id");
var original_response = pm.environment.get("original_get_response")
pm.sendRequest({url:`${base_url}/tasks/${task_id}`,
    method: 'PUT',
    header:{'Content-Type': 'application/json'},
    body:{mode: 'raw', raw: original_response}}, 
    function (err, response) {
        console.log(response.json());
});