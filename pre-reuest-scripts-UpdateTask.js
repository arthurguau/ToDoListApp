//get original value
var base_url = pm.environment.get("base_url");
var task_id = pm.environment.get("task_id");

pm.sendRequest({url:`${base_url}/tasks/${task_id}`,method: 'GET'}, function (err, response) {
    pm.environment.set("original_get_response",response.json());
});