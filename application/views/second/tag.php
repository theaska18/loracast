<?php 
	$ini->load->library('lib/lib_system_property');
	$ini->load->library('lib/lib_html');
	$app_name=$ini->lib_system_property->get('APP_NAME');
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
	$url_share ="http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; 
	$src='Artikel '.$app_name;
	if(isset($_GET['src'])){ 
		$src=$_GET['src'];
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title><?php echo $src; ?></title>
	<?php
			$tgl_post=new DateTime();
			$ini->load->library('lib/lib_html');
	?>
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">

		<meta name="google-site-verification" content="1lZ8pF1nq_OzZQXWVI-WX2fFyDVJsMMVT9tuorakoR4" />
		<meta name="description" content="<?php echo $src; ?>">
		<meta name="keywords" content="<?php echo $src; ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="language" content="id" />
		<meta content='Indonesia' name='geo.placename'/>

		<!-- Schema.org markup for Google+ -->
		<meta itemprop="name" content="<?php echo $src; ?>">
		<meta itemprop="description" content="<?php echo $src; ?>">
		<meta itemprop="image" content="">
		<!-- Twitter Card data -->
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="<?php echo $url_share; ?>">
		<meta name="twitter:title" content="<?php echo $src; ?>">
		<meta name="twitter:description" content="<?php echo $src; ?>">
		<meta name="twitter:creator" content="<?php echo $app_name; ?>">
		<!-- Twitter summary card with large image must be at least 280x150px -->
		<meta name="twitter:image:src" content="">

		<!-- Open Graph data for facebook-->
		<meta property="og:title" content="<?php echo $src; ?>" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="<?php echo $url_share; ?>" />
		<meta property="og:image" content="" />
		<meta property="og:description" content="<?php echo $src; ?>" />
		<meta property="og:site_name" content="<?php echo $app_name; ?>" />
		<meta property="fb:app_id" content="302184056577324" />

		<meta property="article:published_time" content="<?php echo $tgl_post->format('Y-m-d H:i:s') ?>" />
		<meta property="article:modified_time" content="<?php echo $tgl_post->format('Y-m-d H:i:s') ?>" />
		<meta property="article:section" content="<?php echo $src; ?>" />
		<meta property="article:tag" content="<?php echo $src; ?>" />
<!--
Stimulus Template
http://www.templatemo.com/tm-498-stimulus
-->
<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/bootstrap.min.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/animate.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/font-awesome.min.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/templatemo-style.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/font-google.css">
<style>
	h1,h2,h3,h4,hr{
		padding: 0px !important;
		margin: 0px !important;
		margin-bottom: 2px !important;
	}

</style>
	<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
	<script>
	  (adsbygoogle = window.adsbygoogle || []).push({
		google_ad_client: "ca-pub-5680796902898091",
		enable_page_level_ads: true
	  });
	</script>
</head>
<body data-spy="scroll" data-target=".navbar-collapse" data-offset="50">
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-100823030-1', 'auto');
  ga('send', 'pageview');

</script>
<div id="fb-root"></div>
<script>
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=Your ID FB";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
</script>

<!-- PRE LOADER -->

<div class="preloader">
     <div class="spinner">
          <span class="spinner-rotate"></span>
     </div>
</div>


<!-- Navigation Section -->

<div class="navbar navbar-fixed-top custom-navbar" role="navigation">
     <div class="container">

          <!-- navbar header -->
          <div class="navbar-header">
               <button class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
               </button>
               <a alt="<?php echo $app_name; ?>"  href="#" class="navbar-brand"><?php echo $app_name; ?></a>
          </div>

          <div class="collapse navbar-collapse">
               <ul class="nav navbar-nav navbar-right">
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>" class="smoothScroll">Beranda</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article?src=asep+kamaludin" class="smoothScroll">Profil</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_ARTICLE" class="smoothScroll">Artikel</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_NEWS" class="smoothScroll">Berita</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_SHOP" class="smoothScroll">Bisnis</a></li>
                   <!-- <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>gallery" class="smoothScroll">Galeri</a></li>-->
                    <li><a alt="<?php echo $app_name; ?>"  href="#contact" class="smoothScroll">Kontak</a></li>
               </ul>
          </div>

     </div>
</div>


<!-- Home Section -->

<section id="home" class="parallax-section">
     <div class="container">
          <div class="bg-yellow row">

                                   
				<div class="col-md-3">
					<div class="row">
						<div class="col-md-12"  style="background-color:#d68956 !important;padding: 0px !important;">
							<div class="skill-thumb">
								 <div class="wow fadeInUp section-title color-white bg-yellow" data-wow-delay="1.2s" style="margin-top: 100px;border-top:1px solid #c26d34;padding: 20px 20px 20px 30px !important;">
										<form action="<?php echo base_url().'article/search'; ?>">
										<div class="input-group">
											<input type="text" name="src" class="form-control" placeholder="Cari Artikel ...">
											<span class="input-group-btn">
												<button class="btn btn-default" type="submit">Cari</button>
											</span>
										</div></form><br>
									  <div style="background: #fafafa;padding: 5px;color:#333 !important;font-weight: bold;">Artikel Terbaru</div>
									  <div style="padding: 10px;background-color:#ffffff;color:black !important;border-top: 1px solid #ebebeb;">
									  <?php
											$resArticle=$ini->query->result("SELECT title,create_on, 
												page_image FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type not in('POST_GALLERY') ORDER BY create_on DESC LIMIT 5");
											if(count($resArticle)>0){
												
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										<div style="padding-top: 5px;">
										<div style="float:left;padding-right: 10px;">
										<?php
											if($resArticle[$i]->page_image != null && $resArticle[$i]->page_image != ''){
										?>
											<a alt="<?php echo $app_name; ?>"  href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>"><img src="<?php echo $resArticle[$i]->page_image; ?>&w=100&h=100" style="width: 100px;border: 1px solid #ebebeb;" /></a><br>
										<?php
											}
										?>
										</div>
										<div style="">
											<span style="color:#90949c;"><?php echo waktu_lalu($tglPostTerbaru->format('Y-m-d H:i:s')); ?></span> - <a alt="<?php echo $app_name; ?>"   href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a>
										</div></div><div style="clear:both;"></div>
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
						<div class="bg-yellow  col-md-12" style="padding: 0px !important;">
							<div class="skill-thumb">
								 <div class="wow fadeInUp section-title color-white" data-wow-delay="1.2s" style="padding: 0px 20px 20px 30px !important;">
									  <div style="background: #fafafa;padding: 5px;color:#333 !important;font-weight: bold;">Artikel Terpopuler</div>
									  <div style="padding: 10px;background-color:#ffffff;color:black !important;border-top: 1px solid #ebebeb;">
									  <?php
											$resArticle=$ini->query->result("SELECT title,SUBSTRING_INDEX(SUBSTRING_INDEX(text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text,create_on, 
											page_image FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type not in('POST_GALLERY') ORDER BY view DESC LIMIT 1");
											if(count($resArticle)>0){
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										<div style="padding-top: 5px;">
										<?php
											if($resArticle[$i]->page_image != null && $resArticle[$i]->page_image != ''){
										?>
											<a alt="<?php echo $app_name; ?>"  href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>"><img src="<?php echo $resArticle[$i]->page_image; ?>&w=100&h=100" style="width: 100px;float:left;margin-right: 10px;border: 1px solid #ebebeb;" /></a>
										<?php
											}
										?>
											<a alt="<?php echo $app_name; ?>" href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a><br>
											<?php echo $tglPostTerbaru->format('D, d M Y'); ?> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?>
										</div><div style="clear:both;"></div>
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
               </div>

               <div class="col-md-9" style="background:#fafafa !important;  padding-right: 0px !important;padding-left: 0px !important;">
                    <div class="skill-thumb">
                         <div class="section-title" style="background: #ffffff; margin-top: 100px;padding-left: 20px; border-top: 1px solid #ebebeb;padding-top: 10px;padding-right: 20px;">
							<?php
								if(isset($_GET['src'])){
							?>
							Pencarian Untuk : <b><?php echo $_GET['src'];?></b>
							<?php
								}
							?>
							<?php
								if(!isset($_GET['src']) && !isset($_GET['page']) && !isset($_GET['type'])){
							?>
							<div class="row">
								<div class="col-md-4">
								<h3>Artikel</h3>
								<hr>
										<?php
											$resArticle=$ini->query->result("SELECT title,create_on,SUBSTRING_INDEX(SUBSTRING_INDEX(text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text
												FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type in('POST_ARTICLE') ORDER BY create_on DESC LIMIT 20");
											if(count($resArticle)>0){
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										
											<a alt="<?php echo $app_name; ?>"   style="color:blue !important;" href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a>
											<br><?php echo $tglPostTerbaru->format('D, d M Y'); ?> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?><br>
										
										<?php
												}
										?>
										<a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_ARTICLE" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s">Artikel</a>
										<?php
											}else{
										?>
										<center>Artikel Tidak Ada</center>
										<?php
											}
										?>
								</div>
								<div class="col-md-4">
								<h3>Berita</h3>
								<hr>
										<?php
											$resArticle=$ini->query->result("SELECT title,create_on,SUBSTRING_INDEX(SUBSTRING_INDEX(text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text
												FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type in('POST_NEWS') ORDER BY create_on DESC LIMIT 20");
											if(count($resArticle)>0){
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										
											<a alt="<?php echo $app_name; ?>"   style="color:blue !important;" href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a>
											<br><?php echo $tglPostTerbaru->format('D, d M Y'); ?> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?><br>
										
										<?php
												}
										?>
										<a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_NEWS" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s">News</a>
										<?php
											}else{
										?>
										<center>Artikel Tidak Ada</center>
										<?php
											}
										?>
								</div>
								<div class="col-md-4">
								<h3>Bisnis</h3>
								<hr>
										<?php
											$resArticle=$ini->query->result("SELECT title,create_on,SUBSTRING_INDEX(SUBSTRING_INDEX(text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text
												FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type in('POST_SHOP') ORDER BY create_on DESC LIMIT 20");
											if(count($resArticle)>0){
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										
											<a alt="<?php echo $app_name; ?>"   style="color:blue !important;" href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a>
											<br><?php echo $tglPostTerbaru->format('D, d M Y'); ?> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?><br>
										
										<?php
												}
										?>
										<a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_SHOP" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s">Bisnis</a>
										<?php
											}else{
										?>
										<center>Artikel Tidak Ada</center>
										<?php
											}
										?>
								</div>
							</div>

							<?
								}else{
							?>
							<div class="row">
								<div class="col-md-12"><br>
										<?php
											$query='';
											$urlBack='';
											$urlNext='';
											if(isset($_GET['src'])){
												if($_GET['src'] != ''){
													$query.=" AND UPPER(T.tag_name)=UPPER('".$_GET['src']."')";
												}
												if($urlBack!=''){
													$urlBack.='&';
												}
												if($urlNext!=''){
													$urlNext.='&';
												}
												$urlBack.='src='.$_GET['src'];
												$urlNext.='src='.$_GET['src'];
											}
											if(isset($_GET['type'])){
												if($_GET['type'] !=''){
													$query.=" AND A.post_type='".$_GET['type']."' ";
													if($urlBack!=''){
														$urlBack.='&';
													}
													if($urlNext!=''){
														$urlNext.='&';
													}
													$urlBack.='type='.$_GET['type'];
													$urlNext.='type='.$_GET['type'];
												}
											}
											$offest=0;
											$perpage=20;
											$page=1;
											if(isset($_GET['page'])){
												if($_GET['page'] !=''){
													$page=(int)$_GET['page'];
													$offest=$_GET['page']*$perpage;
													
													
												}
											}
											if($urlBack!=''){
												$urlBack.='&';
											}
											if($urlNext!=''){
												$urlNext.='&';
											}
											$urlBack.='page='.((int)$page-1);
											$urlNext.='page='.((int)$page+1);
											$countArticel=$ini->query->row("SELECT count(A.article_id) AS jum
												FROM con_article A 
												INNER JOIN con_article_tag T ON T.article_id=A.article_id WHERE A.active_flag=1 ".$query." AND A.system_flag=0 AND A.post_type in('POST_ARTICLE','POST_SHOP','POST_NEWS')")->jum/$perpage;
											$resArticle=$ini->query->result("SELECT page_image,A.title,A.create_on,SUBSTRING_INDEX(SUBSTRING_INDEX(A.text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text
												FROM con_article A
												INNER JOIN con_article_tag T ON T.article_id=A.article_id WHERE A.active_flag=1 ".$query." AND A.system_flag=0 AND A.post_type in('POST_ARTICLE','POST_SHOP','POST_NEWS') ORDER BY A.create_on DESC LIMIT ".$perpage." OFFSET ".$offest);
											if(count($resArticle)>0){
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										<div>
											<?php
											if($resArticle[$i]->page_image != null && $resArticle[$i]->page_image != ''){
											?>
												<a alt="<?php echo $app_name; ?>"  href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>"><img src="<?php echo $resArticle[$i]->page_image; ?>&w=100&h=100" style="width: 100px;float:left;margin-right:10px; border: 1px solid #ebebeb;" /></a>
											<?php
												}
											?>
											<span style="font-weight: bold;"><a alt="<?php echo $app_name; ?>"   style="color:blue !important;" href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><?php echo $resArticle[$i]->title; ?></a></span>
											<hr><span style="color:#006621;"><u><?php echo $tglPostTerbaru->format('D, d M Y'); ?></u><span> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,50)); ?><br>
										<br>
										</div><div style="clear:both;"></div>
										<?php
												}
												if(isset($_GET['page'])){
													if($_GET['page'] !='' && (int)$_GET['page']>1){
										?>
										<a alt="<?php echo $app_name; ?>"   style="float:left;" href="<?php echo base_url(); ?>article/search?<?php echo $urlBack; ?>" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s">Back</a>
										<?php
													}
												}
												if($countArticel>$page){
													?>
													<a alt="<?php echo $app_name; ?>"   style="float:right;" href="<?php echo base_url(); ?>article/search?<?php echo $urlNext; ?>" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s">Next</a>
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
							<?php
								}
							?>
                         </div>
                    </div>
               </div>


          </div>
     </div>
</section>


<!-- Contact Section -->

<section id="contact" class="parallax-section">
     <div class="container">
          <div class="row">

               <div class="col-md-6 col-sm-12">
                    <div class="contact-form">
                         <div id="contact-form">
                              <form action="#template-mo" method="post">
                                   <div class="wow fadeInUp" data-wow-delay="1s">
                                        <input name="fullname" type="text" class="form-control" id="fullname" placeholder="Your Name">
                                   </div>
                                   <div class="wow fadeInUp" data-wow-delay="1.2s">
                                        <input name="email" type="email" class="form-control" id="email" placeholder="Your Email">
                                   </div>
                                   <div class="wow fadeInUp" data-wow-delay="1.4s">
                                        <textarea name="message" rows="5" class="form-control" id="message" placeholder="Write your message..."></textarea>
                                   </div>
                                   <div class="wow fadeInUp col-md-6 col-sm-8" data-wow-delay="1.6s">
                                        <input name="submit" type="submit" class="form-control" id="submit" value="Send">
                                   </div>
                              </form>
                         </div>

                    </div>
               </div>

               <div class="col-md-3 col-sm-6">
                    <div class="background-image contact-img"></div>
               </div>

               <div class="bg-dark col-md-3 col-sm-6">
                    <div class="contact-thumb">
                         <div class="wow fadeInUp contact-info" data-wow-delay="0.6s">
                              <h3 class="color-white">Rumah Saya</h3>
                              <p>Jl. Desa No. 5 RT.07 RW. 03 Kel. Babakan Sari Kec. Kiaracondong Bandung 40283</p>
                         </div>

                         <div class="wow fadeInUp contact-info" data-wow-delay="0.8s">
                              <h3 class="color-white">Kontak.</h3>
                              <p><i class="fa fa-phone"></i> 085793482410</p>
                              <p><i class="fa fa-envelope-o"></i> <a alt="<?php echo $app_name; ?>"  href="mailto:aska.development@gmail.com">aska.development@gmail.com</a></p>
                              <p><i class="fa fa-globe"></i> <a alt="<?php echo $app_name; ?>"  href="#">company.co</a></p>
                         </div>

                    </div>
               </div>

          </div>
     </div>
</section>


<!-- Footer Section -->

<footer>
	<div class="container">
		<div class="row">

               <div class="col-md-12 col-sm-12">
                    <div class="wow fadeInUp footer-copyright" data-wow-delay="1.8s">
                         <p>Copyright &copy; 2017 Asep Kamludin
                    </div>
				<ul class="wow fadeInUp social-icon" data-wow-delay="2s">
                         <li><a alt="<?php echo $app_name; ?>"  href="#" class="fa fa-facebook"></a></li>
                         <li><a alt="<?php echo $app_name; ?>"  href="#" class="fa fa-twitter"></a></li>
                         <li><a alt="<?php echo $app_name; ?>"  href="#" class="fa fa-google-plus"></a></li>
                         <li><a alt="<?php echo $app_name; ?>"  href="#" class="fa fa-dribbble"></a></li>
                         <li><a alt="<?php echo $app_name; ?>"  href="#" class="fa fa-linkedin"></a></li>
                    </ul>
               </div>
			
		</div>
	</div>
</footer>

<!-- SCRIPTS -->

<script src="<?php echo base_url(); ?>include/home/js/jquery.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/bootstrap.min.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/jquery.parallax.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/smoothscroll.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/wow.min.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/custom.js"></script>

</body>
</html>