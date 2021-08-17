<?php defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="icon" href="<?php echo base_url()?>vendor/images/icon_32.ico">
	<?php if(isset($_GET['m'])){ ?>
		<title><?php echo  json_decode(base64_decode($_GET['m']))->text; ?> | <?php echo $session->tenant_name; ?></title>
	<?php }else{ ?>
		<title><?php echo $session->user_name; ?> | <?php echo $session->tenant_name; ?></title>
	<?php } ?>
	<meta name="viewport" content='width=device-width, initial-scale=1'>
	<style>
		#load{
			width:100%;
			height:100%;
			top:0;
			left:0;
			position:fixed;
			z-index:9999;
			opacity: 0.5;
			background:white;
		}
		#loadImage{
			position: absolute;
			left: 50%;top: 50%;
			margin-left: -50px;
			margin-top: -50px;
		}
		body{
			margin:0px;
		}
	</style>
	<script>
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function() {
				navigator.serviceWorker.register(url+'sw.js').then(function(registration) {}).catch(function(err) {});
			});
		}
		document.onreadystatechange = function (a) {
		  var state = document.readyState;
		  if (state == 'interactive') {
		  } else if (state == 'complete') {
			  storage_auth();
			  // _local_storage=_get_session(session_name);
			  // console.log(_local_storage);
			  $('#load').fadeOut('slow');
				var imp=_import_list;
				_import_list=[];
				importComponent(imp,function(){
					start_up();
				});
				
		  }
		};
		var _mobile=false,_single=false;
		<?php if(isset($_GET['m'])){ ?>
		_single=true;
		<?php } ?>
	</script>
</head>
<body>
	<div id="load"><img id="loadImage" src="<?php echo base_url(); ?>vendor/images/Blocks-1s-100px.gif"/></div>
<?php  
	$minify->press(array(
		'vendor/web-font/css/font-awesome.css'
	));
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	$acceptLang = ['fr', 'it', 'en']; 
	$lang = in_array($lang, $acceptLang) ? $lang : 'en';
	// if($mobile){
		// $minify->press(array(
			// // 'vendor/ext-4.2.1.883/resources/ext-theme-neptune/ext-theme-neptune-all.css','vendor/admin_style_neptune.css'
			// 'vendor/ext-4.2.1.883/resources/ext-theme-neptune/ext-theme-neptune-all.css','vendor/admin_style.css','vendor/admin_mobile_style.css'
		// ));
?>
	<script>
		if(window.innerWidth<600){
			_mobile=true;
		}
	</script>
<?php 
	// }else{ 
		$minify->press(array(
			'vendor/ext-4.2.1.883/resources/css/ext-all.css','vendor/admin_style.css'
		));
	// } 
?>
	<div id='i-window-menu-other-cursor'>
		<div class="i-window-menu-other-cursor"></div>
		<div class="i-window-menu-other-cursor2"></div>
	</div>
	<img id='tmp-initial' style='display:none;'>
	<script>
		var _lang={'main':JSON.parse('<?php echo json_encode($this->lang->language);?>')},
			_local_storage=null,
			_lang='<?php echo $lang; ?>',
			_param='<?php echo $param; ?>',
			_lang_browser=window.navigator.language,
			_app_name='<?php echo $session->app_name; ?>',
			_import_list=<?php echo json_encode($session->import_list); ?>,
			_app_powered='<?php echo $session->app_powered; ?>',
			_cache='<?php echo $session->cache; ?>',
			_clear_storage='<?php echo $session->clear_storage; ?>',
			_employee_id=<?php echo $session->employee_id; ?>,
			_menu_list=<?php echo json_encode($session->menu_list); ?>,
			_access_list=<?php echo json_encode($session->access_list); ?>,
			_setting=<?php echo json_encode($session->setting); ?>,
			_tab_list=[],
			session_name='<?php echo $session->sessionName; ?>',
			_tenant_id=<?php echo $session->tenant_id; ?>,
			_tenant_name='<?php echo $session->tenant_name; ?>',
			_tenant_address='<?php echo $session->tenant_address; ?>',
			_tenant_contact='<?php echo $session->tenant_contact; ?>',
			_tenant_logo='<?php echo $session->tenant_logo; ?>',
			url='<?php echo base_url(); ?>',
			_user_id=<?php echo $session->user_id; ?>,
			_user_name='<?php echo $session->user_name; ?>',
			_user_code='<?php echo $session->user_code; ?>',
			_single_page=false,
			_menu_code=null,
			_session_id='<?php echo $session->session_id; ?>',
			_var={},
			_jum_menu_active_top=0,
			_show_menu_top=true,
			_show_menu_left=true,
			_show_home=true,
			_menu_list_obj={},
			_show_tab_header=true,
			autoLoad=null;
<?php
	if(isset($_GET['m'])){
?>
			_single_page=true;
			_menu_code=JSON.parse('<?php echo base64_decode($_GET["m"]); ?>');
<?php
	}
?>
	</script>
	<?php
		$arrJs=array(
			'vendor/ext-4.2.1.883/ext-all.min.js',
			//'vendor/firebase.min.js',
			'vendor/jquery-2.1.4.min.js',
			//'vendor/jzebra/dependencies/rsvp-3.1.0.min.js',
			//'vendor/jzebra/dependencies/sha-256.min.js',
			//'vendor/jzebra/qz-tray.js',
			//'vendor/html2canvas.min.js',
			'app/system/Common.js'
		);	
		// for($i=0,$iLen=count($session->import_list); $i<$iLen;$i++){
			// $arrJs[]=$session->import_list[$i];
		// }
		if(isset($_GET['m'])){ 
			$arrJs[]='vendor/mainSingle.js';
		}else{
			$arrJs[]='vendor/main.js';
		}
		$arrJs=array_merge($arrJs,array(
			'app.js',//'vendor/tinymce/tinymce.min.js',
			//'vendor/TinyMCETextArea.js',
			//'vendor/chart/css/ExtJSOrgChart.css'
		));
		$minify->press($arrJs);
	?>
</body>
</html>