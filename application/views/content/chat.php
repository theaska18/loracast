<html>
<head>
	<title>ayam</title>
	<script type="text/javascript" src="<?php echo base_url(); ?>vendor/jquery-2.1.4.min.js"></script>
	<script>
		(function ($, undefined) {
			$.widget("ui.adder", {
				queue: null,
				str: null,
				_init: function () {
					this.str = "aaa";
				},
				_create: function () {
					alert(this.str);
					this.str = "bbb";
					alert(this.str);
				},
				destroy: function () {
					$.Widget.prototype.destroy.call(this);
				}
			});
		} (jQuery));
		$('#testing').adder();
	</script>
</head>
<body>
dawd
<div id="testing">

</div>
</body>
</html>