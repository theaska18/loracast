<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$res=$common->createQuery("SELECT M.title,M.postingTitle FROM ".$common->getModel('Posting')." M 
		WHERE
		M.activeFlag=true ORDER BY M.view DESC ")
		->setMaxResults(10)
		->getResult();
for($i=0,$iLen=count($res); $i<$iLen; $i++){
	$d=$res[$i];
	?>
    <li> <a href="<?php echo base_url().'article?q='.$d['postingTitle'] ;?>"><?php echo $d['title'];?></a></li>
<?php
}
?>