<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<style>
		body {
			font-family: 'Lucida Grande', 'Helvetica Neue', sans-serif;
			font-size: 13px;
			margin:0px;
			padding:0px;
		}

		#comment_form input, #comment_form textarea {
			border:1px solid #d3d6db;
			padding: 8px 10px;
			outline: 0;
		}

		#comment_form textarea {
			width: 80%;
			margin-right:100px;
		}
		
		#comment_form div {
			margin-bottom: 5px;
		}
		#comment_form{
			background-color:#f6f7f9;
			padding: 5px;
			border:1px solid #d3d6db;
			
		}
		img{
			width: 50px;
			border:1px solid #d3d6db;
			float:left;
			margin-right: 10px;
		}
		.name, .email{
			color:#365899;
			font-size: 14px;
			line-height: 1.358;
			word-break: break-word;
			word-wrap: break-word;
			font-weight: bold;
			white-space: nowrap;
			font-family: Helvetica, Arial, sans-serif;
		}
		.email{
			color:#90949c !important;
			font-weight: normal  !important;
		}
		.timer{
			color:#90949c;
			font-size: 12px;
			line-height: 1.358;
		}
	</style>
</head>
<body>
<?php
	function waktu_lalu($timestamp)
	{
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
	if(isset($_GET['url'])){
		$url=str_replace(' ','+',$_GET['url']);
		$jumComment=$ini->query->row("SELECT count(comment_id) AS jum FROM con_comment WHERE url='".$url."' AND parent_id is null")->jum;
?>
<div style="padding: 10px;border:1px solid #d3d6db;margin-top: -1px;background:white;">
	<b><?php echo $jumComment;?> Komentar</b>
</div>
<div id="comment_form" style="margin-top: -1px;">
	<form method="POST" id="form-main" action="<?php echo base_url(); ?>fn/comment/save">
		<input type="hidden" name="parent" id="parent" value="" />
		<input type="hidden" name="url" id="url" value="<?php echo $url;?>" />
		<div>
			<input type="text" name="name" id="name" value="" placeholder="Nama" required>
		</div>
		<div>
			<input type="email" name="email" id="email" value="" placeholder="Email" required>
		</div>
		<div>
			<textarea rows="3" name="comment" id="comment" placeholder="Komentar" required></textarea>
		</div>
		<div>
			<input type="submit" name="submit" onClick="javascript:save('form-main');" value="Posting" style="cursor:pointer;">
		</div>
	</form>
</div>
<?php
	$page=0;
	if(isset($_GET['page'])){
		$page=(int)$_GET['page'];
		$page=$page*10;
	}
	$comments=$ini->query->result("SELECT * FROM con_comment WHERE url='".$url."' AND parent_id is null ORDER BY create_on DESC LIMIT 10 OFFSET ".$page);
	if($comments){
?>
<div id="comment_display" style="padding: 10px;border:1px solid #d3d6db;margin-top: -1px;background:white;">
<?php
	for($i=0,$iLen=count($comments);$i<$iLen;$i++){
		$comment=$comments[$i];
		$dateOn=new DateTime($comment->create_on);
		$jumBalasan=$ini->query->row("SELECT count(comment_id) AS jum FROM con_comment WHERE parent_id=".$comment->comment_id)->jum;
?>
	<div style="margin-bottom: 10px;">
		<img src="<?php echo base_url()?>include/comment/images/no-user-image.gif">
		<span class="name"><?php echo $comment->name; ?></span> · 
		<span class="email"><?php echo $comment->email; ?></span>
		<div style="padding: 5px;">
			<?php echo $comment->comment; ?>
		</div>
		<a href="javascript: showBalas('<?php echo 'div-balas-'.$comment->comment_id; ?>');" style="color:#4267b2;text-decoration: none;">Balas</a> · 
		<span class="timer"><?php echo waktu_lalu($dateOn->format('Y-m-d H:i:s'));?></span>
	</div>
	<div style="clear:both;"></div>
	<div style="margin-bottom: 10px;">
		<div style="margin-left: 30px;padding-left: 10px;border-left: 1px dotted #d3d6db;">
<?php
	$sub_comments=$ini->query->result("SELECT * FROM con_comment WHERE url='".$url."' AND parent_id=".$comment->comment_id." ORDER BY create_on ASC");
	if($sub_comments){
		for($j=0,$jLen=count($sub_comments); $j<$jLen;$j++){
			$sub_comment=$sub_comments[$j];
			$sub_dateOn=new DateTime($sub_comment->create_on);
?>		
			<div>
				<img src="<?php echo base_url()?>include/comment/images/no-user-image.gif">
				<span class="name"><?php echo $sub_comment->name; ?></span> · 
				<span class="email"><?php echo $sub_comment->email; ?></span>
				<div style="padding: 5px;">
					<?php echo $sub_comment->comment; ?>
				</div>
				<span class="timer"><?php echo waktu_lalu($sub_dateOn->format('Y-m-d H:i:s'));?></span>
			</div>
			<div style="clear:both;"></div>
<?php
		}
	}
?>
			<div id="div-balas-<?php echo $comment->comment_id; ?>" class="balas" style=" display:none;">
				<div id="comment_form"  style="margin-top: 10px;">
					<form method="POST" id="form-<?php echo $comment->comment_id; ?>" action="<?php echo base_url(); ?>fn/comment/save">
						<input type="hidden" name="parent" id="parent" value="<?php echo $comment->comment_id; ?>" />
						<input type="hidden" name="url" id="url" value="<?php echo $url;?>" />
						<div>
							<input type="text" name="name" id="name" value="" placeholder="Nama" required>
						</div>
						<div>
							<input type="email" name="email" id="email" value="" placeholder="Email" required>
						</div>
						<div>
							<textarea rows="3" name="comment" id="comment" placeholder="Komentar" required></textarea>
						</div>
						<div>
							<input type="submit" name="submit" onClick="javascript:save('form-<?php echo $comment->comment_id; ?>');" value="Posting" style="cursor:pointer;">
							<input type="submit" name="submit" value="Sembunyikan" style="cursor:pointer;"onClick="javascript: hideBalas('<?php echo 'div-balas-'.$comment->comment_id; ?>');">
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	
<?php
	
	}
?>	
<?php if($jumComment>10){ ?>
	<div style="height: 20px;">
		<?php
			if($page !=0){
		?>
		<div style="float:left;">
			<a href="<?php echo base_url() ;?>fn/comment?url=<?php echo $url;?>&page=<?php echo (($page/10)-1);?>" style="color:#4267b2;text-decoration: none;"><< Kembali</a>
		</div>
		<?php 
			} 
			if(($jumComment/10)>=(($page/10)+1)){
		?>
		<div style="float:right;">
			<a href="<?php echo base_url() ;?>fn/comment?url=<?php echo $url;?>&page=<?php echo (($page/10)+1);?>" style="color:#4267b2;text-decoration: none;">Selanjutnya >></a>
		</div>
		<?php
			}
		?>
	</div>
</div>
<?php
}
	}
?>
	<script src="<?php echo base_url(); ?>include/home/js/jquery.js"></script>
	<script>
		function showBalas(id){
			$('.balas').hide();
			$('#'+id).fadeIn();
		}
		function hideBalas(id){
			$('#'+id).fadeOut();
		}
		function save(id){
			$('#'+id).submit();
		}
	</script>
<?php } ?>
</body>
</html>