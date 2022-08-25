<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type:application/json;charset=UTF-8");
header("Access-Control-Max-Age:3600");
header("Access-Control-Allow-Headers: Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With");

// $username = 'root';
// $password = '';
// $database = new PDO("mysql:host=localhost;dbname=h_bdd;charset=utf8;",$username,$password);
// $items = $database->prepare("Select montant_ttc,montant_retenu,etat,name,annuler,agence from all_factures");
// $items->execute();
// $items = $items->fetchAll(PDO::FETCH_ASSOC);
// print_r(json_encode($items));
$conn = mysqli_connect("localhost","root","","h_bdd");
$sql = mysqli_query($conn,"Select montant_ttc,montant_retenu,etat,name,annuler,agence from all_factures");
$result = mysqli_fetch_all($sql,MYSQLI_ASSOC);

echo (json_encode($result));
?>