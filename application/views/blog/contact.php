<?php
	function toAscii($str, $replace=array(), $delimiter='-') {
		if( !empty($replace) ) {
			$str = str_replace((array)$replace, ' ', $str);
		}
		$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
		return $clean;
	}


?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
	<head>
		<title>Welcome to my site</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- Font Awesome -->
		<link rel="stylesheet" href="<?php echo base_url(); ?>include/css/font-awesome.min.css">
		<link rel="stylesheet" href="<?php echo base_url(); ?>include/font/font.css">
		<link href="<?php echo base_url(); ?>include/style.css" rel="stylesheet" media="screen">	
		<link href="<?php echo base_url(); ?>include/responsive.css" rel="stylesheet" media="screen">		
		
		<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=false"></script>

		<script>
		function initialize()
		{
		var mapProp = {
		  center:new google.maps.LatLng(51.508742,-0.120850),
		  zoom:5,
		  mapTypeId:google.maps.MapTypeId.ROADMAP
		  };
		var map=new google.maps.Map(document.getElementById("googleMap")
		  ,mapProp);
		}

		google.maps.event.addDomListener(window, 'load', initialize);
		</script>
		<style>
			.i-logo{
				height: 70px;
			}
		</style>
	</head>

	<body>
	<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-100823030-1', 'auto');
  ga('send', 'pageview');

