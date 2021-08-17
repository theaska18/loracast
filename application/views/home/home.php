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
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="<?php echo base_url(); ?>">
<head>
	<title>Asep Kamaludin</title>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">

	<meta name="google-site-verification" content="1lZ8pF1nq_OzZQXWVI-WX2fFyDVJsMMVT9tuorakoR4" />
	<meta name="description" content="Asep Kamaludin , Website Pribadi">
	<meta name="keywords" content="Asep kamaludin , Website Pribadi">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="language" content="id" />
	<meta content='Indonesia' name='geo.placename'/>

	<meta itemprop="name" content="Asep Kamaludin">
	<meta itemprop="description" content="Asep kamaludin , Website Pribadi">
	<meta itemprop="image" content="<?php echo base_url(); ?>include/home/images/image1.jpg">

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="<?php echo base_url(); ?>">
	<meta name="twitter:title" content="Asep Kamaludin">
	<meta name="twitter:description" content="Asep Kamaludin , Website Pribadi">
	<meta name="twitter:creator" content="Asep Kamaludin">
	<meta name="twitter:image:src" content="<?php echo base_url(); ?>include/home/images/image1.jpg">

	<meta property="og:title" content="Asep Kamaludin , Website Pribadi" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="<?php echo base_url(); ?>" />
	<meta property="og:image" content="<?php echo base_url(); ?>include/home/images/image1.jpg" />
	<meta property="og:description" content="Asep Kamaludin , Website Pribadi" />
	<meta property="og:site_name" content="Asep Kamaludin" />
	<meta property="fb:app_id" content="302184056577324" />

	<meta property="article:published_time" content="2013-09-17T05:59:00+01:00" />
	<meta property="article:modified_time" content="2013-09-16T19:08:47+01:00" />
	<meta property="article:section" content="Asep Kamaludin" />
	<meta property="article:tag" content="Asep Kamaludin" />

	<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/bootstrap.min.css">
	<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/animate.css">
	<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/templatemo-style.css">
	<link rel="stylesheet" href="<?php echo base_url(); ?>include/home/css/font-google.css">
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

	<div class="preloader">
		<div class="spinner">
			<span class="spinner-rotate"></span>
		</div>
	</div>

	<div class="navbar navbar-fixed-top custom-navbar" style="background-color:#fafafa !important;border-bottom:1px solid #ebebeb;" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
				</button>
				<a alt="<?php echo $app_name; ?>"  href="#"><img src="<?php echo base_url(); ?>vendor/images/18022018131017A.png" style="width:300px;"></a>
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
	<section id="home" class="parallax-section">
		<div class="container">
			<div class="row">
				<div class="col-md-6 col-sm-6">
                    <div class="home-img"></div>
				</div>
				<div class="col-md-6 col-sm-6" style="background:#fafafa !important;">
                    <div style="margin-top: 100px;background-color:#ffffff !important; border-top: 1px solid #ebebeb;padding: 20px;">
						<div class="section-title">
							<h4 class="wow fadeInUp" data-wow-delay="0.3s" style="color:#333;">Atikel Terbaru</h4>
							<?php
											$resArticle=$ini->query->result("SELECT title,create_on,SUBSTRING_INDEX(SUBSTRING_INDEX(text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text
												FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type in('POST_ARTICLE') ORDER BY create_on DESC LIMIT 8");
											if(count($resArticle)>0){
												for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
													$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
										?>
										
											<a alt="<?php echo $app_name; ?>"   style="color:#23527c !important;letter-spacing: 1px!important;" href="<?php echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><?php echo $resArticle[$i]->title; ?></a>
											<br><span style="color:#006621;"><?php echo $tglPostTerbaru->format('D, d M Y'); ?></span> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?><br>
										
										<?php
												}
										?>
										
										<?php
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
	</section>
	<section id="about" class="parallax-section">
		<div class="container">
			<div class="row">
				<div class="col-md-6 col-sm-12">
                    <div class="about-thumb">
						<div class="wow fadeInUp section-title" data-wow-delay="0.4s">
							<h1>Portofolio</h1>
							<p class="color-yellow">Pengembangan Teknologi Informasi dan Komunikasi</p>
						</div>
						<div class="wow fadeInUp" data-wow-delay="0.8s">
							<p>Teknologi Informasi adalah keahlian saya, Sebagai Tuntutan perusahaan saya memahami banyak bahasa pemroggraman.</p>
							<p>Agar bisa menyesuaikan tugas yang diberikan atasan dari Perusahaan. Berikut hasil dari pengembangan saya:</p>
							<ul>
								<li>Aplikasi SIM Rumah Sakit Medismart, bersama perusahaan PT. Nuansa Cerah Informasi.</li>
								<li>Aplikasi Pendaftaran Online, RSUD Embung Fatimah Kota Batam <a alt="<?php echo $app_name; ?>"  href='http://www.rsud.batam.go.id'>Lihat >></a>, bersama perusahaan PT. Nuansa Cerah Informasi.</li>
								<li>Aplikasi Pendaftaran Online, RSUD Soedono Kota Madiun <a alt="<?php echo $app_name; ?>"  href='http://www.pendaftaran.rssoedono.jatimprov.go.id'>Lihat >></a>, bersama perusahaan PT. Nuansa Cerah Informasi.</li>
								<li>Aplikasi Aplicares Briging BPJS Untuk Update Kamar, bersama perusahaan PT. Nuansa Cerah Informasi.</li>
							</ul>
						</div>
                    </div>
				</div>
				<div class="col-md-3 col-sm-6">
                    <div class="background-image about-img"></div>
				</div>
				<div class="bg-yellow col-md-3 col-sm-6">
                    <div class="skill-thumb">
						<div class="wow fadeInUp section-title color-white" data-wow-delay="1.2s">
							<h1>My Skills</h1>
							<p class="color-white">Photoshop . HTML CSS JS . Web Design</p>
						</div>
						<div class=" wow fadeInUp skills-thumb" data-wow-delay="1.6s">
							<strong>HTML/CSS Javascript</strong>
							<span class="color-white pull-right">90%</span>
							<div class="progress">
								<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%;"></div>
							</div>
							<strong>PHP</strong>
							<span class="color-white pull-right">90%</span>
							<div class="progress">
								<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%;"></div>
							</div>
							<strong>Java Web</strong>
							<span class="color-white pull-right">70%</span>
							<div class="progress">
								<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%;"></div>
							</div>
							<strong>Visual Basic 6</strong>
							<span class="color-white pull-right">70%</span>
							<div class="progress">
								<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%;"></div>
							</div>
							<strong>Delphi 7</strong>
							<span class="color-white pull-right">50%</span>
							<div class="progress">
								<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 80%;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section id="service" class="parallax-section">
		<div class="container">
			<div class="row">
				<div class="bg-yellow col-md-3 col-sm-6">
                    <div class="wow fadeInUp color-white service-thumb" data-wow-delay="0.8s">
						<i class="fa fa-desktop"></i>
						<h3>Interface Design</h3>
						<p class="color-white">Phasellus vulputate tellus nec tortor varius elementum. Curabitur at pulvinar ante.</p>
                    </div>
				</div>
				<div class="col-md-3 col-sm-6">
					<div class="wow fadeInUp color-white service-thumb" data-wow-delay="1.2s">
						<i class="fa fa-paper-plane"></i>
						<h3>Media Strategy</h3>
						<p class="color-white">Curabitur at pulvinar ante. Duis dui urna, faucibus eget felis eu, iaculis congue sem.</p>
                    </div>
				</div>
				<div class="bg-dark col-md-3 col-sm-6">
                    <div class="wow fadeInUp color-white service-thumb" data-wow-delay="1.6s">
						<i class="fa fa-table"></i>
						<h3>Mobile App</h3>
						<p class="color-white">Mauris convallis eros massa, vitae euismod arcu tempus ut. Quisque viverra iaculis.</p>
                    </div>
				</div>
				<div class="bg-white col-md-3 col-sm-6">
                    <div class="wow fadeInUp service-thumb" data-wow-delay="1.8s">
						<i class="fa fa-html5"></i>
						<h3>Coding</h3>
						<p>Mauris convallis eros massa, vitae euismod arcu tempus ut. Quisque viverra iaculis.</p>
                    </div>
				</div>
			</div>
		</div>
	</section>
	<section id="experience" class="parallax-section">
		<div class="container">
			<div class="row">
				<div class="col-md-6 col-sm-6">
                    <div class="background-image experience-img"></div>
				</div>
				<div class="col-md-6 col-sm-6">
                    <div class="color-white experience-thumb">
						<div class="wow fadeInUp section-title" data-wow-delay="0.8s">
							<h1>Pengalaman</h1>
							<p class="color-white">Pengalaman Kerja saya.</p>
						</div>
						<div class="wow fadeInUp color-white media" data-wow-delay="1.2s">
							<div class="media-object media-left">
								<i class="fa fa-laptop"></i>
							</div>
							<div class="media-body">
								<h3 class="media-heading">Java Web Programming <small>2013 Februari - 2015 April</small></h3>
								<p class="color-white">PT. Dream Caster Technology</p>
							</div>
						</div>
						<div class="wow fadeInUp color-white media" data-wow-delay="1.6s">
							<div class="media-object media-left">
								<i class="fa fa-laptop"></i>
							</div>
							<div class="media-body">
								<h3 class="media-heading">Web Designer <small>2015 April - Now</small></h3>
								<p class="color-white">PT. Nuansa Cerah Informasi</p>
							</div>
						</div>
                    </div>
				</div>
			</div>
		</div>
	</section>
	<section id="education" class="parallax-section">
		<div class="container">
			<div class="row">
				<div class="col-md-6 col-sm-6">
					<div class="color-white education-thumb">
						<div class="wow fadeInUp section-title" data-wow-delay="0.8s">
							<h1>Pendidikan</h1>
							<p class="color-white">Pendidikan formal saya.</p>
						</div>
						<div class="wow fadeInUp color-white media" data-wow-delay="1.2s">
							<div class="media-object media-left">
								<i class="fa fa-laptop"></i>
							</div>
							<div class="media-body">
								<h3 class="media-heading">Sekolah Menengah Kejuruan <small>2009 Juli - 2012 Juli</small></h3>
								<p class="color-white">SMK ICB CT Bandung. </p>
							</div>
						</div>
						<div class="wow fadeInUp color-white media" data-wow-delay="1.6s">
							<div class="media-object media-left">
								<i class="fa fa-laptop"></i>
							</div>
							<div class="media-body">
								<h3 class="media-heading">Sekolah Menengah Pertama <small>2006 Juli - 2009 Juli</small></h3>
								<p class="color-white">MTs Negeri 2 Kota Bandung.</p>
							</div>
						</div>
                    </div>
				</div>
				<div class="col-md-6 col-sm-6">
                    <div class="background-image education-img"></div>
				</div>
			</div>
		</div>
	</section>
	<section id="quotes" class="parallax-section">
		<div class="overlay"></div>
		<div class="container">
			<div class="row">
				<div class="col-md-offset-1 col-md-10 col-sm-12">
					<?php
						$ini->load->library('lib/lib_html');
						$resArticle=$ini->query->result("SELECT title,SUBSTRING_INDEX(SUBSTRING_INDEX(text,'<!-- pagebreak -->', 1),'<!-- pagebreak -->', -1) AS text,create_on, 
											page_image FROM con_article WHERE active_flag=1 AND system_flag=0 AND post_type not in('POST_GALLERY') ORDER BY create_on DESC LIMIT 4");
						if(count($resArticle)){
						?>
						<style>
							.i-terkait:link,.i-terkait:active,.i-terkait:visited,.i-terkaittag:hover{
								color:white !important;
								font-weight:bold !important;
							}
						</style>
						<div class="row">
						<?php
								for($i=0,$iLen=count($resArticle); $i<$iLen; $i++){
									$tglPostTerbaru=new DateTime($resArticle[$i]->create_on);
						?>
						<div class="col-md-3"">
						<?php
							if($resArticle[$i]->page_image != null && $resArticle[$i]->page_image != ''){
						?>
							<a alt="<?php echo $app_name; ?>"  href="<?php echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>"><img src="<?php echo $resArticle[$i]->page_image; ?>" style="width: 100%;" /></a>
						<?php
							}
						?>
							<a alt="<?php echo $app_name; ?>"  class="i-terkait" href="<?php echo base_url(); ?>article?src=<?php echo str_replace(' ','+',strtolower($resArticle[$i]->title)); ?>" title="<?php echo $resArticle[$i]->title; ?>"><u><?php echo $resArticle[$i]->title; ?></u></a><br>
							<?php echo $tglPostTerbaru->format('D, d M Y'); ?> - <?php echo strip_tags($ini->lib_html->limit($resArticle[$i]->text,20)); ?>
						</div>
						<?php
								}
						?>
						</div>
						<?php
							}
						?>
				</div>
			</div>
		</div>
	</section>
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
							<p><i class="fa fa-globe"></i> <a alt="<?php echo $app_name; ?>"  href="www.sikamal.com">www.sikamal.com</a></p>
						</div>
                    </div>
				</div>
			</div>
		</div>
	</section>
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
	<script src="<?php echo base_url(); ?>include/home/js/jquery.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/bootstrap.min.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/jquery.parallax.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/smoothscroll.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/wow.min.js"></script>
	<script src="<?php echo base_url(); ?>include/home/js/custom.js"></script>
	<script data-cfasync='false' type='text/javascript' src='//p229797.clksite.com/adServe/banners?tid=229797_434218_3&type=slider&size=728x90'></script>
</body>
</html>