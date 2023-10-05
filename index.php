<?php

require __DIR__ . '/vendor/autoload.php';
include "connect.php";

app()->get('/', function() {
	echo "Connecting";
});
app()->run();


?>