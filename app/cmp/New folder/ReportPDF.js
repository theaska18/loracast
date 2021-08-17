Ext.define('App.cmp.ReportPDF',{
	extend : 'App.cmp.Window',
	title:'Report',
	maximized: true,
	autoScroll: false,
	modal:true,
	initComponent:function(){
		var $this=this;
		this.toPDF=function(){
			var param=$this.params();
			var par='session='+_session_id;
			for(var i in param){
				if(par != ''){
					par+='&';
				}
				par+=i+'='+param[i];
			}
			console.log(par);
			$this.update("<iframe style='width: 100%; height: 100%;' src='"+$this.url+"?"+par+"'></iframe>");
			$this.show();
		};
		this.callParent();
	}
})