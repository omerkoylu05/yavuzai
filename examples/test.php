
<?php
$var1 = [];
$var2 = 0;
$var3 = NULL;
$var4 = FALSE;
$var5 = array();
 
// Testing the variables
if(empty($var1)){
    echo 'This line is printed, because the $var1 is empty.';
}
echo "<br>";
 
if(empty($var2)){
    echo 'This line is printed, because the $var2 is empty.';
}
echo "<br>";
 
if(empty($var3)){
    echo 'This line is printed, because the $var3 is empty.';
}
echo "<br>";
 
if(empty($var4)){
    echo 'This line is printed, because the $var4 is empty.';
}
echo "<br>";
 
if(empty($var5)){
    echo 'This line is printed, because the $var5 is empty.';
}

$mem=fopen("./memory/memory.json","r+");
$str=fread($mem,8192);
echo $str;
fseek($mem,0);
ftruncate($mem,0);
fwrite($mem,"abcdefghi");
fclose($mem);
?>