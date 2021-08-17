<?php
defined('BASEPATH') OR exit('No direct script access allowed');
if ($this->pagesession->cek ()){
$common=$this->common;
$userId = $this->pagesession->getUser(false);
$user=$common->createQuery("SELECT A.firstName,A.lastName FROM ".$common->getModel('User')." M
				INNER JOIN M.employee A
				WHERE
				M.id=".$userId,false);
?>
<div style="background-color: white;color:black !important;">
	&nbsp;<a href="<?php echo base_url().'admin'; ?>">Admin</a> | <?php echo $user['firstName']; ?> <?php echo $user['lastName']; ?>
</div>
<?php } ?>