function addFoodToDatabase() {
    let foodName = document.getElementById('createfood-input');
    let foodServingSize = document.getElementById('createfood-servingsize');
    let foodCalories = document.getElementById('createfood-calories');

    data = {
        foodName: foodName,
        foodServingSize: foodServingSize,
        foodCalories: foodCalories
    };

    let response = fetch('/food/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function addEntryToDatabase() {
    let foodId = document.getElementById('createentry-foodid');
    let foodServingSize = document.getElementById('createentry-servingsize');

    data = {
        foodId: foodId,
        foodServingSize: foodServingSize
    };

    let response = fetch('/diary/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

