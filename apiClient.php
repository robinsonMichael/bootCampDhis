<?php
error_reporting(E_ALL & ~E_NOTICE);

require_once 'config.php';

$cache = new Memcached();

if ($cache->isPristine()) {
   $cache->addServer("localhost", 11211);
}

if($_GET['action'] == 'list') {
    
   $page = $_GET['page'];
   
   if(!($data = $cache->get("page_".$page)) && $cache->getResultCode() == Memcached::RES_NOTFOUND ) {
        $ch = curl_init("http://test.hiskenya.org/api/users.json?page=$page");

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERNAME, USERNAME);
        curl_setopt($ch, CURLOPT_PASSWORD, PASSWORD);
        $data = curl_exec($ch);
        
        $cache->add("page_".$page,$data);
        curl_close($ch);
   }
   
   echo $data;
   
} else if($_GET['action'] == 'info') {
    $id = $_GET['id'];    
    if(!($data = $cache->get("user_".$id)) && $cache->getResultCode() == Memcached::RES_NOTFOUND) {
        $url = $_GET['url'];

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERNAME, USERNAME);
        curl_setopt($ch, CURLOPT_PASSWORD, PASSWORD);

        $data = curl_exec($ch);
        
        $cache->add("user_".$id,$data);
        curl_close($ch);
    }
    
    echo $data;
}

?>
