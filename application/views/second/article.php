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
	if($data){
		$url_share =base_url().'article?src='.str_replace(' ','+',strtolower($data->title));
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title><?php if($data){ echo $data->title; }else{echo 'Halaman Tidak Ditemukan.';}?></title>
<?php
	$resTag=array();
		if($data){ 
			$tgl_post=new DateTime($data->create_on);
			$ini->load->library('lib/lib_html');
			
	?>
		<meta http-equiv="X-UA-Compatible" content="IE=Edge">

		<meta name="google-site-verification" content="1lZ8pF1nq_OzZQXWVI-WX2fFyDVJsMMVT9tuorakoR4" />
		<meta name="description" content="<?php echo strip_tags($ini->lib_html->limit($data->text,20));?>">
		<meta name="keywords" content="<?php echo $data->title;?>">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="language" content="id" />
		<meta content='Indonesia' name='geo.placename'/>

		<!-- Schema.org markup for Google+ -->
		<meta itemprop="name" content="<?php echo $data->title;?>">
		<meta itemprop="description" content="<?php echo $data->title;?>">
		<meta itemprop="image" content="<?php echo $data->page_image; ?>">
		<!-- Twitter Card data -->
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="<?php echo $url_share; ?>">
		<meta name="twitter:title" content="<?php echo $data->title;?>">
		<meta name="twitter:description" content="<?php echo $data->title;?>">
		<meta name="twitter:creator" content="Asep Kamaludin">
		<!-- Twitter summary card with large image must be at least 280x150px -->
		<meta name="twitter:image:src" content="<?php echo $data->page_image; ?>">

		<!-- Open Graph data for facebook-->
		<meta property="og:title" content="<?php echo $data->title;?>" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="<?php echo $url_share; ?>" />
		<meta property="og:image" content="<?php echo $data->page_image; ?>" />
		<meta property="og:description" content="<?php echo strip_tags($ini->lib_html->limit($data->text,20));?>" />
		<meta property="og:site_name" content="<?php echo $app_name; ?>" />
		<meta property="fb:app_id" content="302184056577324" />

		<meta property="article:published_time" content="<?php echo $tgl_post->format('Y-m-d H:i:s') ?>" />
		<meta property="article:modified_time" content="<?php echo $tgl_post->format('Y-m-d H:i:s') ?>" />
		<meta property="article:section" content="<?php echo $data->title;?>" />
		<meta property="article:tag" content="<?php echo $data->title;?>" />
<?php
	$resTag=$ini->query->result("SELECT tag_name FROM con_article_tag WHERE article_id=".$data->article_id);
	for($i=0,$iLen=count($resTag); $i<$iLen;$i++){
?>
		<meta property="article:tag" content="<?php echo $resTag[$i]->tag_name;?>" />

	<?php
	}}
	?>
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
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>main/index" class="smoothScroll">Beranda</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article?src=asep+kamaludin" class="smoothScroll">Profil</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_ARTICLE" class="smoothScroll">Artikel</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_NEWS" class="smoothScroll">Berita</a></li>
                    <li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=POST_SHOP" class="smoothScroll">Bisnis</a></li>
                    <!--<li><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>gallery" class="smoothScroll">Galeri</a></li>-->
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
                         <div class="section-title" style="background: #ffffff; margin-top: 100px;padding-left: 20px; border-top: 1px solid #ebebeb;padding-top: 10px;padding-right: 20px; ">
							<?php 
								if($data){
							?>
                              <h4 class="wow fadeInUp" data-wow-delay="0.3s"><a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>" title="<?php echo $app_name; ?>">Home</a> > <a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article/search?type=<?php echo $data->post_type;?>"><?php echo $data->type_name;?></a></h4>
                              <h3 style="padding: 0px !important;margin: 0px !important;" class="wow fadeInUp" data-wow-delay="0.6s"><?php echo $data->title ;?></h3>
							  <hr  style="padding: 0px !important;margin: 0px !important;"  >
							  <span style="background: url(<?php echo base_url(); ?>vendor/icon/date.png) no-repeat;padding-left: 20px;color:#808080;font-size: 10px;padding-top: 2px;padding-bottom: 2px;"><?php echo $tgl_post->format('D, d M Y'); ?></span>
								<span style="background: url(<?php echo base_url(); ?>vendor/icon/pencil.png) no-repeat;padding-left: 20px;color:#808080;font-size: 10px;padding-top: 2px;padding-bottom: 2px;"><?php echo $data->create_by; ?></span>
								<span style="background: url(<?php echo base_url(); ?>vendor/icon/find.png) no-repeat;padding-left: 20px;color:#808080;font-size: 10px;padding-top: 2px;padding-bottom: 2px;"><?php echo $data->view; ?> Views</span>
								
                              <p class="wow fadeInUp" data-wow-delay="0.9s">
							  <!--<script data-cfasync='false' type='text/javascript' src='//p229797.clksite.com/adServe/banners?tid=229797_434218_3&type=slider&size=728x90'></script>-->
							  <?php 
									echo $data->text;
									if((int)$page>1){
								?>
								<a alt="<?php echo $app_name; ?>"  style="float:left;" href="<?php echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($data->title)); ?>&page=<?php echo ((int)$page-1);?>" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s">< <?php echo (int)$page-1 ;?>/<?php echo $data->page_count ;?></a>
								<?php
									}
									if($data->page_count>((int)$page)){
								?>
								<a alt="<?php echo $app_name; ?>"  style="float:right;" href="<?php echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($data->title)); ?>&page=<?php echo ((int)$page+1);?>" class="wow fadeInUp smoothScroll section-btn btn btn-success" data-wow-delay="1.4s"><?php echo (int)$page+1 ;?>/<?php echo $data->page_count ;?> ></a>
								<?php
									}
							  ?>
							  </p><br><br><br><br><br>
								
								<?php
								// $resTag=$ini->query->result("SELECT tag_name FROM con_article_tag WHERE article_id=".$data->article_id);
								if(count($resTag)>0){
								?>
									<style>
									.i-tag > .tag:link,.i-tag > .tag:active,.i-tag > .tag:visited,.i-tag > .tag:hover{
										color:white !important;
									}
									.i-tag{
										float:left;
										padding: 2px 5px 2px 5px;
										background:#E3AE57;
										margin-left: 5px;
										margin-top: 5px;
									}
								</style>
									<div style="float:left;font-weight:bold;margin-top: 5px;">Tags :</div>
								<?
									for($i=0,$iLen=count($resTag); $i<$iLen;$i++){
								?>
								
								<div class="i-tag" style="">
									<a alt="<?php echo $app_name; ?>"   class="tag" href="<?php echo base_url().'article/tag?src='.str_replace(' ','+',strtolower($resTag[$i]->tag_name)); ?>" title="<?php echo $resTag[$i]->tag_name; ?>"><?php echo $resTag[$i]->tag_name;?></a>
								</div>
								<?php
									}
								?>
									<div style="clear:both;"></div><br>
								<?php
								}
								?>
								<style type="text/css">         
									.box->div{
										margin: 3px;
										margin-top: 0px;
										float: left;
									}         
								</style>
								<div class="box-">
									<div>
										<div class="fb-like" data-href="<?php echo $url_share ?>" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
									</div>
									<div>
										<div class="fb-share-button" data-href="<?php echo $url_share ?>" data-layout="button_count"></div>
									</div>
									<div>
										<a alt="<?php echo $app_name; ?>"  href="https://twitter.com/share" class="twitter-share-button"{count} data-via="nontonline"></a>
									</div>
									<div>          
										<script src="https://apis.google.com/js/platform.js" async defer></script>
										<div class="g-plus" data-action="share" data-annotation="bubble"></div>
									</div>
									<script>
										!function(d,s,id){
											var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
											if(!d.getElementById(id)){js=d.createElement(s);
											js.id=id;js.src=p+'://platform.twitter.com/widgets.js';
											fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
									</script>
								</div><br><br>
								
								<?php
								$resArticle=$ini->query->result("SELECT A.article_id,A.title,SUBSTRING_INDEX(SUBSTRING_INDEX(A.text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text,A.page_image,A.create_on
								FROM con_article_tag T 
                                INNER JOIN con_article A ON A.article_id=T.article_id
                                WHERE UPPER(T.tag_name) in(SELECT UPPER(T2.tag_name) 
								FROM con_article_tag T2 WHERE T2.article_id=".$data->article_id.") AND T.article_id<>".$data->article_id." group by A.article_id,A.title order by A.create_on DESC limit 4");
								if(count($resArticle)){
								?>
								<style>
									.i-terkait:link,.i-terkait:active,.i-terkait:visited,.i-terkaittag:hover{
										color:white !important;
									}
								</style>
								<div style="font-weight:bold;">Artikel Terkait :</div>
								<div class="row">
								<?php
										for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
											$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
								?>
								<div class="col-md-3"">
								<?php
									if($resArticle[$i]->page_image != null && $resArticle[$i]->page_image != ''){
								?>
									<a alt="<?php echo $app_name; ?>"  href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>"><img src="<?php echo $resArticle[$i]->page_image; ?>&w=300" style="width: 100%; border: 1px solid #ebebeb;" /></a>
								<?php
									}
								?>
									<a alt="<?php echo $app_name; ?>"  class="i-terkait" style="color:black !important;" href="<? echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a><br>
									<span style="background: url(<?php echo base_url(); ?>vendor/icon/date.png) no-repeat;padding-left: 18px;"><?php echo $tglPostTerbaru->format('D, d M Y'); ?></span> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?>
								</div>
								<?php
										}
								?>
								</div>
								<?php
									}
								?>
								<br>
								<!--
								<div id="SC_TBlock_371199" class="SC_TBlock">loading...</div> 
								<script type="text/javascript">
								  (sc_adv_out = window.sc_adv_out || []).push({
									id : "371199",
									domain : "n.ads1-adnow.com"
								  });
								</script>
								<script type="text/javascript" src="//st-n.ads1-adnow.com/js/adv_out.js"></script>
								-->
								<hr>
								<script type="application/javascript">
								function iframeLoaded() {
									  var iFrameID = document.getElementById('idIframe');
									  if(iFrameID) {
											// here you can make the height, I delete it first, then I make it again
											iFrameID.height = "";
											iFrameID.height = (iFrameID.contentWindow.document.body.scrollHeight+300) + "px";
									  }   
								  }
								</script>
								<iframe src="<?php echo base_url();?>fn/comment?url=<?php echo $url_share;?>" frameborder="0"  scrolling="no" width="100%" id="idIframe" onload="iframeLoaded()"></iframe>
								
                            <?php
								}else{
							?>
							<center><h2>Halaman Tidak Ditemukan</h3></center>
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
	<script data-cfasync='false' type='text/javascript' src='//p229797.clksite.com/adServe/banners?tid=229797_434218_3&type=slider&size=728x90'></script>
</body>
</html>