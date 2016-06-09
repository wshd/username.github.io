<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

require 'Slim/Slim.php';

$app = new Slim();
// client
$app->get('/clients', 'getClients');
$app->get('/clients/:id', 'getClient');
$app->post('/add_client', 'addClient');
$app->put('/clients/:id', 'updateClient');
$app->delete('/clients/:id', 'deleteClient');
$app->options('/clients/:id', 'accept');
$app->options('/add_client', 'accept');
//region
$app->get('/regions', 'getRegions');
$app->get('/region_date/:date', 'getRegionsForDate');
$app->get('/regions/:id', 'getRegion');
$app->post('/add_region', 'addRegion');
$app->put('/regions/:id', 'updateRegion');
$app->delete('/regions/:id', 'deleteRegion');
$app->options('/regions/:id', 'accept');
$app->options('/add_region', 'accept');
//order
$app->get('/orders', 'getOrders');
$app->get('/order_date/:date', 'getOrdersForDate');
$app->get('/order_history', 'getOrdersHistory');
$app->get('/orders/:id', 'getOrder');
$app->post('/add_order', 'addOrder');
$app->put('/orders/:id', 'updateOrder');
$app->delete('/orders/:id', 'deleteOrder');
$app->options('/orders/:id', 'accept');
$app->options('/add_order', 'accept');


$app->get('/clients_old', 'getClientsOld');
$app->get('/regions_old', 'getRegionsOld');
$app->get('/orders_old', 'getOrdersOld');


$app->run();

