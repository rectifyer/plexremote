<?php
$ch = curl_init('http://192.168.0.100:3000/xbmcCmds/xbmcHttp?command=' . $_GET['command']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$result = curl_exec($ch);
curl_close($ch);
?>