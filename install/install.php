<!DOCTYPE html>
<html>
<title>Welcome</title>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Login</title>
	<link href="vendor/system/skeleton.css" rel="stylesheet">
	<script src="vendor/jquery-2.1.4.min.js"></script>
	<style>
		body{
			background-image:url('vendor/system/image/background.jpg');
		}
	</style>
</head>
<body>
<div id="form_login" class="container">
<h3>Installation Web ...</h3>
<?php 
	if(isset($_POST['host'])){
		ini_set('max_execution_time', 9000);
		$mysqlConnection=mysql_connect($_POST['host'],$_POST['user'],$_POST['pass']) or die('Install Gagal. Harap Cek Database.');
		if (!mysql_connect($_POST['host'],$_POST['user'],$_POST['pass'])){
			echo "Install Gagal. Harap Cek Database.";
		}else{
			$buat_db=mysql_query("create database ".$_POST['db']."");
			if (!$buat_db){
				echo "Install Gagal. Database Sudah Ada.";
			}else{
				$filename = 'data.sql';
				mysql_select_db($_POST['db']) or die('Error selecting MySQL database: ' . mysql_error());
				$templine = '';
				$lines = file($filename);
				foreach ($lines as $line){
					if (substr($line, 0, 2) == '--' || $line == '')
						continue;
					$templine .= $line;
					if (substr(trim($line), -1, 1) == ';'){
						mysql_query($templine) or print('Error performing query \'<strong>' . $templine . '\': ' . mysql_error() . '<br /><br />');
						$templine = '';
					}
				}
				$file_config = fopen('config.php', 'w+');
				fwrite($file_config, "<?php \r\n");
				fwrite($file_config, "\$iHostName='".$_POST['host']."'; \r\n");
				fwrite($file_config, "\$iUserName='".$_POST['user']."'; \r\n");
				fwrite($file_config, "\$iPassword='".$_POST['pass']."'; \r\n");
				fwrite($file_config, "\$iDb='".$_POST['db']."'; \r\n");
				fwrite($file_config, "\$iPort='".$_POST['port']."'; \r\n");
				fwrite($file_config, "?>");
				fclose($file_config);
				header('Location:.');
			}
		}
	}
?>
<form method="POST" action="install.php">
	<table>
		<tr>
			<td style="width: 100px;">Host</td>
			<td style="width: 5px;">:</td>
			<td><input type="text" name="host"/></td>
		</tr>
		<tr>
			<td>Username</td>
			<td>:</td>
			<td><input type="text" name="user"/></td>
		</tr>
		<tr>
			<td>Password</td>
			<td>:</td>
			<td><input type="password" name="pass"/></td>
		</tr>
		<tr>
			<td>Database Name</td>
			<td>:</td>
			<td><input type="text" name="db"/></td>
		</tr>
		<tr>
			<td>Port</td>
			<td>:</td>
			<td><input type="text" name="port" value="3306"/></td>
		</tr>
	</table>
	<input type="submit" name="submit" value="next >"/>
</form>
</div>
</body>
</html>