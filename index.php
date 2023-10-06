<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require __DIR__ . '/vendor/autoload.php';
$pdo = new PDO('mysql:host=localhost;dbname=hackathon-2023', "root", "");
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function array_map_recursive($callback, $array){
  $func = function ($item) use (&$func, &$callback) {
    return is_array($item) ? array_map($func, $item) : call_user_func($callback, $item);
  };

  return array_map($func, $array);
}

function chadiiiCrypt($string, $salt, $locked) {
	$len = strlen($string);
	for ($i = 0; $i < $len+$salt; $i++) {
		$string = md5(sha1($string)).sha1(md5($string));
	}
	return ($locked) ? password_hash($string, PASSWORD_DEFAULT) : $string;
}

function select ($pdo, $columns, $table, $contains) {
	$columns = (array)$columns;
	$contains = implode('', array_map(function ($r, $k) use ($contains, $pdo) {
		extract($r);
		return 
			@((!$with_prev OR $k == 0) && $contains[$k+1]['with_prev'] ? '(' : null). //verifie et place une parenthese
			("JSON_CONTAINS(row, ".$pdo->quote(json_encode(htmlentities(htmlspecialchars($value)))).", '$.$key')"). //contenu de la condtion
			@($with_prev && !$contains[$k+1]['with_prev'] ? ')' : null). //verifie et place une parenthèse
			@(!isset($contains[$k+1]) ? null : " $next "); //place la fonction logique
	}, $contains, array_keys($contains)));

	$fetch = $pdo->query("SELECT * FROM $table ".(!empty($contains) ? "WHERE $contains" : null).";")->fetchAll();
	return array_map(function($fetchRow) use ($columns) {
		$row = array_merge( ['id' => $fetchRow['id']], (array)json_decode(html_entity_decode(htmlspecialchars_decode($fetchRow["row"]))) );
		if (!in_array('*', $columns)) $row = array_intersect_key($row, array_flip($columns));
		return $row;
	}, $fetch);
}

// app()->get('/', function() {
// 	echo json_encode("GET");
// });
app()->post('/login', function() use ($pdo) {
	response()->json(
		//request()->body()
		/* [
			"ID" => "nakschadiii",
			"email" => "admin@citizensync.com",
			"password" => chadiiiCrypt('intérêt', $salt, true),
			"salt" => $salt,
			"firstname" => "NAKS",
			"lastname" => "Chadiii"
		] */
		(function() use ($pdo) {
			$res = fn($status, $message, $id = null) => ["status" => $status, "message" => $message, 'id' => $id];
		
			$salt = rand(1, 20);
			$foundAccounts = select($pdo, '*', 'users', [
				["value" => request()->get('id'), "key" => "email", "with_prev" => false, "next" => "OR"],
				["value" => request()->get('id'), "key" => "IDkey", "with_prev" => true, "next" => null]
			]);

			if (!empty($foundAccounts)) {
				foreach ($foundAccounts as $v)
					if (password_verify(chadiiiCrypt(request()->get('password'), $v['salt'], false), $v['password']))
						return $res(true, "Connexion réussie", $v['id']);
				return $res(false, "Le mot de passe ne semble pas corrsepondre");
			}else{
				return $res(false, "Aucun compte trouvé", $foundAccounts);
			}
		})()
	);
});

app()->all('/data', function() use ($pdo) {
	response()->json(
		(function() use ($pdo) {
			return array_merge(...array_map(
				function($table) use ($pdo) {
					return [
						$table => array_map_recursive(
							fn($v) => json_decode(html_entity_decode(htmlspecialchars_decode($v))),
							$pdo->query("SELECT * FROM `$table`")->fetchAll()
						)
					];
				},
				array_filter(array_merge(...array_map(
					"array_values",
					$pdo->query('SHOW TABLES')->fetchAll()
				)), function($v) {
					return !in_array($v, ['users']);
				})
			));
		})()
	);
});

app()->run();


?>