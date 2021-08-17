<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Seo extends CI_Controller {
	function browserconfig(){
		$string='<?xml version="1.0" encoding="utf-8"?>
			<browserconfig>
			  <msapplication>
				<tile>
				  <square70x70logo src="/vendor/images/logo_70_70.png?1"/>
				  <square150x150logo src="/app/img/logo_150_150.png?1"/>
				  <wide310x150logo src="/app/img/logo_310_150.png?1"/>
				  <square310x310logo src="/app/img/logo_310_310.png?1"/>
				  <TileColor>#ffffff</TileColor>
				</tile>
			  </msapplication>
			</browserconfig>';
		echo $string;
	}
    function sitemap(){
        $data = array();//select urls from DB to Array
		$articles=$this->db->query('SELECT title FROM con_article WHERE active_flag=1')->result();
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
		for($i=0,$iLen=count($articles); $i<$iLen;$i++){
			$data[]='artikel/'.toAscii(strtolower($articles[$i]->title)).'.html';
		}
        header("Content-Type: text/xml;charset=iso-8859-1");
		$string= "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
		$string.= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";
		$string.= "<url>";
		$string.= "	<loc>".base_url()."</loc>"; 
		$string.= "	<priority>1.0</priority>";
		$string.= "</url>";
		for($i=0,$iLen=count($data); $i<$iLen;$i++){
			$string.= "<url>";
			$string.= "	<loc>".base_url().$data[$i]."</loc>"; 
			$string.= "	<priority>1.0</priority>";
			$string.= "</url>";
		}
		$string.= "</urlset>";
		echo $string;
    }
}