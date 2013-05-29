<?php

// php 5.3 でテストしているため datasource.php から 派生

/*
{
  "id": "block_id.list",
  "total": 150,
  "rows": [
    {
        "id": "1",
        "name": "suin",
        "age": 21,
        "flag": 0
    },
    {
        "id": "2",
        "name": "reoring",
        "age": 0,
        "flag": 0
    },
    {
        "id": "3",
        "name": "test",
        "age": 0,
        "flag": 0
    },
    {
        "id": "4",
        "name": "aaa",
        "age": 0,
        "flag": 0
    }
  ]
}*/

$total = 20;

$typeStr = "tester";
$addtionalParams = isset($_GET['addtionalParams']) ? $_GET['addtionalParams'] : null;
if ($addtionalParams ) {
    $addtionlParamsObject = json_decode($addtionalParams);
    $typeStr = $addtionlParamsObject->type;
}

$data = array();
for ($id = 1; $id <= $total; $id += 1) {
    $data[] = array(
        'id' => md5($typeStr . $id),
        'name' => $typeStr . $id,
        'age' => $id - 1,
    );
}

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$rowsPerGrid = isset($_GET['rowsPerGrid']) ? intval($_GET['rowsPerGrid']) : 20;
$offset = ($page - 1) * $rowsPerGrid;
$length = $rowsPerGrid;

$window = array_slice($data, $offset, $length);


header('Content-type: text/json');
echo json_encode(array(
    'id' => 'block_id.list',
    'total' => $total,
    'rows' => $window,
));
