<?php

$data="";
$data="# Latest Status";
$data.="\n\n\n";
$points=[];
if (isset($_POST)) {
    for ($i=0; $i < 500; $i++) { 
        $points[$i]=$_POST["elo_".$i];
    }
    echo($points["elo_"+0]);
    arsort($points);
    $s=1;
    foreach ($points as $key => $value) {
        $data.=$s."- > ".$key.":".$value."<br />\n";
        $s++;
    }
    $f=fopen("../../examples/BackupYavuz/status.md","w");
    fwrite($f,$data);
    fclose($f);
    echo "OK";
}
?>