<?php

$json = array();
$mysqli = new mysqli("localhost", "root", "root66", "janzerfaust");

$action = filter_input(INPUT_GET, "action");
if($action === null) {
	$json["error"] = "no action set";
}
if($action === "topscore") {
	$res = $mysqli->query("SELECT user, score FROM jp_score ORDER BY score desc, added asc LIMIT 10");
	$i = 1;
	while($row = $res->fetch_object()) {
		$json["scores"][] = array("user" => $i . ". " . $row->user, "score" => $row->score);
		$i++;
	}
}
else if($action === "add") {
	$user = filter_input(INPUT_GET, "u");
	$score = filter_input(INPUT_GET, "s");
	
	if($user !== null && $score !== null && strlen($user) > 2) {
		$user = strtoupper(substr($user, 0, 3));
	}
	$stmnt = $mysqli->prepare("INSERT INTO jp_score (user, score) VALUES (?, ?)");
	$stmnt->bind_param("si", $user, $score);
	if(!$stmnt->execute()) {
		$json["error"] = "$stmnt->error";
	}
}

echo json_encode($json);