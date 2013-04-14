<?php
header('Content-type: application/json');
$a=base64_decode($_REQUEST["p"]);
$xml =  simplexml_load_file($a);
$json = json_encode($xml);
print $json;
?>