/* users */
function getUsers() {
	$sql = "select * FROM users ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getUser($id) {
	$sql = "select * FROM users WHERE id=".$id." ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addUser() {
	$request = Slim::getInstance()->request();
	$user = json_decode($request->getBody());
	$sql = "INSERT INTO users (username, first_name, last_name, address) VALUES (:username, :first_name, :last_name, :address)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("username", $user->username);
		$stmt->bindParam("first_name", $user->first_name);
		$stmt->bindParam("last_name", $user->last_name);
		$stmt->bindParam("address", $user->address);
		$stmt->execute();
		$user->id = $db->lastInsertId();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateUser($id) {
	$request = Slim::getInstance()->request();
	$user = json_decode($request->getBody());
	$sql = "UPDATE users SET username=:username, first_name=:first_name, last_name=:last_name, address=:address WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("username", $user->username);
		$stmt->bindParam("first_name", $user->first_name);
		$stmt->bindParam("last_name", $user->last_name);
		$stmt->bindParam("address", $user->address);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteUser($id) {
	$sql = "DELETE FROM users WHERE id=".$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


/* clients */
function getClients() {
	$sql = "SELECT c . * , r.name AS region FROM client c, region r WHERE c.region_id = r.id ORDER BY c.id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getClient($id) {
	$sql = "select * FROM client WHERE id=".$id." ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addClient() {
	$request = Slim::getInstance()->request();
	$client = json_decode($request->getBody());
	$sql = "INSERT INTO client(name, address, phone, region_id) VALUES (:name, :address, :phone, :region_id)";
	//$sql = "INSERT INTO users (username, first_name, last_name, address) VALUES (:username, :first_name, :last_name, :address)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $client->name);
		$stmt->bindParam("address", $client->address);
		$stmt->bindParam("phone", $client->phone);
		$stmt->bindParam("region_id", $client->region_id);
		$stmt->execute();
		$client->id = $db->lastInsertId();
		$db = null;
		echo json_encode($client); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateClient($id) {
	$request = Slim::getInstance()->request();
	$client = json_decode($request->getBody());
	$sql = "UPDATE client SET name=:name, address=:address, phone=:phone, region_id=:region_id WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $client->name);
		$stmt->bindParam("address", $client->address);
		$stmt->bindParam("phone", $client->phone);
		$stmt->bindParam("region_id", $client->region_id);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($client); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteClient($id) {
	$sql = "DELETE FROM client WHERE id=".$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


/* regions */
function getRegions() {
	$sql = "select * FROM region ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getRegionsForDate($date) {
	$sql = "select r.id, r.name, COUNT(o.id) as order_amount, SUM(IFNULL(o.weight, 0)) as order_total_weight FROM region r LEFT JOIN `order` o ON r.id = o.region_id and o.`date` = '".$date."' GROUP BY r.id, r.name ORDER BY r.id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getRegion($id) {
	$sql = "select * FROM region WHERE id=".$id." ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addRegion() {
	$request = Slim::getInstance()->request();
	$region = json_decode($request->getBody());
	$sql = "INSERT INTO region(name) VALUES (:name)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $region->name);
		$stmt->execute();
		$region->id = $db->lastInsertId();
		$db = null;
		echo json_encode($region); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateRegion($id) {
	$request = Slim::getInstance()->request();
	$region = json_decode($request->getBody());
	$sql = "UPDATE region SET name=:name WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $region->name);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($region); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteRegion($id) {
	$sql = "DELETE FROM region WHERE id=".$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


/* orders */
function getOrders() {
	$sql = "select o.*, c.name as client_name, c.phone as client_phone, r.name as region  FROM `order` o LEFT JOIN client c ON o.client_id = c.id LEFT JOIN region r ON o.region_id = r.id ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getOrdersForDate($date) {
	$sql = "select o.*, c.name as client_name, c.phone as client_phone, r.name as region  FROM `order` o LEFT JOIN client c ON o.client_id = c.id LEFT JOIN region r ON o.region_id = r.id WHERE o.`date` = '".$date."' ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getOrdersHistory() {
	$sql = "SELECT o.date, COUNT( * ) AS amount, SUM( o.weight ) AS total_weight FROM  `order` o GROUP BY o.date ORDER BY o.date DESC ";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getOrder($id) {
	$sql = "select * FROM `order` WHERE id=".$id." ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addOrder() {
	$request = Slim::getInstance()->request();
	$order = json_decode($request->getBody());
	$sql = "INSERT INTO `order`(number, `date`, client_id, address, region_id, bags, goods, weight, comment) VALUES (:number, :date, :client_id, :address, :region_id, :bags, :goods, :weight, :comment)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("number", $order->number);
		$stmt->bindParam("date", $order->date);
		$stmt->bindParam("client_id", $order->client_id);
		$stmt->bindParam("address", $order->address);
		$stmt->bindParam("region_id", $order->region_id);
		$stmt->bindParam("bags", $order->bags);
		$stmt->bindParam("goods", $order->goods);
		$stmt->bindParam("weight", $order->weight);
		$stmt->bindParam("comment", $order->comment);
		$stmt->execute();
		$order->id = $db->lastInsertId();
		$db = null;
		echo json_encode($order); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateOrder($id) {
	$request = Slim::getInstance()->request();
	$order = json_decode($request->getBody());
	$sql = "UPDATE `order` SET number=:number, `date`=:date, client_id=:client_id, address=:address, region_id=:region_id, bags=:bags, goods=:goods, weight=:weight, comment=:comment WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("number", $order->number);
		$stmt->bindParam("date", $order->date);
		$stmt->bindParam("client_id", $order->client_id);
		$stmt->bindParam("address", $order->address);
		$stmt->bindParam("region_id", $order->region_id);
		$stmt->bindParam("bags", $order->bags);
		$stmt->bindParam("goods", $order->goods);
		$stmt->bindParam("weight", $order->weight);
		$stmt->bindParam("comment", $order->comment);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($order); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteOrder($id) {
	$sql = "DELETE FROM `order` WHERE id=".$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}




function getConnection_co_nf() {
	$dbhost="fdb2.biz.nf";
	$dbuser="1833965_db";
	$dbpass="IceCream100";
	$dbname="1833965_db";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getConnection() {
	$dbhost="localhost";
	$dbuser="user2714878";
	$dbpass="Q!W@E#R$";
	$dbname="db2714878-data";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh -> exec("set names utf8");
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getConnectionOld() {
	$dbhost="localhost";
	$dbuser="user2714878";
	$dbpass="Q!W@E#R$";
	$dbname="db2714878-data";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}


function getClientsOld() {
	$sql = "SELECT c . * , r.name AS region FROM client c, region r WHERE c.region_id = r.id ORDER BY c.id";
	try {
		$db = getConnectionOld();
		$stmt = $db->query($sql);
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getRegionsOld() {
	$sql = "select * FROM region ORDER BY id";
	try {
		$db = getConnectionOld();
		$stmt = $db->query($sql);
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getOrdersOld() {
	$sql = "select o.*, c.name as client_name, c.phone as client_phone, r.name as region  FROM `order` o LEFT JOIN client c ON o.client_id = c.id LEFT JOIN region r ON o.region_id = r.id ORDER BY id";
	try {
		$db = getConnectionOld();
		$stmt = $db->query($sql);
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

?>