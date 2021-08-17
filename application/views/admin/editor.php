<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$common=$this->common;
$type='php_script';
if($_GET['type']=='JS')
	$type='js_script';
$menu=$common->queryRow("SELECT menu_name,menu_id,".$type." AS script,script_on FROM app_menu WHERE menu_code='".$_GET['id']."'");
$session=$this->pagesession->get();
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title><?php echo $_GET['type']; ?> | <?php echo $menu->menu_name; ?></title>
	<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=yes" />
	<script type="text/javascript" src="<?php echo base_url(); ?>vendor/jquery-2.1.4.min.js"></script>	
</head>
<body>
<textarea style="top: 0; right: 0; bottom: 0; position: fixed;left: 0;width: 100%;"><?php echo $menu->script; ?></textarea>
</body>
</html>