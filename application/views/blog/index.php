<?php 
	$ini->load->library('lib/lib_system_property');
	$ini->load->library('lib/lib_html');
	$app_name=$ini->lib_system_property->get('APP_NAME');
	$app_desc=$ini->lib_system_property->get('APP_DESCRIPTION');
	$app_company=$ini->lib_system_property->get('APP_COMPANY');
	$app_contact=$ini->lib_system_property->get('APP_CONTACT');
	$app_keywords=$ini->lib_system_property->get('APP_KEYWORDS');
	$tenant=$ini->lib_system_property->get('DEFAULT_TENANT');
	if(!$this->session->get('WEB_'.base_url())){
		$ini->load->library('lib/lib_sequence');
		$ini->lib_sequence->get('HIT_COUNTER',null,$tenant);
		$this->session->set('WEB_'.base_url(),'YA');
	}
	$visitor=0;
	$resVisitor=$ini->query->row("SELECT last_value FROM app_sequence WHERE sequence_code='HIT_COUNTER' AND tenant_id=".$tenant);
	if($resVisitor){
		$visitor=$resVisitor->last_value;
	}
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
	function waktu_lalu($timestamp){
		$selisih = time() - strtotime($timestamp) ;
	 
		$detik = $selisih ;
		$menit = round($selisih / 60 );
		$jam = round($selisih / 3600 );
		$hari = round($selisih / 86400 );
		$minggu = round($selisih / 604800 );
		$bulan = round($selisih / 2419200 );
		$tahun = round($selisih / 29030400 );
	 
		if ($detik <= 60) {
			$waktu = $detik.' detik yang lalu';
		} else if ($menit <= 60) {
			$waktu = $menit.' menit yang lalu';
		} else if ($jam <= 24) {
			$waktu = $jam.' jam yang lalu';
		} else if ($hari <= 7) {
			$waktu = $hari.' hari yang lalu';
		} else if ($minggu <= 4) {
			$waktu = $minggu.' minggu yang lalu';
		} else if ($bulan <= 12) {
			$waktu = $bulan.' bulan yang lalu';
		} else {
			$waktu = $tahun.' tahun yang lalu';
		}
		
		return $waktu;
	}
	$url_share ="https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; 
	$src=str_replace('-',' ',$res);
	$desc=$app_desc;
	if($type=='page'){
		$src=$app_keywords;
		$res=$app_keywords;
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
	<head>
		<link rel="shortcut icon" type="image/x-icon" href="<?php echo base_url()?>vendor/images/icon_32.ico">
		<link rel="canonical" href="<?php echo $url_share; ?>"/>
		<meta name="title" content ="<?php echo str_replace('-',' ',$res); ?>">
		<meta name="msapplication-config" content="<?php echo base_url()?>browserconfig.xml" />
		<meta name="application-name" content="<?php echo $app_name; ?>" />
		<meta name="msapplication-starturl" content="<?php echo base_url()?>" />
		<meta name="msapplication-navbutton-color" content="#ffffff" />
		<meta name="msapplication-tooltip" content="<?php echo str_replace('-',' ',$res); ?>" />
		<meta name="msapplication-TileColor" content="#ffffff" />
		<meta name="msapplication-TileImage" content="<?php echo base_url()?>vendor/images/logo_150_150.png" />
		
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link rel="apple-touch-startup-image" href="<?php echo base_url()?>vendor/images/logo_150_150.png">
		<link rel="apple-touch-icon" href="<?php echo base_url()?>vendor/images/logo_150_150.png"/>
		<link rel="apple-touch-icon-precomposed" sizes="128x128" href="<?php echo base_url()?>vendor/images/logo_128_128.png">
		<link rel="apple-touch-icon-precomposed" sizes="76x76" href="<?php echo base_url()?>vendor/images/logo_76_76.png">
		<link rel="apple-touch-icon-precomposed" sizes="120x120" href="<?php echo base_url()?>vendor/images/logo_120_120.png">
		<link rel="apple-touch-icon-precomposed" sizes="152x152" href="<?php echo base_url()?>vendor/images/logo_152_152.png">
		<link rel="apple-touch-icon-precomposed" sizes="180x180" href="<?php echo base_url()?>vendor/images/logo_180_180.png">


		<meta name="mobile-web-app-capable" content="yes">
		<link rel="shortcut icon" sizes="196x196" href="<?php echo base_url()?>vendor/images/logo_150_150.png">
		<link rel="shortcut icon" sizes="128x128" href="<?php echo base_url()?>vendor/images/logo_150_150.png">
		
		<title><?php echo str_replace('-',' ',$res); ?></title>
		<?php
			$tgl_post=new DateTime();
			$ini->load->library('lib/lib_html');
		?>
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">
		
		<meta content="Global" name="Distribution">
		<meta content="General" name="Rating">
		<meta content="INDEX,FOLLOW" name="Robots">
		<meta content="ASEP KAMALUDIN" name="author">
		<meta content="SIKAMAL" name="copyright">
		<meta content="1 days" name="revisit-after">
		<meta name="msapplication-TileColor" content="#A800BA">
		<meta name="theme-color" content="#A800BA">
		<meta content="asepkamaludin" property="fb:admins">
		<meta content="Aeiwi, Alexa, AllTheWeb, AltaVista, AOL Netfind, Anzwers, Canada, DirectHit, EuroSeek, Excite, Overture, Go, Google, HotBot. InfoMak, Kanoodle, Lycos, MasterSite, National Directory, Northern Light, SearchIt, SimpleSearch, WebsMostLinked, WebTop, What-U-Seek, AOL, Yahoo, WebCrawler, Infoseek, Excite, Magellan, LookSmart, CNET, Googlebot" name="search engines">
		

		<meta name="google-site-verification" content="1lZ8pF1nq_OzZQXWVI-WX2fFyDVJsMMVT9tuorakoR4" />
		<meta name="description" content="<?php echo $desc; ?>">
		<meta name="keywords" content="<?php echo $src; ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="language" content="id" />
		<meta content='Indonesia' name='geo.placename'/>
		
		<!-- Schema.org markup for Google+ -->
		<meta itemprop="name" content="<?php echo $src; ?>">
		<meta itemprop="description" content="<?php echo $src; ?>">
		<meta itemprop="image" content="<?php echo base_url()?>vendor/images/18022018131106A.png">
		<!-- Twitter Card data -->
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="<?php echo $url_share; ?>">
		<meta name="twitter:title" content="<?php echo $src; ?>">
		<meta name="twitter:description" content="<?php echo $desc; ?>">
		<meta name="twitter:creator" content="<?php echo $app_name; ?>">
		<!-- Twitter summary card with large image must be at least 280x150px -->
		<meta name="twitter:image:src" content="<?php echo base_url()?>vendor/images/18022018131106A.png">

		<!-- Open Graph data for facebook-->
		<meta property="og:title" content="<?php echo $src; ?>" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="<?php echo $url_share; ?>" />
		<meta property="og:image" content="<?php echo base_url()?>vendor/images/18022018131106A.png" />
		<meta property="og:description" content="<?php echo $desc; ?>" />
		<meta property="og:site_name" content="<?php echo $app_name; ?>" />
		<meta property="fb:app_id" content="302184056577324" />
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- Font Awesome -->
		<?php
			$ini->load->library('minify');
			$ini->minify->press(array(
				'include/blog/css/font-awesome.min.css',
				'include/blog/font/font.css',
				'include/blog/style.css',
				'include/blog/responsive.css',
				'include/blog/style_menu.css'
			),'index');
			// echo $ini->minify->deploy_css();
			// $this->minify->js(array('helpers.js', 'jqModal.js'));
			// echo $this->minify->deploy_js(FALSE, 'script.min.js');
		?>
		<script type="application/ld+json">
		{
		  "@context": "http://schema.org",
		  "@type": "Organization",
		  "url": "<?php echo base_url(); ?>",
		  "name": "<?php echo $app_company; ?>",
		  "contactPoint": {
			"@type": "ContactPoint",
			"telephone": "<?php echo $app_contact; ?>",
			"contactType": "Customer service"
		  }
		}
		</script>
	</head>
	<body>
		<nav class="clearfix">
			<div class="con">
				<div class="conleft">
					<img src="<?php echo base_url(); ?>vendor/images/logo_302_80.png" />
				</div>
				<div class="conright">
					<a href="#" id="pull"><img src="<?php echo base_url(); ?>vendor/images/logo_154_40.png" /></a>
					<ul class="clearfix">
						<li><a href="<?php echo base_url(); ?>">Beranda</a></li>
						<li><a href="#">Profil</a></li>
						<li><a href="<?php echo base_url(); ?>artikel">Artikel</a></li>
						<li><a href="#">Konten</a></li>
						<li><a href="#">Kontak</a></li>
					</ul>
				</div>
			</div>
		</nav>
		<div class="fix content_area clear">
			<div class="fix top_add_bar">
				<div class="addbar_leaderborard"><img src="<?php echo base_url(); ?>include/blog/images/728x90.png" alt="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita"  /></div>
			</div>
			<div class="fix wrap index content_wrapper">
				<div class="fix content">
					<div class="fix main_content floatleft">
						<div class="popular_post fix pagination">
							<?php
								if($type=='page'){
									echo '<h2>&nbsp;All Post</h2>';
								}else if($type=='search'){
									echo "<h2>&nbsp;Pencarian '".str_replace('-',' ',$res)."'</h2>";
								}else if($type=='category'){
									$resTypeKategory=$ini->query->row("SELECT option_name FROM app_parameter_option WHERE option_code='".$res."'"); 
									if($resTypeKategory){
										echo "<h2>&nbsp;Kategori '".$resTypeKategory->option_name."'</h2>";
									}
								}else if($type=='search'){
									echo "<h2>&nbsp;Tag '".str_replace('-',' ',$res)."'</h2>";
								}
							?>
						</div>
						<?php
							$queryType='';
							$querySearch='';
							$queryTag='';
							$queryInnerTag='';
							
							if($type=='category'){
								$queryType=" AND UPPER(M.post_type)=UPPER('".str_replace('-','_',$res)."') ";
							}
							if($type=='tag'){
								$queryTag=" AND UPPER(T.tag_name)=UPPER('".$res."')";
								$queryInnerTag=" INNER JOIN con_article_tag T ON T.article_id=M.article_id ";
							}
							$queryOrderBy='ORDER BY M.create_on DESC ';
							if($type=='search'){
								$splitSrc=explode("-",$res);
								$queryOr='';
								$queryOrder='';
								for($i=0,$iLen=count($splitSrc); $i<$iLen;$i++){
									if($splitSrc[$i] != ''){
										if($queryOr !=''){
											$queryOr.=" OR ";
											$queryOrder.=" + ";
										}
										$queryOr.=" UPPER(title) LIKE UPPER('%".$splitSrc[$i]."%') ";
										$queryOrder.="(
												LENGTH(title)
												- LENGTH( REPLACE ( UPPER(title), UPPER('".$splitSrc[$i]."'), '') ) 
											) / LENGTH('".$splitSrc[$i]."')";
									}
								}
								if($queryOr !=''){
									$querySearch.=' AND ('.$queryOr.') ';
									$queryOrderBy=" ORDER BY ROUND (".$queryOrder.") DESC, M.create_on DESC ";
								}	
							}
							$resArticles=$ini->query->result("SELECT M.title,SUBSTRING_INDEX(SUBSTRING_INDEX(M.text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text,M.create_on, 
								M.page_image,CONCAT(E.first_name,' ',E.last_name) AS created,M.view FROM con_article M 
								INNER JOIN app_employee E ON E.employee_id=M.create_by
								".$queryInnerTag."
								WHERE M.active_flag=1 ".$queryTag." AND M.system_flag=0 ".$queryType." ".$querySearch." ".$queryOrderBy." LIMIT 10 OFFSET ".$page);
							if(count($resArticles)>0){
								$awal=false;
								for($i=0,$iLen=count($resArticles); $i<$iLen; $i++){
									$resArticle=$resArticles[$i];
									$tglPostTerbaru=new DateTime($resArticle->create_on);
									$jumComment=$ini->query->row("SELECT count(comment_id) AS jum FROM con_comment WHERE url='".base_url()."artikel/".toAscii(strtolower($resArticle->title)).".html' AND parent_id is null")->jum;
									if($page==0 && $i==0 && $type=='page'){
										$awal=true;
						?>
						<div class="single_page_content fix">
							<h1><?php echo $resArticle->title;?></h1>
							<div class="single_post_meta fix">
								<p><?php echo $tglPostTerbaru->format('D, d M Y'); ?>   |   <?php echo $resArticle->created; ?>  |  <?php echo $resArticle->view; ?> Views</p>
							</div>
							<?php echo $ini->lib_html->limit(strip_tags($resArticle->text),100); ?> <a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resArticle->title)); ?>.html" title="<?php echo $resArticle->title; ?>">Selanjutnnya >> </a>
						</div>
						<br>
						<div class="fix single_content_wrapper">
							
								<?php
									}else{
										if($awal==false){
											$awal=true;
								?>
										<div class="fix single_content_wrapper">
								<?php
										}
								?>
							<div class="fix single_content floatleft">
							<?php
								if($resArticle->page_image != null && $resArticle->page_image != ''){
							?>
								<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resArticle->title)); ?>.html" title="<?php echo $resArticle->title; ?>"><img src="<?php echo $resArticle->page_image; ?>&w=322&h=200" alt="<?php echo $resArticle->title; ?>"/></a>
							<?php
								}else{
							?>
								<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resArticle->title)); ?>.html" title="<?php echo $resArticle->title; ?>"><img src="<?php echo base_url(); ?>include/blog/images/home_featured.png" alt="<?php echo $resArticle->title; ?>"/></a>
							<?php
								}
							?>
								<div class="fix single_content_info">
									<strong><a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resArticle->title)); ?>.html" title="<?php echo $resArticle->title; ?>"><?php echo $resArticle->title; ?></a></strong>
									<p class="author">By <?php echo $resArticle->created; ?></p>
									<p><?php echo $ini->lib_html->limit(strip_tags($resArticle->text),15); ?></p>
									<div class="fix post-meta">
										<p><?php echo $tglPostTerbaru->format('D, d M Y'); ?>  |  <?php echo $jumComment; ?> Comments</p>
									</div>
								</div>
							</div>
							<?php
								}}
								}else{
							?>
						<div class="fix single_content_wrapper">
							<center><strong>Tidak diTemukan</strong></center>
							<?php
								}
							?>
						</div>
						<div class="pagination fix">
						<?php
							$jumArticle=$ini->query->row("SELECT COUNT(M.article_id) as jum FROM con_article M
									".$queryInnerTag."
									WHERE M.active_flag=1 AND M.system_flag=0 ".$queryTag." ".$queryType." ".$querySearch)->jum;
							$ini->load->library('pagination');
							$config['base_url'] = base_url().'artikel/list/'.$type.'/'.$res.'/';
							$config['total_rows'] = $jumArticle;
							$config['per_page'] = 10;
							$config['cur_tag_open'] = '<a href="#">';
							$config['cur_tag_close'] = '</a>';
							$ini->pagination->initialize($config);
							echo $ini->pagination->create_links();
						?>
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
									<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><img src="<?php echo base_url(); ?>include/blog/images/popular.png" alt="<?php echo $resPopular->title; ?>" class="floatleft"/></a>
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
											location.replace('<?php echo base_url();?>artikel/list/search/'+tb+'');
										}else{
											location.replace('<?php echo base_url();?>artikel');
										}
									}
								}
							</script>
							<?php
								$valueSearch='';
								if($type=='search'){
									$valueSearch=str_replace('-',' ',$res);
								}
							?>
							<input class="search" id="txtSearch" type="text" value="<?php echo $valueSearch; ?>" placeholder="Search and hit enter" onkeypress="return onSearch(event)"/>
						</div>
						<div class="fix single_sidebar">
							<h2>My Stat</h2>
							<p>Ada Harga di setiap tindakan, maka itu jadikanlah semua tindakanmu sangat berharga bagimu, kehidupanmu, dan orang lain.</p>
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
								<a class="alink" href="<?php echo base_url().'artikel/list/category/'.strtolower(str_replace('_','-',$resGroupArticle->option_code)); ?>.html" title="Kategori <?php echo $resGroupArticle->option_name; ?>"><?php echo $resGroupArticle->option_name; ?> (<?php echo $resGroupArticle->jum; ?>)</a>
							<?php
								}
							?>
						</div>
						<!--<div id="SC_TBlock_543418" class="SC_TBlock">loading...</div> !-->
						<script type="text/javascript">
						  // (sc_adv_out = window.sc_adv_out || []).push({
							// id : "543418",
							// domain : "n.ads1-adnow.com"
						  // });
						</script>
						<!--<script type="text/javascript" src="//st-n.ads1-adnow.com/js/a.js"></script> !-->
					</div>
				</div>
			</div>
				<div class="fix bottom_add_bar">
					<div class="addbar_leaderborard"><img src="<?php echo base_url(); ?>include/blog/images/728x90.png"  alt="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita" /></div>
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
					<h2>usefull links</h2>
					<ul>
						<li><a href="<?php echo base_url(); ?>" title="sikamal cms, cms php terbaik, website technology">Home</a></li>
						<li><a href="<?php echo base_url(); ?>artikel" title="blog sikamal cms, informasi teknologi, belajar website, bisnis, berita">BLog</a></li>
					</ul>
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
							<a href="<?php echo base_url().'artikel/'.toAscii(strtolower($resPopular->title)); ?>.html" title="<?php echo $resPopular->title; ?>"><img src="<?php echo base_url(); ?>include/blog/images/popular.png" alt="<?php echo $resPopular->title; ?>" class="floatleft"/></a>
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
			<div class="wrap">
			<div class="fix copyright_text floatleft">
				<p>Designed By <a href="<?php echo base_url(); ?>" title="sikamal cms, cms php terbaik, website technology">Sikamal.com</a></p>
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
		<script type="text/javascript" src="<?php echo base_url(); ?>include/blog/js/placeholder_support_IE.js"></script>
		<script type="text/javascript" src="<?php echo base_url(); ?>include/blog/js/selectnav.min.js"></script>
		<script type="text/javascript">
			selectnav('nav-top', {
			  label: '-Navigation-',
			  nested: true,
			  indent: '-'
			});
			
			selectnav('nav-bottom', {
			  label: '-Navigation-',
			  nested: true,
			  indent: '-'
			});			
		</script>		
		<script src="<?php echo base_url(); ?>vendor/jquery-2.1.4.min.js"></script>	
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-100823030-1', 'auto');
		  ga('send', 'pageview');

		</script>
		<script>
			$(function() {
				var pull 		= $('#pull'); 
					menu 		= $('nav ul'); 
				$(pull).on('click', function(e) {
					e.preventDefault();
					menu.slideToggle();
				});
				$(window).resize(function(){
					var w = $(window).width();
					if(w > 600 && menu.is(':hidden')) {
						menu.removeAttr('style');
					}
				});
			});
		</script>
		<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5b4df9c7d539de26"></script>
	</body>
</html>