</script>
		<div class="fix header_area">
			<div class="fix wrap header">
				<div class="logo floatleft">
					<a href="<?php echo base_url(); ?>"><img class="i-logo" style="height: 70px;" src="<?php echo base_url()."vendor/images/18022018131017A.png";?>" alt="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita" /></a>
				</div>
				<div class="manu floatright">
					<ul id="nav">
						<li><a href="https://sikamal.com" title="sikamal cms, cms php terbaik, website technology">Home</a></li>
						<li><a href="<?php echo base_url(); ?>" title="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita">Blog</a></li>
						<li><a href="<?php echo base_url(); ?>contact" title="kontak sikamal cms">Contact</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="fix content_area">
				<div class="fix top_add_bar">
					<div style="width:700px;margin:0 auto;"><img src="http://placehold.it/700x90"  alt="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita" /></div>
				</div>
			<div class="fix wrap content_wrapper">
				<div class="fix content">
					<div class="fix main_content floatleft">
						<div class="single_page_content fix">
							<h1 style="margin-bottom:15px;">Contact Us</h1>
							
							<div class="google_map">
								<div id="googleMap"></div>
								<div class="contact_info">
									<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
								</div>
							</div>

								<div class="contact_form">
									<form>
										<p><input type="text" class="text" placeholder="Name"/></p>
										<p><input type="text" class="email" placeholder="Email"/></p>
										<p><input type="text" class="text" placeholder="Subject"/></p>
										<p><textarea class="textarea" placeholder="Message"></textarea></p>
										<p><input type="submit" class="submit" value="Submit"/></p>
									</form>
								</div>

							
						</div>
					</div>
					<div class="fix sidebar floatright">
						<div class="fix single_sidebar">
							<div class="popular_post fix">
								<h2>Popular</h2>
								<?php
									$resPopulars=$ini->query->result("SELECT title,create_on, 
									page_image FROM con_article WHERE active_flag=1 AND system_flag=0 ORDER BY view DESC LIMIT 3");
									if(count($resPopulars)>0){
										for($i=0,$iLen=count($resPopulars); $i<$iLen; $i++){
											$resPopular=$resPopulars[$i];
											$tglPostTerbaru=new DateTime($resPopular->create_on);
								?>
								<div class="fix single_popular">
								<?php
									if($resPopular->page_image != null && $resPopular->page_image != ''){
								?>
									<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><img src="<?php echo $resPopular->page_image; ?>&w=50&h=50" alt="<?php echo $resPopular->title; ?>" class="floatleft"/></a>
								<?php
									}else{
								?>
									<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><img src="<?php echo base_url(); ?>include/images/popular.png" alt="<?php echo $resPopular->title; ?>" class="floatleft"/></a>
								<?php
									}
								?>
									<h2><a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><?php echo $resPopular->title; ?></a></h2>
									<p><?php echo $tglPostTerbaru->format('D, d M Y'); ?></p>
									</div>
								<?php
										}
									}else{
								?>
								<center>Artikel Tidak Ada</center>
								<?php
									}
								?>
							</div>
						</div>
						<div class="fix single_sidebar">
							<h2>Search</h2>
							<script>
								function onSearch(e){
									if(e.keyCode==13){
										var tb=document.getElementById('txtSearch').value.replace(' ','-');
										if(tb.trim() !==''){
											location.replace('<?php echo base_url();?>post/search/'+tb+'');
										}else{
											location.replace('<?php echo base_url();?>');
										}
									}
								}
							</script>
							<input class="search" id="txtSearch" type="text" value="" placeholder="Search and hit enter" onkeypress="return onSearch(event)"/>
						</div>
						<div class="fix single_sidebar">
							<h2>A little about me</h2>
							<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum. Sed posuere consectetur est at mant lobortis. Sed posuere consectetur est lobortis. Fusce  mauris condimentum.</p>
						</div>
						<div class="fix single_sidebar">
							<h2>Categories</h2>
							<?php
								$resGroupArticles=$ini->query->result("SELECT COUNT(M.article_id) AS jum,P.option_name,P.option_code FROM con_article M 
									INNER JOIN app_parameter_option P ON P.option_code=M.post_type
									WHERE M.active_flag=1 AND M.system_flag=0 GROUP BY M.post_type");
								for($i=0,$iLen=count($resGroupArticles); $i<$iLen;$i++){
									$resGroupArticle=$resGroupArticles[$i];
							?>
								<a href="<?php echo base_url().'post/category/'.strtolower(str_replace('_','-',$resGroupArticle->option_code)); ?>.html" title="Kategori <?php echo $resGroupArticle->option_name; ?>"><?php echo $resGroupArticle->option_name; ?> (<?php echo $resGroupArticle->jum; ?>)</a>
							<?php
								}
							?>
						</div>
					</div>
				</div>
				<div class="fix bottom_add_bar">
					<div style="width:700px;margin:0 auto;"><img src="http://placehold.it/700x90" alt="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita" /></div>
				</div>
			</div>
		</div>
		
		<div class="fix footer_top_area">
			<div class="fix footer_top wrap">
			<div class="fix footer_top_container">
				<div class="fix single_footer floatleft">
					<h2>From Twitter</h2>
					<p>Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id ultricies vehicula ut id elit. <br/><br/>Cum sociis natoque penatibus et magnis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis. </p>
					<br/><p>Cum sociis natoque penatibus et magnis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.</p>
				</div>
				<div class="fix single_footer floatleft">
					<h2>About us</h2>
					<p>
						Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.
					</p>
				</div>
				<div class="fix single_footer floatleft">
					<div class="popular_post fix">
						<h2>Popular</h2>
						<?php
							if(count($resPopulars)>0){
								for($i=0,$iLen=count($resPopulars); $i<$iLen; $i++){
									$resPopular=$resPopulars[$i];
									$tglPostTerbaru=new DateTime($resPopular->create_on);
						?>
						<div class="fix single_popular">
						<?php
							if($resPopular->page_image != null && $resPopular->page_image != ''){
						?>
							<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><img src="<?php echo $resPopular->page_image; ?>&w=50&h=50" alt="<?php echo $resPopular->title; ?>" class="floatleft"/></a>
						<?php
							}else{
						?>
							<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><img src="<?php echo base_url(); ?>include/images/popular.png" alt="<?php echo $resPopular->title; ?>" class="floatleft"/></a>
						<?php
							}
						?>
							<h2><a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><?php echo $resPopular->title; ?></a></h2>
							<p><?php echo $tglPostTerbaru->format('D, d M Y'); ?></p>
							</div>
						<?php
								}
							}else{
						?>
						<center>Artikel Tidak Ada</center>
						<?php
							}
						?>
					</div>
				</div>
			</div>
			</div>
		</div>
		<div class="fix footer_area">
			<div class="fix wrap footer">
			<div class="fix copyright_text floatleft">
				<p>Designed By <a href="https://www.sikamal.com" title="sikamal cms, cms php terbaik, website technology">Sikamal.com</a></p>
			</div>
			<div class="fix social_area floatright">
				<ul>
					<li><a href="" class="feed"></a></li>
					<li><a href="" class="facebook"></a></li>
					<li><a href="" class="twitter"></a></li>
					<li><a href="" class="drible"></a></li>
					<li><a href="" class="flickr"></a></li>
					<li><a href="" class="pin"></a></li>
					<li><a href="" class="tumblr"></a></li>
				</ul>
			</div>
			</div>
		</div>
		<script type="text/javascript" src="<?php echo base_url(); ?>include/js/placeholder_support_IE.js"></script>
		<script type="text/javascript" src="<?php echo base_url(); ?>include/js/selectnav.min.js"></script>
		<script type="text/javascript">
			selectnav('nav', {
			  label: '-Navigation-',
			  nested: true,
			  indent: '-'
			});
		</script>		
		<script src="<?php echo base_url(); ?>vendor/jquery-2.1.4.min.js"></script>		
	</body>
</html>
