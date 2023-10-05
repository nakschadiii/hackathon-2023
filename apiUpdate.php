<?php

    require __DIR__ . '/vendor/autoload.php';

	echo "Chargement...", "\n";
	try {
		function fetchAPItoDB ($endpoint, $url) {
			include "connect.php";
	
			$JSON = file_get_contents($url);
			$apiFetch = (array)json_decode($JSON);
			list($dataColumns, $dataValues) = [
				array_intersect(
					...array_map(
						fn($v) => array_keys((array)$v),
						(array)$apiFetch['results']
					)
				),
				array_map(
					fn($v, $k) => array_merge(array_map(
						fn($v) => json_encode($v),
						(array)$v
					), ['id' => $k+1]),
					(array)$apiFetch['results'],
					array_keys((array)$apiFetch['results'])
				)
			];
	
			$cols = implode(", ", array_map(fn($v) => "`$v` JSON NOT NULL", $dataColumns));
			$sql = implode("\n", [
				<<<SQL
				CREATE TABLE IF NOT EXISTS `hackathon-2023`.`{$endpoint}` ( `id` INT NOT NULL AUTO_INCREMENT, {$cols}, PRIMARY KEY (`id`) );
				SQL,
				...array_map(function($v) use ($endpoint) { return <<<SQL
				ALTER TABLE `hackathon-2023`.`{$endpoint}` ADD COLUMN IF NOT EXISTS $v JSON NOT NULL;
				SQL; }, $dataColumns),
				...array_map(function($v) use ($endpoint) {
					$v = (array)$v;
					$vKeys = implode(', ', array_keys($v));
					$vVals = implode(', ', array_map("json_encode", array_values($v)));
					$updateVals = implode(',',
						array_map(
							fn($k, $v) => "$k = $v",
							array_keys($v),
							array_map("json_encode", array_values($v))
						)
					);
					return <<<SQL
					INSERT INTO `hackathon-2023`.`{$endpoint}` ({$vKeys}) VALUES ({$vVals}) ON DUPLICATE KEY UPDATE {$updateVals};
					SQL;
				}, $dataValues)
			]);
	
			return $pdo->query($sql);
		}
	
		fetchAPItoDB("quality_air", "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/qualite-de-l-air-concentration-moyenne-no2-pm2-5-pm10/records?limit=20");
	} catch (Exception $e) {
		echo "\033[31m[?] Echec de la mise à jour : ",  $e->getMessage(), "\n";
	} finally {
		if (!isset($e)) echo "\033[92m[i] Mise à jour reussie", "\n";
	}

?>