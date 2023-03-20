var expected_response = {
    "id": 1,
    "title": "The FIRST task",
    "body": "This is my first task",
	"status": "New",
    "ownerId": 1,
    "comments": [
        {
            "id": 1,
            "body": "some comment",
            "taskId": 1,
            "ownerId": 1
        }
    ]
}
pm.test("Response includes correct information", function () {
    pm.expect(expected_response).to.eql(pm.response.json());
});