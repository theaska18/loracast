<?php   
if (!defined('BASEPATH')) exit('No direct script access allowed');  
function pdf($prop=array()){  
    //require_once("dompdf/dompdf_config.inc.php");  
	$ci=& get_instance();
    $config=array(
    		'html'=>'Undefined',
    		'title'=>'Undefined',
    		'paper'=>'A4',
    		'name'=>'none.pdf',
    		'type'=>'potrait',
    		'margin-top'=>15,
    		'margin-right'=>15,
    		'margin-bottom'=>15,
    		'margin-left'=>15,
    		'page-number'=>true,
			'text-bottom'=>'',
			'text-footer'=>true,
    );
    foreach($prop as $value=>$isi){
    	$config[$value]=$isi;
    }
    $ht="";
	$ci->load->library('Pdf');
	$type='P';
	if($config['type']=='landscape'){
		$type='L';
	}
	ob_start();
	$pdf = new Pdf($type, 'px', $config['paper'], true, 'UTF-8', false);
	$pdf->SetTitle($config['title']);
	$pdf->SetTopMargin($config['margin-top']);
	$pdf->SetLeftMargin($config['margin-left']);
	$pdf->SetRightMargin($config['margin-right']);
	$pdf->setFooterMargin($config['margin-bottom']);
	$pdf->SetAutoPageBreak(true);
	$font = 'helvetica';
	$fontSize = 9;
	//$pdf->SetFont($font, '', $fontSize);
	$pdf->SetAuthor('Author');
	$pdf->SetDisplayMode('real', 'default');
	$pdf->setPrintHeader(false);
	$pdf->setPrintFooter(false);
	$pdf->AddPage($type);
	
	
    //$dompdf = new DOMPDF(); 
	$html='<html>
	<head>
		<style>
				body {
					font-family: Arial,Helvetica Neue,Helvetica,sans-serif; font-size: 9px;
				}
				th{
					font-weight:bold;
				}
				.bold{
					font-weight:bold;
				}
				.left{
					text-align: left;
				}
				.right{
					text-align: right;
				}
				.center{
					text-align: center;
				}
				.border-top{
					border-top: 1px solid black;
				}
				.border-bottom{
					border-bottom: 1px solid black;
				}
				table{
	   				width: 100%;
   					font-size: 8px;
   				}
				h1 {
					font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
					font-size: 24px;
					font-style: normal;
					font-variant: normal;
					font-weight: 500;
					line-height: 26.4px;
				}
				h3 {
					font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
					font-size: 14px;
					font-style: normal;
					font-variant: normal;
					font-weight: 500;
					line-height: 15.4px;
				}
				p {
					font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
					font-size: 14px;
					font-style: normal;
					font-variant: normal;
					font-weight: 400;
					line-height: 20px;
				}
				blockquote {
					font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
					font-size: 21px;
					font-style: normal;
					font-variant: normal;
					font-weight: 400;
					line-height: 30px;
				}
				pre {
					font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
					font-size: 13px;
					font-style: normal;
					font-variant: normal;
					font-weight: 400;
					line-height: 18.5714px;
				}
    		</style>
		</head>
	<body>';
    $html.=$config['html'];
    $html.='</body></html>';
	$pdf->writeHTML($html);
	$pdf->Output($config['name'], 'I');
	
    // $dompdf->load_html($html);
	// if($config['type']=='custom'){
		// $customPaper = array(0,0,$config['width'],$config['height']);
		// $dompdf->set_paper($customPaper);
	// }else{
		// $dompdf->set_paper($config['paper'],$config['type']); 
	// }
    // $dompdf->render();  
	// $canvas = $dompdf->get_canvas();
    // $font = Font_Metrics::get_font("Arial", "normal");

	
	
	// $ci->load->library('lib/Lib_common');
	// $common=$ci->lib_common;
	
    // if($config['page-number']==true){
    	// $canvas->page_text($canvas->get_width()-$config['margin-right'], $canvas->get_height()-($config['margin-bottom']-20),"{PAGE_NUM} / {PAGE_COUNT}", $font, 8, array(0,0,0));
    // }
	// if($config['text-footer']==true){
		// if($config['text-bottom']==''){
			// $now=new DateTime();
			// $canvas->page_text(1, $canvas->get_height()-10,$ci->pagesession->get()->user_name.' | '.$common->indonesianDate($now,'j F Y',''), $font, 9, array(0,0,0));
		// }else{
			// $canvas->page_text(1, $canvas->get_height()-10,$config['text-bottom'], $font, 9, array(0,0,0));
		// }
		
	// }
	// $dompdf->stream($config['name'].".pdf", array("Attachment" => 0));
}